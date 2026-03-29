# QA Feedback for "Ansible Roles" Article

**Reviewer:** @junior_qa
**Status:** Review Completed

## Overall Impression
The article is very comprehensive and explains the transition from monolithic playbooks to roles clearly. The structure of the role and the variable hierarchy are explained well.

## Identified Issues & Suggestions

### 1. Missing Prerequisites for Practical Task
In the **Practical Task** section, there is no mention that the target host must have Docker and Docker Compose (and the `python3-docker` library) installed. 
*   **Risk:** A junior engineer might attempt to run the role on a clean server, and it will fail at the last task.
*   **Suggestion:** Add a note that Docker should be pre-installed or suggest adding `geerlingguy.docker` as a dependency in `meta/main.yml` (referencing the earlier example in the article).

### 2. Missing Role Invocation Example
Step 6 of the practical task asks the user to "Call this role in your main playbook", but the article doesn't provide a visual example of the `roles:` keyword syntax.
*   **Confusion:** For a novice, it might be unclear whether to use `roles:`, `include_role:`, or `import_role:`.
*   **Suggestion:** Provide a short snippet:
    ```yaml
    - hosts: servers
      roles:
        - deploy_docker_app
    ```

### 3. Consistency in Variable Naming
The "Best Practices" section correctly advises using role-name prefixes for variables (e.g., `myapp_port`), but the practical task suggests using `app_port`.
*   **Suggestion:** Update the practical task to use `deploy_docker_app_port` to match the recommended "Golden Rule".

### 4. Technical Terms
*   **"Upstream":** Mentioned in the Nginx section but not explicitly explained. Since this is for novices, a one-sentence explanation of what an "upstream" is in the context of a load balancer would be helpful.
*   **"Bus Factor":** Well-explained in brackets, no changes needed.

### 5. Module Documentation
The `community.docker.docker_compose_v2` module is used in the practical task. 
*   **Suggestion:** Since this is a specialized module, providing a small example of its syntax (specifically the `project_src` parameter) in the text would be very helpful to prevent the user from having to search external documentation for their first role.

## Mental Reproduction of `deploy_docker_app`
I successfully mentally traced the steps. The logic is sound:
1. `ansible-galaxy init` creates the structure.
2. `defaults/main.yml` sets the "safe" defaults.
3. `templates/docker-compose.yml.j2` uses variables to define the container.
4. `tasks/main.yml` handles directory creation, template placement (with `notify`), and deployment.
5. `handlers/main.yml` ensures a restart if the configuration changes.

**Command Check:** All shell commands (`ansible-galaxy`, `ansible-vault`, `molecule`) are correct and work as intended.
