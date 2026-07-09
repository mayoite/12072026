# P05 — W2 Symbol Quality + SVG Path Honesty

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Also REQUIRED: `/using-superpowers` (all skills as fit: TDD, verification, chrome-devtools). Steps use checkbox (`- [ ]`) syntax for tracking.  
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit as you go · push only on owner ask.  
> **Do not execute until owner unlocks implementation** (plan-only until then).  
> **Commit shape:** `trustdata(P05): <slice>` or `fix(open3d): <slice>` (AGENT-RULES).

**Prev:** [P04-orbit-continuity.md](./P04-orbit-continuity.md) · **Next:** [P06-save-honesty.md](./P06-save-honesty.md)

**Goal:** Make open3d plan-view furniture symbols **readable** for **cabinet-v0** (and stop “empty box” plan marks), while writing an honest SVG pipeline story: **Block2D is canvas authority now; admin/CLI SVG catalog is publish authority later for catalog consume — not competitor assets.**

**Architecture:** FeasibilityCanvas already draws via `furnitureBlock2DFromItem` → `renderBlock2DCentered` (top-left prims; canvas centers by translating `-L/2,-D/2`). Raise **modular cabinet-v0** Block2D prims (plan symbol: carcass, door leaf cues, handles, front/back face) so W2 screenshots prove a readable symbol, not a blank blob. Fix dead lie `furnitureBlockUsesCenteredPath` (returns true today but modular prims are top-left and the helper is unused). Separately, lock **truth** about the SVG pipeline (`compileSvgForPublish` → `public/svg-catalog/{slug}.svg` → portal/admin) without claiming the canvas loads those SVGs today. No competitor SVG/JS/GLB copy; O&O procedural prims only.

**Tech Stack:** TypeScript, Vitest, Canvas 2D (`renderBlock2DToCanvas`), Block2D prims (`blocks2d`), open3d catalog (`furnitureBlock2D`, `modularCabinetV0`), asset-engine SVG (`compileSvgForPublish`, `publishDescriptorWithPipeline`, `generate-svg.mjs`), Playwright optional visual slice, evidence under `results/planner/world-standard-wave/05-symbols-svg/`.

**Gate:** **W2** (symbol quality half — place path + browser place is P07; this phase owns **readable Block2D** + **SVG honesty**).  
**Checkpoint:** **CP-05** (see end of this file).  
**Evidence root:** `results/planner/world-standard-wave/05-symbols-svg/`  
**Minimum artifacts (AGENT-RULES / RESULTS-MAP):** each automated run folder → `run.json` (command, exitCode, timestamp, HEAD if known) + unfiltered `*-raw.log`; honesty → `NOTES.md`; visual → PNG or prim-JSON.

**Ethics (non-negotiable):**

| Allowed | Forbidden |
|---------|-----------|
| Original O&O prim geometry (rect/line/arc) | Competitor SVG, path data, sprites, logos |
| MIT/Apache/BSD packages already in tree | Shipping scraped planner assets as ours |
| Patterns from research (jobs-to-be-done only) | Pasting competitor UI or GLB into `site/` |

**Depends on:** P01 product truth + P02 engine lock (know Feasibility is interim 2D). Does **not** require P03 select/delete for symbol unit work; browser place proof may share P07.

**Out of scope this phase:**

- Mesh toe/door quality bar (**P08 / W7**)
- Full Fabric cutover
- SVGR / sprite systems
- CDN upload of SVG
- Making FeasibilityCanvas load `/svg-catalog/*.svg` as live draw path (deferred authority cutover — document only)
- Competitor research re-scrape
- Confusing `generateCabinetV0Footprint` (centered SVG path string for mesh helpers) with plan-canvas Block2D authority

---

## File map (create / modify)

