# Ops — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`plann/REVISION-2026-07-05.md`](../../../plann/REVISION-2026-07-05.md) — ops unchanged through 1A/1B

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
| Customer queries | Ops lives under admin shell (not standalone `/ops/*`) | `features/ops/`, `app/admin/customer-queries/` | `ADMIN_workflow.md` |
| API | Admin auth + CSRF on mutations | `site/app/api/customer-queries/` | `withAuth.ts` |

## Packages (proposed per plan)

| Package | Policy |
|---------|--------|
| Shared admin | `@ark-ui/react`, `react-aria-components` if forms grow |
| `zod` | Validate manage API payloads |
| — | No separate ops package — stays under admin shell |
