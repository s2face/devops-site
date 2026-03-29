# QA Feedback: Terraform in a Team (State, Backend, Modules)

**Role:** @junior_qa (Junior DevOps Engineer)
**Context:** First-time setup of Remote Backend and Modules.

---

## 1. Missing Prerequisites & Environment Setup
While the article explains *why* we need a remote backend, it skips the initial environment requirements:
*   **AWS Credentials:** It's assumed the user has `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` configured or an active SSO session. A junior might get "Access Denied" or "No Credentials found" errors immediately.
*   **Terraform Version:** The `backend` block specifies `required_version = ">= 1.6.0"`, but the article doesn't mention how to check or upgrade the local Terraform version.
*   **Required Permissions:** To run the `bootstrap/` code, the IAM user needs specific permissions (`s3:CreateBucket`, `dynamodb:CreateTable`, etc.). A "Minimum Permissions" list would be very helpful.

## 2. Confusing Parts in "Step 0: Bootstrapping"
*   **Bucket Name Uniqueness:** S3 bucket names must be globally unique. The example uses `my-company-terraform-state-unique-id`. A junior might try to use exactly this and fail if someone else already took it. A note about naming conventions (e.g., `company-project-env-state`) would be beneficial.
*   **The "Chicken and Egg" Logic:** The article says "Create a separate directory `bootstrap/`". Does this mean it should be a completely separate Git repository, or just a folder in the same repo? If it's the same repo, should it be ignored by the main project's `.gitignore`?
*   **Missing Commands:** For a true beginner, explicitly listing the sequence `terraform init` -> `terraform plan` -> `terraform apply` for the bootstrap folder is essential.

## 3. Potential Errors in Code Snippets
*   **Inconsistent Bucket Names:** 
    *   Bootstrap uses: `my-company-terraform-state-unique-id`
    *   Backend config uses: `my-company-terraform-state-prod`
    *   *Risk:* A junior will copy-paste the backend config and get a "Bucket does not exist" error.
*   **Workspaces Example:** The code snippet for `aws_instance` uses `ami = data.aws_ami.ubuntu.id`. However, the `data "aws_ami" "ubuntu"` block is missing from the snippet. Running this code will result in:
    ```text
    Error: Reference to undeclared data source
    ```
*   **Backend Key Path:** The example uses `key = "infrastructure/network/terraform.tfstate"`. It isn't explained that this is an arbitrary path inside the bucket. A junior might think they *must* use this specific folder structure.

## 4. Structure & Clarity: Modules and Workspaces
*   **Module Source Paths:** The example shows `source = "./modules/static-site"`. It should be clarified where the root `main.tf` is relative to this folder. Does the `modules/` folder live at the same level as the `env/` folders?
*   **Workspace vs. Directory Conflict:** The article lists "Workspaces vs Directories" but then uses `terraform.workspace` in a way that implies a single directory approach. Providing a recommended folder structure diagram (e.g., using `tree`) would clear up the architectural confusion.
*   **External Tools:** Tools like `TFLint`, `tfsec`, and `Infracost` are highly recommended, but there are no instructions on how to install them (Homebrew? Binary download? Docker?).

## 5. Missing Content (From Task Requirements)
The `task.md` file explicitly requires covering certain commands that are missing or only briefly mentioned:
*   **`terraform taint`**: This command is not mentioned at all in `ARTICLE.md`. It's a key command for lifecycle management.
*   **`terraform state` Commands**: While `terraform state mv` is mentioned in the anti-patterns, other critical subcommands like `list`, `show`, and `rm` are missing. A junior engineer wouldn't know how to inspect their state without manually opening the file (which you warned against!).
*   **Reusable Module Creation**: While the structure of a module is shown, there's no step-by-step example of *creating* one from existing resources, which was a requirement in `task.md`.

## 6. Security & Best Practices
*   **OIDC Mention:** Mentioning OIDC is great, but for a "Level 2" lesson, it might be too advanced without a small example or a link to documentation on how to set up the GitHub -> AWS trust relationship.

---
**Verdict:** The article is conceptually strong and well-written, but the code snippets require "fixing" (adding the AMI data source) and naming consistency to be truly "copy-paste friendly" for a junior engineer.