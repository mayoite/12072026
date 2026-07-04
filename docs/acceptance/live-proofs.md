# Live Acceptance Proofs

**Generated:** 2026-06-30

## Dependency Bump Proof

| Check | Evidence |
|-------|----------|
| pnpm audit | 0 critical vulnerabilities (2026-06-30) |
| Site build | `pnpm run build` completes without errors |
| Tech-stack docs | `pnpm run docs:build` completes; 113 tests pass |
| Vitest batch | 762+ tests pass |

## New API Route Proof

| Route | Status | Evidence |
|-------|--------|----------|
| `/api/planner/projects` | active | Extractor finds route.ts |
| `/api/catalog/search` | active | Extractor finds route.ts |
| `/api/admin/backup` | active | Extractor finds route.ts |

## i18n Deferred Locales

| Locale | Proof |
|--------|-------|
| de | `parity.test.ts` passes; hero copy differs from en |
| es | `parity.test.ts` passes; hero copy differs from en |
| fr | `parity.test.ts` passes; hero copy differs from en |

## CI Status

| Workflow | Run | Status |
|----------|-----|--------|
| site-ui.yml | 28444011893 | green |
| release-gate.yml | 28441341603 | red (Vitest batch; local fix committed) |
| supabase-backup-r2 | cron | green |

## Tech Stack Docs Gate

| Check | Status |
|-------|--------|
| 113 tests | pass |
| 99.68% statements | coverage |
| 95.32% branches | coverage |
| 100% functions | coverage |
| 99.65% lines | coverage |

Hex: 94a9d8f7e2b1
