# World-Standard Product Vision

Date: 2026-07-07

Status: in-principle product vision for recovery. Not final law.

Repo: `D:\OandO07072026`

## Short Description

We are building a premium carpet, flooring, and interior-planning platform.

It should combine:

1. A high-trust marketing site.
2. A fast 2D/3D room planner.
3. A strong admin system.
4. A deterministic SVG block pipeline.
5. A real CRM and operations layer.
6. A clean deployment and evidence system.

The target is not "a website with a planner".

The target is a sales, design, planning, and operations platform.

## Product Goal

Help customers and operators move from idea to quote to project with minimum confusion.

The site should:

1. Explain products clearly.
2. Show quality visually.
3. Let users plan rooms and surfaces.
4. Let admins manage SVG blocks, catalog assets, CRM, and planner content.
5. Keep data safe.
6. Produce evidence for every release claim.

## Ideal User Experience

| User | Ideal outcome |
| --- | --- |
| Visitor | Understands quality, products, use cases, and next action within seconds. |
| Homeowner | Can visualize carpet/flooring in a room without needing technical skill. |
| Architect/designer | Can inspect materials, dimensions, layout constraints, and export/share plans. |
| Sales/admin | Can manage catalog, SVG blocks, customers, leads, quotes, and assets without developer help. |
| Developer/operator | Can prove build, lint, tests, console, deploy, and data safety with artifacts. |

## World-Standard References

Use these as reference quality bars, not as copy targets.

