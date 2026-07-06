# Phase 8 — Gate Playwright (Tier 1 + Tier 2)

## Purpose

Green Playwright steps in `release:gate`. `test:site-ui` → site-ui pack.

## Current state (2026-06-30)

Nav + a11y **pass with env** when `loadEnvLocal` loads Supabase vars. Gate still requires **0 skipped** in CI (remove `test.skip` lines — skips hide failures when env is missing).

`playwright.config.ts` already calls `loadEnvLocal()` — do not duplicate.

## Tier 1 — 0 skips

- `test:a11y`
- `test:e2e:nav`

Remove `test.skip(!hasSupabaseEnv, …)` in `site-navigation-smoke.spec.ts`. Add startup guard:

```ts
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL required for gate Playwright');
}
```

JSON reporter must show `skipped: 0` for Tier 1.

## Tier 2 — `test:planner-catalog` (shrunk default)

**Default gate script includes only:**

- `planner-catalog.spec.ts` (stable subset)
- `planner-guest-workspace.spec.ts`

**Excluded from gate** (track in `Failures.md`):

| Spec | ID | Reason |
|------|-----|--------|
| `planner-chrome.spec.ts` | `PL-E2E-CHROME` | v1 UI removed |
| `planner-custom-tools.spec.ts` | `PL-E2E-TOOLS` | Fabric flake — nightly job |

Specs **in** gate script: **0 skipped** after fixes.

Maintain allowlist in `site/config/build/playwright-gate-specs.json` for `test:audit:gate-skips`.

## Flake policy

- `retries: 1` for gate Playwright only (document in `TESTING.md`)
- Frozen storage state where applicable

## Acceptance Checklist

- [x] `playwright-gate-specs.json` lists all gate specs (6 specs; `excluded: []`).
- [x] `test:planner-catalog` includes chrome + custom-tools + guest-workspace + catalog.
- [x] 0 `test.skip` / `describe.skip` in gate specs (audit `test:audit:gate-skips` passes).
- [ ] Tier 1 + Tier 2 green in `release:gate` **(required — 16 failures in `phase10-release-gate-7.log`)**.
