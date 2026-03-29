# Урок 9: Введение в сети (IP, DNS, TCP/UDP) — Техническая база

## 1. Модель OSI (Уровни 3, 4, 7)
Для DevOps-инженера критически важно понимать три уровня, на которых происходит основная работа и отладка:

*   **L3 (Network Layer) — Сетевой:** Протокол **IP**. Ответственен за адресацию и маршрутизацию пакетов между сетями. Инструменты: `ip`, `ping`, `traceroute`.
*   **L4 (Transport Layer) — Транспортный:** Протоколы **TCP** и **UDP**. Ответственен за передачу данных между процессами (портами). Инструменты: `ss`, `netstat`, `tcpdump`.
*   **L7 (Application Layer) — Прикладной:** Протоколы **HTTP, DNS, SSH, FTP**. Уровень логики приложений. Инструменты: `curl`, `wget`, `dig`, `nslookup`.

---

## 2. IP-адресация и IPv4
### 2.1. Формат и CIDR
IP-адрес состоит из 4 октетов (32 бита).
**CIDR (Classless Inter-Domain Routing)** — маска подсети, указывающая количество бит сетевой части.
*   `192.168.1.0/24` — маска `255.255.255.0` (256 адресов, 254 доступно хостам).

### 2.2. Приватные диапазоны (RFC 1918)
Эти адреса не маршрутизируются в интернете:
*   `10.0.0.0/8` (от 10.0.0.0 до 10.255.255.255)
*   `172.16.0.0/12` (от 172.16.0.0 до 172.31.255.255)
*   `192.168.0.0/16` (от 192.168.0.0 до 192.168.255.255)

---

## 3. Настройка сети в Linux

### 3.1. Файлы конфигурации
*   `/etc/hosts`: Локальная таблица соответствия IP -> Hostname. Проверяется ПЕРЕД DNS. Пример: `127.0.0.1 localhost`.
*   `/etc/resolv.conf`: Настройка DNS-резолверов. Пример: `nameserver 8.8.8.8`.

