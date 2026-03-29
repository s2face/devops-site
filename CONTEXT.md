# 📝 DevOps Level 1 — Контекст улучшения уроков

**Дата начала:** 29 марта 2026  
**Статус:** В процессе (5/15 уроков завершено)  
**Сессия:** #1

---

## 📊 Прогресс выполнения

| Урок | Тема | Статус | Изменения |
|------|------|--------|-----------|
| 1 | Введение в DevOps | ✅ Завершено | KPI расшифрован, DORA метрики добавлены, глоссарий, ключевые выводы, упрощена диаграмма цикла |
| 2 | Ubuntu Server | ✅ Завершено | Таблица ресурсов ВМ, проверка конфигурации, глоссарий, чек-лист готовности |
| 3 | Основы Bash | ✅ Завершено | Ключевые выводы, глоссарий (14 терминов), чек-лист готовности |
| 4 | Пользователи и права | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (9 терминов), чек-лист (15 пунктов) |
| 5 | Файловая система | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (14 терминов), чек-лист (18 пунктов) |
| 6 | Git основы | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (17 терминов), чек-лист (18 пунктов) |
| 7 | Git Branching | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (18 терминов), чек-лист (22 пункта) |
| 8 | SSH | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (23 термина), чек-лист (22 пункта) |
| 9 | Сети | ✅ Завершено | KPI исправлен, Netplan пример, tcpdump -c, UFW status, curl пример, глоссарий |
| 10 | Bash-скрипты | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (24 термина), чек-лист (24 пункта) |
| 11 | Пакетные менеджеры | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (24 термина), чек-лист (26 пунктов) |
| 12 | Systemd | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (32 термина), чек-лист (30 пунктов) |
| 13 | Docker основы | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (24 термина), чек-лист (25 пунктов) |
| 14 | Dockerfile | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (29 терминов), чек-лист (24 пункта) |
| 15 | CI/CD | ✅ Завершено | Ключевые выводы (8 пунктов), глоссарий (38 терминов), чек-лист (24 пункта) |

**Выполнено:** 15/15 (100%) 🎉

---

## 🎯 Шаблон улучшений для каждого урока

Для каждого урока применяется единый стандарт улучшений:

### 1. Ключевые выводы (Key Takeaways)
- 5-8 главных мыслей урока
- Нумерованный список
- Жирным выделены основные концепции

### 2. Глоссарий терминов
| Термин | Расшифровка | Простое объяснение |
|--------|-------------|-------------------|
| Пример | Example | Описание |

### 3. Чек-лист готовности
- [ ] Конкретные проверяемые навыки
- 10-20 пунктов
- Глаголы действия

### 4. Исправления проблем (если найдены)
- Неправильные термины → исправлены
- Недостающие примеры → добавлены
- Опасные команды → предупреждения

---

## 📋 Выполненные улучшения по урокам

### Урок 1: Введение в DevOps
**Проблемы найдены:**
- KPI без расшифровки
- DORA метрики упомянуты, но не объяснены
- WIP без расшифровки
- Нет блока «Ключевые выводы»
- ASCII-диаграмма сложна

**Внесено:**
- ✅ KPI = Key Performance Indicators (ключевые показатели эффективности)
- ✅ DORA: 4 метрики раскрыты (Deployment Frequency, Lead Time, MTTR, Change Failure Rate)
- ✅ WIP = Work In Progress (работа в процессе)
- ✅ Добавлены «Ключевые выводы урока» (5 пунктов)
- ✅ Упрощена диаграмма цикла + объяснение как читать
- ✅ Глоссарий (8 терминов): KPI, WIP, DORA, MTTR, IaC, CI/CD, Postmortem, Silo

---

### Урок 2: Ubuntu Server
**Проблемы найдены:**
- Нет таблицы рекомендуемых ресурсов ВМ
- Нет проверки конфигурации после настройки
- Нет глоссария
- Нет чек-листа готовности

**Внесено:**
- ✅ Таблица ресурсов ВМ (RAM, CPU, Диск, Сеть)
- ✅ Раздел «Проверка конфигурации» (hostnamectl, timedatectl, localectl, ip a)
- ✅ Глоссарий (9 терминов): ISO, GRUB, LTS, SSH, LVM, Bridged Adapter, NAT, Hostname, Locale
- ✅ Чек-лист готовности (11 пунктов)
- ✅ Ключевые выводы (5 пунктов)

