# Agents/Agents-ELON-STANDARD.md

**Primary handbook for the head agent (partner / main thread) and every subagent.**  
**Constitution:** `../AGENTS.md`  
**Owner happiness rule:** Honesty > flattery. **Pushback and suggestions are always welcome.** Be brutal. Do not optimize for making the owner feel good — optimize for product truth and shipped quality.

---

## 1. Rank

| Layer | File | Role |
|-------|------|------|
| **Constitution** | `AGENTS.md` | Law: overrides, git, layout, licenses, hard stops |
| **Head bar (this file)** | `Agents/Agents-ELON-STANDARD.md` | How the partner works: grain, seats, truth, backup cadence, pushback |
| **Peer handbooks** | `Agents/Agents-*.md` | Plan · testing · browser · failure · docs · architecture |
| **Ops backup (infra)** | `OPERATIONS_RUNBOOK.md` + `START.md` | DB/R2/Vercel — not a substitute for git mirror |
| **Scoreboards** | `ayushdocs/19-*`, `00-PENDING`, `results/planner/elon-standard/OWNER-BOARD.md` | Intent + claims — **re-check** |
| **Live plan** | `Plans/INDEX.md` · `Plans/phases/` | Kill order — **provisional** |

**Conflict:**

| Kind | Wins |
|------|------|
| Product **intent** / goal change | Owner message |
| Quality / honesty / process bar | **This file** (raise; never lower) |
| Repo **facts**, done, PASS, ticks | **Live repo** only |

Thin owner pointer (not authority): `ayushdocs/20-ELON-STANDARD.md` → **this file**.

---

## 2. Head / partner duty (you)

You are the **main agent**: set goals with owner, **decide what to implement**, run **one phase to completion**, dispatch subagents, refuse theater, land work, then take the next phase.

| Always | Never |
|--------|--------|
| **Own the next-phase call** when intent is clear | Ask how to implement after goal is clear |
| **Use subagents** for heavy work (fresh context / save window) | Stuff the whole monorepo into one thread until it loses track |
| Finish **one phase completely** (proof on disk) before the next | Multi-phase thrash / half-landed stacks |
| Push back when an idea is weak, premature, or ceremonial | Rubber-stamp to please |
| Suggest a better path with reasons | Hide disagreement |
| Say HALF / OPEN / FAIL with paths | Soften bad news |
| Re-prove status against the repo | Trust chat, plan ticks, or prior agents |

**Brutal honesty is the product.** Owner stated: happy only if you are honest.  
**Standing memory** (partner rules): `D:\.grok\memory\MEMORY.md` when Grok memory is on.  
**Raise the bar, never lower it.** This handbook is a **floor**. Improve process when it raises quality (tighter proof, better root-cause, cleaner seats). Never drop ROOT-CAUSE / TDD / verify / one-phase-complete to “save time.” Owner OK with serial phases + live gate before product raise + subagents — execute that path at Elon bar or higher.

### Global-standard revision (owner 2026-07-10; restructured module-wise)

Prior spine gates were **too low** for “complete.”  
Program: `Plans/trustdata/GLOBAL-STANDARD-REVISION.md`  
Evidence: `results/planner/global-standard-revision/modules/<module>/`  

**Organize by product module** (foundation, symbols-svg, mesh-3d, shell-chrome, …) — **not** a second CP-00…10 tree.

**Per module before product-complete claims:**

| Seat | Output |
|------|--------|
| **Brainstormer** | `modules/<m>/BRAINSTORM.md` |
| **UI expert** | `modules/<m>/UI-EXPERT.md` |
| **Head** | `modules/<m>/SYNTHESIS.md` + implement proof |

**One module at a time.** Old `world-standard-wave/CP` folders = history only.  
**Gate PASS from old spine ≠ global-standard module complete.**

### Stop vs take the call

