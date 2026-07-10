# P04 / W4 — NOTES (three-layer audit + coherent pack)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only (no worktrees)  
**Tip at pack write:** `bb0531685e7e714acb6026d0afcb214ba6e68f7a` (see `HEAD.txt`)  
**Agent:** P04 three-layer audit + coherent status  
**Evidence:** `results/planner/world-standard-wave/04-orbit-continuity/` only — never `site/results/`

---

## Binding honesty

| Law | Applied |
|-----|---------|
| **No paper moon** | Overall `run.json` **`status: open`** — not invented pass |
| **Unit alone ≠ W4** | Unit 34/34 deposit does **not** close CP-04 / W4 |
| **Browser alone ≠ W4** | Playwright green deposit without same-tip unit lock does **not** close |
| **Pass rule** | `pass` **only** if unit **and** browser green on **same tip** |
| **Phase-card PASS is paper** | `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` header **PASS 2026-07-09** is **paper** until this pack is dual-green same tip |

---

## Phase-card PASS is paper until this pack

Historical phase card claims:

- W4 / CP-04 **PASS** 2026-07-09  
- unit + browser green under `04-orbit-continuity/`  
- `THREE-LAYER-AUDIT.md` present  

**2026-07-10 reality before re-prove:** evidence folder missing or incomplete; audit file absent.  
**This seat:** wrote `THREE-LAYER-AUDIT.md`, coherent `run.json`, `CP-04-STATUS.md`, this `NOTES.md`.  
**Still not product PASS:** same-tip dual-green **not locked**.

Do **not** inherit phase-header PASS. Do **not** sell W4 from plan rating alone.

---

## Degrees vs radians (document honesty)

| Surface | Unit | Authority |
|---------|------|-----------|
| **Furniture document** (`Open3dFurnitureItem.rotation`) | **degrees** | `model/units.ts` `normalizeDegrees`; 2D canvas / properties |
| **Scene nodes** (`buildOpen3dSceneNodes`) | **radians** | L118–119: `degreesToRadians(item.rotation)` |
| **Mesh** | node rad with sign flip | `rotation.y = -node.rotation` intentional plan-Y→world-Z |

**Do not thrash** document furniture into radians to match stale phase/expert prose.  
Stale claim “document + scene nodes = radians” is **false** for the furniture document field.

---

## Layer summary (see `THREE-LAYER-AUDIT.md`)

| Layer | Product | Proof |
|-------|---------|-------|
| **1** Defaults ON | **CLOSED** — ThreeViewerInner L68 · ThreeLazyViewer L145 · orbitDefaults L7 | unit construct spy |
| **2** Workspace `getOpen3dViewerControlProps` | **CLOSED** — OOPlannerWorkspace **L1057–1060** | workspaceOrbitWiring unit |
| **3** Unit + browser same tip | deposits exist | unit green @ `b8109733…`; browser-green deposit **no HEAD pin** → **not closed** |

---

## Unit deposits (not this seat’s re-run)

| Pack | Log | Tests | Exit | Deposit HEAD |
|------|-----|-------|------|--------------|
| Full W4 unit | `unit-p04-pack-raw.log` | **34/34** | 0 | `b8109733…` (`unit-pack-deposit.json`) |
| Orbit core | `unit-orbit-pack.log` | **9/9** | 0 | earlier tip thrash |
| Pose + adapter | `unit-pose-pack.log` | **26/26** | 0 | earlier tip thrash |

---

## Browser deposits (not this seat’s re-run)

| Artifact | Status |
|----------|--------|
| `browser-run.json` | `"status": "browser-green"` · **no HEAD field** |
| Latest Playwright logs | **1 passed** (~8–10s) |
| PNGs | `01-2d-after-place.png` · `02-3d-orbit-on.png` · `03-2d-restored.png` |
| Proves | furniture **count** + `data-orbit-enabled=true` + count stable 2D↔3D |
| Does **not** prove | entity **ids / mm / rotation** (units only — H3 honesty) |

---

## Why overall remains `open`

1. Unit green deposit HEAD (`b8109733…`) ≠ audit tip (`bb053168…`).  
2. Browser green deposit has **no** HEAD pin in `browser-run.json`.  
3. Same-tip dual-green is the only path to `pass`.  
4. Plan **APPROVE-WITH-FIXES 7.5** ≠ product PASS (see `CP-04-STATUS.md`).

**Next for Done (not this seat unless re-dispatched):** re-run unit pack + Playwright on one pinned tip; stamp both HEADs; only then flip `run.json` → `pass`.
