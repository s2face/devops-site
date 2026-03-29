# GitLab CI/CD: .gitlab-ci.yml от А до Я

GitLab CI/CD — это мощный инструмент автоматизации жизненного цикла разработки ПО, встроенный непосредственно в GitLab. Центральным элементом этой системы является файл `.gitlab-ci.yml`, который описывает конвейер (pipeline). В этой статье мы разберем структуру этого файла, лучшие практики и продвинутые техники для Intermediate DevOps инженеров.

---

## 1. Архитектура и GitLab Runner

Прежде чем писать код, нужно понять, где он будет исполняться. GitLab CI/CD использует **GitLab Runner** — агент, который забирает задания из очереди и выполняет их.

### Установка и регистрация Runner (Docker Executor)
Для изоляции окружений чаще всего используется Docker-исполнитель.

**Пример установки в Docker:**
```bash
docker run -d --name gitlab-runner --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest
```

**Регистрация:**
```bash
docker exec -it gitlab-runner gitlab-runner register \
  --url "https://gitlab.com/" \
  --registration-token "YOUR_TOKEN" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --description "docker-runner"
```

---

## 2. Анатомия .gitlab-ci.yml

### Stages (Этапы)
Определяют последовательность выполнения. Если `stages` не указаны, GitLab использует стандартные: `.pre`, `build`, `test`, `deploy`, `.post`.

### Jobs (Задания)
Минимальная единица конфигурации. Задания внутри одной стадии выполняются параллельно.

### Variables (Переменные)
Позволяют избежать дублирования и хардкода.
*   **Глобальные:** доступны всем заданиям.
*   **Локальные:** ограничены одним заданием.

**Важно:** Никогда не храните секреты (пароли, ключи) в репозитории. Используйте **Settings -> CI/CD -> Variables** в интерфейсе GitLab.

---

## 3. Практический пример: Full .gitlab-ci.yml

```yaml
stages:
  - build
  - test
  - release
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG
  CACHE_KEY: ${CI_COMMIT_REF_SLUG}

# Шаблон для переиспользования логики
.docker_setup:
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

build_job:
  extends: .docker_setup
  stage: build
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE

unit_tests:
  stage: test
  image: node:18
  script:
    - npm install
    - npm test
  artifacts:
    when: always
    paths:
      - coverage/
    expire_in: 1 week

deploy_staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

deploy_production:
  stage: deploy
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual # Обязательный ручной аппрув для продакшена
  allow_failure: false
```

---

## 4. Глубокое погружение в механизмы

### Artifacts vs Cache
*   **Cache:** Используется для ускорения сборки (например, `node_modules`). Не гарантирует сохранность между пайплайнами.
*   **Artifacts:** Используются для передачи результатов между стадиями (бинарные файлы, отчеты). Сохраняются в GitLab и доступны для скачивания.

### Rules и Workflow
`rules` пришли на смену `only/except` и позволяют гибко управлять запуском заданий на основе веток, тегов или переменных.

### GitLab Container Registry
Интегрированное хранилище образов. Используйте предопределенные переменные `$CI_REGISTRY`, `$CI_REGISTRY_IMAGE`, `$CI_REGISTRY_USER` для бесшовной аутентификации.

---

## 5. Конфигурация в масштабе: include и extends

Для больших проектов важно соблюдать принцип DRY (Don't Repeat Yourself).

*   **extends:** Позволяет копировать настройки из скрытых заданий (начинаются с точки).
*   **include:** Позволяет подключать внешние YAML-файлы (локальные, из других репозиториев или по URL).

```yaml
include:
  - project: 'my-group/ci-templates'
    file: '/templates/security-scan.yml'
```

---

## 6. Защита процессов и Approval Rules

В GitLab Premium/Ultimate можно настроить **Merge Request Approvals**, но даже в Free версии важно использовать:
1.  **Protected Branches:** Запрет пуша напрямую в `main`/`master`.
2.  **Protected Variables:** Переменные, доступные только в защищенных ветках.
3.  **Environment Protection:** Ограничение круга лиц, имеющих право нажать кнопку `manual deploy`.

---

## 7. GitLab CI/CD vs GitHub Actions

| Фича | GitLab CI/CD | GitHub Actions |
| :--- | :--- | :--- |
| **Определение** | YAML в корне (.gitlab-ci.yml) | YAML в .github/workflows/ |
| **Runner** | Собственный бинарник (Go) | Runner (C#) |
| **Переиспользование** | includes, extends, templates | Actions из Marketplace, Composite Actions |
| **Интеграция** | Глубокая (Registry, K8s, Security) | Отличная (через Actions) |

---

## 8. Антипаттерны (Чего делать НЕЛЬЗЯ)

1.  **Пайплайн без тестов:** Сборка и деплой без проверки `test` стадии превращают CI/CD в "Continuous Disaster".
2.  **Секреты в коде:** Пароли в `.gitlab-ci.yml` — это прямая дорога к компрометации системы. Используйте Masked/Protected Variables.
3.  **Авто-деплой на прод без контроля:** Полная автоматизация — это круто, но критические изменения должны проходить через `when: manual` или Approval Gates.
4.  **Использование `latest` тегов для образов:** Всегда фиксируйте версии базовых образов для воспроизводимости сборки.

## Резюме
GitLab CI/CD — это не просто запуск скриптов, а полноценный инструмент управления качеством и доставкой кода. Начните с простых стадий и постепенно внедряйте `artifacts`, `cache` и `rules` для оптимизации ваших процессов.