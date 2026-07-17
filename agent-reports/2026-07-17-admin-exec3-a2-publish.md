# EXEC-3 A2 — SVG authoring + disk publish

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-3  
**Scope:** Disk publish authority path (not full DB cutover)  
**Status:** **UNIT PASS** for owned slice · Browser smoke **OPEN** · DB-SVG cutover **OPEN**

---

## Mission outcome

| Item | Result |
|------|--------|
| Publish path compile → S4 disk → persist; fail-closed on compile fail | **PASS** (code + unit) |
| Rollback / stale-draft gates unit-green | **PASS** |
| UI copy admits disk authority | **PASS** |
| Tests use temp inventory roots / no canonical mutation on write paths | **PASS** |
| Supabase storage mirror best-effort; must not roll back disk success | **PASS** (code + unit) |
| Full DB-SVG / R2 cutover | **OPEN** — not claimed |
| Browser publish smoke | **OPEN** — optional; not run this session |

---

## Code (owned)

### Publish core (already fail-closed; comments clarified)

- `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts`  
  Order: parse → released contract → **compile S1–S3** → (idempotent short-circuit) → **S4 disk** → **persist** → optional dual-write when injected. Compile `!ok` or throw aborts before S4/persist.
- `site/features/admin/svg-editor/publish/publishSvgEditorAction.ts`  
  Stale-draft gate → dual-write resolve → pipeline. After disk success: lifecycle + **best-effort** `publishSymbolToSupabaseCatalog`; mirror failure/throw still returns `success: true`.
- `site/app/api/admin/svg-editor/route.ts`  
  Same pipeline + stale gate; dual-write deps from resolve (A3 owns honesty of that gate).

### UI honesty (this slice)

- List: `AdminSvgEditorListView` — `Source: local disk (live publish authority) · Products DB not live`
- Edit shell: `AdminSvgEditorTopBar` — source line includes disk authority; publish title states disk live authority + best-effort Supabase mirror
- Operator messages: `publishActionMessages.ts` — impact / confirm / fail / success mention disk
- `adminDataSourceEditability.ts` — published SVG reason admits disk live authority

### Dual-write (not claimed as cutover)

- Did **not** change `resolveSvgPublishDualWrite` pure gate (A3).
- Route unit test mocks dual-write skip so local env R2/DB cannot fake dual-write inject in A2 disk tests.

---

## Tests run (fresh this session)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/admin/svg-editor/publish/publishDescriptorWithPipeline.test.ts \
  tests/unit/features/admin/svg-editor/publish/publishSvgEditorAction.test.ts \
  tests/unit/features/admin/svg-editor/publish/publishActionMessages.test.ts \
  tests/unit/features/admin/svg-editor/lifecycle/staleDraftPublishGate.test.ts \
  tests/unit/features/admin/svg-editor/lifecycle/rollbackDescriptorVersion.test.ts \
  tests/unit/features/admin/svg-editor/lifecycle/adminDataSourceEditability.test.ts \
  tests/unit/features/admin/svg-editor/views/AdminSvgEditorListView.admSvg01.test.tsx \
  tests/unit/features/admin/svg-editor/views/adminShell.admShell01_02.test.tsx \
  tests/unit/features/admin/svg-editor/views/edit-shell/AdminSvgEditorTopBar.test.tsx \
  tests/unit/app/api/admin/svg-editor/route.test.ts \
  tests/unit/features/admin/svg-editor/publish/svgPipelineRunner.test.ts
```

**Result:** 11 files · **90 tests passed** · exit 0  

```text
pnpm run check:layout  → OK
```

### New / extended coverage this slice

- `publishSvgEditorAction.test.ts`: stale-draft blocks before pipeline; Supabase mirror fail / throw still returns disk success + audits `supabaseSvgOk: false`
- Route test: mocks `resolveSvgPublishDualWriteDeps` → disk-authority path
- UI/message tests assert disk / live authority copy

### Isolation note

- Pipeline / rollback / dual-write recovery tests use `mkdtemp` roots under OS temp.
- Action tests mock pipeline; `tryLoad` reads fixtures but does not write canonical `inventory/descriptors/` or `public/svg-catalog/`.
- No fake R2 cutover PASS.

---

## Honest gaps

1. **Browser publish smoke** not run (optional in plan).
2. **DB-SVG cutover** remains OPEN in `Failures.md`.
3. Dual-write payload may still be stub when enabled — A3 / cutover track; not A2 disk authority claim.
4. When dual-write **is** injected and DB/R2 artifact write fails after disk commit, pipeline rolls disk back (configured dual-write fail-closed). That is **not** the Supabase catalog mirror path.

---

## FINISH-PLAN A2 mapping

| Checklist line | Evidence |
|----------------|----------|
| Excalidraw studio list + edit shell primary | Existing + unit (list/shell) |
| Publish compile → S4 → persist fail-closed | `publishDescriptorWithPipeline` unit |
| Rollback + stale-draft unit-green | dedicated unit files |
| Browser smoke optional | OPEN |
| Supabase mirror best-effort | action unit (fail + throw) |

---

## Files touched

- `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx`
- `site/features/admin/svg-editor/views/edit-shell/AdminSvgEditorTopBar.tsx`
- `site/features/admin/svg-editor/publish/publishActionMessages.ts`
- `site/features/admin/svg-editor/publish/publishSvgEditorAction.ts`
- `site/features/admin/svg-editor/lifecycle/adminDataSourceEditability.ts`
- Tests under `site/tests/unit/features/admin/svg-editor/**` and `site/tests/unit/app/api/admin/svg-editor/route.test.ts`
- This report; `agent-reports/ADMIN.md` EXEC-3 section
