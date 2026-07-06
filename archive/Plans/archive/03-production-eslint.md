# Phase 3 — Production ESLint Zero

## Purpose

All production TypeScript under ESLint scope passes with zero errors and zero warnings before test remediation proceeds.

## Scope

ESLint `files` glob from `site/package.json` lint script:

```
app components features lib tests
```

This phase covers **`app`**, **`components`**, **`features`**, **`lib`** only.

## Known Production Defects (baseline)

| File | Rule | Fix |
|------|------|-----|
| `features/planner/catalog/configuratorProductCatalogBridge.ts:24` | `eqeqeq` ×3 | `== null` → `=== null` |

## Procedure

1. Run lint scoped to production paths:

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs app components features lib --max-warnings=0 2>&1 | Tee-Object site/results/phase03-eslint-production.log
```

2. Fix every reported error and warning in production files.
3. Re-run until exit 0.

## Production Rules (no exceptions)

- `eqeqeq` — strict equality always.
- `@typescript-eslint/no-explicit-any` — replace with proper types.
- `@typescript-eslint/no-unused-vars` — remove or prefix with `_` only when the symbol is intentionally unused per ESLint config.
- `@next/next/no-img-element` — use `next/image` or shared image component in app code.
- `react-hooks/exhaustive-deps` — correct dependency arrays.
- `no-console` — only `console.warn` and `console.error` allowed.

## Acceptance Checklist

- [x] `eslint … app components features lib --max-warnings=0` exits 0 (2026-06-30).
- [x] Zero `eslint-disable` in production files (audit script committed).
- [ ] Phase log saved to `site/results/phase03-eslint-production.log` **(required — missing)**.
- [x] No production file remains in baseline taxonomy bucket **S** (`eqeqeq` fixed).
