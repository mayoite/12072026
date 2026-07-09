# P05 suggestions — planning expert review (2026-07-09)

**Plan:** `Plans/trustdata/phases/P05-symbols-svg.md`  
**Scope:** Plan-only (no product code). W2 symbols + Block2D canvas authority honesty; no competitor SVG.  
**Checkout verified:** `D:\OandO07072026` (mainline).

---

## Verification (live repo — trust data)

| Claim in plan | Live path | Verdict |
|---------------|-----------|---------|
| Canvas draw = `furnitureBlock2DFromItem` → `renderBlock2DCentered` | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` ~589–607 | **True** |
| Modular symbol ~2 prims today | `site/features/planner/open3d/catalog/furnitureBlock2D.ts` `modularCabinetBlock` = rect + one dashed center line | **True** (exactly 2) |
| Prim paint path | `site/lib/catalog/renderBlock2DToCanvas.ts` draws rect/circle/line/path/arc; line supports `dash` | **True** — proposed prims need no new kind |
| Top-left prims + centered draw | `renderBlock2DCentered` translates by `-L/2,-D/2` then draws top-left | **True** — keep top-left authorship |
| SVG publish path | `compileSvgForPublish` → `publishDescriptorWithPipeline` / CLI → `public/svg-catalog/{slug}.svg` | **True** |
| CLI smoke scripts | `package.json` `scripts:smoke:svg` + `scripts:smoke:svg:batch` | **True** |
| Feasibility loads `/svg-catalog` | Grep / FeasibilityCanvas | **False (good)** — not wired; honesty correct |
| `furnitureBlockUsesCenteredPath` | Returns `true` for modular-cabinet-v0 but modular block is **top-left**; **unused** elsewhere | **Lie / dead API** — plan must fix or document kill |
| Task 3 demo-desk case | Already in `renderBlock2DToCanvas.test.ts` | **Duplicate** if re-added as-is |
| Evidence `run.json` | AGENT-RULES / RESULTS-MAP minimum for green | **Missing** from plan slices |
| Commit message shape | AGENT-RULES: `trustdata(P0X):` / `fix(open3d):` | Plan uses `test(planner):` / `feat(planner):` — **align** |
| doorStyle type | `Open3dModularCabinetV0Options.doorStyle`: none \| slab \| pair | **Match** plan branches |
| `generateCabinetV0Footprint` | Centered SVG path string for mesh/footprint — **not** plan canvas authority | Do not confuse with Block2D |

---

## Suggestions (priority)

### S1 — Must: kill/fix `furnitureBlockUsesCenteredPath` honesty (apply)

Dead export claims modular uses centered path coords; live `modularCabinetBlock` is top-left and Feasibility always uses `renderBlock2DCentered`. On Task 2: either delete the export **or** fix to return `false` + rewrite JSDoc to “all furnitureBlock2D prims are top-left; canvas centers via renderBlock2DCentered.” Prefer fix-to-false (smaller blast than delete if future imports appear). Unit assert: `furnitureBlockUsesCenteredPath(cabinetItem()) === false`.

### S2 — Must: doorStyle geometry must actually differ (apply)

Proposed **slab** still draws a vertical center stile at `w*0.5` (same as pair). That weakens visual criterion “door style changes geometry” and muddies the pair mid-line test.

- **pair:** vertical stile at mid-X + two handles  
- **slab:** **no** mid stile; single handle only (offset to one side)  
- **none:** shelf lines only  

Tighten test: pair has mid stile; slab has **zero** vertical lines with both x≈w/2 endpoints.

### S3 — Must: evidence pack + commit shape (apply)

Per AGENT-RULES / RESULTS-MAP for `05-symbols-svg/`:

- Each automated run folder gets `run.json` (command, exitCode, timestamp, HEAD if known) **plus** unfiltered `*-raw.log`.  
- Commit messages: `trustdata(P05): <slice>` (or `fix(open3d):` for product symbol code).

### S4 — Should: Task 3 de-dupe (apply)

Existing `renderBlock2DToCanvas.test.ts` already covers demo-desk ≥1 prim and modular basic. Task 3 should **only** add unknown-SKU box fallback (and keep modular quality in the dedicated cabinet-v0 file). Avoid twin “demo desk” tests.

### S5 — Should: type honesty (apply)

Prefer `Open3dModularCabinetV0Options` from `model/types` (already on the item) over casting `ModularCabinetV0Options`. Drop unnecessary `as` when reading `item.modularOptions`.

### S6 — Should: SVG smoke vs W2 gate split (apply)

CLI/admin SVG smoke proves **publish** path for honesty NOTES. It is **not** the W2 symbol-quality pass. If smoke fails: honesty NOTES = blocked for “smoke green,” CP-05 may still pass W2 symbol half if Block2D units + visual + honesty prose (canvas≠SVG) are solid — but do **not** claim “SVG pipeline works” without the log. CP-05.json should separate `symbolQuality` vs `svgHonestySmoke`.

### S7 — Nice: nav links + baseline facts (apply)

- Add Prev P04 / Next P06 like peer phase files.  
- Baseline NOTES: “modularCabinetBlock prim count today = **2**”; list `furnitureBlockUsesCenteredPath` as dead/false-claim to fix.

### S8 — Nice: shared mockContext (optional, skip if noise)

Duplicate `mockContext` is fine for isolated TDD file; do not invent a shared test util this phase unless one already exists.

### S9 — Out of scope (do not apply)

- FeasibilityCanvas loading published SVG  
- Mesh toe/door (P08)  
- Competitor SVG/path paste  
- Fabric cutover / SVGR  
- Full W2 browser place ≥2 (P07)

---

## Ethics reaffirm

Inspiration only. No competitor SVG/JS/GLB/sprites. O&O procedural prims only. MIT/open packages already in tree only.

---

## Disposition

| ID | Apply in plan revision? |
|----|-------------------------|
| S1 | Yes |
| S2 | Yes |
| S3 | Yes |
| S4 | Yes |
| S5 | Yes |
| S6 | Yes |
| S7 | Yes |
| S8 | No (optional noise) |
| S9 | Confirmed out of scope |

**Expert revision of phase file:** 2026-07-09 after this list.
