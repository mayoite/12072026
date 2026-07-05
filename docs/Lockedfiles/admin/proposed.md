# Admin — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`plann/REVISION-2026-07-05.md`](../../../plann/REVISION-2026-07-05.md) · **Phase 1B** for SVG admin product — **acceptance pending**

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Admin contract | [`docs/architecture/ADMIN-UI-CONTRACT.md`](../../architecture/ADMIN-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Shell | Admin role from **server** `app_metadata` only; CSRF on mutations | `app/admin/layout.tsx`, `withAuth` APIs | `docs/audit/admin/README.md` |
| Nav | `adminNav.ts` is source of truth (includes svg-editor) | `adminNav.ts` | `ADMIN_workflow.md` (to update) |
| Catalog admin | Three data sets; APIs at `/api/admin/catalogs/{type}` | catalog views + handlers | `ADMIN_workflow.md` |
| SVG editor | Puck registry canonical; full `<Puck>` for field edit; `onPublish` → validate → compile → persist | `features/planner/admin/svg-editor/` | `plans/2026-07-05_phase1-execution/implementation-decisions.md` |
| Publish flow | Save draft ≠ publish; compile failures block publish (not silent success) | API + `svgRevisionRepository` | `plann/START.md` §9 |
| Portal SVG | ≤1 Puck `Render` per route; public preview of published blocks | `portal/svg-catalog/` | `benchmark-delivery.md` |
| Views vs routes | Routes own URLs only; views in `features/planner/admin/`, `crm/`, `ops/` | `site/app/admin/` | `MODULE-LAYOUT.md` |
| Icons | Phosphor = planner chrome; **Lucide allowed in admin CMS** (revision Decision 3) | admin views | `PACKAGES.md` |

## Packages (proposed per plan)

| Package | Phase | Policy |
|---------|-------|--------|
| `@puckeditor/core` | 1B | Full `<Puck>` on svg-editor; `onPublish` → API |
| `@ark-ui/react` | 1B+ | Admin primitives; no Radix in new admin surfaces |
| `react-aria-components` | 1B+ | Combobox / listbox in catalog admin |
| `zod` | 1B | All publish payloads |
| `lucide-react` | ongoing | **Admin CMS only** — documented exception |
| `dompurify`, `svgo`, `@resvg/resvg-js`, `sharp`, `@flatten-js/core`, `polygon-clipping` | 1B | Server-only Option A; compile failure blocks publish |
| `@svgdotjs/*` | — | **Excluded** — remove from `package.json` |

**Excluded from admin client bundles:** compiler, resvg, sharp, svgo (verify in 1B gate).
