# Jenkins: пайплайны и плагины (Урок 13)

Jenkins — это «дедушка» автоматизации, который, несмотря на появление облачных альтернатив вроде GitHub Actions или GitLab CI, остается центральным инструментом в инфраструктуре крупнейших Enterprise-компаний мира. Его главная сила — в абсолютной гибкости. Если вам нужно построить пайплайн, который одновременно запускает тесты в облаке, собирает прошивку для микроконтроллера и деплоит Java-монолит в локальный дата-центр, Jenkins — ваш выбор.

В этом уроке мы пройдем путь от запуска Jenkins в изолированном Docker-контейнере до создания сложных декларативных пайплайнов с использованием общих библиотек (Shared Libraries).

---

## Jenkins в экосистеме CI/CD: Legacy vs Modern

Прежде чем переходить к практике, важно понять, как изменился Jenkins за последние 15 лет. 

### Эпоха «Legacy» (Freestyle Projects)
Раньше Jenkins настраивался исключительно через графический интерфейс. Вы заходили в веб-интерфейс, создавали «Freestyle project» и вручную заполняли поля: где лежит код, какие команды выполнить, куда отправить артефакт. 
**Проблемы этого подхода:**
- Изменения в пайплайне не версионируются (нельзя сделать `git revert` настройки).
- Сложно масштабировать: если у вас 100 микросервисов, вам нужно 100 раз вручную настраивать джобы.
- Нет прозрачности: непонятно, кто и когда изменил шаг сборки.

### Современный подход (Pipeline as Code)
Сегодня стандартом является использование **Jenkinsfile** — текстового файла в корне репозитория, который описывает весь процесс CI/CD. Это позволяет хранить логику сборки вместе с кодом приложения, проводить Code Review изменений пайплайна и легко восстанавливать инфраструктуру после сбоев.

---

## Запускаем Jenkins через Docker Compose

Для обучения и локальной разработки лучше всего запускать Jenkins в Docker. Мы будем использовать LTS (Long Term Support) версию.

### Подготовка инфраструктуры
**Важный нюанс:** официальный образ `jenkins/jenkins:lts` содержит только сам Jenkins и Java, но в нем нет команд Docker (`docker build`, `docker push`). Чтобы Jenkins мог управлять Docker-хостом, нам нужно создать свой образ на его основе.

1. Создайте `Dockerfile`:
```dockerfile
FROM jenkins/jenkins:lts-jdk17
USER root
# Установка Docker CLI
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
```

2. Создайте файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  jenkins:
    build: . # Собирает образ из Dockerfile в текущей директории
    container_name: jenkins
    restart: always
    privileged: true
    user: root # ВАЖНО: Только для обучения! В продакшене используйте группы прав.
    ports:
      - "8080:8080"   # Веб-интерфейс
      - "50000:50000" # Порт для подключения внешних агентов
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock # Проброс сокета
    environment:
      - TZ=Europe/Moscow
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=true

volumes:
  jenkins_home:
