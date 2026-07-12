# Agents/Agents-08-architecture.md

**Bar:** `Agents-01-STANDARD.md` · **HOW:** `docs/architecture/` · **Execute:** `Plans/Planner-track/`

## Document stack (locked)

```
Document (UUID v7, mm)
  → 2D: Fabric stage (sole) · 3D: Three + orbit
  → Persist: local first (P06 honesty)
```

Host: guest/canvas → Host → OOPlannerWorkspace · testid `planner-fabric-stage`  
Layout: `editor` / `canvas` / `3d` / `project` / `ui` · mint: `lib/newEntityId`

## Forbidden downgrade

- Dual interactive plan canvas
- Prove W gates on archive `planner-2d-canvas`
- Re-add `_archive/fabric` as product host
- R3F rewrite as substitute for workspace Lazy3D path
- Drop RAC toolbar without owner explain

## Also

- Read `docs/architecture/01-MODULE-LAYOUT.md` before placing code.
- Flags / non-hosts: [P02 FLAG dump](../results/planner/world-standard-wave/01-engine-lock/FLAG-INVENTORY.md) (not a second host)
- Toolbar RAC + tools: [P09](../Plans/Planner-track/P09-shortcuts-chrome.md) · `canvasTool.ts`
- CSS: `Agents-09-css.md` · [CONSTRAINTS](../Plans/Planner-track/CONSTRAINTS.md) · [P02](../Plans/Planner-track/P02-engine-lock.md)
