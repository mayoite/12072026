# Agents/Agents-elon-standard.md

## 1. Rank (highest bar)

**Highest process + quality benchmark for this repo.** Not vibe coding. Timescale is **days and months** of product work, not 20‑minute drive‑bys.

| Layer | File | Role |
|-------|------|------|
| **Constitution** | `../AGENTS.md` | Law: overrides, git, layout, licenses, hard stops |
| **Highest bar (this file)** | `Agents/Agents-elon-standard.md` | Grain, seats, truth rules, quality bar |
| **Peer handbooks** | `Agents/Agents-*.md` | Plan · testing · browser · failure · docs · architecture |
| **Owner scoreboards** | `ayushdocs/19-*`, `00-PENDING`, `results/planner/elon-standard/OWNER-BOARD.md` | Intent + reported status — **re-check** |
| **Live plan** | `Plans/trustdata/` | Kill *order* + phase shape — **provisional** |

**Conflict rule:**

| Kind | Wins |
|------|------|
| **Product intent / goal change** | Owner message |
| **Quality / honesty bar** | This file (raise; never lower) |
| **Repo facts, “done”, PASS, checklist ticks** | **Live repo** only |

**Owner pointer (not authority):** `ayushdocs/20-ELON-STANDARD.md` → this file  
**Recap:** `ayushdocs/SESSION-RECAP.md`  
**Product board (claims only):** `results/planner/elon-standard/OWNER-BOARD.md`

---

## 2. Grain (read this before “too many agents”)

### 2.1 Vocabulary

| Term | Meaning |
|------|---------|
| **Goal / north star** | Stable months-scale product intent (buyer-usable planner path, honesty, manufacturer bar) |
| **Phase** | The work unit. A **task list** for one kill — often **many tasks** (e.g. ~15), **hours to days** of real work, not a single chat prompt |
| **Task** | One checkbox inside a phase (one landable or near-landable slice of the phase) |
| **Residual** | Unfinished gap *inside* the active phase — still phase-scale work when the phase is multi-hour, not a “quick vibe fix” by default |
| **Prompt** | Owner message that *names* or *continues* a phase — not a substitute for the phase task list |

**Owner correction (binding):** Do not treat “residual” as 20‑minute vibe coding. A phase **is** a task list. Multi-task, multi-hour is normal. Product horizon is **days and months**.

### 2.2 Parallelism rules (packages)

| Rule | Detail |
|------|--------|
| **Never two implementers on the same package in the same phase** | One package → one writer (or serial handoff). No concurrent edit thrash. |
| **Parallel = different packages / domains** | e.g. unit suite vs e2e harness vs docs/evidence pack vs unrelated module — if truly independent |
| **2–4 implementers is normal** for a multi-task phase with independent domains | **3 is fine.** Min‑2 is not required when the phase is single-package. |
| **Up to 8 concurrent seats** (hard max 10) | Reasonable for a **multi-hour phase** with a real task list — not “useless” when work is parallelizable across packages |
| **Same package, many tasks** | **Serial** SDD (or one long implementer) through the task list — still hours of work, still not vibe coding |

### 2.3 When many agents earn their keep

A phase with ~10–15 tasks over ~3+ hours **can** use:

- 1–2 repo-truth / scout seats at open  
- 2–4 implementers on **different packages**  
- 0–1 browser seat for UI proof tracks  
- 1–2 review seats at landable checkpoints  
- 1 verifier at phase or major-task gates  

If the whole phase is **one package**, use **one implementer serial** + reviewers/verifier — do **not** invent parallel seats to fill the roster.

---

## 3. Epistemic law

### 3.1 Goal stays; maps rot

| Stable | Changes |
|--------|---------|
| North-star **goal** | Code, evidence, phase status, task lists |
| Owner **intent** for active phase | Plan text, checklist ticks, prior session claims |

**No plan is ever perfect.** Assume **gaps**. Plan = hypothesis. **Repo = experiment.**

### 3.2 Trust ladder

1. Commands just run  
2. Code at `HEAD` just read  
3. Fresh `results/` artifacts  
4. Plans / boards / owner status — **hints**  
5. “We already did X” — **untrusted until re-proven**

