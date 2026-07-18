# Admin features

**Code map only.** Status truth: `CHECKLIST.md`. Live code wins.

**Roots:** `site/features/admin/` · `site/app/admin/` · `site/app/api/admin/` · `site/inventory/descriptors/` · `site/public/svg-catalog/`

## Parametric brand library

| Slice | Path | Status |
|-------|------|--------|
| Fields | `features/planner/asset-engine/svg/parametric/linearDeskFields.ts` | PARTIAL |
| Draw | `…/parametric/drawLinearDeskFromTemplate.ts` | PARTIAL |
| Barrel | `…/parametric/index.ts` · `asset-engine/index.ts` | PARTIAL |
| CLI | `scripts/render-linear-desk.mts` | PARTIAL |
| Form / publish UI | — | OPEN (PL-3) |
| Planner place | — | OPEN (PL-4) |

## Publish (disk authority)

| Surface | Path |
|---------|------|
| Publish core | `svg-editor/publish/publishDescriptorWithPipeline.ts` |
| Server action | `svg-editor/publish/publishSvgEditorAction.ts` |
| Dual-write gate | `svg-editor/publish/resolveSvgPublishDualWrite.ts` |
| S4 runner | `svg-editor/publish/svgPipelineRunner.ts` |
| Persist descriptors | `svg-editor/storage/persistBlockDescriptor.ts` |
| Isolation guard | `svg-editor/storage/catalogWriteIsolation.ts` |

DB not release authority until cutover — `Failures.md`.

## Authoring

| Surface | Path |
|---------|------|
| List | `svg-editor/views/AdminSvgEditorListView.tsx` · `app/admin/svg-editor/page.tsx` |
| Studio shell | `svg-editor/views/edit-shell/*` |
| Excalidraw draft | `svg-editor/editor/ExcalidrawClient.tsx` |
| Form identity | `svg-editor/form/*` |

## Auth / shell

| Surface | Path |
|---------|------|
| Proxy | `site/proxy.ts` |
| Layout | `app/admin/layout.tsx` |
| Session | `app/api/admin/_lib/server.ts` · `withAuth` |
| Nav | `ui/adminNav.ts` · `AdminLayoutShell.tsx` |
| Bypass | `lib/auth/devAuthBypass.ts` (local only) |

## Catalog / commercial

| Surface | Path |
|---------|------|
| Products | `catalog/*` · `app/admin/catalog/` |
| Lifecycle | `svg-editor/lifecycle/*` |
| Families | (see catalog family forms) |
| Price books | `pricing/*` · `app/admin/price-books/` |
| CRM demo | `features/crm/*` · `app/admin/crm/` |

## DB-SVG

Cutover open. Pointer column + dual-write path exist; disk still live. Detail: `Failures.md` · `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.
