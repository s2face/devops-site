# ТЗ для devops-writer: Урок 2 — Docker Networking и Volumes

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 2 из 15 |
| **Тема** | Docker Networking и Volumes: глубокое погружение |
| **Хэштеги** | `#docker` `#networking` `#volumes` `#bridge` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель разберётся в сетевых драйверах Docker, научится создавать custom сети и правильно работать с данными через volumes.

## Целевая аудитория
DevOps среднего уровня, знающие Docker Compose.

## Пререквизиты
- Level 2, урок 1: Docker Compose
- Level 1, урок 9: основы сетей

## Технический стек
- **Docker:** 24.x+, сетевые драйверы: bridge, host, overlay, none

## Требования к контенту
- [ ] Сетевые драйверы Docker: bridge, host, overlay, macvlan, none
- [ ] Создание custom bridge network
- [ ] DNS-резолвинг между контейнерами по имени сервиса
- [ ] Типы volumes: named, bind mount, tmpfs
- [ ] `docker network create/inspect/ls/rm`
- [ ] `docker volume create/inspect/prune`
- [ ] Безопасность: изоляция сетей в Compose
- [ ] Overlay network для Docker Swarm (обзор)

## Структура статьи

### H1: Docker Networking и Volumes: работаем с данными и сетью
### H2: Как Docker изолирует сети — обзор драйверов
### H2: Bridge network — изоляция по умолчанию
```bash
docker network create mynet
docker run -d --network mynet --name db redis
docker run -d --network mynet --name app myapp
# app может достучаться до db по имени "db"
```
### H2: Named volumes vs Bind mounts
```bash
# Named volume (управляется Docker)
docker run -v pgdata:/var/lib/postgresql/data postgres

# Bind mount (путь на хосте)
docker run -v /home/user/data:/app/data myapp
```
### H2: Изоляция сетей в Compose
### H2: Управление и очистка volumes и сетей

## KPI качества
- Схема: контейнеры в одной bridge-сети, DNS-резолвинг
- Таблица: Named Volume vs Bind Mount vs tmpfs
- Пример Compose с несколькими изолированными сетями

## Антипаттерны
- ❌ Использование `--network host` без оснований в production
- ❌ Хранение БД-данных в bind mount без бэкапа
- ❌ Единая сеть для всех сервисов без изоляции
