# Terraform: управляем инфраструктурой как кодом (Уровень 2 — Intermediate)

В современном мире DevOps-инженер — архитектор систем, где инфраструктура описывается кодом. Эпоха ручной настройки («ClickOps») уступает место подходу **Infrastructure as Code (IaC)**, лидером которого стал Terraform.

В этом руководстве мы разберем Terraform: от основ до продвинутых техник. Вы научитесь создавать масштабируемую инфраструктуру и освоите профессиональные практики работы. Материал ориентирован на специалистов уровня Junior+/Intermediate.

---

## Что такое IaC и зачем он нужен

**Infrastructure as Code (IaC)** — это методология управления IT-инфраструктурой через файлы определений.

> [!TIP]
> **Аналогия:** ClickOps — это когда вы объясняете строителям на словах, где ставить стены (риск ошибок). IaC — это точный чертеж для 3D-принтера, который в точности возводит здание любое количество раз.

### Преимущества IaC

1.  **Повторяемость:** Вы можете развернуть идентичные окружения (Dev, Prod) за минуты.
2.  **Версионирование:** Инфраструктура в Git — это полная история изменений и «источник истины».
3.  **Скорость:** Создание сотен ресурсов делается изменением одной переменной.
4.  **Снижение рисков:** Автоматизация исключает «человеческий фактор».

---

## Мутабельная vs Иммутабельная инфраструктура

*   **Мутабельная:** Вы обновляете софт на живом сервере. Со временем возникает «дрейф конфигураций» — серверы становятся уникальными («снежинками»), их сложно восстановить.
*   **Иммутабельная:** Подход Terraform. Вместо изменения сервера вы уничтожаете старый и запускаете новый из свежего образа. Это гарантирует предсказуемость.

---

## Terraform vs Ansible: сравнение инструментов

| Характеристика | Terraform | Ansible |
| :--- | :--- | :--- |
| **Специализация** | Оркестрация (Provisioning) | Управление конфигурациями (Config Management) |
| **Подход** | Декларативный (Описываем "Что") | Преимущественно процедурный (Описываем "Как") |
| **Управление состоянием** | Есть (State-файл) | Нет (Stateless) |

**Золотое правило DevOps:** Используйте Terraform, чтобы построить «коробку» (VPC, Subnets, VM, DB), и используйте Ansible, чтобы настроить то, что внутри (софт, пользователи, конфиги приложений).

---

## Установка Terraform

Terraform поставляется в виде одного исполняемого файла, написанного на Go. Это делает его установку максимально простой. Мы рекомендуем использовать официальный репозиторий HashiCorp для получения своевременных обновлений безопасности и новых функций.

> **Примечание:** Для корректной работы скрипта установки в минимальных дистрибутивах Linux может потребоваться пакет `lsb-release`. Установите его командой: `sudo apt-get update && sudo apt-get install -y lsb-release`.

### Установка в Linux (Ubuntu/Debian)

```bash
# Обновляем пакеты и устанавливаем необходимые утилиты
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common curl

# Добавляем GPG-ключ репозитория HashiCorp
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Регистрируем репозиторий в системе
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

# Обновляем списки пакетов и устанавливаем Terraform
sudo apt-get update && sudo apt-get install terraform
```

Для проверки установки выполните команду:
```bash
terraform -version
```
Вы должны увидеть версию выше 1.6.0.

---

## Стандартная структура Terraform-проекта

Профессиональный проект всегда разделен на файлы для удобства поддержки и читаемости.

1.  **`versions.tf`**: Фиксация версий Terraform и провайдеров. Критично для стабильности в команде.
2.  **`providers.tf`**: Конфигурация подключения к облаку (регионы, профили доступа).
3.  **`variables.tf`**: Описание входных параметров (типы, описания, значения по умолчанию).
4.  **`main.tf`**: Основные ресурсы инфраструктуры.
5.  **`outputs.tf`**: Значения, которые Terraform вернет после завершения (IP-адреса, DNS-имена).
6.  **`locals.tf`**: Вычисляемые локальные переменные (например, сложные теги).
7.  **`terraform.tfvars`**: Фактические значения переменных для конкретного окружения.

---

