# Tech Stack Walkthrough

This file is the quick operating guide for `site/tech-stack-generator/`.

## What This Is

- Separate Vite app inside the Oando repo
- Source of the interactive tech-stack docs site
- Build output lands in repo-root `tech-stack-docs/`
- Generated data snapshots under repo-root `tech-stack-generated/`

## First Run

From the **repo root**:

```bash
pnpm install
pnpm dev:tech-stack
```

Open `http://localhost:5173`.

Do not run `npm install` inside `site/tech-stack-generator/` — use the root `pnpm-lock.yaml`.

## Package Scripts

Root aliases (preferred):

- `pnpm dev:tech-stack` - start the docs site
- `pnpm build:tech-stack` - typecheck and build to repo-root `tech-stack-docs/`
- `pnpm preview:tech-stack` - preview the built site
- `pnpm typecheck:tech-stack` - TypeScript check only
- `pnpm test:tech-stack` - Vitest suite

Package-local (`pnpm --filter oando-site-workflow-docs <script>`):

- `dev` - start the docs site
- `build` - typecheck and build
- `preview` - preview the built site
- `typecheck` - TypeScript check only
- `test` - Vitest suite
- `test:coverage` / `coverage` - Vitest with V8 coverage

## Test Walkthrough

Current package test coverage is intentionally small and checks the package wiring:

1. Read the package Vite config from disk.
2. Confirm `outDir` points at repo-root `tech-stack-docs` and base is `/tech-stack-docs/`.
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

- Keep the source under `site/tech-stack-generator/` (stays in site/ as requested)
- Build output now in root `/site-workflow` (configurable in vite.config.ts)
- Use `npm run build` (or root sync if still wired) to regenerate; the site-workflows modules are part of the Workflows section.
- Governance, Superpowers & Tooling section (added to src/pages/Workflows.tsx) posts the /using-superpowers GS process, anti-copy, evidence, chrome-devtools MCP, and skills (design/review/check-work/figma-*) — see Workflows.tsx and root README.md. Follow AGENTS.md + superpowers spec.
- If the test suite expands, update this walkthrough and the package README together
