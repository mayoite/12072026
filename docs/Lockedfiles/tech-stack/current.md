# Tech-stack — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Tech-stack docs are **orthogonal to 1A/1B** — documents production pins; CI health must be verified live.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Generator | Vite app in `site/tech-stack-generator/` | `site/tech-stack-generator/` |
| Output | `Documents/tech-stack-docs/` (generated) | repo `Documents/` |
| Commands | `pnpm run dev:tech-stack`, `build:tech-stack`, `docs:check:tech-stack` | root `package.json` |
| CI | `tech-stack-docs.yml` — verify green on main | `.github/workflows/` |

## Packages (on disk)

| Package | Pin | Role |
|---------|-----|------|
| `vite` | `^6.0.5` | Doc site dev + build (`tech-stack-generator/package.json`) |
| `react`, `react-dom` | `^19` | Doc UI |
| `tailwindcss`, `@tailwindcss/vite` | `^4.3` | Doc styling |
| `vitest` | `^4.1.9` | Package tests |
| `mermaid`, `highlight.js` | — | Diagrams + code blocks |
| `zod` | `^4.4.3` | Doc data validation |

**Separate from** `site/package.json` — documents site stack, does not ship it.

---

## Summary

Tech-stack docs are a separate Vite package that documents the production stack into generated static output. Not the live app and should never be confused with planner or site runtime. Commands exist from repo root; CI for doc generation must be verified live.

## Strengths

Isolated from site build — doc changes do not risk planner regressions. Clear output location (`Documents/tech-stack-docs/`). Own test script via `pnpm run test:tech-stack`. Useful onboarding artifact when kept in sync.

## Weaknesses

CI workflow health has been a known weak point. Generated output can stale if agents skip regen. Another package to maintain in an already large monorepo. Not integrated into `release:gate` the same way site tests are.
