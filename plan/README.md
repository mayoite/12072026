# Current execution

**Shape:** every product track has **exactly two** docs.

| Doc | Role |
|-----|------|
| **`CHECKLIST.md`** | **All-encompassing** track document: evidence rules (Part A) + full phase checklist (Part B). What is required, what exists, what is open. |
| **`FEATURES.md`** | Live code map: feature → path → honest gap. |

## Tracks

| Track | Checklist | Features |
|-------|-----------|----------|
| **Planner** | [`Planner/CHECKLIST.md`](./Planner/CHECKLIST.md) | [`Planner/FEATURES.md`](./Planner/FEATURES.md) |
| **Admin** | [`Admin/CHECKLIST.md`](./Admin/CHECKLIST.md) | [`Admin/FEATURES.md`](./Admin/FEATURES.md) |
| **Site** | [`Site/CHECKLIST.md`](./Site/CHECKLIST.md) | [`Site/FEATURES.md`](./Site/FEATURES.md) |
| **TechStack** | [`TechStack/CHECKLIST.md`](./TechStack/CHECKLIST.md) | [`TechStack/FEATURES.md`](./TechStack/FEATURES.md) |

**Index rollup:** `docs/OUTSTANDING-ITEMS.md`  
**Active blockers:** `Failures.md`  
**Security:** `docs/architecture/10-SECURITY-BENCHMARK.md` (no plan duo yet)

## Rules

- Live code wins over docs.
- Unit ≠ browser.
- `results/` is not PASS proof.
- Status: **OPEN** · **PARTIAL** · **DONE** · **FAIL**.
- Disk is live SVG authority until cutover is browser-proved.
- No third file per track (no OUTSTANDING / FINISH-PLAN / COMPLETION-CONTRACT).

## How to work

1. Read track `CHECKLIST.md`.  
2. Map code via `FEATURES.md`.  
3. Fix → verify in the same session.  
4. Update that track’s `CHECKLIST.md` only when status is re-verified.
