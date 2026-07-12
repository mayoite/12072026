# Module UI Contract — Anti-drift lock

**Status:** Locked  
**Authority:** `plan/QUALITY-BAR.md` → `plan/Admin/` / `plan/Site/` → **this file** → [`04-CSS-SOLUTION.md`](04-CSS-SOLUTION.md)  
**Index:** [`README.md`](README.md) · [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md)  
**Placement:** [`01-MODULE-LAYOUT.md`](01-MODULE-LAYOUT.md) — path roots below must match  
**Locked copy:** [`docs/Lockedfiles/04-MODULE-UI-CONTRACT-Locked.md`](../Lockedfiles/04-MODULE-UI-CONTRACT-Locked.md)  
**Locked overlay:** [docs/Lockedfiles/01-planner-current.md](../Lockedfiles/01-planner-current.md) · engines [docs/Lockedfiles/03-dependencies-engines-current.md](../Lockedfiles/03-dependencies-engines-current.md)

**Problem:** New modules copy the nearest TSX and reintroduce `slate-*`, hex, or a third dialect.

---

## Long-run lock (industry pattern)

```text
Tokens (single vocabulary)
  → surface rules (planner / admin / site)
    → module contract (every new feature)
      → CI gates (drift fails the build)
```

**Not** an upfront Storybook program (**Option F rejected**). Primitives extract to `app/css/core/components/*.css` only after the **third** copy-paste.

---

## Execution model: layer → surface → module

**Not** component-by-component across the repo. **Not** all surfaces at once.

| Layer | Owns | Gate |
|-------|------|------|
| **L0** | `theme.css`, `planner-tokens.css`, `lint:ui` | UI-0 |
| **L1** | Shell: grid, topbar, tool rail, status strip | UI-1 — **before** feature modules |
| **L2** | Shared primitives per surface (`admin-btn`, panel header) | Extract on 3rd use |
| **L3** | Feature modules: inventory, properties, layers, svg-editor | One module per PR |

Label work: **`[surface] / [layer] / [module]`** (e.g. `planner / L3 / inventory`).

### Surface sequencing (locked)

| Phase | Surface | Product tie-in |
|-------|---------|----------------|
| UI-0 | Shared tokens + ThemeEditor outlier | L0 |
| UI-1 | **Planner workspace** (`editor`/`canvas`/`project`) | 1A — L1 then L3 |
| UI-2 | **Admin** (no-code svg-editor; Puck portal renderer) | A4 |
| UI-3 | **Site marketing** (optional) | Post-1A |

Live shells: `/planner/guest` · `/planner/canvas`.

---

## Surface rules

| Surface | Path roots | TSX | CSS |
|---------|------------|-----|-----|
| **Planner workspace** | `features/planner/{editor,canvas,3d,project,ui}/**` | Structure + behavior only; **no Tailwind utilities** | `*.module.css` with `var(--planner-*)` / `var(--surface-*)` only |
| **Admin** | `app/admin/**`, `features/planner/admin/**` | Semantic utilities (`text-strong`, `bg-panel`, `border-soft`) + `admin-*` classes | No `slate-*` / `blue-*` / `zinc-*` / `gray-*` / `emerald-*` palette |
| **Site marketing** | `app/(site)/**`, `components/**` | `typ-*`, scheme utilities; layout Tailwind OK | Route bundles in `app/css/core/site/` |

**Cross-surface copy-paste is forbidden.** Admin does not import planner workspace modules; planner does not copy admin Tailwind patterns.

---

## Bundle import (required)

| Surface | Layout / entry must import |
|---------|---------------------------|
| Planner workspace (`/planner/guest` · `/planner/canvas`) | `app/css/core/locked/planner/open3d-workspace.css` via `app/planner/(workspace)/layout.tsx` (filename **fence** — do not rename) |
| Admin | `data-admin-layout` shell + `admin-pages.css` (via admin layout) |
| Site | `app/css/index.css` (site layout) |

New planner editor modules **do not** add their own `@import` of `index.css` or palette files.

---

## New module checklist (PR blocker)

Every new UI module under the path roots above **must** satisfy:

- [ ] Correct surface bundle already loaded by route layout (not re-imported ad hoc)
- [ ] Path matches [`01-MODULE-LAYOUT.md`](01-MODULE-LAYOUT.md) decision tree
- [ ] No raw Tailwind palette classes in TSX
- [ ] No `#hex` or `rgb()` / `hsl()` in planner workspace `*.module.css` (tokens only)
- [ ] No new `--planner-primary*` usage (use `--planner-accent*`; primary is compat shim only)
- [ ] Icons: Phosphor in planner workspace; Lucide in admin (per `docs/Lockedfiles/03-dependencies-engines-current.md`)
- [ ] Repeated pattern (3×) → extract to `app/css/core/components/*.css` before a fourth copy
- [ ] `pnpm run lint:ui` passes (strict after UI-1 shell lands)

---

## Enforcement

| Gate | Command | When |
|------|---------|------|
| UI contract (warn) | `pnpm --filter oando-site run lint:ui` | Now |
| UI contract (fail) | `pnpm --filter oando-site run lint:ui:strict` | After UI-1 shell acceptance → `release:gate:fast` |
| Site dialect | `pnpm --filter oando-site run check:site-ui` | Marketing PRs (UI-3) |
| Open3d icons | `open3dIconPolicy.test.ts` | TEST-1 |
| Command boundary | `plannerCommandBoundary.test.ts` | TEST-1 |
| Command wiring | `plannerCommandWiring.test.ts` | TEST-1 — **fails until `useWorkspaceCanvas` uses `executePlannerCommand`** |

See `testing-handbook.md` and `Agents/Agents-04-testing.md` for gate policy.

---

## Rejected

- **Option F** — full design-system / Storybook program before 1A+1B stable
- **Option E** — Mantine (deferred per `docs/Lockedfiles/03-dependencies-engines-current.md`)
- **Cross-surface UI sprint** — site + admin + planner in one pass
- **Component-by-component repo sweep** without layer order
- **UI-3 before 1B** — marketing dialect migration deferred

---

## References

- [`README.md`](README.md) — architecture index
- [`01-MODULE-LAYOUT.md`](01-MODULE-LAYOUT.md) — where modules live
- [`04-CSS-SOLUTION.md`](04-CSS-SOLUTION.md) — folder ownership
- [Admin](../../plan/Admin/CHECKLIST.md) — admin surface (UI-2)
- [Site](../../plan/Site/CHECKLIST.md) — marketing reference (UI-3)
- `site/scripts/lint-ui-contract.mjs` — automated checks
