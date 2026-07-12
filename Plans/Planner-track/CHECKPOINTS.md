# Checkpoints (CP-00 → CP-10)

**Do not trust historical PASS ticks.** Old packs under `results/planner/world-standard-wave/` are clues, not current product truth. A CP is green only after **fresh** proof on this checkout + Plans status update.

**Law:** [`AGENTS.md`](../../AGENTS.md) · [`Agents/`](../../Agents/) · [BOARD](./BOARD.md)  
**Checkout:** `.` only · no worktrees  
**Evidence dump root:** `results/planner/world-standard-wave/` (dump only — not PASS law)  
**Upgrade lock:** Fabric sole 2D — see [BOARD](./BOARD.md) · [CONSTRAINTS](./CONSTRAINTS.md)

### Status meanings (enum only — no hybrids)

| Status | Meaning |
|--------|---------|
| `OPEN` | Not proven on this tree · or owner gate still required |
| `REPROVE` | Old or partial evidence may exist — **must re-run / re-accept** before claim |
| `DONE` | Named slice finished honestly (not full CP PASS unless said) |
| `PASS slice` | Bounded slice green with proof paths; residual named if any |
| `PASS` | Fresh proof this session + Plans updated (owner may confirm where card requires) |
| `WAIVE` | Owner wrote waiver here or in evidence (date + reason + residual) |

There is **no** separate MASTER-CHECKLIST. Tick theater was deleted.  
**Forbidden labels:** `WAIVE / REPROVE` as one cell · agent-forged PASS · skip-to-next without owner when gate says owner.

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

**Name honesty:** evidence folder `02-browser-open3d-journey/` is a **historical dump path only**. Live product tree has **no** `features/planner/open3d/` folder. Live routes are `/planner/guest` · `/planner/canvas`; `/planner/open3d` is **301 redirect** only — see [CONSTRAINTS](./CONSTRAINTS.md).

---

## Status (2026-07-12 live-repo rebaseline)

| CP | Bar (short) | Status |
|----|-------------|--------|
| CP-00 | Approach A + unlock recorded — do not re-ask unlock | **PASS** (process only) |
| CP-01 | Inventory vs claims, paths + live vitest | **REPROVE** (fresh pack this HEAD under `00-product-truth/`; owner accept residual) |
| CP-02 | CONSTRAINTS = **Fabric-sole**; lock pack under `01-engine-lock/`; **owner signoff** | **PASS** (owner 2026-07-12 — `OWNER-SIGNOFF.md`; engine lock only, not product ship) |
| CP-03 | Select · delete · undo on **`planner-fabric-stage` only** — unit **and** browser id+pose | **PASS** (owner accept 2026-07-12 — browser id set + unit; see `03-select-delete/`) |
| CP-04 | Orbit ON + 2D↔3D pose (Fabric↔Three), browser proof | **PASS** (agent call 2026-07-12 — id set + orbit; residual: 3D mesh userData not browser-asserted) |
| CP-05 | Symbols readable **on live Fabric**; SVG = publish only | **REPROVE** |
| CP-06 | Save→reload same ids; honest local/cloud labels | **REPROVE** |
| CP-07 | Draw/place on Fabric (`planner-fabric-stage`), screenshots | **REPROVE** |
| CP-08 | Modular mesh readable (toe/carcass/door) | **REPROVE** |
| CP-09 | Shortcut labels = handlers | **REPROVE** |
| CP-10 | Handover pack on disk — **not product ship** | **OPEN** |

Honest gaps: W3/W4 browser often **count-only**, not id/pose — raise on Fabric; never archive host.  
CP-02 unit green ≠ owner PASS. CP-03 unit green ≠ W3 browser green.

---

## Owner sequence (best path)

```
P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11 → P12 → P13 → P14 → P15 → P16
```

**Standing seats through P16:** 1× TDD + 1× Chrome DevTools (owner risk on planner phase).

**Next open only:** **P05 / CP-05** — symbols readable on Fabric (`05-symbols-svg/`).  
CP-02 · CP-03 owner PASS · **CP-04** agent PASS 2026-07-12.

**Owner calibration (2026-07-12):** 5k = 2D Fabric first (SmartDraw bar); 3D door open as-is (no chase); Planner 5D-class interior = later life. Full note: [BOARD § Owner calibration](./BOARD.md#owner-calibration-2026-07-12--5k-before-marathon).

## Waiver (owner only)

```markdown
### WAIVE CP-XX
- Date:
- Reason:
- What remains red:
```
