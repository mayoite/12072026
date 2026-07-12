# P04 — Orbit continuity (W4)

**Status:** REPROVE — orbit wiring and 2026-07-11 evidence exist. Browser proof was count/orbit-attribute only; exact pose IDs remain unit-only.

**Gate:** **W4** / CP-04 — 2D↔3D preserves **entity pose**; orbit ON with explicit workspace wiring + browser proof.  
**Evidence:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Place in Fabric 2D → toggle 3D → same ids + mm + rotation; orbit works; console clean.

**Out of scope:** Mesh (P08) · save (P06) · select (P03) · first-person · camera bookmarks · R3F rewrite · adding a second plan host · legacy J4 e2e as W4 proof.

---

## Architecture (upgrade)

```
Open3dProject (UUID, mm) = sole pose authority
  → 2D: PlannerCanvasStage (Fabric) when viewMode === "2d"
  → 3D: Lazy3DViewer → ThreeViewerInner
        + buildOpen3dSceneNodes → meshes userData.entityId
        + OrbitControls when enableControls === true
        + data-orbit-enabled on three-viewer-container
```

**Pose:** Document only. Mesh `rotation.y = -node.rotation` intentional. Stay imperative Three.

**Anti-J4:** TopBar radio 2D|3D; `planner-3d-canvas` is a **div**.

---

## Live truth (code raised — re-prove evidence)

| Layer | Status |
|-------|--------|
| (1) Lazy+Inner default ON | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` |
| (2) Workspace wiring | `{...getOpen3dViewerControlProps()}` on `Lazy3DViewer` — **landed** |
| (3) `data-orbit-enabled` | On `ThreeViewerInner` |
| 2D side of toggle | Fabric stage only — keep it |
| Units | `poseContinuityW4` · `orbitControlsDefault` · `workspaceOrbitWiring` |
| E2E | `open3d-w4-orbit-continuity.spec.ts` |
| Old gap | “workspace omits enableControls” — **fixed**; do not re-implement as if missing |

---

## Kill order (unchecked)

- [ ] Re-run pose + orbit + wiring vitest → `04-orbit-continuity/`
- [ ] Confirm three-layer still green (NOTES) — Fabric-sole path only
- [ ] Browser: radio toggle + left-drag + console clean; shots + `browser-run.json`
- [ ] Honesty: count-only browser ≠ id/pose proof
- [ ] No competitor assets · no engine rollback

**W4 red until** fresh unit **and** browser (or owner WAIVE browser in CHECKPOINTS).  
**Next (sequence):** [P05](./P05-symbols-svg.md) after CP-04.
