# Scripts menu (owner)

**Problem:** `site/package.json` has ~130 scripts (ops/db/cdn/i18n/e2e history).  
**Fix:** use this **short menu** only. Old scripts stay for CI — do not delete them yet.

**Status (2026-07-09):** P0.1 **DONE** · P0.2 **MOSTLY DONE** (unit closed — continuous verify below) · P0.3 **IN PROGRESS** (a11y). See [00-PENDING.md](./00-PENDING.md).

From **repo root** (`.`):

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Next dev (admin bypass via `site/.env.development.local`) |
| `pnpm p0` | P0 unit slice + SVG fixture batch smoke |
| `pnpm p0:unit` | asset-engine + G8 round-trip + modular place + dev-auth unit tests |
| `pnpm p0:g8` | **P0.2 continuous verify**: G8 load/round-trip + modular GLB plan/export/stamp (existing files only) |
| `pnpm p0:svg` | SVG fixtures → `public/svg-catalog` |
| `pnpm p0:admin-svg` | Playwright P0.1 admin publish E2E (needs server; set `PLAYWRIGHT_BASE_URL` if reusing `pnpm dev`) |
| `pnpm test:e2e:open3d-world` | **W-gate browser pack** (journey + W3 + W4 + save honesty + systems batch) → `results/planner/world-standard-wave/gate-e2e/` |
| `pnpm gate:open3d` | typecheck + open3d world e2e pack (callable CI truth for open3d gates) |
| `pnpm test` | Full vitest (site) |
| `pnpm gate` | Fast release gate (lint + typecheck + unit + audits) |
| `pnpm gate:full` | Full release gate (slow: build + e2e + coverage) |
| `pnpm gate:open3d` | Open3d world pack: site typecheck + curated Playwright e2e |
| `pnpm test:e2e:open3d-world` | Curated open3d W-gate Playwright pack only (no typecheck) |
| `pnpm build` / `pnpm start` | Production path (note: build may still fail on `/contact`) |
| `pnpm dev:tech-stack` | Workflow docs app (name **kept**) |
| `pnpm build:tech-stack` | Build workflow docs (name **kept**) |
| `pnpm preview:tech-stack` | Preview workflow docs (name **kept**) |

From **site/** (`cd site`):

| Command | Same as |
|---------|---------|
| `pnpm p0` | unit + svg smoke |
| `pnpm p0:unit` | … |
| `pnpm p0:g8` | G8 + modular GLB unit files listed below |
| `pnpm p0:svg` | `scripts:smoke:svg:batch` |
| `pnpm p0:admin-svg` | `test:e2e:p0-admin-svg` |
| `pnpm gate` | `release:gate:fast` |
| `pnpm gate:full` | `release:gate` |
| `pnpm gate:open3d` | `typecheck` + `test:e2e:open3d-world` |
| `pnpm test:e2e:open3d-world` | `scripts/run-open3d-world-e2e.mjs` (manifest specs) |

### P0.2 G8 + modular GLB — continuous status (unit closed)

**P0.2 unit work is closed** ([15-P0-2-DONE.md](./15-P0-2-DONE.md)). Use `pnpm p0:g8` as **continuous regression** after hard-path edits while P0.3 (a11y) runs — do not re-open P0.2 unit scope.

`pnpm p0:g8` runs **only files that already exist** (no invented paths). Today:

| Path | Role |
|------|------|
| `tests/unit/features/planner/open3d/g8RoundTrip.test.ts` | `generatedGlbUrl` save/reload + cancel-safe load |
| `tests/unit/features/planner/open3d/loadGeneratedGlbObject.test.ts` | G8 mock loader / scene pass-through |
| `tests/unit/features/planner/lib/shouldLoadGlb.test.ts` | Load policy |
| `tests/unit/features/planner/lib/glbAssetPolicy.test.ts` | URL policy |
| `tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | G5 plan path under `catalog-assets/generated/` |
| `tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` | Modular place mesh |
| `tests/unit/features/planner/asset-engine/meshStages.test.ts` | G5–G6 binary in memory |
| `tests/unit/features/planner/asset-engine/placeModularWithGeneratedGlbPlan.test.ts` | Place + stamp plan (not upload) |
| `tests/unit/features/planner/asset-engine/stampFurnitureGeneratedGlb.test.ts` | Path stamp on furniture |

```powershell
cd .
pnpm p0:g8
```

**P0.2 residuals (not blocking P0.3):** optional Chrome open3d load smoke; remote storage upload of G5 buffer. When those tests land under `site/tests/`, extend the `p0:g8` script in `site/package.json` (and this table) — do not invent failing placeholders.

### P0.1 admin E2E (typical)

```powershell
# terminal 1
cd site
pnpm dev

# terminal 2
cd .
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
$env:DEV_AUTH_BYPASS = "1"
pnpm p0:admin-svg
```

### Open3d world-standard browser pack (W gates)

```powershell
# terminal 1 — prefer reusing dev (faster than build+start)
cd .
pnpm dev

# terminal 2
cd .
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm test:e2e:open3d-world
# or: pnpm gate:open3d   (typecheck + pack)
```

Evidence: `results/planner/world-standard-wave/gate-e2e/` (`run.json`, `playwright-raw.log`).  
Spec list: `site/config/build/playwright-open3d-world-specs.json`.

### Open3d world-standard e2e gate

Curated pack (not full planner e2e). Specs listed in `site/config/build/playwright-open3d-world-specs.json`. Evidence → `results/planner/world-standard-wave/gate-e2e/`.

```powershell
cd .
# full gate (typecheck + e2e)
pnpm gate:open3d

# e2e only
pnpm test:e2e:open3d-world
```

Needs a running app (or Playwright webServer config). Set `PLAYWRIGHT_BASE_URL` if reusing `pnpm dev`.

### Everything else

Still available as long names (`db:apply`, `catalog:ingest`, `backup:r2`, …).  
Use only when that domain is the task — not for daily hard path.

### Why not delete the 130?

CI, START.md, and old habits call them by name. Consolidation = **aliases first**, prune later with a mapped list.
