# P01a — Dead path cleanup (Fabric-sole resolve)

**Status:** OPEN  
**After:** [P01](./P01-product-truth.md) inventory pack · **Before / with:** [P02](./P02-engine-lock.md)  
**Board:** [BOARD](./BOARD.md) · one Planner ID at a time  

**Outcome:** No live product import resolves to missing short paths or “accidental” archive hosts. Vitest does not pretend archive is product. E2E targets `planner-fabric-stage` only.

**Law:** Live layout = `editor` · `canvas` · `3d` · `project` · `ui` under `features/planner/`.  
2D host = `canvas/PlannerFabricStage` · testid **`planner-fabric-stage` only**.  
**No** product `open3d/` folder · **no** `canvas-fabric-stage` path · second host / `canvas-feasibility` does not / will not exist.  
SVG catalog = inventory publish only.

---

## Why

| Problem | Detail |
|---------|--------|
| Dead short path | `@/features/planner/canvas-fabric` — folder **missing** |
| Half-dead short path | `@/features/planner/editor/*` — only `PlannerErrorBoundary.tsx` live |
| Live importers | ~12 files under `features/planner/{ai,document,hooks,lib,store,components}` still import those shorts |
| Graph lie | `importGraphProof` fabric-legacy routes — **cleared** (live graph only; app fabric tree absent) |
| E2E lie | Several specs still use `planner-2d-canvas` |
| Vitest aliases | Map shorts → `_archive/fabric/*` — test-only crutch; not product law |

Product aliases already removed from `tsconfig` + `next.config` (session work). Residual is **code + tests + graph**.

---

## Task list (order — best path, not easiest)

### Phase A — Inventory lock (done / residual)

| ID | Task | Done when |
|----|------|-----------|
| A1 | P01 inventory pack on this HEAD | `00-product-truth/*` + hostWiring 4/4 |
| A2 | Owner accept CP-01 | BOARD next → P02 or this card |

### Phase B — Live product resolve (must not stay broken)

| ID | Task | Done when |
|----|------|-----------|
| B1 | List every live (non-test, non-`_archive`) import of `@/features/planner/canvas-fabric` and `@/features/planner/editor/*` | Checklist in NOTES or this card |
| B2 | For each import: **rewrite** to `editor` / `canvas` / `project` / `ui` / shared live module, **or** delete dead call site if unused by guest/canvas routes | `tsc` / targeted vitest green; no missing-module resolve |
| B3 | `workspaceStore` + AI/document bridges: either wire to live Fabric stage APIs or mark/quarantine unused by `OOPlannerWorkspace` | No import of missing path |
| B4 | `PlannerLayoutShell` / `PlannerErrorBoundary`: keep live-only error boundary; do not pull archive shell | Live file under `editor/` or `ui/` |
| B5 | `PlannerWorkspaceRoute`: keep explicit `_archive` import **or** delete if unused by app routes; never re-add short aliases in next/tsconfig | Guest/canvas stay on live host |

### Phase C — Graph + config honesty

| ID | Task | Done when |
|----|------|-----------|
| C1 | Update `importGraphProof.ts`: remove or mark historical fabric-legacy route nodes whose `app/.../fabric` paths do not exist | **Done** — live graph only + FORBIDDEN_GRAPH_IDS guard |
| C2 | Confirm product `tsconfig` / next: **no** archive short aliases; `_archive` excluded from app typecheck | Grep clean on product configs |
| C3 | Vitest: either (preferred) rewrite tests to explicit `_archive/...` imports and **delete** short aliases, **or** keep aliases with header comment “TEST ONLY / not product” until Phase D | Document choice in NOTES |

### Phase D — Tests (no archive-as-product PASS)

| ID | Task | Done when |
|----|------|-----------|
| D1 | E2E: retarget or retire specs using `planner-2d-canvas` → `planner-fabric-stage` (helpers already export live selectors) | Specs either updated or deleted with reason |
| D2 | `scripts/p06-symbols-inventory-verify.mjs` same | Script uses live testid |
| D3 | Integration tests under `tests/integration/planner-editor-*` / `planner-canvas-fabric-*`: migrate to live surface **or** move to archive-only suite that cannot claim W-gates | W3/W5 claims only on Fabric `planner-fabric-stage` |
| D4 | Remove Vitest short→archive aliases once no test needs them | vitest configs clean |

### Phase E — Dev / ops (standing)

| ID | Task | Done when |
|----|------|-----------|
| E1 | Default `dev` = webpack (done); document one-server rule | `site/package.json` + owner knows `dev:turbo` is optional/risky |
| E2 | Never two `pnpm dev` / never turbo under agents without RAM budget | Ops note |

---

## Kill list (do not)

- Re-add product `tsconfig` / next aliases to `_archive`
- Invent `canvas-feasibility`
- Prove W3/W5 on `planner-2d-canvas`
- Skip B and only “fix” Vitest aliases forever
- Claim CP-03 green from archive unit tests

---

## Evidence

`results/planner/world-standard-wave/00-product-truth/dead-path-cleanup/` (create when executing)

- `HEAD.txt` · `run.json` · `NOTES.md`  
- Commands: typecheck or targeted tsc; hostWiringP01; list of files rewritten  

---

## Sequence

```
P01 inventory → P01a dead-path cleanup (this card) → P02 engine lock → P03…
```

If owner prefers P02 first: finish B1–B2 minimum so product resolve is not broken, then P02.

---

## Next action (only)

**B1:** Enumerate live importers of dead short paths and open first rewrite batch (store + lib bridges or delete if unused by guest/canvas).
