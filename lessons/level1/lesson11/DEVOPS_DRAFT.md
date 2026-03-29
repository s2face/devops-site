# Пакетные менеджеры Linux: Полный гайд по apt, yum и dnf (Урок 11)

В мире Linux установка программ отличается от Windows. Вместо поиска `.exe` файлов на сайтах, мы используем **пакетные менеджеры** и **репозитории**. В этом уроке мы разберем, как эффективно управлять софтом в двух самых популярных семействах дистрибутивов: Debian/Ubuntu и RHEL/CentOS.

---

## 1. Концепция репозитория и пакета: Deb vs RPM

### Что такое пакет?
Пакет — это архив, содержащий:
1.  **Бинарные файлы** приложения.
2.  **Конфигурационные файлы**.
3.  **Метаданные** (версия, описание, зависимости).
4.  **Скрипты** для выполнения до и после установки.

### Репозиторий — это "магазин приложений"
Репозиторий — это удаленный сервер, на котором хранятся тысячи пакетов, проверенных разработчиками дистрибутива. Пакетный менеджер скачивает список доступных пакетов с этих серверов, чтобы знать, что можно установить.

### Два мира: DEB и RPM
*   **.deb (Debian Executable):** Используется в Debian, Ubuntu, Mint, Kali. Родной менеджер — `dpkg`, высокоуровневый — `apt`.
*   **.rpm (Red Hat Package Manager):** Используется в RHEL, CentOS, Fedora, Rocky Linux. Родной менеджер — `rpm`, высокоуровневые — `yum` и `dnf`.

| Характеристика | DEB-семейство | RPM-семейство |
| :--- | :--- | :--- |
| **Формат файла** | `.deb` | `.rpm` |
| **Низкоуровневая утилита** | `dpkg` | `rpm` |
| **Умный менеджер (CLI)** | `apt`, `apt-get` | `yum`, `dnf` |
| **Популярные дистрибутивы** | Ubuntu, Debian | RHEL, CentOS, Fedora |

---

## 2. APT: Работа с пакетами в Ubuntu/Debian

`APT (Advanced Package Tool)` — мощный инструмент, который сам разрешает зависимости (если пакету A нужна библиотека B, apt скачает обе).

### Разница между `apt update` и `apt upgrade`
Это самый частый вопрос новичков.

1.  **`sudo apt update`**: Обновляет **индексы** (списки) пакетов. Команда не меняет установленные программы, она лишь узнает, вышли ли новые версии в репозиториях.
    *   *Пример вывода:*
        ```text
        Get:1 http://archive.ubuntu.com/ubuntu jammy InRelease [270 kB]
        Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
        Fetched 389 kB in 1s (350 kB/s)
        Reading package lists... Done
        Building dependency tree... Done
        15 packages can be upgraded. Run 'apt list --upgradable' to see them.
        ```

2.  **`sudo apt upgrade`**: На основе обновленных индексов скачивает и устанавливает новые версии программ.
    *   *Пример вывода:*
        ```text
        Reading package lists... Done
        The following packages will be upgraded:
          curl libcurl4 openssl
        3 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
        Need to get 1,200 kB of archives.
        Do you want to continue? [Y/n]
        ```

### Базовые команды APT
*   **Поиск пакета:**
    ```bash
    apt search nginx
    ```
*   **Установка:**
    ```bash
    sudo apt install nginx
    ```
*   **Удаление (только бинарники):**
    ```bash
    sudo apt remove nginx
    ```
*   **Полное удаление (вместе с конфигами):**
    ```bash
    sudo apt purge nginx
    ```
*   **Очистка кеша (удаление скачанных .deb файлов):**
    ```bash
    sudo apt autoclean
    ```

---

## 3. Объяснение разницы: apt vs apt-get

Вы встретите обе команды. В чем разница?

*   **`apt-get`**: Старая, низкоуровневая утилита. Она стабильна, имеет больше функций и **рекомендуется для использования в скриптах**, так как ее вывод не меняется от версии к версии.
*   **`apt`**: Современный интерфейс для человека. В ней есть полоска прогресса, она объединяет функции `apt-get` и `apt-cache`. **Используйте `apt` для повседневной работы в терминале.**

---

## 4. Добавление сторонних репозиториев и PPA

Иногда нужного софта нет в официальных репозиториях (например, последней версии Docker или VS Code).

### Способ 1: PPA (Personal Package Archives) — только для Ubuntu
```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.2
```