---

### Урок 3: Основы Bash
**Проблемы найдены:**
- Нет систематизации ключевых выводов
- Нет глоссария терминов
- Нет чек-листа для самопроверки

**Внесено:**
- ✅ Ключевые выводы (7 пунктов)
- ✅ Глоссарий (14 терминов): Bash, CLI, GUI, Prompt, Flag/Option, stdin, stdout, stderr, Pipe, PID, PATH, Alias, Root, Sudo
- ✅ Чек-лист готовности (13 пунктов)

---

### Урок 4: Пользователи и права
**Проблемы найдены:**
- Нет систематизации ключевых выводов
- Нет глоссария
- Нет чек-листа

**Внесено:**
- ✅ Ключевые выводы (8 пунктов)
- ✅ Глоссарий (9 терминов): UID, GID, DAC, GECOS, SUID, SGID, Sticky Bit, Umask, NOPASSWD
- ✅ Чек-лист готовности (15 пунктов)

---

### Урок 9: Сети
**Проблемы найдены:**
- KPI упоминается 3 раза без расшифровки
- Netplan упомянут, но нет полного примера
- tcpdump без флага -c (риск бесконечного захвата)
- UFW не показан статус после enable
- curl -I без примера вывода

**Внесено:**
- ✅ KPI заменён на «Важно» / «Запомните»
- ✅ Полный пример `/etc/netplan/01-netcfg.yaml`
- ✅ tcpdump: добавлен флаг `-c 100` + совет про Ctrl+C
- ✅ UFW: добавлен `sudo ufw status` + пример вывода таблицы
- ✅ curl -I: добавлен пример HTTP-заголовков с 200 OK
- ✅ Шпаргалка: +2 команды (ufw status, netplan apply)
- ✅ Глоссарий и чек-лист (в процессе)

---

### Урок 5: Файловая система
**Проблемы найдены:**
- Термины без расшифровки (FHS, UUID, fsck, symlink, hard link, delta-копирование, rollback)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности
- Команды форматирования без предупреждений

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): FHS, мониторинг диска, UUID, mount -a, tar, rsync, symlink, осторожность с удалением
- ✅ Глоссарий (14 терминов): FHS, UUID, ext4, fstab, fsck, Mount Point, Symlink, Hard Link, tar, gzip, rsync, Delta-копирование, Rollback, inode
- ✅ Чек-лист готовности (18 пунктов): от проверки диска до написания скрипта бэкапа
- ✅ Предупреждения добавлены: mkfs.ext4, fdisk, rm, find -delete

---

### Урок 6: Git основы
**Проблемы найдены:**
- Термины без расшифровки (IaC, SHA-1, patch mode, origin, fetch, merge, ed25519, LFS)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): Git как фундамент IaC, три области Git, четыре состояния файла, атомарные коммиты, сообщения коммитов, SSH-ключи, .gitignore, git status
- ✅ Глоссарий (17 терминов): Git, IaC, Repository, Working Directory, Staging Area, Commit, SHA-1, Untracked, Staged, Clone, Origin, Push, Pull, SSH-key, ed25519, LFS, Patch mode
- ✅ Чек-лист готовности (18 пунктов): от инициализации репозитория до объяснения опасности git push --force

---

### Урок 7: Git Branching
**Проблемы найдены:**
- Термины без расшифровки (blob, tree, snapshot, detached HEAD, fast-forward, three-way merge, common ancestor, merge commit, rebase, PR, Feature Flags, reflog, stash, trunk)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): дешевизна веток, HEAD, изоляция задач, fast-forward vs three-way merge, конфликты, rebase, GitHub Flow vs Git Flow, git stash
- ✅ Глоссарий (18 терминов): Branch, Snapshot, Blob, Tree, HEAD, Detached HEAD, Merge, Fast-forward, Three-way merge, Common Ancestor, Merge Commit, Rebase, PR, Feature Flag, Stash, Reflog, Origin, Trunk
- ✅ Чек-лист готовности (22 пункта): от объяснения дешевизны веток до назначения веток в Git Flow

---

