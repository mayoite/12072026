# 01A Benchmark

Date: 2026-07-03

## Sources

- Floorplanner: https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf
- Planner 5D: https://support.planner5d.com/en/articles/5913588-creating-your-first-floor-windows
- AutoCAD Web: https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Hitchhikers-guide-0home/AutoCAD_Web_Help_Hitchhikers_guide_1basics.html
- SketchUp Web: https://help.sketchup.com/en/sketchup-web-shortcuts
- Figma: https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard
- 3D Warehouse: https://help.sketchup.com/en/3d-warehouse/searching-and-downloading-models

## Required standard

- Canvas-first workflow with clear active tool, snap, measurement, and cancel state.
- One typed command system for toolbar, keyboard, menus, and tests.
- Keyboard-equivalent editing and visible focus.
- Searchable, filtered, scalable inventory.
- Responsive desktop/tablet layouts.
- Canonical Oando theme; no donor or competitor visual copying.
- 95% coverage in all four metrics, globally and per file.

## Current failures

- Staging theme is hardcoded.
- Production `any` and ESLint bypasses exist.
- Branch threshold is 90%, not 95%.
- Several commands are stubs.
- Full drawing, 3D, import/export, and persistence workflows remain unverified.
