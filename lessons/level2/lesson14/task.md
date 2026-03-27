# ТЗ для devops-writer: Урок 14 — Мониторинг с Prometheus и Grafana

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 14 из 15 |
| **Тема** | Мониторинг с Prometheus и Grafana |
| **Хэштеги** | `#prometheus` `#grafana` `#monitoring` `#alertmanager` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель развернёт стек Prometheus + Grafana через Docker Compose, настроит сбор метрик с сервисов и создаст дашборд с алертами.

## Целевая аудитория
DevOps среднего уровня.

## Пререквизиты
- Level 2 уроки 1–2: Docker Compose, Networking

## Технический стек
- **Prometheus:** 2.47+, **Grafana:** 10.x
- **Exporters:** node_exporter, cadvisor, blackbox_exporter
- **Alertmanager**

## Требования к контенту
- [ ] Концепция мониторинга: RED (Rate/Errors/Duration) и USE (Utilization/Saturation/Errors)
- [ ] Архитектура Prometheus: Pull model, scraping, storage
- [ ] Типы метрик: counter, gauge, histogram, summary
- [ ] prometheus.yml: targets и scrape_configs
- [ ] PromQL: базовые запросы
- [ ] Node Exporter для системных метрик
- [ ] Grafana: подключение datasource, создание дашборда
- [ ] Alertmanager: правила алертов, маршрутизация в Slack

## Структура статьи

### H1: Prometheus + Grafana: мониторинг инфраструктуры с нуля
### H2: Зачем мониторинг и что такое RED/USE методологии
### H2: Разворачиваем стек через Docker Compose
```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports: ["9090:9090"]

  node-exporter:
    image: prom/node-exporter:latest
    pid: host
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
```
### H2: PromQL — язык запросов метрик
```promql
# CPU usage в процентах
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# HTTP error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```
### H2: Создаём дашборд в Grafana
### H2: Alertmanager: алерты в Slack

## KPI качества
- Работающий стек prometheus + grafana + alertmanager
- Минимум 3 PromQL запроса с объяснением
- Пример alert rule с маршрутизацией в Slack

## Антипаттерны
- ❌ Мониторинг без алертов
- ❌ Алерты без runbook (что делать при срабатывании)
- ❌ Сбор всех возможных метрик без отбора нужных
