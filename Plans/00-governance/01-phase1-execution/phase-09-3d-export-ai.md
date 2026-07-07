Execute Phase 09 only.

Primary path focus:
- site/features/planner/open3d/**
- export-related files
- AI advisor / job files
- results/**

Goal:
Ship lazy 3D, export round-trips, and AI sketch-to-plan with explicit preview gating.

Must complete:
- dynamic import for three + @react-three/fiber
- prove 3D code is absent from default 2D load
- export preflight
- SVG/PNG/PDF/DXF round-trip validation
- DXF layer correctness
- ZIP multi-floor export flow
- AI scale calibration before submit
- preview -> confirm -> commit flow
- background jobs with cancel
- server-only API keys

Check IDs:
- 09-3D-01
- 09-EXP-04
- 09-AI-03

Constraints:
- one AI job model
- no client key leakage
- do not claim unsupported formats
- maintain performance and security gates

Return exactly:
1. Scope executed.
2. Files changed.
3. Checks run.
4. Evidence paths.
5. Gate result by check ID.
6. Status recommendation.
7. Open blockers.
8. Next smallest safe slice.
