# Docker Compose: Архитектура многоконтейнерных приложений

В этой статье мы разберем, как собрать полноценный стек технологий (Nginx, Flask, PostgreSQL, Redis) в единую инфраструктуру с помощью Docker Compose.

## 1. Структура проекта

```text
.
├── app/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── nginx/
│   └── nginx.conf
├── .env
├── docker-compose.yml
└── docker-compose.override.yml
```

## 2. Реализация компонентов

### Python Flask (app/app.py)
Приложение, которое взаимодействует с PostgreSQL для проверки версии БД и с Redis для инкремента счетчика посещений.

```python
import os
import time
import redis
import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)

# Redis setup
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

# Postgres setup
def get_db_connection():
    conn = psycopg2.connect(
        host='db',
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD')
    )
    return conn

@app.route('/')
def hello():
    count = get_hit_count()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT version();')
    db_version = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify({
        "message": "Hello from Flask!",
        "hits": count,
        "db_version": db_version[0]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### Dockerfile для Flask (app/Dockerfile)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### Requirements (app/requirements.txt)
```text
flask
redis
psycopg2-binary
```

### Nginx Configuration (nginx/nginx.conf)
```nginx
events {}
http {
    upstream flask_app {
        server flask:5000;
    }
    server {
        listen 80;
        location / {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Environment Variables (.env)
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret_pass
POSTGRES_DB=dev_db
```

## 3. Оркестрация: docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always

  flask:
    build: ./app
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: on-failure

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - flask
    restart: always

volumes:
  postgres_data:
```

## 4. Переопределение для разработки (docker-compose.override.yml)

Этот файл автоматически подхватывается Compose и дополняет основную конфигурацию. Идеально для монтирования кода (hot reload).

```yaml
services:
  flask:
    volumes:
      - ./app:/app
    environment:
      FLASK_ENV: development
      DEBUG: "true"
```

## 5. Разбор ключевых директив

| Директива | Описание |
| :--- | :--- |
| `image` | Указывает готовый образ из Docker Hub (например, `postgres:15-alpine`). |
| `build` | Путь к директории с `Dockerfile` для сборки собственного образа. |
| `ports` | Проброс портов: `ХОСТ:КОНТЕЙНЕР`. Позволяет достучаться до сервиса снаружи. |
| `volumes` | Монтирование папок. Бывает **именованным** (`postgres_data`) для сохранения данных БД и **bind mount** (путь к конфигу Nginx). |
| `environment` | Переменные окружения, передаваемые внутрь контейнера (часто берутся из `.env`). |
| `depends_on` | Устанавливает порядок запуска. С `condition: service_healthy` Flask не запустится, пока БД и Redis не пройдут проверку здоровья. |
| `restart` | Политика перезапуска. `always` — поднимать всегда, `on-failure` — только при ошибке. |
| `healthcheck` | Команда для проверки работоспособности сервиса "изнутри". |

## 6. Почему это важно?

Использование `depends_on` с проверкой `healthcheck` гарантирует, что ваше приложение не упадет с ошибкой "Connection Refused" при старте, так как оно будет ждать реальной готовности базы данных принимать запросы, а не просто факта запуска процесса контейнера.
