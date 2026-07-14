# Planner catalog-api

Catalog panel, placement bridges, ingest, and resolver surfaces for planner.

## Role

- Not the live canvas host document (`project/` owns that).
- Consumes released inventory; does not own marketing Supabase catalog authority.
- Previews that inject SVG must sanitize (`renderBlockPrims` → `sanitizeInlineSvg`).

## Tests

Name-mirror: `tests/unit/features/planner/catalog-api/`.
