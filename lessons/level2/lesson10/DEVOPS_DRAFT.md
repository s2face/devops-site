# Terraform в команде: state, backend и модули

Когда вы работаете с Terraform в одиночку на локальной машине, стандартный файл `terraform.tfstate` кажется удобным. Но как только в проект приходит второй инженер, начинаются проблемы: конфликты правок, перезатирание ресурсов и риск потери файла состояния.

В этом уроке мы разберем, как превратить Terraform из персонального инструмента в полноценную платформу для командной работы, используя Remote Backend, Workspaces и модульную архитектуру.

---

## Проблема локального state в команде

Файл `terraform.tfstate` — это "единый источник истины" для вашей инфраструктуры. В нем Terraform хранит соответствие между кодом (HCL) и реальными ресурсами в облаке, а также метаданные о зависимостях.

**Основные риски локального хранения:**
1.  **Конфликты (Race Conditions):** Если два инженера одновременно запустят `terraform apply`, победит тот, кто закончит последним. Это приведет к повреждению state-файла или непредсказуемому состоянию ресурсов.
2.  **Секреты:** State-файл часто содержит пароли от баз данных, приватные ключи и другие чувствительные данные в открытом виде. Хранить его в Git — грубая ошибка безопасности, так как секреты останутся в истории коммитов навсегда.
3.  **Потеря данных:** Локальный файл легко удалить случайно. Без него Terraform "забудет", что он создал ресурсы, и при следующем запуске попытается создать их заново, что приведет к конфликтам имен в облаке.
4.  **Отсутствие аудита:** Невозможно отследить, кто и когда изменил инфраструктуру, если каждый использует свой локальный файл.

---

## Remote Backend: S3 + DynamoDB

Решение проблем — перенос state в удаленное защищенное хранилище (Backend). В экосистеме AWS золотым стандартом является связка **S3 (хранение)** + **DynamoDB (блокировка)**.

### Настройка инфраструктуры для Backend

Прежде чем настроить сам Terraform, нужно создать ресурсы для хранения состояния. Рекомендуется делать это через отдельную "bootstrapping" конфигурацию или вручную.

**Требования к S3:**
*   **Versioning:** Обязательно. Позволяет откатиться к предыдущей версии state при его повреждении.
*   **Encryption:** Шифрование (AES256) защищает данные на диске.

**Требования к DynamoDB:**
*   Таблица должна иметь первичный ключ (Partition Key) с именем `LockID` и типом `String`.

### Конфигурация Backend в коде

```hcl
# backend.tf

terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket         = "my-company-terraform-state-prod"
    key            = "infrastructure/network/terraform.tfstate"
    region         = "us-east-1"

    # Включаем блокировку через DynamoDB
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
```

### Как работает State Locking?
Когда вы запускаете `terraform plan` или `apply`, Terraform создает запись в DynamoDB с ID блокировки. Если другой пользователь попытается запустить команду в это же время, он получит ошибку:
`Error: Error acquiring the state lock: ConditionalCheckFailedException`.

**Команды для миграции:**
1.  Настройте блок `backend` в коде.
2.  Выполните `terraform init`.
3.  Terraform обнаружит локальный state и предложит скопировать его в S3:
    ```bash
    Do you want to copy existing state to the new backend?
    Enter a value: yes
    ```

---

## Workspaces — dev, staging, production

Terraform Workspaces позволяют использовать один и тот же код для разных окружений, изолируя их состояния.

### Зачем нужны Workspaces?
Вместо того чтобы копировать папки `prod/` и `dev/` с одинаковым кодом, вы используете одну директорию, но разные "пространства имен". В S3 пути будут выглядеть так:
*   `env:/dev/infrastructure/network/terraform.tfstate`
*   `env:/prod/infrastructure/network/terraform.tfstate`

### Управление через CLI

```bash
# Создание окружения
terraform workspace new staging
terraform workspace new prod

# Список всех окружений (звездочка укажет на текущий)
terraform workspace list

# Переключение
terraform workspace select dev
```

### Использование переменной `terraform.workspace`
Вы можете менять параметры ресурсов в зависимости от окружения:

```hcl
locals {
  instance_type = {
    default = "t3.micro"
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.medium"
  }
}

resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = lookup(local.instance_type, terraform.workspace, local.instance_type["default"])

  tags = {
    Name        = "AppServer-${terraform.workspace}"
    Environment = terraform.workspace
  }
}
```

