# Planner-track — program board

> **Law first:** [`AGENTS.md`](../../AGENTS.md) · [`Agents/`](../../Agents/) · then this board.  
> [Plans/INDEX.md](../INDEX.md) · [START](./START.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [CHECKPOINTS](./CHECKPOINTS.md) · [Bar](../00-QUALITY-BAR.md)  
> [EXECUTE](./EXECUTE.md) = reproof helper only — **not** constitution; does not outrank `AGENTS.md` / owner order.

**Outcome:** a buyer can draw a room, place furniture, save it, reopen it unchanged, and hand off a priced layout — proven on the **live Fabric** stage, not on archived hosts.

**W0:** UNLOCKED · Approach **A** · CP-00 process PASS — do not re-ask unlock.  
**CP-01…CP-09:** **REPROVE** — code candidates may exist; **no PASS transfers** without fresh proof on this checkout. **CP-10:** OPEN (`10-handover/` missing).

## Honest scores (not goals)

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~7.5 | Card sequence was skipped for “easy” W3; fixed to P01→P12 |
| Product / engine | ~4 | Fresh proof missing; buyer P11–P16 largely unbuilt |

**Do not claim 9.5.** Product rises only with id/pose browser evidence and buyer outcomes.

## Upgrade lock (reject downgrade)

| Live | Forbidden |
|------|-----------|
| Fabric `PlannerCanvasStage` / `data-testid="planner-fabric-stage"` | Dual 2D host · any second interactive plan canvas |
| Raise select / Block2D / draw **on Fabric** | Prove W3/W5/W8 on archive `planner-2d-canvas` or any non-Fabric host |
| Admin SVG catalog = **inventory publish only** | Claim `svg-catalog` is room plan-draw |
| Live workspace = `open3d/` + Fabric (accepted) | Dual plan host |

Flat cards only: `P01`…`P16`. No `modules/` · `phases/`.

## Owner card sequence (best path — no skip)

**One open Planner ID at a time** ([Agents-02-tracks](../../Agents/Agents-02-tracks.md)).  
**Order:** numerical cards through buyer config — **do not jump to P03** to “save time.”

```
P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12
```

(P13–P16 stay after P12. Do not open them as “the work” while P01–P12 incomplete.)

| Order | Card | CP | Status | Evidence folder |
|------:|------|-----|--------|-----------------|
| 1 | [P01](./P01-product-truth.md) | CP-01 | **REPROVE** (inventory pack this HEAD; owner accept → P02) | `00-product-truth/` |
| 1a | [P01a](./P01a-dead-path-cleanup.md) | dead resolve | **OPEN** — after P01; before/with P02 | `00-product-truth/dead-path-cleanup/` |
| 2 | [P02](./P02-engine-lock.md) | CP-02 | **WAIVE / REPROVE** | `01-engine-lock/` |
| 3 | [P03](./P03-select-delete.md) | CP-03 **W3** | **REPROVE** | `03-select-delete/` |
| 4 | [P04](./P04-orbit-continuity.md) | CP-04 **W4** | **REPROVE** | `04-orbit-continuity/` |
| 5 | [P05](./P05-symbols-svg.md) | CP-05 | **REPROVE** | `05-symbols-svg/` |
| 6 | [P06](./P06-save-honesty.md) | CP-06 W5–W6 | **REPROVE** | `06-save-honesty/` |
| 7 | [P07](./P07-draw-place-journey.md) | CP-07 W1–W2 | **REPROVE** | `02-browser-open3d-journey/` |
| 8 | [P08](./P08-mesh-quality.md) | CP-08 **W7** | **REPROVE** | `08-mesh-quality/` |
| 9 | [P09](./P09-shortcuts-chrome.md) | CP-09 **W8** | **REPROVE** | `09-shortcuts-chrome/` |
| 10 | [P10](./P10-evidence-handover.md) | CP-10 | **OPEN** | `10-handover/` |
| 11 | [P11](./P11-project-brief-room.md) | buyer | **OPEN** | (card names path) |
| 12 | [P12](./P12-workstation-configurator.md) | buyer | **OPEN** — needs Admin A6 | (card names path) |

### Next action (only)

**Next open:** [P01a](./P01a-dead-path-cleanup.md) — live importers of dead `@/features/planner/canvas-fabric` + `editor/*` (then P02).  
P01 inventory pack written (`hostWiringP01` 4/4 + `00-product-truth/*`).  
**Forbidden shortcut:** skip to P03; second plan host; archive `planner-2d-canvas` proof; re-add product aliases to `_archive`; turbo multi-dev.

**Standing seats (owner):** 1× TDD agent + 1× Chrome DevTools agent · `/using-superpowers` · bar `Agents-01-STANDARD.md` · stay through P01–P12.

## W gates (buyer-visible — prove on Fabric when card says)

| Gate | Bar |
|------|-----|
| W1 | Draw walls + door **on Fabric** |
| W2 | Place ≥2 items; symbols readable **on Fabric** |
| W3 | Select · delete · undo on Fabric (unit **+** browser **id+pose**) |
| W4 | 2D↔3D + orbit; pose identity not count-only |
| W5 | Save → reload → same ids |
| W6 | Honest local/cloud labels |
| W7 | Modular mesh readable |
| W8 | Labels match shortcuts |

**Evidence root (dump only — not PASS law):** `results/planner/world-standard-wave/`  
**PASS law:** [`AGENTS.md`](../../AGENTS.md) — live commands + Plans status; never treat old `results/` as done.

Each gate dump when written: `HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md`

## Kill list (hard)

- Skip P01/P02 to “just do W3”
- Second plan host · archive `planner-2d-canvas` proof
- Count-only browser as W3/W4 green
- Unit alone as browser gate
- Claiming CP-10 / product ship while P01–P12 incomplete
- Foreign skill packs as law

## After P12

| Order | Outcome | Status | Card |
|------:|---------|--------|------|
| 13 | Layout at scale | **OPEN** | [P13](./P13-layout-at-scale.md) |
| 14 | Validation | **OPEN** | [P14](./P14-validation-clearances.md) |
| 15 | Priced BOQ | **OPEN** — needs Admin A7 | [P15](./P15-priced-boq-export.md) |
| 16 | Share / quote | **OPEN** | [P16](./P16-share-review-quote.md) |