### 3.2. Старая школа: /etc/network/interfaces (Debian/Ubuntu 16.04)
```text
auto eth0
iface eth0 inet static
    address 192.168.1.10
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

### 3.3. Современный подход: Netplan (Ubuntu 18.04+)
Файлы в `/etc/netplan/*.yaml`. Применяется командой `sudo netplan apply`.
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [192.168.1.15/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

---

## 4. Протоколы L4: TCP vs UDP

| Характеристика | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Соединение** | Устанавливается (3-way handshake) | Без установления соединения |
| **Надежность** | Гарантированная доставка, контроль порядка | Не гарантируется |
| **Скорость** | Ниже (из-за накладных расходов) | Выше (минимальные заголовки) |
| **Примеры** | HTTP (80), HTTPS (443), SSH (22), БД | DNS (53), Стриминг, VoIP, Игры |

**TCP 3-way Handshake (Алгоритм):**
1. Client -> **SYN** (Synchronize) -> Server
2. Server -> **SYN-ACK** (Synchronize-Acknowledge) -> Client
3. Client -> **ACK** (Acknowledge) -> Server

---

## 5. Система доменных имен (DNS)
### 5.1. Алгоритм резолвинга (по шагам):
1.  **Local Cache / Hosts:** Проверка файла `/etc/hosts`.
2.  **Recursive Resolver:** Запрос к DNS провайдера или публичному (8.8.8.8).
3.  **Root Hints:** Резолвер спрашивает "." (корневой) сервер.
4.  **TLD Server:** Корневой сервер направляет к серверу зоны (например, `.com`).
5.  **Authoritative Server:** Запрос к серверу, владеющему зоной (например, NS-сервера Cloudflare).
6.  **Ответ:** Получение IP-адреса и сохранение в кэш.

### 5.2. Типы записей:
*   **A:** Привязка домена к IPv4 адресу.
*   **CNAME:** Alias (псевдоним) одного имени для другого.
*   **MX:** Указывает на почтовые сервера домена.
*   **TXT:** Текстовая информация (используется для SPF, DKIM, верификации).

---

## 6. Практика: Команды и Диагностика

### 6.1. Работа с IP (инструмент `ip`)
```bash
# Просмотр IP-адресов всех интерфейсов
$ ip addr show
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 192.168.1.15/24 brd 192.168.1.255 scope global enp0s3
       valid_lft forever preferred_lft forever

# Просмотр таблицы маршрутизации (где шлюз?)
$ ip route
default via 192.168.1.1 dev enp0s3 proto static 
192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.15 
```

### 6.2. Проверка связности (`ping`, `traceroute`)
```bash
# Проверка доступности (ICMP)
$ ping -c 3 google.com
PING google.com (142.250.185.206) 56(84) bytes of data.
64 bytes from ...: icmp_seq=1 ttl=116 time=14.5 ms

# Трассировка пути (показывает каждый прыжок/хоп)
$ traceroute -n 8.8.8.8
 1  192.168.1.1  1.234 ms
 2  10.255.0.1  5.120 ms
 3  172.16.10.5  12.450 ms
 ...
```

### 6.3. Состояние портов и соединений (`ss`, `netstat`)
`ss` — современная замена `netstat`.
```bash
# Показать все слушающие TCP порты с именами процессов
$ ss -tlnp
State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=840,fd=3))
LISTEN 0      80                 *:80               *:*     users:(("nginx",pid=1021,fd=6))
```

### 6.4. DNS запросы (`dig`, `nslookup`)
```bash
# Быстрый поиск IP
$ nslookup google.com
Address: 142.250.185.206

# Расширенный поиск через dig
$ dig +short google.com
142.250.185.206

# Поиск TXT записей
$ dig TXT google.com +short
"v=spf1 include:_spf.google.com ~all"
```

### 6.5. Загрузка файлов (`curl`, `wget`)
```bash
# Проверка заголовков ответа сервера
$ curl -I https://google.com
HTTP/2 301
location: https://www.google.com/
content-type: text/html; charset=UTF-8

# Скачивание файла
$ wget https://example.com/file.tar.gz
```

### 6.6. Анализ трафика (`tcpdump`)
```bash
# Прослушивание интерфейса eth0, только порт 80
$ sudo tcpdump -i eth0 port 80 -n -c 5
12:34:56.789 IP 192.168.1.15.54321 > 142.250.185.206.80: Flags [S], seq 12345, win 64240...
```

---

## 7. Firewall (UFW — Uncomplicated Firewall)
```bash
$ sudo ufw status
Status: inactive

# Разрешить SSH и HTTP
$ sudo ufw allow 22/tcp
$ sudo ufw allow 80/tcp
$ sudo ufw enable

$ sudo ufw status numbered
Status: active
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
```

---

## 8. KPI: Справочные данные

### Таблица популярных портов
| Порт | Протокол | Назначение |
| :--- | :--- | :--- |
| 22 | TCP | SSH (Secure Shell) |
| 53 | UDP/TCP | DNS (Domain Name System) |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 9090 | TCP | Prometheus |

### Алгоритм диагностики "Не работает сервис"
1.  **L3 (Ping):** `ping <IP_сервера>` — Сервер вообще жив?
2.  **DNS:** `dig <domain>` — Имя преобразуется в правильный IP?
3.  **L4 (Port):** `nc -zv <IP> <Port>` или `ss -tlnp` (на самом сервере) — Слушает ли приложение порт?
4.  **Firewall:** Проверить `ufw status` или `iptables -L` — Не блокируется ли трафик?
5.  **L7 (Application):** `curl -v http://localhost:<port>` — Что отвечает само приложение?

---

## 9. Антипаттерны (Как делать НЕ надо)
1.  **Использовать `ifconfig`:** Пакет `net-tools` не развивается более 10 лет. Стандарт — `iproute2` (`ip` command).
2.  **Отключать Firewall вместо настройки:** `ufw disable` — это дыра в безопасности.
3.  **Игнорировать TTL в DNS:** При смене IP помните, что записи кэшируются на время TTL (Time To Live).
4.  **Проверять доступность сайта только через браузер:** Браузер кэширует всё. Используйте `curl -I`.
