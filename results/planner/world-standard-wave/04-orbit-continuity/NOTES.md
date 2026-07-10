# P04 / W4 proof pack — NOTES (Agent 10 consolidator)

**Date:** 2026-07-10  
**Checkout:** `.` only (no worktrees)  
**HEAD pin:** `5f682651e4533e56b403f37d17e771ecfc90bb33` (see `HEAD.txt`)  
**Agent:** P04 Agent 10/10 — proof pack consolidator  
**Evidence root:** `results/planner/world-standard-wave/04-orbit-continuity/` only — never `site/results/`

---

## Binding honesty

| Law | Applied |
|-----|---------|
| **No paper moon** | Overall `run.json` **`status: open`** — not invented `pass` |
| **Unit alone ≠ W4** | Unit 34/34 does **not** close CP-04 / W4 |
| **Browser alone ≠ W4** | Playwright green deposit without same-tip unit lock does **not** close |
| **Pass rule** | `pass` **only** if unit pack **and** Playwright both green on the **same HEAD tip** |
| **Browser ≠ ids/mm** | Browser proves furniture **count** + `data-orbit-enabled` — **not** entity ids / mm / document rotation (units only) |
| **Phase-card PASS is paper** | Historical W4/CP-04 PASS (2026-07-09 phase card) is **void** until dual-green same tip |

---

## Phase PASS void

| Claim source | Claim | Reality |
|--------------|-------|---------|
| `Plans/phases/P04-orbit-continuity/…` historical | W4 / CP-04 **PASS** 2026-07-09 | **PAPER** vs missing/incomplete evidence before scratch |
| Plan rating | APPROVE-WITH-FIXES **7.5/10** | Plan quality only — **not** product ship |
| This pack | Coherent index + notes + single `status` | **`open`** — same-tip dual-green not locked |

Do **not** inherit phase-header PASS. Do **not** sell W4 from plan score alone.

---

## Three-layer status

See `THREE-LAYER-AUDIT.md` + `CP-04-STATUS.md` for long form. Consolidator summary:

| Layer | Meaning | Product source | Proof |
|-------|---------|----------------|-------|
| **1 Defaults** | Orbit ON via `OPEN3D_ORBIT_DEFAULT_ENABLED` | **CLOSED** — `orbitDefaults.ts` L7; Inner L68; Lazy L145; construct + `data-orbit-enabled` L340 | Unit construct spy green |
| **2 Workspace** | Explicit `{...getOpen3dViewerControlProps()}` | **CLOSED** — `OOPlannerWorkspace.tsx` L1057–1060 | `workspaceOrbitWiring` unit green |
| **3 Unit + browser same tip** | Hard gate | Code/path ready | Unit **green deposits**; browser **green deposit**; **same tip not locked** → layer 3 **OPEN** |

**Degrees honesty:** furniture **document = degrees** → scene nodes **radians** → mesh `rotation.y = -node.rotation` intentional. Do not thrash document into radians.

---

## Unit outcomes

| Pack | Log | Tests | Exit | Notes |
|------|-----|-------|------|-------|
| Full W4 unit | `unit-p04-pack-raw.log` | **34/34** | 0 | deposit HEAD `b8109733…` (`unit-pack-deposit.json`) |
| Scratch re-tee | `unit-p04-scratch-pack-raw.log` | **34/34** | 0 | seat re-prove logs |
| Consolidator tip re-run | `unit-p04-pack-consolidator-tip.log` | **34/34** | 0 | Agent 10 re-ran pack on tip era after other seats |
| Orbit core | `unit-orbit-pack.log` | **9/9** | 0 | defaults + pose + wiring |
| Pose + adapter | `unit-pose-pack.log` | **26/26** | 0 | adapter + mesh |

**Files in full pack:**

1. `orbitControlsDefault.test.tsx` (6)  
2. `poseContinuityW4.test.ts` (1)  
3. `workspaceOrbitWiring.test.ts` (2)  
4. `buildOpen3dSceneNodes.test.ts` (11)  
5. `createSceneObjectFromNode.test.ts` (14)

**Unit alone ≠ W4.**

---

## Browser outcomes

| Artifact | Status |
|----------|--------|
| Prove tip (NOTES-BROWSER) | `bb0531685e7e714acb6026d0afcb214ba6e68f7a` |
| Trustdata land | `6c236ac6` browser W4 re-prove |
| Playwright logs | **1 passed** (`browser-w4-raw.log`, `browser-w4-playwright-live.log`, `playwright-raw.log`) |
| `browser-run.json` | `"status": "browser-green"` — **no HEAD field** |
| PNGs | `01-2d-after-place.png`, `02-3d-orbit-on.png`, `03-2d-restored.png` |
| Fabric | unset (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`) |
| Console | `consoleErrorCount: 0` recorded; **no** hard `expect(hardAppErrors).toEqual([])`; **no** `console-messages.txt` |

### What browser proves vs does not

| Proves | Does **not** prove |
|--------|---------------------|
| Furniture **count** via status text | Entity **ids** |
| `data-orbit-enabled="true"` | **mm** position |
| 2D↔3D count stable + optional left-drag no-crash | Document **rotation** degrees / pose identity |

Pose ids/mm/rotation remain **unit-only** (CODE-REVIEW-REPORT **H3**).

Earlier `CODE-REVIEW-LIVE.md` recorded browser **RED** (place timeout). **Later** Playwright re-prove greened and overwrote logs/PNGs — use latest green deposit; do not launder older RED as current, and do not invent same-tip lock.

---

## Chrome outcomes

| Item | Status |
|------|--------|
| `chrome/` snaps | Present (setup/config dumps + optional PNG) — **not** W4 hard gate |
| `dev-server-w4-chrome.log` | Port conflict / noise — **not** orbit proof |
| `chrome/_cdm/node_modules` | **Absent** under this pack (good) |
| Policy | Do **not** recreate `_cdm` under `results/**/chrome/`; gitignore hardened at repo root |

Chrome DevTools is **optional** and never substitutes Playwright for W4.

---

## Why overall remains `open`

1. Browser green deposit prove tip (`bb053168…`) ≠ consolidator pack tip (`74399324…`).  
2. `browser-run.json` has **no** HEAD pin.  
3. Unit deposit JSON still cites older `b8109733…` (consolidator re-ran green later — still not dual-locked with browser on one SHA).  
4. Soft console residual (H1) remains — recorded count, not fail-closed empty console.  
5. Pass requires **unit + Playwright green on the same HEAD tip**.

```text
status = open
```

---

## Seat deposits retained (not deleted)

| File | Role |
|------|------|
| `NOTES-unit-pack.md` | Exec4 unit seat |
| `NOTES-BROWSER.md` | Playwright seat |
| `SCRATCH-BASELINE.md` / `CODE-REVIEW-*` / exec audits | Prior seats |
| `THREE-LAYER-AUDIT.md` / `CP-04-STATUS.md` | Audit seats |

**This `NOTES.md` is the consolidator single honesty surface.** Seat NOTES remain historical.

---

## Out of consolidator scope

- Re-run Playwright on pack tip to flip dual-green → `pass`  
- Harden e2e console to hard `expect([]).toEqual` + `console-messages.txt`  
- Product thrash (orbit defaults, adapter degrees, R3F port) — not RED for consolidator  
