# Module Baseline

Date: 2026-07-07

Repo: `D:\codex07072026`

Baseline commit: `4d3def5 baseline: copy recovery working state`

Status: in-principle recovery baseline for step 2. Revise when live checks disagree.

Rule: live checks beat old docs.

## Source Notes

| Source | Use | Caveat |
| --- | --- | --- |
| `AGENTS.md` | Conduct, honesty, gate discipline | PowerShell shows mojibake in this repo. Do not infer root cause yet. |
| `Readme.md` | Repo facts and module paths | May be stale where live code disagrees. |
| `START.md` | Commands | Run only when needed. Preserve evidence for gates. |
| `Failures.md` | Active blockers | Snapshot may refer to old repo commits. Recheck in this repo. |
| `testing-handbook.md` | Evidence policy | Gate claims are incomplete without logs and exit codes. |
| `gpt5.5.md` | Prior handoff signal | It names `D:\oandO04072026`; do not trust without rechecking here. |
| Brainstormer review | Plan structure critique | Recommendations only. Not final law. |

## Current Truth

| Module | Paths | Current truth | Live proof | Main failure | Dependencies | Risk | Next proof | Refuse or defer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Repo | root, `.git` | New repo exists on `main` and tracks `origin/main`. | `git status --short --branch` clean on 2026-07-07. | History was copied from damaged repo. | Git remote, local mirror. | Old claims can leak into new baseline. | `git status --short --branch`; `git log -5 --oneline`. | Refuse history claims without command proof. |
| Package policy | `package.json`, `site/package.json`, `pnpm-lock.yaml`, `PACKAGES.md` | Policy exists, but import truth is not proven. | Not yet run in this repo. | Package drift. | Planner, SVG, admin, UI. | Removing a package can break runtime. | Import census and frozen install. | Defer removals until imports prove unused or replaceable. |
| CSS and Tailwind | `site/app/css`, `site/scripts/lint-ui-contract.mjs`, CSS docs | CSS is intended source for tokens and surfaces. Tailwind is not the dumping ground. | Docs read. Lint not rerun here. | TSX styling drift and hardcoded UI values. | Site UI, admin, planner. | Fixing pages before rules will create more drift. | `pnpm --filter oando-site run lint:ui`; `lint:ui:strict` when ready. | Refuse hardcoded colors, fonts, spacing, sizes, and motion in TSX. |
| Site UI | `site/app/(site)`, `site/components`, `site/lib/site-data` | Site still exists, but visual and test truth are unknown here. | Not browser checked here. | Theme drift and marketing test failures in prior notes. | CSS, shared UI, route data. | Polish before CSS rules wastes work. | Route inventory, scoped site tests, visual smoke. | Defer polish until styling contract is stable. |
| Admin | `site/app/admin`, `site/features/planner/admin` | Admin routes and planner admin views exist. | Prior handoff names first lint blockers. | Admin SVG editor lint and access-gate proof. | Auth, SVG, CSS. | Admin may look present but be incomplete. | Scoped admin lint and route inventory. | Refuse "admin works" without route and auth proof. |
| SVG | `site/features/planner/admin/svg-editor`, `site/features/planner/open3d/catalog/svg`, `site/public/svg-catalog` | Multiple SVG paths exist. Single authority is not proven. | Prior handoff names lint in SVG editor and open3d SVG. | Editor, compiler, publish, and runtime boundaries are unclear. | Admin, planner, CDN/assets, package policy. | SVG pipeline can become two systems. | Import, compile, preview, publish, consume proof. | Defer SVGR or sprite adoption until pipeline authority is chosen. |
| Planner Open3D | `site/features/planner/open3d`, `site/app/planner` | Open3D is active planner path. Legacy planner paths still exist. | Docs read. Tests not rerun here. | Persistence, export, upload, viewer, commands, and UI acceptance are unproven. | Package policy, CSS, SVG, DB, auth. | High. It is the product core. | Open3D lint, targeted tests, browser smoke. | Refuse root legacy planner work unless scoped migration is approved. |
| Auth | `site/features/shared/auth`, `site/lib/auth`, middleware, route gates | Auth exists. Route gate behavior is unproven here. | `/admin/svg-editor` redirected in prior handoff. Not rechecked here. | Admin/member/guest matrix not proven. | Admin, planner, CRM, DB. | False auth assumptions corrupt admin and CRM plans. | Route matrix and targeted auth tests. | Defer sign-off until guest/member/admin flows are proven. |
| Database | `site/platform/drizzle`, `site/platform/drizzle/schema`, DB scripts | Drizzle is intended SQL authority. | Not checked here. | Env and DB ownership are not proven. | Auth, planner persistence, CRM, catalog. | Migrations can damage data. | Env validation and read-only connection checks. | Refuse migrations unless separately asked. |
| CRM | `site/features/crm`, admin CRM routes | CRM code exists. Functionality is not proven. | Not inventoried here. | Real feature vs placeholder is unclear. | Auth, DB, admin. | Broad CRM repair may hide missing product decisions. | Route/API inventory. | Defer feature work until scope is proven. |
| CDN and assets | `site/scripts/*asset*`, `site/public/cdn`, `asset-cdn`, R2 config | Local and cloud asset sources are named. Truth is not proven. | Not audited here. | Source of truth and broken references are unknown. | DB, SVG, planner catalog. | Asset deletion or upload can be destructive. | CDN audit scripts and reference scan. | Defer uploads and deletions unless explicitly approved. |
| Deployment | build config, Vercel config, root scripts | Build path exists. Deployability is not proven. | Prior handoff says fast gate failed at lint. | Lint blocks gate. | All modules. | Deploy claims without gate proof are false. | lint, typecheck, build, then release gate. | Refuse deploy-ready language until live gate passes. |
| Tech-stack docs | `site/tech-stack-generator`, `site/tech-stack-docs`, generated docs | Generator exists. Staleness is likely. | Not checked here. | Generated docs may reflect bad source truth. | Package policy and source modules. | Regenerating too early preserves wrong architecture. | docs check after source truth stabilizes. | Defer regeneration until module truth is stable. |
| Docs | `Plans`, `docs`, `PACKAGES.md`, `Failures.md` | Docs were copied and cleaned, but conflicts remain. | Read shows mojibake in command output. | Stale claims and encoding uncertainty. | Every module. | Docs can sound certain while code is broken. | Doc triage after each module. | Refuse claims that are not backed by live proof. |

