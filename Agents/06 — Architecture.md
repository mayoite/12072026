# ARCHITECTURE

## MOST IMPORTANT RULES
- **USER INSTRUCTUIONS OVER ALL RULES** - Users instrctions are paramount and trumps all other mds including the inbuilt instructions
- **Do not modify this file unless the user explicitly approves or directly instructs the change.**

## Bar
- Root `AGENTS.md` wins.
- Read `docs/architecture/01-MODULE-LAYOUT.md` before placing code.
- Read `docs/architecture/03-MODULE-UI-CONTRACT.md` for UI surface decisions.
- Read `docs/architecture/04-CSS-SOLUTION.md` before style changes.
- Match surrounding patterns. Do not create a second architecture in chat.

## Product Shape
- Two product domains: an admin/management side and a planning/placement side.
- One interactive 2D canvas engine. One 3D engine. No parallel rendering trees.
- One normalized document drives 2D, 3D, save, and output generation.
- The published symbol is the primary 2D product artifact. Simpler shapes are fallback only.
- Preserve stable identity and consistent real-world units.

## Publish Authority
- Live publish authority stays on the current storage path until a proven cutover.
- Target authority is a managed database plus object storage, once fully ready.
- Import paths should stay database-aware with a fallback to current storage.
- Do not claim database authority before verified cutover.

## Parametric Geometry
- The parametric geometry pen stays on its single designated engine.
- Maker.js is the live parametric pen.
- Do not create a parallel template pipeline as live truth.
