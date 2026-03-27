# ТЗ для devops-writer: Урок 13 — Jenkins: пайплайны и плагины

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 13 из 15 |
| **Тема** | Jenkins: пайплайны и плагины |
| **Хэштеги** | `#jenkins` `#cicd` `#pipeline` `#groovy` `#devops` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель установит Jenkins в Docker, создаст Declarative Pipeline как код (Jenkinsfile) и настроит интеграцию с Git и Docker.

## Целевая аудитория
DevOps, знающие CI/CD концепции и Docker.

## Пререквизиты
- Level 1 урок 15, Level 2 уроки 1, 11: CI/CD, Docker Compose

## Технический стек
- **Jenkins LTS**, **Docker**, **Groovy** (Declarative Pipeline DSL)

## Требования к контенту
- [ ] Jenkins в экосистеме CI/CD (legacy vs modern)
- [ ] Запуск Jenkins через Docker Compose
- [ ] Начальная настройка: плагины, credentials, agents
- [ ] Declarative Pipeline vs Scripted Pipeline
- [ ] Jenkinsfile: pipeline, agent, stages, steps, post
- [ ] Blue Ocean UI (обзор)
- [ ] Shared Libraries — переиспользование Groovy-кода
- [ ] Jenkins vs GitHub Actions vs GitLab CI — итоговое сравнение

## Структура статьи

### H1: Jenkins: настраиваем CI/CD как профи
### H2: Запускаем Jenkins через Docker Compose
```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts
    ports: ["8080:8080", "50000:50000"]
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
```
### H2: Declarative Jenkinsfile
```groovy
pipeline {
  agent any
  environment {
    DOCKER_IMAGE = "myapp:${BUILD_NUMBER}"
  }
  stages {
    stage('Test') {
      steps {
        sh 'pytest tests/'
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE} ."
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh "docker compose up -d"
      }
    }
  }
  post {
    failure {
      slackSend message: "Build failed: ${BUILD_URL}"
    }
  }
}
```
### H2: Credentials и плагины
### H2: Jenkins vs GitHub Actions vs GitLab CI

## KPI качества
- Полный Jenkinsfile с пояснениями
- Jenkins запущен и работает через Docker
- Таблица сравнения трёх CI/CD систем

## Антипаттерны
- ❌ Scripted Pipeline без веской причины
- ❌ Credentials через environment переменные вместо Jenkins Credentials
- ❌ Jenkins без backup jenkins_home
