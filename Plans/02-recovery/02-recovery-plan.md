# Recovery Plan

Date: 2026-07-07

Goal: recover truth and repair one module at a time.

Status: in-principle plan for step 2. Revise when live checks disagree.

## Rules

- Truth wins.
- Evidence beats docs.
- One module at a time.
- Short scoped checks before full gates.
- Full release gate waits until lint and typecheck are credible.
- Commit and push after safe, meaningful blocks.
- Do not make empty or unsafe commits to satisfy a timer.
- Keep `.env.local` ignored.
- Do not hide skipped or failed checks.
- Do not remove packages, run migrations, upload assets, deploy, or delete evidence without explicit scope.

## Phase Map

| Phase | Goal | Modules in scope | Entry condition | Exit evidence | Do not do |
| --- | --- | --- | --- | --- | --- |
| 00 Start | Freeze the working baseline. | Repo, docs, evidence rules. | Clean or understood working tree. | `git status --short --branch`, current commit, open failures listed. | Do not repair code yet. |
| 01 Truth reset and package policy | Decide allowed packages from live imports. | Package policy, docs. | Baseline recorded. | Import census, package decisions, no unsupported removal. | Do not remove runtime packages without proof. |
| 02 Styling contract | Stop UI drift at the rules layer. | CSS/Tailwind, site UI shell, admin styling rules, planner styling rules. | Package policy is not blocking lint. | `lint:ui` result and clear styling rules. | Do not polish pages before the contract is stable. |
| 03 Admin and SVG | Fix first admin SVG lint cluster and clarify SVG authority. | Admin, SVG editor, SVG pipeline. | Styling rules known. | Scoped lint result, SVG path decision draft. | Do not introduce a second SVG system. |
| 04 Planner Open3D | Repair product-core failures in small slices. | Planner Open3D, SVG consumer, persistence, export, upload, viewer. | Package and SVG boundaries are known enough. | Targeted tests and browser smoke per slice. | Do not edit legacy planner paths unless migration is scoped. |
| 05 Auth and database | Prove gates and data access before admin/CRM sign-off. | Auth, DB, route middleware, Drizzle paths. | Planner needs are known. | Route matrix, env validation, read-only DB proof. | Do not run migrations unless separately approved. |
| 06 CRM and CDN/assets | Decide what is real and what is placeholder. | CRM, asset scripts, R2/CDN, catalog references. | Auth and DB truth exist. | Route/API inventory, CDN audit signal. | Do not upload or delete assets without approval. |
| 07 Deployment proof | Prove local deployability. | Lint, typecheck, build, release gate readiness. | Major lint and type failures are cleared. | lint, typecheck, build results with evidence. | Do not claim deployable without build evidence. |
| 08 Tech-stack docs and docs cleanup | Make docs match source truth. | Tech-stack docs, Plans, locked copies when intentional. | Source modules stable enough. | docs checks and updated handover. | Do not regenerate docs from unstable source truth. |
| Handover | Leave the next worker a true state. | All touched modules. | Current block is stopped or complete. | Summary, commands, exit codes, skipped checks, risks, next step. | Do not bury failures in narrative. |

## Preferred Order

1. Start with phase 00.
2. Then run phase 01.
3. Then run phase 02.
4. Then fix phase 03 admin SVG lint cluster.
5. Then enter planner slices.

This order is not final law.

Change the order if live evidence proves another blocker is earlier.

## Module Strategy

| Module | Recovery goal | First decision |
| --- | --- | --- |
| Package policy | Freeze allowed, banned, and audited packages. | Which imports are real. |
| CSS/Tailwind | Make CSS tokens and surface rules enforceable. | What TSX styling is forbidden. |
| Site UI | Repair only after styling rules are clear. | Which shared UI is canonical. |
| Admin | Make admin routes and views honest. | Which flows are real. |
| SVG | Pick one authority for editor, compiler, publish, runtime. | SVGR, sprite, or current compiler path. |
| Planner Open3D | Fix product-core slices with evidence. | Which failure bucket comes first. |
| Auth | Prove guest/member/admin gates. | Route matrix. |
| Database | Prove Drizzle and env paths. | Read-only proof before any migration. |
| CRM | Decide real scope. | Keep, trim, or defer. |
| CDN/assets | Prove source of truth. | Local, cloud, and DB ownership. |
| Deployment | Prove build path. | Do lint/typecheck/build before release gate. |
| Tech-stack docs | Regenerate after source truth stabilizes. | Which generator outputs are authoritative. |
| Docs | Remove stale claims. | Live docs first, locked copies only when intentionally frozen. |

## Current Priority

Start with package policy, then CSS/Tailwind, then admin SVG editor.

Reason:

1. Package drift can make repairs wrong.
2. CSS drift is causing repeated UI damage.
3. Prior handoff names admin SVG editor as the first lint blocker.

## Stop Conditions

Stop and report if:

1. A change crosses module boundaries.
2. A package removal has runtime risk.
3. A test failure depends on auth or database truth.
4. A command produces incomplete evidence.
5. A secret or `.env.local` would be staged.
6. A database migration would be required.
7. A remote push fails.
8. A destructive operation is needed.

## Refuse Or Defer

Refuse:

1. Deployable claims without live build and gate proof.
2. Clean claims without exit codes and logs.
3. Package removals without import proof.
4. Migration or upload work hidden inside repair work.
5. Broad CRM repair before CRM scope is proven.

Defer:

1. Tech-stack doc regeneration until source truth is stable.
2. Site polish until CSS rules are stable.
3. Release gate until lint, typecheck, and key tests are credible.
4. SVGR or SVG sprite adoption until SVG authority is chosen.
5. Locked-doc sync until live docs settle.
