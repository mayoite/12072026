# EXEC-4 A3 — Dual-write honesty

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-4  
**Scope:** Honest dual-write gate only (not full DB-SVG cutover)

## Goal

Prove `resolveSvgPublishDualWriteDeps` modes are unit-honest. Dead R2 must not inject dual-write (so disk publish is not rolled back for missing/bad R2). Stub dual-write remains non-authority. Leave Failures.md DB-SVG cutover OPEN.

## What changed

| Path | Change |
|------|--------|
| `site/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.ts` | Probe via `probeR2CatalogAccess` (not boolean-only). Attach real `r2Probe`. Document modes + non-authority honesty. |
| `site/tests/unit/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.test.ts` | 5 tests: all three modes, `forceR2Probe` forward, never invent R2 success. |

## Modes (unit-proven)

| Mode | Condition | Deps injected |
|------|-----------|---------------|
| `skipped_no_db` | Products DB not configured | none; no R2 probe |
| `skipped_r2_unavailable` | DB configured, R2 probe `ok: false` | none; `r2Probe` attached |
| `enabled` | DB configured, R2 probe `ok: true` | `ImmutableSvgRevisionRepository` + R2 `putText`; `r2Probe` attached |

## Fresh verification

```text
pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.test.ts
→ 5 passed

pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/publish/publishSvgEditorAction.test.ts
→ 4 passed
```

No live R2 ListObjects probe from this agent. **No R2 success claimed.**

## Honesty limits (still OPEN)

- Dual-write **payload** in `publishDescriptorWithPipeline` remains incomplete for cutover (e.g. `png` checksum reuses SVG hash; not full `PublishedRevisionV1` transaction authority).
- When dual-write **is** `enabled`, mid-publish R2/DB failure is still fail-closed and rolls back disk (by design). Fail-soft for dead R2 is **only** at the resolve gate.
- Disk (`inventory/descriptors/`, `public/svg-catalog/`) remains live publish authority.
- **Failures.md** DB-SVG cutover line left OPEN (wording already accurate; no edit).

## Failures.md

No change. Entry already states: disk authority; dual-write only when R2 ListObjects succeeds; dead R2 does not roll back disk; DB-SVG-01…16 still open.

## Not done (out of A3)

- Full DB-SVG cutover / revision-as-authority
- Live R2 probe evidence / dual-write publish proof
- Excalidraw UI, price books, auth, CRM

## Status vocabulary

| Item | Status |
|------|--------|
| Resolve modes unit tests | **PASS** (fresh) |
| Dead R2 skips dual-write injection | **PASS** (unit) |
| R2 live readiness | **OPEN** (not probed) |
| Dual-write payload authority | **OPEN** (stub / incomplete) |
| DB-SVG cutover | **OPEN** (`Failures.md`) |
