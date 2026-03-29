# GitHub Actions: полный CI/CD пайплайн за один урок

Добро пожаловать в мир автоматизации, где код не просто лежит в репозитории, а живет, тестируется и самостоятельно отправляется «в бой». Сегодня мы разберем GitHub Actions (GHA) — инструмент, который за несколько лет превратился из простого дополнения к GitHub в полноценную платформу промышленного уровня, потеснив таких гигантов, как Jenkins и GitLab CI.

В этом уроке мы пройдем путь от понимания базовых терминов до создания сложного, отказоустойчивого пайплайна. Мы научимся экономить время с помощью кэширования, обеспечивать совместимость через матрицы сборки и безопасно доставлять код на продакшен.

---

## Введение: Почему GitHub Actions?

До появления GHA разработчикам приходилось интегрировать сторонние сервисы (Travis CI, CircleCI) или поддерживать собственные серверы Jenkins. Это создавало «разрыв контекста»: код в одном месте, логи сборки в другом, ключи доступа в третьем. 

GitHub Actions решил эту проблему, интегрировав автоматизацию непосредственно в жизненный цикл разработки. Теперь описание инфраструктуры (Pipeline as Code) хранится в том же репозитории, а события Git напрямую управляют процессами сборки. 

### Ключевые преимущества:
1.  **Нулевая стоимость поддержки**: Для публичных репозиториев GHA бесплатен, а для приватных предоставляет щедрые лимиты. Вам не нужно администрировать серверы.
2.  **Огромная экосистема**: GitHub Marketplace содержит десятки тысяч готовых экшнов для любой задачи — от отправки сообщений в Telegram до развертывания в AWS или Kubernetes.
3.  **Гибкость конфигурации**: Использование YAML делает воркфлоу понятными для всей команды, а не только для выделенного DevOps-инженера.

---

## Анатомия GitHub Actions Workflow

Для построения эффективных процессов важно понимать внутреннее устройство платформы. Workflow — это не просто список команд, это сложная иерархическая структура.

> **Важно:** Все файлы воркфлоу должны располагаться в директории `.github/workflows/` в корне вашего репозитория и иметь расширение `.yml` или `.yaml`.

### 1. Events (События) — когда всё начинается
События определяют, что именно заставит ваш пайплайн ожить. Помимо стандартных `push` и `pull_request`, существуют специфические триггеры:
*   **workflow_run**: Позволяет запустить один воркфлоу после завершения другого (идеально для разделения CI и CD).
*   **repository_dispatch**: Позволяет запускать воркфлоу через внешний API-запрос (например, после обновления контента в CMS).
*   **label**: Запуск только при добавлении определенной метки к PR (например, `run-e2e-tests`).

### 2. Jobs (Задания) — стратегия выполнения
Задания — это основные строительные блоки. Важно помнить:
*   Каждое задание запускается в **чистой виртуальной машине**. Состояние файловой системы между заданиями не сохраняется автоматически.
*   **Параллелизм**: По умолчанию GHA старается запустить все задания одновременно. Это ускоряет общий цикл, но требует управления зависимостями через `needs`.

### 3. Runners (Раннеры) — где живет ваш код
GitHub предоставляет облачные раннеры на базе Ubuntu, Windows и macOS. Однако в крупных компаниях часто используют **Self-hosted раннеры**. 
*   **Зачем?** Для доступа к внутренним базам данных, использования GPU (для обучения нейросетей) или экономии бюджета на больших объемах сборки.
*   **Безопасность**: Self-hosted раннеры требуют осторожности, так как выполнение кода из форков в PR может скомпрометировать вашу инфраструктуру.

---

## Полный пайплайн: от тестирования до деплоя

Давайте спроектируем пайплайн, который не просто «работает», а соответствует стандартам энтерпрайз-разработки. Наше гипотетическое приложение — это микросервис на Python с Docker-контейнеризацией.

### Подготовка: Чек-лист необходимых файлов
Прежде чем запускать пайплайн, убедитесь, что в корне вашего репозитория присутствуют следующие файлы:
1. `requirements.txt` — список зависимостей Python.
2. `Dockerfile` — инструкции для сборки образа.
3. `docker-compose.yml` — конфигурация для запуска контейнеров на сервере.
4. Тесты (например, в папке `tests/`), которые сможет найти `pytest`.

### Этап 1: Подготовка и тестирование (CI)

Первая задача — убедиться, что код соответствует стандартам.

```yaml
name: Production Grade CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

# Ограничиваем права токена на уровне всего воркфлоу
permissions:
  contents: read

jobs:
  lint-and-test:
    name: 🧪 Quality Assurance
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      - name: 🐍 Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip' # Встроенное кэширование зависимостей

      - name: 📦 Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: 🔍 Lint with Flake8
        run: flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

      - name: 🚦 Run Unit Tests
        run: pytest --junitxml=reports/junit.xml

      - name: 📊 Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: junit-reports
          path: reports/junit.xml
```

### Этап 2: Сборка и безопасность (Build)

После тестов мы собираем Docker-образ. Но просто собрать его мало — нужно убедиться, что в нем нет уязвимостей.

