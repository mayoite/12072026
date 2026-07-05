# Planner execution plans — read in order

**Baseline:** 2026-07-05  
**Workflow:** Expert draft → coordinator revise → agent execute (UI + tests + docs)

Open files **top to bottom** for execution authority. `RESEARCH-*` files are reference only — not execution authority.

| # | File | Role |
|---|------|------|
| 00 | [`00-REVISION.md`](00-REVISION.md) | **Product decisions** — Option A SVG, 1A/1B split; read first |
| 01 | [`01-START.md`](01-START.md) | Commands, benchmarks, package boundaries |
| 02 | [`02-PHASE-1.md`](02-PHASE-1.md) | Phase 1A (open3d shell) then 1B (SVG path) checklists |
| 03 | [`03-PHASE-2.md`](03-PHASE-2.md) | Promotion after 1A + 1B accepted |
| 04 | [`04-HANDOVER.md`](04-HANDOVER.md) | Session status, blockers, next P0 |
| 05 | [`05-UI-EXPERT-PLAN.md`](05-UI-EXPERT-PLAN.md) | UI expert **draft** (reference) |
| 06 | [`06-UI-PLAN.md`](06-UI-PLAN.md) | **UI execution authority** — UI-0 → UI-3 |
| 07 | [`07-TEST-EXPERT-PLAN.md`](07-TEST-EXPERT-PLAN.md) | Test expert **draft** (reference) |
| 08 | [`08-TEST-PLAN.md`](08-TEST-PLAN.md) | **Test execution authority** — TEST-1 / TEST-2 gates |
| 09 | [`09-DOC-REVISION.md`](09-DOC-REVISION.md) | Doc batch coordinator log (architecture + Lockedfiles) |

## Cross-links

| Need | Open |
|------|------|
| Where code goes | [`docs/architecture/MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md) |
| UI anti-drift | [`docs/architecture/MODULE-UI-CONTRACT.md`](../docs/architecture/MODULE-UI-CONTRACT.md) |
| Domain snapshots | [`docs/Lockedfiles/INDEX.md`](../docs/Lockedfiles/INDEX.md) |
| Package pins | repo-root `PACKAGES.md` |
| Governance (pins, GS, gates) | [`plans/README.md`](../plans/README.md) → `01-implementation-decisions.md` |

## Research (not execution)

- [`RESEARCH-2026-07-05-synthesis.md`](RESEARCH-2026-07-05-synthesis.md) — entry point
- `RESEARCH-2026-07-05-ui-*`, `RESEARCH-2026-07-05-packages*` — background only