| Path | Responsibility this phase |
|------|---------------------------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Primary:** richer `modularCabinetBlock` prims; fix `furnitureBlockUsesCenteredPath` → `false` + honest JSDoc |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Confirm prim kinds used by cabinet symbol actually paint (fix only if a prim kind is missing) |
| `site/lib/catalog/blocks2d.ts` | `BLOCK_STYLE` storage colors/strokes only if needed; do **not** rewrite generic catalog builders |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Optional: share dimension helpers if Block2D needs same width/depth defaults as mesh (no mesh redesign here) |
| `site/features/planner/open3d/model/types.ts` | Read-only: use `Open3dModularCabinetV0Options` (doorStyle none\|slab\|pair) — no cast to mesh options required |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Wire already correct (`furnitureBlock2DFromItem` + `renderBlock2DCentered`); change only if symbol needs meta/catalog name |
| `site/features/planner/asset-engine/README.md` | Honesty: canvas vs publish SVG authority one-pager section |
| `site/features/planner/asset-engine/stages.ts` | No status lie — leave S7 partial unless consume proof lands |
| `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts` | Reference only for honesty notes / smoke; no feature rewrite |
| `site/public/svg-catalog/*.svg` | CLI/admin outputs only; **never** hand-paste competitor SVG |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | Add **unknown-SKU** non-empty box fallback only (demo-desk already covered) |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **Create:** TDD home for readable cabinet symbol + centeredPath honesty |
| `results/planner/world-standard-wave/05-symbols-svg/` | **Create:** run.json, unit logs, NOTES, PNG/visual proof |

**Authority truth (must stay honest in NOTES + README):**

```
Plan canvas (open3d FeasibilityCanvas)
  └── furnitureBlock2DFromItem → Block2D prims (top-left mm) → renderBlock2DCentered
        (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)
        Note: furnitureBlockUsesCenteredPath must NOT claim centered prim authorship.

Admin / CLI SVG pipeline
  └── compileSvgForPublish (S1–S3) → runSvgPipeline S4 → public/svg-catalog/{slug}.svg
        → persistBlockDescriptor → portal/svg-catalog preview
        (AUTHORITY FOR PUBLISHED CATALOG SVG ARTIFACTS)
        NOT the FeasibilityCanvas draw path today.

V1 svgCompiler.server.ts = v1-reference-only (not publish wire).
generateCabinetV0Footprint = mesh/helper path string (centered) — not canvas Block2D.
```

---

## Task 00: Setup / verification baseline

**Files:**
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/NOTES.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/run.json`
- Read only: files in File map above

- [ ] **Step 1: Confirm workspace and superpowers**

```powershell
cd D:\OandO07072026
# No git worktree add. Main checkout only.
pwd
```

Expected: path under `D:\OandO07072026` (not a worktree path).

- [ ] **Step 2: Inventory current symbol path (data, not hope)**

```powershell
cd D:\OandO07072026\site
rg -n "furnitureBlock2DFromItem|modularCabinetBlock|renderBlock2DCentered|furnitureBlockUsesCenteredPath|geometryMode === \"modular-cabinet-v0\"" features/planner/open3d lib/catalog
rg -n "compileSvgForPublish|public/svg-catalog|publishDescriptorWithPipeline" features/planner/asset-engine features/planner/admin/svg-editor
```

Expected (verified 2026-07-09):

- FeasibilityCanvas imports `furnitureBlock2DFromItem` + `renderBlock2DCentered`
- `modularCabinetBlock` returns **exactly 2** prims (rect + dashed center line)
- `furnitureBlockUsesCenteredPath` returns `true` for modular but is **unused** and **wrong** (prims are top-left)
- Publish path names `compileSvgForPublish`

- [ ] **Step 3: Run existing unit baseline (no suppression)**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\05-symbols-svg\00-baseline | Out-Null
pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\00-baseline\vitest-raw.log
```

Expected: existing tests PASS (or log honest fail before changes). Preserve full log.

- [ ] **Step 4: Write baseline NOTES + run.json**

Create `results/planner/world-standard-wave/05-symbols-svg/00-baseline/NOTES.md` with exactly:

```markdown
# P05 baseline

- Date: (ISO date of run)
- Canvas draw path: FeasibilityCanvas → furnitureBlock2DFromItem → renderBlock2DCentered
- cabinet-v0 modular symbol today: **2 prims** (rect + dashed center line) — not product-readable yet
- furnitureBlockUsesCenteredPath: returns true but modular prims are top-left; unused — fix in Task 2
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
- generateCabinetV0Footprint: centered path string helper — not Feasibility draw authority
- Ethics: no competitor SVG
- Baseline vitest log: vitest-raw.log
```

Create `results/planner/world-standard-wave/05-symbols-svg/00-baseline/run.json`:

