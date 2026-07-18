# Current execution

**Shape:** every product track has **exactly two** core docs (CHECKLIST + FEATURES). **Admin** also keeps two supporting plans (IMPLEMENTATION-PLAN + REALITY-AND-STACK) — four files only under `plan/Admin/`.

| Doc | Role |
|-----|------|
| **`CHECKLIST.md`** | **All-encompassing** track document: evidence rules (Part A) + full phase checklist (Part B). What is required, what exists, what is open. Admin adds **Part C** parametric long track. |
| **`FEATURES.md`** | Live code map: feature → path → honest gap. |

## Tracks

| Track | Checklist | Features |
|-------|-----------|----------|
| **Planner** | [`Planner/CHECKLIST.md`](./Planner/CHECKLIST.md) | [`Planner/FEATURES.md`](./Planner/FEATURES.md) |
| **Admin** | [`Admin/CHECKLIST.md`](./Admin/CHECKLIST.md) | [`Admin/FEATURES.md`](./Admin/FEATURES.md) |
| **Site** | [`Site/CHECKLIST.md`](./Site/CHECKLIST.md) | [`Site/FEATURES.md`](./Site/FEATURES.md) |
| **TechStack** | [`TechStack/CHECKLIST.md`](./TechStack/CHECKLIST.md) | [`TechStack/FEATURES.md`](./TechStack/FEATURES.md) |

**Index rollup:** [`docs/site/OUTSTANDING-ITEMS.md`](../docs/site/OUTSTANDING-ITEMS.md)  
**Active blockers:** [`Failures.md`](../Failures.md)  
**Security:** `docs/architecture/10-SECURITY-BENCHMARK.md` (no plan duo yet)

## How to read each CHECKLIST

| Part | Meaning |
|------|---------|
| **Part A** | Evidence rules - how to prove PASS |
| **Part B** | Full phase checklist - required work |
| **FEATURES.md** | Code paths |

Admin **Part C** = parametric long track (Maker.js pen, forms, C0–C9, C-AI, K1–K3).  
**Admin plan set (exactly 4):** [`Admin/CHECKLIST.md`](./Admin/CHECKLIST.md) · [`Admin/FEATURES.md`](./Admin/FEATURES.md) · [`Admin/IMPLEMENTATION-PLAN.md`](./Admin/IMPLEMENTATION-PLAN.md) · [`Admin/REALITY-AND-STACK.md`](./Admin/REALITY-AND-STACK.md).

## Rules

- Live code wins over docs.
- Unit ≠ browser.
- `results/` is not PASS proof.
- Status: **OPEN**  /  **PARTIAL**  /  **DONE**  /  **FAIL**.
- Disk is live SVG authority until cutover is browser-proved.
- No third file per non-Admin track (no OUTSTANDING / FINISH-PLAN / COMPLETION-CONTRACT). Admin = exactly four files.

## How to work

1. Read track `CHECKLIST.md`.  
2. Map code via `FEATURES.md`.  
3. Fix → verify in the same session.  
4. Update that track’s `CHECKLIST.md` only when status is re-verified.
