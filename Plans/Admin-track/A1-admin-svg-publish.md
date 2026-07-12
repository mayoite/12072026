# A1 — Admin SVG publish E2E

**Status:** DONE — re-proven 2026-07-12.

**Goal:** Admin SVG editor: list → open editor → click Publish → server-action HTTP 200 → visible success → SVG bytes on disk under `site/public/svg-catalog/`.

**Honesty:** Catalog SVG = **publish** authority only. Plan canvas draw = Fabric + Block2D ([P05](../Planner-track/P05-symbols-svg.md)) — never claim publish SVG as live plan-draw.

**Evidence:** `results/planner/p0-1-admin-svg-publish/`
Fresh pack contains list/editor screenshots, HTTP status, and before/after byte proof.

**Spec:** `site/tests/e2e/admin-svg-publish-p01.spec.ts`

**Re-prove:**

```powershell
cd site
pnpm run dev
$env:DEV_AUTH_BYPASS='1'
pnpm --filter oando-site run test:e2e:p0-admin-svg
```

**Not A1:** full catalog census (A2) · production SSO (A3) · planner place journey · second planner host.

**Next:** [A2-svg-pipeline.md](./A2-svg-pipeline.md)

## UI execution slice

- [x] List shows artifact state before editing.
- [x] Editor shows published, missing, or invalid SVG state.
- [x] Publish feedback names the slug and outcome.
- [x] Refresh shows the new artifact state.

**Reason:** Admin authors need visible proof of publish state.

**Implementation:** UI slice landed + browser-proven 2026-07-11 (`results/admin/svg-visibility/`). Colored catalog preview (not empty box); list thumbs + health; publish banner names slug + `/svg-catalog/{slug}.svg`.
