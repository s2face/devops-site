# QA Feedback: "Ansible с нуля" (Beginner Perspective)

**Reviewer:** @junior_qa
**Context:** Beginner learning Infrastructure as Code (IaC).

---

## 1. Missing Context or Prerequisites
*   **Target Infrastructure:** The article assumes the reader has at least one remote server (e.g., `192.168.1.10`). A total beginner might not have a spare Linux machine.
    *   *Suggestion:* Add a small note about using a local VirtualBox VM, Vagrant, or a cheap VPS (DigitalOcean/Hetzner) for practice.
*   **Operating System:** The installation guide is specific to Ubuntu. While it's common, a learner on Windows or macOS might get stuck at the `apt` commands.
    *   *Suggestion:* Mention WSL2 for Windows users or Homebrew for macOS.
*   **Initial SSH Password:** `ssh-copy-id` requires the remote user's password to copy the key. Beginners often don't realize they need password-based SSH access *enabled* briefly before switching to keys.

## 2. Unclear Steps
*   **Project Structure:** You mention creating `ansible.cfg`, `hosts.ini`, and `nginx_setup.yml`, but don't show a sample directory tree.
    *   *Question:* Should all these files be in the same folder?
*   **Ad-hoc commands vs. Playbooks:** In the "First ad-hoc commands" section, you use `ansible all -m ping`. If the user hasn't created the `hosts.ini` yet (it's described *after* ad-hoc in some sections), this command will fail.
    *   *Instruction:* Move the Inventory section *before* the ad-hoc commands or explicitly state that `hosts.ini` must be ready.

## 3. Confusing Terminology
*   **Configuration Drift:** A bit abstract.
    *   *Simplification:* "Когда настройки сервера 'уплывают' от эталона из-за ручных правок."
*   **Bus Factor:** This is "slang" for beginners.
    *   *Simplification:* "Риск того, что только один человек знает, как всё работает."
*   **Jinja2:** Just saying it's a "template engine" might be vague.
    *   *Question:* Do I need to learn a whole new language for this?

## 4. Potential Errors & Inconsistencies
*   **SSH Key Mismatch (Critical):**
    *   In the setup, you suggest: `ssh-keygen -t ed25519`. This creates `id_ed25519`.
    *   But in `ansible.cfg` and `ssh-copy-id`, you use `id_rsa` and `id_rsa.pub`.
    *   *Result:* The user will get a "File not found" or "Permission denied" error because the filenames don't match.
*   **Apt Cache in Ad-hoc:**
    *   `ansible webservers -m apt -a "name=nginx state=present" --become`
    *   If the server is "fresh," this often fails because the `apt` cache is empty.
    *   *Fix:* Add `update_cache=yes` to the ad-hoc arguments.

## 5. Points Where a Learner Might Get Stuck
*   **YAML Indentation:** One extra space in `nginx_setup.yml` will break everything.
    *   *Suggestion:* Recommend using VS Code with the "Ansible" or "YAML" extension.
*   **"Permission Denied (publickey)":** This is the most common error.
    *   *Suggestion:* Add a tiny "Troubleshooting" tip: "If it asks for a password, check if your key is added to `ssh-agent` or if the path in `ansible.cfg` is correct."
*   **Python Versions:** You mention Python 3 is required. On some older systems, `python` might point to 2.7.
    *   *Tip:* Suggest checking with `python3 --version`.

---

### Final Question to Author:
Can we add a "Quick Start" checklist at the beginning?
1. [ ] Have a Linux Control Node (or WSL).
2. [ ] Have a Managed Node (remote IP).
3. [ ] SSH access with sudo rights.
