# Ansible с нуля: автоматизируем настройку серверов

## Почему Shell-скриптов не хватает?

В начале пути системного администрирования или DevOps-инженер часто полагается на Bash-скрипты. Однако при росте инфраструктуры возникают проблемы:
1. **Отсутствие идемпотентности**: Скрипт `mkdir /var/www/html` выдаст ошибку, если директория уже существует. Вам придется добавлять проверки `if [ ! -d ... ]`.
2. **Сложность управления парком серверов**: Запуск скрипта на 50 серверах требует обвязки в виде циклов `for` и SSH-команд.
3. **Читаемость**: Bash-скрипты быстро превращаются в "лапшу" из условий и регулярок.

### Идемпотентность на примере
**Идемпотентность** — это свойство операции, при котором повторный запуск дает тот же результат, что и первый, не меняя состояние системы, если оно уже соответствует желаемому.

| Операция | Shell-скрипт (не идемпотентен) | Ansible (идемпотентен) |
| :--- | :--- | :--- |
| Создание юзера | `useradd bob` (ошибка, если bob есть) | `user: name=bob state=present` (пропустит, если есть) |
| Установка пакета | `apt-get install nginx` (попытка переустановки) | `apt: name=nginx state=present` (ничего не сделает, если уже стоит) |

---

## Как работает Ansible — без агентов, через SSH

Ansible — это **Agentless** система. Вам не нужно устанавливать специальное ПО на целевые серверы (Managed Nodes). Достаточно:
1. **Control Node**: Ваш компьютер или сервер управления с установленным Ansible и Python.
2. **Managed Nodes**: Целевые серверы с установленным Python и доступным SSH.

### Архитектура:
- **Inventory**: Список серверов.
- **Modules**: Маленькие программы, которые Ansible отправляет на серверы для выполнения задач.
- **Playbooks**: YAML-файлы, описывающие желаемое состояние системы.

---

## Установка Ansible на Control Node (Ubuntu 22.04)

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install -y ansible
```
Проверка версии: `ansible --version`

---

## Inventory: описываем наши серверы

Inventory-файл говорит Ansible, какими серверами управлять.

### Формат INI (`hosts.ini`)
```ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[dbservers]
db1 ansible_host=192.168.1.20 ansible_user=postgres

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

### Формат YAML (`inventory.yml`)
```yaml
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.1.10
        web2:
          ansible_host: 192.168.1.11
    dbservers:
      hosts:
        db1:
          ansible_host: 192.168.1.20
          ansible_user: postgres
```

---

## Первые ad-hoc команды

Ad-hoc команды полезны для быстрых задач "здесь и сейчас".

1. **Проверить связь со всеми серверами**:
   ```bash
   ansible all -m ping
   ```
2. **Установить Nginx на группу webservers**:
   ```bash
   ansible webservers -m apt -a "name=nginx state=present" --become
   ```
   *`--become` — аналог sudo.*
3. **Узнать аптайм**:
   ```bash
   ansible all -a "uptime"
   ```

---

## Первый playbook: устанавливаем Nginx

Playbook — это инструкция "как должен выглядеть сервер". Создадим `nginx_setup.yml`:

```yaml
---
- name: Настройка веб-серверов Nginx
  hosts: webservers
  become: true
  tasks:
    - name: Установка Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Копирование кастомной страницы index.html
      copy:
        content: "<h1>Hello from Ansible!</h1>"
        dest: /var/www/html/index.html
        mode: '0644'

    - name: Запуск и включение автозагрузки Nginx
      service:
        name: nginx
        state: started
        enabled: true
```

Запуск:
```bash
ansible-playbook -i hosts.ini nginx_setup.yml
```

---

## Переменные и Handlers

### Использование переменных
Переменные позволяют делать плейбуки гибкими. Их можно определять в нескольких местах:

1. **В самом Playbook** (секция `vars`):
```yaml
- hosts: webservers
  vars:
    http_port: 80
```

2. **В папках `group_vars/` и `host_vars/`**:
Это лучший способ организации переменных для больших проектов. Ansible автоматически подхватывает файлы из этих папок, если они лежат рядом с inventory-файлом.
- `group_vars/webservers.yml` — переменные для всех хостов в группе `webservers`.
- `host_vars/web1.yml` — переменные только для хоста `web1`.

**Пример структуры проекта:**
```text
.
├── inventory.ini
├── group_vars/
│   ├── all.yml          # Переменные для всех
│   └── webservers.yml   # Переменные для группы webservers
├── host_vars/
│   └── web1.yml         # Переменные для конкретного хоста
└── site.yml             # Основной playbook
```

### Handlers (Обработчики)
Хендлеры выполняются только в том случае, если задача сообщила об изменениях (`changed`). Это идеально для перезапуска сервисов после правки конфигов.

```yaml
  tasks:
    - name: Скопировать конфиг Nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

---

## Топ-10 самых используемых модулей Ansible

| Модуль | Описание | Пример использования |
| :--- | :--- | :--- |
| `apt` | Управление пакетами (Debian/Ubuntu) | `apt: name=git state=present` |
| `copy` | Копирование файлов на сервер | `copy: src=file.txt dest=/tmp/` |
| `template` | Копирование файлов с поддержкой Jinja2 переменных | `template: src=config.j2 dest=/etc/conf` |
| `service` | Управление системными службами (systemd) | `service: name=ssh state=restarted` |
| `file` | Управление правами, симлинками, директориями | `file: path=/data state=directory` |
| `lineinfile` | Поиск и замена строки в файле | `lineinfile: path=/etc/hosts line='1.1.1.1 dns'` |
| `user` | Управление пользователями | `user: name=deploy groups=sudo` |
| `shell` | Выполнение произвольных shell-команд | `shell: echo "Hello" > /tmp/hello` |
| `git` | Клонирование репозиториев | `git: repo=https://github.com/.. dest=/src` |
| `debug` | Вывод отладочной информации | `debug: var=ansible_facts` |

---

## Антипаттерны: как делать не надо

1. **❌ Ansible без `--check` (dry-run) перед применением в prod.**
   Всегда проверяйте, что собирается сделать Ansible, с помощью флага `-C` или `--check`.
2. **❌ Пароли и секреты в открытом виде в inventory файле.**
   Используйте **Ansible Vault** для шифрования чувствительных данных.
3. **❌ Отсутствие тегов в больших playbook.**
   Если в плейбуке 100 задач, а вам нужно запустить только одну, без тегов (`tags`) вам придется ждать выполнения всего списка.
4. **❌ Использование `shell` модуля вместо нативных модулей.**
   Если есть модуль `apt`, используйте его, а не `shell: apt-get install...`. Модуль `shell` не гарантирует идемпотентность "из коробки".
5. **❌ Игнорирование `ansible-lint`.**
   Не проверять синтаксис и лучшие практики — путь к ошибкам в будущем.
