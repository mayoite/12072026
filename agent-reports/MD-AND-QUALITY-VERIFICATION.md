# MD + test-quality verification

Date: 2026-07-14  
Owner agreement: **~5% export-surface-only name-mirror tests allowed** as quality floor slack.

## Agent MDs verified

| File | Exists | Status vs live tree |
|------|--------|---------------------|
| `agent-reports/config-review.md` | Yes | **Stamped** — listed Important config issues largely **fixed** after review |
| `agent-reports/features-review.md` | Yes | **Stamped** — ops/mirror claims outdated; SVG Critical **still open** |
| `agent-reports/i18n-review.md` | Yes | **Stamped** — `workspace` Critical **still open**; request tests exist |
| `plan/Site/APP-FOLDER-RESOLVE.md` | Yes | Plan doc (execution status not fully closed for every route gap) |
| `site/config/environment/README.md` | Yes | Accurate: secrets in root `.env.local` only |

Each review file now has a **Verification stamp** section at the top.

## Name-mirror floors (path metric)

| Folder | Name-mirror |
|--------|-------------|
| app | 100% |
| components | 100% |
| features | 100% |
| lib | 100% |
| platform | 100% |
| config | 100% |
| i18n | 100% |
| scripts | Incomplete (tooling wave; not product) |

## Test quality vs 5% floor

Metric: unit test file whose only meaningful asserts are `toBeDefined` / `toBeTypeOf` (export-surface).

| Scope | Files | Export-only | % |
|-------|------:|------------:|--:|
| `site/tests/unit` (all) | 1246 | 78 | **6.26%** |
| 5% of 1246 | — | 63 | floor |

**Result:** slightly **over** the 5% floor by ~1.3 points (~15 files).  
Most export-only mass sits under `tests/unit/features/planner`.  
Hollow `expect(1).toBe(1)`: **0**. Skip/todo: **1** (find and kill if still present).

### Owner agreement applied

- Path name-mirror = primary “tests reflect site structure” bar  
- **≤5%** export-surface-only tolerated as quality slack  
- Current **6.26%** → next strict pass should bring planner export-only down under 5% without claiming false perfection today

## Still open (product, not MD theater)

1. SVG inject path (`renderBlockPrims` / client regex sanitize)  
2. i18n `workspace` + hi full consumer namespaces  
3. scripts name-mirror incomplete  
4. Export-only ≤5% not yet met (6.26%)
