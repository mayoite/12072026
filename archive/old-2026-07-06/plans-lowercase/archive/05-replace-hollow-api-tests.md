# Phase 5 — Replace Hollow API Route Tests

## Purpose

Clear all hollow patterns under `tests/unit/app/api/**` — not a fixed 11-file list.

## Scope

**Every file** under `tests/unit/app/api/**` matching Phase 1 `baseline-hollow-tests.json` tag `api`, plus any file with:

- `catch (e) {}` / `catch (_e) {}` with empty body
- `expect(true).toBe(true)`

Examples beyond the original 11: `csrf/route.test.ts`, `products/route.test.ts`, `planner/**/route.test.ts`, public API routes.

## Required test shape

1. Mock Drizzle/auth at module boundary.
2. Realistic `NextRequest`.
3. Assert `res.status` and JSON body where applicable.
4. Auth-negative tests for admin routes.

## Fixtures

`site/tests/fixtures/api/`: `adminSession.ts`, `catalogRows.ts`, `nextRequest.ts`

## Verification

```powershell
rg "expect\(true\)\.toBe\(true\)" site/tests/unit/app/api
rg "catch \(._?\) \{\}" site/tests/unit/app/api
pnpm --filter oando-site exec vitest run tests/unit/app/api
```

Both greps must return 0 matches.

## Acceptance Checklist

- [x] **Entire** `tests/unit/app/api/**` free of hollow patterns (166 tests; 0 `expect(true)` / empty catch).
- [x] Bucket **A** ESLint count 0.
- [x] Vitest API tree green.
- [ ] `phase05-api-coverage-delta.json` **(required at Phase 10)**.
