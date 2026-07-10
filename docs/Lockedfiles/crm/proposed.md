# CRM — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — CRM persistence is **post-1B**; not blocking 1A or 1B

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Surface | CRM is **admin-only**; no separate member CRM under `/crm/*` | `site/app/admin/crm/`, `features/crm/` | `ADMIN_workflow.md` |
| Persistence | Full server persistence via Admin DB (Drizzle) — **future**; until then demo banner stays honest | `features/crm/stores/` → server repos | `docs/audit/admin/README.md` |
| Routes | Path constants in `crmRoutes.ts` | `crmRoutes.ts` | `ADMIN_workflow.md` |
| Plans link | Project detail may link `GET /api/plans` | `ProjectDetailView` | `ADMIN_workflow.md` |

## Packages (proposed per plan)

| Package | Phase | Policy |
|---------|-------|--------|
| `drizzle-orm` | post-1B | Persist CRM via `adminDb` when server CRM ships |
| `zod` | future | API validation for clients/projects/quotes |
| — | — | No new UI framework — reuse admin shell + Ark |

Until persistence lands: no CRM-specific packages beyond React + existing admin stack.
