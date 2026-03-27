# Git Branching: Branches, Merges, and Conflicts
**DevOps Level 1 - Lesson 7**

## 1. Technical Context: Why Branches Matter
In modern software development, parallel work is the norm. Without branching, a team would struggle to work on multiple features, bug fixes, or experiments simultaneously without interfering with the "stable" version of the code.

**Key Benefits:**
*   **Isolation:** Work on a feature without affecting the `main` branch.
*   **Parallel Development:** Multiple developers can work on different tasks at the same time.
*   **Safe Experimentation:** Create a branch to try a new library or refactoring; if it fails, simply delete the branch.
*   **Code Review Workflow:** Branches enable Pull/Merge Requests, allowing teams to review code before it hits production.

---

## 2. Core Commands and Explanations

### `git branch`
Manages branches.
*   `git branch`: Lists all local branches.
*   `git branch <name>`: Creates a new branch at the current commit.
*   `git branch -d <name>`: Deletes a branch (safely).

### `git checkout` vs `git switch`
*   `git checkout <branch>`: The traditional way to switch branches. Also used for restoring files.
*   `git switch <branch>`: The modern (Git 2.23+) dedicated command for switching branches.
    *   `git switch -c <name>`: Creates and switches to a new branch (replaces `git checkout -b <name>`).

### `git merge`
Integrates changes from one branch into another.
*   **Fast-forward:** If the destination branch hasn't moved since the source branch was created, Git just moves the pointer forward.
*   **Recursive (Three-way merge):** If both branches have diverged, Git creates a new "merge commit" that has two parents.

### `git rebase`
Reapplies commits from one branch onto another. It "rewrites history" by moving the base of your branch to a newer commit.
*   *Pros:* Keeps a linear, clean history.
*   *Cons:* Can be dangerous if used on shared/public branches.

### `git stash`
Temporarily shelves (stashes) changes you've made to your working copy so you can work on something else, and then come back and re-apply them later.
*   `git stash`: Save changes.
*   `git stash pop`: Apply and remove the last stash.
*   `git stash list`: See all stashes.

---

## 3. Code Examples

### Creating and Switching
```bash
# Create a new feature branch
git switch -c feature/login-page

# Make changes and commit
echo "Login form" > login.html
git add login.html
git commit -m "Add basic login form"

# Switch back to main
git switch main
```

### Merging a Feature
```bash
# Ensure you are on the target branch
git switch main

# Pull latest changes first
git pull origin main

# Merge the feature branch
git merge feature/login-page

# Delete the feature branch locally after success
git branch -d feature/login-page
```

---

## 4. Merge Conflicts: A Detailed Walkthrough

### How a Conflict Occurs
A conflict happens when Git cannot automatically determine which change to keep—usually when the same line in the same file is modified in two different branches.

### Example Scenario
1.  **On `main` branch:** `index.html` has `<h1>Hello World</h1>` on line 5.
2.  **Developer A** (on `feature-A`) changes it to `<h1>Hello Universe</h1>`.
3.  **Developer B** (on `feature-B`) changes it to `<h1>Hello Multiverse</h1>`.
4.  Developer A merges first. When Developer B tries to merge, Git stops and says:
    `CONFLICT (content): Merge conflict in index.html`

### What it looks like in the file:
```html
<<<<<<< HEAD
<h1>Hello Universe</h1>
=======
<h1>Hello Multiverse</h1>
>>>>>>> feature-B
```
*   `<<<<<<< HEAD`: The version currently in your branch (e.g., `main`).
*   `=======`: The divider between the two versions.
*   `>>>>>>> feature-B`: The version from the branch you are trying to merge.

### How to Resolve:
1.  **Open the file** and manually edit it to the desired state (remove the markers).
2.  **Decide:** Do you want "Universe", "Multiverse", or both?
    ```html
    <h1>Hello Multiverse</h1>
    ```
3.  **Add and Commit:**
    ```bash
    git add index.html
    git commit -m "Resolve merge conflict in index.html"
    ```

---

## 5. Branching Strategies

### Git Flow
A strict branching model designed around the project release.
*   `main`: Production-ready code.
*   `develop`: Integration branch for features.
*   `feature/*`: For new features.
*   `release/*`: Preparation for a new production release.
*   `hotfix/*`: Quick fixes for production.

### GitHub Flow
A lightweight, branch-based workflow.
*   Anything in the `main` branch is deployable.
*   To work on something, create a descriptively named branch off of `main`.
*   Commit to that branch locally and regularly push to the server.
*   Open a Pull Request for feedback/merge.

### Trunk-Based Development
Developers collaborate on code in a single branch called “trunk” (usually `main`), and resist any pressure to create other long-lived development branches.
*   Encourages small, frequent updates.
*   Requires robust automated testing.
*   Often uses **Feature Flags** to hide incomplete features.

---

## 6. Best Practices and Anti-patterns

### Best Practices
*   **Keep Branches Short-lived:** The longer a branch exists, the harder the merge will be.
*   **Commit Often:** Small commits are easier to understand and revert if needed.
*   **Merge/Rebase from Main Frequently:** Keep your feature branch up to date with the latest changes to catch conflicts early.
*   **Descriptive Names:** Use `feature/`, `bugfix/`, `hotfix/` prefixes.

### Anti-patterns
*   **Rebasing Public Branches:** NEVER `git rebase` a branch that others are working on. It rewrites history and breaks their local copies. Use `git merge` for shared branches.
*   **Large "Kitchen Sink" Commits:** Mixing unrelated changes (e.g., a bug fix and a CSS refactor) in one commit/branch.
*   **Ignoring Conflicts:** Pushing conflict markers (`<<<<<<<`) to the remote repository.
*   **Long-lived Feature Branches:** Leading to "Merge Hell" at the end of a sprint.