```yaml
  build-and-scan:
    name: 🏗️ Build & Scan
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    # Дополнительные права для записи в Registry
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: 🔐 Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 🔨 Build Image
        uses: docker/build-push-action@v5
        with:
          context: .
          load: true # Загружаем образ локально для сканирования
          tags: my-app:temp

      - name: 🛡️ Scan Image for Vulnerabilities
        uses: aquasecurity/trivy-action@v0.28.0
        with:
          image-ref: 'my-app:temp'
          format: 'table'
          exit-code: '0' # Для начала ставим 0, чтобы увидеть отчет, не блокируя пайплайн. Позже можно сменить на '1'.
          severity: 'CRITICAL,HIGH'

      - name: 🚀 Push to Registry
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### Этап 3: Контролируемый деплой (CD)

Деплой — самый ответственный момент. Мы используем `appleboy/ssh-action` для удаленного управления сервером.

> **Безопасность SSH:** В секрет `SSH_PRIVATE_KEY` нужно добавить содержимое вашего **приватного** ключа (обычно это файл `~/.ssh/id_rsa`). Соответствующий ему **публичный** ключ должен быть предварительно прописан на сервере в файле `~/.ssh/authorized_keys`.

Пример минимального `docker-compose.yml`, который должен находиться на сервере (в папке `/app/projects/my-microservice`):
```yaml
services:
  web:
    image: ghcr.io/username/repository:latest # Эта строка будет обновлена через sed
    ports:
      - "80:80"
    restart: always
```

```yaml
  deploy:
    name: 🚢 Deploy to Production
    needs: build-and-scan
    runs-on: ubuntu-latest
    # Используем Environments для защиты
    environment: production
    steps:
      - name: 🔑 Executing remote ssh commands
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            cd /app/projects/my-microservice
            echo "Updating image to ${{ github.sha }}..."
            # Команда sed заменяет тег образа на актуальный SHA коммита.
            # ВНИМАНИЕ: это регулярное выражение заменяет все вхождения 'image:'. 
            # Если в docker-compose.yml несколько сервисов, используйте более точный regex или специализированные инструменты (например, yq).
            sed -i "s|image:.*|image: ghcr.io/${{ github.repository }}:${{ github.sha }}|g" docker-compose.yml
            docker compose pull
            docker compose up -d
            docker image prune -f
            echo "Deployment successful!"
```

---

## Кэширование и ускорение пайплайна

В GHA вы платите либо временем (бесплатные минуты), либо деньгами. Кэширование — ваш лучший друг.

### Механика кэширования
Когда вы используете `actions/cache`, GitHub сохраняет архив ваших файлов (например, `node_modules` или `.venv`) в своем облачном хранилище. 

**Ключи кэша (Keys):**
Важно правильно называть ключи. Если вы используете `key: ${{ runner.os }}-build`, то кэш никогда не обновится, даже если вы добавили новую библиотеку. Правильный подход — использовать хеш файла зависимостей:
`key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}`.

### Оптимизация Docker-кэша
Многие забывают, что Docker-слои тоже можно кэшировать в GHA. Используйте тип кэша `gha`:

```yaml
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```
Это позволит Docker скачивать только измененные слои прямо из внутреннего хранилища GitHub, что сокращает время сборки образа с 5 минут до 30 секунд.

---

## Матрица тестов — мощь параллелизма

Матричная стратегия (`matrix strategy`) позволяет запускать одно и то же задание с разными параметрами. Это незаменимо для Open Source проектов и крупных библиотек.

### Продвинутый пример матрицы:
```yaml
strategy:
  fail-fast: false # Не отменять другие задания, если одно упало
  max-parallel: 4 # Ограничение нагрузки на раннеры
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node-version: [16, 18, 20]
    include:
      - os: ubuntu-latest
        node-version: 20
        experimental: true # Добавляем флаг только для одной комбинации
    exclude:
      - os: windows-latest
        node-version: 16 # Исключаем устаревшую комбинацию
```

---

## Secrets, Environments и Безопасность

Безопасность в CI/CD — это не только скрытие паролей, но и контроль доступа.

### GitHub Secrets
Секреты хранятся в зашифрованном виде. Чтобы их добавить, перейдите в:
`Settings -> Secrets and variables -> Actions -> New repository secret`.

*   **GITHUB_TOKEN**: Генерируется автоматически для каждого запуска пайплайна. Его не нужно создавать вручную, он доступен по умолчанию.
*   **Защита**: Секреты не передаются в воркфлоу, запущенные из форков (защита от кражи ключей через PR от посторонних лиц).
*   **Маскировка**: Если вы случайно сделаете `echo $MY_SECRET`, в логах вы увидите `***`.

### Принцип наименьших привилегий (Permissions)
По умолчанию `GITHUB_TOKEN` может иметь широкие права (зависит от настроек репозитория). В рамках безопасности критически важно ограничивать его права до минимума, необходимого для конкретного воркфлоу или даже джоба. Это называется **Принципом наименьших привилегий**.

Для этого используется секция `permissions`. Если вы явно указываете хотя бы одно разрешение, все остальные сбрасываются в `none`.

**Пример безопасной настройки прав:**
```yaml
permissions:
  contents: read      # Чтение кода (нужно для checkout)
  packages: write     # Запись в GitHub Container Registry (GHCR)
  id-token: write     # Требуется для OIDC-авторизации (например, в AWS/GCP)
  pull-requests: write # Если пайплайн должен оставлять комментарии в PR
