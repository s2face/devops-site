# ТЗ для devops-writer: Урок 1 — Docker Compose

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 1 из 15 |
| **Тема** | Docker Compose: многоконтейнерные приложения |
| **Хэштеги** | `#docker` `#compose` `#microservices` `#yaml` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель научится описывать многоконтейнерные приложения в docker-compose.yml, запускать стек сервисов одной командой и управлять зависимостями между контейнерами.

## Целевая аудитория
DevOps-специалисты, знающие основы Docker (Level 1).

## Пререквизиты
- Level 1, уроки 13–14: Docker basics, Dockerfile

## Технический стек
- **Docker Compose:** v2 (`docker compose`)
- **Стек примера:** Nginx + Python Flask + PostgreSQL + Redis

## Требования к контенту
- [ ] Проблема: запуск нескольких контейнеров вручную
- [ ] Структура docker-compose.yml: version, services, volumes, networks
- [ ] Основные директивы: image, build, ports, volumes, environment, depends_on, restart
- [ ] `docker compose up -d`, `down`, `logs`, `exec`, `ps`
- [ ] Переменные через `.env` файл
- [ ] Named volumes vs bind mounts в Compose
- [ ] Healthcheck для зависимостей
- [ ] Override файлы: docker-compose.override.yml

## Структура статьи

### H1: Docker Compose: управляем несколькими контейнерами
### H2: Проблема ручного запуска контейнерного стека
### H2: Анатомия docker-compose.yml
```yaml
services:
  web:
    build: .
    ports: ["8080:5000"]
    environment:
      - DATABASE_URL=postgresql://user:pass@db/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s

volumes:
  postgres_data:
```
### H2: Управление стеком через CLI
### H2: .env файл — внешние переменные
### H2: Override файлы: dev vs production

## KPI качества
- Полный рабочий стек (web + db + cache) в docker-compose.yml
- Объяснение `depends_on` с healthcheck
- Читатель запустил `docker compose up -d` и получил работающее приложение

## Антипаттерны
- ❌ Хардкод паролей в docker-compose.yml
- ❌ Игнорирование healthcheck для depends_on
- ❌ `version: '3'` без понимания что это устарело
