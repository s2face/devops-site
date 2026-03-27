# ТЗ для devops-writer: Урок 7 — HashiCorp Vault + Kubernetes

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 7 из 15 |
| **Тема** | Секреты в production: Vault + Kubernetes |
| **Хэштеги** | `#vault` `#secrets` `#kubernetes` `#security` `#hashicorp` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель развернёт HashiCorp Vault, настроит Kubernetes Auth Method и внедрит динамические секреты в поды через Vault Agent Injector или Secrets Store CSI Driver.

## Целевая аудитория
Senior DevOps / Security Engineer.

## Пререквизиты
- Level 3 уроки 1, 6: Helm, K8s RBAC, Level 2 урок 6: K8s Secrets

## Технический стек
- **Vault:** 1.15+, **vault-k8s** (Agent Injector), **Secrets Store CSI Driver**

## Требования к контенту
- [ ] Проблема K8s Secrets: plaintext в etcd
- [ ] Vault архитектура: storage backend, secrets engines, auth methods
- [ ] Установка Vault через Helm (dev и production режим)
- [ ] Kubernetes Auth Method: Vault ↔ K8s ServiceAccount
- [ ] KV secrets engine: v1 vs v2
- [ ] Vault Agent Injector: аннотации для автовнедрения
- [ ] Dynamic secrets: временные DB credentials
- [ ] External Secrets Operator как альтернатива

## Структура статьи

### H1: HashiCorp Vault: секреты в Kubernetes по-взрослому
### H2: Почему K8s Secrets недостаточно
### H2: Vault: установка и базовая настройка
```bash
helm install vault hashicorp/vault \
  --set server.ha.enabled=false \
  --set ui.enabled=true \
  --namespace vault --create-namespace
```
### H2: Kubernetes Auth Method
```bash
vault auth enable kubernetes
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc"
```
### H2: Vault Agent Injector — секреты прямо в pod
```yaml
# Аннотации на Pod
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "webapp"
  vault.hashicorp.com/agent-inject-secret-config.env: "secret/data/webapp/config"
```
### H2: Dynamic Database Credentials — временные пароли
### H2: External Secrets Operator как declarative альтернатива

## KPI качества
- Читатель настроил Vault Agent Injector и видит секреты в поде
- Схема: Vault + K8s Auth Method + ServiceAccount + Pod
- Сравнение Vault vs External Secrets Operator vs Sealed Secrets

## Антипаттерны
- ❌ Vault в dev-режиме в production
- ❌ Root token в приложении
- ❌ Vault без HA и backup в production