```

> **Warning:** Использование `user: root` и проброс `/var/run/docker.sock` дает контейнеру Jenkins полный контроль над вашим Docker-хостом. Это допустимо для локальной разработки, но в продакшене считается серьезной дырой в безопасности.

**Разбор конфигурации:**
1. `Agent` (Агент): Это вычислительный узел, на котором Jenkins запускает задачи. В данном случае агентом выступает сам контейнер Jenkins («мастер-узел»).
2. `jenkins_home`: Volume, где хранятся все данные. Если его удалить, вы потеряете все настройки и историю сборок.
3. `/var/run/docker.sock`: Позволяет Jenkins вызывать Docker-демона хостовой машины. Это называется Docker-outside-of-Docker (DooD).

**Запуск:**
```bash
docker build -t custom-jenkins .
docker-compose up -d
```
После запуска выполните `docker logs jenkins`, чтобы найти временный пароль администратора.

---

## Словарик терминов

Прежде чем идти дальше, закрепим базу:
- **Artifact (Артефакт):** Результат сборки (своего рода «готовый продукт»). Это может быть `.jar` файл, `.zip` архив или Docker-образ.
- **SaaS (Software as a Service):** Облачное ПО, которое не нужно устанавливать (например, GitHub Actions). Jenkins же — это Self-hosted решение.
- **Agent (Node):** Рабочая лошадка. Мастер (сервер Jenkins) раздает задачи Агентам. Агенты могут быть обычными серверами, Docker-контейнерами или даже облачными инстансами.

## Начальная настройка: плагины и Credentials

После первого входа Jenkins предложит установить «рекомендованные плагины». Соглашайтесь — это база, включающая поддержку Git, Pipeline и SSH.

### Экосистема плагинов
Плагины — это то, на чем держится Jenkins. Их более 1800. Вот те, которые вы обязаны знать:
- **Pipeline:** Основа основ. Позволяет интерпретировать Jenkinsfile.
- **Docker Pipeline:** Добавляет синтаксис `docker.image('node').inside { ... }`.
- **Git:** Интеграция с GitHub, GitLab, Bitbucket.
- **Credentials Binding:** Позволяет безопасно пробрасывать пароли и токены в переменные окружения пайплайна.
- **Blue Ocean:** Современный и красивый интерфейс для визуализации этапов сборки.
- **Slack Notification:** Для уведомлений о статусе сборки.

### Работа с секретами (Credentials)
Никогда не пишите пароли прямо в коде пайплайна. 
Перейдите в **Manage Jenkins -> Credentials**:
1. **Secret text:** Для API-токенов (например, Telegram Bot API).
2. **Username with password:** Для доступа к Docker Hub или Git-репозиториям.
3. **SSH Username with private key:** Для деплоя по SSH.

При создании секрета вы задаете ему **ID** (например, `docker-hub-creds`). Именно по этому ID вы будете обращаться к секрету в коде.

---

## Declarative Pipeline: Синтаксис и примеры

Существует два типа пайплайнов: **Scripted** (на чистом Groovy) и **Declarative**. Мы фокусируемся на **Declarative**, так как он проще, имеет строгую структуру и поддерживается визуальным редактором Blue Ocean.

### Структура Jenkinsfile

```groovy
pipeline {
    agent any // На каком узле запускать (любой свободный)

    environment {
        // Глобальные переменные
        DOCKER_REGISTRY = "my-registry.com"
    }

    stages {
        stage('Prepare') {
            steps {
                echo "Начинаем сборку..."
                // checkout scm — скачивает код из того же репозитория,
                // где лежит этот Jenkinsfile.
                checkout scm 
            }
        }

        stage('Build') {
            steps {
                sh "echo 'Здесь могла быть команда npm build или go build'"
            }
        }

        stage('Test') {
            steps {
                sh "echo 'Запуск тестов...'"
            }
        }
    }

    post {
        always {
            echo "Я выполняюсь в любом случае (успех или провал)"
            // Очистка рабочего пространства после сборки
            cleanWs()
        }
        success {
            echo "Ура! Сборка прошла успешно."
        }
        failure {
            echo "Что-то пошло не так. Проверь логи."
        }
    }
}
```

### Глубокий разбор ключевых блоков:

1. **agent**: Определяет, где будет выполняться пайплайн. 
   - `agent any`: на любом свободном исполнителе.
   - `agent { docker { image 'node:18-alpine' } }`: Jenkins сам запустит контейнер с Node.js, выполнит в нем команды и удалит его.
2. **stages**: Логические этапы. В Blue Ocean каждый `stage` будет отдельным блоком на визуальной схеме.
3. **steps**: Конкретные команды. Обычно это `sh` для Linux/macOS или `bat` для Windows.
4. **post**: Блок для действий после выполнения пайплайна. Идеально подходит для отправки уведомлений в Slack/Telegram или очистки рабочего пространства (`cleanWs()`).

---

## Реальный пример: Сборка и Push Docker-образа

Давайте создадим более сложный пайплайн, который собирает приложение, упаковывает его в Docker и пушит в реестр.

```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        DOCKER_HUB_USER = "devopsuser"
        // ID секрета из Credentials Store
        DOCKER_HUB_ID = "docker-hub-id"
    }

    stages {
        stage('Docker Build') {
            steps {
                script {
                    // Без 'def' переменная становится глобальной для всего Jenkinsfile.
                    appImage = docker.build("${DOCKER_HUB_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    // Используем ID секрета напрямую в withRegistry.
                    docker.withRegistry('', DOCKER_HUB_ID) {
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }
    }
}
```

---

## Продвинутые техники: Shared Libraries

Когда в вашей компании становится больше 10 проектов, вы замечаете, что Jenkinsfile в них копируется на 90%. Это нарушает принцип DRY (Don't Repeat Yourself). 

**Shared Libraries** позволяют вынести общую логику в отдельный Git-репозиторий.

> **Важно:** Чтобы библиотека заработала, её нужно зарегистрировать в глобальных настройках: **Manage Jenkins -> System -> Global Pipeline Libraries**. Там задается имя библиотеки (которое вы будете использовать в `@Library`) и ссылка на Git-репозиторий.

### Структура репозитория библиотеки:
```text
(root)
+- vars
|   +- standardPipeline.groovy  # Имя функции, которую будем вызывать
+- src
|   +- com/mycompany/Helper.groovy # Сложная логика на Groovy
```

### Пример `vars/standardPipeline.groovy`:
```groovy
def call(Map config = [:]) {
    pipeline {
        agent any
        stages {
            stage('Hello') {
                steps {
                    echo "Hello, ${config.name}"
                }
            }
        }
    }
}
```

### Использование в проекте:
В начале `Jenkinsfile` вы подключаете библиотеку:
```groovy
@Library('my-shared-library') _

standardPipeline(name: 'DevOps Student')
```

---

## Blue Ocean: Визуализация пайплайнов

Если классический интерфейс Jenkins кажется вам выходцем из 2004 года, установите плагин **Blue Ocean**. 

> **Примечание:** На текущий момент Blue Ocean находится в режиме поддержки (Maintenance Mode). Разработчики рекомендуют использовать классический интерфейс (который тоже активно обновляется), но для наглядной визуализации Blue Ocean всё еще очень хорош.

**Что он дает:**
- Визуальный редактор пайплайнов (Drag-and-drop).
- Наглядная индикация ошибок: вы сразу видите, на каком шаге и в какой строке упал скрипт.
- Группировка параллельных шагов.
- Удобный просмотр логов для каждого этапа в отдельности.

---

## Сравнение: Jenkins vs GitHub Actions vs GitLab CI

| Критерий | Jenkins | GitHub Actions | GitLab CI |
| :--- | :--- | :--- | :--- |
| **Хостинг** | Self-hosted (вы сами ставите сервер) | SaaS (облако GitHub) | SaaS или Self-hosted |
| **Сложность** | Высокая (нужен Jenkins Admin) | Низкая (просто YAML) | Средняя |
| **Плагины** | Огромное количество (1800+) | Marketplace (тысячи Actions) | Встроенные функции (Batteries included) |
| **Масштабирование** | Через статические/динамические агенты | GitHub-hosted runners | GitLab Runner (очень простой) |
| **Безопасность** | Зависит от вас | Высокая (Managed) | Высокая |

**Вердикт:** Jenkins — лучший для сложных, кастомных процессов внутри закрытого контура компании. GitHub Actions/GitLab CI — лучше для современных облачных микросервисов.

---

## Антипаттерны (Как делать НЕ надо)

1. **Использование Scripted Pipeline без нужды:** Декларативный стиль покрывает 95% задач и намного легче читается.
2. **Запуск сборок на мастере:** Мастер-узел должен только управлять. Тяжелые сборки должны уходить на агентов (Nodes), иначе один «тяжелый» пайплайн уронит весь Jenkins.
3. **Хранение секретов в коде:** Даже если это временный токен, используйте Credentials.
4. **Отсутствие бэкапа:** Jenkins хранит данные в файлах. Регулярно делайте бэкап папки `/var/jenkins_home` или используйте плагины для бэкапа конфигурации в Git.
5. **Плагиномания:** Не ставьте плагины «на всякий случай». Каждый плагин — это потенциальная дыра в безопасности и нагрузка на память.

---

## Резюме

Jenkins — это мощная платформа, которая при правильном приготовлении превращается в безотказный комбайн автоматизации. Главное — помнить про подход **Pipeline as Code**, использовать **Declarative Pipeline** и не забывать про безопасность.

В следующем уроке мы разберем, как мониторить состояние наших пайплайнов и настроить алертинг, чтобы узнавать о падениях раньше, чем об этом скажет заказчик.
