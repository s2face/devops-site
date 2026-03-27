# ТЗ для devops-writer: Урок 2 — Kubernetes Ingress и TLS

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 2 из 15 |
| **Тема** | Kubernetes Ingress и TLS терминация |
| **Хэштеги** | `#kubernetes` `#ingress` `#tls` `#nginx` `#cert-manager` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель настроит Ingress Controller, настроит маршрутизацию трафика по хосту/пути и автоматизирует получение TLS-сертификатов через cert-manager + Let's Encrypt.

## Целевая аудитория
Senior DevOps, работающие с Kubernetes в production.

## Пререквизиты
- Level 2 урок 5: Kubernetes Services, Level 3 урок 1: Helm

## Технический стек
- **NGINX Ingress Controller**, **cert-manager**, **Let's Encrypt**
- **Kubernetes:** 1.28+

## Требования к контенту
- [ ] Зачем Ingress — vs NodePort/LoadBalancer
- [ ] Установка NGINX Ingress Controller через Helm
- [ ] Ingress ресурс: host-based и path-based routing
- [ ] TLS termination в Ingress
- [ ] cert-manager: установка и ClusterIssuer для Let's Encrypt
- [ ] Аннотации Ingress: rate limiting, auth, rewrite
- [ ] Gateway API как замена Ingress (обзор)

## Структура статьи

### H1: Kubernetes Ingress: маршрутизация и TLS для production
### H2: Проблема: LoadBalancer для каждого сервиса
### H2: Установка NGINX Ingress Controller
```bash
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```
### H2: Ingress-маршрутизация по хосту и пути
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls
```
### H2: cert-manager: автоматические TLS-сертификаты
### H2: Gateway API — будущее Ingress в K8s

## KPI качества
- Читатель настроил автоматический TLS через cert-manager
- Объяснение аннотаций NGINX Ingress
- Схема: клиент → Ingress Controller → Services → Pods

## Антипаттерны
- ❌ Self-signed сертификаты в production
- ❌ Один Ingress Controller для dev и prod в одном кластере
- ❌ Открытый Ingress без rate limiting
