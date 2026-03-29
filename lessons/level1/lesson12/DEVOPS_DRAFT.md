# Systemd: управляем сервисами как профи

Systemd — это гораздо больше, чем просто замена старой системы инициализации. Это стандарт де-факто в мире Linux, который управляет процессами, логами, монтированием дисков и даже сетью. В этом уроке мы разберем, как приручить этого "монстра" и заставить его работать на благо ваших проектов.

## Что такое init-система и зачем нужен systemd

**Init-система** — это первый процесс, который запускается ядром Linux после загрузки (PID 1). Она отвечает за запуск всех остальных процессов в системе.

До появления systemd стандартом был **SysVinit**. Его главные проблемы:
1. **Последовательный запуск:** Сервисы запускались один за другим. Если один "повис", загрузка всей системы затягивалась.
2. **Сложные Bash-скрипты:** Каждый сервис требовал громоздкого скрипта в `/etc/init.d/`.
3. **Плохое управление зависимостями:** Сложно было гарантировать, что база данных точно запустится раньше приложения.

**Systemd** решил эти проблемы:
* **Параллельный запуск:** Сервисы запускаются одновременно, что ускоряет загрузку.
* **Декларативность:** Вместо кода мы пишем конфиги (Unit-файлы).
* **Единый журнал:** Интеграция с `journald` для централизованного сбора логов.
* **Cgroups:** Четкое отслеживание процессов (убийство сервиса гарантированно завершит все его дочерние процессы).

---

## Управление сервисами через systemctl

Инструмент `systemctl` — ваш основной пульт управления.

### Базовые операции
```bash
sudo systemctl start nginx    # Запустить сервис
sudo systemctl stop nginx     # Остановить сервис
sudo systemctl restart nginx  # Перезапустить
sudo systemctl reload nginx   # Перечитать конфиг (если сервис поддерживает SIGHUP)
sudo systemctl status nginx   # Проверить состояние и последние логи
```

### Автозапуск (Enable/Disable)
`start` запускает сервис прямо сейчас, но после перезагрузки он не поднимется сам. Для этого нужен `enable`.
```bash
sudo systemctl enable nginx   # Добавить в автозагрузку
sudo systemctl disable nginx  # Убрать из автозагрузки
```

### Дополнительные полезные команды
```bash
systemctl list-units --type=service  # Список всех запущенных сервисов
systemctl is-active nginx             # Вернет active или inactive (удобно для скриптов)
sudo systemctl mask nginx             # "Замаскировать": сервис нельзя будет запустить даже вручную
sudo systemctl unmask nginx           # Снять маскировку
```

---

## Анатомия unit-файла

Unit-файлы обычно лежат в `/etc/systemd/system/` (для ваших сервисов) или в `/lib/systemd/system/` (системные).

Пример типичного юнита:

```ini
[Unit]
Description=My Awesome Python App
After=network.target postgresql.service  # Запускать ПОСЛЕ сети и БД

[Service]
Type=simple
User=webapp
Group=webapp
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/python3 /opt/myapp/app.py
Restart=always
RestartSec=5
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
```

### Разбор секций:
1. **[Unit]**
   * `Description`: Человекочитаемое описание.
   * `After`/`Before`: Порядок запуска относительно других юнитов.
   * `Requires`: Жесткая зависимость (если упадет зависимость, упадет и этот сервис).
2. **[Service]**
   * `Type`: `simple` (по умолчанию), `forking` (для демонов, уходящих в фон), `oneshot` (для разовых задач).
   * `User`/`Group`: От чьего имени работает процесс (**не запускайте под root!**).
   * `ExecStart`: Команда для запуска.
   * `Restart`: Условие перезапуска (`always`, `on-failure`).
3. **[Install]**
   * `WantedBy`: Определяет "target" (уровень запуска), к которому привязан сервис. `multi-user.target` — стандарт для серверных систем.

---

## Создаём свой сервис — пример с Python-приложением

Допустим, у нас есть простой скрипт `/home/devops/hello.py`:
```python
import time
while True:
    print("DevOps service is running...")
    time.sleep(10)
```

