# Module UI Contract (locked copy)

**Frozen snapshot baseline 2026-07-05**

**Live file:** `docs/architecture/MODULE-UI-CONTRACT.md`. Update this copy only when intentionally locking a new baseline.

**Authority stack:** live plan `Plans/trustdata/` → `archive/Plans/01-execution/specialists/06-UI-PLAN.md` (historical) → **this file** → `docs/architecture/CSS-SOLUTION.md`

**Problem:** New modules copy the nearest TSX and reintroduce `slate-*`, hex, or a third dialect.

---

## Long-run lock (industry pattern)

```text
Tokens (single vocabulary)
  → surface rules (planner / admin / site)
    → module contract (every new feature)
      → CI gates (drift fails the build)
```

**Not** an upfront Storybook program (**Option F rejected**). Primitives extract to `site/app/css/core/components/` only after the **third** copy-paste.

---

## Execution model: layer → surface → module

**Not** component-by-component across the repo. **Not** all surfaces at once.

| Layer | Owns | Gate |
|-------|------|------|
| **L0** | `theme.css`, `planner-tokens.css`, `lint:ui` | UI-0 ✅ |
| **L1** | Shell: grid, topbar, tool rail, status strip | UI-1 — **before** feature modules |
| **L2** | Shared primitives per surface (`admin-btn`, panel header) | Extract on 3rd use |
| **L3** | Feature modules: inventory, properties, layers, svg-editor | One module per PR |

Label work: **`[surface] / [layer] / [module]`** (e.g. `planner / L3 / inventory`).

### Surface sequencing (locked)

| Phase | Surface | Product tie-in |
|-------|---------|----------------|
| UI-0 | Shared tokens + ThemeEditor outlier | L0 ✅ |
| UI-1 | **Planner open3d** only | 1A — L1 then L3 (**next**) |
| UI-2 | **Admin** (Puck, svg-editor) | 1B |
| UI-3 | **Site marketing** (optional) | Post-1A |

Guest/canvas shells: **Phase 2** promotion only.

---

## Surface rules

| Surface | Path roots | TSX | CSS |
|---------|------------|-----|-----|
| **Planner open3d** | `features/planner/open3d/**` | Structure + behavior only; **no Tailwind utilities** | `*.module.css` with `var(--planner-*)` / `var(--surface-*)` only |
| **Admin** | `site/app/admin/**`, `site/features/planner/admin/**` | Semantic utilities (`text-strong`, `bg-panel`, `border-soft`) + `admin-*` classes | No `slate-*` / `blue-*` / `zinc-*` / `gray-*` / `emerald-*` palette |
| **Site marketing** | `site/app/(site)/**`, `site/components/**` | `typ-*`, scheme utilities; layout Tailwind OK | Route bundles in `site/app/css/core/locked/` |

**Cross-surface copy-paste is forbidden.** Admin does not import open3d modules; planner does not copy admin Tailwind patterns.

---

## Bundle import (required)

| Surface | Layout / entry must import |
|---------|---------------------------|
| Open3d pilot | `site/app/css/core/locked/planner/open3d-workspace.css` via `site/app/planner/open3d/layout.tsx` |
| Admin | `data-admin-layout` shell + `admin-pages.css` (via admin layout) |
| Site | `site/app/css/index.css` (site layout) |

New open3d editor modules **do not** add their own `@import` of `index.css` or palette files.

---

## New module checklist (PR blocker)

Every new UI module under the path roots above **must** satisfy:

- [ ] Correct surface bundle already loaded by route layout (not re-imported ad hoc)
- [ ] Path matches `docs/architecture/MODULE-LAYOUT.md` decision tree
- [ ] No raw Tailwind palette classes in TSX
- [ ] No `#hex` or `rgb()` / `hsl()` in open3d `*.module.css` (tokens only)
- [ ] No new `--planner-primary*` usage (use `--planner-accent*`; primary is compat shim only)
- [ ] Icons: Phosphor in `open3d/`; Lucide in admin (per `00-REVISION.md` Decision 3)
- [ ] Repeated pattern (3×) → extract to `site/app/css/core/components/` before a fourth copy
- [ ] `pnpm run lint:ui` passes (strict after UI-1 shell lands)

---

## Enforcement

| Gate | Command | When |
|------|---------|------|
| UI contract (warn) | `pnpm --filter oando-site run lint:ui` | Now |
| UI contract (fail) | `pnpm --filter oando-site run lint:ui:strict` | After UI-1 shell acceptance → `release:gate:fast` |
| Site dialect | `pnpm --filter oando-site run check:site-ui` | Marketing PRs (UI-3) |
| Open3d icons | `open3dIconPolicy.test.ts` | TEST-1 (planned) |
| Module boundary | `plannerCommandBoundary.test.ts` | TEST-1 |

See `archive/Plans/01-execution/specialists/08-TEST-PLAN.md` for full gate matrix.

---

## Rejected

- **Option F** — full design-system / Storybook program before 1A+1B stable
- **Option E** — Mantine (deferred per `PACKAGES.md`)
- **Cross-surface UI sprint** — site + admin + planner in one pass
- **Component-by-component repo sweep** without layer order
- **UI-3 before 1B** — marketing dialect migration deferred

---

## References

- `docs/architecture/README.md` — architecture index
- `docs/architecture/MODULE-LAYOUT.md` — where modules live
- `docs/architecture/CSS-SOLUTION.md` — folder ownership
- `docs/architecture/ADMIN-UI-CONTRACT.md` — admin surface detail (UI-2)
- `docs/architecture/SITE-MARKETING-UI-CONTRACT.md` — marketing reference (UI-3)
- `docs/Lockedfiles/ui-execution/` — domain pair
- `archive/Plans/01-execution/specialists/06-UI-PLAN.md` — phased execution
- `archive/Plans/01-execution/specialists/08-TEST-PLAN.md` — test gates
- `site/scripts/lint-ui-contract.mjs` — automated checks
