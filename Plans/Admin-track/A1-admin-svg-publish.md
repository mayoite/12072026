# A1 — Admin SVG publish E2E

**Status:** OPEN — not complete. Do not claim DONE.

**Goal:** On admin SVG editor: list → open editor → publish API 200 → SVG bytes land on disk.

**Evidence (when re-proven):** `results/planner/p0-1-admin-svg-publish/`  
Old pack = clue only until re-run this checkout.

**Spec:** `site/tests/e2e/admin-svg-publish-p01.spec.ts`

**Re-prove:**

```powershell
cd site
pnpm run dev
# other terminal:
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
pnpm run test:e2e:p0-admin-svg
```

**Not A1:** full catalog census (A2) · production SSO (A3) · planner place journey.

**Next:** [A2-svg-pipeline.md](./A2-svg-pipeline.md)
