# UI execution — proposed (locked)

**Baseline:** 2026-07-05  
**Cross-links:** [`docs/architecture/README.md`](../../architecture/README.md) · [`MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) · [`MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md)

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Anti-drift lock | Tokens → surface rules → module checklist → CI | [`ui/MODULE-UI-CONTRACT-Locked.md`](../ui/MODULE-UI-CONTRACT-Locked.md) | This pair |
| Execution model | **Layer → surface → module**; never cross-surface UI sprint | `plann/UI-PLAN-REVISED-2026-07-05.md` | `MODULE-UI-CONTRACT` |
| UI phases | **UI-0 ✅ done** → **UI-1 planner shell (next)** → UI-2 admin → UI-3 site (optional) | `site/features/planner/open3d/` | `plann/HANDOVER.md` |
| CSS approach | Option **A + B** adopted; Option **F** (design system / Storybook) and **E** (Mantine) **rejected** | `app/css/` | `CSS-SOLUTION.md` |
| Planner open3d | No Tailwind in TSX; CSS modules + `--planner-accent*` only | `open3d/editor/*.module.css` | UI-1 |
| Admin | No raw palette; `admin-page` + `admin-*` primitives | `app/admin/**` | UI-2 |
| Site | Unchanged until UI-3; reuse tokens only | `app/(site)/**` | UI-3 |
| L1 before L3 | Shell (topbar, rail, status, panels) before inventory/properties/layers | `WorkspaceShell.tsx` | UI-1 table |
| L3 module order | inventory → properties → layers → command palette | open3d editor | UI-1 |
| Strict lint | `lint:ui:strict` in `release:gate:fast` after UI-1 shell acceptance | `package.json` | TEST-1 |
| Test gates | `open3dIconPolicy` (planned), command boundary, planner E2E | `site/tests/` | `plann/TEST-PLAN-REVISED-2026-07-05.md` |
| Primitive extract | 3rd copy → `app/css/core/components/` | shared CSS | MODULE-UI-CONTRACT |

## Packages (proposed per plan)

| Gate | Command | Phase |
|------|---------|-------|
| UI warn | `pnpm --filter oando-site run lint:ui` | UI-0 ✅ |
| UI strict | `pnpm --filter oando-site run lint:ui:strict` | UI-1 exit |
| Site dialect | `check:site-ui` | UI-3 / marketing PRs |
| Icon policy | Vitest `open3dIconPolicy.test.ts` | TEST-1 (planned) |
| Planner E2E | `test:planner-catalog` (+ future open3d-specific spec) | TEST-1 |

No new UI libraries. Storybook/Ladle deferred indefinitely (**Option F rejected**).

## Authority

1. `plann/REVISION-2026-07-05.md`
2. [`docs/Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md`](../ui/MODULE-UI-CONTRACT-Locked.md)
3. `plann/UI-PLAN-REVISED-2026-07-05.md`
4. `plann/TEST-PLAN-REVISED-2026-07-05.md`

Update locked baseline only when intentionally locking a new version.
