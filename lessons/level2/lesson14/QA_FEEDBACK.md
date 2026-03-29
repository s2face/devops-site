# QA Feedback: Prometheus + Grafana Article Review

**Reviewer:** Junior QA
**Status:** Needs Revision
**Date:** 2023-10-27

## 1. Technical Errors & Missing Instructions

### 1.1. Missing Configuration Files (Critical)
The `docker-compose.yaml` file mounts two local configuration files:
- `./alert_rules.yml`
- `./alertmanager.yml`

However, the article **does not provide the content** for these files.
- **Impact:** When a beginner runs `docker-compose up`, Docker will either fail to find these files or (on some systems) create them as **directories**, causing Prometheus and Alertmanager to crash on startup.
- **Recommendation:** Provide basic working versions of `alert_rules.yml` and `alertmanager.yml`.

### 1.2. Incomplete Alert Rule Snippet
The "Пример продвинутого правила алертов" section provides a YAML snippet that starts directly with `- alert: HighMemoryUsage`.
- **Impact:** Prometheus requires a specific hierarchy (`groups:` -> `name:` -> `rules:`). If a beginner copies this snippet into `alert_rules.yml`, Prometheus will fail to parse it.
- **Recommendation:** Provide the full file structure for `alert_rules.yml`.

### 1.3. Missing Alertmanager Slack Configuration
The article's checklist at the end asks the user to "Настройте хотя бы один алерт в Slack", but the article provides **no configuration examples** for `alertmanager.yml` or how to set up a Slack webhook.
- **Impact:** A beginner will be unable to complete the checklist.
- **Recommendation:** Add a section with an example `alertmanager.yml` containing a Slack receiver.

## 2. Beginner Confusion & UX Issues

### 2.1. Grafana Setup Gap
The section "Создаём дашборд в Grafana" explains principles but skips the **actual first step**: connecting the Prometheus Data Source.
- **Point of Confusion:** A beginner won't know they need to navigate to "Data Sources", select Prometheus, and enter `http://prometheus:9090` (the internal Docker network URL).
- **Recommendation:** Add a short step-by-step list on how to connect the data source.

### 2.2. PromQL Complexity
The article introduces `rate`, `sum`, and `irate`, but the `docker-compose.yaml` doesn't explain how to verify if metrics are actually arriving before jumping into complex queries.
- **Recommendation:** Suggest checking the "Targets" page in the Prometheus UI (`http://localhost:9090/targets`) first.

### 2.3. Prometheus Target Confusion
In `prometheus.yml`, the target for Prometheus itself is `localhost:9090`. While technically correct inside the container, for a beginner it might be confusing why we use `localhost` for Prometheus but `node_exporter:9100` for the exporter.
- **Recommendation:** Use `prometheus:9090` for consistency across the Docker network.

## 3. Compliance with Task Requirements (task.md)

### 3.1. Word Count Discrepancy
- **Requirement:** 2500–3000 words.
- **Current State:** Approximately 1200–1300 words.
- **Verdict:** The article is significantly shorter than requested and lacks the depth expected for a "Deep Dive" (Глубокое погружение).

### 3.2. Missing Features
- **Requirement:** "Grafana: подключение datasource". (Missing/Incomplete)
- **Requirement:** "Alertmanager: маршрутизация в Slack". (Mentioned but no code provided)

## 4. Points of Improvement

1.  **Add a Troubleshooting Section:** Common issues like "Target is DOWN", "Docker volume permission errors", or "Grafana cannot connect to Prometheus".
2.  **Provide a Full "Ready-to-Run" Setup:** Ensure that if a user creates the files listed, the environment actually starts.
3.  **Expand on PromQL:** Add more basic examples (e.g., "How to see current RAM usage in GB") before moving to percentages and rates.
4.  **Include Screenshots (Placeholders):** Beginners benefit greatly from seeing what the Grafana UI should look like during the setup.

## 5. Conclusion
The article provides a good theoretical overview and a solid `docker-compose.yaml` base, but it is **not yet "beginner-ready"** due to missing configuration files and incomplete setup steps. It also fails the word count requirement of the original task.
