# Execution Plan

Date: 2026-07-07

Use this after the module baseline and recovery plan.

Status: in-principle execution plan for step 2. Revise after each module.

## 00 Start

Purpose: start clean and record truth before repairs.

Read first:

1. `AGENTS.md`
2. `Readme.md`
3. `START.md`
4. `Failures.md`
5. `testing-handbook.md`
6. `gpt5.5.md`
7. Owning module docs

Commands:

```powershell
git status --short --branch
git log -5 --oneline
```

Evidence:

1. Current branch.
2. Current commit.
3. Dirty or clean state.
4. Open blockers.

Stop if:

1. Working tree has unexplained changes.
2. `.env.local` or secrets are staged.
3. The requested module scope is unclear.

## Work Loop

1. Read the module docs.
2. Inspect live code.
3. Define the smallest repair.
4. Edit only allowed files.
5. Run scoped checks.
6. Record pass, fail, or skipped.
7. Commit and push only after a safe meaningful block.
8. Update handover notes.

Incomplete evidence stays incomplete.

## Module Work Template

| Field | Required |
| --- | --- |
| Module | Name and paths |
| Why now | The blocker that makes this module next |
| Allowed scope | Files and folders allowed |
| Hard no-go scope | Files and actions not allowed |
| Read first | Exact docs or source files |
| Change | Smallest repair |
| Checks | Exact commands |
| Evidence | Result paths and exit codes |
| Likely failures | Expected buckets |
| Stop conditions | When to stop and re-scope |
| Handover notes | What the next worker needs |

## Phase 01: Package Policy

Why now: wrong packages create wrong repairs.

Allowed scope:

1. `package.json`
2. `site/package.json`
3. `pnpm-lock.yaml`
4. `PACKAGES.md`
5. `Plans/02-recovery/*`

Hard no-go scope:

1. Runtime code unless only reading.
2. Package removal without import proof.
3. Package upgrade without explicit reason.

Read first:

1. `PACKAGES.md`
2. `gpt5.5.md`
3. `Readme.md`

Initial commands:

```powershell
rg -n "@svgdotjs|lucide-react|motion|framer-motion|@react-three/drei|@mantine|fabric-editor-kit|@tiptap|@vercel-labs/json-render|@phosphor-icons|@ark-ui|react-aria-components|@puckeditor|figma" site package.json pnpm-lock.yaml PACKAGES.md
pnpm install --frozen-lockfile
```

Likely failures:

1. Stale lockfile.
2. Unused package drift.
3. Runtime imports hidden in planner or admin.

Stop conditions:

1. Import proof is ambiguous.
2. Removal touches planner, SVG, or admin runtime.
3. Install fails for registry or engine reasons.

## Phase 02: CSS And Tailwind

Why now: UI drift must be stopped before page repair.

Allowed scope:

1. `site/app/css`
2. `site/scripts/lint-ui-contract.mjs`
3. Affected module CSS only
4. CSS docs when truth changes

Hard no-go scope:

1. Page polish.
2. Hardcoded fonts, colors, spacing, size, or motion in TSX.
3. New CSS mirrors under `features/`, `lib/`, `data/`, or `api/`.

Read first:

1. `docs/Lockedfiles/conduct/ReadmeLocked.md`
2. `docs/architecture/CSS-SOLUTION.md`
3. `docs/architecture/MODULE-LAYOUT.md`
4. `docs/architecture/MODULE-UI-CONTRACT.md`

Initial commands:

```powershell
pnpm --filter oando-site run lint:ui
pnpm --filter oando-site run lint:ui:strict
```

Likely failures:

1. TSX hardcoded styling.
2. Planner CSS module drift.
3. Admin palette drift.
4. Legacy `ooplanner` usage.

Stop conditions:

1. Fix requires broad UI redesign.
2. Styling rule conflicts with product intent.
3. Lint output is incomplete.

## Phase 03: Admin SVG Editor

Why now: prior handoff names this as the first lint blocker.

Allowed scope:

1. `site/features/planner/admin/svg-editor`
2. Direct tests for admin SVG editor
3. Direct CSS needed by that module

Hard no-go scope:

1. Planner runtime behavior outside SVG consumer boundary.
2. Broad admin redesign.
3. Package removal.

Read first:

1. `gpt5.5.md`
2. `docs/architecture/MODULE-LAYOUT.md`
3. Admin workflow docs if route behavior is touched

Initial commands:

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/admin/svg-editor --max-warnings=0
pnpm --filter oando-site run typecheck
```

Likely failures:

1. Unused vars.
2. Import type rules.
3. Forbidden dynamic import type annotations.
4. TSX styling drift.

Stop conditions:

1. Lint fix changes SVG semantics.
2. Admin auth gate blocks verification.
3. Typecheck failure is outside admin SVG scope.

## Phase 03b: SVG Pipeline

Why now: editor fixes are not enough if publish and runtime paths disagree.

Allowed scope:

1. `site/features/planner/admin/svg-editor`
2. `site/features/planner/open3d/catalog/svg`
3. SVG compiler and publish adapters
4. Direct SVG tests

Hard no-go scope:

1. New SVG engine adoption without plan approval.
2. Asset deletion.
3. CDN upload.

Initial checks:

```powershell
rg -n "svgPipelineRunner|svgCompiler|svg-catalog|SVGR|sprite|@svgdotjs" site
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/open3d/catalog/svg --max-warnings=0
```

Decision required:

1. Current compiler path only.
2. SVGR for trusted developer components.
3. SVG sprite for compiled static symbols.

Stop conditions:

1. Two authorities remain.
2. Publish path is unclear.
3. Runtime consumer expects a different schema.

## Phase 04: Planner Open3D

Why now: this is the product core.

Allowed scope:

1. `site/features/planner/open3d`
2. `site/app/planner`
3. Direct Open3D tests

Hard no-go scope:

1. Legacy root planner paths unless migration is explicitly scoped.
2. Database migrations.
3. Broad UI redesign.

Initial checks:

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/open3d --max-warnings=0
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d --config vitest.site.config.ts
```

