# Lesson 1: Introduction to DevOps

## 1. Historical Context: The Road to DevOps
Before DevOps, the software industry struggled with slow release cycles and frequent failures.

*   **Waterfall Model:** Traditional software development was linear and sequential. Each phase (Requirements -> Design -> Implementation -> Verification -> Maintenance) had to be completed before the next began. This led to "Big Bang" releases where bugs were often discovered too late.
*   **Agile (2001):** Focused on iterative development and customer feedback. While Agile improved the "Dev" side, it often stopped at the point of hand-off to Operations.
*   **The Birth of DevOps (2009):** Frustrated by the friction between teams, Patrick Debois organized the first **DevOpsDays** in Ghent, Belgium. The term "DevOps" was coined to bridge the gap between Development and Operations.

## 2. The "Wall of Confusion"
DevOps aims to tear down the "Wall of Confusion" that traditionally exists between two teams with conflicting incentives:

*   **Development (Dev):** Driven by **Change**. Their goal is to ship new features as quickly as possible.
*   **Operations (Ops):** Driven by **Stability**. Their goal is to keep systems running smoothly and minimize risks associated with change.

Without collaboration, Dev "throws code over the wall" to Ops, who must then figure out how to deploy and maintain it in production, often without adequate documentation or context.

## 3. The CALMS Model
The CALMS model (coined by Jez Humble) defines the pillars of a successful DevOps culture:

*   **Culture:** Breaking down silos and fostering shared responsibility.
*   **Automation:** Removing manual, error-prone tasks from the delivery pipeline.
*   **Lean:** Reducing waste and delivering value in small, frequent increments.
*   **Measurement:** Using data and metrics to guide improvements and identify bottlenecks.
*   **Sharing:** Open communication and knowledge exchange across the entire organization.

## 4. Comparative Scenarios: Before vs. After DevOps

| Feature | Before DevOps (Traditional) | After DevOps |
| :--- | :--- | :--- |
| **Release Frequency** | Monthly or Quarterly | Daily or Multiple times per day |
| **Deployment Method** | Manual, "Big Bang" events | Automated, incremental updates |
| **Recovery Time** | Hours or days (MTTR) | Minutes (Automated rollbacks) |
| **Feedback Loop** | Slow and disconnected | Fast and integrated into the pipeline |
| **Responsibility** | Siloed ("It works on my machine") | Shared ("You build it, you run it") |

## 5. Core Tools in the DevOps Ecosystem
*   **Git:** A distributed version control system for tracking code changes and enabling collaboration.
*   **Docker:** A platform for "containerizing" applications, ensuring they run the same way in every environment.
*   **Kubernetes (K8s):** An orchestration engine that automates the deployment, scaling, and management of containerized apps.
*   **Ansible:** A tool for configuration management that allows you to define your infrastructure as code (IaC).
*   **CI/CD (Continuous Integration / Continuous Deployment):** Automation pipelines (like Jenkins, GitLab CI, or GitHub Actions) that build, test, and deploy code automatically.

## 6. The DevOps Lifecycle (The Loop)
The DevOps lifecycle is a continuous loop of planning, delivery, and feedback.

```text
       .--------.          .--------.
    .-'          '-.    .-'          '-.
   /      PLAN      \  /    OPERATE     \
  |                  ||                  |
  |  CODE      RELEASE|  MONITOR      PLAN|
  |                  ||                  |
   \     BUILD      /  \    OPTIMIZE    /
    '-.          .-'    '-.          .-'
       '--------'          '--------'
            \                  /
             \      TEST      /
              \    DEPLOY    /
               '------------'
```

---
*End of Lesson 1*