```json
{
  "phase": "P05",
  "slice": "00-baseline",
  "command": "pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose",
  "cwd": "site",
  "exitCode": 0,
  "timestamp": "(ISO)",
  "head": "(git rev-parse --short HEAD if known)"
}
```

Set `exitCode` to the real process exit code.

- [ ] **Step 5: Commit baseline evidence only if owner unlocked execution**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/05-symbols-svg/00-baseline
git commit -m "trustdata(P05): baseline notes for W2 symbols/SVG honesty"
```

---

### Task 1: Failing unit tests — cabinet-v0 symbol is not an empty box

**Files:**
- Create: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`
- Modify (later tasks): `site/features/planner/open3d/catalog/furnitureBlock2D.ts`
- Test: same new file

- [ ] **Step 1: Write the failing test file**

Create `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/open3d/catalog/furnitureBlock2D";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";
import { renderBlock2DToCanvas } from "@/lib/catalog/renderBlock2DToCanvas";
import type { Prim } from "@/lib/catalog/blocks2d";

function cabinetItem(
  partial?: Partial<Open3dFurnitureItem>,
): Open3dFurnitureItem {
  return {
    id: "cab-1",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 800,
    depth: 400,
    height: 900,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 800,
      depthMm: 400,
      heightMm: 900,
      doorStyle: "slab",
      material: "white",
    },
    ...partial,
  };
}

function mockContext(): CanvasRenderingContext2D {
  const calls: string[] = [];
  const ctx = {
    calls,
    save: () => {
      calls.push("save");
    },
    restore: () => {
      calls.push("restore");
    },
    translate: () => {
      calls.push("translate");
    },
    rotate: () => {
      calls.push("rotate");
    },
    scale: () => {
      calls.push("scale");
    },
    beginPath: () => {
      calls.push("beginPath");
    },
    rect: () => {
      calls.push("rect");
    },
    roundRect: () => {
      calls.push("roundRect");
    },
    arc: () => {
      calls.push("arc");
    },
    moveTo: () => {
      calls.push("moveTo");
    },
    lineTo: () => {
      calls.push("lineTo");
    },
    fill: () => {
      calls.push("fill");
    },
    stroke: () => {
      calls.push("stroke");
    },
    setLineDash: () => {
      calls.push("setLineDash");
    },
    createLinearGradient: () => ({
      addColorStop: () => undefined,
    }),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    shadowColor: "",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };
  return ctx as unknown as CanvasRenderingContext2D;
}

function countByKind(prims: Prim[], kind: Prim["kind"]): number {
  return prims.filter((p) => p.kind === kind).length;
}

/** Vertical line with both endpoints near mid-X (pair stile). */
function midVerticalStileCount(prims: Prim[], midX: number): number {
  return prims.filter((p) => {
    if (p.kind !== "line" || p.points.length < 4) return false;
    const x0 = p.points[0]!;
    const x1 = p.points[2]!;
    return Math.abs(x0 - midX) < 2 && Math.abs(x1 - midX) < 2;
  }).length;
}

describe("cabinet-v0 Block2D plan symbol (W2)", () => {
  it("uses placed modular dimensions for footprint", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.footprint.L).toBe(800);
    expect(block.footprint.D).toBe(400);
    expect(block.footprint.H).toBe(900);
  });

  it("is not an empty-box symbol: ≥4 prims with carcass + front + door cue", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    // Readable plan mark: outer carcass, front face line, door/handle cue,
    // and orientation mark — not a single rect blob.
    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    expect(countByKind(block.prims, "rect")).toBeGreaterThanOrEqual(1);
    expect(countByKind(block.prims, "line")).toBeGreaterThanOrEqual(2);
  });

  it("keeps all prim geometry inside footprint (no runaway coords)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    for (const p of block.prims) {
      if (p.kind === "rect") {
        expect(p.x).toBeGreaterThanOrEqual(-1);
        expect(p.y).toBeGreaterThanOrEqual(-1);
        expect(p.x + p.w).toBeLessThanOrEqual(L + 1);
        expect(p.y + p.h).toBeLessThanOrEqual(D + 1);
      }
      if (p.kind === "line") {
        for (let i = 0; i < p.points.length; i += 2) {
          expect(p.points[i]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i]).toBeLessThanOrEqual(L + 1);
          expect(p.points[i + 1]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i + 1]).toBeLessThanOrEqual(D + 1);
        }
      }
    }
  });

  it("pair doors get a center stile; slab does not", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "pair",
          material: "oak",
        },
      }),
    );
    expect(midVerticalStileCount(pair.prims, midX)).toBeGreaterThanOrEqual(1);

    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);
  });

  it("reports top-left prim authorship (centeredPath helper is false)", () => {
    expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
  });

  it("renders to canvas without throwing and issues fill+stroke", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const ctx = mockContext();
    renderBlock2DToCanvas(ctx, block, {
      resolve: (t) => (t && t !== "none" ? String(t) : "#ccc"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls).toContain("fill");
    expect(calls).toContain("stroke");
    expect(calls.filter((c) => c === "beginPath").length).toBeGreaterThanOrEqual(2);
  });

  it("never depends on external SVG/GLB URLs for plan symbol", () => {
    const src = furnitureBlock2DFromItem.toString();
    expect(src).not.toMatch(/https?:\/\//);
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(JSON.stringify(block)).not.toMatch(/\.glb|\.svg|svg-catalog/);
  });
});
```

