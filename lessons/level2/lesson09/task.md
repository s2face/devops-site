# ТЗ для devops-writer: Урок 9 — Terraform: Infrastructure as Code

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 9 из 15 |
| **Тема** | Terraform: Infrastructure as Code |
| **Хэштеги** | `#terraform` `#iac` `#aws` `#cloud` `#devops` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель установит Terraform, поймёт декларативный подход к описанию инфраструктуры и создаст первые ресурсы в облаке (AWS или Yandex Cloud).

## Целевая аудитория
DevOps, знающие основы облаков и Linux.

## Пререквизиты
- Level 1 уроки 9, 10: сети, bash-скрипты

## Технический стек
- **Terraform:** 1.6+, **HCL** (HashiCorp Configuration Language)
- **Provider:** AWS (или Yandex Cloud как альтернатива)
- **Инструменты:** `terraform init/plan/apply/destroy`

## Требования к контенту
- [ ] IaC концепция: мутабельная vs иммутабельная инфраструктура
- [ ] Terraform vs Ansible: что когда применять
- [ ] Установка Terraform
- [ ] Структура проекта: main.tf, variables.tf, outputs.tf, versions.tf
- [ ] Provider и ресурсы: `resource`, `data`, `variable`, `output`, `local`
- [ ] `terraform init`, `plan`, `apply`, `destroy`
- [ ] Resouce lifecycle: create_before_destroy, prevent_destroy
- [ ] State файл: что это и почему важно

## Структура статьи

### H1: Terraform: управляем инфраструктурой как кодом
### H2: Что такое IaC и зачем он нужен
### H2: Структура Terraform-проекта
```hcl
# versions.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# main.tf
provider "aws" {
  region = var.region
}

resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t3.micro"
  tags = {
    Name = "devops-web-server"
  }
}
```
### H2: variables.tf и outputs.tf
### H2: Цикл работы: plan → apply → destroy
### H2: State файл — сердце Terraform

## KPI качества
- Читатель создал реальный ресурс в облаке через Terraform
- Объяснение `terraform plan` как обязательного шага перед apply
- Предупреждение о хранении state файла (не в Git!)

## Антипаттерны
- ❌ `terraform apply` без `plan`
- ❌ State файл в Git
- ❌ Захардкоженные credentials в .tf файлах