### Шаг 1: Создаем пользователя
```bash
sudo useradd -m -s /bin/false myapp-user
```

### Шаг 2: Создаем Unit-файл
Создаем файл `/etc/systemd/system/myapp.service`:
```ini
[Unit]
Description=Python Hello World Service
After=network.target

[Service]
Type=simple
User=myapp-user
ExecStart=/usr/bin/python3 /home/devops/hello.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Шаг 3: Активация
После создания или изменения файла юнита нужно обновить конфигурацию systemd:
```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
sudo systemctl status myapp
```

---

## Логи через journalctl

Забудьте про поиск файлов в `/var/log/`. Теперь всё в одном месте.

```bash
journalctl -u myapp.service -f     # Следить за логами конкретного сервиса (аналог tail -f)
journalctl --since "2023-10-01"    # Логи с определенной даты
journalctl --since "1 hour ago"    # Логи за последний час
journalctl -n 50                   # Последние 50 строк
journalctl -p err                  # Только ошибки и критические сообщения
journalctl -k                      # Только сообщения ядра (dmesg)
```
*Совет: `journalctl` выводит данные через `less`. Используйте стрелки для навигации и `q` для выхода.*

---

## Анализ загрузки системы

Если сервер грузится долго, systemd поможет найти виновного.

```bash
systemd-analyze blame
```
Эта команда выведет список всех юнитов, отсортированный по времени, которое они затратили на инициализацию.

```bash
systemd-analyze critical-chain
```
Покажет дерево критических зависимостей, которые больше всего влияют на время готовности системы.

---

## Targets (runlevels)

В SysVinit были "runlevels" (0-6). В systemd их заменили **Targets**.

* `multi-user.target` — Обычный многопользовательский режим без графики (аналог Runlevel 3).
* `graphical.target` — Режим с графической оболочкой (аналог Runlevel 5).
* `rescue.target` — Режим восстановления (аналог Runlevel 1).

**Как сменить режим на лету:**
```bash
sudo systemctl isolate graphical.target
```

**Как изменить режим по умолчанию:**
```bash
sudo systemctl set-default multi-user.target
```

---

## Сравнение: systemctl vs SysVinit

| Задача | Systemd (systemctl) | SysVinit (service/chkconfig) |
|--------|---------------------|-----------------------------|
| Запуск сервиса | `systemctl start name` | `service name start` |
| Остановка | `systemctl stop name` | `service name stop` |
| Автозапуск (вкл) | `systemctl enable name` | `chkconfig name on` |
| Автозапуск (выкл)| `systemctl disable name`| `chkconfig name off`|
| Статус | `systemctl status name` | `service name status` |
| Проверка автозапуска | `systemctl is-enabled name` | `chkconfig --list name` |

---

## Антипаттерны: как делать не надо

1.  **❌ Запуск под root:** Никогда не запускайте веб-приложения или скрипты под root в секции `User=`. Используйте выделенных пользователей с минимальными правами.
2.  **❌ Type=forking без нужды:** Если ваше приложение не умеет само уходить в фон (демонизироваться) и создавать PID-файл, используйте `Type=simple`. Использование `forking` для обычных скриптов приведет к тому, что systemd будет вечно ждать завершения стартового процесса.
3.  **❌ Игнорирование Restart:** Для критичных сервисов всегда указывайте `Restart=always` или `on-failure`. Это автоматизирует восстановление системы после багов.
4.  **❌ Ручное редактирование файлов в /lib/systemd/system/:** Эти файлы принадлежат пакетному менеджеру и будут перезаписаны при обновлении. Ваши кастомные юниты и переопределения должны быть в `/etc/systemd/system/`.

---

## Домашнее задание
1. Напишите Bash-скрипт, который каждую минуту пишет текущую дату и аптайм в файл `/tmp/uptime.log`.
2. Создайте Unit-файл для этого скрипта.
3. Запустите его, добавьте в автозагрузку.
4. Убедитесь через `journalctl`, что сервис работает корректно.
