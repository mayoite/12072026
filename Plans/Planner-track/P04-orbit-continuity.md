# P04 — Orbit continuity (W4)

**Status:** OPEN / REPROVE — not complete. Old `04-orbit-continuity/` packs are clues only.

**Gate:** **W4** / CP-04 — 2D↔3D preserves **entity pose**; **orbit ON by default** with explicit workspace wiring + browser proof.  
**Evidence:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Buyer places in 2D, toggles 3D, same **ids + mm + rotation**; orbit works immediately; console clean on toggle.

**Out of scope:** Mesh (P08) · save (P06) · select/delete (P03) · Fabric cutover · first-person · camera bookmarks · R3F rewrite · legacy J4 e2e as W4 proof.

---

## Architecture

```
Open3dProject (UUID, mm) = sole pose authority
  → 2D: FeasibilityCanvas (viewMode === "2d")
  → 3D: Lazy3DViewer → ThreeViewerInner
        + buildOpen3dSceneNodes → meshes userData.entityId
        + OrbitControls when enableControls === true
        + data-orbit-enabled on three-viewer-container
```

**Three-layer orbit rule (all required):**  
(1) Lazy+Inner defaults ON · (2) workspace **must** pass `enableControls={true}` (omit = gap) · (3) `data-orbit-enabled` + unit construct-spy. Layer-1 alone ≠ W4.

**Pose:** Document only; double rebuild deep-equal ids / xMm / yMm / rotation. Mesh `rotation.y = -node.rotation` is intentional plan-Y→world-Z, not drift. Stay imperative Three.

**Anti-J4:** TopBar radio 2D|3D; `planner-3d-canvas` is a **div** — do not copy legacy button/split/middle-drag specs.

---

## Touch list

| Role | Path |
|------|------|
| Workspace | `OOPlannerWorkspace.tsx` — explicit `enableControls={true}` |
| Lazy / Inner | `ThreeLazyViewer.tsx` · `ThreeViewerInner.tsx` |
| Pose map | `buildOpen3dSceneNodes.ts` (+ types) |
| Units | pose-continuity · orbit-default · adapter-regression under open3d tests |
| E2E | `open3d-w4-orbit-continuity.spec.ts` or W4 block in journey spec |

---

## Kill order (unchecked)

- [ ] Evidence dir + NOTES (HEAD, Approach A, three-layer baseline)
- [ ] RED→GREEN unit: pose continuity (incl. double rebuild)
- [ ] RED→GREEN unit: orbit default ON + construct when enabled + `data-orbit-enabled`
- [ ] Workspace explicit `enableControls={true}` (or shared control props helper)
- [ ] Adapter / entity-id regression green; logs under `04-orbit-continuity/`
- [ ] Playwright (or chrome-devtools): radio toggle + left-drag orbit + console clean; shots 01–03 + `browser-run.json`
- [ ] No competitor assets; Three MIT OrbitControls only

**Acceptance:** ids stable · pose match · orbit ON (default + workspace + DOM) · drag without crash · console clean.

**W4 red until** unit **and** browser artifacts (or owner WAIVE browser only in CHECKPOINTS).  
**Next:** [P05](./P05-symbols-svg.md) after CP-04.
