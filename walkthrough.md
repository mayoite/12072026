# Plan A — Reality Check Walkthrough

## What Was Wrong (and Fixed)

### 1. Module Map Was Incomplete
**Before:** Only showed `open3d/` internals (19 lines)  
**Reality:** `features/planner/` has **21 subdirectories** including `admin/`, `ai/`, `onboarding/`, `landing/`, `help/`, `portal/`, `templates/`, `shared/` (with `boq/`, `catalog/`, `export/`, etc.), `3d/`, `ui/`, and `_archive/`  
**Fixed:** Expanded map to show the full planner tree with annotations

### 2. Phase 1 Claimed "COMPLETED" With Evidence
**Before:** "Evidence in `results/planner/phase-1a/` and `results/planner/phase-1b/`"  
**Reality:** These directories **do not exist**. `site/results/` only contains audit CSVs (hardcoded-audit, fixed-containers, text-alignment). No phase-specific evidence was generated.  
**Fixed:** Changed to "PARTIALLY COMPLETED" with evidence gap warning

### 3. Missing File in SVG Editor Listing
**Before:** 16 files listed  
**Reality:** 17 files exist — `svgRevisionRepository.server.ts` was missing from the listing  
**Fixed:** Added to the file tree

### 4. Product Summary Was Too Terse
**Before:** Two bullet points  
**Fixed:** Expanded to step-by-step descriptions of what customers, admins, and the server actually do

### 5. Pipeline Had No Explanation
**Before:** A 3-line code block  
**Fixed:** Added step-by-step pipeline walkthrough with timing estimates, plus explanation of why "Option A" was chosen over the other 4 options from the earlier discussion

### 6. No Explanation of Product Types
**Before:** Phase 2C listed 3 product pipelines with no context  
**Fixed:** Added a "Product Types — Why Three Pipelines?" section with a comparison table explaining parametric vs static vs extruded, and why thousands of `.glb` uploads aren't viable

### 7. The Fabric Confusion Was Not Explained
**Before:** One line mentioning Fabric  
**Fixed:** Added dedicated section explaining the two meanings (npm package vs route), current status of each, and naming convention going forward

### 8. Canvas Risk Not Documented
**Before:** Just "pure Canvas 2D API"  
**Fixed:** Added risk callout explaining that the 1075-line canvas is fragile, has no built-in interaction tools, and why any change MUST include tests

### 9. Archive Path Inconsistent
**Before:** Referenced `archive/plans-v1/` (without date)  
**Fixed:** Consistently references `archive/plans-v1-2026-07-08/` (the actual directory)

### 10. Archive Task Still Marked TODO
**Before:** Phase 4.3 had "Archive old plan files" as unchecked  
**Fixed:** Marked `[x]` with date — already done

### 11. No Package Version Reference
**Before:** Package Ownership tables listed packages without versions  
**Fixed:** Added complete Appendix with every relevant package, its exact version, purpose, and what code uses it — including dead packages marked with ❌

## What Was Already Correct

- Live routes table ✅
- All 17 svg-editor files exist on disk ✅  
- `@puckeditor/core` confirmed in `package.json` (line 144) ✅
- `vaul`, `sonner`, `zustand`, `zundo`, `react-resizable-panels` all confirmed ✅
- Dead dependency analysis (svgdotjs × 3, html-to-image) ✅
- `lint:ui:strict` script exists (lines 21-22 of `package.json`) ✅
- `executePlannerCommand` exists in `lib/commands/plannerCommand.ts` ✅
- `FeasibilityCanvas.tsx` uses Canvas 2D API, not Fabric.js ✅
- `parametricBuilder.ts` exists and is used by FeasibilityCanvas ✅

## Final State

[PLAN-A.md](file:///d:/OandO07072026/Plans/01-execution/core/PLAN-A.md) — 691 lines, fully reality-checked.
