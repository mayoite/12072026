# 06 — SVG Compile Authority

Status: P0 for 1B.
Owner: __________
Exit date: __________
Depends on: 03, 04

## Goal

Unify the dual SVG compile path into one real authority.

## Tasks

1. Choose `svgCompiler.server.ts` as canonical, unless code inspection proves the script is more complete.
2. Convert `generate-svg.mjs` into a thin wrapper around the canonical module.
3. Move sanitize, optimize, render, and thumb generation through one function path.
4. Add determinism tests so API and CLI output match for identical inputs.
5. Add malicious fixture tests for executable or unsafe SVG input.
6. Remove `@svgdotjs/*` if unused after graph confirmation.

## Exit criteria

- One compile authority exists.
- Determinism is tested.
- Security fixtures pass.
- Package policy matches package reality.