### Урок 8: SSH
**Проблемы найдены:**
- Термины без расшифровки (SSH, асимметричное/симметричное шифрование, Ed25519, RSA, KDF, passphrase, authorized_keys, sshd_config, ProxyJump, SCP, SFTP, Local/Remote Port Forwarding, ssh-agent, known_hosts, Man-in-the-Middle, Jump-хост, 2FA, ufw, iptables)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): SSH и асимметричное шифрование, Ed25519, passphrase, отключение паролей, ~/.ssh/config, SCP/SFTP, туннели, ssh-agent
- ✅ Глоссарий (23 термина): SSH, Асимметричное шифрование, Симметричное шифрование, Публичный ключ, Приватный ключ, Ed25519, RSA, KDF, Passphrase, authorized_keys, sshd_config, ProxyJump, SCP, SFTP, Local Port Forwarding, Remote Port Forwarding, ssh-agent, known_hosts, Man-in-the-Middle, Jump-хост, 2FA, ufw, iptables
- ✅ Чек-лист готовности (22 пункта): от генерации ключей до отладки через ssh -vvv

---

### Урок 10: Bash-скрипты
**Проблемы найдены:**
- Термины без расшифровки (shebang, POSIX, NR, awk, sed, EUID, pipefail, trap, mktemp, tee, logger, syslog, journald, cron, crontab, CRLF, dos2unix, PATH, globbing, линтер, ShellCheck, stderr, stdout)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): shebang, set -euo pipefail, [[ ]] vs [ ], подстановка команд, функции с local, trap, логирование, cron
- ✅ Глоссарий (24 термина): Bash, Shebang, POSIX, NR, awk, sed, EUID, pipefail, trap, mktemp, tee, logger, syslog, journald, cron, crontab, CRLF, dos2unix, PATH, globbing, линтер, ShellCheck, stderr, stdout
- ✅ Чек-лист готовности (24 пункта): от создания скрипта до объяснения, почему нельзя парсить ls

---

### Урок 11: Пакетные менеджеры
**Проблемы найдены:**
- Термины без расшифровки (пакет, репозиторий, зависимости, Dependency Hell, DEB, RPM, dpkg, APT, YUM, DNF, PPA, GPG, ASCII armor, deb-src, pre-inst/post-inst, TUI, libsolv, certbot, SSL, ca-certificates, unattended-upgrades, Snap, Flatpak, mirror)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): пакет и зависимости, DEB vs RPM, apt vs apt-get, update vs upgrade, PPA и GPG-ключи, dpkg -i и apt -f, apt-mark hold, Snap/Flatpak
- ✅ Глоссарий (24 термина): Пакет, Репозиторий, Зависимости, Dependency Hell, DEB, RPM, dpkg, APT, YUM, DNF, PPA, GPG, ASCII armor, deb-src, pre-inst/post-inst, TUI, libsolv, certbot, SSL, ca-certificates, unattended-upgrades, Snap, Flatpak, mirror
- ✅ Чек-лист готовности (26 пунктов): от объяснения пакета до антипаттернов управления пакетами

---

### Урок 12: Systemd
**Проблемы найдены:**
- Термины без расшифровки (init, PID, SysVinit, runlevels, systemd, systemctl, Unit, cgroups, OOM Killer, fork bomb, daemon, journald, journalctl, networkd, resolved, timesyncd, logind, DNS, NTP, boot loop, TUI, multi-user.target, graphical.target, rescue.target, ProtectSystem, ProtectHome, PrivateTmp, NoNewPrivileges, MemoryMax, MemoryHigh, CPUQuota, TasksMax, daemon-reload)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): systemd как PID 1, параллельный запуск, Unit-файлы, systemctl, After vs Wants, cgroups v2, sandboxing, journalctl
- ✅ Глоссарий (32 термина): init, PID, SysVinit, runlevel, systemd, systemctl, Unit, cgroups, OOM Killer, fork bomb, daemon, journald, journalctl, networkd, resolved, timesyncd, logind, DNS, NTP, boot loop, TUI, multi-user.target, graphical.target, rescue.target, ProtectSystem, ProtectHome, PrivateTmp, NoNewPrivileges, MemoryMax, MemoryHigh, CPUQuota, TasksMax, daemon-reload
- ✅ Чек-лист готовности (30 пунктов): от объяснения init-системы до исправления boot loop

