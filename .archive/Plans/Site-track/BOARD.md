# Site-track

> [Plans/INDEX.md](../INDEX.md) · **Bar:** [00-QUALITY-BAR](../00-QUALITY-BAR.md)

## Honest scores

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~8 | S1/S2 cards match reality |
| Product / marketing | ~5 | S2 slice only; site not “complete” |

| Card | Status | Owns |
|------|--------|------|
| [S1](./S1-deps-cleanup.md) | **OPEN** | Dep cleanup — **plan only** until owner `execute Plan A` |
| [S2](./S2-site-chrome.md) | **REPROVE** (was PASS slice) | Evidence path `results/site/s2-chrome/` missing on path audit — restore pack or re-prove; not full redesign |

### Next action (only)

**S1:** Get owner decision. Do **not** cut `@fancyapps/ui` without written OK.  
If owner says execute: confirm unused → remove → `pnpm install` + typecheck → `results/site/s1-deps/`.

**Kill list:** Claiming site DONE; silent dep cuts; redesign as “S2 residual.”

```
S1 (owner gate) → further site work only with new cards
```
