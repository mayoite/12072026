# Stale scripts audit

Generated: 2026-07-09T14:55:55.917Z

## Packages present?

- **tldraw**: **NO**
- **konva**: **NO**
- **nova-act**: **NO**
- **fabric**: yes
- **three**: yes
- **@playwright/test**: yes
- **ts-morph**: yes

## Feature dirs present?

- **features/planner/tldraw**: **MISSING**
- **features/planner/open3d**: yes
- **features/buddy-planner**: **MISSING**
- **features/oando-planner**: **MISSING**
- **features/ops-portal**: **MISSING**
- **lib/configurator**: yes
- **public/tldraw-assets**: **MISSING**
- **block-descriptors**: yes
- **lib/db.ts**: **MISSING**

## Dead hard-coded routes (no page.tsx)

- `/configurator/guest`
- `/buddy-planner`
- `/buddy-planner/editor`
- `/buddy-planner/guest`

## Scripts with issues (0 / site 168 + root 4)

## Broken package.json script targets

- (none)

## Notes

- Fabric canvas-audit / debug-* scripts stay valid when **fabric** package is present.
- `generate-route-classification.mjs` may list legacy redirects on purpose (not flagged).
- Prefer **archive** over delete per AGENTS.md.
- Sweep report: `results/site/scripts-audit/SCRIPTS-SWEEP-2026-07-09.md`
