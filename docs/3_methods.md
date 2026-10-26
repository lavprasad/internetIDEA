## 2026-10-26 — wrong trick on a miss

**Issue:** Missing “A is 25% more than B” showed the successive-change shortcut.
**Cause:** That question was tagged `successive`.
**Fix:** Gave it the `compare` trick, and gave the mean-proportional questions their own trick. `aptitude/test.js` now fails if a question’s skill has no trick.
