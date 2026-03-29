# GitHub Actions: полный CI/CD пайплайн за один урок

Добро пожаловать в 11-й урок нашего курса для DevOps-инженеров. Сегодня мы переходим от теории контейнеризации и основ CI/CD к практике построения промышленного пайплайна с использованием **GitHub Actions (GHA)**. 

GitHub Actions — это не просто "еще один CI-инструмент". Это мощная платформа автоматизации, интегрированная непосредственно в ваш репозиторий, позволяющая описывать жизненный цикл ПО как код (Pipeline as Code) на языке YAML.

## Анатомия GitHub Actions Workflow

Прежде чем писать код, разберем основные "кирпичики" GHA:

1.  **Workflow (Рабочий процесс):** Настраиваемый автоматизированный процесс, состоящий из одной или нескольких задач (Jobs). Описывается в `.github/workflows/*.yml`.
2.  **Events (События):** Триггеры, запускающие workflow. Например: `push` в ветку, создание `pull_request`, запуск по расписанию (`schedule`) или ручной запуск (`workflow_dispatch`).
3.  **Jobs (Задания):** Набор шагов (Steps), выполняемых на одном и том же раннере (Runner). По умолчанию задания запускаются параллельно, но их можно связать зависимостями через `needs`.
4.  **Steps (Шаги):** Индивидуальные задачи внутри задания. Это могут быть shell-команды или готовые действия (**Actions**). Все шаги одного задания выполняются последовательно на одном инстансе.
5.  **Runners (Раннеры):** Серверы, на которых выполняются задания. GitHub предоставляет облачные раннеры (Hosted Runners: Ubuntu, Windows, macOS), но вы можете подключить собственные (Self-hosted Runners) для специфических нужд или безопасности.

## Workflow Triggers: когда запускать?

В GHA гибкая система триггеров:
*   `push`: Срабатывает при пуше в указанные ветки или теги.
*   `pull_request`: Запуск при открытии, обновлении или синхронизации PR.
*   `schedule`: Запуск по cron (например, ночные сборки).
*   `workflow_dispatch`: Позволяет запускать пайплайн вручную через UI GitHub с возможностью передачи входных параметров (`inputs`).

## Матрица сборки и Кэширование

### Matrix Strategy
Если вам нужно протестировать приложение на нескольких версиях языка (например, Python 3.9, 3.10, 3.11), используйте `strategy: matrix`. GHA создаст отдельное задание для каждой комбинации параметров.

### Кэширование (actions/cache)
Для ускорения пайплайна критически важно не скачивать зависимости (node_modules, pip packages) при каждой сборке. Экшн `actions/cache` позволяет сохранять и восстанавливать директории на основе хеш-суммы конфигурационных файлов (например, `requirements.txt` или `package-lock.json`).

## Secrets и Environment Variables

**Никогда не храните пароли в коде!**
*   **Secrets:** Хранятся в настройках репозитория (`Settings -> Secrets and variables -> Actions`). В логах они автоматически маскируются звёздочками `***`.
*   **Environment Variables:** Могут быть определены на уровне всего workflow, конкретного задания или шага.
*   **Best Practice:** Используйте переменные окружения для нечувствительных настроек (имена БД, URL-адреса) и секреты для токенов, ключей и паролей.

## Reusable workflows и Composite Actions

Для масштабирования и соблюдения принципа DRY (Don't Repeat Yourself) используйте:
1.  **Composite Actions:** Группировка нескольких шагов в один экшн. Подходит для повторяющихся низкоуровневых операций внутри одного репозитория.
2.  **Reusable Workflows:** Позволяют вызывать целый workflow из другого файла (даже из другого репозитория). Идеально для стандартизации CI во всей организации.

---

## Полный пайплайн: test → build → push → deploy

Ниже представлен рабочий пример пайплайна, который реализует современный цикл поставки.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch: # Позволяет ручной запуск

jobs:
  # 1. Тестирование
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11"]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Cache pip dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run Tests
        run: pytest --junitxml=reports/test-results.xml

      # Artifact Management: Сохраняем отчеты о тестах
      - name: Upload Test Results
        if: always() # Загружать даже если тесты упали
        uses: actions/upload-artifact@v3
        with:
          name: test-reports-${{ matrix.python-version }}
          path: reports/

  # 2. Сборка и публикация образа
  build-push:
    name: Build and Push Docker Image
    needs: test # Запуск только после успешных тестов
    runs-on: ubuntu-latest
    # Сборка только при пуше в main
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}

  # 3. Деплой на сервер через SSH
  deploy:
    name: Deploy to Production
    needs: build-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Executing remote ssh commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Переходим в директорию проекта
            cd /app/my-project
            # Обновляем образ
            docker pull ghcr.io/${{ github.repository }}:${{ github.sha }}
            # Перезапускаем контейнеры (предполагается наличие docker-compose.yml)
            docker compose up -d
            # Очистка старых образов
            docker image prune -f
```

### Разбор ключевых моментов:
*   **needs: test**: Этот параметр выстраивает цепочку. Если тесты упадут, сборка Docker-образа не начнется. Это предотвращает доставку битого кода в реестр.
*   **Artifacts**: Мы используем `actions/upload-artifact` для сохранения отчетов тестов. Это позволяет DevOps-инженеру изучить причины падения пайплайна постфактум.
*   **SSH Deploy**: Мы используем проверенный экшн `appleboy/ssh-action`. Он позволяет безопасно подключиться к вашему целевому серверу по SSH и выполнить набор команд для обновления приложения.

---

## Artifact Management

Артефакты — это файлы, созданные во время выполнения workflow (бинарные файлы, отчеты, логи, собранные статические сайты).
*   `actions/upload-artifact`: Сохраняет файлы в хранилище GitHub.
*   `actions/download-artifact`: Позволяет скачать файлы в другом Job того же Workflow (например, собрать фронтенд в одной задаче и упаковать его в Docker в другой).

## Best Practices (Лучшие практики)

1.  **Принцип наименьших привилегий:** Ограничивайте права `GITHUB_TOKEN` в настройках или через `permissions` в YAML.
2.  **Использование конкретных версий:** Вместо `uses: actions/checkout@main` используйте `@v4` или конкретный коммит-хеш, чтобы избежать внезапных поломок при обновлении экшнов.
3.  **Таймауты:** Устанавливайте `timeout-minutes` для шагов или заданий, чтобы зависший процесс не съел все лимиты минут GitHub Actions.
4.  **Условия (`if`):** Используйте условия, чтобы тяжелые задачи (например, деплой) выполнялись только в нужных ветках.

## Anti-patterns (Чего делать НЕЛЬЗЯ)

1.  ❌ **Деплой из PR-ветки без проверки:** Всегда проверяйте, что деплой идет только из защищенных веток (main/master/release) после прохождения всех проверок.
2.  ❌ **Secrets в открытом тексте:** Никогда не пишите API-ключи или пароли прямо в YAML-файл. Используйте GitHub Secrets.
3.  ❌ **Отсутствие `needs:`:** Запуск деплоя параллельно с тестами приведет к тому, что вы можете выкатить на прод код, который не проходит тесты.
4.  ❌ **Игнорирование кэширования:** Отсутствие кэша замедляет пайплайн в разы, тратит ресурсы и увеличивает время фидбека для разработчика.

## Заключение

GitHub Actions превращает репозиторий в полноценный центр управления производством. Правильно настроенный пайплайн с зависимостями, кэшированием и безопасным хранением секретов — это фундамент стабильности вашего проекта. 

В следующем уроке мы разберем, как мониторить наши приложения после деплоя!
