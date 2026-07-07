# Module Baseline

Date: 2026-07-07

Repo: `D:\codex07072026`

Baseline commit: `4d3def5 baseline: copy recovery working state`

Rule: live checks beat old docs.

## Current Truth

| Area | Baseline | Risk | First proof needed |
| --- | --- | --- | --- |
| Repo | Clean on `main` after baseline push | Prior repo had noisy branches and copied claims | `git status -sb` |
| Packages | Mixed but usable | Package policy drift | manifest audit |
| Site UI | Existing site still present | Theme and copy drift | `check:site-ui` later |
| CSS and Tailwind | Locked docs say CSS owns styling | Rules are not consistently followed | `lint:ui` |
| Admin | Admin routes exist | Admin system is not strong enough | scoped admin lint and route check |
| SVG | Compiler path exists | Manager is incomplete | SVG tests and publish-flow review |
| Planner | Open3D is active path | UI and command workflows are not accepted | open3d scoped tests |
| Auth | Auth exists | Route gates need proof | targeted auth tests |
| Database | Drizzle is intended authority | DB management is not proven | env + DB connection checks |
| CRM | Code exists | Functionality is not proven | route/API inventory |
| CDN and assets | Asset scripts exist | Upload/source truth is unclear | CDN audit scripts |
| Deployment | Build was repaired once | Gate still fails lint | lint, typecheck, build |
| Tech-stack docs | Generator exists | Generated docs may be stale | docs checks |
| Docs | Copied and cleaned | Claims conflict with live state | doc triage |

## Package Baseline

| Package | Current decision |
| --- | --- |
| `fabric` | Keep. 2D engine. |
| `three` | Keep. 3D engine. |
| `@react-three/fiber` | Keep. React 3D binding. |
| `@react-three/drei` | Audit. Promote or remove from policy drift. |
| `@ark-ui/react` | Keep. Admin and planner primitives. |
| `react-aria-components` | Keep for Ark gaps only. |
| `@puckeditor/core` | Keep for admin composition. |
| `@phosphor-icons/react` | Keep. Planner icons. |
| `framer-motion` | Keep as animation layer. |
| `motion` | Remove after import proof. |
| `lucide-react` | Remove gradually after import proof. |
| `mantine` | Keep out. |
| `fabric-editor-kit` | Keep out. |
| `@svgdotjs/*` | Remove after import proof unless SVG manager needs it. |
| SVGR | Consider for trusted developer SVG components. |
| SVG sprite | Consider for compiled/static symbols. |

## Module Boundaries

| Module | Main paths |
| --- | --- |
| Site UI | `site/app/(site)`, `site/components`, `site/lib/site-data` |
| CSS and Tailwind | `site/app/css`, `docs/architecture/CSS-SOLUTION.md` |
| Admin | `site/app/admin`, `site/features/planner/admin` |
| SVG | `site/features/planner/admin/svg-editor`, `site/features/planner/open3d/catalog/svg` |
| Planner | `site/features/planner/open3d`, `site/app/planner` |
| Auth | `site/features/shared/auth`, `site/lib/auth`, route middleware |
| Database | `site/platform/drizzle`, `site/schema`, DB scripts |
| CRM | `site/features/crm`, admin CRM routes |
| CDN and assets | `site/scripts/*asset*`, R2/CDN config |
| Deployment | `site/config/build`, root scripts, Vercel config |
| Tech-stack docs | `site/tech-stack-generator`, `site/tech-stack-docs` |
| Docs | `Plans`, `docs`, `PACKAGES.md`, `Failures.md` |

## Known Open Failures

| Failure | Status |
| --- | --- |
| Lint | Fails. First cluster is admin SVG editor. |
| Typecheck | Must be rerun from this repo. |
| Tests | Not proven. |
| Browser console | Not proven after baseline. |
| Release gate | Not proven. |
| Admin SVG workflow | Not accepted. |
| Planner acceptance flow | Not accepted. |