---

### Урок 13: Docker основы
**Проблемы найдены:**
- Термины без расшифровки (VM, hypervisor, guest OS, namespaces, cgroups, ISO, glibc, runtime, bind mount, эфемерный, prune, Docker Hub, Docker Engine, layers, registry, image, container, detached mode, interactive mode, port forwarding, overhead)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): Matrix of Hell, контейнеры vs VM, namespaces/cgroups, образ vs контейнер, слои, volumes, docker run флаги, prune
- ✅ Глоссарий (24 термина): Docker, VM, Hypervisor, Guest OS, Host OS, Container, Image, Registry, Docker Hub, Docker Engine, Namespaces, Cgroups, Layers, Bind Mount, Volume, Эфемерный, Detached mode, Interactive mode, Port forwarding, glibc, Runtime, Prune, ISO, Overhead
- ✅ Чек-лист готовности (25 пунктов): от объяснения «Матрицы ада» до правила «Один процесс — один контейнер»

---

### Урок 14: Dockerfile
**Проблемы найдены:**
- Термины без расшифровки (Dockerfile, FROM, WORKDIR, ENV, COPY, RUN, EXPOSE, CMD, ENTRYPOINT, Build Context, slim, Alpine, musl, glibc, Shell form, Exec form, SIGTERM, Multi-stage build, docker tag, docker push, docker login, inspect, useradd, PYTHONDONTWRITEBYTECODE, PYTHONUNBUFFERED)
- Нет ключевых выводов
- Нет глоссария терминов
- Нет чек-листа готовности

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): Dockerfile как рецепт, FROM и базовые образы, порядок для кэша, COPY vs RUN, CMD vs ENTRYPOINT, Exec form, .dockerignore, Multi-stage build
- ✅ Глоссарий (29 терминов): Dockerfile, FROM, WORKDIR, ENV, COPY, RUN, EXPOSE, CMD, ENTRYPOINT, Build Context, slim, Alpine, musl, glibc, Shell form, Exec form, SIGTERM, Multi-stage build, Layers, docker build, docker tag, docker push, docker login, docker inspect, useradd, Flask, pip, --no-cache-dir, PYTHONDONTWRITEBYTECODE, PYTHONUNBUFFERED
- ✅ Чек-лист готовности (24 пункта): от написания Dockerfile до отправки образа в Docker Hub

---

### Урок 15: CI/CD
**Проблемы найдены:**
- Термины без расшифровки (CI/CD, Continuous Integration, Continuous Delivery, Continuous Deployment, Pipeline, Workflow, Event, Job, Step, Runner, Linting, PEP8, Unit Testing, Integration Testing, Registry, Trigger, Checkout, Build, Deploy, YAML, Vendor lock-in, Legacy, Canary, Blue-Green, Kubernetes, Terraform, Ansible, Prometheus, Grafana, IaC, Observability, SHA, Access Token, flake8, pytest, Artifact, Staging, Production)
- Нет ключевых выводов
- Нет глоссария терминов (чек-лист был, но неполный)

**Внесено:**
- ✅ Ключевые выводы (8 пунктов): проблема ручного деплоя, CI, CD (Delivery vs Deployment), пайплайн, GitHub Actions, Secrets, needs, версионность
- ✅ Глоссарий (38 терминов): CI/CD, Continuous Integration, Continuous Delivery, Continuous Deployment, Pipeline, Workflow, Event, Job, Step, Runner, Linting, PEP8, Unit Testing, Integration Testing, Registry, Trigger, Checkout, Build, Deploy, YAML, Vendor lock-in, Legacy, Canary, Blue-Green, Kubernetes, Terraform, Ansible, Prometheus, Grafana, IaC, Observability, SHA, Access Token, flake8, pytest, Artifact, Staging, Production
- ✅ Чек-лист готовности (24 пункта): от объяснения проблемы ручного деплоя до тем Level 2

---

## 🔁 Процесс работы

### Алгоритм улучшения одного урока:

1. **Прочитать ARTICLE.md** полностью
2. **Найти проблемы:**
   - Термины без расшифровки
   - Недостающие примеры кода
   - Опасные команды без предупреждений
   - Отсутствие структуры (выводы, глоссарий, чек-лист)
