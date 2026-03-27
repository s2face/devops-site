# ТЗ для devops-writer: Урок 6 — Kubernetes RBAC и безопасность кластера

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 6 из 15 |
| **Тема** | Kubernetes RBAC и безопасность кластера |
| **Хэштеги** | `#kubernetes` `#rbac` `#security` `#psp` `#k8s` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель настроит RBAC в Kubernetes, создаст роли с минимальными привилегиями, настроит Pod Security Standards и audit logging.

## Целевая аудитория
Senior DevOps, ответственные за безопасность кластера.

## Пререквизиты
- Level 2 уроки 5–6: Deployments, ConfigMaps/Secrets

## Технический стек
- **Kubernetes RBAC:** Role, ClusterRole, RoleBinding, ClusterRoleBinding
- **Pod Security Standards (PSS)**, **Audit Policy**

## Требования к контенту
- [ ] Принцип минимальных привилегий в K8s
- [ ] ServiceAccount: для чего приложениям нужны права
- [ ] Role vs ClusterRole, RoleBinding vs ClusterRoleBinding
- [ ] Создание пользователя с ограниченным доступом
- [ ] Pod Security Standards: baseline, restricted, privileged
- [ ] Network Policies: изоляция pod-to-pod трафика
- [ ] Audit Logging в K8s
- [ ] `kubectl auth can-i` — проверка прав

## Структура статьи

### H1: Kubernetes RBAC: принцип минимальных привилегий
### H2: Как K8s контролирует доступ — AuthN vs AuthZ
### H2: ServiceAccount и его права
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: webapp-sa
  namespace: production
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: webapp-role
  namespace: production
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
```
### H2: Network Policy — запрещаем лишний трафик
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
```
### H2: Pod Security Standards в namespace
### H2: Проверяем права с kubectl auth can-i

## KPI качества
- Полный RBAC пример: sa → role → rolebinding → pod
- Пример Network Policy deny-all с allowlist
- Чеклист безопасности K8s кластера

## Антипаттерны
- ❌ ClusterAdmin для приложения
- ❌ `automountServiceAccountToken: true` по умолчанию
- ❌ Отсутствие Network Policies (flat network)
