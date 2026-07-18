# Current execution

**Shape:** each track has **CHECKLIST + FEATURES**. **Admin** also has `IMPLEMENTATION-PLAN.md` + `REALITY-AND-STACK.md` (four files only).

| Doc | Role |
|-----|------|
| **CHECKLIST.md** | Evidence + phases. Admin Part C = parametric order factory. |
| **FEATURES.md** | Live code map: feature → path → gap. |

## Tracks

| Track | Checklist | Features |
|-------|-----------|----------|
| **Planner** | [`Planner/CHECKLIST.md`](./Planner/CHECKLIST.md) | [`Planner/FEATURES.md`](./Planner/FEATURES.md) |
| **Admin** | [`Admin/CHECKLIST.md`](./Admin/CHECKLIST.md) | [`Admin/FEATURES.md`](./Admin/FEATURES.md) |
| **Site** | [`Site/CHECKLIST.md`](./Site/CHECKLIST.md) | [`Site/FEATURES.md`](./Site/FEATURES.md) |
| **TechStack** | [`TechStack/CHECKLIST.md`](./TechStack/CHECKLIST.md) | [`TechStack/FEATURES.md`](./TechStack/FEATURES.md) |

**Blockers:** [`Failures.md`](../Failures.md) — **owner blockers NONE**. Agent cutover/parametric work only.  
**Owner rules:** [`AGENTS.md`](../Agents.md).

## Admin operating model (owner-aligned)

```text
Daily orders: fields → Maker drawer → SVG → publish → guest place → BOQ
Library: grow as needed (not all types day one)
Live durable intent: Supabase + R2 (dual). Code default disk until SVG_RELEASE_AUTHORITY=db — agent proof, not owner hold.
Do not rebuild Planner. Exact config only — not “close enough.”
```

## Rules

- Live code wins. Unit ≠ browser. `results/` is not PASS.
- Status: **OPEN** / **PARTIAL** / **DONE** / **FAIL**.
- No third file per non-Admin track. Admin = exactly four files.
- Do not re-litigate dual-write lectures or invent owner permission gates.

## How to work

1. Read track `CHECKLIST.md`.  
2. Map code via `FEATURES.md`.  
3. Fix → verify same session.  
4. Update checklist only with fresh evidence.
