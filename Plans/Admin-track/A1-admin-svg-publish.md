# A1 — Admin SVG publish E2E

**Status:** OPEN — not complete. Do not claim DONE.

**Goal:** Admin SVG editor: list → open editor → publish API 200 → SVG bytes on disk under `site/public/svg-catalog/`.

**Honesty:** Catalog SVG = **publish** authority only. Plan canvas draw = Fabric + Block2D ([P05](../Planner-track/P05-symbols-svg.md)) — never claim publish SVG as live plan-draw.

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

**Not A1:** full catalog census (A2) · production SSO (A3) · planner place journey · Feasibility restore.

**Next:** [A2-svg-pipeline.md](./A2-svg-pipeline.md)

## UI execution slice

- [x] List shows artifact state before editing.
- [x] Editor shows published, missing, or invalid SVG state.
- [x] Publish feedback names the slug and outcome.
- [x] Refresh shows the new artifact state.

**Reason:** Admin authors need visible proof of publish state.

**Implementation:** UI slice landed + browser-proven 2026-07-11 (`results/admin/svg-visibility/`). Colored catalog preview (not empty box); list thumbs + health; publish banner names slug + `/svg-catalog/{slug}.svg`.
