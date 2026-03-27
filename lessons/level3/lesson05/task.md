# ТЗ для devops-writer: Урок 5 — Service Mesh: Istio основы

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 5 из 15 |
| **Тема** | Service Mesh: Istio основы |
| **Хэштеги** | `#istio` `#service-mesh` `#kubernetes` `#mtls` `#observability` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель установит Istio, настроит mTLS между сервисами, traffic splitting для canary-деплоя и познакомится с observability через Kiali.

## Целевая аудитория
Senior DevOps с глубоким опытом Kubernetes.

## Пререквизиты
- Level 3 уроки 1–2: Helm, Ingress

## Технический стек
- **Istio:** 1.20+, **istioctl**, **Kiali**, **Jaeger**

## Требования к контенту
- [ ] Проблема: сквозные задачи (mTLS, observability, retry) в каждом сервисе
- [ ] Service Mesh архитектура: control plane (istiod) и data plane (Envoy proxies)
- [ ] Установка Istio через istioctl
- [ ] Sidecar injection: namespace labeling
- [ ] VirtualService и DestinationRule
- [ ] Traffic splitting: canary deployment (90/10)
- [ ] mTLS: PeerAuthentication
- [ ] Observability: Kiali dashboard, Jaeger трейсинг

## Структура статьи

### H1: Istio Service Mesh: безопасность и observability для K8s
### H2: Что такое Service Mesh и зачем он нужен
- Схема: sidecar proxy перехватывает весь трафик
### H2: Установка Istio
```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```
### H2: Traffic Management: VirtualService
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: webapp
spec:
  hosts: ["webapp"]
  http:
  - route:
    - destination:
        host: webapp
        subset: v1
      weight: 90
    - destination:
        host: webapp
        subset: v2
      weight: 10
```
### H2: mTLS — шифрование service-to-service
### H2: Kiali и Jaeger: видим граф сервисов и трейсы

## KPI качества
- Читатель настроил canary deployment с traffic splitting
- Схема Istio control plane + Envoy sidecar
- Пример PeerAuthentication для mTLS

## Антипаттерны
- ❌ Istio в маленьком кластере (высокий overhead)
- ❌ Permissive mTLS mode как постоянная настройка
- ❌ VirtualService без DestinationRule
