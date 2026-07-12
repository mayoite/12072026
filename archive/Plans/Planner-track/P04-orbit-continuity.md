# P04 — Orbit continuity (W4)

**Status:** **PASS** — agent call 2026-07-12 (owner delegated). Unit pose/orbit/wiring + browser id-set stable 2D↔3D + orbit ON.

**Gate:** **W4** / CP-04 — 2D↔3D preserves **entity pose**; orbit ON with explicit workspace wiring + browser proof.  
**Evidence:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Place in Fabric 2D → toggle 3D → same ids + mm + rotation; orbit works; console clean.

**Out of scope:** Mesh (P08) · save (P06) · select (P03) · first-person · camera bookmarks · R3F rewrite · adding a second plan host · legacy J4 e2e as W4 proof.

---

## Architecture (upgrade)

```
PlannerProject (UUID, mm) = sole pose authority
  → 2D: PlannerCanvasStage (Fabric) when viewMode === "2d"
  → 3D: Lazy3DViewer → ThreeViewerInner
        + buildPlannerSceneNodes → meshes userData.entityId
        + OrbitControls when enableControls === true
        + data-orbit-enabled on three-viewer-container
```

**Pose:** Document only. Mesh `rotation.y = -node.rotation` intentional. Stay imperative Three.

**Anti-J4:** TopBar radio 2D|3D; `planner-3d-canvas` is a **div**.

---

## Live truth (code raised — re-prove evidence)

| Layer | Status |
|-------|--------|
| (1) Lazy+Inner default ON | `PLANNER_ORBIT_DEFAULT_ENABLED = true` |
| (2) Workspace wiring | `{...getPlannerViewerControlProps()}` on `Lazy3DViewer` — **landed** |
| (3) `data-orbit-enabled` | On `ThreeViewerInner` |
| 2D side of toggle | Fabric stage only — keep it |
| Units | `poseContinuityW4` · `orbitControlsDefault` · `workspaceOrbitWiring` |
| E2E | `open3d-w4-orbit-continuity.spec.ts` |
| Old gap | “workspace omits enableControls” — **fixed**; do not re-implement as if missing |

---

## Kill order

- [x] Re-run pose + orbit + wiring vitest → `04-orbit-continuity/`
- [x] Three-layer green (NOTES) — Fabric-sole path only
- [x] Browser: radio toggle + left-drag + orbit attr; shots + `browser-run.json`
- [x] Honesty: browser proves **furniture id set** across 2D↔3D (not count-only); mm/rotation = unit document↔nodes
- [x] No competitor assets · no engine rollback

**PASS** 2026-07-12. Residual: live Three `userData.entityId` not asserted in browser (unit covers rebuild).  
**Next (sequence):** [P05](./P05-symbols-svg.md).
