# Scripts menu (owner)

**Problem:** `site/package.json` has ~130 scripts (ops/db/cdn/i18n/e2e history).  
**Fix:** use this **short menu** only. Old scripts stay for CI — do not delete them yet.

From **repo root** (`D:\OandO07072026`):

| Command | What it does |
|---------|----------------|
| `pnpm dev` | Next dev (admin bypass via `site/.env.development.local`) |
| `pnpm p0` | P0 unit slice + SVG fixture batch smoke |
| `pnpm p0:unit` | asset-engine + G8 round-trip + modular place + dev-auth unit tests |
| `pnpm p0:g8` | **P0.2 unit slice**: G8 load/round-trip + modular GLB plan/export/stamp (existing files only) |
| `pnpm p0:svg` | SVG fixtures → `public/svg-catalog` |
| `pnpm p0:admin-svg` | Playwright P0.1 admin publish E2E (needs server; set `PLAYWRIGHT_BASE_URL` if reusing `pnpm dev`) |
| `pnpm test` | Full vitest (site) |
| `pnpm gate` | Fast release gate (lint + typecheck + unit + audits) |
| `pnpm gate:full` | Full release gate (slow: build + e2e + coverage) |
| `pnpm build` / `pnpm start` | Production path (note: build may still fail on `/contact`) |

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

### P0.2 G8 + modular GLB (unit)

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
cd D:\OandO07072026
pnpm p0:g8
```

**Not in `p0:g8` yet (P0.2 residuals):** storage upload of G5 buffer, real Chrome load smoke. When sibling agents add those tests under `site/tests/`, extend the `p0:g8` script in `site/package.json` (and this table) — do not invent failing placeholders.

### P0.1 admin E2E (typical)

```powershell
# terminal 1
cd D:\OandO07072026\site
pnpm dev

# terminal 2
cd D:\OandO07072026
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
$env:DEV_AUTH_BYPASS = "1"
pnpm p0:admin-svg
```

### Everything else

Still available as long names (`db:apply`, `catalog:ingest`, `backup:r2`, …).  
Use only when that domain is the task — not for daily hard path.

### Why not delete the 130?

CI, START.md, and old habits call them by name. Consolidation = **aliases first**, prune later with a mapped list.
