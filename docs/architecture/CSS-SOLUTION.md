# CSS Solution — Oando Platform

**Status:** Locked folder policy (execution via UI-0 → UI-3)  
**Authority:** `plann/00-REVISION.md` → `plann/06-UI-PLAN.md` → [`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md) → **this file**  
**Index:** [`README.md`](README.md) · [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md)  
**Placement:** [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — styles live in `app/css/`, never mirrored under `features/`  
**Locked baseline:** [`docs/Lockedfiles/architecture/current.md`](../Lockedfiles/architecture/current.md) · [`proposed.md`](../Lockedfiles/architecture/proposed.md)

---

## Problem

CSS is doing the real styling work in this repo, but the ownership model has drifted. That creates three problems:

1. Repeated styling gets scattered across TSX and CSS
2. Folder names do not always match who owns the style
3. Tailwind utilities and authored CSS blur together instead of having clear roles

---

## Solution

Make `app/css/` the canonical styling system and treat Tailwind as the base engine, not the authoring destination.

### Principle

- TSX owns structure and behavior
- CSS owns repeated visual patterns and surface styling
- Shared styling should live in `app/css/`
- Route-owned styling should stay close to the route or feature that owns it
- Pure data and logic folders should not spawn CSS mirrors
- Canonical content/data homes stay in `lib/site-data/`, `i18n/messages/`, and `config/route-contract.json`

### Token-first stack (locked)

```text
theme.css → surface bundles → @utility/component CSS → CSS modules (open3d) → TSX structure
```

| Surface | TSX styling rule |
|---------|------------------|
| Site marketing | `typ-*`, scheme utilities; layout Tailwind OK |
| Admin | No raw palette; `admin-pages.css` + semantic utilities |
| Planner open3d (`/planner/open3d`) | **No Tailwind in TSX**; CSS modules + `var(--planner-*)` only |

---

## Canonical CSS roles

| Path | Role |
|------|------|
| `app/css/index.css` | Entrypoint (shared `core/` fundamentals only) |
| `app/css/core/theme.css` | `@theme` tokens |
| `app/css/core/utilities/*.css` | Typography, animations, layout/color/scheme utilities (split by use, ≤350 lines each) |
| `app/css/core/components/*.css` | Shared component styles (extract on 3rd use) |
| `app/css/core/locked/site/` | Site surface — flat `*.css` + `index.css` |
| `app/css/core/locked/admin/` | Admin surface — flat `*.css` + `index.css` |
| `app/css/core/locked/planner/` | Planner surface — flat `*.css`; `marketing.css` / `open3d-workspace.css` entries |

**Legacy:** `app/css/ooplanner/` — folded into `core/locked/planner/workspace-*.css` (2026-07-07).

---

## Current vs proposed

| Area | Current | Proposed |
|------|---------|----------|
| Open3d pilot | Single `open3d-workspace.css` in `core/locked/planner/` | via `app/planner/open3d/layout.tsx` |
| Admin | Some raw Tailwind palette on older routes | `admin-pages.css` primitives + `lint:ui` |
| Marketing | `home-*` + legacy `scheme-*` dialects | UI-3 migration per SITE-MARKETING contract |
| Enforcement | `lint:ui` warn | `lint:ui:strict` after UI-1 shell |

---

## What to do with existing styles

1. Keep global constants and tokens in the token layer.
2. Move repeated button/card/nav/panel patterns into shared component CSS.
3. Keep one-off route styling in the route or feature that owns it (via layout bundle, not a `features/*/css/` mirror).
4. Keep layout helpers in the utility layer instead of copying them into TSX.
5. Keep `base/` small and boring.

---

## What not to do

- Do not create CSS folders for `lib/`, `data/`, or `api/`
- Do not use `base/` for page-specific styles
- Do not keep styling logic duplicated in many TSX files
- Do not flatten all CSS into one giant file
- Do not treat Tailwind utilities as the only styling strategy
- Do not adopt Storybook-first design system (Option F) before 1A+1B

---

## Recommended migration order

1. Stabilize `lib/site-data/`, `i18n/messages/`, and `config/route-contract.json` as canonical non-CSS homes.
2. Normalize the CSS folder tree by ownership (tokens → base → components → utilities → site → planner).
3. UI-1: open3d shell on `open3d-workspace.css`; retire new `ooplanner/` additions.
4. UI-2: admin routes on `admin-pages.css` primitives (including Puck chrome when mounted in 1B).
5. UI-3: marketing dialect migration (optional, post-1A).
6. Remove duplicated TSX class noise only after the shared CSS layer is clear.

---

## Exit criteria

The CSS structure is "fixed" when:

- new styles have an obvious home per [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md)
- shared patterns are defined once
- route-specific styles do not leak into base layers
- Tailwind utilities are used intentionally, not as the default dumping ground
- the folder tree answers "who owns this style?" without guesswork
- **new modules pass [`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md) and `pnpm run lint:ui`**

---

## Module UI contract (anti-drift)

New feature modules are the main drift vector. Enforcement lives in:

- **[`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md)** — surface rules, checklist, layers
- **[`MODULE-LAYOUT.md`](MODULE-LAYOUT.md)** — no CSS mirrors under `features/`
- **`plann/06-UI-PLAN.md`** — phased execution (UI-0 → UI-3)
- **`site/scripts/lint-ui-contract.mjs`** — `lint:ui` / `lint:ui:strict`

Do not adopt a full design-system program (Storybook-first) before 1A+1B; extract primitives to `core/components/*.css` after the third repeated pattern.

---

## References

- [`ADMIN-UI-CONTRACT.md`](ADMIN-UI-CONTRACT.md) — admin primitives
- [`SITE-MARKETING-UI-CONTRACT.md`](SITE-MARKETING-UI-CONTRACT.md) — marketing utilities (UI-3)
- [`COMPONENT_ARCHITECTURE.md`](COMPONENT_ARCHITECTURE.md) — feature/module map
