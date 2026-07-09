# P0.2 UI wire — modular GLB place in open3d inventory

## Result: DONE

### Routing (pure helper — unit tested)

`shouldPlaceModularWithGeneratedGlb(item)` → **true** only when catalog `id` or `slug` is `cabinet-v0`.

- Does **not** gate on `geometryMode` alone (future modular SKUs stay procedural place).
- No `DEV_MODULAR_GLB_PLACE` env flag; demo SKU is always-on write path.

### Place path

| Item | Path |
|------|------|
| `cabinet-v0` | `placeModularWithGeneratedGlbBrowser` → G5 export → `POST /api/planner/generated-glb` → stamp `generatedGlbUrl` |
| Everything else | `placeCatalogItemInProject` (unchanged procedural) |

Node helper `placeModularWithGeneratedGlbPlan` still used by unit tests/scripts (direct disk write). Client cannot import it cleanly because `writeGeneratedGlbToPublic` uses `node:fs`.

### Failure behavior

- Write API failure → furniture placed, **unstamped** (procedural mesh; no G8 404 thrash).
- Thrown export/place → procedural `placeCatalogItemInProject` fallback + console.warn.

### Evidence

- `vitest-raw.log` — 22 passed
- `run.json` — machine summary
