# 06 — Three Reference Blocks End-to-End (1B Proof)

Owner: ______________
Target exit date: ______________
Depends on: 05 complete

## Problem

Reference definitions and compiler tests exist for a fixed table, a configurable door, and a
parametric cabinet, but none has been published end-to-end through the real admin -> planner path.

## Work items (in order)

1. Mount the full `<Puck config onPublish>` editor on /admin/svg-editor/[id] (today: JSON edit +
   Render preview only).
2. Wire `onPublish` to call the unified compile authority from 05, then persist to
   block-descriptors/ (disk) + upload thumbnail to R2.
3. Publish the fixed table block end-to-end; verify it appears correctly in the planner catalog
   and places correctly on the 2D canvas.
4. Repeat for the configurable door/window block, including parameter editing in admin and
   customer-facing parameter exposure in planner.
5. Repeat for the parametric cabinet/furniture family block.
6. Add a reload test: closing and reopening a project preserves the placed block correctly.
7. Capture evidence under results/site/phase-1b/reference-blocks/.

## Exit criteria

- All three reference blocks are published, visible in planner catalog, placeable, and reload-safe.
- Admin draft/preview/publish/validation-failure UX all work without console errors.
