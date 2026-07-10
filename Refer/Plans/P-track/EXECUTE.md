# P-track — current execution (reproof)

**Date:** 2026-07-10 · **Scope:** Re-prove W gates on **current** worktree — not rewrite engines.

## Read order

1. This file · [CONSTRAINTS.md](./CONSTRAINTS.md) · [BOARD.md](./BOARD.md)
2. Phase: thin `P0X-*.md` → [CODE-REVIEWS.md](./CODE-REVIEWS.md) for verdict
3. [RESULTS-MAP](../../archive/Plans/Research/RESULTS-MAP.md) for evidence folder

**Do not open** `archive/museum/p-track-archive/implementation-plans/*` (~1200–1800 lines each). Those are historical agent dumps, not execute law.

## Truth before work

- Historical CP PASS ≠ proof on today's dirty tree
- Old `results/` may be gone or stale — re-prove or recover honestly
- First job is **inventory + verdict**, not feature thrash
- [CONSTRAINTS.md](./CONSTRAINTS.md) must match disk after P02 reproof

## Reproof order

```text
P01 current truth
→ P02 constraints reproof
→ P03 W3
→ P05 W2 symbols (before full P07 if cabinet unreadable)
→ P07 W1–W2 journey
→ P06 W5–W6
→ P04 W4
→ P08 W7
→ P09 W8
→ P10 pack
```

## Evidence contract (every phase)

```text
HEAD.txt
WORKTREE.txt
RUN-META.json
RAW-LOGS/
VERDICT.md          PASS | HALF | OPEN | FAIL only
```

Use `reproof-2026-07-10/` subfolder when keeping historical artifacts in the same gate folder.

## Rules

- One active P phase at a time
- Unit green ≠ browser green
- JSON `pass` field ≠ product verdict
- No second interactive 2D engine ([CONSTRAINTS.md](./CONSTRAINTS.md))
- No unrelated dirty work in phase commits

## Museum (read only if owner asks)

- Full phase cards: [`p-track-cards-full/`](../../archive/museum/p-track-cards-full/)
- Full code reviews: [`code-reviews/`](../../archive/museum/p-track-archive/code-reviews/)
- **Do not execute from** [`implementation-plans/`](../../archive/museum/p-track-archive/implementation-plans/) — prompt dumps only
