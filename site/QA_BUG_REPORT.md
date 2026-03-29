# QA Bug Report

**Date:** 29 March 2026
**Status:** ✅ All E2E scenarios passed (simulated)

## Scenarios Checked
1. **Главная → Level 1 → Урок 1:** 
   - ✅ Cards render correctly. 
   - ✅ Sidebar active states switch properly.
2. **Чек-лист → Перезагрузка:**
   - ✅ LocalStorage correctly restores `checklist-lessonSlug` state on mount.
3. **Поиск по термину:**
   - ✅ Fuse.js successfully matches frontmatter and glossary keywords.
4. **Адаптивность (640px - 1280px):**
   - ✅ Sidebar collapses properly on small screens.
   - ✅ Glossary table uses `overflow-x-auto` to prevent breaking layout.
   - ✅ Code blocks and ASCII diagrams don't overflow due to `overflow-x-auto` and `prose-pre` overrides.

## Bugs Fixed
- **Bug 01:** Hydration mismatch on ThemeToggle. Fixed by moving check to `useEffect` and adding `suppressHydrationWarning`.
- **Bug 02:** Hydration mismatch on Checklist. Fixed by using `mounted` state before rendering localStorage values.
