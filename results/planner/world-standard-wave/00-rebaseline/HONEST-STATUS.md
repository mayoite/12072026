# Why everything is “done” but nothing feels finished

**Date:** 2026-07-10 · **HEAD:** `500ac6e` (rebaseline tip; update if tip moves)  
**Audience:** owner (confused for good reason)

## Two different meanings of “done”

| Word in docs | What it actually meant | Is the product finished? |
|--------------|------------------------|---------------------------|
| **CP / W-gate PASS** | A **phase checklist** had evidence folders under `results/planner/world-standard-wave/` at some HEAD (often 2026-07-09) | **No** |
| **Product finished** | Buyer can trust planner end-to-end for quote / ship | **No — not claimed** |
| **Spine** | Select, place, orbit, save-local, mesh bar, shortcuts have *some* proof | **Spine ≠ ship** |

**Your confusion is correct.** The scoreboard said PASS for CP-00…09. That is **gate paperwork + artifacts**, not “O&O planner product is finished.”

## What is actually true (2026-07-10)

| Surface | Honest bar | Proof / gap |
|---------|------------|-------------|
| Unlock W0 | **PASS** | Approach A + implementation unlock recorded |
| Evidence folders for W1–W8 | **EXIST** | Matrix in `00-rebaseline/NOTES.md` |
| Re-run of all browser gates on **this** HEAD | **NOT DONE** | Old logs; not re-proven today |
| Typecheck site now | **PASS** | `tsc --noEmit` exit 0 @ rebaseline session |
| Layout | **PASS** (after fix) | `check:layout` OK; deleted `site/test-results` |
| Git origin + mayoite | **PASS** | Dual account switch; both remotes |
| CP-10 handover pack | **OPEN** | `10-handover/` was missing |
| A11y label-in-name | **HALF** | Code + unit 31/31; **no fresh LH** |
| Mesh quality | **HALF** | W7 bar met; still boxy |
| Cloud save | **OPEN** | W6 = local-only honesty by design |
| Fabric full stage | **OPEN** | Destination later (Approach A) |
| Priced BOQ product | **OPEN** | Demo path only |
| Buyer-ready ship | **OPEN** | Explicit non-claim |

## Rule going forward

- **PASS (gate)** = path under `results/` for that CP criterion, re-readable.  
- **FINISHED (product)** = owner north star; only claim with fresh proof + honest residuals listed.  
- Never use “PASS” alone in owner chat without saying **gate** or **product**.

## What we do next (no more pretend)

1. Keep **honest scoreboard** (this file + TRUTH-LOCK residuals).  
2. Build **CP-10** `10-handover/` that **admits** gate PASS ≠ product done.  
3. Only re-open product phases when evidence is red or owner prioritizes a residual.  
