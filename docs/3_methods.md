## 2026-10-26 — wrong trick on a miss

**Issue:** Missing “A is 25% more than B” showed the successive-change shortcut.
**Cause:** That question was tagged `successive`.
**Fix:** Gave it the `compare` trick, and gave the mean-proportional questions their own trick. `aptitude/test.js` now fails if a question’s skill has no trick.

## 2026-10-26 — pictures looked missing

**Issue:** The course looked like text.
**Cause:** The drawings were 16px bars, and they appeared only after opening a lesson.
**Fix:** SVG figures on the home cards, the lesson, and the practice card. Shortcuts rewritten as identities.
