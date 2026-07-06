# Phase 1B prompts

Prior: `executive-summary.md` from completed earlier phases this run — **if any**.

---

## 1 — Repair (`/implement`)

`/implement` · Scope: Phase 1B SVG — Puck mount, compiler unification, reference blocks, publish path · Repo: `D:\oandO04072026` · Gates: `results/planner/phase-1b/`

Reports → `Agents workflow/01-repair-agent/`

Read `AGENTS.md`, `Plans/01-execution/core/02-PHASE-1.md`. One root-cause cluster; minimal diff.

---

## 2 — Benchmarker (`/check-work`)

`/check-work` · Scope: Phase 1B gates · Gate module: `results/planner/phase-1b/` · Prior: if any

Reports → `Agents workflow/02-benchmarker/`

Name gate bundle (e.g. `1b-final-tests`, `1b-typecheck`). Cite exit codes and `*-run.json` paths. INCOMPLETE if skipped.

---

## 3 — Critic (`/review`)

`/review` · chrome-devtools · Playwright a11y · Surfaces: `/planner/open3d`, `admin/svg-editor` · Prior: if any

Reports → `Agents workflow/03-critic/`

Review before UI changes. Real tool output or skip in `failures.md`. Actionable findings for phase 4.

---

## 4 — UI expert

Surfaces: `/planner/open3d`, `admin/svg-editor` · Prior: if any — read `03-critic/`

Reports → `Agents workflow/04-ui-expert/`

UI contract + REC-01. Address critic findings in scope. Implement only if this run includes fixes.

---

## 5 — Planner

Goal: Complete Phase 1B SVG publish for 3 variants · Authority: `Plans/01-execution/core/02-PHASE-1.md` · Prior: if any

Reports → `Agents workflow/05-planner/`

Execution plan — tasks, gates, evidence, risks. Not setup-only. `Revision: <sha>` + next action.