**Do not trust paper PASS.** Owner **intent** is trusted; owner **status claims** are not.

### 3.3 Addenda — not plan expansion

Gaps and new ideas under the **same goal** → **phase addendum** or task-list update for **this phase only**. Do not grow a second master plan.

```markdown
## Addendum YYYY-MM-DD — <phase id>
- **Gap:** …
- **Repo truth:** paths + commands
- **Task list delta:** …
- **Still OPEN:** …
- **Goal unchanged:** <one line>
```

### 3.4 Brainstorming

Use for phase open, mid-phase gaps, and new ideas that still serve the goal. Output → **phase task list / addendum**, not epic rewrite.  
Skip full brainstorm only when the **next task** is already specified and repo-confirmed — not because “everything is 20 minutes.”

### 3.5 Push back (serious work)

**Push back on:**

- Ceremony that does not buy product proof for **this phase**  
- Parallel seats on the **same package**  
- Paper PASS, suppressed tests, greenwash  
- Scope that changes the **goal** without owner  

**Do not push back on:**

- Multi-hour / multi-day phase scale  
- Task lists with many items  
- Agent counts justified by **independent** multi-package work inside a long phase  

Real work > ritual. Long phases > pretend-agile micro-slices.

---

## 4. Elon meaning

| Principle | Demand |
|-----------|--------|
| **Phase = task list** | Hours–days; many tasks OK |
| **Repo is truth** | Re-prove status |
| **Assume gaps** | Plans incomplete until proven |
| **Addenda over expansion** | Phase-local only |
| **Goal fixed** | Months-scale north star |
| **Path or it didn’t happen** | PASS needs proof paths |
| **Quality over speed** | Manufacturer bar |
| **One phase at a time** | Finish the active task list; no multi-phase thrash |
| **Real tests** | Behavior assertions; no fake coverage |
| **Package isolation for parallel** | Never same package concurrent writers |

**Do not claim:** ship-ready polish, photoreal, cloud save, Fabric cutover done, a11y clean, undefined W9, fast `pnpm gate` = full open3d browser pack.

---

## 5. Iron rules

| Rule | Detail |
|------|--------|
| **`/using-superpowers` first** | Main + every subagent |
| **One active phase** | Parallel only **inside** that phase’s task list |
| **No same-package concurrent implementers** | Serial that package’s tasks |
| **No worktrees** | `D:\OandO07072026` only |
| **Evidence** | Repo-root `results/` |
| **No `any`** | Handwritten TS |
| **Zero suppression** | Full test output |
| **Commit as you go** | Landable tasks inside the phase |
| **No paper PASS** | Repo proof required |
| **Addendum not epic** | Phase-local |

---

## 6. Phase pipeline (menu — skip only when it truly does not apply)

Not a 20‑minute script. **Open a phase, run for hours, land tasks, close phase.**

```
0  /using-superpowers
1  /goal → lock ONE phase (intent + kill order pointer)
2  Repo-truth open (0–2 scouts) → contradict plan/checklist; list real gaps
3  Gap scan + brainstorming as needed → phase task list (can be ~10–15 tasks)
4  writing-plans / checklist → phase task list from repo truth
5  Execute task list (hours):
     - Different packages → 2–4 implementers (3 OK); cap seats ≤8 default / 10 hard
     - Same package → serial implementer through those tasks
     - Each product task: TDD
     - Browser seat when tasks need UI proof
6  dispatching-parallel-agents only across independent domains/packages
7  systematic-debugging on red
8  Review at landable task / phase checkpoints (requesting-code-review + code-review)
9  verification-before-completion before any done claim
10 check-work on phase gate or high-risk task lands
11 finishing → commit/push landable tasks; close phase when task list proven
12 /recap → SESSION-RECAP on land / block / ~15–45m during long phase work
```

**Fallback:** if a phase collapses to a single package and few tasks, still treat it as **phase work** (proof + commit), not vibe coding — but **drop unused seats**.

---

## 7. Skill roster

