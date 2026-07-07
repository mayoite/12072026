# 02 Styling Contract

Goal: stop UI drift at the rules layer.

## Modules

- CSS and Tailwind.
- Site UI shell.
- Admin styling rules.
- Planner styling rules.

## Allowed Scope

1. `site/app/css`
2. `site/scripts/lint-ui-contract.mjs`
3. Affected module CSS only
4. CSS docs when truth changes

## Hard No-Go Scope

1. Page polish.
2. Hardcoded fonts, colors, spacing, size, or motion in TSX.
3. New CSS mirrors under `features/`, `lib/`, `data/`, or `api/`.

## Read First

1. `docs/Lockedfiles/conduct/ReadmeLocked.md`
2. `docs/architecture/CSS-SOLUTION.md`
3. `docs/architecture/MODULE-LAYOUT.md`
4. `docs/architecture/MODULE-UI-CONTRACT.md`

## Initial Commands

```powershell
pnpm --filter oando-site run lint:ui
pnpm --filter oando-site run lint:ui:strict
```

## Exit Evidence

1. Styling contract decision.
2. `lint:ui` result.
3. `lint:ui:strict` result, if run.
4. Known TSX styling violations.

## Likely Failures

1. TSX hardcoded styling.
2. Planner CSS module drift.
3. Admin palette drift.
4. Legacy `ooplanner` usage.

## Stop Conditions

1. Fix requires broad UI redesign.
2. Styling rule conflicts with product intent.
3. Lint output is incomplete.
