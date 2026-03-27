# ТЗ для devops-writer: Урок 13 — Оптимизация Docker-образов

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 13 из 15 |
| **Тема** | Оптимизация Docker-образов: размер и безопасность |
| **Хэштеги** | `#docker` `#security` `#optimization` `#distroless` `#trivy` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель оптимизирует Docker-образы до минимального размера, сканирует их на уязвимости с Trivy и освоит distroless и scratch базовые образы.

## Целевая аудитория
Senior DevOps / Platform Engineer.

## Пререквизиты
- Level 1 урок 14: Dockerfile basics, Level 3 урок 6: K8s безопасность

## Технический стек
- **Docker BuildKit**, **Trivy**, **Hadolint**, **Snyk**, **Distroless (Google)**

## Требования к контенту
- [ ] Почему размер образа важен: скорость деплоя, attack surface
- [ ] Анализ слоёв: `docker history`, `dive`
- [ ] Multi-stage build: компиляция vs runtime
- [ ] Базовые образы: alpine, slim, distroless, scratch
- [ ] .dockerignore: что исключать
- [ ] BuildKit кэш: `--mount=type=cache`
- [ ] Сканирование образов: Trivy, hadolint для Dockerfile
- [ ] SBOM (Software Bill of Materials): что это и зачем

## Структура статьи

### H1: Оптимизация Docker-образов: маленькие и безопасные
### H2: Зачем оптимизировать — реальные цифры
- Таблица: python:3.11 (1.01GB) vs slim (130MB) vs alpine (50MB) vs distroless (20MB)
### H2: Анализируем слои с dive
### H2: Multi-stage build для Go-приложения
```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o server .

# Stage 2: Runtime
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
USER nonroot:nonroot
ENTRYPOINT ["/server"]
```
### H2: Сканируем образ на уязвимости с Trivy
```bash
trivy image myapp:latest
trivy image --severity HIGH,CRITICAL myapp:latest
```
### H2: Hadolint: линтер для Dockerfile
### H2: SBOM и provenance: цепочка доверия образа

## KPI качества
- Сравнение размера до и после оптимизации (конкретные числа)
- Пример distroless образа для Go сервиса
- Интеграция Trivy в CI/CD пайплайн

## Антипаттерны
- ❌ `FROM ubuntu:latest` для production
- ❌ Запуск контейнера от root
- ❌ Секреты в слоях образа (даже если удалены в следующем RUN)
