# P01 CONTRADICTIONS — claim vs live code

**HEAD refresh:** re-checked this session (working tree). Prior pack HEAD `9d0d3cda` was **stale**.

| Claim / old residual | Live truth (now) | Status |
|----------------------|------------------|--------|
| `importGraphProof` still lists fabric-legacy route ids | **False residual.** Live graph = guest + canvas + workspace-route + host-planner + iframe-embed only. `routesStillOnFabricStack()` = `[]`. No `route-fabric-*` nodes. | **CLEARED** |
| Live `app/planner/**/fabric` tree | **Absent.** next.config 301/308 open3d+fabric → canvas. hostWiring asserts no product open3d page tree. | **CLEARED** |
| `PlannerWorkspaceRoute` mounts archive shell | **False residual.** Route mounts `PlannerHost` → `OOPlannerWorkspace` only. Archive folder **deleted**. | **CLEARED** |
| Live guest/canvas use Open3d* names only | Renamed: `PlannerWorkspaceRoute` / `PlannerHost` / Fabric stage | **CLEARED** |
| Browser host smoke not re-run (dev down) | Re-run when server up — see `00-product-truth/HOST-SMOKE.md` this refresh | **Re-prove** |
| Unit green = product gate | Still true — unit ≠ W1–W8 browser | **Open honesty** |
| Catalog SVG = plan-draw | Inventory publish only | **Open honesty** |
| Room/Dimension live geometry | Deferred tools on rail | **Open honesty** |

## Not contradictions (locked)

- Live 2D = Fabric `data-testid="planner-fabric-stage"`
- SVG catalog = inventory only
- Admin A4 = inventory drawing tools destination
- Wire JSON may still say `open3d-floorplan-project` (save format)
