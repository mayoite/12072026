# Phase 2 — Secretlint Zero

## Purpose

Root `release:gate` runs `lint:secrets` before site scripts. This phase clears that blocker without weakening secretlint.

## Failure

`docs/database/RESTORE-RUNBOOK.md:93` — `pg_restore -d $env:PRODUCTS_DATABASE_URL` matches `@secretlint/secretlint-rule-database-connection-string`.

## Required Fix

Rewrite §3c so the documented example:

1. Never contains a substring that resembles a PostgreSQL URI or connection string pattern.
2. Instructs the operator to set the variable in environment first.
3. Uses a neutral placeholder in inline comments only (`<PRODUCTS_DATABASE_URL from env>`).

Example shape (adjust prose to match runbook tone):

```powershell
# PRODUCTS_DATABASE_URL must already be set in the shell (Supabase Session pooler URI).
if (-not $env:PRODUCTS_DATABASE_URL) { throw "Set PRODUCTS_DATABASE_URL first." }
pg_restore -d $env:PRODUCTS_DATABASE_URL --no-owner --no-acl -Fc products.dump
```

If secretlint still flags `$env:PRODUCTS_DATABASE_URL` on the `pg_restore` line, split into a local variable assigned from env and verify the rule accepts it:

```powershell
$TargetDb = $env:PRODUCTS_DATABASE_URL
pg_restore -d $TargetDb --no-owner --no-acl -Fc products.dump
```

Scan the full repo for similar patterns in `docs/` and fix every match in the same phase.

## Verification

```powershell
pnpm run lint:secrets 2>&1 | Tee-Object site/results/phase02-lint-secrets.log
```

Exit code must be 0. Log must show 0 problems.

## Acceptance Checklist

- [x] `pnpm run lint:secrets` exits 0 (full repo, 2026-06-30).
- [x] No secretlint ignore rules added.
- [x] `docs/database/RESTORE-RUNBOOK.md` remains operationally correct.
- [x] Phase log saved to `site/results/phase02-lint-secrets.log`.
- [x] `Failures.md` secretlint blocker closed.
