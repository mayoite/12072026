# Package pins (P02)

**Source:** `site/package.json` (oando-site)  
**Recorded:** 2026-07-09  
**HEAD:** `6461924b064819e71833ad6a470436a5a2b7c15f`  
**Rule:** Record only. No upgrades/downgrades in P02.

| Package | Declared in package.json | Role |
|---------|--------------------------|------|
| `fabric` | `7.4.0` (exact, no caret) | 2D destination / furniture overlay slice |
| `three` | `^0.185.1` | Planner 3D scene |
| `@react-three/fiber` | `^9.6.1` | R3F ecosystem (stack) |
| `@react-three/drei` | `^10.7.7` | R3F helpers / secondary 3D surfaces |
| `next` | `^16.2.9` | App Router host |

**Not in locked interactive 2D path:** `konva` / `react-konva` — absent from `site/package.json` (2026-07-09 check).

**Not planner workspace 3D:** `@google/model-viewer` `^4.3.1` — admin single-asset only.
