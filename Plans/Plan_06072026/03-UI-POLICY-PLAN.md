# 03 — Planner UI Policy Enforcement (P1)

Owner: ______________
Target exit date: ______________
Depends on: 02 complete
[PARALLEL-OK with 04 once 02 is done]

## Problem

Planner chrome is supposed to be Phosphor-icon-only. Tool rail and top bar are converted, but
`inventoryTaxonomy.ts` still uses emoji/unicode icons. Bottom command/status surface, command
palette (Ctrl/Cmd+K), and the 24-item catalog search cap are also missing.

## Work items (in order)

1. Replace all emoji/unicode icons in `inventoryTaxonomy.ts` with Phosphor equivalents.
2. Add `open3dIconPolicy.test.ts` (red first) that fails if any non-Phosphor icon glyph is
   referenced anywhere under features/planner/open3d/.
3. Build the bottom command/status surface component (REC-03) and wire it into the workspace shell.
4. Build the command palette (Ctrl/Cmd+K) with at minimum: switch tool, undo/redo, save, toggle 2D/3D.
5. Cap catalog search results at <=24 items (REC-02); add a regression test asserting the cap.
6. Capture evidence under results/site/phase-1a/ui-policy/.

## Exit criteria

- `open3dIconPolicy.test.ts` passes with zero exceptions.
- Bottom command surface and command palette are reachable and keyboard-operable.
- Catalog search never returns more than 24 items in the test fixture set.
- `lint:ui:strict` passes on planner routes (not yet required in release:gate:fast — see 07).