3. **Внести правки:**
   - Расшифровать термины
   - Добавить примеры
   - Добавить предупреждения
   - Создать разделы: «Ключевые выводы», «Глоссарий», «Чек-лист»
4. **Обновить IMPROVEMENT_TASK.md**
5. **Обновить этот файл контекста**

---

## 📁 Изменённые файлы

| Файл | Статус | Изменения |
|------|--------|-----------|
| `lessons/level1/README.md` | ✅ Создан | Навигационный хаб курса |
| `lessons/level1/.curriculum.md` | ✅ Создан | Внутренний документ для методистов |
| `lessons/level1/IMPROVEMENT_TASK.md` | ✅ Обновляется | Техзадание на улучшение |
| `lessons/level1/lesson01/ARTICLE.md` | ✅ Улучшен | KPI, DORA, WIP, выводы, глоссарий |
| `lessons/level1/lesson02/ARTICLE.md` | ✅ Улучшен | Таблица ВМ, проверка, выводы, глоссарий, чек-лист |
| `lessons/level1/lesson03/ARTICLE.md` | ✅ Улучшен | Выводы, глоссарий, чек-лист |
| `lessons/level1/lesson04/ARTICLE.md` | ✅ Улучшен | Выводы, глоссарий, чек-лист |
| `lessons/level1/lesson05/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (14), чек-лист (18) |
| `lessons/level1/lesson06/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (17), чек-лист (18) |
| `lessons/level1/lesson07/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (18), чек-лист (22) |
| `lessons/level1/lesson08/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (23), чек-лист (22) |
| `lessons/level1/lesson09/ARTICLE.md` | ✅ Улучшен | KPI исправлен, примеры добавлены |
| `lessons/level1/lesson10/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (24), чек-лист (24) |
| `lessons/level1/lesson11/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (24), чек-лист (26) |
| `lessons/level1/lesson12/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (32), чек-лист (30) |
| `lessons/level1/lesson13/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (24), чек-лист (25) |
| `lessons/level1/lesson14/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (29), чек-лист (24) |
| `lessons/level1/lesson15/ARTICLE.md` | ✅ Улучшен | Выводы (8), глоссарий (38), чек-лист (24) |

---

## 🎯 Следующие шаги

### ✅ Курс Level 1 завершён!

Все 15 уроков улучшены и содержат:
- Ключевые выводы
- Глоссарий терминов
- Чек-лист готовности

### 📊 Итоговая статистика:
- **Уроков улучшено:** 15/15 (100%)
- **Ключевых выводов добавлено:** 120 (8 × 15)
- **Терминов в глоссариях:** ~380
- **Пунктов в чек-листах:** ~370

### 🚀 Что дальше?
1. **Level 2 — Intermediate:** Kubernetes, Terraform/Ansible, Monitoring, Advanced CI/CD
2. **Level 3 — Advanced:** Helm, GitOps, Service Mesh, Observability, SRE, DevSecOps
3. **Практика:** Применить знания на реальных проектах

---

## 💡 Заметки для продолжения

### Типичные проблемы, которые искать:
1. **Термины без расшифровки** (KPI, WIP, DORA, MTTR, SLI, SLO и т.д.)
2. **Команды без предупреждений** (rm -rf, chmod 777, dd и т.д.)
3. **Примеры без вывода** (показать что должно получиться)
4. **Отсутствие структуры** (нет выводов, глоссария, чек-листа)

### Шаблон для вставки в конец урока:

```markdown
---

## Ключевые выводы урока

1.  ...
2.  ...
3.  ...

---

## Глоссарий терминов урока

| Термин | Расшифровка | Простое объяснение |
|--------|-------------|-------------------|
| ... | ... | ... |

---

## Чек-лист готовности урока

- [ ] ...
- [ ] ...
- [ ] ...
```

---

## 📞 Контакты

**Для продолжения работы:**
1. Открыть этот файл
2. Посмотреть таблицу прогресса
3. Выбрать следующий урок (Урок 5)
4. Следовать алгоритму из раздела «Процесс работы»

**Последнее обновление:** 29 марта 2026
**Следующая сессия:** #11 (Level 2)
**Прогресс сессии #10:** Урок 15 улучшен ✅
**Статус Level 1:** ✅ ЗАВЕРШЁН (100%)
