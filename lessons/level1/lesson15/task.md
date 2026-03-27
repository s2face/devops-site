# ТЗ для devops-writer: Урок 15 — Введение в CI/CD

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 1 — Beginner |
| **Номер урока** | 15 из 15 |
| **Тема** | Введение в CI/CD: что такое конвейер |
| **Хэштеги** | `#cicd` `#pipeline` `#automation` `#devops` `#github-actions` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель поймёт принципы CI/CD, различие между Continuous Integration, Continuous Delivery и Continuous Deployment, и создаст первый простой пайплайн на GitHub Actions.

## Целевая аудитория
DevOps-новички, завершившие уроки по Git и Docker.

## Пререквизиты
- Уроки 6–7: Git, Урок 13–14: Docker

## Технический стек
- **GitHub Actions**
- **Docker Hub**
- **YAML** для описания пайплайна

## Требования к контенту
- [ ] CI vs CD vs CD — три понятия, одна аббревиатура
- [ ] Проблема ручного деплоя: «работает у меня»
- [ ] Анатомия CI/CD пайплайна: trigger → build → test → deploy
- [ ] GitHub Actions: workflow файл, events, jobs, steps
- [ ] Первый workflow: lint + test + docker build
- [ ] Секреты в GitHub Actions (Secrets)
- [ ] Обзор альтернативных систем: GitLab CI, Jenkins, CircleCI

## Структура статьи

### H1: CI/CD с нуля: автоматизируем сборку и деплой
### H2: Что такое CI, CD и CD (Delivery vs Deployment)
- Схема: Code → Build → Test → Deploy
### H2: Пайплайн — конвейер от кода до продакшна
### H2: GitHub Actions: первый workflow
```yaml
name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Run tests
        run: docker run myapp:${{ github.sha }} pytest
```
### H2: Секреты и переменные окружения
### H2: Результат: что умеет ваш первый пайплайн
### H2: Что дальше — анонс Level 2

## KPI качества
- Полный рабочий workflow файл с объяснением каждой строки
- Схема пайплайна от push до деплоя
- Сравнительная таблица: GitHub Actions, GitLab CI, Jenkins

## Антипаттерны
- ❌ Деплой напрямую из main без тестов
- ❌ Хардкод секретов в YAML файле
- ❌ Пайплайн без стадии тестирования
