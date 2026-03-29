# Monitoring with Prometheus and Grafana: A Technical Deep Dive

## 1. Monitoring Methodologies: RED vs. USE

Effective monitoring requires a structured approach. Two widely adopted frameworks are:

### USE Method (Resource-Oriented)
Focuses on hardware/infrastructure health. For every resource (CPU, Memory, Disk):
- **Utilization:** The percentage of time that the resource was busy (e.g., CPU at 80%).
- **Saturation:** The degree to which a resource has extra work it cannot service (e.g., CPU run queue length).
- **Errors:** The count of error events.

### RED Method (Service-Oriented)
Focuses on user experience and service health:
- **Rate:** The number of requests per second (e.g., HTTP throughput).
- **Errors:** The number of those requests that are failing.
- **Duration:** The amount of time those requests take (Latency).

---

## 2. Prometheus Architecture

Prometheus is a pull-based monitoring system designed for reliability and scalability.

- **Pull Model:** Unlike traditional "push" systems, Prometheus initiates connections to targets and "scrapes" metrics via HTTP (`/metrics` endpoint).
- **Service Discovery:** Automatically discovers targets (Kubernetes nodes, EC2 instances, Consul) to scrape.
- **TSDB (Time Series Database):** Optimized storage for timestamped numeric data. Data is stored on local disk in a custom format.
- **PromQL:** A powerful functional query language to aggregate and calculate metrics on the fly.
- **Scraping:** The process of fetching metrics from a target at regular intervals (defined in `scrape_interval`).

---

## 3. Metric Types

Prometheus defines four core metric types:

1. **Counter:** A cumulative metric that only increases or resets to zero on restart (e.g., `http_requests_total`).
2. **Gauge:** A single numerical value that can arbitrarily go up and down (e.g., `node_memory_Active_bytes`, `temperature`).
3. **Histogram:** Samples observations (usually request durations or response sizes) and counts them in configurable buckets. It also provides a sum of all observed values.
4. **Summary:** Similar to a Histogram, it calculates configurable quantiles (e.g., 0.95, 0.99) over a sliding time window.

---

## 4. Configuration: prometheus.yml

The `prometheus.yml` file is the heart of the configuration.

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

---

## 5. PromQL: Basic Queries

### CPU Usage (Percentage)
Calculate the average CPU usage across all cores, excluding idle time:
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### HTTP Error Rate (Percentage)
Calculate the percentage of 5xx errors over the last 5 minutes:
```promql
sum(rate(http_requests_total{status=~"5.."}[5m])) 
/ 
sum(rate(http_requests_total[5m])) * 100
```

---

## 6. Node Exporter

Node Exporter is the standard agent for monitoring *NIX kernels. It exposes hardware and OS metrics (CPU, RAM, Disk, Network, Load) in a format Prometheus can understand. It is typically run as a sidecar or a standalone binary on every server.

---

## 7. Grafana: Visualization

Grafana provides the "glass" to see your metrics.

1. **Connecting Data Source:**
   - Go to Configuration > Data Sources.
   - Select **Prometheus**.
   - URL: `http://prometheus:9090`.
   - Access: Server (Default).

2. **Creating a Dashboard:**
   - Use "Panels" to visualize specific queries.
   - Common panels: Time Series (Graph), Stat (Single Number), Gauge, Table.
   - Import existing dashboards (e.g., Dashboard ID `1860` for Node Exporter).

---

## 8. Alertmanager: Handling Alerts

Alertmanager handles alerts sent by Prometheus. It takes care of:
- **Deduplication:** Merging multiple identical alerts into one.
- **Grouping:** Sending one notification for multiple related alerts.
- **Routing:** Sending alerts to Slack, Email, PagerDuty, etc.

### Slack Routing Example (`alertmanager.yml`)
```yaml
route:
  receiver: 'slack-notifications'

receivers:
- name: 'slack-notifications'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    channel: '#monitoring-alerts'
    send_resolved: true
```

---

## 9. Full Docker Compose Stack

This setup uses Prometheus 2.47+ and Grafana 10.x.

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.47.2
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:10.2.0
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped

  node_exporter:
    image: prom/node-exporter:v1.6.1
    container_name: node_exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    restart: unless-stopped

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    container_name: cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"
    restart: unless-stopped

  blackbox_exporter:
    image: prom/blackbox-exporter:v0.24.0
    container_name: blackbox_exporter
    ports:
      - "9115:9115"
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.26.0
    container_name: alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

---

## 10. Alert Rules and Runbooks

Create a file `alert_rules.yml` for Prometheus:

```yaml
groups:
- name: critical_alerts
  rules:
  - alert: HostHighCpuLoad
    expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Host High CPU load (instance {{ $labels.instance }})"
      description: "CPU load is > 85%\n  VALUE = {{ $value }}\n  LABELS: {{ $labels }}"
      runbook_url: "https://wiki.example.com/runbooks/high-cpu-load"

  - alert: HttpErrorRateHigh
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 5
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "HTTP Error Rate High (instance {{ $labels.instance }})"
      description: "HTTP 5xx error rate is above 5%\n  VALUE = {{ $value }}\n  LABELS: {{ $labels }}"
      runbook_url: "https://wiki.example.com/runbooks/http-error-rate"
```

### Runbook Examples
- **High CPU Load:** Check for runaway processes using `top` or `htop`. Scale the instance if necessary.
- **HTTP Error Rate:** Check application logs for stack traces. Verify database connectivity and downstream service health.
