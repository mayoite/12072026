# Documentation — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** [`plann/REVISION-2026-07-05.md`](../../../plann/REVISION-2026-07-05.md) is locked coordinator truth — **1A and 1B not accepted**; do not treat `proposed.md` snapshots as law until evidence lands.

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
| Conduct | `AGENTS.md` | root |
| Session (governance) | Root `HANDOVER.md` — CI, Vercel, typecheck | root |
| Session (product) | `plann/HANDOVER.md` — Phase 1 open3d progress | `plann/` |
| Gates | `Failures.md` active; `resolved-failures.md` history | root |
| Locked snapshots | `docs/Lockedfiles/*` per module | this folder |
| Doc routing | `ReadmeLocked.md`, `DOC-MAP.md` | Lockedfiles + root |
| Admin workflow | `ADMIN_workflow.md` — **stale** on svg-editor (2026-06-26) | root |
| Planner governance | `plans/2026-07-05_phase1-execution/` | `plans/` |
| Product plan | `plann/START.md`, `PHASE-1.md`, `PHASE-2.md`, `REVISION-2026-07-05.md` | `plann/` |
| Architecture live | `docs/architecture/README.md`, `MODULE-LAYOUT.md` | `docs/architecture/` |

## Packages (on disk)

Documentation does not install runtime packages. **Governance docs reference:**

| Doc | Pins / engines described |
|-----|--------------------------|
| `PACKAGES.md` | Tier-1/2/3 locked set (partial vs `package.json`) |
| `plann/START.md` §5 | Planner + SVG package ownership |
| `plann/REVISION-2026-07-05.md` | Option A, 1A/1B sequencing |
| `dependencies-engines/` | Full disk vs proposed graph |

---

## Summary

Documentation is dense and layered — conduct, gates, plans, locked snapshots, and domain maps coexist with stale pockets (`ADMIN_workflow`, old handover dates, duplicate plan trees). The 2026-07-05 plan revision and domain current/proposed pairs reduce agent confusion when kept in sync after code moves.

## Strengths

`AGENTS.md` and testing handbook are strict on evidence integrity. `implementation-decisions.md` gives governance anchors. `plann/REVISION-2026-07-05.md` resolves SVG and 1A/1B ordering. Lockedfiles pattern freezes baselines without blocking live docs. `docs/architecture/README.md` now indexes placement and UI contracts.

## Weaknesses

Multiple sources of truth for session status (root vs `plann/` handover). Historical `plans/` folders overlap active paths. `ADMIN_workflow` lag hurts admin domain. Agents can follow outdated bullets unless revision is read first. **Neither 1A nor 1B is accepted** — status docs may overstate progress.
