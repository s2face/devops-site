# Ansible Roles: пишем переиспользуемый код

На начальных этапах работы с Ansible кажется удобным держать все задачи в одном файле `playbook.yml`. Однако по мере роста проекта — добавления мониторинга, логирования, баз данных и нескольких окружений (dev/staging/prod) — такой подход превращается в кошмар. В этом уроке мы разберем, как структурировать автоматизацию с помощью ролей, использовать шаблоны Jinja2 и готовую экосистему Ansible Galaxy.

## Когда один playbook перестаёт справляться

Представьте типичный "монолитный" playbook для настройки веб-сервера:

```yaml
---
- name: Setup Web Server
  hosts: webservers
  become: true
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Copy Nginx config
      copy:
        src: files/nginx.conf
        dest: /etc/nginx/nginx.conf

    - name: Install Docker
      apt:
        name: docker.io
        state: present

    - name: Start App
      shell: docker run -d -p 80:80 my-app:latest
```

**Проблемы монолита:**
1. **Сложность переиспользования:** Если вам нужен Docker на другой группе серверов, вам придется копировать куски кода.
2. **Трудности отладки:** В файле на 500+ строк легко запутаться.
3. **Отсутствие стандартизации:** Переменные, файлы и задачи перемешаны.
4. **Коллизии переменных:** Легко случайно перезаписать переменную, используемую в другой части файла.

Решение — **Ansible Roles**. Роль — это способ автоматической загрузки связанных переменных, файлов, задач и обработчиков на основе известной структуры файлов.

## Структура роли Ansible

Роль имеет строго определенную структуру папок. Ansible автоматически ищет файлы `main.yml` в каждой из них:

```text
roles/
  deploy_docker_app/
    tasks/main.yml           # Основной список задач
    handlers/main.yml        # Обработчики (например, рестарт сервисов)
    templates/               # Jinja2 шаблоны
    files/                   # Статичные файлы для копирования
    vars/main.yml            # Переменные с высоким приоритетом
    defaults/main.yml        # Переменные по умолчанию (низкий приоритет)
    meta/main.yml            # Метаданные (автор, зависимости)
```

