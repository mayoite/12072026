# Project placement catalog + SVG

Placement catalog and SVG pipeline for the **live** planner host (`features/planner/project/`).

| Concern | Location |
|---------|----------|
| Descriptor load | `svg/svgBlockDescriptorLoader.ts` → `inventory/descriptors/` |
| Sanitize (validate) | `svg/svgSanitizer.ts` |
| Server sanitize/optimize | `svg/svgServerSanitizer.ts` |
| Compile | `svg/` + `features/planner/asset-engine/` |

Do not load from a `inventory/descriptors/` path (removed).

Tests: `tests/unit/features/planner/project/catalog/` and related `catalog-api` / asset-engine suites.
