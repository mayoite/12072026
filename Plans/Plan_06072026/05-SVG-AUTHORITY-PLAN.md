# 05 — Single SVG Compile Authority (P0 for 1B)

Owner: ______________
Target exit date: ______________
Depends on: 02, 04 complete

## Problem

Two SVG compile paths exist: the exec script (generate-svg.mjs) and the in-process compiler
(svgCompiler.server.ts). Two authorities means two places a bug or a policy violation can hide.

## Work items (in order)

1. Decide which is canonical: recommend `svgCompiler.server.ts` as the single in-process module,
   with generate-svg.mjs reduced to a thin CLI wrapper that calls the same module.
2. Move all normalization, sanitization (DOMPurify), SVGO config, resvg, and Sharp calls behind
   one function signature used by both the API route and the CLI.
3. Add a determinism test: identical descriptor input produces byte-identical canonical SVG output,
   run through both entry points (API and CLI), asserting equal output.
4. Add malicious-SVG fixture tests that must fail before persistence or rendering.
5. Remove `@svgdotjs/*` from site/package.json once import-graph confirms zero usage.
6. Capture evidence under results/site/phase-1b/svg-authority/.

## Exit criteria

- Only one module contains SVG compile/sanitize/optimize/render logic.
- Determinism test passes across both entry points.
- Security fixture suite passes.
- `@svgdotjs/*` is removed from package.json and lockfile.
