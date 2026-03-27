# ТЗ для devops-writer: Урок 13 — Введение в Docker: контейнеры vs VM

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 1 — Beginner |
| **Номер урока** | 13 из 15 |
| **Тема** | Введение в Docker: контейнеры vs виртуальные машины |
| **Хэштеги** | `#docker` `#containers` `#vm` `#devops` `#beginner` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель поймёт разницу между виртуальными машинами и контейнерами, установит Docker и запустит первые контейнеры.

## Целевая аудитория
DevOps-новички, знакомые с Linux и Git.

## Пререквизиты
- Уроки 2, 3, 11: Linux, Bash, пакетные менеджеры

## Технический стек
- **Docker Engine:** 24.x+
- **Docker Hub:** hub.docker.com
- **OS:** Ubuntu 22.04

## Требования к контенту
- [ ] VM vs Container: архитектурное сравнение (схема)
- [ ] Концепции: образ (image), контейнер, слои, registry
- [ ] Установка Docker на Ubuntu
- [ ] Базовые команды: `docker run`, `docker ps`, `docker images`
- [ ] `docker pull`, `docker stop`, `docker rm`, `docker rmi`
- [ ] Port mapping: `-p 8080:80`
- [ ] Volume mounting: `-v /host/path:/container/path`
- [ ] Environment variables: `-e`
- [ ] `docker logs`, `docker exec -it`

## Структура статьи

### H1: Docker для начинающих: контейнеры vs виртуальные машины
### H2: Проблема «у меня работает» — и как Docker её решает
### H2: VM vs Container: в чём разница?
- ASCII-схема или таблица сравнения
### H2: Установка Docker
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```
### H2: Первые шаги: запускаем контейнер
```bash
docker run hello-world
docker run -d -p 8080:80 --name mysite nginx
docker ps
curl localhost:8080
```
### H2: Управление контейнерами и образами
### H2: Полезные флаги docker run
- Таблица: флаг, назначение, пример

## KPI качества
- Схема архитектуры: Host OS → Docker Engine → Containers
- Читатель запустил nginx-контейнер и открыл его в браузере
- Таблица сравнения VM vs Container (ресурсы, изоляция, скорость)

## Антипаттерны
- ❌ Запуск контейнеров без понимания network и portmap
- ❌ `--privileged` без объяснения рисков
- ❌ Хранение данных внутри контейнера без volumes
