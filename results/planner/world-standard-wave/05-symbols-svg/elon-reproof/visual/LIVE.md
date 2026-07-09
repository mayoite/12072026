# LIVE — P05 plan symbols visual (Elon reproof)

**Date:** 2026-07-09  
**Method:** Live only — Chrome DevTools MCP  
**Checkout:** `D:\OandO07072026`  
**URL:** `http://localhost:3000/planner/guest/`  
**Scope:** Guest planner → place Modular Cabinet → stay **2D** → screenshot plan symbols. **No redesign.**

---

## Verdict

| Check | Result |
|-------|--------|
| 1. Open guest planner (2D) | **PASS** |
| 2. Place cabinet (catalog search / Add to canvas + canvas place) | **PASS** |
| 3. Stay 2D; screenshot plan symbols | **PASS** |
| 4. Symbols readable (carcass/door cues) vs empty box | **FAIL — solid filled box only** |

**Overall (visual symbol quality):** **FAIL** on carcass/door readability. Placement and 2D capture **PASS**.

---

## Journey facts

| Fact | Value |
|------|--------|
| Mode | `2D` radio **checked** throughout |
| Catalog | Search `cabinet` → **Modular Cabinet** (0.6 m × 0.6 m) |
| Place path | Arm **Place (P)** via `Add Modular Cabinet to canvas` → canvas click |
| Live message | `Placed Modular Cabinet (GLB ready)` (first place) |
| Properties (when selected) | **FURNITURE** heading `cabinet-v0`; Catalog ID / Slug `cabinet-v0`; SKU `CAB-V0-001` |
| Counts after place | **9** objects · **4** walls · **5** furniture · **4** seats |
| Scene content | 4× workstation seats (prior) + **1× Modular Cabinet** as isolated square |

---

## Symbol readability (live canvas)

Observed on viewport + canvas + Focus + **Zoom 422%** close-up:

| Observation | Detail |
|-------------|--------|
| Fill | Opaque **solid dark navy** rectangles |
| Interior | **No** visible mid-stile, door leaf lines, handles, front/back differentiation |
| Cabinet vs seats | Same solid-box language; cabinet is a smaller standalone square |
| Carcass / door cues | **Not readable** at 100% or 422% |
| Empty-box assessment | **Yes — detail-less solid box** (not a hollow multi-prim architectural plan symbol) |

**Note (out of scope, honesty only):** Unit/prim dump under `05-visual/` claims multi-prim Block2D for `modular-cabinet-v0`. **Live open3d plan canvas does not show that detail** in this reproof. No redesign attempted.

---

## Evidence paths

All under:

`D:\OandO07072026\results\planner\world-standard-wave\05-symbols-svg\elon-reproof\visual\`

| File | What |
|------|------|
| `01-guest-2d-plan-with-cabinet.png` | Full guest planner UI, 2D, 5 furniture on plan |
| `02-canvas-plan-symbols.png` | Canvas region crop — walls + solid furniture symbols |
| `03-focus-2d-plan-symbols.png` | Focus / maximized canvas, same symbols |
| `04-zoom-plan-symbols-close.png` | Zoom **422%** viewport — solid fill, no door/carcass lines |
| `05-canvas-zoom-cabinet-symbol.png` | Canvas crop at zoom |
| `LIVE.md` | This file |

---

## Steps run

1. Navigate `http://localhost:3000/planner/guest/`
2. Confirm **2D** checked; inventory Live catalog
3. Search **cabinet** → **Add Modular Cabinet to canvas** (DOM click to arm Place)
4. Canvas click → furniture **4 → 5**; properties `cabinet-v0` when selected
5. Esc / Select; Zoom to fit; Focus; zoom **422%**
6. Screenshots only — no product code changes
