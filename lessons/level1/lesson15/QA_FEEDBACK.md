# QA Feedback for Lesson 15: CI/CD Basics

Overall, the article is engaging and uses great metaphors (the "Vasy and Petya" story) to explain the necessity of CI/CD. However, for a absolute novice, there are a few areas that could be improved.

## 1. YAML Explanation
*   **Status:** Needs Improvement.
*   **Feedback:** While the article provides a YAML example and mentions that it is "sensitive to indentation" in the checklist, it doesn't actually explain the basic structure of YAML (keys, values, lists). A beginner might not know the difference between a `-` (list item) and a standard key-value pair, leading to syntax errors when they try to modify the file.
*   **Suggestion:** Add a small "Pro-tip" or sidebar explaining that YAML uses spaces (not tabs) and how the hierarchy works.

## 2. GitHub Secrets Steps
*   **Status:** Excellent.
*   **Feedback:** The 5-step guide to adding secrets is perfect. It’s easy to find in the GitHub UI following these instructions.
*   **Check:** Verified the paths `Settings -> Secrets and variables -> Actions` match the current GitHub layout.

## 3. Unexplained Jargon
*   **Status:** Minor Issues.
*   **Feedback:**
    *   **PEP8:** Mentioned under "Linting" but not defined as the Python style guide.
    *   **Vendor lock-in:** Used in the comparison table; a novice likely won't know this refers to the difficulty of switching providers.
    *   **Legacy-системы:** Mentioned in the table, could be simplified to "old/inherited systems."
    *   **Runner:** Defined as a "virtual machine," which is good, but explicitly stating that GitHub provides these machines for free would add clarity.

## 4. "needs: test" Explanation
*   **Status:** Clear.
*   **Feedback:** The explanation is very intuitive. Explaining it as a "logical link" and "protection against errors" makes the concept of job dependencies easy to grasp without needing a deep dive into graph theory.

## Additional Observations for Novices
*   **The `${{ github.sha }}` variable:** This is used in the Docker tags but isn't explicitly explained. A beginner might wonder where this number comes from.
*   **Mermaid Diagram:** Great visual aid! It helps see the flow before diving into the YAML code.
*   **File Paths:** The article correctly emphasizes the specific directory structure (`.github/workflows/`), which is a common point of failure for beginners.
