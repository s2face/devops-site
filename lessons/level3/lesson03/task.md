# ТЗ для devops-writer: Урок 3 — Горизонтальное масштабирование в Kubernetes (HPA/VPA)

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 3 из 15 |
| **Тема** | Горизонтальное масштабирование в Kubernetes: HPA и VPA |
| **Хэштеги** | `#kubernetes` `#hpa` `#vpa` `#scaling` `#keda` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель настроит автоматическое масштабирование приложений в Kubernetes через HPA (по CPU/памяти) и познакомится с VPA и KEDA (event-driven autoscaler).

## Целевая аудитория
Senior DevOps, настраивающие production K8s.

## Пререквизиты
- Level 2 урок 5: Deployments и Services, Level 3 урок 1: Helm

## Технический стек
- **Kubernetes HPA v2**, **Metrics Server**, **VPA**, **KEDA**

## Требования к контенту
- [ ] Зачем нужен autoscaling: peak load, экономия ресурсов
- [ ] Metrics Server: установка и принцип работы
- [ ] HPA based on CPU/Memory
- [ ] `kubectl top pods/nodes`
- [ ] HPA v2 с custom metrics
- [ ] VPA: Vertical Pod Autoscaler — когда нужен
- [ ] Cluster Autoscaler — масштабирование нод
- [ ] KEDA: масштабирование по внешним событиям (очередь, Kafka, cron)

## Структура статьи

### H1: Автомасштабирование в Kubernetes: HPA, VPA и KEDA
### H2: Зачем нужен autoscaling — peak traffic без переплат
### H2: Установка Metrics Server
### H2: Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: webapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: webapp
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 512Mi
```
### H2: Нагрузочное тестирование и наблюдение за масштабированием
```bash
kubectl run -i --tty load-generator --rm --image=busybox \
  -- /bin/sh -c "while true; do wget -q -O- http://webapp; done"
kubectl get hpa webapp-hpa --watch
```
### H2: VPA — оптимизируем requests/limits
### H2: KEDA — масштабирование по очереди сообщений

## KPI качества
- Читатель запустил HPA и проверил автомасштабирование под нагрузкой
- Таблица: HPA vs VPA vs KEDA — когда что выбрать
- Предупреждение о конфликте HPA и VPA

## Антипаттерны
- ❌ Использование HPA без resource requests в Deployment
- ❌ minReplicas: 1 для критичных сервисов
- ❌ HPA и VPA одновременно без VPA "Off" mode
