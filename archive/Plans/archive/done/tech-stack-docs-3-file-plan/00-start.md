# Tech Stack Docs — Scope

**Archived:** 2026-06-29 → `archive/plans/done/tech-stack-docs-3-file-plan/`. Live status: root [`Failures.md`](../../../Failures.md).

**Last updated:** 2026-06-29

**Paths:** `tech-stack-generator/` · `Documents/` · `site/`

---

## Done (locked — your answers)

| ID | Criterion |
|----|-----------|
| **A** | **SPA zero-manual** — all 12 routes read only `generated-data/`; no hand facts in `.tsx` (ui labels on allowlist OK) |
| **B** | **Full surface** — `Documents/markdown` + `Documents/data` + `generated-data/` + SPA + `Documents/tech-stack-generated/` accurate and check-verified |
| **D** | **Audit clean** — audit rows + `Failures.md` closed **or** logged; you approve each close |

**100% accuracy** = provenance on every measured fact + zero hand facts in SPA + SPA matches live repo.

---

## Auto-update contract (what “change site → docs updates alone” means)

| Change in `site/` | After `docs:sync:tech-stack` | SPA UI updates without `.tsx` edit? |
|-------------------|------------------------------|-------------------------------------|
| Dependency version | `Documents/data` + `generated-data/` | **Only** on routes already wired (Overview, TechStack partial; **not** Performance deps until verified) |
| Dev script in `site/package.json` | `workflows.json` | **Yes** on `/workflows` |
| New `server-only` module | `security.json` | **Yes** on `/security` |
| Perf script / dep | `performance.json` | **Yes** on `/performance` |
| New top-level dir or feature folder | `code-organization.json` | **Yes** on `/code-organization` |
| New/changed API route | `api.json` | **No** until ApiDesign batch |
| DB table / migration | `database.json` | **No** until Database batch |

**Phase 1 exit requires:** every extracted domain on every wired route follows **site change → sync → SPA updates alone**.

**Not Phase 1:** narrative guides (git-flow diagrams, commit examples, planner subtree trees) unless extracted.

---

## Rules

- [`AGENTS.md`](../../AGENTS.md) override rules apply.
- You approve each **batch of 4**. I stop with proof. I do not continue alone.
- No tests / coverage / `release:gate` / commits without permission.
- Never hand-edit `Documents/` facts — sync only.

---

## Surfaces

| Surface | Path | Status |
|---------|------|--------|
| Markdown | `Documents/markdown/` (19) | measured — 708+ facts |
| Data JSON | `Documents/data/` (15 domains) | check green + parity |
| Renderer input | `generated-data/` (15 files) | parity + `_accuracy-renderer.json` |
| SPA | `src/pages/` (12 routes) | **12/12 wired** |
| Build | `Documents/tech-stack-generated/` | not exit-tested yet |

**§3 routes (markdown + JSON + SPA):** `/workflows`, `/code-organization`, `/security`, `/performance`.

**Coverage:** 15.64% lines today. Phase 2 before gate.
