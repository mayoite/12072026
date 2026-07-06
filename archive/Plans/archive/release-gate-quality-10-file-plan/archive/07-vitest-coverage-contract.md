# Phase 7 — Planner Coverage (Audits in Phase 4b)

## Purpose

Pass `test:coverage` on narrowed include + baseline+5pp thresholds.

**Audit scripts:** Phase `04b-audit-scripts.md` — not repeated here.

## Prerequisite

Phase 1 `site/results/phase07-planner-thresholds.json` — four metrics from measured rollup.

## Narrow `coverage.include` (`vitest.config.ts`)

```ts
include: [
  'app/api/**/*.{ts,tsx}',
  'features/planner/**/*.{ts,tsx}',
  'features/crm/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx}',
  'platform/**/*.{ts,tsx}',
],
```

Exclude `app/(site)/**`, `components/**` from planner rollup.

## Thresholds

Each metric = Phase 1 baseline + 5pp (max 100). Commit numbers in JSON.

Cannot shrink `include` without new Phase 1 run.

## Gap closure (in-scope only)

Priority: `app/api/**` → 0% planner files → branch-heavy planner/lib.

Mutation tests: `configuratorProductCatalogBridge.ts`, `placementCatalogResolver.ts`, `app/api/admin/_lib/server.ts`.

## Hollow verification

```powershell
pnpm run test:audit:hollow -- --exclude-marketing
```

Must pass before claiming Phase 7 complete.

## Site coverage

`test:coverage:site` — log only; deferral per Phase 10 + gaps CSV.

## Acceptance Checklist

- [ ] Narrowed `coverage.include` committed in `vitest.config.ts` **(required — still broad)**.
- [ ] `test:coverage` exit 0 **(required)**.
- [x] `test:audit:hollow` exit 0 (full repo; prerequisite met).
- [ ] `phase07-planner-thresholds.json` has numeric baseline + targets **(required — baseline fields null)**.
