# ТЗ для devops-writer: Урок 4 — GitOps с ArgoCD

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 4 из 15 |
| **Тема** | GitOps с ArgoCD: декларативный деплой |
| **Хэштеги** | `#gitops` `#argocd` `#kubernetes` `#cd` `#declarative` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель установит ArgoCD, настроит App of Apps паттерн и автоматический sync приложений из Git-репозитория в Kubernetes.

## Целевая аудитория
Senior DevOps с опытом K8s.

## Пререквизиты
- Level 2 урок 5–6: K8s Deployments, Level 3 урок 1: Helm

## Технический стек
- **ArgoCD:** 2.9+, **Helm**, **Kustomize**, **Git**

## Требования к контенту
- [ ] GitOps принципы: Git как единый источник правды
- [ ] Push vs Pull model в CD
- [ ] Установка ArgoCD через Helm
- [ ] ArgoCD Application CRD
- [ ] Sync политики: manual и automated (self-heal, prune)
- [ ] App of Apps паттерн
- [ ] ArgoCD Image Updater — автообновление образов
- [ ] RBAC в ArgoCD, SSO интеграция
- [ ] Rollback через Git revert

## Структура статьи

### H1: GitOps с ArgoCD: Git как источник правды для K8s
### H2: Что такое GitOps и почему это лучше
- Схема: разработчик → Git → ArgoCD → K8s (pull model)
### H2: Установка и настройка ArgoCD
```bash
helm install argocd argo/argo-cd \
  --namespace argocd --create-namespace \
  -f values.yaml
```
### H2: Первое ArgoCD Application
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-webapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-configs
    targetRevision: main
    path: apps/webapp
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
```
### H2: App of Apps — управляем кластером как кодом
### H2: ArgoCD Image Updater — CI/CD без secrets в ArgoCD

## KPI качества
- Читатель настроил automated sync и проверил self-heal
- Схема GitOps workflow: commit → sync → deploy
- Rollback через `git revert` с наблюдением за ArgoCD

## Антипаттерны
- ❌ Ручной `kubectl apply` в GitOps кластере
- ❌ Секреты в Git-репозитории (нужен Sealed Secrets или External Secrets)
- ❌ Одно ArgoCD для dev и prod без разделения проектов
