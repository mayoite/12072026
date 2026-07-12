# Checkpoints (CP-00 → CP-10)

**Do not trust historical PASS ticks.** Old packs under `results/planner/world-standard-wave/` are clues, not current product truth. A CP is green only after **fresh** proof on this checkout + Plans status update.

**Law:** [`AGENTS.md`](../../AGENTS.md) · [`Agents/`](../../Agents/) · [BOARD](./BOARD.md)  
**Checkout:** `.` only · no worktrees  
**Evidence dump root:** `results/planner/world-standard-wave/` (dump only — not PASS law)  
**Upgrade lock:** Fabric sole 2D — see [BOARD](./BOARD.md) · [CONSTRAINTS](./CONSTRAINTS.md)

### Status meanings

| Status | Meaning |
|--------|---------|
| `OPEN` | Not proven on this tree |
| `REPROVE` | Old evidence may exist — **must re-run** before claim |
| `PASS` | Fresh proof this session + Plans updated (owner may confirm) |
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

Buyer cards [P11](./P11-project-brief-room.md) · [P12](./P12-workstation-configurator.md) follow P10 in owner sequence (no CP number).

---

## Status (2026-07-12 live-repo rebaseline)

| CP | Bar (short) | Status |
|----|-------------|--------|
| CP-00 | Approach A + unlock recorded — do not re-ask unlock | **PASS** (process only) |
| CP-01 | Inventory vs claims, paths + live vitest | **REPROVE** (fresh pack this HEAD under `00-product-truth/`; owner accept) |
| CP-02 | CONSTRAINTS = **Fabric-sole**; no second plan host (forbidden) | **WAIVE / REPROVE** before handover |
| CP-03 | Select · delete · undo **on Fabric** — unit + browser id+pose | **REPROVE** |
| CP-04 | Orbit ON + 2D↔3D pose (Fabric↔Three), browser proof | **REPROVE** |
| CP-05 | Symbols readable **on live Fabric**; SVG = publish only | **REPROVE** |
| CP-06 | Save→reload same ids; honest local/cloud labels | **REPROVE** |
| CP-07 | Draw/place on Fabric (`planner-fabric-stage`), screenshots | **REPROVE** |
| CP-08 | Modular mesh readable (toe/carcass/door) | **REPROVE** |
| CP-09 | Shortcut labels = handlers | **REPROVE** |
| CP-10 | Handover pack on disk — **not product ship** | **OPEN** |

Honest gaps: W3/W4 browser often **count-only**, not id/pose — raise on Fabric; never archive host.

---

## Owner sequence (best path)

```
P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12
```

**Next open only:** **P01 / CP-01** — product truth inventory.  
**Do not** next-kill CP-03 until P01 and P02 are closed honestly on this checkout.

## Waiver (owner only)

```markdown
### WAIVE CP-XX
- Date:
- Reason:
- What remains red:
```
