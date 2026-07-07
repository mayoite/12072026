# Recovery Plan

Date: 2026-07-07

Goal: recover truth and repair one module at a time.

Status: in-principle plan for step 2. Revise when live checks disagree.

## Rules

- Truth wins.
- Evidence beats docs.
- One module at a time.
- Short scoped checks before full gates.
- Full release gate is forbidden until scoped lint, typecheck, and known blockers are credible.
- Commit or push only when explicitly asked.
- Do not make empty or unsafe commits to satisfy a timer.
- Keep `.env.local` ignored.
- Do not hide skipped or failed checks.
- Do not remove packages, run migrations, upload assets, deploy, or delete evidence without explicit scope.
- Do not start implementation until Phase 00 and Phase 00b are complete.
- Treat `gpt5.5.md` as signal only. It names the old repo.
- No broad `any`, fake `unknown as T` repairs, or non-null assertion sweeps.
- `.env.local` is never staged. Logs must not expose secrets.
- No unrelated fixes inside a phase.
- Blocked or skipped phase work must update `Failures.md`.

## Credible Evidence

Credible means:

1. Exact command.
2. Working directory.
3. Exit code.
4. Raw log.
5. Run JSON where the handbook requires it.
6. No missing stdout or stderr.
7. No hidden skips.
8. Artifact path under `results/<module>/<phase>/<cmd>/`.

## Phase Files

| Phase | File | Goal |
| --- | --- | --- |
| 00 | `phases/00-start.md` | Freeze the working baseline. |
| 00b | `phases/00b-contradiction-register.md` | Register contradictions before fixes. |
| 01 | `phases/01-truth-reset-package-policy.md` | Decide allowed packages from live imports. |
| 02 | `phases/02-styling-contract.md` | Stop UI drift at the rules layer. |
| 02b | `phases/02b-site-ui-baseline.md` | Create route-by-route site UI baseline after styling rules. |
| 02c | `phases/02c-minimum-auth-db-proof.md` | Prove minimum auth and DB ownership before publish or persistence work. |
| 03 | `phases/03-admin-svg-editor.md` | Fix the first admin SVG lint cluster. |
| 03b | `phases/03b-svg-pipeline.md` | Clarify SVG editor, compiler, publish, and runtime authority. |
| 04 | `phases/04-planner-open3d.md` | Planner Open3D overview only. |
| 04a | `phases/04a-planner-command-seam.md` | Repair command seam. |
| 04b | `phases/04b-planner-persistence-json.md` | Repair persistence and JSON round trip. |
| 04c | `phases/04c-planner-viewer-boundary.md` | Repair viewer and client boundary. |
| 04d | `phases/04d-planner-svg-consumer.md` | Repair SVG consumer. |
| 04e | `phases/04e-planner-browser-journey.md` | Prove browser journey. |
| 04f | `phases/04f-design-intake-readiness.md` | Prepare Penpot-first design workflow and keep Code Connect out of recovery. |
| 05 | `phases/05-auth.md` | Prove guest, member, and admin route gates. |
| 06 | `phases/06-database.md` | Prove DB env, Drizzle ownership, and safe access. |
| 07 | `phases/07-crm.md` | Decide real CRM scope before repair. |
| 08 | `phases/08-cdn-assets.md` | Prove asset source of truth. |
| 09 | `phases/09-deployment.md` | Prove local deployability. |
| 10 | `phases/10-tech-stack-docs.md` | Regenerate docs only after source truth stabilizes. |
| 11 | `phases/11-docs.md` | Make docs match repaired truth. |
| 12 | `phases/12-handover.md` | Leave the next worker a true state. |

## Preferred Order

1. Start with phase 00.
2. Then run phase 00b.
3. Then run phase 01.
4. Then run phase 02.
5. Then run phase 02c before admin publish or planner persistence work.
6. Then run phase 02b only if site UI blocks current repair or release proof.
7. Then fix phase 03.
8. Then decide phase 03b before planner SVG work.
9. Then enter planner slices 04a through 04e.
10. Defer phase 04f until component homes stop moving.

This order is not final law.

Change it if live evidence proves another blocker is earlier.

## Module Strategy

| Module | Recovery goal | First decision |
| --- | --- | --- |
| Package policy | Freeze allowed, banned, and audited packages. | Which imports are real. |
| CSS/Tailwind | Make CSS tokens and surface rules enforceable. | What TSX styling is forbidden. |
| Site UI | Repair only after styling rules are clear. | Which shared UI is canonical. |
| Admin | Make admin routes and views honest. | Which flows are real. |
| SVG | Pick one authority for editor, compiler, publish, runtime. | SVGR, sprite, or current compiler path. |
| Planner Open3D | Fix product-core slices with evidence. | Which failure bucket comes first. |
| Design tools | Use Penpot first and defer Figma Code Connect. | Which components are stable and which assets need export policy. |
| Auth | Prove guest/member/admin gates. | Route matrix. |
| Database | Prove Drizzle and env paths. | Read-only proof before any migration. |
| CRM | Decide real scope. | Keep, trim, or defer. |
| CDN/assets | Prove source of truth. | Local, cloud, and DB ownership. |
| Deployment | Prove build path. | Lint/typecheck/build before release gate. |
| Tech-stack docs | Regenerate after source truth stabilizes. | Which generator outputs are authoritative. |
| Docs | Remove stale claims. | Live docs first, locked copies only when intentionally frozen. |

## Current Priority

Start with:

1. `phases/00-start.md`
2. `phases/01-truth-reset-package-policy.md`
3. `phases/02-styling-contract.md`
4. `phases/03-admin-svg-editor.md`

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
9. A phase exposes unrelated failures.