- [ ] **Step 2: Run tests — expect RED on prim count and/or pair/slab + centeredPath**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\05-symbols-svg\01-red | Out-Null
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\01-red\vitest-raw.log
```

Write `01-red/run.json` with real exitCode (expect non-zero).

Expected: FAIL — current `modularCabinetBlock` has only **2** prims; slab and pair both share the same mid line today; `furnitureBlockUsesCenteredPath` returns true. Preserve full log (zero suppression).

- [ ] **Step 3: Commit red tests**

```powershell
cd D:\OandO07072026
git add site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts results/planner/world-standard-wave/05-symbols-svg/01-red
git commit -m "trustdata(P05): red W2 cabinet-v0 Block2D symbol quality"
```

---

### Task 2: Implement readable modularCabinetBlock (green)

**Files:**
- Modify: `site/features/planner/open3d/catalog/furnitureBlock2D.ts` (`modularCabinetBlock` + `furnitureBlockUsesCenteredPath`)
- Test: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`

- [ ] **Step 1: Replace modularCabinetBlock with original O&O plan symbol**

In `site/features/planner/open3d/catalog/furnitureBlock2D.ts`, replace `modularCabinetBlock` so plan symbols are top-left origin (compatible with `renderBlock2DCentered`), original geometry only. Read `item.modularOptions` as `Open3dModularCabinetV0Options | undefined` (already on the item — no cast to mesh `ModularCabinetV0Options` required).

```typescript
function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const inset = Math.min(16, Math.max(6, Math.min(w, d) * 0.04));
  const frontY = d - inset; // plan: +Y depth; front of unit at larger Y
  const stroke = BLOCK_STYLE.storageStroke;
  const strokeW = BLOCK_STYLE.surfaceStrokeWidth;

  const prims: Prim[] = [
    // Carcass fill
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: BLOCK_STYLE.storage,
      stroke,
      strokeWidth: strokeW,
      radius: 4,
    },
    // Inner clear opening cue (not empty: second rect)
    {
      kind: "rect",
      x: inset,
      y: inset,
      w: Math.max(1, w - inset * 2),
      h: Math.max(1, d - inset * 2),
      fill: "none",
      stroke,
      strokeWidth: 1,
      radius: 2,
    },
    // Front face (buyer-facing edge)
    {
      kind: "line",
      points: [inset, frontY, w - inset, frontY],
      stroke,
      strokeWidth: 2,
    },
    // Back wall cue (opposite front) — orientation readability
    {
      kind: "line",
      points: [inset, inset, w - inset, inset],
      stroke,
      strokeWidth: 1.5,
    },
  ];

  if (doorStyle === "pair") {
    // Center stile / pair split only for pair (not slab)
    prims.push({
      kind: "line",
      points: [w * 0.5, inset, w * 0.5, frontY],
      stroke,
      strokeWidth: 1.5,
      dash: [6, 4],
    });
    const handleW = Math.min(28, w * 0.06);
    const handleH = Math.min(10, d * 0.06);
    const handleY = frontY - handleH - 4;
    prims.push({
      kind: "rect",
      x: w * 0.25 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
    prims.push({
      kind: "rect",
      x: w * 0.75 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
  } else if (doorStyle === "slab") {
    // Single door: NO mid stile (geometry must differ from pair)
    const handleW = Math.min(36, w * 0.08);
    const handleH = Math.min(12, d * 0.07);
    prims.push({
      kind: "rect",
      x: w - inset - handleW - 8,
      y: frontY - handleH - 4,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
  } else {
    // doorStyle === "none": open carcass — shelves only
    prims.push({
      kind: "line",
      points: [inset, d * 0.33, w - inset, d * 0.33],
      stroke,
      strokeWidth: 1,
      dash: [8, 4],
    });
    prims.push({
      kind: "line",
      points: [inset, d * 0.66, w - inset, d * 0.66],
      stroke,
      strokeWidth: 1,
      dash: [8, 4],
    });
  }

  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}
```

