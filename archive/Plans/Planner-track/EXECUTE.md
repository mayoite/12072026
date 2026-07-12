# Planner-track · execute (reproof helper)

**Not constitution.** Law: [`AGENTS.md`](../../AGENTS.md) → [`Agents/`](../../Agents/) → [BOARD](./BOARD.md).  
This file only lists how to re-prove a card. Owner card order lives on **BOARD** (P01→P12).

1. Re-read `AGENTS.md` (every task; owner asks every ~4 min while session runs)
2. [CONSTRAINTS](./CONSTRAINTS.md) · [BOARD](./BOARD.md) — **Upgrade lock** + **Next action only**
3. Active flat card `P0X-*.md` · status in [CHECKPOINTS](./CHECKPOINTS.md)
4. Old review notes / old `results/` packs = **untrusted** — re-prove; do not cite chat as PASS

**Reject:** adding a second plan host · prove on `planner-2d-canvas` · treat Fabric cutover as future · skip cards for “easy” wins

## Owner sequence (best path)

```text
P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12
```

One open Planner ID. Clear blockers on the **best** path (Fabric sole, id+pose when required, TDD + Chrome when phase needs UI). Not the easiest (skip, count-only, unit-only).

## Standing seats

| Seat | Skill | Role |
|------|--------|------|
| TDD | `/using-superpowers` + TDD | Red→green on card tests; no production code without failing test when implementing |
| Chrome DevTools | `/using-superpowers` + chrome-devtools | Browser gates when card requires UI; Fabric host only |

## Evidence dump (not PASS law)

Write under `results/planner/world-standard-wave/<folder>/` when the card asks:  
`HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md` (or card-named files).  
**PASS/done:** live commands this session + Plans status update ([AGENTS.md](../../AGENTS.md) §5 — never read old dumps as PASS).

Old packs = clues only. Do not execute museum dumps.
