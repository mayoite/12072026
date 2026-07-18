# TechStack checklist

**Status:** OPEN  
**Code map:** `FEATURES.md`  
**Blockers:** `../../Failures.md`  
**Notes (not proof):** `../../agent-reports/TECH-STACK.md`  
**Engines fact:** `docs/Lockedfiles/03-dependencies-engines-current.md` (lockfile wins for versions)

## Outcome

Installable, releasable monorepo: one pnpm root install, honest gates, singular engines.

## Rules

- pnpm from **repo root only**. Never install inside `site/` or `tech-docs-generator/`.
- Node ≥24 · `packageManager` pnpm@11.13.0 · Corepack; CI must not dual-pin.
- Fabric = only interactive 2D. No second canvas engine.
- Secrets: `.env.local` / platform only.
- Status: **OPEN** · **PARTIAL** · **PASS** · **FAIL**. Fresh command wins.

## Open now (important)

| Item | Status |
|------|--------|
| Full `release:gate` green | OPEN / not claimed |
| Full lint / typecheck / test as release claim | OPEN |
| DB-SVG cutover (product; disk live) | OPEN — `Failures.md` |
| Nested-install / phantom dep residual | OPEN residual |

## Engines (live)

| Role | Engine |
|------|--------|
| Planner 2D | Fabric |
| 3D | Three + R3F + Drei |
| Admin SVG draft | Excalidraw embed |
| Parametric geometry | `draw*(fields)` / Maker-compatible paths |
| Site i18n | next-intl (marketing only) |

## Phases (short)

| Area | Status |
|------|--------|
| Install / workspace / layout gate | PARTIAL |
| CI pins aligned | PARTIAL |
| Lint / typecheck / test / build | OPEN as full release |
| Secrets lint | PARTIAL |
| Env names vs `.env.example` | PARTIAL |

## Not this track

Site copy · Planner features · Admin product UX.
