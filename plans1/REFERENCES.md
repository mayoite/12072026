# REFERENCES — source path map for plans1

**Package:** `D:\OandO07072026\plans1\`  
**Rule:** Live repo wins over plan PASS prose. Brainstormer reports live under **`archive/Idiots2/`** (root `Idiots2/` absent).

---

## Package docs

| Doc | Path |
|-----|------|
| Index | `plans1/README.md` |
| Session zero | `plans1/00-START.md` |
| Master plan | `plans1/EXECUTABLE-PLAN.md` |
| P11 gate | `plans1/P11-CHECKLIST.md` |
| Justifications | `plans1/CHANGES-JUSTIFICATION.md` |
| Flat board | `plans1/CHECKLIST-MASTER.md` |
| This file | `plans1/REFERENCES.md` |

---

## idiotplanners (primary input set)

| Phase | Plan | Code review |
|-------|------|-------------|
| README | `idiotplanners/README.md` | — |
| P01 | `idiotplanners/P01-product-truth/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P02 | `idiotplanners/P02-engine-lock/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P03 | `idiotplanners/P03-select-delete/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P04 | `idiotplanners/P04-orbit-continuity/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P05 | `idiotplanners/P05-symbols-svg/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P06 | `idiotplanners/P06-save-honesty/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P07 | `idiotplanners/P07-draw-place-journey/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P08 | `idiotplanners/P08-mesh-quality/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P09 | `idiotplanners/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |
| P10 | `idiotplanners/P10-evidence-handover/IMPLEMENTATION-PLAN.md` | `…/CODE-REVIEW-REPORT.md` |

**Do not edit** these from plans1 execution unless owner asks.

Secondary (not authority for this package): `idiotplanners2/P0X-*/IMPLEMENTATION-PLAN.md`

---

## Brainstormer reports (Idiots2 wave)

| Phase | Live path |
|-------|-----------|
| Wave index | `archive/Idiots2/README.md` |
| P01–P10 REPORT | `archive/Idiots2/P0X-<slug>/REPORT.md` |

Older wave (do not use as primary unless owner): `archive/Idiots/P0X-*/REPORT.md`

---

## Live Plans authority

| Doc | Path |
|-----|------|
| Kill order index | `Plans/INDEX.md` |
| Plans entry | `Plans/README.md` |
| Phase folders | `Plans/phases/P0X-*/` |
| Expert merge | `Plans/phases/EXPERT-PASS.md` |
| Evidence folder lock | `Plans/Research/RESULTS-MAP.md` |
| Research map | `Plans/Research/RESEARCH-MAP.md` |
| Owner-style notes (moved) | `Plans/Research/Others/*` (not W proof) |

**Dead paths (do not write evidence here):** `Plans/trustdata/`, root `ayushdocs/`, `checkpoints/CHECKPOINTS.md` at old locations.

---

## Evidence (canonical)

Root: `results/planner/world-standard-wave/`

| Phase | Folder |
|-------|--------|
| P00 | `00-start/` |
| P01 | `00-product-truth/` |
| P02 | `01-engine-lock/` |
| P03 | `03-select-delete/` |
| P04 | `04-orbit-continuity/` |
| P05 | `05-symbols-svg/` |
| P06 | `06-save-honesty/` · W5: `06-save-honesty/save-reload/` |
| P07 | `02-browser-open3d-journey/` |
| P08 | `08-mesh-quality/` |
| P09 | `09-shortcuts-chrome/` |
| P10 | `10-handover/` |

**Forbidden canonical names:** `01-product-truth/`, `02-engine-lock/`, `08-shortcuts-chrome/`, `07-mesh-quality/`.

Optional historical recover:  
`E:\OandO-backups\trustdata-2026-07-10\results-world-standard-wave\` (flat name — remap before use).

---

## Product anchors (open3d)

| Concern | Path |
|---------|------|
| Feature root | `site/features/planner/open3d/` |
| 2D canvas | `…/canvas-feasibility/FeasibilityCanvas.tsx` |
| Workspace | `…/editor/OOPlannerWorkspace.tsx` |
| Keyboard | `…/editor/useWorkspaceKeyboard.ts` |
| Tool maps | `…/editor/canvasTool.ts` |
| Tool rail | `…/editor/CanvasToolRail.tsx` |
| Delete pure | `…/editor/workspaceEntityHelpers.ts` |
| Status labels | `…/editor/workspaceStatusLabels.ts` |
| Pick furniture | `…/lib/geometry/canvasPicking.ts` |
| Orbit defaults | `…/3d/orbitDefaults.ts` |
| 3D viewer | `…/3d/ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` |
| Scene nodes | `…/3d/buildOpen3dSceneNodes.ts` |
| Mesh factory | `…/3d/createSceneObjectFromNode.ts` |
| Fabric flag | `…/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Autosave hook | `…/persistence/useOpen3dWorkspaceAutosave.ts` |
| IDB saver | `site/features/planner/persistence/persistence.ts` |
| Block2D | `…/catalog/furnitureBlock2D.ts` |
| Mesh cabinet | `…/catalog/modularCabinetV0.ts` |
| Help | `site/features/planner/help/helpSections.ts` |
| Hosts | `site/features/planner/ui/Open3dPlannerHost.tsx`, `Open3dPlannerWorkspaceRoute.tsx` |
| Guest page | `site/app/planner/(workspace)/guest/page.tsx` |
| Redirects | `site/config/build/next.config.js` |

---

## Tests (key)

| Suite | Path |
|-------|------|
| W3 pure delete | `site/tests/unit/features/planner/open3d/…/applySelectionDelete.test.ts` |
| W3 pick | `…/geometry/canvasPicking.test.ts` |
| W3 keyboard | `…/open3dWorkspaceKeyboard.test.tsx` |
| W4 orbit | `…/orbitControlsDefault.test.tsx` |
| W4 pose | `…/poseContinuityW4.test.ts` |
| W2 symbols | `…/catalog/furnitureBlock2D.cabinet-v0.test.ts` + `…/renderBlock2DToCanvas.test.ts` |
| W5 continuity unit | `…/saveReloadContinuity.test.ts` |
| W7 mesh | `…/modularCabinetV0.test.ts` + GlbExport |
| W8 shortcuts | `toolShortcutTruth.test.ts` + keyboard + rail a11y + donorParity |
| Journey e2e | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| W3 e2e | `site/tests/e2e/open3d-w3-select-delete.spec.ts` |
| W4 e2e | `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` |
| W5 e2e | `site/tests/e2e/open3d-save-honesty.spec.ts` |
| Helpers | `site/tests/e2e/plannerCanvasHelpers.ts` |
| World pack gate | `site/config/build/playwright-open3d-world-specs.json` |

---

## Conduct / ops

| Doc | Path |
|-----|------|
| Workspace constitution | `AGENTS.md` |
| Head bar | `Agents/Agents-ELON-STANDARD.md` |
| Start commands | `START.md` |
| Repo facts | `Readme.md` |
| Testing evidence | `testing-handbook.md` |
| Failures | `Failures.md` |
| Layout check | `scripts/check-repo-layout.mjs` · `pnpm run check:layout` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |

---

## Git facts (synthesis-time; re-check on execute)

| Fact | Value |
|------|-------|
| Delete results commit | `a98e29f` chore: delete results/ folder |
| Historical handover pack | e.g. `638b86a` (GATE PASS without full re-run — false-green caution) |
| Review docs land | `cb62c4e` (approx at package write) |