```

**Рекомендация:** Указывайте `permissions` на уровне всего воркфлоу, чтобы гарантировать безопасность для всех его задач по умолчанию.

### Environments (Окружения)
Это киллер-фича GitHub для CD. Вы можете создать окружение `production` и настроить:
1.  **Required Reviewers**: Деплой не начнется, пока лид команды не нажмет кнопку «Одобрить» в интерфейсе GitHub.
2.  **Wait Timer**: Задержка перед деплоем.
3.  **Deployment Branches**: Разрешить деплой в это окружение только из ветки `main`.

---

## Reusable Workflows и модульность

Если у вас 20 микросервисов, и вы копируете один и тот же YAML файл в каждый — вы совершаете ошибку. Принципы DRY (Don't Repeat Yourself) применимы и к DevOps.

### Reusable Workflows
Это полноценные воркфлоу, которые можно "вызывать" из других файлов. Они позволяют переиспользовать целые цепочки заданий (jobs) между разными репозиториями, обеспечивая единый стандарт CI/CD в организации.

### Composite Actions
Если Reusable Workflows — это "шаблоны целых пайплайнов", то **Composite Actions** — это способ сгруппировать несколько шагов (steps) в одно переиспользуемое действие.

**Когда использовать Composite Actions:**
*   **Устранение дублирования:** Если в разных заданиях (jobs) или воркфлоу вы повторяете одну и ту же последовательность шагов (например, установку специфического окружения и логин в проприетарное хранилище).
*   **Локальные экшны:** Вы можете создать такой экшн прямо в своем репозитории (например, в папке `.github/actions/setup-my-env/`), чтобы не загромождать основной YAML-файл.
*   **Абстракция:** Позволяет скрыть сложную логику скриптов за простым интерфейсом параметров.

**Пример создания Composite Action (`.github/actions/setup-python-env/action.yml`):**
```yaml
name: 'Setup Python Environment'
description: 'Install Python, dependencies and setup cache'
inputs:
  python-version:
    description: 'Version of Python'
    required: true
    default: '3.11'
runs:
  using: "composite"
  steps:
    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: ${{ inputs.python-version }}
    - name: Cache dependencies
      uses: actions/cache@v4
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    - name: Install dependencies
      shell: bash
      run: pip install -r requirements.txt
```

**Использование в основном Workflow:**
```yaml
steps:
  - uses: actions/checkout@v4
  - name: Prepare environment
    uses: ./.github/actions/setup-python-env/
    with:
      python-version: '3.10'
```

---

## Отладка и мониторинг

Что делать, если пайплайн упал, а логи молчат?

1.  **Debug Logging**: Включите секреты `ACTIONS_STEP_DEBUG` и `ACTIONS_RUNNER_DEBUG` со значением `true`, чтобы увидеть расширенный вывод каждой системной команды.
2.  **Интерактивная отладка**: Используйте экшн `mxschmitt/action-tmate`. Он приостанавливает выполнение и дает вам SSH-ссылку для входа прямо в консоль раннера.
3.  **Локальная отладка с `act`**: Чтобы не тратить лимиты минут и быстрее проверять YAML-конфиги, установите инструмент [act](https://github.com/nektos/act). Он позволяет запускать GitHub Actions прямо на вашем компьютере.
4.  **Artifacts**: Всегда сохраняйте логи приложений и отчеты о тестах.

---

## Лучшие практики (Best Practices)

1.  **Используйте фиксированные версии**: Вместо `actions/checkout@main` пишите `actions/checkout@v4`. Это защитит вас от внезапных изменений в коде экшна.
2.  **Устанавливайте таймауты**: `timeout-minutes: 15` для заданий спасет ваш бюджет от зависших процессов.
3.  **Соблюдайте иерархию**: Тесты → Сборка → Деплой. Никогда не деплойте то, что не прошло проверку.
4.  **Минимизируйте `run` шаги**: Если есть качественный официальный экшн для задачи — используйте его.
5.  **Ограничивайте права токена**: Всегда используйте секцию `permissions` для `GITHUB_TOKEN`. Это предотвратит компрометацию всего репозитория, если один из сторонних экшнов окажется вредоносным.

---

## Заключение

GitHub Actions превратил CI/CD из сложной инженерной задачи в доступный и понятный процесс. Мы изучили, как строить цепочки заданий, управлять безопасностью, ускорять сборку и масштабировать автоматизацию на всю организацию. 

Помните: идеальный пайплайн — это тот, о котором разработчики не вспоминают, пока он не спасет их от критического бага в продакшене. 

В следующем уроке мы погрузимся в мир Kubernetes и узнаем, как GHA может управлять деплоем в облачные кластеры!
