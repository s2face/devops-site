# ТЗ для devops-writer: Урок 11 — GitHub Actions: CI/CD пайплайн

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 11 из 15 |
| **Тема** | GitHub Actions: построение CI/CD пайплайна |
| **Хэштеги** | `#github-actions` `#cicd` `#pipeline` `#devops` `#automation` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель создаст полноценный CI/CD пайплайн на GitHub Actions: тесты → сборка Docker-образа → публикация в реестр → деплой на сервер.

## Целевая аудитория
DevOps, знающие Git, Docker и основы CI/CD.

## Пререквизиты
- Level 1 урок 15: введение в CI/CD, Level 2 урок 3: Docker Registry

## Технический стек
- **GitHub Actions**, **Docker**, **SSH deploy**

## Требования к контенту
- [ ] Workflow, Events, Jobs, Steps, Runners
- [ ] Матрица сборки (matrix strategy)
- [ ] Кэширование зависимостей (`actions/cache`)
- [ ] Secrets и Environment Variables
- [ ] Reusable workflows и Composite Actions
- [ ] Деплой через SSH (appleboy/ssh-action)
- [ ] Artifacts: сохранение артефактов сборки
- [ ] Workflow triggers: push, PR, schedule, workflow_dispatch

## Структура статьи

### H1: GitHub Actions: полный CI/CD пайплайн за один урок
### H2: Анатомия GitHub Actions Workflow
### H2: Полный пайплайн: test → build → push → deploy
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
      - run: pip install -r requirements.txt && pytest

  build-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

  deploy:
    needs: build-push
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: devops
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull ghcr.io/${{ github.repository }}:${{ github.sha }}
            docker compose up -d
```
### H2: Кэширование и ускорение пайплайна
### H2: Матрица тестов — несколько версий Python/Node

## KPI качества
- Полный working workflow (test + build + deploy)
- Объяснение `needs` и зависимостей между jobs
- Best practices для Github Actions Secrets

## Антипаттерны
- ❌ Деплой из PR-ветки без проверки
- ❌ Secrets в workflow-файле открытым текстом
- ❌ Отсутствие `needs:` — параллельный деплой без тестов
