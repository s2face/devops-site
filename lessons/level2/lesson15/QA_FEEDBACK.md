# QA Feedback: ELK Stack Article Review

**Reviewer:** Junior QA (Learner Validation)
**Status:** Requires Fixes

## Overall Impression
The article is well-structured and provides a solid theoretical foundation for understanding the ELK stack. The use of Docker Compose for the practical part is appropriate for the target audience. However, there are several "blind spots" where a student might get stuck or confused.

## 1. Typos & Formatting
*   **Conclusion:** In the last paragraph, the word `пайплайт` is used instead of `пайплайн` ("Правильно настроенный пайплайт сборки логов...").
*   **Consistent Terminology:** The article switches between "Elastic Stack" and "ELK Stack". While explained, sticking to one primary term in instructions would be clearer.

## 2. Missing Instructions & Practical Gaps
*   **Startup Commands:** The article provides a `docker-compose.yml` but never explicitly mentions the command to start it (`docker compose up -d`). A beginner might not know this.
*   **File Preparation:** It is not explicitly stated that the user MUST create `filebeat.yml` and `logstash.conf` in the same directory *before* running the Docker Compose command. If they don't, Docker might create directories instead of files for the volume mounts, leading to errors.
*   **Testing the Setup:** There is no "Verification" step with a sample log generator. A student will see an empty Kibana. 
    *   *Suggestion:* Add a simple one-liner to run a "chatty" container that produces JSON logs, e.g.:
        `docker run --name logger-test -d busybox sh -c 'while true; do echo "{\"message\": \"Test log\", \"level\": \"info\", \"user_id\": 123}"; sleep 5; done'`

## 3. Potential Sticking Points (Student "Traps")
*   **`vm.max_map_count` Location:** This is mentioned in the "Troubleshooting" section at the end. However, on most Linux distributions, Elasticsearch will fail to start immediately without this. It should be moved to a "Prerequisites" or "Before You Start" section to prevent frustration.
*   **Hardware Requirements:** The article mentions 2GB RAM for ES, but the entire stack (ES + Kibana + Logstash + Filebeat) will realistically require ~4GB of free RAM. Students on 4GB total RAM machines (common for entry-level VPS or old laptops) will experience system freezes. This should be warned more prominently.
*   **Logstash Config Clarity:** In `logstash.conf`, the Grok pattern `%{COMBINEDAPACHELOG}` is used. A beginner won't know where this comes from or what it parses. A brief mention that these are "built-in patterns" would help.

## 4. Missing "Next Steps"
*   The article ends with "Conclusion" and "Antipatterns". It lacks a "What's Next?" section.
    *   *Suggestion:* Recommend exploring **Elastic Alerts**, **Uptime monitoring**, or **APM (Application Performance Monitoring)** to give the student a roadmap for further learning.

## 5. Complexity without Examples
*   **ILM (Index Lifecycle Management):** This is mentioned as a "Best Practice" but no configuration snippet or UI path is provided. Since disk overflow is a major issue with ELK, a small example of a retention policy would be very valuable.

---
**Summary for Technical Writer:**
The article is 85% there. Fix the "пайплайт" typo, move the `vm.max_map_count` fix to the beginning, add a sample log-generating command for testing, and explicitly list the file creation steps.
