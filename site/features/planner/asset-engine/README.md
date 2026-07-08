# Asset engine skeletons (SVG + mesh/GLB)

**Honesty first.** This folder orders the hard spine. Status is tracked in `stages.ts`.

## SVG making (order)

| # | Stage | Status |
|---|--------|--------|
| S0 | Validate Zod BlockDescriptor | partial |
| S1 | **Normalize** depth→height, variant→boolean | **implemented** |
| S2 | Compile → SVG string | partial (live = `pipelineCore`; V1 = tests only) |
| S3 | Sanitize + optimise | partial (dual stacks) |
| S4 | Write `public/svg-catalog/{slug}.svg` | implemented |
| S5 | PNG thumbs | stub (URL only on publish) |
| S6 | Persist descriptor (fail-closed after compile) | implemented (disk) |
| S7 | Catalog consume | partial |

**Entry for ordered compile (no I/O):** `runSvgCompileStages(rawDescriptor)`.

**Dual compiler debt (not fixed yet):**  
Publish → `generate-svg.mjs` → `pipelineCore`.  
`svgCompiler.server.ts` (V1) is a second compiler used by tests/artifacts — **not** the live publish authority. Unifying them is a later slice, not claimed done.

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
| G8 | Viewer load generated GLB URL | **planned** (viewer is procedural today) |

**Entry for modular chain:** `runModularMeshStages(options?)`.

## What is still NOT true

- Admin disk `BlockDescriptor` and CLI fixtures are different shapes — S1 bridges compile, not schema unification.
- Open3d 3D **does not load** `glbUrl` / `meshUrl`; it rebuilds procedural mesh.
- Supabase persist / CDN upload of modular GLB is not wired as automatic publish.
- Full parametric component library (L/U, hardware) is not this skeleton.

## Tests

- `site/tests/unit/features/planner/asset-engine/`
