# Tech Stack Docs — Handover

**Last updated:** 2026-06-29

**Plan:** [`01-execution-plan.md`](01-execution-plan.md) · **Scope:** [`00-start.md`](00-start.md)

---

## Done

- **SPA narrative + live facts** — all 12 routes keep guides/diagrams **and** a bottom **Live repo** section wired to `src/data/*` → `generated-data/`
- **`pnpm run docs:gate:tech-stack`** green — sync, check, guards, coverage, typecheck, **69/69** tests, production build
- Coverage: **94.5%** lines / **88%** branches
- Hardcoding guard: `src/data/` loaders only; pages may hold narrative until extracted
- `Documents/tech-stack-generated/` rebuilt

## Not done (honest)

- Curated hand tables in pages (e.g. ApiDesign highlight routes) duplicate generated lists — safe to trim later, not blocking
- Live acceptance: dep bump → TechStack version; new API route → ApiDesign table (manual proof)
- Criterion **D**: audit row closes — **your OK per row**
- **`release:gate`** (site Playwright) — not run; no Playwright in `tech-stack-generator/`
- 635+ unsupported claims in governance markdown

---

## Next

1. Live acceptance proofs (manual)
2. Optional: dedupe hand-curated vs generated tables on ApiDesign / Testing / Workflows
3. **`release:gate`** — explicit permission (site-wide)

---

## Baseline

| Item | Now |
|------|-----|
| SPA narrative | 12/12 |
| Live repo sections | 12/12 |
| `docs:gate:tech-stack` | **green** |
| Vitest | **69/69** |
