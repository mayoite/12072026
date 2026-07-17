# P-W3 — P13 sync conflict (keep-local / keep-cloud)

**Date:** 2026-07-17  
**Agent:** P-W3  
**Verdict:** PASS (unit only)

## Scope (owned)

- `site/features/planner/editor/PlannerSyncConflictDialog.tsx`
- `site/features/planner/editor/planner-sync-conflict-dialog.module.css`
- `site/features/planner/persistence/cloudPlanHydration.ts`
- `site/tests/unit/features/planner/editor/PlannerSyncConflictDialog.test.tsx`
- `site/tests/unit/features/planner/persistence/cloudPlanHydration.test.ts`

Did **not** touch canvas, catalog, ReviewQuotePanel, admin, or site marketing.

## Done

### contentHash pure helpers (`cloudPlanHydration.ts`)

- `contentHashesEqual` — strict hash equality
- `plansHaveDivergentContent` — contentHash-only divergence
- `buildPlanConflictDetails` / `conflictDetailsForDialog` — UI payload bridge
- `hydrateCloudPlanIntoIndexedDb` — divergent hash → `source: "conflict"`, `plan: null`, retains both `localPlan` / `cloudPlan`
- Same hash → newest `updatedAt` (never silent overwrite on divergent content)
- `detectPlanConflict` — contentHash authoritative
- `resolveConflict` — explicit keep-local / keep-cloud (no timestamp auto-pick)
  - local → `source: "local"`, `syncState: "idle"`
  - cloud → `source: "cloud"`, `syncState: "synced"`
- `applyConflictResolution` — returns plan + `shouldReplaceWorkspaceDocument` for host apply

### Conflict dialog

- Keep local / Keep cloud actions (disabled + guarded while `busy`)
- Escape dismiss only when not busy and `onDismiss` provided
- Focus trap / initial focus into dialog
- Shows local/cloud timestamps and truncated content hashes (full hash in `title`)
- `aria-busy` + status “Applying your choice…” when busy
- Test ids: `conflict-keep-local`, `conflict-keep-cloud`, hash/timestamp ids

## Evidence

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/persistence/cloudPlanHydration.test.ts \
  tests/unit/features/planner/editor/PlannerSyncConflictDialog.test.tsx
# exit 0 — 2 files, 21 tests

pnpm run check:layout
# exit 0
```

## Not done (honest)

- **Host apply path:** `OOPlannerWorkspace` still discards `resolveConflict` result and never calls `setSyncConflict` with a real conflict (dialog never opens in product without further host wiring). Out of OWN scope this slice.
- Immutable named revisions, single save-state machine, browser conflict journey — still OPEN (P13 residual).
- Full `pnpm run test` / release:gate — parent.

## P13 status after this slice

| Item | Truth |
|------|--------|
| No silent overwrite on divergent contentHash | **PASS** (pure hydrate) |
| Explicit keep-local / keep-cloud API | **PASS** (pure + dialog unit) |
| Conflict dialog UI (a11y basics) | **PASS** (unit) |
| Host wires conflict → dialog → apply document | **OPEN** |
| Immutable revisions / full recovery matrix | **OPEN** |
