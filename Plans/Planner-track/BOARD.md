# Planner-track — program board

> **Law first:** [`AGENTS.md`](../../AGENTS.md) · [`Agents/`](../../Agents/) · then this board.  
> [Plans/INDEX.md](../INDEX.md) · [START](./START.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [CHECKPOINTS](./CHECKPOINTS.md) · [Bar](../00-QUALITY-BAR.md)  
> [EXECUTE](./EXECUTE.md) = reproof helper only — **not** constitution; does not outrank `AGENTS.md` / owner order.

**Outcome:** a buyer can draw a room, place furniture, save it, reopen it unchanged, and hand off a priced layout — proven on the **live Fabric** stage, not on archived hosts.

**W0:** UNLOCKED · Approach **A** · CP-00 process PASS — do not re-ask unlock.  
**CP-01…CP-09:** **REPROVE** — code candidates may exist; **no PASS transfers** without fresh proof on this checkout. **CP-10:** OPEN (`10-handover/` missing).  
**CP-02 owner gate:** **OPEN** — see [P02](./P02-engine-lock.md) · `01-engine-lock/OWNER-SIGNOFF-STATUS.md`.

## Honest scores (not goals)

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~7.5 | Sequence discipline; owner gates must stay real |
| Product / engine | ~4 | Fresh browser id/pose proof missing; buyer P11–P16 largely unbuilt |

**Do not claim 9.5.** Product rises only with id/pose browser evidence and buyer outcomes.

## Upgrade lock (reject downgrade)

| Live | Forbidden |
|------|-----------|
| Fabric `PlannerCanvasStage` / `data-testid="planner-fabric-stage"` | Dual 2D host · any second interactive plan canvas |
| Raise select / Block2D / draw **on Fabric** | Prove W3/W5/W8 on archive `planner-2d-canvas` or any non-Fabric host |
| Admin SVG catalog = **inventory publish only** | Claim `svg-catalog` is room plan-draw |
| Live layout = `editor` + `canvas` + `3d` + `project` + `ui` under `features/planner/` | Product `open3d/` folder · dual plan host · restore `_archive` |
| **Toolbar = React Aria** (`react-aria-components` on `CanvasToolRail`) | Lucide · second rail · drop RAC without owner explain |

**Forbidden downgrade (canonical — [P02](./P02-engine-lock.md)):** dual interactive plan canvas · prove W gates on archive `planner-2d-canvas` · re-add `_archive/fabric` as product host · R3F rewrite as Lazy3D substitute · drop RAC toolbar without owner explain.

Flat cards only: `P01`…`P16`. No `modules/` · `phases/`.

**Status enum only:** `OPEN` · `REPROVE` · `DONE` · `PASS slice` · `WAIVE`. No hybrid “WAIVE/REPROVE” PASS theater.

## Owner card sequence (best path — no skip)

**One open Planner ID at a time** ([Agents-02-tracks](../../Agents/Agents-02-tracks.md)).  
**Order:** numerical cards through buyer config — **do not jump to P03** to “save time.”

```
P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12 → P13 → P14 → P15 → P16
```

(Do not open later cards as “the work” while earlier open card is incomplete. Full track **through P16**.)

| Order | Card | CP | Status | Evidence folder |
|------:|------|-----|--------|-----------------|
| 1 | [P01](./P01-product-truth.md) | CP-01 | **REPROVE** (inventory pack this HEAD; owner accept residual) | `00-product-truth/` |
| 1a | [P01a](./P01a-dead-path-cleanup.md) | dead resolve | **OPEN** (layout simplify landed; residual = tests) | `00-product-truth/dead-path-cleanup/` |
| 1b | [P01b](./P01b-orphan-cleanup.md) | orphans | **DONE** slice (archive tests gone; dual 3D pruned) | `00-product-truth/orphan-cleanup/` |
| 2 | [P02](./P02-engine-lock.md) | CP-02 | **PASS** (owner 2026-07-12) | `01-engine-lock/` |
| 3 | [P03](./P03-select-delete.md) | CP-03 **W3** | **PASS** (owner 2026-07-12) | `03-select-delete/` |
| 4 | [P04](./P04-orbit-continuity.md) | CP-04 **W4** | **PASS** (agent 2026-07-12) | `04-orbit-continuity/` |
| 5 | [P05](./P05-symbols-svg.md) | CP-05 | **REPROVE** | `05-symbols-svg/` |
| 6 | [P06](./P06-save-honesty.md) | CP-06 W5–W6 | **PASS** (agent 2026-07-12 — unit + browser id continuity) | `06-save-honesty/` |
| 7 | [P07](./P07-draw-place-journey.md) | CP-07 W1–W2 | **REPROVE** | `02-browser-open3d-journey/` (dump name only — not product folder) |
| 8 | [P08](./P08-mesh-quality.md) | CP-08 **W7** | **PASS** (agent 2026-07-12 — units + NOTES + headless plan visual) | `08-mesh-quality/` |
| 9 | [P09](./P09-shortcuts-chrome.md) | CP-09 **W8** | **PASS** (agent 2026-07-12 — unit honesty 23/23; browser optional residual) | `09-shortcuts-chrome/` |
| 10 | [P10](./P10-evidence-handover.md) | CP-10 | **OPEN** | `10-handover/` |
| 11 | [P11](./P11-project-brief-room.md) | buyer | **OPEN** | (card names path) |
| 12 | [P12](./P12-workstation-configurator.md) | buyer | **OPEN** — needs Admin A6 | (card names path) |

### Next action (only)

**Open:** [P05](./P05-symbols-svg.md) / **CP-05** — symbols readable on live Fabric; SVG = publish inventory only.  
Evidence: `results/planner/world-standard-wave/05-symbols-svg/`.

**Closed:** CP-02 · **CP-03 / W3** owner PASS · **CP-04 / W4** agent PASS 2026-07-12 · **CP-06 / W5–W6** agent PASS 2026-07-12 · **CP-08 / W7** agent PASS 2026-07-12 (toe/carcass/door units + headless plan visual) · **CP-09 / W8** agent PASS 2026-07-12 (shortcut/rail/palette units; deferred ≠ W1).

Live product layout: `editor` + `canvas` + `3d` + `project` + `ui` under `features/planner/`. Legacy URL `/planner/open3d` is redirect-only, not a product folder.

**Standing seats (owner):** 1× TDD agent + 1× Chrome DevTools agent · `/using-superpowers` · bar `Agents-01-STANDARD.md` · **stay through P01–P16** (owner risk on planner phase).

### Owner calibration (2026-07-12) — 5k before marathon

Agreed product pace. **Not a second sequence** — same **P01→P16** cards; this only ranks **how hard we pull** and what we refuse.

| Horizon | Meaning | In / out |
|---------|---------|----------|
| **5k (now)** | 2D plan host trustworthy | Fabric: draw · place · **W3 select/delete/undo** · units (mm store; mm/m/ft-in UI) · honest tools |
| **2D bar** | SmartDraw discipline | Left library · tool rail · grid canvas · dimensions/text **honest** (live or deferred-labeled) — not consumer catalog theater |
| **After W3 green** | Prove what is half-live | W1 walls / W2 place on Fabric only if code path already exists — prove, don’t rebuild |
| **Bridge (both ends)** | Meet in the middle | Advance **2D select/draw** and **persist/labels** (and 3D door left open) **in parallel** when fences don’t collide — not one serial wall, not “P06 before W3” theater. Integrate when both spans are real. |
| **P06** | One span, not a toll | Save honesty is a real bridge pier — **not** a gate that blocks 2D. Build it when free; never claim it blocks W3. |
| **3D door** | **Open as-is** | 2D\|3D toggle stays; **no rewrite, no close, no mesh marathon** as a substitute for plan tools |
| **Later life** | Planner 5D–style interior | Full room materials / dense 3D catalog — **after** plan 5k, not instead |
| **Never** | Dog’s tail | Dual 2D host · archive proof · steal/competitor UI · paper-moon count-only PASS · magic shortcuts |

**One open card at a time** (numerical). **No circular waits:** P05 does not wait on P07/P08; P07 does not re-open P05; P08 is not blocked by P07 place.  
**Inventory chrome** (heights/scroll/a11y): fix when it blocks place; do not rebuild as Planner 5D before Fabric tools are real.

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
| W8 | **Live-tier** tools only: labels = shortcuts = handlers · RAC rail · deferred tools arm-only — [P09](./P09-shortcuts-chrome.md) |

**Evidence root (dump only — not PASS law):** `results/planner/world-standard-wave/`  
**PASS law:** [`AGENTS.md`](../../AGENTS.md) — live commands + Plans status; never treat old `results/` as done.

Each gate dump when written: `HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md`

## Kill list (hard)

- Skip P01/P02 owner gates to “just do W3”
- Second plan host · archive `planner-2d-canvas` proof
- Count-only browser as W3/W4 green
- Unit alone as browser gate
- Claiming CP-02 PASS without owner signoff file
- Claiming CP-10 / product ship while P01–P16 incomplete
- Foreign skill packs as law
- Dropping standing seats (TDD + Chrome) before P16 close without owner waive

## After P12 (still in track — through P16)

| Order | Outcome | Status | Card |
|------:|---------|--------|------|
| 13 | Layout at scale | **OPEN** | [P13](./P13-layout-at-scale.md) |
| 14 | Validation | **OPEN** | [P14](./P14-validation-clearances.md) |
| 15 | Priced BOQ | **OPEN** — needs Admin A7 | [P15](./P15-priced-boq-export.md) |
| 16 | Share / quote | **OPEN** | [P16](./P16-share-review-quote.md) |
