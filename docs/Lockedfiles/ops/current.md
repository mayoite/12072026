# Ops — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Ops is **out of Phase 1A/1B scope** — customer-queries admin surface only.

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
| Customer queries | `/admin/customer-queries` under admin shell | `features/ops/`, `app/admin/customer-queries/` |
| API | `GET/PATCH /api/customer-queries/manage` | `site/app/api/customer-queries/` |
| Legacy | `/ops/*` redirects | `site/app/ops/` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `react` | `^19` | Ops page views |
| — | — | Uses shared admin stack — no ops-specific deps |

---

## Summary

Ops is narrow and focused: customer query management under the admin shell, migrated from standalone `/ops` routes. One of the smaller domains but follows the same auth and API patterns as the rest of admin.

## Strengths

Clear single purpose (customer queries). API exists with manage endpoints and integration tests. Properly folded into admin nav rather than orphaned ops app. Legacy redirects preserve old bookmarks.

## Weaknesses

Small surface area — easy to overlook in planner-heavy planning. No dedicated ops runbook section beyond admin workflow. Incidents may route through generic admin auth debugging.
