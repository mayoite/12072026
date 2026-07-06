# Prompts

Fill placeholders. One block per phase. Prior: `executive-summary.md` from completed earlier phases this run — **if any**.

---

## 1 — Repair (`/implement`)

`/implement` · Scope: {{PHASE_SCOPE}} · Repo: {{REPO_ROOT}} · Gates: {{GATE_MODULE}}/

Reports → `Plans/{{WORKFLOW_SLUG}}/01-repair-agent/`

Read `AGENTS.md`, {{EXECUTION_DOC}}. **One root-cause cluster; minimal diff.** No feature scope creep.

Write four files per substance rules in `WORKFLOW.md`. `executive-summary.md` starts with `Revision: <sha>` and verdict proceed/block.

---

## 2 — Benchmarker (`/check-work`)

`/check-work` · Scope: {{PHASE_SCOPE}} · Gate module: {{GATE_MODULE}}/ · Prior: if any

Reports → `Plans/{{WORKFLOW_SLUG}}/02-benchmarker/`

Run and **name** the gate bundle for this phase (exact `results/…` paths). Verify GS, coverage floors, evidence rules. Every claim needs exit code + artifact path. INCOMPLETE → `failures.md`.

---

## 3 — Critic (`/review`)

`/review` · chrome-devtools · Playwright a11y · Surfaces: {{SURFACES}} · Prior: if any

Reports → `Plans/{{WORKFLOW_SLUG}}/03-critic/`

Review **before** UI changes. Cite review output, snapshots, a11y scores. **No simulated pass** — tool unavailable → `failures.md` with reason. Findings must be actionable for phase 4.

---

## 4 — UI expert

Surfaces: {{SURFACES}} · Prior: if any (read `03-critic/` especially)

Reports → `Plans/{{WORKFLOW_SLUG}}/04-ui-expert/`

Read UI contract + REC-01. Address critic findings where in scope. Thin REC-01 improvements; implement only if this run includes fixes. Each `work-done` bullet names file or route touched.

---

## 5 — Planner

Goal: {{PHASE_GOAL}} · Authority: {{EXECUTION_DOC}} · Prior: if any (`Plans/{{WORKFLOW_SLUG}}/`, `Failures.md`)

Reports → `Plans/{{WORKFLOW_SLUG}}/05-planner/`

Synthesize prior phases into an **execution plan** — ordered tasks, gates, evidence paths, risks. `executive-summary.md` = deliverable. **Not setup-only.** Ends with `Revision: <sha>` and clear next action.