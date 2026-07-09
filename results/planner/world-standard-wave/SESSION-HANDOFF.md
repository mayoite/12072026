# SESSION HANDOFF — world-standard-wave
**Date:** 2026-07-09 · **Checkout:** `D:\OandO07072026` only (no worktrees)

## Start here
```
cd D:\OandO07072026
git log -1
```
Tip HEAD at handoff: `37f4f63` — P04 pose continuity unit + guest client node:fs fix. Re-run `git log -1` before acting.

## Standing rules (do not re-debate)
- **One task:** finish the current owner slice; no multi-epic thrash.
- **Tests real, not fake:** one real behavior assert > hollow coverage; zero tests not allowed.
- **Evidence only under `results/`** (`results/<module>/<phase>/…`). Never `site/results/` or `site/test-results/`.
- **Parallel = context, not multi-epic:** subagents only inside the same task (fresh context).
- **mayoite ~45m:** mirror push about every ~45 min of real work (or after a big land).
- **No site/results:** layout gate / `pnpm run check:layout` — redirect tooling to root `results/`.

## What just landed (recent open3d / wave commits)
| Commit   | Land |
|----------|------|
| `37f4f63` | **P04 partial:** pose continuity unit green; guest `node:fs` / NodeIO client fix; browser e2e residual open |
| `a400701` | Select doors/windows on plan canvas (openings) |
| `d8e646e` | Wall delete **cascades** door/window delete |
| `62a14e3` | Honest **export** menu — drop PDF/PNG until real |
| `5f097d5` | Systems v0 **BOQ** list prices INR + GST |
| `2ce6f90` | Furniture **rotation** degrees to scene radians |
| earlier  | BOQ JSON export / summary; W4 orbit three-layer (`d6ee3d2`); seats cart |

Evidence roots: `results/planner/world-standard-wave/` (esp. `04-orbit-continuity/`, `07-systems-v0/`). Wave map: `WAVE.md`.

## Owner truth
**Everything is partly implemented.** Prefer **close residual** on the open slice over starting a new phase/W-gate. Do not re-plan the wave from zero.

## Recommended next single slice
1. **Finish W4 browser e2e residual** — stabilize place path + `data-orbit-enabled` + 2D restore in `open3d-w4-orbit-continuity.spec.ts` (see `04-orbit-continuity/NOTES.md` + `playwright-raw.log`); **or**
2. **Ask owner** which residual wins if intent is unclear.

**Do not:** invent a new phase, multi-stream W-gates, or re-debate AGENTS standing rules above.
