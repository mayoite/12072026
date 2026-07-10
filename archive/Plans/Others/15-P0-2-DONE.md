# P0.2 — modular GLB write + G8 URL load (unit closed)

## Done

| Piece | Status |
|-------|--------|
| `writeGeneratedGlbToPublic` | Writes under `site/public/catalog-assets/generated/` |
| `placeModularWithGeneratedGlbPlan` | place → G5 → **write** → stamp (write fail = no stamp) |
| Default `placeCatalogItemInProject` | Still procedural (no URL) |
| G8 `resolveGeneratedGlbFetchUrl` | Root/absolute origin so loader does not page-relative 404 |
| Tests | `pnpm p0:unit` 67 · `pnpm p0:g8` 67 |

## Residual (not blocking unit claim)

- **Chrome open3d visual smoke** with stamped furniture (manual steps: `results/planner/p0-2-g8-load/MANUAL-open3d.md`)
- ~~Wire product UI button to call modular GLB place (opt-in)~~ **done** — open3d inventory `cabinet-v0` → `placeModularWithGeneratedGlbBrowser` + `POST /api/planner/generated-glb` (evidence `results/planner/p0-2-ui-wire/`)
- Supabase/R2 remote upload — local public write is enough for dev G8

## Next

P0.3 a11y (nested main + hydration) — after optional quick Chrome smoke of P0.2.