## Package Baseline

| Package | Decision | Proof needed |
| --- | --- | --- |
| `fabric` | Likely keep. 2D engine. | Manifest proof, import census, and planner tests. |
| `three` | Likely keep. 3D engine. | Manifest proof, import census, and viewer tests. |
| `@react-three/fiber` | Likely keep. React 3D binding. | Manifest proof, import census, and viewer tests. |
| `@react-three/drei` | Audit. | Decide if it is real runtime dependency or drift. |
| `@ark-ui/react` | Audit as admin/planner primitive candidate. | Manifest proof and component inventory. |
| `react-aria-components` | Audit for Ark gaps only. | Manifest proof and component inventory. |
| `@puckeditor/core` | Audit for admin composition. | Admin import and route proof. |
| `@phosphor-icons/react` | Audit as preferred icon set. | Manifest proof and icon policy check. |
| `framer-motion` | Audit as possible animation layer. | Import census and CSS/motion boundary review. |
| `motion` | Remove only after proof. | Import census. |
| `lucide-react` | Remove gradually after proof. | Import census and replacement plan. |
| `mantine` | Keep out during recovery. | Ensure no imports. |
| `fabric-editor-kit` | Keep out during recovery. | Ensure no imports. |
| `@svgdotjs/*` | Remove unless SVG manager needs it. | SVG pipeline decision. |
| SVGR | Consider for trusted developer SVG components. | Needs SVG authority decision first. |
| SVG sprite | Consider for compiled/static symbols. | Needs SVG authority decision first. |
| Penpot | Preferred free design tool. No package by default. | Design-system intake and SVG export policy. |
| Figma | Optional later for specific files or Code Connect. | Stable component paths and published Figma components. |

## Unknowns

| Module | Unknown |
| --- | --- |
| Repo | Whether old overwritten history matters after the new baseline. |
| Package policy | Which dependencies are actually imported. |
| CSS and Tailwind | How many TSX files violate token and styling rules. |
| Site UI | Whether marketing routes are visually usable. |
| Admin | Whether admin flows are real beyond routes. |
| SVG | Which SVG path is authoritative. |
| Planner Open3D | Which failures are caused by DB/env versus code regressions. |
| Auth | Whether guest, member, and admin gates match product intent. |
| Database | Whether DB scripts are safe and current. |
| CRM | Whether CRM is product scope or placeholder scope. |
| CDN and assets | Which asset source is canonical. |
| Deployment | Whether build passes after lint is fixed. |
| Tech-stack docs | Whether generated output matches current source. |
| Docs | Which docs are stale versus intentionally revised. |

## Baseline Done Means

Baseline is done only when:

1. Each module has a current truth row.
2. Each module has a next proof.
3. Unknowns are explicit.
4. No pass, clean, deployable, or fixed claim is made without live evidence.
