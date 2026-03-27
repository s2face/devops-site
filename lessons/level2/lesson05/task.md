# ТЗ для devops-writer: Урок 5 — Kubernetes Pods, Deployments, Services

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 5 из 15 |
| **Тема** | Kubernetes: Pods, Deployments, Services |
| **Хэштеги** | `#kubernetes` `#deployment` `#service` `#k8s` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель освоит ключевые объекты Kubernetes: задеплоит приложение через Deployment, откроет доступ через Service и выполнит rolling update.

## Целевая аудитория
DevOps, знающие архитектуру K8s (урок 4).

## Пререквизиты
- Level 2 урок 4: Kubernetes basics

## Технический стек
- **Kubernetes:** 1.28+, **kubectl**, **YAML**-манифесты

## Требования к контенту
- [ ] Pod vs Deployment: зачем абстракция
- [ ] ReplicaSet — поддержание числа реплик
- [ ] Deployment YAML: полная структура с пояснениями
- [ ] Rolling Update и Rollback
- [ ] Service типы: ClusterIP, NodePort, LoadBalancer
- [ ] Labels и Selectors — связка Deployment ↔ Service
- [ ] `kubectl apply`, `rollout status`, `rollout undo`
- [ ] Liveness и Readiness Probes

## Структура статьи

### H1: Deployments и Services: деплоим приложение в K8s
### H2: Почему не запускать Pod напрямую?
### H2: Deployment — декларативное управление репликами
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /healthz
            port: 80
```
### H2: Service: открываем доступ к приложению
### H2: Rolling Update и Rollback
```bash
kubectl set image deployment/webapp webapp=nginx:1.26
kubectl rollout status deployment/webapp
kubectl rollout undo deployment/webapp
```
### H2: Probes: liveness и readiness

## KPI качества
- Полные YAML-манифесты Deployment + Service
- Демонстрация rolling update с откатом
- Объяснение каждого поля YAML

## Антипаттерны
- ❌ Deployment без resource limits
- ❌ Deployment без readiness probe
- ❌ Использование NodePort в production вместо Ingress