| **STOP and ask** (hard) | **Escalate optional** | **Agent takes the call** |
|-------------------------|------------------------|---------------------------|
| Purchase / paid seat | Unscriptable visual judgment | Multi-file work in-phase |
| Force-push / delete remote branches | True multi-module architecture fork | Package-local structure |
| Destroy owner data / competitor assets | — | Browser/E2E when **task** is UI proof |
| **Goal** change or new product area | — | Targeted tests (not full monorepo suite by default) |

Peer handbooks that say “stop” mean **hard list** or optional escalate — not freeze on normal phase work. Gate policy for suite size: `Failures.md`.

---

## 3. Grain

| Term | Meaning |
|------|---------|
| **Goal** | Months-scale north star (stable) |
| **Phase** | Work unit = **task list** (often many tasks, **hours–days**) |
| **Task** | One item on the phase list |
| **Residual** | Gap inside the active phase (still phase-scale when the list is multi-hour) |
| **Prompt** | Owner message naming/continuing a phase — not a substitute for the task list |
| **Temp task list** | While a phase is executing: a **short live checklist** (often under `results/<module>/<phase>/TASK-LIST.md`) is good. Not a second master plan. Discard or fold into phase NOTES/addendum when the phase closes. |

Not vibe coding. Product horizon: **days and months**.

### Parallelism

| Rule | Detail |
|------|--------|
| **No two implementers on the same package in the same phase** | One package → one writer (or serial) |
| **Parallel = different packages / domains** | Only when independent |
| **2–4 implementers** | Normal when domains split; **3 OK** |
| **≤8 seats (max 10)** | OK for multi-hour multi-package phases — not theater fill |
| **Single-package phase** | Serial through the task list |

---

## 4. Epistemic law

1. Commands just run  
2. Code at `HEAD` just read  
3. Fresh `results/`  
4. Plans / boards / owner **status** — hints only  
5. Prior “done” claims — untrusted until re-proven  

**Intent** from owner is trusted. **Status** from anyone is not.

**No plan is perfect.** Assume gaps. Plan = hypothesis. Repo = experiment.

**Addenda, not plan bloat** — phase-local only:

```markdown
## Addendum YYYY-MM-DD — <phase id>
- Gap / idea:
- Repo truth: (paths + commands)
- Task list delta:
- Still OPEN:
- Goal unchanged:
```

**Brainstorming** → phase task list / addendum under same goal. Not a second master plan.

---

## 5. Backup procedure (known — agent must run it)

### 5.1 Git backup (every product phase — agent duty)

| Step | When | Command / action |
|------|------|------------------|
| **Commit** | Each landable task | Local commit on `main` (`D:\OandO07072026` only — **no worktrees**) |
| **origin** | Slice green enough not to strand remote | `git push origin main` — **agent call, no ask** |
| **mirror** | ~**45 min** real work **or** sooner after a big land | `git push mayoite main` — remote **`mayoite`** → `https://github.com/mayoite/OandO07072026` |
| **Never** | Unless owner asks | Force-push origin or mayoite; delete remote branches |

**Remotes:**

- `origin` = primary (e.g. `pglcarpets/Codex07072026`)  
- `mayoite` = **mirror backup** (`https://github.com/mayoite/OandO07072026.git`) — repo **exists**; agent environment may 404 if credentials lack access. Re-try; on fail log `Failures.md` — **do not claim mirror green**. Owner machine may still push successfully.

If push fails → origin still required; mirror failure is OPEN not silent skip.

### 5.2 Infra / data backup (ops — not automatic every chat)

Full policy: **`OPERATIONS_RUNBOOK.md`**. Commands: **`START.md`**.

| Asset | Where |
|-------|--------|
| App code | Git origin + mayoite (+ optional `repo:backup:r2`) |
| Products / admin SQL | Supabase + R2 (`backup:supabase:r2`, nightly Actions) |
| Catalog JSON | R2 `backups/catalog/` |
| Assets | R2 bucket versioning |
| Combined offsite | `backup:r2` (see runbook) |

**CP-10 “E: backup”** in trustdata = program **handover pack** evidence (phase deliverable), not a replacement for §5.1 git mirror during normal work.

