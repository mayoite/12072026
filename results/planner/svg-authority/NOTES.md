# SVG publish authority slice

## Decision (honest, minimal)

| Role | Authority | Entry |
|------|-----------|--------|
| **LIVE publish compile** | `pipelineCore+normalize` | `compileSvgForPublish` → S1 normalize + pipelineCore S2/S3 |
| **Disk write S4** | same normalize path | `generate-svg.mjs` `runPipeline` (already S1) |
| **Admin publish** | gate then write | `publishDescriptorWithPipeline` → compileSvgForPublish then runSvgPipeline |
| **V1 tests** | `v1-reference-only` | `svgCompiler.server.ts` (not deleted) |

## Not claimed

- Full rewrite of V1 `SvgBlockDefinitionV1` into pipelineCore
- Dual sanitizer stack removal (V1 still has DOMPurify path for reference)
- Schema unification of admin BlockDescriptor vs CLI fixtures

## Evidence

- `vitest-authority.log` — 8 files, 41 passed, 0 skipped
- `sanitize-node.log` — 8/8 pass
