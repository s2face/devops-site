# ТЗ для devops-writer: Урок 6 — Введение в Git: базовые команды

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 1 — Beginner |
| **Номер урока** | 6 из 15 |
| **Тема** | Введение в Git: базовые команды |
| **Хэштеги** | `#git` `#vcs` `#beginner` `#github` `#version-control` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель установит Git, настроит его и освоит базовый рабочий цикл: init → add → commit → push/pull.

## Целевая аудитория
Разработчики и DevOps-новички, не работавшие с системами контроля версий.

## Пререквизиты
- Урок 3: основы Bash
- Аккаунт на GitHub или GitLab

## Технический стек
- **Git:** 2.x
- **Платформы:** GitHub / GitLab
- **OS:** Ubuntu / macOS / Windows (WSL)

## Требования к контенту
- [ ] Зачем нужен VCS — проблема «final_v2_FINAL.zip»
- [ ] Установка и первичная настройка Git
- [ ] Концепции: рабочая директория, индекс (staging), репозиторий
- [ ] `git init`, `git clone`
- [ ] `git add`, `git commit`
- [ ] `git status`, `git log`, `git diff`
- [ ] `git push`, `git pull`
- [ ] `.gitignore` — что не надо трекать
- [ ] SSH-ключи для GitHub

## Структура статьи

### H1: Git с нуля: контроль версий для DevOps-инженера
### H2: Жизнь без Git — и почему это боль
### H2: Установка и настройка Git
```bash
sudo apt install -y git
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
### H2: Три состояния файла в Git
- Схема: Untracked → Staged → Committed
### H2: Первый репозиторий: от init до commit
```bash
git init myproject
cd myproject
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit"
```
### H2: Работа с удалённым репозиторием
### H2: .gitignore — самые нужные паттерны
### H2: Шпаргалка по базовым командам

## KPI качества
- Есть схема трёх состояний файла в Git
- Читатель может создать репозиторий и сделать первый push
- Объяснена разница `git add .` vs `git add -p`

## Антипаттерны
- ❌ Использование `git push --force` без объяснения опасности
- ❌ Коммиты с сообщением «fix» без описания что исправлено
- ❌ Хранение паролей и токенов в репозитории
