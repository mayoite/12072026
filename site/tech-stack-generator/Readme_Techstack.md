# Tech Stack Walkthrough

This file is the quick operating guide for `site/tech-stack-generator/`.

## What This Is

- Separate Vite app inside the Oando repo
- Source of the interactive tech-stack docs site
- Build output lands in `../Documents/tech-stack-generated/`
- Generated JSON/markdown snapshots land in `../Documents/data/` and `../Documents/markdown/` (owned by `pnpm run docs:sync:tech-stack` at repo root)

## First Run

```bash
cd site/tech-stack-generator
npm install
npm run dev
```

Open `http://localhost:5173`.

On Windows PowerShell, use `npm.cmd` instead of `npm` if needed.

## Package Scripts

- `npm run dev` - start the docs site
- `npm run build` - typecheck and build to `../Documents/tech-stack-generated/`
- `npm run preview` - preview the built site
- `npm run typecheck` - TypeScript check only
- `npm run test` - Vitest suite
- `npm run test:coverage` - Vitest with V8 coverage
- `npm run coverage` - alias for coverage

## Test Walkthrough

Current package test coverage is intentionally small and checks the package wiring:

1. Read the package Vite config from disk.
2. Confirm `outDir` still points at `../Documents/tech-stack-generated/`.
3. Verify the tech stack data arrays are present and valid.

Current result on 2026-06-27:

- Test files: `1`
- Tests: `3`
- Coverage: `15.64%` statements, `8.33%` branches, `4.34%` functions, `15.64%` lines

## Directory Guide

- `src/pages/` - documentation pages
- `src/components/` - shared UI blocks
- `src/data/` - navigation and tech stack data
- `src/hooks/` - search and local helpers
- `tests/` - Vitest tests for package behavior

## Update Rules

- Keep the source package name `tech-stack-generator`
- Keep the build output path `../Documents/tech-stack-generated/`
- Regenerate source-backed docs from repo root with `pnpm run docs:sync:tech-stack`; do not hand-edit `Documents/data/` or `src/generated-data/`
- Governance, Superpowers & Tooling section (added to src/pages/Workflows.tsx) posts the /using-superpowers GS process, anti-copy, evidence, chrome-devtools MCP, and skills (design/review/check-work/figma-*) — see Workflows.tsx and root README.md. Follow AGENTS.md + superpowers spec.
- If the test suite expands, update this walkthrough and the package README together
