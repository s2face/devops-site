# ТЗ для devops-writer: Урок 12 — Multi-cloud и гибридные архитектуры

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 12 из 15 |
| **Тема** | Multi-cloud и гибридные архитектуры |
| **Хэштеги** | `#multicloud` `#hybrid` `#terraform` `#federation` `#k8s` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель разберётся в паттернах multi-cloud архитектур, инструментах управления несколькими облаками и настроит Kubernetes Federation или Cluster API.

## Целевая аудитория
Senior DevOps / Cloud Architect.

## Пререквизиты
- Level 2 уроки 9–10: Terraform, Level 3 урок 4: ArgoCD

## Технический стек
- **Terraform (multi-provider)**, **Cluster API**, **ArgoCD ApplicationSet**, **Crossplane**

## Требования к контенту
- [ ] Зачем multi-cloud: vendor lock-in, compliance, latency
- [ ] Стратегии: cloud-agnostic vs cloud-native
- [ ] Terraform multi-provider: AWS + GCP + Azure
- [ ] Kubernetes Federation vs отдельные кластеры
- [ ] ArgoCD ApplicationSet для multi-cluster деплоя
- [ ] Crossplane: управление облачными ресурсами из K8s
- [ ] Сложности multi-cloud: данные, latency, network egress costs
- [ ] Cloud-agnostic сервисы vs managed сервисы

## Структура статьи

### H1: Multi-cloud: управляем несколькими облаками
### H2: Зачем multi-cloud и какова цена?
### H2: Terraform для нескольких провайдеров
```hcl
terraform {
  required_providers {
    aws   = { source = "hashicorp/aws" }
    google = { source = "hashicorp/google" }
  }
}

provider "aws"    { region = "us-east-1" }
provider "google" { project = "my-project" region = "us-central1" }
```
### H2: ArgoCD ApplicationSet — деплой в N кластеров
```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
spec:
  generators:
  - clusters: {}
  template:
    spec:
      destination:
        server: '{{server}}'
        namespace: production
```
### H2: Crossplane: cloud resources как K8s объекты
### H2: Когда multi-cloud НЕ нужен — трезвая оценка

## KPI качества
- Сравнительная таблица: multi-cloud vs single-cloud
- Пример Terraform с двумя провайдерами
- Decision tree: когда выбирать multi-cloud

## Антипаттерны
- ❌ Multi-cloud ради multi-cloud без business case
- ❌ Игнорирование data egress costs между облаками
- ❌ Одинаковая архитектура во всех облаках без учёта возможностей каждого
