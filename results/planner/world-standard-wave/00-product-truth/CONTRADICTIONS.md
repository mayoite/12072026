# CONTRADICTIONS — open3d claims vs code (P01)

| ID | Claim source | Claim | Code / config path | Evidence | Severity |
|----|--------------|-------|--------------------|----------|----------|
| X01 | open3d README route table | Guest/canvas host as direct Open3dPlannerHost | Pages use `Open3dPlannerWorkspaceRoute` then Host | `host-wiring-rg.txt`, guest/canvas `page.tsx` | medium (docs stale) |
| X02 | WAVE.md early blockers | Select/delete broken; no browser journey | Browser packs under `03-select-delete/`, `02-browser-open3d-journey/` | WAVE updated section + run.json | medium (stale wave header) |
| X03 | WAVE.md / historical | “no orbit controls” | Orbit default ON `ThreeLazyViewer` / `orbitDefaults` | `w4-orbit-view-rg.txt` | medium |
| X04 | Archive fabric README | Fallback fabric routes still product | Permanent redirect `/planner/fabric*` → open3d | `fabric-redirect-and-archive-rg.txt`, next.config | high if believed |
| X05 | P0 “DONE” phrasing | Spine = ship quality | ayushdocs honesty: spine not ship | `04-HONEST-QUALITY.md` | high process |
| X06 | Save UI “Saved” | Implies cloud | Local IDB + honest labels | `workspaceStatusLabels`, W6 evidence | medium (mitigated) |
| X07 | Mesh “product ready” | Photoreal furniture | Box multiparts + legs; cabinet-v0 toe/carcass/door | mesh NOTES residual | low if honest |
| X08 | Dual 2D engines live | Hybrid Fabric+Feasibility product | Flag OFF default; one interactive path | `fabricFurnitureFlag.ts` | high if agents thrash |
| X09 | CP tables OPEN forever | No progress | TRUTH-LOCK + evidence folders | `TRUTH-LOCK.md`, CHECKPOINTS | medium process |
| X10 | Entity IDs random | plc-/Math.random | `newEntityId` crypto UUID | code path | low (fixed) |

Minimum topics covered: Fabric redirect, orbit, save honesty, select-delete, P0 vs ship, engines.
