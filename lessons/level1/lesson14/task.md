# ТЗ для devops-writer: Урок 14 — Первый Dockerfile

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 1 — Beginner |
| **Номер урока** | 14 из 15 |
| **Тема** | Первый Dockerfile: сборка и запуск приложения |
| **Хэштеги** | `#docker` `#dockerfile` `#image` `#build` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель напишет Dockerfile для Python/Node.js приложения, соберёт образ, запустит контейнер и опубликует образ на Docker Hub.

## Целевая аудитория
DevOps-новички после урока 13.

## Пререквизиты
- Урок 13: Docker basics, аккаунт Docker Hub

## Технический стек
- **Docker:** 24.x+, **Python:** 3.11-slim или **Node.js:** 18-alpine

## Требования к контенту
- [ ] Основные инструкции: FROM, RUN, COPY, WORKDIR, ENV, EXPOSE, CMD, ENTRYPOINT
- [ ] Разница CMD vs ENTRYPOINT
- [ ] Слои образа и кэширование
- [ ] Оптимизация порядка инструкций, .dockerignore
- [ ] Multi-stage build для уменьшения размера образа
- [ ] `docker build`, `docker tag`, `docker push` на Docker Hub

## Структура статьи

### H1: Пишем Dockerfile: упаковываем приложение в контейнер
### H2: Основные инструкции Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```
### H2: Слои и кэш — ускоряем сборку
### H2: .dockerignore — исключаем лишнее
### H2: Multi-stage build: уменьшаем финальный образ
### H2: Публикуем образ на Docker Hub
```bash
docker build -t myapp:1.0 .
docker tag myapp:1.0 username/myapp:1.0
docker push username/myapp:1.0
```

## KPI качества
- Готовый Dockerfile для Flask или Express приложения
- Сравнение размера образа: без multi-stage vs с multi-stage
- Объяснение каждой инструкции

## Антипаттерны
- ❌ `FROM ubuntu:latest` вместо slim/alpine образа
- ❌ Секреты в ENV в Dockerfile
- ❌ Отсутствие .dockerignore