| Area | Reference | What to learn |
| --- | --- | --- |
| Planning UX | [IKEA planners](https://www.ikea.com/us/en/planners/) | Simple guided product planning and online 3D planning. |
| Room planning | [RoomSketcher](https://www.roomsketcher.com/) | Fast floor-plan creation and professional output. |
| 2D/3D planning | [Planner 5D](https://planner5d.com/) | 2D/3D switching, visualization, and design flow. |
| Admin/back office | [Shopify admin](https://help.shopify.com/en/manual/shopify-admin) | Centralized operations, inventory, products, analytics, and settings. |
| Accessibility | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility success criteria. |
| Security | [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | Security verification requirements. |
| Web performance | [Core Web Vitals](https://web.dev/articles/vitals) | Loading, responsiveness, and visual stability. |
| SVG quality | [W3C SVG 2](https://www.w3.org/TR/SVG2/) | SVG syntax, structure, scalability, and rendering expectations. |

Anti-copy rule:

1. Study patterns.
2. Do not copy UI.
3. Translate lessons into Oando's product, brand, tokens, and codebase.

## Modules

| Module | Goal | Current issue | World-standard target |
| --- | --- | --- | --- |
| Repo/process | Keep work true and recoverable. | Old repo history and docs contain stale claims. | Phase 00 and 00b block implementation until state and contradictions are recorded. |
| Package policy | Know what is installed and why. | Package docs had unsafe install language. | Manifest and import census drive every package decision. |
| CSS/Tailwind/design intake | Stop UI drift. | TSX styling and token rules drift. | CSS owns visual values; TSX owns structure and behavior. Penpot first. |
| Site UI | Build trust and explain products. | Visual truth is unproven. | Route-by-route baseline only when it blocks current work. |
| Admin | Make operations real. | Route existence is not functionality. | Role-gated admin with publish/save/catalog/CRM workflows. |
| SVG pipeline | Produce safe, deterministic assets. | SVG authority is not proven. | One API boundary, one compiler, one runtime contract, sanitizer, schema, checksum, atomic publish. |
| Planner Open3D | Make planning useful and reliable. | Persistence, export, viewer, SVG, and command seams are unproven. | Edit, undo, save, reload, export, and console proof before "planner repaired". |
| Auth | Protect roles and data. | Guest/member/admin behavior is not proven. | Route and mutation matrix based on explicit auth and authorization. |
| Database | Keep data safe and traceable. | DB ownership and migration safety are unproven. | Drizzle ownership, transaction policy, RLS map, no migrations without explicit scope. |
| CRM | Manage real customer work. | Product scope is unknown. | Lead/contact/customer/opportunity model with PII and role policy. |
| CDN/assets | Keep assets traceable. | Local/cloud/DB asset truth is unclear. | Immutable asset manifest, cache policy, no upload/delete without approval. |
| Deployment | Prove deployability. | Gates are blocked by lint/test uncertainty. | Lint, typecheck, build, release evidence on one unchanged revision. |
| Tech-stack docs | Reflect truth. | Generated docs can preserve stale claims. | Regenerate only after source truth stabilizes. |
| Docs/handover | Prevent repeat confusion. | Claims conflict across docs. | Contradiction register, evidence index, clean handover. |

## Ideal SVG Quality

SVG is a product feature, not just a file format.

The SVG system should support:

1. Admin-authored block definitions.
2. Schema validation.
3. Sanitization before publish.
4. Deterministic compile output.
5. Content hash or checksum.
6. Atomic publish.
7. Failure rollback.
8. Runtime schema compatibility.
9. Preview thumbnails.
10. Planner consumption without owning publish authority.

SVG output should be:

1. Valid.
2. Minimal.
3. Scalable.
4. Deterministic.
5. Safe.
6. Fast to load.
7. Easy to trace back to source.

SVGR and sprites are not recovery engines.

Use them later only if the SVG authority is already clean.

## Ideal Admin Module

Admin should feel like a professional operations console.

It should include:

1. Dashboard.
2. Catalog management.
3. SVG block management.
4. Planner content management.
5. CRM.
6. Asset/CDN status.
7. Publish queue.
8. Audit trail.
9. Role-gated routes.
10. Evidence for important actions.

Admin must prove:

1. Who can access each route.
2. Who can save.
3. Who can publish.
4. What data changes.
5. What happens on failure.

## Ideal Planner

The planner should be reliable before it is fancy.

Hard acceptance:

1. Open planner.
2. Edit.
3. Undo.
4. Save.
5. Reload.
6. Export.
7. Verify console output.

The planner should eventually support:

1. 2D editing with Fabric.
2. 3D viewing with Three/R3F.
3. SVG catalog block placement.
4. Room/product dimensions.
5. Material and carpet selection.
6. Guest planning.
7. Member save/load.
8. Admin-managed catalog content.
9. Share/export path.
10. Quote/CRM handoff.

## Ideal Site UI

The public site should be calm, premium, and conversion-focused.

It should avoid:

1. Generic template sections.
2. Hardcoded TSX styling.
3. Random motion.
4. Unclear product hierarchy.
5. Unverified performance claims.

It should include:

1. Strong product storytelling.
2. Real imagery/assets.
3. Clear categories.
4. Planner entry points.
5. Trust signals.
6. Fast navigation.
7. Accessibility.
8. Mobile-first quality.

## Standards

| Standard | Required use |
| --- | --- |
| WCAG 2.2 | Accessibility target for public, planner, and admin routes. |
| Core Web Vitals | Performance target for public site and planner entry routes. |
| OWASP ASVS | Security checklist for auth, admin, CRM, and mutations. |
| OWASP session guidance | Session and cookie behavior review. |
| W3C SVG 2 | SVG validity and structure benchmark. |
| Drizzle migrations/transactions | DB migration and rollback discipline. |
| Supabase RLS | Table access policy review where Supabase/Postgres access applies. |
| Cloudflare R2 docs | Asset storage, path, and cache policy reference. |

Benchmarks are not links to admire.

Each benchmark must map to:

1. A rule.
2. A phase.
3. Evidence.
4. A pass/fail or defer decision.

## Current Issues

Known truth from recovery docs:

1. Lint is not clean.
2. Full tests are not proven.
3. Browser console proof is not complete.
4. Admin SVG editor has known lint blockers.
5. SVG authority is not clean.
6. Planner persistence/export/viewer paths are not proven.
7. Auth and DB route behavior need proof.
8. CRM may be placeholder or partial.
9. Asset/CDN truth is unclear.
10. Docs contain stale claims from old repo context.

## Build Principles

1. Evidence first.
2. One module at a time.
3. No hidden package changes.
4. No migrations without approval.
5. No uploads or deletes without approval.
6. No full gate early.
7. No "clean", "fixed", or "deployable" without logs.
8. No hardcoded visual values in TSX.
9. No broad `any`.
10. No fake type-safety fixes.
11. No Storybook-first design-system program during recovery.
12. Penpot first.
13. Figma optional later.
14. Code Connect out of recovery.

## Documents To Remove

Do not remove documents now.

Current rule:

1. First register contradictions in `00b-contradiction-register.md`.
2. Then decide: keep, revise, archive, or delete.
3. Prefer archive over delete for recovery context.
4. Never delete evidence.

Candidates to review later:

| Candidate | Action now | Reason |
| --- | --- | --- |
| Old claimed execution plans | Review later | They may contain false claims, but still explain prior damage. |
| Duplicated stale plans | Review later | Archive only after contradiction register. |
| Generated tech-stack docs | Defer | Regenerate only after source truth stabilizes. |
| Old repo path references | Register first | Some are signal, not proof. |

Answer: no document should be removed before Phase 00b.

## Ideal End State

The ideal Oando platform is:

1. Premium enough to build trust.
2. Fast enough to use daily.
3. Simple enough for customers.
4. Strong enough for admins.
5. Safe enough for real customer and project data.
6. Deterministic enough for SVG and planner assets.
7. Evidence-driven enough to deploy without guessing.

That is the recovery target.
