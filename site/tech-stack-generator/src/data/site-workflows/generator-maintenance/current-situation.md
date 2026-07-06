# Generator Maintenance — Current Situation

**Evidence:** Direct reads of generator README, Readme_Techstack, COVERAGE-REPORT, CONTENTS, package.json implied, root START, list_dir of src/data + scripts, workflowsData.ts.

## Honest State

- Standalone Vite React TS app inside site/tech-stack-generator/.
- Builds to ../Documents/tech-stack-generated/ (and data/markdown via sync).
- Source data in src/data/*.ts (workflowsData imports generated json only).
- Scripts: extract-*, render-*, gate, model, etc (mjs).
- Tests: focused on generation, extractors, filesystem, guards (see tests/generator/).
- Current coverage low per COVERAGE-REPORT (intentionally narrow for package wiring).
- No site-workflows/ subdir pre this task.
- Sync from root: pnpm run docs:sync:tech-stack (regenerates; do not hand-edit outputs).
- Dev: npm run dev (or npm.cmd on win).

## Gaps

- site-workflows/ structure for module workflows was missing (now introduced).
- Workflows page uses mix of hardcoded + Generated* from json.
- No per-module md source yet (this task adds source files; integration to generator data/render may be future).
- Package tests do not cover full site workflows yet.
- Generator docs (this trio) will need wiring if to feed data loaders.

## GS Application

- Evidence first: every sync/gate must have full run records in results/ (use results/site/generator-maintenance/...).
- Anti-copy: generator content must reflect live repo (no stale copy); refer Readme.md etc.
- Refer/revise: update generator README/Readme_Techstack + root START + testing-handbook when process changes. Superpowers GS filter applies to any UI/docs changes here.
- Do not edit generated outputs.