Also replace the dead/wrong helper:

```typescript
/**
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false; kept so callers do not assume modular uses centered path coords.
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
```

Rules for this edit:

- Keep **top-left** prim coordinates (0..w, 0..d) so `renderBlock2DCentered` continues to work.
- **slab ≠ pair:** only pair draws a vertical mid stile.
- Do **not** import competitor path data.
- Do **not** load `/svg-catalog` in this function.
- Do **not** redesign 3D mesh (P08).
- Do **not** wire `generateCabinetV0Footprint` into canvas draw.

- [ ] **Step 2: Run unit tests — expect GREEN**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\05-symbols-svg\02-green | Out-Null
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\02-green\vitest-raw.log
```

Write `02-green/run.json` with real exitCode (expect 0). Expected: all tests in both files PASS. Full log retained.

- [ ] **Step 3: Commit green symbol**

```powershell
cd D:\OandO07072026
git add site/features/planner/open3d/catalog/furnitureBlock2D.ts site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts results/planner/world-standard-wave/05-symbols-svg/02-green
git commit -m "fix(open3d): readable cabinet-v0 Block2D plan symbol for W2 (P05)"
```

---

### Task 3: Guard non-modular unknown SKU still not empty-box

**Files:**
- Modify: `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` (add **one** case)
- Touch implementation only if `buildGenericBlock2D` / bridge returns zero prims for a common id

**Note:** `demo-desk` ≥1 prim + modular basic are **already** in this file — do not duplicate them. New coverage = unknown SKU box fallback only.

- [ ] **Step 1: Add guard test for non-empty unknown furniture**

Append to `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` inside or after `describe("furnitureBlock2DFromItem")`:

```typescript
  it("box fallback still draws a rect when bridge returns nothing", () => {
    const block = furnitureBlock2DFromItem({
      id: "unknown-1",
      catalogId: "zz-unknown-sku-no-bridge",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 500,
      depth: 500,
      height: 500,
    });
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.prims.some((p) => p.kind === "rect")).toBe(true);
  });
```

- [ ] **Step 2: Run and fix only if RED**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\05-symbols-svg\03-nonempty | Out-Null
pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\03-nonempty\vitest-raw.log
```

Write `03-nonempty/run.json`. If RED because bridge throws empty: keep `boxBlock` / `buildGenericBlock2D` path in `furnitureBlock2DFromItem` (already present). Do not invent new engines.

- [ ] **Step 3: Commit**

```powershell
cd D:\OandO07072026
git add site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts results/planner/world-standard-wave/05-symbols-svg/03-nonempty
git commit -m "trustdata(P05): guard non-empty Block2D for unknown SKU fallback"
```

---

### Task 4: SVG pipeline honesty — authority NOTES + README (no fake canvas claim)

**Files:**
- Modify: `site/features/planner/asset-engine/README.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/run.json` (if smoke runs)
- Read: `site/features/planner/asset-engine/svg/compileAuthority.ts`, `publishDescriptorWithPipeline.ts`, `stages.ts`

**Gate split:** SVG CLI smoke proves **publish honesty evidence**. It is **not** the W2 symbol-quality pass. W2 symbol half can green without smoke if Block2D units + visual + honesty prose are solid — but then CP-05 must **not** claim “SVG pipeline smoke green.”

- [ ] **Step 1: Run SVG CLI smoke (fixtures only — O&O pipeline, not competitor files)**