| # | Skill | When |
|---|--------|------|
| 0 | **using-superpowers** | Always |
| 1 | **/goal** | Lock phase intent |
| 2 | **explore / repo truth** | Phase open; disprove stale PASS |
| 3 | **brainstorming** | Phase gaps / new ideas → task list / addendum |
| 4 | **writing-plans** | Phase task list (multi-hour scale) |
| 5 | **subagent-driven-development** | Default execution across the task list |
| 6 | **executing-plans** | Fallback / serial long thread |
| 7 | **dispatching-parallel-agents** | Independent packages only |
| 8 | **test-driven-development** | Every product task |
| 9 | **chrome-devtools** | Tasks that need browser proof |
| 10 | **systematic-debugging** | Failures |
| 11–12 | **code-review** / **requesting-code-review** | Landable checkpoints |
| 13 | **verification-before-completion** | Before done language |
| 14 | **check-work** | Phase / major-task gate |
| 15 | **finishing-a-development-branch** | Land on main |
| 16 | **/recap** | Long-phase truth log |

**Forbidden:** `using-git-worktrees`.

---

## 8. Seats for a multi-hour phase

| Seat | Count | Notes |
|------|------:|-------|
| Repo-truth scout | 0–2 | Phase open |
| Implementer | 1–4 | **Different packages only** if >1; 3 normal when justified |
| Browser | 0–1 | UI proof track |
| Reviewer | 1–2 | Checkpoints, not every keystroke |
| Verifier | 1 | Phase gate / high-risk land |
| Debug | 0–1 | On red |

**Default concurrent ≤8; hard max 10.** Empty seats OK. **Filled seats must map to real multi-hour task-list work.**

TDD / chrome = **roles on briefs**, not idle permanent watchers without tasks.

---

## 9. Judgment

| Bar | Meaning |
|-----|---------|
| **PASS** | Fresh proof covers the claim for that task/phase |
| **HALF** | Real progress; residual **named** (may still be hours of work) |
| **OPEN** | Not proven in repo |
| **FAIL** | Paper PASS, same-package parallel thrash, suppressed tests, soft bar |

---

## 10. Recap (long phases)

`ayushdocs/SESSION-RECAP.md` — during multi-hour phase work: ~**15–45 min** and every land/block.

```markdown
# Session recap
**When:** …
**HEAD:** `sha`
**Active phase:** …
**Task list progress:** N/M (repo-proven)
**Packages touched:** … (parallel only if distinct)
**Repo truth:** paths + commands
**Addendum:** path or none
**Next:** next tasks (hours-scale honesty)
**Do not claim:** …
```

---

## 11. Subagent brief

```text
/using-superpowers
Bar: Agents/Agents-elon-standard.md
Grain: phase = multi-hour task list · not vibe coding · days/months product
Seat: <…>
Phase: <id>
Task: <one item from phase list>
Package ownership: <package> — no concurrent writer on same package
Epistemic: repo truth · assume gaps · no paper PASS · addendum not epic
Skills: <fit>
Checkout: D:\OandO07072026 · no worktrees
Evidence: results/<module>/<phase>/
TDD if product code. Prove before done.
Return: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED + paths.
```

---

## 12. Phase done

1. Phase intent matched; zero goal drift  
2. Task list re-checked against **repo**  
3. Gaps → addendum / list update  
4. Product tasks had real TDD  
5. Fresh verify + `results/` where claimed  
6. No same-package parallel writers  
7. check-work / verify at phase gate  
8. Lands committed  
9. Recap honest (hours left named if HALF)  

---

## 13. Corrections log

| Feedback | Adopted |
|----------|---------|
| Phase = task list; multi-task / multi-hour | §2.1 |
| Not 20‑min vibe coding; days/months | §1, §2.1 |
| Never same package concurrent in a phase | §2.2 |
| 3 implementers OK; ~15 tasks per phase OK | §2.2–2.3 |
| ≤8 seats not useless on multi-hour parallel phase | §2.3, §8 |
| Residual ≠ trivial prompt theater | §2.1 |
| Push back on ceremony, not on phase scale | §3.5 |

---

**Document date:** 2026-07-10  
**Stance:** Owner owns intent. Agent owns execution quality. Phase-scale work. Repo decides done.
