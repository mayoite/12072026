# Plans

Date: 2026-07-07

**Agent conduct:** [`AGENTS.md`](AGENTS.md) — sole authority. This file routes planner work only; it does not override `AGENTS.md`.

**Repo facts:** [`Readme.md`](Readme.md) · **Commands:** [`START.md`](START.md) · **Blockers:** [`Failures.md`](Failures.md)

---

## Rules (from `AGENTS.md`)

Apply on every planner slice:

- One phase or one tight slice per task unless the user asks for more
- Smallest change; ask if scope grows; no commit/push without ask
- **Verify:** targeted Vitest for touched files; typecheck when in scope; `curl` → `results/<module>/<phase>/<cmd>/`
- **Do not** after each phase: full `pnpm run test`, `test:coverage`, Playwright/E2E, `release:gate` (user/release-gate only — `0413`, `0408`, `0412`)
- Skipped checks → say skipped; max `Implemented, verification pending` without live proof
- Log blockers in `Failures.md`

---

## Execution order

1. [`AGENTS.md`](AGENTS.md)
2. This file
3. [`Plans/00-governance/01-phase1-execution/00-governance-checklist.md`](Plans/00-governance/01-phase1-execution/00-governance-checklist.md) — check IDs + status
4. Phase plan:
   - **00–03** → [`02-plan-foundation.md`](Plans/00-governance/01-phase1-execution/02-plan-foundation.md)
   - **04–07** → [`03-plan-delivery.md`](Plans/00-governance/01-phase1-execution/03-plan-delivery.md)
   - **08–10** → [`04-plan-closeout.md`](Plans/00-governance/01-phase1-execution/04-plan-closeout.md)
5. Pins → [`01-implementation-decisions.md`](Plans/00-governance/01-phase1-execution/01-implementation-decisions.md)

File map: [`00-handover-routing.md`](Plans/00-governance/01-phase1-execution/00-handover-routing.md) · folder index: [`Plans/README.md`](Plans/README.md)

---

## Status vocabulary

`Planned` · `Implemented` · `Verified in staging` · `Promoted` · `Verified in production path` · `Piloted` · `Accepted` · `Deferred/blocked`

---

## Slice report

1. Scope · 2. Files · 3. Checks run · 4. Evidence paths · 5. Gate by check ID · 6. Status · 7. Blockers · 8. Next slice

---

## `Plans/` layout

| Folder | Role |
|--------|------|
| [`00-governance/`](Plans/00-governance/) | Pins, phase plans, benchmarks, gates |
| [`01-execution/`](Plans/01-execution/) | Day-to-day work · live status in `01-execution/core/04-HANDOVER.md` |
| [`archive/`](archive/Plans/) | Historical specs (immutable) |

---

## Canonical code paths

| What | Where |
|------|--------|
| Open3D production | `site/features/planner/open3d/` |
| BlockDescriptor | `site/features/planner/open3d/catalog/svg/svgTypes.ts` |
| Puck registry | `site/features/planner/admin/svg-editor/puckBlockRegistry.tsx` |
| Portal alias | `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts` |

Not production: `open3d-floorplan/` · `OOPlanner/` · `open3d-next-staging/`
