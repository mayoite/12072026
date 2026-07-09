# Agent process + TDD note (for owner)

> **Short version:** use [12-WORKFLOW.md](./12-WORKFLOW.md). This page is optional depth.

**Purpose:** How work is run for you — agents, skills, hard rules, blockers, and how to request the next wave.  
**Not for:** deep test dumps (those live under `results/`).

**Repo checkout:** `D:\OandO07072026` only.

---

## Superpowers + agents

Work is driven by **superpowers** (skill-first workflow) and parallel **sub-agents** when the task is large enough to split cleanly.

| Cap | Rule |
|-----|------|
| Agents | **Up to 8** concurrent focused workers per wave |
| Scope | Each agent gets a narrow ask; no silent expansion |
| Checkout | All agents use the **same** main tree — never git worktrees |
| Output | Reports + evidence paths; owner-facing notes go in `ayushdocs/` |

Typical split examples: implement · test · code-review · a11y · browser smoke · debug · docs · verification. Not every wave uses all eight.

---

## Skills used

| Skill | When |
|-------|------|
| **using-superpowers** | Default entry — pick skills, plan waves, avoid ad-hoc thrash |
| **code-review** | After implementation or on explicit review asks; findings → `ayushdocs/05-CODE-REVIEW.md` when owner-facing |
| **systematic-debugging** | Failures, flaky tests, “works on my machine”; root-cause before patch spam |
| **chrome-devtools** | Live browser checks (publish, open3d load, hydration, UI gates) |
| **a11y** | Landmark/hydration/accessibility smokes (e.g. open3d nested `main`) |
| **verification** | Live commands + artifacts; no “should be fine” without evidence |
| **TDD** | **When implementing** — failing test / behavior first, then minimal code, then re-run; preserve full output |

TDD is not optional for new product logic: red → green → evidence in `results/`. Skipped tests or empty console = fail.

---

## AGENTS.md hard rules (non-negotiable)

Source of truth: repo root **`AGENTS.md`** (re-read each task).

| Rule | Meaning |
|------|---------|
| **User wins** | Your current message overrides defaults, skills, and old plans |
| **No worktrees** | Only `D:\OandO07072026`. Never `git worktree add` / never follow “use a worktree” suggestions |
| **No `any`** | Strictly prohibited in handwritten TypeScript |
| **Evidence in `results/`** | Claims need live artifacts (logs, JSON, screenshots). Stale notes are not proof |
| **No silent commits** | No `git commit` / `git push` unless you explicitly ask in the current conversation |
| **Unclear = stop** | No guessing scope; ask before expanding |
| **Minimal** | No drive-by refactors or unrelated fixes |

Done checklist (from AGENTS.md): match the ask · verify with `results/` · log blockers in `Failures.md` · report what ran / failed / next step.

---

## config-agents (routing)

**Config entry:** treat **`AGENTS.md`** as the agent config + constitution.

**Mandatory handbooks** (do not invent parallel process docs):

| Topic | File |
|-------|------|
| Plan | `Agents/Agents-Plan.md` |
| Failures | `Agents/Agents-failure.md` |
| Testing | `Agents/Agents-testing.md` + `testing-handbook.md` |
| Browser | `Agents/Agents-browser.md` |
| Docs | `Agents/Agents-docs.md` |
| Architecture | `Agents/Agents-architecture.md` |

Master plans / phase order win over feature enthusiasm: read plan phases first; task checklists start at **00 (setup/verification)** and map to those phases.

---

## Figma (blocked)

| Item | Status |
|------|--------|
| Figma MCP auth | **Failed / not connected** |
| `figma-generate-library` (Code Connect / library gen) | **Blocked until Figma MCP auth succeeds** |
| Owner action | Re-auth Figma MCP in the agent environment, then re-run library generation |

Until auth works, design-library automation from Figma will not run. Product kill-paths in `00-PENDING.md` do not depend on Figma.

---

## How to ask for the next wave

Keep it short and pick **one** kill-path (or a numbered wave). Agents will not invent the next epic.

### Good prompts

1. **Single kill-path (preferred)**  
   `Next wave: P0.1 only — admin SVG publish browser E2E. Evidence under results/planner/. No SSR.`

2. **Named list from pending**  
   `Wave: P0.2 + P0.3. Up to 8 agents. TDD + chrome-devtools. Main checkout only.`

3. **Implement with TDD**  
   `Implement <X> with TDD. Skills: using-superpowers, verification. Stop if scope needs files outside <area>.`

4. **Review / debug only**  
   `Review-only: code-review on <paths>. No edits.`  
   or  
   `Debug: <symptom>. systematic-debugging. Evidence only until root cause agreed.`

### What to include when useful

- Priority id from `ayushdocs/00-PENDING.md` (P0.1, P0.2, …)
- Hard cap: “up to N agents” (default max 8)
- Skills you care about (TDD, a11y, chrome-devtools)
- Out of scope: e.g. “no SSR”, “no Figma until auth”, “no commits”

### What happens after you ask

1. Re-read `AGENTS.md` + relevant `Agents/*.md`
2. Spin ≤8 agents / apply skills
3. Write proof under `results/`
4. Update owner docs in `ayushdocs/` if the ask includes that
5. End with **what ran · what failed · exact next ask you can paste**

### Suggested next single action (if undecided)

See **`ayushdocs/00-PENDING.md`** — pick one of P0.1 / P0.2 / P0.3. Do not start SSR until you need a shared URL. Do not start Figma library work until MCP auth is fixed.

---

## Quick reference

| Topic | Where |
|-------|--------|
| Pending / priority | `ayushdocs/00-PENDING.md` |
| This process | `ayushdocs/07-AGENT-PROCESS.md` |
| Evidence map | `ayushdocs/08-EVIDENCE-INDEX.md` (when present) |
| Agent constitution | `AGENTS.md` |
| Handbooks | `Agents/*.md`, `testing-handbook.md` |
| Live proof | `results/` (esp. `results/planner/`) |

**Bottom line:** Superpowers + up to 8 agents · TDD when implementing · no worktrees · no `any` · evidence in `results/` · you win · Figma library blocked on MCP auth · ask the next wave by one clear kill-path.