```powershell
cd D:\OandO07072026\site
New-Item -ItemType Directory -Force -Path ..\results\planner\world-standard-wave\05-symbols-svg\04-svg-honesty | Out-Null
pnpm run scripts:smoke:svg:batch 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\04-svg-honesty\svg-batch-raw.log
```

Expected: fixtures write under `public/svg-catalog/*.svg` without error. If fail, log honest blocker in NOTES; do not paste external SVG to “fix.” Record exitCode in `run.json`.

- [ ] **Step 2: Write honesty NOTES (hard claims only)**

Create `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md`:

```markdown
# SVG path honesty (P05)

## What is true

1. Publish compile authority = `compileSvgForPublish` → pipelineCore+normalize
   (`site/features/planner/asset-engine/svg/compileAuthority.ts`).
2. Admin publish wire = `publishDescriptorWithPipeline`
   → compile (S1–S3) → S4 `public/svg-catalog/{slug}.svg` → persist descriptor.
3. CLI fixtures: `pnpm run scripts:smoke:svg` / `scripts:smoke:svg:batch`.
4. V1 `svgCompiler.server.ts` is **v1-reference-only** — not publish wire.
5. Open3d **plan canvas does not draw** from `/svg-catalog/*.svg` today.
   Plan symbols = Block2D prims via `furnitureBlock2DFromItem` (top-left + centered draw).
6. `generateCabinetV0Footprint` is a mesh/helper path string — not canvas Block2D authority.

## What is not true (do not claim in W2)

1. “SVG is the FeasibilityCanvas authority.”
2. “cabinet-v0 plan mark is published SVG.”
3. “Portal svg-catalog proves planner place symbols.”
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (fixed false in P05)

## Smoke result this run

- scripts:smoke:svg:batch exit: (code)
- Claim smoke green only if exit 0 and log present.

## Later cutover (not this phase)

When S7 catalog consume is product-complete, a **future** phase may bind inventory
preview URLs to published SVG while **plan canvas** either:
- keeps Block2D (recommended until Fabric full stage), or
- gains an explicit adapter with tests proving parity.

## Ethics

No competitor SVG bytes in `public/svg-catalog/`. Fixtures + admin descriptors only.
```

- [ ] **Step 3: Patch asset-engine README with a short “Canvas vs publish” section**

Append to `site/features/planner/asset-engine/README.md` (do not delete existing honesty tables):

```markdown
## Canvas vs publish SVG (P05 honesty)

| Surface | Authority today | Entry |
|---------|-----------------|-------|
| open3d plan furniture symbols | **Block2D prims** (top-left; canvas centers) | `furnitureBlock2DFromItem` → `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| Admin/CLI published SVG files | **pipelineCore+normalize** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| Portal preview | Published SVG URL | `/portal/svg-catalog` |

W2 acceptance is **Block2D readable**, not “SVG loaded onto FeasibilityCanvas.”
Do not mark S7 implemented until inventory place consumes published SVG with evidence.
```

- [ ] **Step 4: Commit honesty slice**

```powershell
cd D:\OandO07072026
git add site/features/planner/asset-engine/README.md results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty
git commit -m "trustdata(P05): SVG vs Block2D canvas authority honesty"
```

---

### Task 5: Visual evidence (unit raster or browser screenshot)

**Files:**
- Create: `results/planner/world-standard-wave/05-symbols-svg/05-visual/NOTES.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/05-visual/cabinet-v0-block2d.png` (or Playwright PNG)
- Optional test helper under `site/tests/unit/...` only if node-canvas available; prefer Playwright on `/planner/open3d` when place path works

- [ ] **Step 1: Prefer Playwright place + PNG if inventory place works**

If open3d can place `cabinet-v0` without other red gates blocking:

```powershell
cd D:\OandO07072026\site
# Example pattern — align selector with live InventoryPanel labels after P01 truth:
# pnpm exec playwright test tests/e2e/<existing-open3d-spec>.ts --reporter=line
```

Capture 2D view with cabinet visible to:

`results/planner/world-standard-wave/05-symbols-svg/05-visual/cabinet-v0-plan.png`

If Playwright place is blocked by P07 work, use **Step 2** instead — do not claim browser W2 complete without place.

- [ ] **Step 2: Fallback visual — document prim dump as proof**

Write `results/planner/world-standard-wave/05-symbols-svg/05-visual/cabinet-v0-prims.json` by running a one-shot script or vitest that serializes the block:

```typescript
// inside a vitest it() or small tsx script — commit output JSON only
const block = furnitureBlock2DFromItem({
  id: "vis",
  catalogId: "cabinet-v0",
  position: { x: 0, y: 0 },
  rotation: 0,
  scale: { x: 1, y: 1, z: 1 },
  width: 800,
  depth: 400,
  height: 900,
  geometryMode: "modular-cabinet-v0",
  modularOptions: {
    widthMm: 800,
    depthMm: 400,
    heightMm: 900,
    doorStyle: "pair",
    material: "white",
  },
});
// expect prims.length >= 4; write JSON to results path via fs in test only if project allows
// Also dump doorStyle: "slab" side-by-side to prove geometry differs (no mid stile on slab)
```

NOTES must say which proof mode was used (browser PNG vs prim JSON).

- [ ] **Step 3: Visual acceptance criteria (human + agent)**

Symbol is **readable** when all true:

1. Outer carcass rectangle visible  
2. Front edge distinguishable from back  
3. Door style (slab/pair/none) changes geometry (**pair has mid stile; slab does not**)  
4. Not a single undetailed fill with no internal marks  
5. No competitor artwork

- [ ] **Step 4: Commit visual evidence**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/05-symbols-svg/05-visual
git commit -m "trustdata(P05): visual/prim evidence for cabinet-v0 Block2D"
```

---

### Task 6: CP-05 gate pack + phase exit

**Files:**
- Create: `results/planner/world-standard-wave/05-symbols-svg/CP-05.json`
- Create: `results/planner/world-standard-wave/05-symbols-svg/SUMMARY.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/CP-05-run.json` (or embed command meta in CP-05.json)

- [ ] **Step 1: Re-run full P05 unit pack**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\CP-05-vitest-raw.log
```

Expected: PASS, full log. Write run meta with real exitCode.

- [ ] **Step 2: Write CP-05.json**

```json
{
  "checkpoint": "CP-05",
  "phase": "P05-symbols-svg",
  "gate": "W2-symbol-quality",
  "status": "pass-or-fail",
  "claims": {
    "cabinetV0Block2DReadable": true,
    "notEmptyBox": true,
    "doorStyleGeometryDiffers": true,
    "canvasAuthorityIsBlock2D": true,
    "furnitureBlockUsesCenteredPathIsFalse": true,
    "svgCatalogIsPublishNotCanvas": true,
    "svgHonestySmoke": "pass-or-fail-or-skipped-with-notes",
    "noCompetitorSvg": true,
    "browserPlaceJourney": "deferred-to-P07"
  },
  "evidence": [
    "results/planner/world-standard-wave/05-symbols-svg/02-green/vitest-raw.log",
    "results/planner/world-standard-wave/05-symbols-svg/02-green/run.json",
    "results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md",
    "results/planner/world-standard-wave/05-symbols-svg/05-visual/"
  ]
}
```

Set `"status"` to `"pass"` only when:

1. Unit pack green, and  
2. Visual criteria met, and  
3. Honesty NOTES committed (canvas ≠ SVG), and  
4. `furnitureBlockUsesCenteredPath` is false for modular.

`svgHonestySmoke` may be fail/skipped without failing CP-05 **symbol** half **only if** NOTES do not claim smoke green. If NOTES claim smoke green, exit must be 0 with log.

- [ ] **Step 3: Write SUMMARY.md**

```markdown
# P05 SUMMARY

## Done
- cabinet-v0 modular Block2D ≥4 prims; pair mid stile; slab no mid stile
- furnitureBlockUsesCenteredPath → false (top-left authorship honesty)
- Unit TDD red→green logs under 05-symbols-svg (+ run.json)
- SVG authority honesty (publish vs canvas)
- Ethics: original prims only

## Not done here
- Full W2 browser place of ≥2 items (P07)
- Mesh quality toe/door (P08)
- FeasibilityCanvas loading public SVG as draw authority

## Next
- P06 save honesty **or** P07 draw/place journey per owner approach A order
```

- [ ] **Step 4: Final commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/05-symbols-svg
git commit -m "trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack"
```

---

## CP-05 hard stop

| Check | Pass condition |
|-------|----------------|
| Unit | `furnitureBlock2D.cabinet-v0.test.ts` green with full log + run.json |
| Non-empty | No path returns 0 prims for modular cabinet or box fallback |
| Door style | pair mid stile present; slab mid stile absent |
| CenteredPath honesty | `furnitureBlockUsesCenteredPath` is false for modular |
| Honesty | NOTES state Block2D = canvas; SVG catalog = publish |
| SVG smoke | Optional for symbol half; required only if claiming smoke green |
| Ethics | No competitor SVG/bytes introduced |
| Visual | PNG **or** prim JSON + NOTES criteria |
| Scope | No mesh redesign, no Fabric cutover, no SVGR |

If any required row fails: stop, log in `Failures.md` with evidence path, do not mark W2 symbol half green.

---

## Commands cheat sheet

```powershell
cd D:\OandO07072026\site

# Unit P05
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose

# SVG fixtures (publish path smoke — honesty support, not W2 symbol gate alone)
pnpm run scripts:smoke:svg
pnpm run scripts:smoke:svg:batch

# Feel check (manual)
pnpm dev
# open /planner/open3d → place cabinet-v0 → inspect 2D symbol
```

---

## Self-review (plan author)

| Spec / gate item | Task coverage |
|------------------|---------------|
| W2 2D symbols readable for cabinet-v0 | Tasks 1–2, 5 |
| Stop empty boxes | Tasks 1–3 |
| doorStyle geometry differs | Tasks 1–2 (pair stile / slab none) |
| centeredPath honesty | Task 2 |
| SVG pipeline honesty / later authority | Task 4 |
| TDD | Tasks 1–2 red→green |
| Visual evidence | Task 5 |
| run.json + logs | Tasks 00–6 |
| CP-05 + results path | Task 6 |
| No competitor SVG | Ethics + Task 4 |
| Superpowers / no worktrees / commit as we go | Header + every commit step |
| No TBD placeholders | Concrete code, commands, paths |

**Placeholder scan:** none of TBD / TODO / “implement later” / “write tests for the above” without code.

---

## Execution handoff

Plan saved to `Plans/trustdata/phases/P05-symbols-svg.md`.  
Suggestions: `Plans/trustdata/reviews/P05-suggestions.md`.

When owner unlocks implementation:

1. **Subagent-Driven (recommended)** — one subagent per task (00→6), review between tasks  
2. **Inline Execution** — executing-plans in session with CP-05 stop  

Owner chooses. Do not start code until unlock.

---

## Expert revision note — 2026-07-09

**Role:** planning expert (plan-only; no product code this pass).  
**Inputs:** live verification of `furnitureBlock2D.ts`, `renderBlock2DToCanvas.ts`, FeasibilityCanvas draw loop, `compileSvgForPublish` / svg-catalog path, existing unit tests, AGENT-RULES / RESULTS-MAP; suggestions in `Plans/trustdata/reviews/P05-suggestions.md`.

**Top 5 applied (from suggestions S1–S7):**

1. **S1 — `furnitureBlockUsesCenteredPath` honesty:** Task 2 fixes dead/wrong helper to always return `false`; unit asserts top-left authorship; baseline NOTES document the lie.  
2. **S2 — doorStyle geometry must differ:** slab has **no** mid stile; only pair draws vertical stile; tests assert pair ≥1 / slab 0 mid verticals.  
3. **S3 — evidence + commit shape:** every automated slice requires `run.json` + raw log; commits use `trustdata(P05):` / `fix(open3d):`.  
4. **S4 — Task 3 de-dupe:** drop duplicate demo-desk case; only add unknown-SKU box fallback (demo-desk already in existing test file).  
5. **S5+S6 — type honesty + gate split:** use `item.modularOptions` without mesh cast; SVG smoke is honesty support, not automatic W2 symbol fail; CP-05 separates `svgHonestySmoke` from symbol claims.

**Also applied:** Prev/Next nav (S7); authority diagram notes for top-left + `generateCabinetV0Footprint` non-authority.  
**Not applied:** S8 shared mockContext util (noise).  
**Constraints held:** W2 symbols only; Block2D canvas authority honesty; no competitor SVG; superpowers; no product code this revision.
