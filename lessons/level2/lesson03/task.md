# ТЗ для devops-writer: Урок 3 — Docker Registry

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 3 из 15 |
| **Тема** | Docker Registry: хранение и дистрибуция образов |
| **Хэштеги** | `#docker` `#registry` `#harbor` `#cicd` `#images` |
| **Объём** | 1800–2200 слов |

## Цель урока
Читатель развернёт приватный Docker Registry, настроит аутентификацию и интегрирует его с CI/CD пайплайном.

## Целевая аудитория
DevOps среднего уровня.

## Пререквизиты
- Level 1 урок 14: Dockerfile, Level 2 урок 1: Docker Compose

## Технический стек
- **Docker Registry:** registry:2 (official), **Harbor** (обзор)
- **Облачные реестры:** GitHub Container Registry (ghcr.io), AWS ECR, GitLab Registry

## Требования к контенту
- [ ] Зачем приватный реестр: безопасность, скорость, контроль
- [ ] Развёртывание docker.io/library/registry:2 через Compose
- [ ] Настройка TLS и Basic Auth
- [ ] Push/pull образов в приватный реестр
- [ ] Harbor: обзор возможностей (vulnerability scan, RBAC)
- [ ] Облачные реестры: GitHub GHCR, AWS ECR — сравнение
- [ ] Интеграция реестра в GitHub Actions/GitLab CI

## Структура статьи

### H1: Приватный Docker Registry: храним образы безопасно
### H2: Зачем не хватает Docker Hub
### H2: Разворачиваем registry:2 на своём сервере
```yaml
services:
  registry:
    image: registry:2
    ports: ["5000:5000"]
    volumes:
      - registry_data:/var/lib/registry
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
```
### H2: Push и pull из приватного реестра
### H2: Harbor — enterprise-grade реестр
### H2: Облачные реестры: когда что выбирать

## KPI качества
- Читатель запустил приватный реестр и залил в него образ
- Сравнительная таблица: self-hosted registry vs GHCR vs ECR
- Пример GitHub Actions workflow с push в GHCR

## Антипаттерны
- ❌ Реестр без TLS и аутентификации
- ❌ Использование `latest` тега в production
- ❌ Не чистить старые образы (disk full)
