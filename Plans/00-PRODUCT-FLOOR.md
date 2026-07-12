# Product floor — checkout audit (not plan structure)

**Not plan law.** Do not use this file as status for cards.  
**Plan law:** [00-QUALITY-BAR.md](./00-QUALITY-BAR.md) · track BOARDs.  
**Update:** when a kill is re-proven or reopened — date the change.

**Purpose:** one place for “what is red **on this tree right now**” so the quality bar stays pure.

## How to use

| Do | Don’t |
|----|--------|
| Log product gaps with evidence path | Put browser-count details on BOARDs as eternal truth |
| Mark rows **OPEN / REPROVE** only | Invent **PARTIAL** as a status |
| Reopen until owner accepts green-when | Close because “code landed” |

## Snapshot (2026-07-12) — re-prove before trust

| Track | Product truth (not flattery) | Next falsifiable product step |
|-------|------------------------------|-------------------------------|
| **Planner** | P03–P09 landed candidates common; browser often **count-only**, not id/pose; P11–P16 unbuilt; CP-10 pack missing | CP-03: select→delete→undo **same id + pose** on Fabric |
| **Admin** | A1–A3 foundation proven historically; A4 code raised (authority + shell); **disk browser proof open**; A5–A8 unbuilt | A4.0.1: draw→publish→bytes on this checkout |
| **Site** | S2 claimed PASS slice but `results/site/s2-chrome/` **absent** on last path audit — treat product as **REPROVE** until pack or demote | Restore pack or demote S2 status on [Site BOARD](./Site-track/BOARD.md) |
| **SEO** | STATIC_PATHS diverge from live routes; inventory start only | SEO1: classify gaps index/noindex/bug |
| **Security** | Admin A3 slice proven; track CSP/RLS/CSRF not closed | SEC4 advisors 0 ERROR or `results/security/BLOCKED.md` |

## PARTIAL history → reopen queue

Anything historically graded “partial” (reviews, chat, old notes) maps to:

```text
NOT DONE → OPEN or REPROVE on the owning card
         → green-when still required
         → residual stays until owner is happy
```

No “partial credit” in Plans enum.

## Empty evidence dirs

Empty folder under `results/` = **not proof**. Card stays OPEN/REPROVE.