## Продвинутая логика HCL: Циклы и Условия

Для создания чистого, масштабируемого кода (DRY — Don't Repeat Yourself) необходимо использовать инструменты автоматизации внутри самого HCL.

### 1. Count
Простейший способ создать несколько одинаковых ресурсов.
```hcl
resource "aws_instance" "server" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  
  tags = {
    Name = "Server-${count.index}"
  }
}
```
**Разбор:** `count.index` позволяет получить порядковый номер текущего ресурса (0, 1, 2), что удобно для именования. Это полезно, когда вам нужно просто N одинаковых инстансов.

### 2. For_each
Более гибкий инструмент. Позволяет создавать ресурсы на основе карты (map) или набора строк.
```hcl
resource "aws_iam_user" "users" {
  for_each = toset(["alice", "bob", "charlie"])
  name     = each.key
}
```
**Разбор:** В отличие от `count`, если вы удалите "bob", Terraform удалит именно его, а не сдвинет индексы остальных пользователей. Это делает инфраструктуру более стабильной при изменениях.

### 3. Динамические блоки (Dynamic Blocks)
Позволяют генерировать вложенные блоки внутри ресурсов (например, правила Security Group).
```hcl
variable "ingress_ports" {
  type    = list(number)
  default = [80, 443, 8080]
}

resource "aws_security_group" "web" {
  dynamic "ingress" {
    for_each = var.ingress_ports
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}
```
**Разбор:** Вместо написания трех блоков `ingress`, мы используем один динамический, который итерируется по списку портов. Это значительно сокращает объем кода.

---

## Встроенные функции Terraform

Terraform предлагает мощный набор функций для манипуляции данными без использования внешних скриптов.

*   **`lookup(map, key, default)`**: Безопасное получение значения из карты. Если ключа нет — вернет default. Полезно для работы с конфигурациями разных регионов.
*   **`element(list, index)`**: Получение элемента списка. Если индекс больше длины списка, функция начнет отсчет сначала (modulo), что предотвращает ошибки выхода за границы.
*   **`join(separator, list)`**: Объединение списка строк в одну строку. Часто используется для формирования имен ресурсов или строк подключения.
*   **`try(expression, fallback)`**: Пробует выполнить выражение, и если оно возвращает ошибку, использует fallback. Идеально для работы с опциональными или глубоко вложенными переменными.

---

## Основные блоки Terraform: Грамматика HCL

### Провайдеры (Providers)
Плагины для взаимодействия с API облаков.

```hcl
provider "aws" {
  region = var.region
}
```

### Ресурсы (Resources)
Самый важный блок, описывающий объект инфраструктуры.

```hcl
resource "aws_instance" "web" {
  # ВНИМАНИЕ: AMI ID специфичны для каждого региона AWS
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
}
```

### Источники данных (Data Sources)
Позволяют запрашивать информацию о существующих ресурсах, которые не управляются текущим кодом Terraform (например, AMI образы, ID существующих VPC или настройки облачного провайдера).

```hcl
data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
```

---

## Подробный разбор типов данных в HCL

HCL — строго типизированный язык.
*   **string**: "hello"
*   **number**: 10, 3.14
*   **bool**: true/false
*   **list**: ["a", "b"]
*   **set**: toset(["a", "b"]) — уникальный неупорядоченный набор элементов.
*   **map**: { key = "value" }
*   **object**: сложная структура с разными типами полей.

## Жизненный цикл ресурсов (Lifecycle)

Блок `lifecycle` позволяет переопределить стандартное поведение Terraform в критических ситуациях. Рассмотрим реальные сценарии:

1.  **`create_before_destroy = true`**: 
    *   *Сценарий:* Вы обновляете Launch Template для Auto Scaling Group. Стандартно Terraform может сначала удалить группу, а потом создать новую, что приведет к Downtime. С этим флагом он сначала создаст новую замену, и только после успеха удалит старую. Это обязательно для ресурсов с уникальными именами, которые нельзя "переиспользовать" без удаления.
2.  **`prevent_destroy = true`**: 
    *   *Сценарий:* База данных Production или критически важный S3-бакет с бэкапами. Этот флаг заблокирует `terraform destroy`, пока вы вручную не удалите этот параметр из кода. Это последняя линия обороны от случайных ошибок.
3.  **`ignore_changes = [tags]`**: 
    *   *Сценарий:* В вашей компании работает внешняя система мониторинга или безопасности, которая автоматически добавляет свои теги к ресурсам. Без этого флага Terraform при каждом запуске будет пытаться удалить "лишние" теги, так как их нет в коде.

---

## Terraform Modules: Архитектура вашего проекта

Модули — это способ группировки ресурсов для повторного использования. Представьте модуль как функцию в программировании.

### Зачем нужны модули?
*   **Изоляция сложности:** Вам не нужно каждый раз описывать все 10 параметров VPC. Вы создаете модуль "vpc" с 2-3 входными переменными, а внутри него скрыта сложная логика создания подсетей и таблиц маршрутизации.
*   **Стандартизация:** Вся компания использует один и тот же проверенный модуль, где уже настроены все требования безопасности.
*   **Удобство:** Изменив код модуля в одном месте, вы можете обновить его версию во всех проектах, использующих этот модуль.

### Пример модуля (Web Server):
Создадим папку `modules/web_server` и положим туда `main.tf`:
```hcl
resource "aws_instance" "app" {
  ami           = var.ami_id
  instance_type = var.instance_type
  tags = { Name = var.server_name }
}
```
Вызов этого модуля из корневого `main.tf`:
```hcl
module "frontend_server" {
  source        = "./modules/web_server"
  ami_id        = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.small"
  server_name   = "frontend-prod"
}
```

---

## Управление окружениями: Workspaces vs File-based

Когда вам нужно развернуть Dev и Prod окружения, у вас есть два основных пути:

### 1. Terraform Workspaces
Вы используете один и тот же код и один и тот же State-файл, но внутри него создаются изолированные "ветки" (default, prod, dev).
*   **Плюс:** Легко переключаться (`terraform workspace select prod`).
*   **Минус:** Сложно контролировать отличия в конфигурации (например, в Prod нужен мощный инстанс, а в Dev — дешевый).

### 2. File-based (Директории)
Вы создаете папки `environments/dev` и `environments/prod`. В каждой папке свой `main.tf`, который вызывает общие модули с разными параметрами.
*   **Плюс:** Максимальная изоляция и наглядность. Это стандарт для крупных проектов.
*   **Минус:** Немного больше дублирования кода.

---

## Terraform Import: Работа с существующей инфраструктурой

Часто возникает ситуация: ресурсы уже созданы "руками" в консоли AWS, но теперь вы хотите управлять ими через Terraform. Для этого традиционно используется команда `terraform import`.

**Алгоритм (CLI):**
1. Напишите пустой блок ресурса в коде: `resource "aws_instance" "legacy_web" {}`.
2. Выполните команду: `terraform import aws_instance.legacy_web i-0123456789abcdef`.
3. Terraform подтянет состояние ресурса в ваш State-файл.
4. Допишите параметры в коде, пока `terraform plan` не покажет "No changes".

> [!TIP]
> **Современный подход:** В Terraform 1.5+ появился **блок `import`**, который позволяет описывать импорт прямо в коде. Это более "IaC-native" способ, так как он позволяет сгенерировать конфигурацию автоматически.
> ```hcl
> import {
>   to = aws_instance.legacy_web
>   id = "i-0123456789abcdef"
> }
> ```

---

## State файл — чертеж, фундамент и память

`terraform.tfstate` — это JSON-файл, в котором Terraform хранит соответствие между вашим кодом и реальными ресурсами в облаке.

> [!CAUTION]
> **Аналогия:** 
> *   **Код** — это ваши идеи (Архитектор).
> *   **Облако** — это построенный дом (Реальность).
> *   **State-файл** — это память архитектора. Если архитектор забудет, что он уже построил дом, он придет на участок и начнет строить второй поверх первого, что приведет к катастрофе.
> **НИКОГДА не кладите его в Git!** Он содержит секреты (пароли БД) в открытом виде.

### Remote State: командная работа
Используйте **Remote Backend** (например, AWS S3 + DynamoDB для блокировок). Это гарантирует, что два инженера не смогут одновременно вносить изменения и "сломать" стейт.

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```
**Разбор параметров:**
*   `bucket`: Имя корзины S3 для хранения файла.
*   `key`: Путь к файлу внутри корзины.
*   `dynamodb_table`: Таблица для блокировок (предотвращает одновременный запуск).
*   `encrypt`: Включает шифрование файла на стороне S3.

---

## Интеграция в CI/CD: Автоматизация развертывания

В профессиональной среде никто не запускает `terraform apply` со своего ноутбука для Production-окружения. Это делается через CI/CD пайплайны.

### Стандартный рабочий процесс (GitOps):
1. Инженер создает Pull Request с изменениями в коде.
2. **CI (GitHub Actions/GitLab CI)** запускает `terraform plan` и публикует результат в комментариях к PR.
3. Коллеги проводят Code Review, проверяя, какие ресурсы будут созданы или удалены.
4. После Merge в основную ветку (`main`), **CD** запускает `terraform apply`.

### Пример GitHub Action:
```yaml
name: 'Terraform Plan/Apply'
on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.6.0

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan
        if: github.event_name == 'pull_request'

      - name: Terraform Apply
        run: terraform apply -auto-approve
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```
**Разбор шагов:**
*   `setup-terraform`: Устанавливает CLI нужной версии в окружение CI.
*   `terraform init`: Инициализирует рабочий каталог и скачивает провайдеры.
*   `terraform plan`: Запускается на Pull Request для проверки изменений.
*   `terraform apply`: Автоматически применяет изменения при слиянии в `main`.

---

## Подготовка окружения: Аутентификация в AWS

Перед запуском Terraform настройте доступ к аккаунту AWS.

### 1. Настройка через AWS CLI
Выполните команду и введите свои ключи (Access Key ID и Secret Access Key):
```bash
aws configure
```

### 2. Переменные окружения
Для CI/CD задайте ключи напрямую:
```bash
export AWS_ACCESS_KEY_ID="ваш_ключ"
export AWS_SECRET_ACCESS_KEY="ваш_секрет"
export AWS_DEFAULT_REGION="eu-central-1"
```

---

## Практическая часть: Строим полноценную сеть в AWS

Построим изолированную инфраструктуру: VPC, публичную подсеть и веб-сервер.

### Шаг 1: `versions.tf` — Фиксация версий
```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### Шаг 2: `locals.tf` и `terraform.tfvars` — Конфигурация
В `locals.tf` описываем общие теги:
```hcl
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

В `terraform.tfvars` задаем значения:
```hcl
region        = "eu-central-1"
project_name  = "MyAwesomeProject"
environment   = "Dev"
instance_type = "t3.micro"
```

### Шаг 3: `main.tf` — Описание ресурсов

```hcl
provider "aws" {
  region = var.region
}

# 0. Динамически получаем ID актуального образа Amazon Linux 2
data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# 1. Создаем VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = merge(local.common_tags, { Name = "MainVPC" })
}

