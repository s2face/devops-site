# ТЗ для devops-writer: Урок 12 — GitLab CI/CD

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 12 из 15 |
| **Тема** | GitLab CI/CD: .gitlab-ci.yml от А до Я |
| **Хэштеги** | `#gitlab` `#cicd` `#pipeline` `#runner` `#devops` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель настроит GitLab CI/CD пайплайн с нуля: установит GitLab Runner, напишет .gitlab-ci.yml с stages и задеплоит приложение.

## Целевая аудитория
DevOps среднего уровня, знающие основы CI/CD.

## Пререквизиты
- Level 1 урок 15, Level 2 урок 11: CI/CD концепции

## Технический стек
- **GitLab CE/EE или gitlab.com**, **GitLab Runner**, **Docker executor**

## Требования к контенту
- [ ] Структура .gitlab-ci.yml: stages, jobs, rules, variables
- [ ] Установка и регистрация GitLab Runner (Docker executor)
- [ ] Artifacts и cache в GitLab CI
- [ ] Environments и Manual deployments
- [ ] GitLab Container Registry
- [ ] Include и extends: переиспользование конфигурации
- [ ] Protected branches и approval rules
- [ ] Сравнение GitLab CI vs GitHub Actions

## Структура статьи

### H1: GitLab CI/CD: полный гайд по .gitlab-ci.yml
### H2: Установка GitLab Runner
### H2: Первый .gitlab-ci.yml
```yaml
stages:
  - test
  - build
  - deploy

variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

test:
  stage: test
  image: python:3.11-slim
  script:
    - pip install -r requirements.txt
    - pytest --junitxml=report.xml
  artifacts:
    reports:
      junit: report.xml

build:
  stage: build
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE .
    - docker push $IMAGE
  only:
    - main

deploy:
  stage: deploy
  environment: production
  script:
    - ssh deployer@$SERVER "docker pull $IMAGE && docker compose up -d"
  when: manual
  only:
    - main
```
### H2: Artifacts, cache и environments
### H2: GitLab vs GitHub Actions: что выбрать

## KPI качества
- Полный .gitlab-ci.yml с пояснением каждой секции
- Объяснение предопределённых переменных CI_*
- `when: manual` для деплоя в production

## Антипаттерны
- ❌ Пайплайн без стадии test
- ❌ Credentials в .gitlab-ci.yml вместо CI/CD Variables
- ❌ Auto-деплой в production без approval
