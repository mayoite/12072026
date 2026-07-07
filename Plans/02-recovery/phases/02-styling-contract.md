# 02 Styling Contract

Goal: stop UI drift at the rules layer.

## Modules

- CSS and Tailwind.
- Site UI shell.
- Admin styling rules.
- Planner styling rules.
- Design-to-code intake rules.

## Allowed Scope

1. `site/app/css`
2. `site/scripts/lint-ui-contract.mjs`
3. Affected module CSS only
4. CSS docs when truth changes

## Hard No-Go Scope

1. Page polish.
2. Hardcoded fonts, colors, spacing, size, or motion in TSX.
3. New CSS mirrors under `features/`, `lib/`, `data/`, or `api/`.
4. Code Connect mappings.
5. Design-tool package additions.

## Read First

1. `docs/Lockedfiles/conduct/ReadmeLocked.md`
2. `docs/architecture/CSS-SOLUTION.md`
3. `docs/architecture/MODULE-LAYOUT.md`
4. `docs/architecture/MODULE-UI-CONTRACT.md`
5. `docs/architecture/DESIGN-SYSTEM-INTAKE.md`

## Token Map

| Token type | Source |
| --- | --- |
| Global theme tokens | `site/app/css/core/tokens/theme.css` |
| Typography utilities | `site/app/css/core/typography/type.css` |
| Planner tokens | `site/app/css/core/planner/planner-tokens.css` |
| Planner typography | `site/app/css/core/planner/planner-typography.css` |
| Shared components | `site/app/css/core/components` |
| Shared utilities | `site/app/css/core/utilities` |
| Admin shell | `site/app/css/core/chrome/shell/admin-pages.css` |

## TSX Boundary

TSX owns structure, semantics, state, data flow, and accessibility wiring.

CSS owns color, typography, spacing, radius, shadow, size, surface styling, and motion.

Do not hardcode these in TSX:

1. Hex, rgb, hsl, or named colors.
2. Font families or sizes.
3. Spacing numbers.
4. Visual width or height numbers.
5. Border radius values.
6. Box shadow values.
7. Animation duration, easing, distance, or delay.

## Design Intake

This phase defines design-to-code rules only.

It does not create Code Connect mappings.

Penpot is first.

Figma is optional later.

Flow:

1. Identify the exact design source.
2. Keep a visual reference.
3. Export SVG or image assets only when needed.
4. Map values to repo tokens.
5. Reuse existing components.
6. Translate design output into repo conventions.
7. Validate visually before claiming parity.

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
5. Design intake rule decision.

## Likely Failures

1. TSX hardcoded styling.
2. Planner CSS module drift.
3. Admin palette drift.
4. Legacy `ooplanner` usage.
5. Ad hoc motion values in TSX.

## Stop Conditions

1. Fix requires broad UI redesign.
2. Styling rule conflicts with product intent.
3. Lint output is incomplete.
4. Figma work needs Code Connect before component homes are stable.
5. Penpot exports require SVG import or asset policy decisions.
