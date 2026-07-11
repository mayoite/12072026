# Checkpoints (CP-00 → CP-10)

**Do not trust historical PASS ticks.** Old packs under `results/planner/world-standard-wave/` are clues, not current product truth. A CP is green only after **fresh** proof on this checkout (see [EXECUTE.md](./EXECUTE.md)).

**Checkout:** `.` only · no worktrees  
**Evidence root:** `results/planner/world-standard-wave/`  
**Upgrade lock:** Fabric sole 2D — see [BOARD](./BOARD.md) · [CONSTRAINTS](./CONSTRAINTS.md)  
**Owner law:** [BOARD](./BOARD.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [Agents-Plan](../../Agents/Agents-03-Plan.md)

### Status meanings

| Status | Meaning |
|--------|---------|
| `OPEN` | Not proven on this tree |
| `REPROVE` | Old evidence may exist — **must re-run** before claim |
| `PASS` | Fresh proof this session + path under `results/` (owner may confirm) |
| `WAIVE` | Owner wrote waiver here (date + reason) |

There is **no** separate MASTER-CHECKLIST. Tick theater was deleted.

---

## Folder lock (do not invent names)

| CP | Card | Gate | Folder |
|----|------|------|--------|
| CP-00 | [START](./START.md) | W0 | `00-start/` |
| CP-01 | [P01](./P01-product-truth.md) | Baseline | `00-product-truth/` |
| CP-02 | [P02](./P02-engine-lock.md) | Engine | `01-engine-lock/` |
| CP-03 | [P03](./P03-select-delete.md) | **W3** | `03-select-delete/` |
| CP-04 | [P04](./P04-orbit-continuity.md) | **W4** | `04-orbit-continuity/` |
| CP-05 | [P05](./P05-symbols-svg.md) | W2 symbols | `05-symbols-svg/` |
| CP-06 | [P06](./P06-save-honesty.md) | W5–W6 | `06-save-honesty/` |
| CP-07 | [P07](./P07-draw-place-journey.md) | W1–W2 browser | `02-browser-open3d-journey/` |
| CP-08 | [P08](./P08-mesh-quality.md) | **W7** | `08-mesh-quality/` |
| CP-09 | [P09](./P09-shortcuts-chrome.md) | **W8** | `09-shortcuts-chrome/` |
| CP-10 | [P10](./P10-evidence-handover.md) | Pack | `10-handover/` |

---

## Status (2026-07-11 owner distrust)

| CP | Bar (short) | Status |
|----|-------------|--------|
| CP-00 | Approach A + unlock recorded — do not re-ask unlock | **PASS** (process only) |
| CP-01 | Inventory vs claims, paths in evidence | **REPROVE** |
| CP-02 | CONSTRAINTS = **Fabric-sole**; no Feasibility restore | **REPROVE** |
| CP-03 | Select · delete · undo **on Fabric** — unit + browser | **REPROVE** |
| CP-04 | Orbit ON + 2D↔3D pose (Fabric↔Three), browser proof | **REPROVE** |
| CP-05 | Symbols readable **on live Fabric**; SVG = publish only | **REPROVE** |
| CP-06 | Save→reload same ids; honest local/cloud labels | **REPROVE** |
| CP-07 | Draw/place on Fabric (`open3d-fabric-stage`), screenshots | **REPROVE** |
| CP-08 | Modular mesh readable (toe/carcass/door) | **REPROVE** |
| CP-09 | Shortcut labels = handlers | **REPROVE** |
| CP-10 | Handover pack on disk — **not product ship** | **OPEN** (`10-handover/` missing) |

Honest gaps (do not paper over): W3/W4 browser often **count-only**, not id/pose — see `../../results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md`.

---

## Kill order

```
CP-00 → CP-01 → CP-02 → CP-03 → CP-07 → CP-06 → CP-04 → CP-05 → CP-08 → CP-09 → CP-10
```

## Waiver (owner only)

```markdown
### WAIVE CP-XX
- Date:
- Reason:
- What remains red:
```
