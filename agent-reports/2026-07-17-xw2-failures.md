# X-W2 — Failures.md + DB-SVG honesty

**Date:** 2026-07-17  
**Agent:** X-W2 (Cross)  
**Scope:** Failures.md accuracy; disk live authority; dual-write gate honesty; no fake cutover PASS  
**Owned:** `Failures.md`, one-liner in `docs/architecture/08-DATABASE-SVG-CONTRACT.md`, this report, brief `## X-W2` on ADMIN.md + TECH-STACK.md  
**Not owned:** product code, secrets, commit, other Failures entries, full DB-SVG implementation

## Goal

Keep Failures.md and DB-SVG status honest against live code and a fresh R2 probe.

## Fresh checks

| Check | Result |
|-------|--------|
| Code: disk is live Admin publish authority | **CONFIRMED** — `publishDescriptorWithPipeline` / UI copy / `inventory/descriptors` + `public/svg-catalog` |
| Code: dual-write inject only when DB + R2 ListObjects ok | **CONFIRMED** — `resolveSvgPublishDualWriteDeps` modes `skipped_no_db` / `skipped_r2_unavailable` / `enabled` |
| Unit: dual-write resolve modes | **PASS** — `vitest run …/resolveSvgPublishDualWrite.test.ts` → 5 passed |
| Live R2 ListObjects probe (no secrets logged) | **ok: true**, source `cloudflare-r2`, bucket `oando-asset-cdn` |
| Products DB env present | **SET** (`PRODUCTS_DATABASE_URL`) → dual-write **can** inject |
| Dual-write payload authority | **OPEN** — incomplete (e.g. `png` checksum reuses SVG hash in `publishDescriptorWithPipeline`) |
| Lifecycle durable store | **Filesystem** — `results/admin/catalog-ops/` via `ADMIN_CATALOG_OPS_DIR_DEFAULT` |
| Planner svg-blocks | DB-aware load + disk fallback; published gate via `readSvgArtifactStatus` (disk) |
| Cutover PASS | **NOT claimed** |

## Failures.md change

**Before:** stated dual-write gate correctly but next action still assumed R2 pair missing; acceptance range stopped at DB-SVG-16; no live R2 status.

**After:**  
- Disk still live authority.  
- Live R2 probe **ok** — dual-write can enable.  
- Explicit **enabled dual-write ≠ cutover**.  
- Stub dual-write + disk Planner gate named.  
- Acceptance open `DB-SVG-01`…`DB-SVG-20`.  
- Next action: prove dual-write publish + revision/pointer/Planner path; no cutover PASS while disk is authority.

## Contract one-liner

`docs/architecture/08-DATABASE-SVG-CONTRACT.md` **Current gap**: svg-blocks is DB-aware with disk fallback; published SVG gate and Admin publish still disk. Split authority remains.

## Honesty rules held

1. Disk is live publish authority until cutover is proved.  
2. Dual-write only when R2 ListObjects succeeds (and Products DB configured).  
3. Dead R2 skips injection so resolve-gate does not undo disk.  
4. R2 ready does **not** equal DB-SVG cutover PASS.  
5. No PASS invented from unit-only dual-write modes.

## Did not do

- No product code edits.  
- No secrets printed or committed.  
- No live dual-write publish attempt (out of scope; next action for Admin track).  
- No release:gate claim.

## Status

| Item | Status |
|------|--------|
| Failures.md DB-SVG honesty | **UPDATED** (OPEN, accurate) |
| Live R2 readiness | **ok** (probe) — not cutover |
| Dual-write inject gate (unit) | **PASS** |
| DB-SVG cutover | **OPEN** |
| Fake cutover PASS | **None** |
