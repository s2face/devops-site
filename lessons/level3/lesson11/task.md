# ТЗ для devops-writer: Урок 11 — Disaster Recovery

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 11 из 15 |
| **Тема** | Disaster Recovery: стратегии резервирования |
| **Хэштеги** | `#dr` `#backup` `#rto` `#rpo` `#velero` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель разработает DR-стратегию для K8s-кластера, настроит резервное копирование через Velero и проведёт учения по восстановлению.

## Целевая аудитория
Senior DevOps / Infrastructure Engineer.

## Пререквизиты
- Level 3 уроки 4, 6: ArgoCD, RBAC

## Технический стек
- **Velero:** 1.12+, **AWS S3 / MinIO**, **etcd backup**

## Требования к контенту
- [ ] RPO и RTO: как рассчитать допустимые потери и время
- [ ] DR-стратегии: Backup/Restore, Pilot Light, Warm Standby, Multi-site Active
- [ ] Velero: backup K8s ресурсов и PV
- [ ] Расписание бэкапов и retention намного
- [ ] etcd backup — бэкап состояния кластера
- [ ] DR учения (disaster drill): практика восстановления
- [ ] Multi-region стратегия для critical workloads
- [ ] Backup as Code: декларативные BackupSchedule

## Структура статьи

### H1: Disaster Recovery в Kubernetes: от теории к практике
### H2: RPO и RTO — определяем требования к восстановлению
- Таблица: DR-стратегия, RTO, RPO, стоимость
### H2: Velero: backup и restore для Kubernetes
```bash
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.8.0 \
  --bucket my-velero-backups \
  --backup-location-config region=us-east-1

# Создать бэкап
velero backup create production-backup \
  --include-namespaces production \
  --ttl 720h

# Расписание
velero schedule create daily-backup \
  --schedule="0 2 * * *" \
  --include-namespaces production
```
### H2: etcd backup — спасаем control plane
### H2: DR-учения: пошаговый сценарий восстановления
### H2: Рекомендации по multi-region для critical workloads

## KPI качества
- Читатель создал бэкап и успешно восстановил неймспейс
- Таблица стратегий DR с RPO/RTO/стоимостью
- Чеклист DR-учений с шагами

## Антипаттерны
- ❌ Бэкап без регулярных проверок восстановления
- ❌ Хранение бэкапов в том же облачном регионе
- ❌ DR без задокументированных runbook'ов
