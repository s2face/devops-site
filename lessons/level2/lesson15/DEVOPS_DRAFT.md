# ELK Stack: Centralized Logging for DevOps

## The Problem: "Where are the logs?"

In a microservices architecture or even a small cluster of servers, logs are scattered across multiple instances, containers, and files. When an incident occurs, manually SSH-ing into each machine and running `tail -f` or `grep` is inefficient, slow, and prone to missing critical information. 

Centralized logging solves this by aggregating logs into a single, searchable store.

## ELK Stack Architecture

The standard modern ELK (Elasticsearch, Logstash, Kibana) pipeline, often including **Beats**, looks like this:

1.  **Beats (Filebeat):** Lightweight shippers installed on edge nodes. They collect logs (files, docker, system) and send them to Logstash or directly to Elasticsearch.
2.  **Logstash:** A server-side data processing pipeline that ingests data from multiple sources, transforms it (e.g., parsing JSON, enriching with GeoIP), and sends it to Elasticsearch.
3.  **Elasticsearch:** The heart of the stack. A distributed, RESTful search and analytics engine that stores and indexes all logs.
4.  **Kibana:** The visualization layer. Provides a web interface to explore, search, and visualize logs stored in Elasticsearch using KQL (Kibana Query Language).

**Data Flow:** `Application -> Filebeat -> Logstash -> Elasticsearch -> Kibana`

---

## Deploying ELK via Docker Compose

For development and small-scale testing, we can use a single-node Elasticsearch setup with security disabled for simplicity.

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  elasticsearch:
    image: elasticsearch:8.10.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - "9200:9200"
    networks:
      - elk

  logstash:
    image: logstash:8.10.0
    container_name: logstash
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
    environment:
      - "LS_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: kibana:8.10.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - elk

  filebeat:
    image: elastic/filebeat:8.10.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - logstash
    networks:
      - elk

networks:
  elk:
    driver: bridge
```

---

## Configuration Files

### 1. Filebeat Configuration (`filebeat.yml`)
Filebeat needs to be configured to collect Docker logs and forward them to Logstash.

```yaml
filebeat.inputs:
- type: container
  paths:
    - '/var/lib/docker/containers/*/*.log'

processors:
  - add_docker_metadata: ~

output.logstash:
  hosts: ["logstash:5044"]
```

### 2. Logstash Configuration (`logstash.conf`)
Logstash receives data from Filebeat, can perform transformations, and sends it to Elasticsearch.

```conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [container][image][name] =~ /app/ {
    json {
      source => "message"
      target => "app_data"
    }
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}
```

---

## Structured Logging: Why JSON?

Unstructured logs like `[INFO] 2023-10-27 User 123 logged in` are hard to search precisely. You have to use complex regex or expensive full-text searches.

**Structured Logging (JSON)** turns logs into data:
```json
{
  "timestamp": "2023-10-27T10:00:00Z",
  "level": "INFO",
  "user_id": 123,
  "event": "login",
  "status_code": 200
}
```
In Elasticsearch, this becomes a searchable document where `user_id` is an integer field. You can instantly filter for `user_id: 123` without scanning millions of strings.

---

## Kibana Discover & KQL Examples

Once logs are in Elasticsearch, you use **Data Views** (formerly Index Patterns) in Kibana to explore them.

**KQL (Kibana Query Language)** is a simple way to filter data:

*   **Find 5xx errors:**
    `http.response.status_code >= 500`
*   **Search for errors in a specific service:**
    `container.image.name : "my-backend-app" AND log.level : "error"`
*   **Find all logs containing a specific Trace ID:**
    `trace.id : "abc-123-xyz"`

---

## ELK vs. Grafana Loki

| Feature | ELK Stack | Grafana Loki |
| :--- | :--- | :--- |
| **Index Size** | Large (indexes full text) | Small (indexes only labels) |
| **Search Speed** | Extremely fast for full text | Slower for content, fast for labels |
| **Resources** | Resource-heavy (RAM/CPU) | Lightweight |
| **Use Case** | Complex analysis, security, metrics | Simple log aggregation, debugging |

**When to use ELK:** If you need powerful search capabilities, business intelligence, or handle massive amounts of diverse log data where content search is critical.
**When to use Loki:** If you are already using Prometheus/Grafana and need a cost-effective, easy-to-manage "grep-like" log solution for debugging.

---

## Anti-patterns and Best Practices

1.  **❌ No Heap Limits:** Running Elasticsearch without `ES_JAVA_OPTS` limits. ES will consume as much RAM as possible, potentially causing the host OS to OOM-kill other services.
    *   **✅ Fix:** Always set `-Xms` and `-Xmx` (usually 50% of available RAM).
2.  **❌ Unstructured Logs:** Writing raw strings to stdout. This makes it impossible to build dashboards or alerts based on specific fields.
    *   **✅ Fix:** Use JSON logging libraries (like `pino` for Node.js, `Logrus` for Go, or `python-json-logger`).
3.  **❌ No Retention Policy:** Storing logs forever until the disk is full.
    *   **✅ Fix:** Use **Index Lifecycle Management (ILM)** in Elasticsearch to automatically delete or archive indices older than N days.
4.  **❌ Skipping Logstash:** Sending logs directly from Filebeat to ES is fine for simple setups, but you lose the ability to enrich data (e.g., GeoIP, User-Agent parsing) later without modifying the app.
    *   **✅ Fix:** Use Logstash for complex pipelines.
