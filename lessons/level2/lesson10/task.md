# ТЗ для devops-writer: Урок 10 — Terraform State и Remote Backend

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 10 из 15 |
| **Тема** | Terraform State и remote backend |
| **Хэштеги** | `#terraform` `#state` `#backend` `#s3` `#teamwork` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель настроит remote backend для Terraform state в S3+DynamoDB (или аналоге), поймёт работу в команде с Terraform и освоит workspaces и modules.

## Целевая аудитория
DevOps, установившие и запустившие Terraform (урок 9).

## Пререквизиты
- Level 2 урок 9: Terraform basics

## Технический стек
- **Terraform:** 1.6+, **AWS S3 + DynamoDB** или **Terraform Cloud**

## Требования к контенту
- [ ] Проблемы локального state: конкурентность, потеря
- [ ] Настройка S3 backend с state locking через DynamoDB
- [ ] `terraform workspace` — изолированные окружения
- [ ] Terraform модули: local и remote (Terraform Registry)
- [ ] Создание reusable модуля
- [ ] `terraform import` — импорт существующих ресурсов
- [ ] `terraform taint` и `terraform state` команды
- [ ] `terraform fmt`, `validate`, `terraform-docs`

## Структура статьи

### H1: Terraform в команде: state, backend и модули
### H2: Проблема локального state в команде
### H2: Remote backend: S3 + DynamoDB
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}
```
### H2: Workspaces — dev, staging, production
### H2: Модули — переиспользуем код
### H2: terraform import — берём под контроль существующее

## KPI качества
- Пример настройки S3 backend с блокировкой
- Структура модуля с inputs и outputs
- Таблица полезных terraform команд

## Антипаттерны
- ❌ Один workspace для всех окружений
- ❌ Модули без документации переменных
- ❌ Ручное редактирование state файла
