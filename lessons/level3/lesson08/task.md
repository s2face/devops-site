# ТЗ для devops-writer: Урок 8 — Observability: трейсинг с OpenTelemetry

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 3 — Advanced |
| **Номер урока** | 8 из 15 |
| **Тема** | Observability: распределённый трейсинг с Jaeger/OpenTelemetry |
| **Хэштеги** | `#observability` `#opentelemetry` `#jaeger` `#tracing` `#otel` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель поймёт три столпа observability (metrics, logs, traces), настроит OpenTelemetry Collector и Jaeger и проинструментирует приложение.

## Целевая аудитория
Senior DevOps / SRE-инженер.

## Пререквизиты
- Level 2 урок 14: Prometheus + Grafana, Level 2 урок 15: ELK

## Технический стек
- **OpenTelemetry Collector**, **Jaeger**, **Prometheus**, **Grafana Tempo**

## Требования к контенту
- [ ] Три столпа observability: Metrics, Logs, Traces
- [ ] Distributed Tracing: spans, trace ID, context propagation
- [ ] OpenTelemetry: история (OpenCensus + OpenTracing → OTEL)
- [ ] OTLP протокол
- [ ] OpenTelemetry Collector: receivers, processors, exporters
- [ ] Инструментирование приложения (Python/Go/Node.js)
- [ ] Jaeger: развёртывание и UI
- [ ] Grafana Tempo как альтернатива

## Структура статьи

### H1: Distributed Tracing с OpenTelemetry и Jaeger
### H2: Три столпа Observability — чем отличается трейсинг
- Таблица: Metrics vs Logs vs Traces
### H2: Как работает распределённый трейсинг
- Схема: запрос через сервисы A → B → C, trace ID
### H2: OTel Collector — универсальный агрегатор
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  batch:

exporters:
  jaeger:
    endpoint: jaeger:14250
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger]
```
### H2: Инструментирование Python-приложения
### H2: Jaeger UI: анализируем трейсы

## KPI качества
- Рабочий стек OTel Collector + Jaeger через Docker Compose
- Пример инструментированного Python/Node.js приложения
- Пример анализа узкого места по waterfall в Jaeger UI

## Антипаттерны
- ❌ Tracing без sampling strategy (100% запросов в prod)
- ❌ Игнорирование context propagation через HTTP headers
- ❌ Кастомный агент трейсинга вместо OTEL SDK
