# CRM — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** CRM is **out of Phase 1A/1B scope** — remains demo-grade client store; no acceptance gate applies.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Surface | `/admin/crm/*` only (embedded views) | `site/app/admin/crm/`, `features/crm/` |
| Persistence | `crmStore.ts` + demo seed — **local/client** | `features/crm/stores/` |
| Routes | clients, projects, quotes, project detail | `features/crm/crmRoutes.ts` |
| Legacy | `/crm/*` redirects to `/admin/crm/*` | `site/app/crm/` |
| Demo UX | `CrmDemoBanner` visible | `features/crm/CrmDemoBanner.tsx` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `react`, `react-dom` | `^19` | View layer only |
| `lucide-react` | `^1.21.0` | Via admin shell / nav (not CRM-specific) |
| — | — | **No CRM-specific npm deps** — local `crmStore` only |

---

## Summary

CRM is an admin-embedded demo-grade sales UI: clients, projects, quotes, and detail views render inside the console shell with honest demo labeling. Useful for layout and navigation drills but not a persisted CRM backed by the admin database.

## Strengths

Correct placement under `/admin/crm` with legacy redirects handled. Route constants centralized in `crmRoutes.ts`. Views are test-covered at page level. Demo banner sets expectations instead of implying production CRM. Fits admin shell pattern (thin routes, feature views).

## Weaknesses

No server persistence — `crmStore` is client/local seed data. Cannot be used for real customer operations without migration to Drizzle/admin DB. Project detail’s link to `/api/plans` is a thin bridge, not a full CRM domain model. Risk that stakeholders confuse “CRM exists in admin” with “CRM is shipped.”
