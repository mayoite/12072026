# EXEC-3 — Edit chrome polish

**Seat:** EXEC-3  
**File:** `site/features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx`  
**Date:** 2026-07-10  

## Done

### Identity header
- Eyebrow: `Catalog assets · SVG block editor`
- Title: slug in `<code>`
- Meta: `admin-badge` variant, SKU, schema, checksum, loaded timestamp, source provenance
- Actions: `admin-btn admin-btn--outline` → Back to list (no header Save — Puck owns publish)

### Publish feedback / loading
- `formState.submitting` → `admin-alert admin-alert--info` + spinner + aria-busy
- Success → `admin-alert--info` + CheckCircle + live UTC stamp (not stale `updatedAtLabel`)
- Error → `admin-alert--error` + WarningCircle + dismiss
- Success/error dismiss via `admin-btn admin-btn--outline`
- Live region: `aria-live="polite"`

### Panels
- Variant summary → `admin-panel` + `admin-panel__header`
- Field cartography → collapsible inside `admin-panel`
- GLB section → `admin-panel` + `admin-field` file input (no ad-hoc shell-workspace-card padding soup)
- Puck → `admin-panel` chrome + existing `admin-puck-editor`; **`onPublish={handlePublish}` unchanged path**

### GLB upload UX
- Uploading state + warn alert on upload failure (blob URL retained)

### Dynamic imports (ssr:false)
- `GlbExtruderPreview` and `ModelViewerPreview` remain `next/dynamic` with **`ssr: false`**
- Loading fallbacks use `admin-page__meta` + spinner

### Crash-safe cartography (kept from EXEC-1)
- `themeTokens` / `rovingFocus` / `liveAnnouncementCategories` null-coalesced

## Not done / constraints
- **No locked CSS** edited (`site/app/css/core/locked/**`)
- Did not invent `admin-alert--success` styles (locked CSS has warn/error/info only) — success uses `--info` with check icon
- Did not restructure Puck publish action wiring (page still binds `publishSvgEditorAction`)

## Verify
- `pnpm exec tsc --noEmit -p tsconfig.json` → exit 0 (no EditView errors)
