# ТЗ для devops-writer: Урок 9 — Chaos Engineering

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 9 из 15 |
| **Тема** | Chaos Engineering: принципы и практика |
| **Хэштеги** | `#chaos` `#resilience` `#chaosmonkey` `#litmus` `#sre` |
| **Объём** | 2000–2500 слов |

## Цель урока
Читатель поймёт принципы Chaos Engineering, проведёт первые эксперименты с Chaos Mesh или Litmus в K8s и научится создавать гипотезы устойчивости.

## Целевая аудитория
Senior DevOps / SRE.

## Пререквизиты
- Level 2 урок 14: мониторинг Prometheus/Grafana
- Level 3 уроки 4–5: ArgoCD, Istio

## Технический стек
- **Chaos Mesh** или **Litmus Chaos**, **Kubernetes**

## Требования к контенту
- [ ] Принципы Chaos Engineering (Netflix Chaos Monkey история)
- [ ] Steady State Hypothesis
- [ ] GameDay — организация учений
- [ ] Виды экспериментов: pod kill, network partition, CPU stress, disk fill
- [ ] Chaos Mesh: установка и первый эксперимент
- [ ] PodChaos, NetworkChaos, StressChaos ресурсы
- [ ] Blast radius — контроль масштаба эксперимента
- [ ] Safety механизмы: circuit breaker, rollback

## Структура статьи

### H1: Chaos Engineering: ломаем production осознанно
### H2: «Что, если» — почему нужен хаос
### H2: Принципы Chaos Engineering
1. Определить Steady State
2. Выдвинуть гипотезу
3. Внести контролируемый хаос
4. Опровергнуть или подтвердить
### H2: Установка Chaos Mesh
```bash
helm install chaos-mesh chaos-mesh/chaos-mesh \
  --namespace chaos-mesh --create-namespace \
  --set chaosDaemon.runtime=containerd
```
### H2: Первый эксперимент: случайное убийство pod
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-kill-experiment
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces: ["production"]
    labelSelectors:
      app: webapp
  scheduler:
    cron: "@every 5m"
```
### H2: NetworkChaos: симуляция задержки и потери пакетов
### H2: GameDay: как провести учения резистентности

## KPI качества
- Читатель провёл эксперимент и измерил влияние на Prometheus метрики
- Шаблон GameDay сценария
- Описание blast radius и safety механизмов

## Антипаттерны
- ❌ Хаос-эксперименты без мониторинга и rollback
- ❌ Эксперименты в production без согласования
- ❌ Эксперимент без Steady State гипотезы
