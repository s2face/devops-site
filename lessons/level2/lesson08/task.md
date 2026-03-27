# ТЗ для devops-writer: Урок 8 — Ansible Playbooks и роли

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 8 из 15 |
| **Тема** | Ansible Playbooks и роли: структурируем автоматизацию |
| **Хэштеги** | `#ansible` `#roles` `#playbook` `#galaxy` `#devops` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель научится структурировать Ansible-код в роли, использовать Ansible Galaxy и создаст роль для деплоя Docker-приложения.

## Целевая аудитория
DevOps, знающие базовый Ansible (урок 7).

## Пререквизиты
- Level 2 урок 7: Ansible basics

## Технический стек
- **Ansible:** 2.15+, **Ansible Galaxy**, Jinja2

## Требования к контенту
- [ ] Проблема монолитного playbook
- [ ] Структура роли: tasks, handlers, templates, defaults, vars, files, meta
- [ ] Создание роли через `ansible-galaxy init`
- [ ] Jinja2 шаблоны в Ansible: `{{ variable }}`, условия, циклы
- [ ] `when`, `loop`, `register`, `notify`, `tags`
- [ ] Ansible Galaxy: поиск и установка готовых ролей
- [ ] `requirements.yml` для управления зависимостями ролей
- [ ] Пример: роль `deploy_docker_app`

## Структура статьи

### H1: Ansible Roles: пишем переиспользуемый код
### H2: Когда один playbook перестаёт справляться
### H2: Структура роли Ansible
```
roles/
  deploy_docker_app/
    tasks/main.yml
    handlers/main.yml
    templates/docker-compose.j2
    defaults/main.yml
    vars/main.yml
    meta/main.yml
```
### H2: Создание роли через ansible-galaxy init
### H2: Jinja2 шаблоны — динамические конфиги
```jinja2
# templates/nginx.conf.j2
server {
    listen {{ nginx_port }};
    server_name {{ server_name }};
    location / {
        proxy_pass http://{{ app_host }}:{{ app_port }};
    }
}
```
### H2: Условия, циклы и теги в tasks
### H2: Ansible Galaxy: используем готовые роли

## KPI качества
- Читатель создал роль и вызвал её из playbook
- Пример Jinja2 шаблона конфига с переменными
- Команды ansible-galaxy с примерами вывода

## Антипаттерны
- ❌ Всё в tasks/main.yml без разделения на файлы
- ❌ Хардкод значений в tasks вместо defaults
- ❌ Роли без `meta/main.yml` (зависимости не объявлены)
