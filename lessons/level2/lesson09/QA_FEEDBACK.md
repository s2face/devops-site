# QA Feedback: Terraform Article Review

**Reviewer:** @junior_qa
**Perspective:** DevOps Beginner
**Status:** REJECT

## General Observations
The article provides a good high-level overview of Terraform and IaC concepts. However, there are several "blind spots" that would likely lead to errors or confusion for a beginner trying to follow the guide.

## Identified Issues & Areas for Improvement

### 1. Missing AWS Authentication Steps
*   **Issue:** The practical section shows how to write `main.tf` and run `terraform init/plan`, but it never mentions how to provide AWS credentials (Access Key, Secret Key).
*   **Impact:** A beginner will run `terraform plan` and get an "No valid credential sources found" error, stalling their progress immediately.
*   **Recommendation:** Add a short section on how to configure credentials (e.g., `aws configure` or environment variables) before the "Запуск" step.

### 2. Hardcoded, Region-Specific AMI
*   **Issue:** The example uses `ami-0c55b159cbfafe1f0`. AMIs are region-specific. If a user changes the region in `provider "aws"` (e.g., to `us-east-1`), this AMI ID will be invalid.
*   **Impact:** Deployment failure with "AMI not found" error.
*   **Recommendation:** Use a `data "aws_ami"` block to dynamically fetch the latest Amazon Linux 2 AMI, or at least add a warning that AMI IDs change by region.

### 3. Incomplete "Data Sources" Section
*   **Issue:** Under the "Основные блоки Terraform" heading, the "Источники данных" section only has one sentence and no code example.
*   **Impact:** Confusion about how to actually use this core concept.
*   **Recommendation:** Provide a simple example of a data source (e.g., fetching a VPC or an AMI).

### 4. Remote State Complexity
*   **Issue:** The article correctly warns not to put the state file in Git and suggests "S3 + DynamoDB". For a beginner, setting up a backend is a significant hurdle.
*   **Impact:** The user might feel overwhelmed or ignore the advice because no implementation steps are provided.
*   **Recommendation:** Briefly show a `terraform { backend "s3" { ... } }` block or provide a link to a tutorial specifically for backend configuration.

### 5. Security Best Practices
*   **Issue:** The Security Group example opens port 22 to `0.0.0.0/0`.
*   **Impact:** Encourages poor security habits.
*   **Recommendation:** Add a note that this is for demonstration purposes only and that in production, access should be restricted to specific IPs.

### 6. Installation Dependency
*   **Issue:** The installation script uses `lsb_release -cs`.
*   **Impact:** If a user is on a minimal Docker container or certain Debian/Ubuntu variants where `lsb-release` isn't installed by default, the command will fail.
*   **Recommendation:** Mention that `lsb-release` might need to be installed first (`sudo apt-get install lsb-release`).

### 7. Target Audience Ambiguity
*   **Issue:** The introduction says it's for "Intermediate" specialists, but the content explains very basic concepts (What is IaC). 
*   **Impact:** Intermediate users might find it too basic, while beginners might feel the "Intermediate" label means they aren't ready for it, despite the content being beginner-friendly.
*   **Recommendation:** Re-evaluate the target audience label or deepen the technical sections (like Modules or Terragrunt) if it's truly for Intermediates.

## Questions for the Author
1.  Should we include a `variables.tf` example in the practical part to align with the "Standard Project Structure" mentioned earlier?
2.  Can we add a link to the official AWS Provider documentation for a list of available resources?

## Conclusion
The article is a great start but needs more "hand-holding" regarding the actual execution (credentials, region-specific IDs) to be truly useful for someone new to the ecosystem.