# 2. Создаем подсеть в зоне "a"
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true 
  tags = merge(local.common_tags, { Name = "PublicSubnet" })
}

# 3. Интернет-шлюз
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = local.common_tags
}

# 4. Таблица маршрутизации
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

# 5. Привязка таблицы
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# 6. Security Group
resource "aws_security_group" "web_sg" {
  name   = "allow-web"
  vpc_id = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 7. EC2 Инстанс
resource "aws_instance" "web" {
  ami           = data.aws_ami.latest_amazon_linux.id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  
  tags = merge(local.common_tags, { Name = "WebServer" })
}
```

> [!WARNING]
> **Безопасность прежде всего!** 
> Использование `0.0.0.0/0` для порта 22 (SSH) открывает ваш сервер для атак брутфорсом со всего интернета. В реальных проектах всегда ограничивайте доступ только своим IP-адресом (например, `95.10.20.30/32`) или используйте AWS Client VPN / SSM Session Manager.

**Разбор ресурсов:**
*   `aws_vpc`: Создает виртуальное частное облако — ваш изолированный сегмент в AWS. `cidr_block = "10.0.0.0/16"` определяет диапазон из 65,536 IP-адресов.
*   `aws_subnet`: Делит VPC на более мелкие сегменты. Параметр `map_public_ip_on_launch = true` критически важен: он заставляет AWS автоматически выдавать публичные IP-адреса всем серверам в этой подсети.
*   `aws_internet_gateway`: «Дверь» из вашей сети в публичный интернет. Без него VPC будет полностью изолирована.
*   `aws_route_table`: Таблица маршрутизации. Запись `0.0.0.0/0` через `gateway_id` говорит: «Если адрес назначения не находится внутри нашей сети, отправляй трафик в интернет-шлюз».
*   `aws_route_table_association`: Привязывает таблицу маршрутизации к конкретной подсети. Без этой связки правила маршрутов не будут применяться.
*   `aws_security_group`: Виртуальный фаервол на уровне инстанса. Мы открыли два входящих порта: **80 (HTTP)** для веб-трафика и **22 (SSH)** для удаленного управления.
*   `aws_instance`: Сама виртуальная машина. Мы используем `vpc_security_group_ids`, чтобы применить к ней наш фаервол, и `subnet_id`, чтобы поместить её в созданную подсеть.

### Шаг 4: `variables.tf` и `outputs.tf`

В файле `variables.tf` опишем входные параметры:
```hcl
variable "region" {
  description = "AWS регион для развертывания"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Имя проекта"
  type        = string
}

variable "environment" {
  description = "Окружение (Dev/Staging/Prod)"
  type        = string
}

variable "instance_type" {
  description = "Тип инстанса EC2"
  type        = string
  default     = "t3.micro"
}
```

А в `outputs.tf` — данные, которые мы хотим получить на выходе:
```hcl
output "instance_public_ip" {
  description = "Публичный IP-адрес нашего веб-сервера"
  value       = aws_instance.web.public_ip
}

output "vpc_id" {
  description = "ID созданной сети"
  value       = aws_vpc.main.id
}
```

### Шаг 5: Запуск
1.  `terraform init`
2.  `terraform plan`
3.  `terraform apply`

После выполнения вы увидите `instance_public_ip`. Вы сможете зайти по нему в браузере (хотя веб-сервер там пока не установлен — это задача для Ansible!).

---

## FAQ: Часто задаваемые вопросы

**В: Можно ли использовать Terraform для управления On-premise инфраструктурой?**
О: Да, существуют провайдеры для VMware, OpenStack, Libvirt и даже для обычных Linux-серверов через SSH.

**В: Как обрабатывать секреты?**
О: Используйте переменные окружения `TF_VAR_имя` или интеграцию с HashiCorp Vault. Никогда не пишите пароли в коде.

**В: Что такое "State Drift"?**
О: Это ситуация, когда реальное состояние ресурсов в облаке отличается от того, что записано в State-файле (например, кто-то изменил настройки руками). Terraform Plan поможет это выявить и исправить.

**В: Нужно ли учить HCL, если я знаю Python?**
О: Да, HCL — основной язык Terraform. Он декларативен и гораздо проще для описания инфраструктуры, чем императивные языки.

---

## Антипаттерны и лучшие практики

### ✅ Best Practices:
*   Используйте модули для переиспользования кода.
*   Храните стейт удаленно с блокировкой.
*   Версионируйте всё: Terraform, провайдеры, модули.

### ❌ Anti-patterns:
*   Стейт в Git.
*   ClickOps (ручные правки).
*   Огромные файлы `main.tf`.

---

## Следующие шаги для обучения

1.  **Изучите Terraform Modules**: Научитесь создавать свои и использовать готовые из Registry.
2.  **Настройте CI/CD**: Автоматизируйте запуск Terraform через GitHub Actions или GitLab CI.
3.  **Попробуйте Terraform Cloud**: Поймите преимущества управляемой платформы.
4.  **Изучите Terragrunt**: Инструмент для поддержки чистоты кода в больших проектах (DRY).

---

## Заключение

Terraform — это стандарт де-факто в мире IaC. Он дает контроль, скорость и надежность. Мы разобрали основы, но мастерство приходит с практикой. Начните внедрять IaC в свои проекты уже сегодня!
