# ТЗ для devops-writer: Урок 14 — FinOps: управление стоимостью облака

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 14 из 15 |
| **Тема** | FinOps: управление стоимостью облачной инфраструктуры |
| **Хэштеги** | `#finops` `#cloud-cost` `#kubernetes` `#rightsizing` `#spot` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель освоит практики FinOps: анализ облачных затрат, rightsizing, spot-инстансы, и настроит Kubecost для K8s cost allocation.

## Целевая аудитория
Senior DevOps / Cloud Engineer.

## Пререквизиты
- Level 2 уроки 4–5: Kubernetes, Level 2 урок 9: Terraform

## Технический стек
- **Kubecost**, **AWS Cost Explorer / GCP Cost Management**, **OpenCost**

## Требования к контенту
- [ ] FinOps фреймворк: Inform → Optimize → Operate
- [ ] Анализ затрат: Cost Explorer, billing dashboards
- [ ] Rightsizing: resource requests vs actual usage
- [ ] Spot/Preemptible инстансы: экономия до 90%
- [ ] Reserved Instances и Savings Plans
- [ ] Kubernetes cost allocation с Kubecost
- [ ] Tagging strategy для cost attribution
- [ ] Автоматическое отключение dev-окружений по расписанию

## Структура статьи

### H1: FinOps для DevOps: контролируем затраты на облако
### H2: Почему облачные счета выходят из-под контроля
### H2: FinOps фреймворк — три фазы
### H2: Rightsizing: платим за то, что нужно
```bash
# Kubectl top для анализа реального потребления
kubectl top pods --all-namespaces --sort-by=cpu | head -20

# VPA recommendation mode
kubectl describe vpa webapp-vpa
```
### H2: Spot-инстансы в Kubernetes
```yaml
# Node selector для spot нод
spec:
  nodeSelector:
    kubernetes.io/lifecycle: spot
  tolerations:
  - key: "spot-instance"
    operator: "Exists"
    effect: "NoSchedule"
```
### H2: Kubecost: детальный cost breakdown по namespace
### H2: Таблица экономии: Reserved vs On-Demand vs Spot

## KPI качества
- Конкретные числа экономии от spot/reserved (% и $)
- Tagging стратегия с примером для AWS/GCP
- Скрипт автоматического выключения dev-окружений в нерабочее время

## Антипаттерны
- ❌ Отсутствие tagging стратегии (не можем атрибутировать стоимость)
- ❌ Spot-инстансы для stateful workloads без PodDisruptionBudget
- ❌ Rightsizing без анализа пиковой нагрузки
