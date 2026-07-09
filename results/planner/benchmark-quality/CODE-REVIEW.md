# CODE REVIEW — Console 404 + Shadow + BOQ/Mesh vs MASTER-CHART

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` @ `bdeab2c` (+ uncommitted WIP for console/shadow assets)  
**Bar:** `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`  
**Reviewer role:** Senior review of *shipped/fixing product*, not plan checkboxes  
**Evidence:** this folder (`console-capture.json`, PNGs) + unit runs below  

---

## What was reviewed

| Slice | Intent | Key paths |
|-------|--------|-----------|
| **Console 404** | Stop catalog preview 404s on open3d/guest | `public/proof-chair.svg`, `public/placeholder-cabinet.svg`, `catalogPreviewAssets.test.ts`, `demoCatalogItems.ts` / `proofCatalog.ts` URLs |
| **Shadow deprecation** | Kill `THREE.WebGLShadowMap: PCFSoftShadowMap has been deprecated` spam | `ThreeViewerInner.tsx` → `PCFShadowMap` |
| **BOQ money wedge** | Workstation BOQ with INR list + GST | `workstationBoqV0.ts`, TopBar BOQ/quote, export honesty |
| **Mesh multiparts** | Systems v0 multi-part boxes + legs | `workstationMeshV0.ts`, cabinet-v0, place stamp `geometryMode` |
| **Honesty companions** | Export menu no PDF/PNG theater; wall→opening cascade | `TopBar.tsx`, `exportPreflight.ts`, `workspaceEntityHelpers.ts` |

**Live capture command:** `node site/scripts/capture-planner-console.mjs`  
**Unit sample (this review):** `catalogPreviewAssets` + `workstationBoqV0` → **5/5 pass**  
**Static probe:** `GET /proof-chair.svg` + `GET /placeholder-cabinet.svg` → **HTTP 200**

---

## Strengths

1. **Controllable catalog 404s actually fixed at the source**  
   Demo/proof previews pointed at `/proof-chair.svg` and `/placeholder-cabinet.svg` without files under `site/public/` (documented in elon LIVE as ERROR ×2). Files now exist (simple plan-style SVGs, not competitor clones), unit test asserts presence + size + `<svg` head. Static HTTP 200 confirmed on live server.

2. **Shadow warning fixed the right way**  
   Production path sets `renderer.shadowMap.type = THREE.PCFShadowMap` with an honest comment. Matches current Three deprecation behavior (Three itself remaps Soft→PCF with a console warn). Post-fix capture has **zero** shadow deprecation warnings.

3. **BOQ is no longer “qty only” fiction for systems v0**  
   `workstationV0UnitPriceInr` + 18% GST + line/subtotal/total INR; export toast shows money; quote-cart name embeds ex-GST unit. Explicit honesty: *demo list schedule, not ERP*. Real tests assert money fields (not hollow coverage).

4. **Mesh honesty improved without photoreal theater**  
   Workstation-v0 is multi-part role boxes + leg posts; cabinet-v0 multi-part; comments say “Not photoreal GLB.” Legs non-reg expects named children. Policy still blocks designer static GLB — correct.

5. **Chrome honesty companions landed**  
   Export menu lists only JSON / SVG / workstation BOQ / quote cart (PDF/PNG removed until real). Wall delete cascades openings (product path aligned with `removeWall`). Furniture rotation degrees→radians in scene nodes (`degreesToRadians` in `buildOpen3dSceneNodes`) — prior critical bug fixed.

6. **Capture harness is useful**  
   `capture-planner-console.mjs` writes `results/planner/benchmark-quality/console-capture.json` + screenshots, exits non-zero if any console error — good regression bar for “controllable clean.”

---

## Issues

### Critical (Must Fix)

None for the **narrow console/shadow** slice. Residual product gaps are Important, not “revert the fix.”

### Important (Should Fix)

1. **Console is not zero-error yet (uncontrollable residual)**  
   - **Evidence:** `console-capture.json` @ `2026-07-09T18:22:18.721Z`  
   - **Errors:** `PAGEERROR: Internal Next.js error: Router action dispatched before initialization.`  
   - **Missing now:** proof/cabinet 404s, PCFSoft deprecation, failed network requests (`failedRequestCount: 0`), zero warnings in this capture.  
   - **Why it matters:** “Console controllable clean” is nearly true for *product-owned assets*; “console clean” is false until Next router init noise is understood/fixed or filtered with a documented allowlist.  
   - **Fix direction:** Bisect guest vs open3d navigation in capture script; find premature `router`/`redirect`/`useRouter` action during hydrate; fix root cause rather than swallowing all pageerrors.

2. **Shadow fix + preview SVGs still uncommitted at review tip**  
   - Working tree: modified `ThreeViewerInner.tsx`; untracked SVGs, capture script, unit test.  
   - **Why it matters:** Origin/main at `bdeab2c` does not yet own the clean console path; next agent/session can drop the win.  
   - **Fix:** Land one commit (assets + shadow + test + optional capture script) + re-run capture evidence.

3. **Three mock drift in unit tests**  
   - Files: `threeViewerInner.test.tsx:132`, `orbitControlsDefault.test.tsx:134` still mock only `PCFSoftShadowMap`.  
   - Production reads `THREE.PCFShadowMap` when `enableShadows`.  
   - **Why it matters:** With shadows on, mock sets `type` to `undefined`; tests pass without asserting the real constant — silent drift.  
   - **Fix:** Mock `PCFShadowMap` (keep Soft only if testing deprecation remap) and assert `shadowMap.type === "PCFShadowMap"` when shadows enabled.

4. **BOQ money is systems-v0 list only — MASTER-CHART “BOQ/buy/quote” still not IKEA-class**  
   - Quote cart payload is still `{ id, name, qty }` with price **in the name string**, not structured `unitPrice` / GST fields for CRM.  
   - Non-workstation catalog often lacks `pricing`; sort-by-price UI can still be empty/zero.  
   - **Score impact:** export_boq stays **2**, not 3–5.

5. **Mesh remains multi-box modular — MASTER-CHART mesh/symbol still ~1–2**  
   - Default non-modular SKUs → single parametric box.  
   - GLB path opt-in / silent procedural fallback still the real default for most place paths.  
   - Block2D + Fabric flag dual authority unchanged (Fabric ON = empty rects).  
   - **Score impact:** mesh **1–2**, 3D viz **2**.

6. **Prior MASTER-FINDINGS partially stale — do not re-open closed bugs as open**  
   Rotation degrees bug, wall cascade, export PDF/PNG theater, and unpriced BOQ (for **ws-v0**) were fixed after that audit tip. Residual review must not demand re-fixes of closed items; focus remaining buyer gaps (ease, catalog truth, cloud save, mesh quality, structured quote).

### Minor (Nice to Have)

1. **SVG files carry a UTF-8 BOM** (`﻿<svg…`) — usually fine; strip BOM for maximal pickiness.  
2. **Capture script `settle` uses fixed waits** — flaky for slow machines; prefer networkidle / role waits for Place 4 seats.  
3. **Quote cart “price in name”** — temporary wedge; document as known tech debt next to BOQ NOTES.  
4. **`totalSeats = totalInstances`** — 1 seat per instance assumption still in BOQ summary.

---

## MASTER-CHART residual map (O&O live)

Source scores (MASTER-CHART §C / 07-oando-self): O&O overall **~2.0**, mesh **1**.  
After this wave of fixes, **honest re-score of live product experience** (1–5):

| Parameter (MASTER-CHART) | Chart (pre) | Now (review) | Delta | Residual gap vs winners |
|--------------------------|------------:|-------------:|:-----:|--------------------------|
| **2D engine / plan accuracy** | 2 | **2** | 0 | Still FeasibilityCanvas default; Fabric full stage not cut over; not RoomSketcher snap/measure class |
| **3D visualization** | 2 | **2** | 0 | Orbit + scene real; still boxes / multi-boxes, not Homestyler/P5D presence |
| **2D↔3D continuity** | 3 | **3** | 0 | Same document spine; rotation fix improves honesty; dual-view polish still thin |
| **Toolbar / chrome** | 2 | **2** | 0 | Tools exist; not Planner5D chrome density/finish |
| **Inventory / place** | 2 | **2** | 0 | Systems configurator + demo catalog; not IKEA SKU truth or P5D library UX |
| **Ease / 10-min result** | 2 (self 1) | **2** (self still ~**1–2**) | ~0 | Journey specs exist for systems path; unaided buyer bar still fails |
| **Realtime / cloud save** | 2 | **2** | 0 | IDB “Saved locally” honest; cloud unwired |
| **Collab multiplayer** | 1 | **1** | 0 | Correctly deferred |
| **Export pro 2D** | 2 | **2** | 0 | SVG/JSON real; no pro plan PDF |
| **BOQ / buy / quote** | 2 | **2** (soft **2.3** systems-only) | +0.3 niche | Priced ws-v0 BOQ + GST list + menu entry — still not full catalog→order/quote (IKEA = 5) |
| **Mesh / symbol quality** | 1 | **1–2** | +0–1 | Multipart workstation/cabinet + legs + Block2D default; still boxes, dual symbol authorities |

**Overall product average:** still **~2.0** (≈ half of acceptable public **3**, far below winners **3.5–4.3**).  
**Console cleanliness is orthogonal** to MASTER-CHART product score: a quiet console does not raise inventory/ease/mesh to ship.

### What moved the needle (narrow)

| Win | Product score? |
|-----|----------------|
| Catalog preview 404s gone | Hygiene / trust of console — not a MASTER-CHART column |
| Shadow deprecation gone | Hygiene |
| ws-v0 BOQ money | Tiny BOQ column nudge only inside systems wedge |
| Multipart mesh + legs | Mesh column floor off pure **1** toward **2** for *systems* only |
| Honest export + cascade delete + rotation | Correctness / honesty — prevent score **drop**, not climb to 3 |

---

## Verdict

### Console: controllable clean?

| Question | Answer |
|----------|--------|
| Controllable **catalog asset 404s** (`proof-chair`, `placeholder-cabinet`)? | **YES — clean** (files + 200 + unit; capture failedRequests = 0) |
| Controllable **Three shadow deprecation**? | **YES — clean** (PCFShadowMap; no Soft warning in live capture) |
| **Whole-console zero errors** on open3d + guest capture? | **NO** — residual Next.js `Router action dispatched before initialization` PAGEERROR |
| Warnings / failed requests in latest capture? | **0 / 0** (good) |

**One-liner:** *Controllable product noise (404 + shadow) is fixed; console is not fully clean until the Next router PAGEERROR is owned or proven out-of-scope.*

### Product bar still half?

**YES — product bar is still ~half (MASTER-CHART ~2).**

- Spine is real (document, 2D/3D, systems place, local save, BOQ JSON, multiparts).  
- Public manufacturer planner bar (ease 3+, inventory truth, mesh 3+, quote path 4+, save return) is **not** met.  
- BOQ/mesh work is **honest modular v0**, not class-leading.  
- Cleaning the console does **not** change overall **~2.0** — it removes embarrassment noise so quality work can be seen.

### Ready to merge (this hygiene slice)?

**With fixes:** commit untracked assets + shadow change + mock update; re-run `capture-planner-console.mjs`; track or fix Next PAGEERROR before claiming “console green” in gates.

**Not ready to claim:** “console fully clean” or “product bar past half / ship quality.”

---

## Recommendations (next quality order)

1. Land console/shadow WIP + update Three mocks; gate on `zeroConsoleErrors` **or** documented allowlist for known Next noise.  
2. Kill or explain Next router PAGEERROR on guest/open3d load.  
3. Structured quote cart fields (unitPriceInr, gst) — stop stuffing money into `name`.  
4. Do **not** enable Fabric furniture flag until symbols are real.  
5. Raise mesh/symbol only for O&O SKUs that matter for quote (systems + cabinets), not generic box farm.  
6. Keep MASTER-CHART overall at **~2** in scoreboards until ease journey + catalog truth + durable return-save land.

---

## Evidence index

```
results/planner/benchmark-quality/
  CODE-REVIEW.md                 ← this file
  console-capture.json           ← live post-fix capture (1 PAGEERROR)
  01-open3d-console-capture.png
  02-guest-console-capture.png

Bar:
  D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md
  D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md

Related slice notes:
  results/planner/workstation-boq-priced/NOTES.md
  results/planner/export-honesty/NOTES.md
  results/planner/wall-delete-cascade/NOTES.md
  results/planner/world-standard-wave/07-systems-v0/mesh-legs-green/CODE-REVIEW.md
  results/planner/elon-standard/chrome-devtools/LIVE.md  (pre-fix 404 noise)
```

**Commands re-run this review:**

```text
pnpm exec vitest run tests/unit/features/planner/open3d/catalogPreviewAssets.test.ts tests/unit/features/planner/open3d/workstationBoqV0.test.ts
# → 5 passed

node site/scripts/capture-planner-console.mjs
# → exit 2; errorCount 1 (Next router PAGEERROR only)
```
