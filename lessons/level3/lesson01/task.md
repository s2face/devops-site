# ТЗ для devops-writer: Урок 1 — Kubernetes Helm

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 1 из 15 |
| **Тема** | Kubernetes Helm: управление чартами |
| **Хэштеги** | `#helm` `#kubernetes` `#charts` `#packaging` `#k8s` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель установит Helm, разберётся в структуре чарта, развернёт приложение из Helm Hub и создаст собственный чарт с шаблонизацией.

## Целевая аудитория
Senior DevOps, уверенно работающие с Kubernetes.

## Пререквизиты
- Level 2 уроки 4–6: Kubernetes Deployments, Services, ConfigMaps

## Технический стек
- **Helm:** 3.x, **Kubernetes:** 1.28+, **Artifact Hub**

## Требования к контенту
- [ ] Проблема: управление множеством YAML-манифестов
- [ ] Helm как пакетный менеджер для K8s
- [ ] Chart структура: Chart.yaml, values.yaml, templates/
- [ ] `helm install`, `upgrade`, `rollback`, `uninstall`, `list`
- [ ] Переменные и шаблонизация: `{{ .Values.* }}`, `{{ .Release.* }}`
- [ ] `helm template` — рендеринг без деплоя
- [ ] Создание собственного чарта: `helm create`
- [ ] Helm hooks: pre-install, post-upgrade
- [ ] Хранение чартов: OCI registry, Artifact Hub

## Структура статьи

### H1: Helm: пакетный менеджер для Kubernetes
### H2: Проблема «YAML hell» в Kubernetes
### H2: Структура Helm-чарта
```
mychart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── _helpers.tpl
    └── NOTES.txt
```
### H2: Установка чарта из Artifact Hub
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-redis bitnami/redis \
  --set auth.password=secretpass \
  --namespace cache --create-namespace
```
### H2: Создаём собственный чарт
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        resources: {{- toYaml .Values.resources | nindent 12 }}
```
### H2: Helm hooks и lifecycle management
### H2: Helm vs Kustomize — что когда использовать

## KPI качества
- Читатель создал собственный чарт и задеплоил приложение
- Пример values.yaml с inline comments
- Объяснение разницы Helm 2 vs Helm 3 (Tiller removed)

## Антипаттерны
- ❌ `helm install --set password=...` в истории команд
- ❌ Модификация чартов вместо использования values.yaml
- ❌ Игнорирование `helm diff` перед upgrade
