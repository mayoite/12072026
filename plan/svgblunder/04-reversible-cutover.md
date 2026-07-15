# Phase 4: Reversible Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `subagent-driven-development` or `executing-plans`. Use verification evidence from the current run. Do not commit, push, apply migrations, or deploy unless the owner asks.

**Goal:** Make V2 the default only after complete browser, security, persistence, and recovery proof while retaining a read-only V1 fallback.

**Architecture:** Explicit environment switches select V2 Admin and Planner reads. V1 remains frozen, readable, exportable, and independently restorable. Rollback changes pointers/configuration; it never reconstructs lost data.

**Tech stack:** Next.js configuration, Vitest, Playwright, Products DB, Supabase Storage, Cloudflare R2, repository gates.

---

## Task 1: Add explicit cutover configuration

**Files:**
- Create: `site/features/admin/svg-editor-v2/config/svgEditorVersionConfig.ts`
- Modify: `site/config/env.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgEditorVersionConfig.test.ts`

- [ ] Add `ADMIN_SVG_EDITOR_VERSION=v1|v2` with V2 intended after acceptance.
- [ ] Add `ADMIN_SVG_EDITOR_LEGACY_READONLY=true|false` with true intended after cutover.
- [ ] Add `PLANNER_SVG_CATALOG_VERSION=v1|v2` with V2 intended after acceptance.
- [ ] Reject invalid or contradictory configuration at startup.
- [ ] Keep all configuration in `.env.local`/deployment secrets, never hard-coded in components.

## Task 2: Isolate the V1 fallback

**Files:**
- Create: `site/features/admin/svg-editor-legacy/LegacySvgInventoryView.tsx`
- Create: `site/app/admin/svg-editor/legacy/[[...path]]/page.tsx`
- Test: `site/tests/unit/features/admin/svg-editor-legacy/legacyReadOnly.test.tsx`

- [ ] Keep V1 source and data available without mixing them into V2 modules.
- [ ] Permit inspection, comparison, download, and export only.
- [ ] Block edit, save, approve, publish, retire, restore, and rollback writes in the legacy route.
- [ ] Show the legacy link only to authorized Admin users when the read-only flag is enabled.
- [ ] Keep a minimal legacy smoke suite proving recovery remains functional.

## Task 3: Complete the cross-surface browser matrix

**Files:**
- Create: `site/tests/e2e/admin-svg-v2-authoring.spec.ts`
- Create: `site/tests/e2e/admin-svg-v2-ai.spec.ts`
- Create: `site/tests/e2e/admin-svg-v2-recovery.spec.ts`
- Modify: `site/tests/e2e/planner-catalog.spec.ts`

- [ ] Test manual creation, shapes, paths, groups, layers, text, gradients, managed images, save, reopen, revision, rollback, publish, and Planner rendering.
- [ ] Test decimal units, Scale/Metadata/Cancel, proportional centering, and unlocked X/Y scaling.
- [ ] Test focus-mode sidebar hiding, overlay, Escape, backdrop, route changes, focus trap, and focus restoration.
- [ ] Test AI selection/document scope, preview, Apply, Discard, refusal, timeout, fallback, stale checksum, audit, and atomic Undo.
- [ ] Test bridge spoofing, sanitizer attacks, oversized documents, authorization, rate limits, partial upload failure, and prior release continuity.
- [ ] Capture current-run console errors, screenshots, traces, and exact command exits under `results/admin/` only.

## Task 4: Prove recovery and rollback

**Files:**
- Create: `docs/admin/svg-editor-v2-operations.md`
- Create: `site/scripts/svg-v2/verify-recovery.ts`
- Test: `site/tests/unit/scripts/svg-v2/verify-recovery.test.ts`

- [ ] Restore a V1 sample into isolated temporary storage and compare every checksum.
- [ ] Switch isolated Admin and Planner reads to V1 and prove the sample remains readable.
- [ ] Switch back to V2 without changing either authority.
- [ ] Document incident rollback, storage failure recovery, provider failure behavior, and how to disable AI independently.
- [ ] State clearly that restoring V1 writes requires a separately reviewed migration, not a runtime toggle.

## Task 5: Run the release-quality gate

- [ ] Run focused V2 unit and integration tests.
- [ ] Run the Admin SVG V2 Playwright journeys.
- [ ] Run the Planner catalog smoke journey.
- [ ] Run `pnpm run lint`.
- [ ] Run `pnpm run typecheck`.
- [ ] Run `pnpm --filter oando-site run lint:ui:strict`.
- [ ] Run `pnpm --filter oando-site run test:a11y`.
- [ ] Run `pnpm run check:layout`.
- [ ] Review current `Failures.md`; do not claim release readiness while an applicable blocker remains.

## Task 6: Perform the reversible cutover only with owner approval

- [ ] Verify the V1 archive and manifest again immediately before cutover.
- [ ] Apply approved V2 database migrations and storage policies.
- [ ] Configure V2 Admin and Planner reads.
- [ ] Freeze V1 writes and enable the read-only legacy route.
- [ ] Confirm V1 and V2 row counts, object checksums, and public release URLs.
- [ ] Confirm product, pricing, managed inventory, and CRM counts are unchanged.
- [ ] Re-run the complete gate after cutover.
- [ ] Preserve V1 tables, source artifacts, legacy feature code, and recovery tests.

## Completion evidence

- [ ] Manual SVG-Edit is fully functional and default.
- [ ] Admin navigation focus mode is accessible.
- [ ] V2 dimensions, drafts, publishing, revisions, AI, and audits pass current-run tests.
- [ ] Planner consumes the V2 released artifact.
- [ ] V1 is read-only, exportable, and checksum-restorable.
- [ ] No feature or data has been permanently removed.
- [ ] No unapproved commit, push, migration apply, or deployment occurred.

