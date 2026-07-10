# Documentation — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — refresh locked snapshots after each acceptance gate

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
| Conduct | Always re-read `AGENTS.md`; user message wins | root | `AGENTS.md` |
| Session | Two handovers OK for different lanes — do not merge blindly | root `HANDOVER.md` + `ayushdocs/SESSION-RECAP.md` | `handover-routing.md` |
| Gates | **Two files only:** `Failures.md` (active), `resolved-failures.md` (history) | root | `Failures.md` |
| Locked snapshots | Update only when intentionally locking a version | `docs/Lockedfiles/` | `INDEX.md` |
| Domain map | `<module>/current.md` + `proposed.md` | `docs/Lockedfiles/` | this index |
| Architecture docs | Live index `docs/architecture/README.md` | `architecture/` | `architecture/proposed.md` |
| Module layout | New code placement | `MODULE-LAYOUT.md` | revision |
| Doc routing | `conduct/ReadmeLocked.md` — which doc to open per task | Lockedfiles | `ReadmeLocked.md` |
| Admin workflow | Keep `ADMIN_workflow.md` in sync with `adminNav.ts` | root | `ADMIN_workflow.md` |
| Planner authority | `00-REVISION.md` → `01-START.md` / `02-PHASE-1.md` | `Plans/` | revision |
| SVG authority | Option A per revision + `PACKAGES.md` | `Plans/`, `PACKAGES.md` | Decision 1 |

## Packages (proposed per plan)

| Doc | Update when |
|-----|-------------|
| `PACKAGES.md` | Any Tier move — benchmark + Package Review gate |
| `Plans/P-track/START.md` §5 | Planner runtime table sync |
| `dependencies-engines/proposed.md` | After `package.json` cleanup PR |
| Domain `<module>/current.md` | Each lock baseline — packages section mirrors disk |
| `ADMIN_workflow.md` | Route or admin package surface changes |
| `ayushdocs/SESSION-RECAP.md` | After **1A** or **1B** evidence sign-off only |

Docs do not add npm deps — they must track `site/package.json` honestly.
