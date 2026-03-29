# QA Feedback: GitLab CI/CD Guide Review
**Role:** Junior DevOps Engineer (Beginner)

## General Impression
The article is very informative and covers high-level concepts well. However, as a beginner, I found several areas where I would get stuck due to missing "navigation" steps or assumed knowledge.

## Points of Confusion & Missing Steps

### 1. Finding the Registration Token
In the **"Registration and types of tokens"** section, you provide a `docker exec` command that requires a `YOUR_REGISTRATION_TOKEN`. 
* **Confusion:** As a beginner, I don't know where to find this token in the GitLab interface. 
* **Suggestion:** Add a brief path description (e.g., *Settings -> CI/CD -> Runners*) or a screenshot/placeholder description of where to look.

### 2. The `config.toml` Edit Workflow
You mention key parameters like `concurrent` and `privileged`.
* **Question:** If I ran the runner using the `docker run` command provided earlier, how do I actually edit this file? Should I edit it on my host machine in `/srv/gitlab-runner/config/config.toml` or inside the container? A junior might be afraid of breaking the container.
* **Missing Step:** A quick note on "Restart the runner after editing `config.toml` for changes to take effect" would be very helpful.

### 3. Missing Scripts in Examples
In the **"Environments and Review Apps"** section, the YAML example uses:
```yaml
script:
  - ./deploy_to_k8s.sh
```
* **Confusion:** I might think these are standard GitLab commands. Since these scripts aren't provided in the article, my pipeline will fail if I copy this example.
* **Suggestion:** Clarify that these are custom user-written scripts or provide a very simple "dummy" script content (like `echo "Deploying..."`).

### 4. Kaniko vs. DinD
You mention **Kaniko** as a safer alternative to Docker-in-Docker (DinD).
* **Point of Confusion:** As a junior, if you tell me DinD is a "security threat," I want to use Kaniko instead. But there is no example of how to use Kaniko. 
* **Suggestion:** Provide a small code snippet for Kaniko or a link to the official docs so I don't have to use the "dangerous" method.

### 5. Using "File" type Variables
You mention that `Kubeconfig` should be stored as a **File** type variable.
* **Question:** How do I use it in the `script`? Does GitLab automatically put it in the right place, or do I need to run `export KUBECONFIG=$MY_VAR_NAME`? This is a common stumbling block for beginners.

### 6. Workflow "Double Pipelines"
The `workflow` section mentions avoiding "Double pipelines."
* **Confusion:** The logic `if: $CI_MERGE_REQUEST_IID` is a bit "magic" for a beginner. A one-sentence explanation of why checking for the existence of this ID prevents duplicates would be great.

## Summary
The article feels more like it's for **Intermediate** users (as the intro admits), but for a true **Junior**, it needs more "breadcrumbs" on where to click and how to handle the custom scripts mentioned in examples.
