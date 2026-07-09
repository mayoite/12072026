# VERIFY — mesh/symbol live (after stroke floor)

**Date:** 2026-07-09  
**Role:** Coordinator 2 — mesh/symbol live verify  
**Checkout:** `D:\OandO07072026`  
**URL:** `http://localhost:3000/planner/guest/?plannerDevTools=1`  
**Method:** Fresh Playwright journey (real browser place + shots)  
**Spec:** `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts`  
**Bar:** mesh_symbol **readable** — 2D multi-prim (not empty solid blob); 3D multi-part (not single apology box)

---

## Overall verdict

# **FAIL** (mesh_symbol bar — 2D symbol half)

| Check | Result | Evidence |
|-------|--------|----------|
| Place **cabinet-v0** | **PASS** | `run.json` furniture 0→1; properties `cabinet-v0`; `01-cabinet-v0-2d-placed.png` |
| 2D zoom multi-prim **readable** | **FAIL** | `02`, `02b`, `03` — solid opaque navy fill at 294% and 605% zoom; no carcass/door/inner-line cues |
| Place **workstation** (4 seats) | **PASS** | furniture +4 → final 5; `04-workstation-2d-after-place.png` |
| 3D multi-part **not single box** | **PASS** | `05`, `06` — worktop + legs + panels distinct boxes |
| Playwright journey exit | **PASS** | `playwright-raw.log` — 1 passed (~12s) |
| Stroke floor code present | **PASS (unit path)** | `resolveCanvasStrokeWidthMm` in `renderBlock2DToCanvas.ts` — does **not** prove live visual bar |

**mesh_symbol bar (readable):** **FAIL**  
Placement + 3D workstation mesh are green. Live **cabinet-v0 plan symbol remains an opaque solid box** after stroke-floor land — multi-prim geometry is not human-readable on the plan canvas.

---

## 1. cabinet-v0 — 2D zoom multi-prim

### Journey facts

| Fact | Value |
|------|--------|
| Catalog | Search `cabinet` → **Add Modular Cabinet to canvas** → canvas place |
| Properties | **FURNITURE** `cabinet-v0` |
| Counts | furniture **0 → 1** |
| Zoom shots | **294%** (`02`), **605%** (`02b` / `03`) — anchored near place point |
| First place (100%) | Solid dark rectangle left of room corner wall (`01`) |

### Readability vs bar

| Observation | At 100% | At 294–605% |
|-------------|---------|-------------|
| Outer fill | Opaque navy | Opaque navy (larger) |
| Inner rect / front / door cues | **Not visible** | **Not visible** |
| Selection chrome | — | Dashed selection outline only |
| Empty-box assessment | **Yes** | **Yes** |

**Fail reason (honest):** Stroke floor floors *line width* after `context.scale`. Live paint still uses a **dark solid carcass fill** (`--block-storage` / inverse body) with stroke tokens in the same inverse family. Even with thicker strokes, detail does not read against the opaque fill at product zoom. Units/prim dump still claim ≥4 prims — **live plan symbol quality bar is not met**.

**Does not claim:** stroke-floor code missing or place path broken.

---

## 2. Workstation — 3D multi-part mesh

### Journey facts

| Fact | Value |
|------|--------|
| Place path | Systems configurator **Place 4 seats** (linear 900×600, pedestal+panel) |
| Furniture | before WS +4; final **5** (1 cabinet + 4 seats) |
| Mode | **3D** radio; `planner-3d-canvas` visible |

### Readability vs bar

| Observation | Result |
|-------------|--------|
| Single apology box? | **No** |
| Distinct parts | Worktop slabs (tan), leg posts (dark), panel boards (blue-gray) |
| Modules match stamp | desk + panel (+ pedestal in config) |

**Pass:** Multi-part procedural mesh is live-visible. Residual: still boxy modules (honest; not photoreal GLB).

---

## Evidence index

All under `D:\OandO07072026\results\planner\benchmark-quality\mesh-symbol\`

| File | Role |
|------|------|
| `01-cabinet-v0-2d-placed.png` | Place + select cabinet-v0 @ 100% |
| `02-cabinet-v0-2d-zoom-multiprim.png` | Zoom ~294% — solid fill |
| `02b-cabinet-v0-2d-zoom-close.png` | Zoom ~605% — solid fill |
| `03-cabinet-v0-2d-canvas-zoom.png` | Canvas crop solid symbol |
| `04-workstation-2d-after-place.png` | After Place 4 seats |
| `05-workstation-3d-multipart.png` | Full UI 3D multi-part |
| `06-workstation-3d-canvas.png` | 3D canvas crop |
| `run.json` | Machine summary (place deltas, zoom %) |
| `playwright-raw.log` | Playwright 1 passed |
| `VERIFY.md` | This verdict |

---

## Commands run (fresh)

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-mesh-symbol-live-verify.spec.ts --reporter=line
# exit 0 — 1 passed
```

---

## Residual / next (not done here)

1. **2D symbol contrast** — make multi-prim readable on plan (lighter fill or high-contrast strokes; avoid solid inverse-body carcass as sole paint). Stroke floor alone is insufficient for the bar.
2. Optional: 3D cabinet-v0 toe/carcass/door live shot (W7 residual; workstation 3D already green here).
3. Do **not** claim W2 symbol half green from unit prim counts alone.

---

## Summary scoreboard

| Gate | Status |
|------|--------|
| Place cabinet-v0 | PASS |
| 2D multi-prim readable (mesh_symbol) | **FAIL** |
| Place workstation | PASS |
| 3D multi-part readable | PASS |
| Evidence folder complete | PASS |
| **mesh_symbol bar overall** | **FAIL** |
