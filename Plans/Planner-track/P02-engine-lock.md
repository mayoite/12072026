# P02 — Engine lock

**Status:** **PASS** (owner 2026-07-12 — “so its done 0k proceed”) · pack under `01-engine-lock/` · engine lock only, not product ship.

**Gate:** CP-02 — lock the **upgraded** stack in writing. Later phases ship on it; no engine rollback.  
**Evidence:** `results/planner/world-standard-wave/01-engine-lock/` only (never `02-engine-lock/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [BOARD](./BOARD.md)

**Goal:** Freeze Fabric-sole + Three/orbit + RAC toolbar. Reject any second interactive plan canvas.

---

## Evidence this checkout (cite only)

| Artifact | Path under `01-engine-lock/` | Honest read |
|----------|------------------------------|-------------|
| HEAD | `HEAD.txt` | `2c2e9f2b0ab7829d6cf92261383e7228ab9d784d` |
| Lock record | `ENGINE-LOCK-RECORD.md` | Fabric-sole stack written |
| Entrypoints | `ENTRYPOINT-MAP.md` | guest/canvas → `PlannerHost` → Fabric stage |
| Pins | `PACKAGE-PIN.md` | `fabric@7.4.0` · RAC `1.19.0` · no lucide |
| Flags | `FLAG-INVENTORY.md` | furniture env = leftover, **not** host switch |
| Unit | `vitest-p02.json` | host wiring proof (historical) |
| Owner gate | `OWNER-SIGNOFF.md` + `OWNER-SIGNOFF-STATUS.md` | **PASS** 2026-07-12 |
| Chrome smoke | `guest-fabric-sole.png` + NOTES | shell only — not product ship |

**What CP-02 PASS means:** owner accepted engine lock. **Does not mean:** W3–W8 green or product ship.

---

## Locked stack (upgrade — this checkout)

| Layer | Locked choice | Live path |
|-------|---------------|-----------|
| **Live layout** | `editor` · `canvas` · `3d` · `project` · `ui` | `features/planner/` — **no** product `open3d/` or `workspace/` folder |
| **Routes** | guest + canvas | `/planner/guest` · `/planner/canvas` |
| **Legacy URLs** | redirect only | `/planner/open3d` · `/planner/fabric*` → **301** `/planner/canvas/` |
| **2D host** | Fabric.js **v7** sole | `PlannerCanvasStage` → `canvas/PlannerFabricStage` |
| **Browser testid** | Sole proof host | `data-testid="planner-fabric-stage"` |
| Walls + furniture | In Fabric stage | Not flag-gated second canvas |
| Flag leftover | fabric furniture env | Module/tests only — **not** host switch |
| Second plan host | **Gone** | Do not recreate |
| Archive | **Deleted** | Not product proof host |
| 3D | Three + orbit ON | `Lazy3DViewer` + `getPlannerViewerControlProps()` |
| Toolbar | React Aria | `CanvasToolRail` — [P09](./P09-shortcuts-chrome.md) |

```
Document (UUID v7, mm)
  → 2D: Fabric stage (sole) · 3D: Three + orbit
  → Persist: local first (P06 honesty)
```

| Layer | Live code | Forbidden |
|-------|-----------|-----------|
| Document | Project/entity ids = **UUID v7** (`lib/newEntityId` / `uuid` pkg); envelope/model **units mm** | Dual unit-of-record; minting non-v7 entity ids; silent unit rewrite |
| 2D | `PlannerCanvasStage` → `canvas/PlannerFabricStage` · testid `planner-fabric-stage` | Second interactive plan canvas · archive host |
| 3D | `Lazy3DViewer` + `getPlannerViewerControlProps()` (orbit ON) | R3F rewrite as W4 substitute · product `Planner3DViewer` as host |
| Persist | Local autosave first · `cloudEnabled` stays false until P06 ships honesty | Labels that imply account/cloud when local-only |

**Pins:** `site/package.json` — `fabric@7.4.0` · see evidence `PACKAGE-PIN.md`.

---

## Forbidden downgrade

- Dual interactive plan canvas
- Prove W gates on archive `planner-2d-canvas`
- Re-add `_archive/fabric` as product host
- R3F rewrite as substitute for workspace Lazy3D path
- Drop RAC toolbar without owner explain

Any of the above = **engine downgrade** — stop; do not claim W-gate or CP-02 progress on a downgraded host.

## Anti-thrash

- Do not re-open engines in P03+ without owner.
- Do not prove W3/W5/W8 on any host except `planner-fabric-stage`.
- Raise missing behavior **on Fabric** only.
- Research = inspiration only — no competitor assets in `site/`.
- Do not re-open engine host choices without owner (stack is locked).
- W gates still need fresh proof on `planner-fabric-stage`.

---

## Kill order

- [x] ENGINE-LOCK-RECORD / ENTRYPOINT-MAP = Fabric-sole + live layout
- [x] FLAG-INVENTORY: leftover only
- [x] PACKAGE-PIN matches package.json
- [x] CONSTRAINTS matches this card
- [x] hostWiring + import graph unit proof → `vitest-p02.json`
- [x] Owner **PASS** 2026-07-12 (`OWNER-SIGNOFF.md`)
- [x] Plans status updated (BOARD · CHECKPOINTS · this card)

**Next (sequence):** [P03](./P03-select-delete.md) / CP-03 **W3**.
