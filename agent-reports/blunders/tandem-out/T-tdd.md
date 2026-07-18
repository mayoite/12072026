# T — TDD (parametric linear desk)

**Date:** 2026-07-18  
**Role:** TDD — name-mirror tests; live Maker; no grey-rect stub  
**Commit:** none (per brief)

## Command

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric --reporter=dot
```

## Result

| Metric | Value |
|--------|--------|
| Exit | **0** |
| Files | **8 passed** |
| Tests | **32 passed** |
| Duration | ~16s |

Reporter: all dots green (`··········` …).

## Coverage vs brief

| Requirement | Status | Where |
|-------------|--------|--------|
| Sections Units / Size / Pedestals / Identity | **PASS** | `LinearDeskParametricForm.test.tsx` — legends / section titles |
| One publish | **PASS** | single `linear-desk-publish`; one `Publish` button role |
| Details read-only | **PASS** | details panel: 0 textbox/spinbutton/button |
| Multipath preview ids | **PASS** | live Maker: `desk-top`, `pedestal-l`, `pedestal-r`; no `frame` / CSS vars |
| Publish args 1600 / slug / sku | **PASS** | action mock gets `widthMm: 1600`, guest slug, commercial SKU |
| `aria-invalid` when broken | **PASS** | width 10 cm → invalid + alert + publish disabled + preview blocked |
| Publish id-reuse | **PASS** (existing) | `publishLinearDeskAction.test.ts` — same guest slug reuses product id |
| Dock host stubbed only | **PASS** | `AdminSvgDockHost` mock; Maker **not** stubbed |
| No Maker grey rect | **PASS** | preview asserts real SVG multipath |

## Files touched

### Edited

- `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx`

### Unchanged (already covered / green)

- `site/tests/unit/features/admin/svg-editor/parametric/publishLinearDeskAction.test.ts` — id stability reuse
- `site/tests/unit/features/admin/svg-editor/parametric/linearDeskGuestIdentity.test.ts`
- `site/tests/unit/features/admin/svg-editor/parametric/linearDeskFormModel.test.ts`
- `site/tests/unit/features/admin/svg-editor/parametric/linearDeskPublishDescriptor.test.ts`
- `site/tests/unit/features/admin/svg-editor/parametric/publishLinearDeskIsolatedPath.test.ts`
- `site/tests/unit/features/admin/svg-editor/parametric/proofGuestFilter.test.ts`
- `site/tests/unit/features/admin/svg-editor/parametric/proofSlugLoad.test.ts`

### Report

- `agent-reports/blunders/tandem-out/T-tdd.md` (this file)

## Notes for parent / U

- Form UI under test matches current `LinearDeskParametricForm.tsx`: fieldsets **Units · Size · Pedestals · Identity**, dock titles **Preview|Form|Summary**, validation label **Ready**, success copy contains slug after Publish.
- Success assertion is **robust** (slug + `/Published/i`) so either current U copy or `formatLinearDeskPublishSuccess` still passes.
- Dock titles matcher allows `Summary` or `Details` if U renames again.
- **No CSS.** **No product code change.** **No commit.**

## Brutal truth

Prior form tests were stale against U (expected `Draft ready`, `Preview|Form|Details`, old success string). They would have failed or lied about structure. Extended tests now pin the order-factory form behaviors the owner asked for.
