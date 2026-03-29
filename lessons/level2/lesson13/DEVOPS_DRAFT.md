# Урок 13: Jenkins — Пайплайны как код и экосистема плагинов

Jenkins остается "швейцарским ножом" в мире CI/CD благодаря своей гибкости и огромному количеству плагинов. В этом уроке мы разберем, как развернуть Jenkins в Docker, настроить Declarative Pipeline и интегрировать его с современным стеком.

---

## 1. Сравнение: Jenkins vs GitHub Actions vs GitLab CI

| Критерий | Jenkins | GitHub Actions | GitLab CI |
| :--- | :--- | :--- | :--- |
| **Тип** | Self-hosted (требует свой сервер) | SaaS / Self-hosted | SaaS / Self-hosted |
| **Конфигурация** | Groovy DSL (Jenkinsfile) | YAML | YAML |
| **Расширяемость** | 1800+ плагинов | Marketplace Actions | Встроенные фичи + Runner |
| **Сложность** | Высокая (Maintenance) | Низкая (Managed) | Средняя |
| **Идеально для** | Сложных Enterprise-процессов | Open Source и GitHub-проектов | Полного жизненного цикла (All-in-one) |

---

## 2. Развертывание Jenkins через Docker Compose

Для надежной работы используем LTS версию Jenkins и Docker-in-Docker (DinD), чтобы Jenkins мог собирать Docker-образы.

### docker-compose.yml
```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    restart: always
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock # Для управления Docker хоста
    environment:
      - TZ=Europe/Moscow
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=true

volumes:
  jenkins_home:
```

**Запуск:** `docker-compose up -d`

---

## 3. Настройка и Плагины

### Обязательные плагины:
1. **Pipeline** (набор плагинов для работы с Jenkinsfile).
2. **Git** (интеграция с репозиториями).
3. **Docker Pipeline** (позволяет использовать Docker-контейнеры как агенты).
4. **Credentials Binding** (безопасная работа с секретами).
5. **Blue Ocean** (современный UI для визуализации пайплайнов).

### Работа с секретами (Credentials):
Никогда не хардкодьте пароли! Используйте `Manage Jenkins -> Credentials`.
- **Username with password:** для Docker Hub или Git.
- **Secret text:** для API токенов.
- **SSH Username with private key:** для деплоя на сервера.

---

## 4. Declarative Pipeline (Jenkinsfile)

Declarative Pipeline — это современный стандарт. Он более читаем и строг, чем устаревший Scripted Pipeline.

### Пример Jenkinsfile (Build -> Test -> Push)
```groovy
pipeline {
    agent any // Можно указать конкретный Docker-образ: agent { docker { image 'node:18' } }

    environment {
        DOCKER_CREDS = credentials('docker-hub-id')
        APP_NAME = "my-devops-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo 'Building application...'
                // Пример для Node.js приложения
                sh 'npm install && npm test'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def appImage = docker.build("${APP_NAME}:${env.BUILD_NUMBER}")
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-id') {
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Очистка рабочего пространства
        }
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}
```

---

## 5. Продвинутый уровень: Groovy DSL и Shared Libraries

Если у вас много проектов, не копируйте пайплайны. Используйте **Shared Libraries**.
Это отдельный репозиторий с Groovy-скриптами, которые подключаются к Jenkins и позволяют вызывать общие функции:
`standardPipeline(type: 'maven')`.

---

## 6. Антипаттерны (Как делать НЕ надо)

1. **Scripted Pipeline вместо Declarative:** Scripted Pipeline сложнее поддерживать и отлаживать. Используйте его только для очень сложной логики.
2. **Credentials в переменных окружения или коде:** Секреты должны быть только в Credentials Store.
3. **Запуск всего на Master-узле:** Всегда используйте Agent (Nodes). Master-узел предназначен только для оркестрации.
4. **Отсутствие бэкапов:** Jenkins хранит всё в папке `/var/jenkins_home`. Если она пропадет, вы потеряете всё. Настройте бэкап этой папки или используйте плагин `ThinBackup`.
5. **Игнорирование обновлений:** Устаревшие плагины — это дыры в безопасности.

---

## Резюме
Jenkins — мощный инструмент, если следовать подходу **Pipeline as Code** и минимизировать ручную настройку через UI. В следующем уроке мы разберем мониторинг этих процессов.
