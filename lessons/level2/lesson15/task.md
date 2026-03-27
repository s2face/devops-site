# ТЗ для devops-writer: Урок 15 — ELK Stack: централизованное логирование

## Метаданные
| Поле | Значение |
|------|----------|
| **Уровень** | Level 2 — Intermediate |
| **Номер урока** | 15 из 15 |
| **Тема** | Централизованное логирование: ELK Stack |
| **Хэштеги** | `#elk` `#elasticsearch` `#kibana` `#logstash` `#filebeat` |
| **Объём** | 2500–3000 слов |

## Цель урока
Читатель развернёт ELK Stack (Elasticsearch + Logstash + Kibana) и Filebeat, соберёт логи нескольких сервисов и настроит поиск через Kibana.

## Целевая аудитория
DevOps среднего уровня.

## Пререквизиты
- Level 2 уроки 1–2: Docker Compose, Level 2 урок 14: мониторинг

## Технический стек
- **Elasticsearch:** 8.x, **Kibana:** 8.x, **Filebeat:** 8.x
- **Альтернативы:** Loki + Promtail + Grafana (обзор)

## Требования к контенту
- [ ] Проблема логирования: разрозненные логи на N серверах
- [ ] Архитектура ELK: Beat → Logstash → Elasticsearch → Kibana
- [ ] Развёртывание через Docker Compose (минимальный конфиг)
- [ ] Filebeat: конфигурация inputs и outputs
- [ ] Structured logging: JSON-формат логов
- [ ] Kibana: Discover, фильтры, KQL
- [ ] Index patterns и Data Views
- [ ] Loki как легковесная альтернатива (обзор)

## Структура статьи

### H1: ELK Stack: агрегация и анализ логов для DevOps
### H2: Проблема «где искать ошибки?»
### H2: Архитектура ELK Stack
- Схема: приложение → Filebeat → Logstash → Elasticsearch → Kibana
### H2: Разворачиваем ELK через Docker Compose
```yaml
services:
  elasticsearch:
    image: elasticsearch:8.10.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ports: ["9200:9200"]

  kibana:
    image: kibana:8.10.0
    ports: ["5601:5601"]
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200

  filebeat:
    image: elastic/filebeat:8.10.0
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
```
### H2: Filebeat: собираем логи Docker-контейнеров
### H2: Kibana Discover: ищем ошибки в логах
### H2: Loki — когда ELK избыточен

## KPI качества
- Читатель видит логи своих контейнеров в Kibana
- KQL-запрос для поиска ошибок (http.response.status_code: 5*)
- Сравнение ELK vs Loki+Grafana: когда что использовать

## Антипаттерны
- ❌ Elasticsearch без heap limits (убивает сервер)
- ❌ Логи в неструктурированном формате (printf-style)
- ❌ Хранение логов без retention policy (диск переполняется)
