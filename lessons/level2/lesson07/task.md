# ТЗ для devops-writer: Урок 7 — Ansible: автоматизация конфигурации

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 7 из 15 |
| **Тема** | Ansible: автоматизация конфигурации серверов |
| **Хэштеги** | `#ansible` `#automation` `#iac` `#configuration` `#devops` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель установит Ansible, опишет inventory и запустит первые ad-hoc команды и простой playbook для настройки веб-сервера.

## Целевая аудитория
DevOps среднего уровня, знающие SSH и Linux.

## Пререквизиты
- Level 1 уроки 8, 10, 12: SSH, Bash-скрипты, Systemd

## Технический стек
- **Ansible:** 2.15+, **Python:** 3.x
- **Целевые ОС:** Ubuntu 22.04

## Требования к контенту
- [ ] Ansible vs Shell-скрипты: идемпотентность
- [ ] Архитектура: Control Node, Managed Nodes, inventory, playbook, module
- [ ] Установка Ansible на control node
- [ ] Inventory файл: ini и YAML форматы
- [ ] Ad-hoc команды: `ansible all -m ping`
- [ ] Playbook: структура, play, tasks, handlers
- [ ] Основные модули: `apt`, `copy`, `template`, `service`, `user`, `file`
- [ ] Переменные: vars, defaults, group_vars, host_vars

## Структура статьи

### H1: Ansible с нуля: автоматизируем настройку серверов
### H2: Почему Shell-скриптов не хватает
### H2: Как работает Ansible — без агентов, через SSH
### H2: Inventory: описываем наши серверы
```ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[dbservers]
db1 ansible_host=192.168.1.20 ansible_user=postgres
```
### H2: Первые ad-hoc команды
```bash
ansible webservers -m ping
ansible all -m apt -a "name=nginx state=present" --become
```
### H2: Первый playbook: устанавливаем Nginx
```yaml
- hosts: webservers
  become: true
  tasks:
    - name: Установить Nginx
      apt:
        name: nginx
        state: present
    - name: Запустить и включить Nginx
      service:
        name: nginx
        state: started
        enabled: true
```
### H2: Переменные и handlers

## KPI качества
- Читатель запустил playbook и настроил сервер
- Объяснение идемпотентности на конкретном примере
- Таблица: 10 самых используемых модулей Ansible

## Антипаттерны
- ❌ Ansible без `--check` (dry-run) перед применением в prod
- ❌ Пароли в inventory файле
- ❌ Отсутствие тегов в больших playbook
