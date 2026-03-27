# ТЗ для devops-writer: Урок 6 — ConfigMaps и Secrets в Kubernetes

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 6 из 15 |
| **Тема** | Конфигурация Kubernetes: ConfigMaps и Secrets |
| **Хэштеги** | `#kubernetes` `#configmap` `#secrets` `#k8s` `#configuration` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель научится передавать конфигурацию и секреты в поды через ConfigMap и Secret, монтировать их как файлы или переменные окружения.

## Целевая аудитория
DevOps, умеющие деплоить приложения в K8s.

## Пререквизиты
- Level 2 урок 5: Deployments и Services

## Технический стек
- **Kubernetes:** 1.28+, **kubectl**, **base64**

## Требования к контенту
- [ ] 12-factor app: конфигурация через среду
- [ ] ConfigMap: создание через YAML и kubectl create
- [ ] Монтирование ConfigMap как env vars и как volume (файл)
- [ ] Secret: типы (Opaque, TLS, dockerconfigjson)
- [ ] Создание Secret и base64-кодирование
- [ ] Монтирование Secret в Pod
- [ ] Обновление ConfigMap и перезагрузка Pod
- [ ] Ограничения встроенных Secrets (plaintext в etcd) — preview для Level 3 (Vault)

## Структура статьи

### H1: ConfigMaps и Secrets: конфигурация приложений в Kubernetes
### H2: Принцип 12-factor: конфиг отдельно от кода
### H2: ConfigMap — конфигурация без секретов
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  LOG_LEVEL: info
  config.yaml: |
    server:
      port: 8080
```
### H2: Монтирование ConfigMap в Pod
### H2: Secret — конфиденциальные данные
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_PASSWORD: "my-super-secret"
```
### H2: Почему встроенные Secrets небезопасны — и что с этим делать

## KPI качества
- Примеры обоих способов монтирования (env + volume)
- Команды создания через kubectl (imperative + declarative)
- Предупреждение о безопасности Secrets в etcd

## Антипаттерны
- ❌ Хранение секретов в ConfigMap
- ❌ Секреты как ENV без ограничения доступа через RBAC
- ❌ Коммит YAML с секретами в Git
