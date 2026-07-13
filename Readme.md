# Oando website and planner

This pnpm workspace contains the Oando website, Admin tools, and customer Planner.

## Product loop

Admin publishes trusted inventory.

Any external customer designs with that inventory.

Planner generates a branded BOQ.

The customer sends the BOQ to Oando.

## Repository

| Path | Purpose |
|---|---|
| `site/` | Next.js product code. |
| `tech-stack-generator/` | Independent Vite documentation tool. |
| `tech-stack-generated/` | Generated data. |
| `tech-stack-docs/` | Generated static documentation site. |
| `plan/` | Admin and Planner execution checklists. |
| `docs/` | Product and architecture reference. |
| `Agents/` | Agent process. |
| `results/` | Raw tool output only. |
| `websites/` | External research reference. |
| `archive/` | Historical reference. |

## Product code

- Routes: `site/app/`.
- Planner: `site/features/planner/`.
- Shared UI: `site/components/`.
- Catalog utilities: `site/lib/catalog/`.
- Platform clients: `site/platform/`.
- Public catalog assets: `site/public/`.

Fabric is the sole interactive 2D canvas.

Three.js provides 3D.

Published SVG is the primary planner symbol.

## Catalog direction

The Products database is the released catalog and SVG authority.

Planner imports released SVG revisions through a server API.

Cloud or object storage is a later migration.

Tests must never mutate the canonical public catalog.

## Start

Read `START.md` for commands.

Read `plan/README.md` for execution.

Read `docs/INDEX.md` for architecture.
