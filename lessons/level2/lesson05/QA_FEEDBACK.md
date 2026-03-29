# QA Feedback: Lesson 05 - Deployments and Services

**Reviewer:** @junior_qa
**Target:** `ARTICLE.md`

## 1. Connection: Deployment <-> Service
- **Status:** Clear, but could be more explicit.
- **Feedback:** The text explains that connections are based on labels. However, for a beginner, it might be confusing which labels exactly the Service is looking for. 
- **Suggestion:** Add a small note or a comment in the YAML that the `Service.spec.selector` must match `Deployment.spec.template.metadata.labels` (the Pod's labels), not the Deployment's own labels.

## 2. YAML Explanations
- **Status:** Very good depth.
- **Feedback:** 
    - The explanation of `requests` and `limits` is great.
    - **Missing Units:** A beginner won't know what `250m` (millicores) and `64Mi` (Mebibytes) mean. 
- **Suggestion:** Add a brief explanation of K8s resource units (m, Mi, Gi).

## 3. Liveness vs Readiness Probes
- **Status:** Easy to follow.
- **Feedback:** The distinction between "excluding from the Service" and "restarting the container" is well-made.
- **Question:** If a beginner sees the same path `/healthz` for both in the example, they might think they are always the same. 
- **Suggestion:** Mention that `readinessProbe` often checks dependencies (DB, cache), while `livenessProbe` checks the process health.

## 4. Commands for Rolling Update / Rollback
- **Status:** Mostly complete, but missing core declarative commands.
- **Feedback:**
    - The article emphasizes "Declarative management" but only gives the imperative `kubectl set image`.
    - Missing scaling command: `kubectl scale`.
    - Missing verification commands: `kubectl get rs`, `kubectl get svc`.
- **Suggestion:** Add a "Management Summary" table or list with:
    - `kubectl apply -f ...` (The "standard" way)
    - `kubectl scale ... --replicas=N`
    - `kubectl get rs,svc,pods`

## 5. Typos and Formatting
- **Typo:** In "Почему не запускать Pod напрямую?", there is a gender mismatch: "Если упадет **сервер**... Под умрет вместе с **ней**" (should be "с ним" or use "нода").
- **Formatting:** Excellent use of headers and code blocks. The "Troubleshooting" section is very helpful.

## 6. General Questions from a Beginner's perspective
- What triggers a Rolling Update exactly? Does changing the `replicas` count trigger it? (No, only `template` changes). This should be clarified.
- What is a "Namespace"? It's mentioned in the Best Practices but not explained in the text.
- How do I know which Pod belongs to which Deployment when I run `kubectl get pods`? (Mention the naming convention: `[deployment-name]-[replicaset-id]-[pod-id]`).
