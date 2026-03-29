# QA Feedback for ARTICLE.md

## 1. Technical Bugs and Inconsistencies
- **Variable Mismatch in "Условия и проверки":**
  - In the "Подстановка команд" section, you define `DISK_USAGE`.
  - In the "Условия и проверки" section, you use `$DISK_USAGE_INT`.
  - **Issue:** This will cause an error if `set -u` is enabled (as recommended later) or simply fail to work as intended. Furthermore, `$DISK_USAGE` contains a `%` sign (e.g., "15%"), which causes the `-gt` operator to fail with an "integer expression expected" error.
- **Root Permissions in Cron:**
  - The "Реальный скрипт №1" requires root privileges (`EUID -ne 0`).
  - The "Планирование задач через cron" section suggests using `crontab -e`, which usually opens the *current user's* crontab. If a non-root user does this, the script will fail. Also, writing to `/var/log/cron_backup.log` typically requires root access.

## 2. Confusing Terms & Unexplained Concepts
- **`awk 'NR==2{print $5}'`:** While there is a brief comment, the syntax `NR==2` and `$5` is very "magical" for a beginner. A tiny bit more explanation on "Rows" and "Columns" would help.
- **`sed 's/%//'`:** This is used in the monitoring script to strip the percent sign, but `sed` is never introduced or explained elsewhere in the article.
- **`mktemp -d`:** Used in the `trap` example without explanation of what it does (creating a temporary directory).
- **`2>>"$LOG_FILE"`:** The concept of standard error (stderr) and the file descriptor `2` isn't explained, which might confuse someone who only knows `>`.
- **`EUID`:** Briefly mentioned, but could be clarified as a built-in shell variable.

## 3. Suggestions for More Detail/Examples
- **`sh` vs `bash`:** You mention this at the very end, but since you use "bashisms" like `[[ ]]` and `SERVERS=()` early on, it might be safer to warn the user earlier not to run these with `sh`.
- **Permissions Error:** In the "Права на выполнение" section, showing the actual terminal output/error would make it more relatable for a beginner.
- **Array Syntax:** `${SERVERS[@]}` is used in the `for` loop. The `@` symbol and the curly braces might look confusing without a quick note that this is how you access all elements of an array.

## 4. Typos & Formatting
- No major typos found.
- The formatting is consistent and the code blocks are well-highlighted.

---
**Verdict:** The article is high-quality and very practical, but the variable bug in the "Conditions" section is a "blocker" for a beginner trying to follow along step-by-step.