### Разбор компонентов:
*   **tasks/main.yml**: Это сердце роли. Здесь перечисляются все действия, которые Ansible должен выполнить. Если задач становится слишком много, их можно разбить на несколько файлов (например, `install.yml`, `configure.yml`, `service.yml`) и подключать их в `main.yml` с помощью `import_tasks` или `include_tasks`.
*   **handlers/main.yml**: Сюда выносятся задачи, выполнение которых зависит от успеха других задач. Классический пример — перезагрузка Nginx после изменения конфигурационного файла. Обработчики выполняются только один раз в самом конце работы роли, даже если они были вызваны (notified) несколько раз.
*   **defaults/main.yml**: Это место для переменных по умолчанию с самым низким приоритетом. Их легко переопределить в инвентаре или в самом playbook. Здесь стоит хранить порты, пути к логам, версии пакетов.
*   **vars/main.yml**: Переменные здесь имеют высокий приоритет. Их сложнее переопределить, поэтому здесь обычно хранят константы, специфичные для операционной системы или архитектуры приложения, которые не должен менять рядовой пользователь.
*   **templates/**: Здесь лежат файлы-шаблоны Jinja2 (с расширением `.j2`). Ansible считывает их, подставляет текущие значения переменных и копирует результат на целевой хост. Это позволяет динамически генерировать конфиги для разных окружений.
*   **files/**: В этой директории хранятся статичные файлы, которые нужно просто скопировать на сервер (например, иконки, сертификаты или скрипты), без какой-либо обработки шаблонизатором.
*   **meta/main.yml**: Содержит метаданные о роли: кто автор, какая лицензия, какие операционные системы поддерживаются и, самое важное, список зависимостей от других ролей. Если ваша роль требует наличия установленного Docker, это указывается именно здесь.
*   **tests/**: (Необязательно) Содержит инвентарь и тестовый playbook для проверки работоспособности роли (например, через Molecule).

## Создание роли через ansible-galaxy init

Самый простой способ создать правильную структуру — использовать встроенную утилиту:

```bash
ansible-galaxy init roles/deploy_docker_app
```

**Пример вывода:**
```text
- Role roles/deploy_docker_app was created successfully
```

После выполнения команды в директории `roles/deploy_docker_app` появится полный скелет папок и файлов, готовых к наполнению.

## Jinja2 шаблоны — динамические конфиги

Шаблонизатор Jinja2 — это то, что превращает статичные файлы конфигурации в мощные инструменты. Вы можете адаптировать конфигурации под конкретные хосты, окружения (dev/prod) или даже версии ПО.

### Основные элементы Jinja2:
1.  **Интерполяция переменных**: `{{ nginx_port }}`. Вы можете применять фильтры, например `{{ server_name | lower }}` для приведения к нижнему регистру или `{{ db_password | default('secure_pass') }}` для установки значения по умолчанию.
2.  **Условные конструкции**: Позволяют включать или выключать блоки конфига на основе флагов.
    ```jinja2
    {% if ssl_enabled %}
    listen 443 ssl;
    ssl_certificate {{ ssl_cert_path }};
    {% endif %}
    ```
3.  **Циклы**: Удобно генерировать повторяющиеся блоки, такие как список виртуальных хостов или разрешенных IP-адресов.
    ```jinja2
    {% for upstream in backend_servers %}
    server {{ upstream }};
    {% endfor %}
    ```

**Пример сложного шаблона для Nginx:**
```jinja2
# templates/nginx.conf.j2
server {
    listen {{ nginx_port | default(80) }};
    server_name {{ server_name }};

    access_log {{ log_dir }}/{{ app_name }}.access.log;
    error_log {{ log_dir }}/{{ app_name }}.error.log;

    location / {
        proxy_pass http://{{ app_host }}:{{ app_port }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    {% if enable_ssl %}
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    {% endif %}
}
```

## Условия, циклы и теги в tasks

Внутри ролей мы используем специальные параметры для управления логикой:

### 1. `when`: Умные условия
Выполнять задачу только если условие истинно. Это особенно важно для поддержки мультиплатформенности.
```yaml
- name: Install software for Debian-based systems
  apt:
    name: htop
    state: present
  when: ansible_os_family == "Debian"

- name: Install software for RedHat-based systems
  yum:
    name: htop
    state: present
  when: ansible_os_family == "RedHat"
```

### 2. `loop`: Массовая обработка задач
`loop` позволяет итерироваться по спискам, словарям и даже результатам выполнения других задач.
```yaml
- name: Create multiple users and assign groups
  user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
    state: present
  loop:
    - { name: 'alice', groups: 'admin' }
    - { name: 'bob', groups: 'developers' }
```

### 3. `register` и `notify`: Реакция на изменения
`register` сохраняет результат выполнения задачи в переменную, которую можно использовать в условиях `when` позже. `notify` — это триггер для обработчиков.
```yaml
- name: Copy config file
  template:
    src: config.j2
    dest: /etc/app/config.conf
  notify: restart application
  register: config_file_result

- name: Debug copy result
  debug:
    msg: "Config file was changed: {{ config_file_result.changed }}"
  when: config_file_result.changed
```

### 4. `tags`: Гибкий запуск
Теги позволяют разработчикам запускать только необходимые части playbook, что значительно экономит время при отладке.
```yaml
- name: Install dependencies
  apt:
    name: "{{ item }}"
  loop: [curl, git, htop]
  tags: [install, deps]

- name: Deploy application code
  git:
    repo: 'https://github.com/example/app.git'
    dest: /var/www/app
  tags: [deploy, code]
```
Запуск: `ansible-playbook site.yml --tags deploy` пропустит установку зависимостей и сразу перейдет к обновлению кода.

## Ansible Galaxy: используем готовые роли

[Ansible Galaxy](https://galaxy.ansible.com/) — это хаб готовых ролей от сообщества. Зачем писать роль для установки PostgreSQL или Nginx с нуля, если есть проверенные решения от `geerlingguy` или других экспертов?

### Поиск и установка:
```bash
# Поиск роли
ansible-galaxy search nginx

# Установка роли
ansible-galaxy install geerlingguy.nginx
```

### Управление зависимостями через `requirements.yml`
В серьезных проектах роли из Galaxy описываются в файле `requirements.yml`:

```yaml
# requirements.yml
roles:
  - name: geerlingguy.docker
    version: 3.1.2
  - name: geerlingguy.nginx
    version: 3.1.1
```

Установка всех зависимостей одной командой:
```bash
ansible-galaxy install -r requirements.yml
## Лучшие практики при работе с ролями

Чтобы ваши роли были по-настоящему профессиональными и удобными для коллег, следуйте этим правилам:

1.  **Defaults вместо hardcode**: Никогда не вшивайте значения (пути, порты, имена пользователей) прямо в `tasks/main.yml`. Выносите их в `defaults/main.yml`. Это позволит другим инженерам использовать вашу роль без её изменения.
2.  **Идемпотентность**: Каждая задача должна быть написана так, чтобы её повторный запуск не приводил к изменениям, если система уже находится в нужном состоянии. Используйте модули Ansible (apt, template, file) вместо `shell` или `command` там, где это возможно.
3.  **Документируйте meta/main.yml**: Всегда указывайте поддерживаемые платформы и зависимости. Это критически важно при использовании вашей роли в больших проектах.
4.  **Используйте префиксы для переменных**: Чтобы избежать коллизий (когда две роли используют переменную с одинаковым именем), добавляйте имя роли в начало переменной: `nginx_port`, `docker_app_version`.
5.  **Разделяйте логику**: Одна роль — одна функция. Не пытайтесь создать "ультра-роль", которая ставит и базу данных, и веб-сервер, и систему мониторинга. Разбейте их на три независимые роли.
6.  **Проверяйте синтаксис**: Перед деплоем всегда запускайте проверку: `ansible-playbook site.yml --syntax-check`.

---

## Практический пример: роль deploy_docker_app


Создадим полноценную роль, которая деплоит Docker-приложение с использованием docker-compose.

### 1. Переменные по умолчанию (`defaults/main.yml`)
```yaml
---
app_name: my-awesome-app
app_version: latest
app_port: 8080
db_password: "change_me_in_vault"
```

### 2. Шаблон docker-compose (`templates/docker-compose.yml.j2`)
```yaml
version: '3.8'
services:
  app:
    image: "{{ app_name }}:{{ app_version }}"
    ports:
      - "80:{{ app_port }}"
    environment:
      - DB_PASS={{ db_password }}
    restart: always
```

### 3. Основные задачи (`tasks/main.yml`)
```yaml
---
- name: Ensure app directory exists
  file:
    path: "/opt/{{ app_name }}"
    state: directory
    mode: '0755'

- name: Copy docker-compose template
  template:
    src: docker-compose.yml.j2
    dest: "/opt/{{ app_name }}/docker-compose.yml"
  notify: restart docker-compose

- name: Run docker-compose
  community.docker.docker_compose_v2:
    project_src: "/opt/{{ app_name }}"
    state: present
  tags: [deploy]
```

### 4. Метаданные (meta/main.yml)
Определяем зависимости и информацию о роли.
```yaml
---
galaxy_info:
  author: devops_expert
  description: Role for deploying dockerized applications via docker-compose
  company: "YourCompany"
  license: MIT
  min_ansible_version: "2.15"
  platforms:
    - name: Ubuntu
      versions:
        - all

dependencies:
  - name: geerlingguy.docker
    src: geerlingguy.docker
```

### 5. Обработчик (handlers/main.yml)
```yaml
---
- name: restart docker-compose
  community.docker.docker_compose_v2:
    project_src: "/opt/{{ app_name }}"
    state: present
    build: always
    recreate: always
```

### Как использовать эту роль в Playbook?
Создайте файл `site.yml` в корне проекта:

```yaml
---
- name: Deploy Application
  hosts: app_servers
  become: true
  roles:
    - deploy_docker_app
```

Теперь ваша автоматизация стала модульной, чистой и готовой к масштабированию.