Likely failure buckets:

1. Persistence.
2. JSON export.
3. Guest promotion.
4. Upload utils.
5. Viewer lazy paths.
6. Command boundary wiring.

Stop conditions:

1. Failure is actually auth or DB.
2. Fix requires changing schema.
3. UI acceptance criteria are missing.

## Phase 05: Auth

Why now: admin, planner member flows, and CRM depend on route truth.

Allowed scope:

1. `site/features/shared/auth`
2. `site/lib/auth`
3. Middleware and route gate tests

Hard no-go scope:

1. Provider replacement.
2. Secret changes.
3. Database migration.

Initial proof:

```powershell
rg -n "middleware|admin|guest|member|auth" site/app site/features site/lib
pnpm --filter oando-site run typecheck
```

Route matrix:

1. Guest planner.
2. Member dashboard.
3. Admin dashboard.
4. Admin SVG editor.
5. CRM route.

Stop conditions:

1. Missing env blocks proof.
2. Auth behavior is a product decision.
3. Fix requires database migration.

## Phase 06: Database

Why now: persistence and CRM claims need DB proof.

Allowed scope:

1. `site/platform/drizzle`
2. `site/platform/drizzle/schema`
3. DB scripts
4. DB docs

Hard no-go scope:

1. Migrations unless explicitly approved.
2. Direct data edits.
3. New Supabase `.from()` SQL for catalog/planner data.

Initial commands:

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
pnpm --filter oando-site run db:test
```

Stop conditions:

1. Env missing.
2. Connection fails.
3. Migration needed.

## Phase 07: CRM

Why now: CRM cannot be repaired honestly until scope is known.

Allowed scope:

1. `site/features/crm`
2. CRM routes
3. CRM tests

Hard no-go scope:

1. New CRM product features before inventory.
2. Database migration.
3. Admin redesign.

Initial checks:

```powershell
rg -n "crm|lead|customer|contact|opportunity" site/app site/features site/lib site/platform
pnpm --filter oando-site run typecheck
```

First decision:

1. Real and repair now.
2. Placeholder and defer.
3. Partial and split.

Stop conditions:

1. Product scope is unclear.
2. Auth or DB blocks proof.
3. Tests do not exist and behavior is unclear.

## Phase 08: CDN And Assets

Why now: planner catalog and SVG runtime need stable asset truth.

Allowed scope:

1. `site/public/cdn`
2. `site/scripts/*asset*`
3. CDN docs
4. Reference scanners

Hard no-go scope:

1. Uploads without approval.
2. Deletions without approval.
3. Secret changes.

Initial checks:

```powershell
rg -n "asset-cdn|R2|cdn|svg-catalog|public/cdn" site docs Readme.md START.md
```

Stop conditions:

1. Cloud credentials are needed.
2. Upload or deletion is required.
3. DB paths disagree with local paths.

## Phase 09: Deployment

Why now: deployment proof is late, not early.

Allowed scope:

1. Build config
2. Vercel config
3. Scripts needed for build correctness

Hard no-go scope:

1. Deploying.
2. Secret edits.
3. Ignoring lint or type errors.

Initial commands:

```powershell
pnpm run lint
pnpm run typecheck
pnpm run build
```

Release gate:

```powershell
pnpm run release:gate
```

Run release gate only after blockers are credible.

Stop conditions:

1. Lint still has broad failures.
2. Typecheck fails outside current scope.
3. Build depends on missing env.

## Phase 10: Tech-Stack Docs

Why now: generated docs should follow source truth.

Allowed scope:

1. `site/tech-stack-generator`
2. `site/tech-stack-docs`
3. Generated docs

Hard no-go scope:

1. Hand-editing generated outputs as source truth.
2. Regenerating before package and source truth stabilize.

Initial commands:

```powershell
pnpm run docs:check:tech-stack
pnpm run docs:sync:tech-stack
pnpm run docs:gate:tech-stack
```

Stop conditions:

1. Generator output conflicts with source truth.
2. Link checks fail broadly.
3. Regeneration includes unrelated churn.

## Phase 11: Docs

Why now: docs must reflect repaired truth, not wishes.

Allowed scope:

1. `Plans`
2. `docs`
3. `Readme.md`
4. `START.md`
5. `Failures.md`
6. `PACKAGES.md`

Hard no-go scope:

1. Locked copies unless intentionally syncing.
2. Deleting historical evidence.
3. Claiming checks passed without logs.

Initial checks:

```powershell
pnpm run docs:check:root-links
rg -n "passed|green|deployable|complete|fixed|TODO|Grok|gpt5.5|oandO04072026" Plans docs Readme.md START.md Failures.md PACKAGES.md
```

Stop conditions:

1. Doc conflicts need product decision.
2. Locked and live docs disagree.
3. Evidence is missing.

## Handover

Every handover must include:

1. Current branch and commit.
2. Dirty or clean state.
3. Files changed.
4. Commands run.
5. Exit codes.
6. Evidence paths.
7. Checks skipped.
8. Open risks.
9. Next smallest step.

Do not say:

1. "Fixed" unless the check passed.
2. "Clean" unless `git status` and relevant gates prove it.
3. "Deployable" unless build and release evidence prove it.
4. "Console clean" without browser console evidence.
