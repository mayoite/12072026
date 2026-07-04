# Tech-stack static audit

**Date:** 2026-07-01  
**Scope:** `site/tech-stack-generator/`, `site/tech-stack-docs/`, root `docs:gate:tech-stack`

## Static review

- Renderer source: `site/tech-stack-generator/src/` (React + Vite SPA).
- Generated facts: `Documents/` via `pnpm run docs:sync:tech-stack` (no hand-edited generated output).
- CI workflow: `.github/workflows/tech-stack-docs.yml` (Linux gate).

## Commands run (local)

| Check | Command | Result |
|-------|---------|--------|
| Unit + integration | `pnpm run test:tech-stack` | **PASS** — 23 files, 113 tests |
| Full docs gate | `pnpm run docs:gate:tech-stack` | **PASS** after `docs:sync:tech-stack` (manifest had drift vs committed `Documents/`) |
| Static production build | included in `docs:gate:tech-stack` | **PASS** — Vite build → `Documents/tech-stack-generated/` |
| Dependency audit | `pnpm audit` (repo root) | **3 moderate** (esbuild via drizzle-kit, postcss via next, @opentelemetry/core via lighthouse dev chain) — dev/transitive; no production runtime exploit path documented |
| Lighthouse (preview) | `pnpm run preview:tech-stack` → `http://localhost:4173/` | **SKIPPED** — no local Chrome install for `lighthouse` CLI |
| Playwright E2E on static build | — | **N/A** — tech-stack package has no E2E spec; coverage is Vitest + `docs:gate` build |

## Gate coverage summary (2026-07-01)

`docs:gate:tech-stack` verified: manifest check, hardcoding guard, fake-test audit, theme alignment, coverage ≥95% thresholds, typecheck, test, production build.

## Residual risks

- Re-run `docs:sync:tech-stack` before commit when site CSS or repo facts change (gate fails on manifest drift).
- `pnpm audit` moderates are upstream dependency bumps (not tech-stack-specific).
- Lighthouse baseline on static preview still unrecorded until Chrome is available locally or in CI.

## Status

**Resolved** — static audit complete; runtime Lighthouse deferred (environment).
