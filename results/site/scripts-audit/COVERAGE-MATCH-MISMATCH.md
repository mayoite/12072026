# Coverage: tests vs report mismatch (2026-07-09)

## Claim

“Tests cover far more than the report shows.”

## Verdict

**Partly true for the headline TOTAL. False for per-file % on the modules you actually tested.**

### Live probe (3 workstation unit files only)

| Metric | Value |
|--------|--------|
| Tests | `workstationSystemV0` + `ConfiguratorV0` + `MeshV0` |
| Files instrumented | **700** |
| Files with any hit | **3** |
| Files at 0% | **697** |
| **TOTAL statements** | **138 / 26458 ≈ 0.52%** |
| `workstationSystemV0.ts` | **76.7%** (56/73) |
| `workstationConfiguratorV0.ts` | **91.2%** (31/34) |
| `workstationMeshV0.ts` | **96.2%** (51/53) |

So: the suite **does** cover those modules heavily. The **total** row is almost all **force-included zeros** (`coverage.all` + broad `include`), not missing hits on the files under test.

## Root cause (config, not V8 lying about lines)

`vitest.config.ts`:

```ts
coverage: {
  all: true, // explicit after 2026-07-09
  include: [
    'app/api/**/*',
    'features/planner/**/*',
    'features/crm/**/*',
    'lib/**/*',
    'platform/**/*',
  ],
}
```

Any run (even one test file) instruments the whole include universe. Untouched files enter the denominator as 0% → total collapses.

## Secondary traps

1. **Alias to archive fabric**  
   `@/features/planner/editor` and `canvas-fabric` resolve to `features/planner/_archive/fabric/...`  
   Live open3d editor is under `features/planner/open3d/editor`.  
   Tests that import the old alias **do not** raise open3d editor %.

2. **Playwright e2e** never feeds V8 coverage.

3. **Line map** for V8 often omits `l`; reporters derive lines from statements (`coverage-metrics.mjs`) — can differ slightly from IDE line counts, not by orders of magnitude.

## How to read coverage

| Question | Look at |
|----------|---------|
| Did this module get tested? | **Per-file** row for that path |
| Gate / “how much of product is untested?” | **FULL include** total (harsh) |
| “How thorough were the tests that ran?” | **TOUCHED files only** dual rollup |

```bash
pnpm run test:coverage
node scripts/analyze-coverage-gap.mjs
# prints DUAL ROLLUP: full vs touched
```

## Fix landed

- `coverage-metrics.mjs` → `dualRollupFromFinal`
- `analyze-coverage-gap.mjs` prints dual rollup first
- `vitest.config.ts` → `all: true` documented (was implicit via include behavior)
