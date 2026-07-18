# Planner features

**Code map.** Status: `CHECKLIST.md`.

**Roots:** `site/features/planner/` · `site/app/planner/` · `site/app/api/planner/`  
**Host:** `editor/OOPlannerWorkspace.tsx`

| Area | Path |
|------|------|
| Guest / canvas routes | `app/planner/(workspace)/guest/`, `canvas/` |
| Document / units | `model/` (`units.ts`, walls, actions) |
| 2D canvas | `canvas/PlannerFabricStage.tsx` |
| Inventory place | `editor/InventoryPanel.tsx` · `catalog/*` · `resolvePlanSvgUrl.ts` |
| SVG blocks API | `app/api/planner/catalog/svg-blocks/route.ts` |
| Validation / review | `editor/ValidationPanel.tsx` · `ReviewQuotePanel.tsx` · `lib/validation/` |
| BOQ | `shared/export/projectFurnitureBoq.ts` · `brandedPdfExport.ts` |
| Handoff | handoff routes under `app/api/planner/` |
| 3D | `3d/*` · sceneParity |
| Sketch-to-Plan | `ai/sketchToPlan.ts` · `editor/SketchToPlanDialog.tsx` |
| Parametric draw (shared) | `asset-engine/svg/parametric/*` |