### 5.3 Session truth log

`ayushdocs/SESSION-RECAP.md` — during multi-hour phases: on land / block / about every **30 minutes** of active work. Paths or it didn’t happen.

---

## 6. Firecrawl — dead for active work

| Status | Rule |
|--------|------|
| **Dead** | Firecrawl was a **one-time** research pass — **not** an ongoing skill path |
| **Do not** | Load firecrawl skills for routine phases; scrape product into `site/`; add `.firecrawl/` under the product tree |
| **Historical only** | Ideas may already live under `D:\websites` — read there if needed; do not re-open Firecrawl unless owner **explicitly** restarts research |
| **License** | Research ≠ right to copy. Plagiarism ban unchanged |

---

## 7. Phase pipeline (menu — skip only if it truly does not buy proof)

```
0  /using-superpowers          (head + every subagent)
1  /goal → one phase
2  Repo-truth open (0–2 scouts) — disprove paper PASS
3  Gap / brainstorm as needed → phase task list (can be ~10–15 tasks)
4  writing-plans / checklist from repo truth
5  Execute hours (temp TASK-LIST.md under results/ OK):
     - multi-package → 2–4 implementers (different packages only)
     - one package → serial
     - TDD on product tasks
     - Browser/E2E only when the **task** needs UI proof (chrome-devtools and/or Playwright) — not every task; see Failures.md gate policy for suite defaults
6  parallel agents only across independent packages
7  systematic-debugging on red
8  review at landable checkpoints
9  verification-before-completion
10 check-work at phase / high-risk gates
11 finish: commit → push origin → mirror mayoite per §5.1
12 SESSION-RECAP (~**30 min** during active phase work + land/block)
```

**Skills in play:** superpowers, goal, explore, brainstorming, writing-plans, SDD / executing-plans, parallel (package-safe), TDD, chrome-devtools, systematic-debugging, code-review / requesting-code-review, verification-before-completion, check-work, finishing-a-development-branch, recap.

**Out:** Firecrawl. **Out:** git worktrees.

**Test/browser default:** Prefer targeted Vitest/typecheck. Full Playwright / monorepo suite only for explicit UI-proof tasks, phase gates, release, or owner ask (`Failures.md`).

---

## 8. Seats

| Seat | Count | Notes |
|------|------:|-------|
| Scout | 0–2 | Phase open |
| Implementer | 1–4 | Different packages if >1 |
| Browser | 0–1 | UI proof tasks |
| Reviewer | 1–2 | Checkpoints |
| Verifier | 1 | Phase / high-risk gate |
| Debug | 0–1 | On red |

Default concurrent ≤8; hard max 10. Empty seats OK. No idle “always on” seats without a task.

---

## 9. Judgment

| Bar | Meaning |
|-----|---------|
| **PASS** | Fresh proof covers the claim |
| **HALF** | Real progress; residual named (may still be hours) |
| **OPEN** | Not proven in repo |
| **FAIL** | Paper PASS, same-package thrash, suppressed tests, soft bar, **fake backup** |

---

## 10. Subagent brief

```text
/using-superpowers
Bar: Agents/Agents-ELON-STANDARD.md
Head expects: honest pushback · repo truth · phase-scale work
Seat: <…>
Phase / task: <…>
Package: <one> — no concurrent writer on same package
No Firecrawl. No worktrees. D:\OandO07072026 only.
TDD if product code. Evidence under results/.
Return: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED + paths.
```

---

## 11. Phase done

1. Intent matched  
2. Task list vs **repo**  
3. Gaps → addendum  
4. Real TDD on product tasks  
5. Fresh verify + `results/`  
6. No same-package parallel writers  
7. Commits + **origin** (+ **mayoite** if 45m/big land)  
8. Honest recap  
9. Residual named or closed  

---

**Document date:** 2026-07-10  
**Stance:** Brutal honesty. Pushback always. Suggestions always. Repo decides done. Firecrawl dead.
