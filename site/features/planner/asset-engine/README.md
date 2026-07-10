# Asset engine skeletons (SVG + mesh/GLB)

**Honesty first.** This folder orders the hard spine. Status is tracked in `stages.ts`.

## SVG making (order)

| # | Stage | Status |
|---|--------|--------|
| S0 | Validate Zod BlockDescriptor | partial |
| S1 | **Normalize** depth→height, variant→boolean | **implemented** (publish authority) |
| S2 | Compile → SVG string | **implemented** (publish = `pipelineCore`) |
| S3 | Sanitize + optimise | **implemented** (publish path in pipelineCore) |
| S4 | Write `public/svg-catalog/{slug}.svg` | implemented |
| S5 | PNG thumbs | stub (URL only on publish) |
| S6 | Persist descriptor (fail-closed after compile) | implemented (disk) |
| S7 | Catalog + inventory consume SVG URL | **implemented** (place stamps `previewImageUrl`; canvas draw still Block2D) |

### Publish authority (single)

**`pipelineCore+normalize`** — see `svg/compileAuthority.ts`.

| Role | Entry |
|------|--------|
| **THE publish compile API (no I/O)** | `compileSvgForPublish(raw)` → `runSvgCompileStages` |
| Normalize (S1) | `normalizeDescriptorForPipeline` |
| Compile + sanitize (S2/S3) | `scripts/generate-svg/pipelineCore.ts` |
| CLI / admin write (S1–S4) | `generate-svg.mjs` `runPipeline` (already normalizes) |
| Admin wire | `publishDescriptorWithPipeline` → `compileSvgForPublish` then `runSvgPipeline` |

**V1 retained (not deleted):** `svgCompiler.server.ts` exports `compileAuthority: "v1-reference-only"`. Used by V1 unit/golden tests only — **not** on the publish wire. Full rewrite of V1 into pipelineCore is out of scope for this slice.

## Mesh / GLB making (order)

| # | Stage | Status |
|---|--------|--------|
| G0 | Policy (no designer static GLB) | policy-only |
| G1 | Structured options | partial (cabinet-v0) |
| G2 | 2D footprint | implemented |
| G3 | Runtime THREE mesh | partial (modular + box) |
| G4 | Pure part plan | implemented |
| G5 | **Binary GLB** (in-memory) | **implemented** |
| G6 | Validate GLB | implemented (on export) |
| G7 | SVG extrude admin | partial (island) |
| G8 | Viewer load generated GLB URL | **partial** (async policy URL; procedural default / fallback) |

**Entry for modular chain:** `runModularMeshStages(options?)`.

## What is still NOT true

- Admin disk `BlockDescriptor` and CLI fixtures are different shapes — S1 bridges compile, not schema unification.
- Open3d 3D **does not load** `glbUrl` / `meshUrl`; it rebuilds procedural mesh.
- Supabase persist / CDN upload of modular GLB is not wired as automatic publish.
- Full parametric component library (L/U, hardware) is not this skeleton.
- V1 `SvgBlockDefinitionV1` is not rewritten into pipelineCore (reference-only).

## CLI smoke (fixtures only)

Deterministic batch — **only** `scripts/generate-svg/_fixtures/*.json` (sorted). Does **not** run `block-descriptors/` admin seeds (avoids unpredictable catalog overwrites).

| Command (from `site/`) | Scope |
|------------------------|--------|
| `pnpm run scripts:smoke:svg` | single fixture (`chaise.json`) |
| `pnpm run scripts:smoke:svg:batch` | all `_fixtures/*.json` via `scripts/smoke-svg-fixtures.mjs` |
| `pnpm run scripts:generate-svg -- path/to/descriptor.json` | one arbitrary descriptor |

## Tests

- `site/tests/unit/features/planner/asset-engine/`

## Canvas vs publish SVG (P05 honesty)

| Surface | Authority today | Entry |
|---------|-----------------|-------|
| open3d plan furniture symbols | **Block2D prims** (top-left; canvas centers) | `furnitureBlock2DFromItem` → `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| Admin/CLI published SVG files | **pipelineCore+normalize** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| Portal preview | Published SVG URL | `/portal/svg-catalog` |

W2 acceptance is **Block2D readable**, not “SVG path drawn as Feasibility prims.”
**S7 (implemented):** catalog/API + inventory show `previewImageUrl` under `/svg-catalog/{slug}.svg`;
`placeCatalogItemInProject` stamps that URL onto the placed furniture entity.
Evidence: unit `s7CatalogConsume.test.ts` + CP-05 browser pack under `05-symbols-svg/`.
`furnitureBlockUsesCenteredPath` is always `false` (prims top-left; canvas centers).