---

## Модули — переиспользуем код

Модули — это контейнеры для множества ресурсов, которые используются вместе. Они делают код DRY (Don't Repeat Yourself) и упрощают поддержку.

### 1. Создание локального модуля
Создадим модуль для S3-бакета со статическим сайтом.

**Структура папок:**
```text
.
├── main.tf           # Вызов модуля
└── modules/
    └── static-site/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

**variables.tf (Входные данные):**
```hcl
variable "site_name" {
  type        = string
  description = "Unique name for the site"
}
```

**main.tf (Внутренняя логика):**
```hcl
resource "aws_s3_bucket" "this" {
  bucket = "site-${var.site_name}"
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id
  index_document { suffix = "index.html" }
}
```

**outputs.tf (Выходные данные):**
```hcl
output "website_url" {
  value = aws_s3_bucket_website_configuration.this.website_endpoint
}
```

### 2. Использование Remote-модулей
Использование модулей из [Terraform Registry](https://registry.terraform.io/) позволяет не изобретать велосипед для типовых задач (VPC, EKS, RDS).

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0" # Всегда фиксируйте версию!

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24", "10.0.11.0/24"]

  enable_nat_gateway = true
}
```

---

## Работа со State: import, taint, state

### terraform import
Если ресурс создан руками в консоли, Terraform о нем не знает. Чтобы добавить его в управление:
1. Опишите минимальный ресурс в коде:
   ```hcl
   resource "aws_instance" "legacy" {
     # Параметры можно оставить пустыми, они заполнятся после импорта
   }
   ```
2. Запустите импорт (нужно знать ID ресурса в облаке):
   ```bash
   terraform import aws_instance.legacy i-0123456789abcdef0
   ```
3. После импорта запустите `terraform plan` и подправьте код, чтобы он соответствовал реальности.

### terraform state (Хирургия)
*   `terraform state list`: Список всех ресурсов в текущем state.
*   `terraform state mv aws_instance.old_name aws_instance.new_name`: Переименование ресурса в коде без его пересоздания в облаке. Полезно при рефакторинге.
*   `terraform state rm aws_instance.test`: Удалить ресурс из-под управления Terraform. В облаке он останется.

### terraform taint vs -replace
Если сервер "лагает" и вы хотите его пересоздать:
*   **Старый способ:** `terraform taint aws_instance.app`. Помечает ресурс как битый.
*   **Новый способ (рекомендуется):**
    ```bash
    terraform apply -replace="aws_instance.app"
    ```
    Это разовое действие, которое не оставляет следов в state.

---

## Best Practices и Антипаттерны

### Чек-лист DevOps-инженера
| Команда / Инструмент | Описание |
| :--- | :--- |
| `terraform fmt -recursive` | Автоматическое форматирование кода во всех папках. |
| `terraform validate` | Проверка типов и обязательных аргументов. |
| `terraform-docs markdown . > README.md` | Генерация документации для модуля. |
| `tflint` | Проверка на ошибки в логике (например, неверный тип инстанса для региона). |

### ❌ Антипаттерны (Как делать НЕ надо)
1.  **Hardcoded Secrets:** Никогда не пишите пароли в коде. Используйте переменные окружения или AWS Secrets Manager.
2.  **Огромные state-файлы:** Если у вас 1000 ресурсов в одном файле, `plan` будет идти вечно. Разделяйте инфраструктуру на независимые слои.
3.  **Игнорирование .gitignore:** Всегда добавляйте `.terraform/`, `*.tfstate`, `terraform.tfvars` в игнор.
4.  **Ручное редактирование state:** Никогда не открывайте `.tfstate` в текстовом редакторе для правок. Используйте команды `terraform state`.

### ✅ Лучшие практики
1.  **Remote State по умолчанию:** Начинайте проект сразу с S3 Backend.
2.  **Small Modules:** Модуль должен решать одну задачу. Модуль `infrastructure` — это плохо. Модули `network`, `db`, `compute` — это хорошо.
3.  **Version Everything:** Версионируйте провайдеры и модули.
4.  **Backend Separation:** Для критических сред (Prod) используйте отдельный S3 Bucket в отдельном AWS аккаунте, чтобы минимизировать риски.