### Способ 2: Репозиторий с GPG ключом (На примере Docker)
Это самый правильный и безопасный способ. GPG ключ гарантирует, что пакеты не были подменены хакерами.

```bash
# 1. Обновляем список пакетов и ставим зависимости
sudo apt update
sudo apt install ca-certificates curl gnupg

# 2. Добавляем официальный GPG ключ репозитория
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Добавляем репозиторий в список источников (sources.list)
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Снова update и установка
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

---

## 5. Продвинутая работа: dpkg и apt-mark

### dpkg — работа с файлом напрямую
Если вы скачали файл `app.deb` из интернета, `apt` его не увидит в репозитории. Его нужно ставить через `dpkg`.
*   **Установка файла:** `sudo dpkg -i path_to_file.deb`
*   **Список установленных файлов пакета:** `dpkg -L nginx`
*   **Внимание:** `dpkg` не умеет скачивать зависимости. Если после установки возникли ошибки, выполните `sudo apt install -f` (исправить зависимости).

### Закрепление версии (Hold)
Иногда обновление пакета может сломать продакшн (например, БД или специфическая библиотека). Чтобы `apt upgrade` не трогал конкретный пакет:
```bash
# Запретить обновление
sudo apt-mark hold nginx

# Разрешить обратно
sudo apt-mark unhold nginx

# Посмотреть список заблокированных
apt-mark showhold
```

---

## 6. Yum и DNF: Управление в RHEL/CentOS

В семействе Red Hat долгое время стандартом был `yum`, но в новых версиях (CentOS 8+, RHEL 8, Rocky) его заменил `dnf` (Dandified YUM). `dnf` быстрее и лучше работает с памятью, но синтаксис почти идентичен.

### Основные операции:
*   **Поиск:** `dnf search nginx`
*   **Установка:** `sudo dnf install nginx`
*   **Удаление:** `sudo dnf remove nginx`
*   **Обновление списка и пакетов:** `sudo dnf check-update` и `sudo dnf upgrade`
*   **Просмотр истории операций:** `dnf history` (удобно, чтобы откатить изменения!).

---

## 7. Сравнительная таблица команд

| Действие | APT (Ubuntu/Debian) | DNF / YUM (RHEL/CentOS) |
| :--- | :--- | :--- |
| Обновить индексы | `apt update` | `dnf check-update` |
| Обновить систему | `apt upgrade` | `dnf upgrade` |
| Поиск пакета | `apt search <name>` | `dnf search <name>` |
| Установка | `apt install <name>` | `dnf install <name>` |
| Удаление | `apt remove <name>` | `dnf remove <name>` |
| Удаление с конфигами | `apt purge <name>` | — (через `dnf remove`) |
| Очистка кеша | `apt clean` | `dnf clean all` |
| Инфо о пакете | `apt show <name>` | `dnf info <name>` |
| Список репозиториев | `apt policy` | `dnf repolist` |

---

## 8. Антипаттерны: Как делать НЕ надо

1.  **❌ `apt upgrade` без `apt update`**
    Менеджер будет пытаться скачать старые версии пакетов, которых уже нет на зеркалах. Вы получите ошибку `404 Not Found`.
2.  **❌ Смешивание репозиториев разных дистрибутивов (FrankenDebian)**
    Никогда не добавляйте репозитории от Ubuntu в Debian или наоборот. Это приведет к конфликту версий системных библиотек (libc6), и система может перестать загружаться.
3.  **❌ Установка пакетов без проверки GPG**
    Если вы копируете команду `curl ... | sudo bash` или добавляете репозиторий без ключа, вы доверяете автору репозитория полный контроль над вашей системой.
4.  **❌ Забытые "Hold" пакеты**
    Если вы закрепили версию пакета через `apt-mark hold`, через год вы можете забыть об этом и оставить систему с дырой в безопасности. Помечайте такие действия в документации.
5.  **❌ Использование `dpkg -i` как основного метода**
    Всегда ищите официальный репозиторий. Пакет, установленный вручную через `.deb`, не будет получать обновлений безопасности.

---

### Резюме
*   Используйте `apt` для Debian/Ubuntu и `dnf` для RHEL-мира.
*   Всегда делайте `update` перед `upgrade`.
*   Добавляйте сторонние репозитории через GPG ключи.
*   Используйте `apt-mark hold` для критически важных сервисов.
