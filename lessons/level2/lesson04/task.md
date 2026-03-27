# ТЗ для devops-writer: Урок 4 — Введение в Kubernetes

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 4 из 15 |
| **Тема** | Введение в Kubernetes: архитектура кластера |
| **Хэштеги** | `#kubernetes` `#k8s` `#orchestration` `#cluster` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель поймёт архитектуру Kubernetes, установит локальный кластер и запустит первое приложение.

## Целевая аудитория
DevOps, знающие Docker и Compose.

## Пререквизиты
- Level 2 уроки 1–2: Docker Compose и Networking

## Технический стек
- **Kubernetes:** 1.28+, **minikube** / **kind** для локального кластера
- **kubectl:** CLI-инструмент

## Требования к контенту
- [ ] Почему Docker Compose не хватает для production
- [ ] Архитектура кластера: Control Plane vs Worker Nodes
- [ ] Компоненты: kube-apiserver, etcd, kube-scheduler, kube-controller-manager, kubelet, kube-proxy
- [ ] Установка minikube и kubectl
- [ ] Базовые объекты: Pod, Node, Namespace
- [ ] `kubectl get`, `describe`, `logs`, `exec`
- [ ] Запуск первого Pod

## Структура статьи

### H1: Kubernetes с нуля: оркестрация контейнеров
### H2: Проблема Docker Compose в production
### H2: Архитектура Kubernetes
- Схема: Control Plane (API Server, etcd, Scheduler, Controller Manager) + Worker Nodes (kubelet, kube-proxy, container runtime)
### H2: Установка minikube
```bash
minikube start --driver=docker --cpus=2 --memory=4g
kubectl cluster-info
kubectl get nodes
```
### H2: Первый Pod
```bash
kubectl run nginx --image=nginx:alpine
kubectl get pods
kubectl describe pod nginx
kubectl logs nginx
```
### H2: Namespaces — логическое разделение ресурсов

## KPI качества
- Схема архитектуры кластера с описанием всех компонентов
- Читатель запустил minikube и первый Pod
- Таблица основных команд kubectl

## Антипаттерны
- ❌ Запуск Pod напрямую без Deployment в production
- ❌ Всё в namespace default
- ❌ Игнорирование resource limits
