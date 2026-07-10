# Agents/Agents-elon-standard.md

## 1. Rank (highest bar)

**This handbook is the highest process + quality benchmark for every agent on this repo.**

| Layer | File | Role |
|-------|------|------|
| **Constitution** | `../AGENTS.md` | Law: overrides, git, layout, licenses, hard stops |
| **Highest bar (this file)** | `Agents/Agents-elon-standard.md` | Skill order, seats, **truth rules**, honesty bar, recap |
| **Peer handbooks** | `Agents/Agents-*.md` | Plan · testing · browser · failure · docs · architecture |
| **Owner scoreboards** | `ayushdocs/19-*`, `00-PENDING`, `results/planner/elon-standard/OWNER-BOARD.md` | Intent + reported status — **always re-check** |
| **Live plan** | `Plans/trustdata/` | Kill *order* + phase shape — **provisional**, not gospel |

**Conflict rule (intent vs truth):**

| Kind | Who / what wins |
|------|-----------------|
| **Product intent / goal change** | Owner message (stop and align) |
| **Process bar / quality bar** | This file (raise to it; never lower) |
| **Repo facts, “done”, PASS, checklist ticks** | **Live repo only** — code, tests, `results/`, git. Not memory. Not owner chat. Not plan checkboxes. Not this file’s age. |

When any handbook or habit is softer than this file, **raise to this bar**.

**Product board (claims only):** `results/planner/elon-standard/OWNER-BOARD.md` — re-verify before citing  
**Rolling recap:** `ayushdocs/SESSION-RECAP.md`  
**Owner pointer (not authority):** `ayushdocs/20-ELON-STANDARD.md` → **this file**

---

## 2. Epistemic law (do not trust plans, checklists, or people)

### 2.1 Goal stays; maps rot

| Stable | Changes |
|--------|---------|
| **North-star goal** (buyer-usable planner path, honesty, manufacturer bar) | Repo code, evidence folders, phase status |
| Owner **intent** for the current kill | Plan text, checklists, “PASS” notes, agent memory |

**No plan is ever perfect.** Assume **gaps** in every phase, slice, checklist, and prior session claim. The plan is a **hypothesis**. The **repo is the experiment**.

### 2.2 Trust ladder (top = most trusted)

1. **Live commands** you just ran (exit codes, full logs)  
2. **Tracked code** at `HEAD` you just read  
3. **Fresh artifacts** under `results/` with matching timestamps/SHA  
4. Plan / checklist / board / owner verbal status — **hints only**  
5. Prior agent “we already did X” — **untrusted until re-proven**

**Do not trust:**

- Checkbox `[x]` in any MD  
- “CP-0N PASS” without opening evidence + re-running when the claim matters  
- Owner memory of “that’s done” (owner asked for this rule)  
- This handbook if the repo contradicts a *fact* claim (process bar still stands)

### 2.3 How to use plans without believing them

- Plans give **kill order** and **where to look**.  
- Before acting: **diff plan claim vs repo** (paths, tests, UI).  
- If repo is ahead of plan → update evidence/notes; do not re-implement ghosts.  
- If plan is ahead of repo → work the gap; do not tick paper PASS.  
- If both lie → **repo wins**; log plan debt in addendum or `Failures.md`.

### 2.4 Addenda — not plan expansion

**Do not** grow the master plan into a novel every time reality moves.

| Do | Don’t |
|----|--------|
| Add a **short addendum** on the **active phase / slice / task** | Rewrite `INDEX.md` into a second program |
| Name: gap, repo truth, decision, evidence path | Invent a new epic parallel to the kill path |
| Keep north-star goal fixed | “While we’re here” scope creep |

**Addendum shape** (append under the phase file, or `results/.../ADDENDUM.md`, or phase `NOTES.md`):

```markdown
## Addendum YYYY-MM-DD — <slice/task id>
- **Gap assumed / found:** …
- **Repo truth:** paths + command results (not “should be”)
- **Decision:** …
- **Still OPEN:** …
- **Does not change goal:** <one line north star>
```

Brainstorming output that survives → **addendum or sub-checklist for this slice**, not a new parallel master plan.

### 2.5 Brainstorming is for gaps and new ideas

Use **brainstorming** when:

- Repo and plan disagree  
- You discover a gap mid-slice  
- New idea appears that might serve the **same** goal  
- Design is unclear for the *current* kill only  

**Hard rules:**

- Always **assume gaps** at start of a slice (default posture).  
- Brainstorm → small design → **addendum / task checklist** → implement.  
- Do **not** expand the global plan surface.  
- New ideas that change **goal** → stop; owner owns intent.  
- New ideas that stay inside goal → addendum on the active phase/slice.

Pipeline step 3 is not “skip if a phase file exists.” Phase files are **starting maps**. Step 3 = **gap scan + brainstorm when the map is wrong or incomplete** (common, not rare).

---

## 3. What “Elon standard” means here

Not hype. Not theater. Not “looks done.”

| Principle | Demand |
|-----------|--------|
| **Repo is truth** | Re-read code / re-run proof; ignore stale PASS paper |
| **Assume gaps** | Every plan and checklist is incomplete until proven otherwise |
| **Addenda over expansion** | Fix the phase/slice note; don’t rewrite the program |
| **Goal fixed** | Same north star; maps update under it |
| **Path or it didn’t happen** | PASS needs command output and/or `results/` path |
| **Quality over speed** | Manufacturer-planner bar; slow correct > fast greenwash |
| **Honesty** | HALF and OPEN valid; lying PASS = FAIL |
| **One kill** | Finish the owner task; no multi-epic thrash |
| **Real tests** | One real assertion on changed behavior > hollow % |
| **Evidence first** | `verification-before-completion` before any done claim |
| **Fresh context** | Subagents + `/using-superpowers` |

**Do not claim:** ship-ready polish, photoreal mesh, cloud save, Fabric cutover complete, a11y clean, undefined W9, or that fast `pnpm gate` = full open3d browser pack (use `gate:open3d` when that pack is the proof).

---

## 4. Iron rules (never waive)

| Rule | Detail |
|------|--------|
| **`/using-superpowers` first** | Main **and every subagent** — first line of every brief |
| **One owner task** | Parallel only **inside** that task |
| **No worktrees** | Only `D:\OandO07072026` |
| **Evidence root** | Repo-root `results/` only |
| **No `any`** | Handwritten TS — strict |
| **Zero suppression** | Never filter/delete test output |
| **Commit as you go** | Landable slice → commit → push when green; mirror ~45m |
| **No done without proof** | Fresh verify; then claim |
| **No paper PASS** | Checklist tick without repo proof is FAIL |
| **Addendum not epic** | Gaps → phase/slice addendum, not plan bloat |

---

## 5. Ordered pipeline (before / during any task)

```
0  /using-superpowers            → main + every subagent (always)
1  /goal                         → lock ONE kill (intent); do NOT accept “already done” on faith
2  Repo truth scout (0–2)        → code + results + git; contradict plan/checklist on purpose
3  Gap scan + brainstorming       → assume gaps; new ideas → addendum for THIS phase/slice only
4  writing-plans                 → slice checklist / sub-plan (from repo truth, not paper PASS)
5  SDD implementers (2–4)        → each brief: superpowers + TDD + “verify claims yourself”
6  dispatching-parallel-agents   → ONLY independent domains
7  chrome-devtools               → 0–1 when browser / a11y / visual evidence required
8  systematic-debugging          → any red (root cause before fix)
9  requesting-code-review
   + code-review                 → after each landable slice
10 verification-before-completion → fresh commands; read output; then claim
11 check-work                    → verifier must re-check repo, not restate the plan
12 finishing-a-development-branch → commit / push on main
13 /recap                        → SESSION-RECAP: what repo proves now (not what plan hoped)
```

**Fallback:** tiny single-file → **executing-plans** inline; still TDD + repo proof + check-work.

**Peer handbooks:** testing → `Agents-testing.md`; browser → `Agents-browser.md`; fail → `Agents-failure.md`; plan shape → `Agents-Plan.md`; docs → `Agents-docs.md`; arch → `Agents-architecture.md`.

---

## 6. Skill roster

| # | Skill | When |
|---|--------|------|
| 0 | **using-superpowers** | Always — first |
| 1 | **/goal** | Lock intent; re-verify status against repo |
| 2 | **explore / repo truth** | 0–2 scouts; **disprove** stale claims |
| 3 | **brainstorming** | Gaps + new ideas under same goal → addendum |
| 4 | **writing-plans** | Slice checklist from **current** repo truth |
| 5 | **subagent-driven-development** | Default; **2–4** implementers |
| 6 | **executing-plans** | Fallback |
| 7 | **dispatching-parallel-agents** | Independent sub-slices only |
| 8 | **test-driven-development** | Required on every implementer |
| 9 | **chrome-devtools** | UI/browser proof in slice |
| 10 | **systematic-debugging** | Any failure |
| 11 | **code-review** | Strict maintainability / code-judo |
| 12 | **requesting-code-review** | Reviewer gets SHAs + claims to re-verify |
| 13 | **verification-before-completion** | Before any done language |
| 14 | **check-work** | Verifier re-runs proof; fails on paper PASS |
| 15 | **finishing-a-development-branch** | Land on main per AGENTS |
| 16 | **/recap** | Repo truth snapshot in ayushdocs |

**Forbidden:** `using-git-worktrees`.  
**If fit:** firecrawl → `D:\websites` ideas only; a11y-debugging; memory-leak-debugging.

---

## 7. Subagent seats

| Seat | Count | Brief skills |
|------|------:|--------------|
| Repo-truth scout | 0–2 | superpowers · explore · **contradict plan** · return paths |
| Implementer | 2–4 | superpowers · TDD · task from **verified** gap · commit |
| Browser | 0–1 | superpowers · chrome-devtools · `results/` |
| Spec / quality reviewer | 1–2 | superpowers · code-review · re-read code not plan |
| Verifier | 1 | superpowers · check-work · **ignore checklist ticks** |
| Debug | 0–1 | superpowers · systematic-debugging · TDD regression |

**Caps:** default ≤8; hard max **10**. Empty seats OK.

---

## 8. Judgment bar (PASS / HALF / OPEN / FAIL)

| Bar | Meaning |
|-----|---------|
| **PASS** | Fresh proof you ran/read covers the claim |
| **HALF** | Real progress; residual **named** from repo |
| **OPEN** | Not proven in repo (even if plan says done) |
| **FAIL** | Paper PASS, suppressed tests, policy break, or soft bar |

**Plan said PASS + repo thin = OPEN or FAIL**, not PASS.

---

## 9. Recap cadence

**File:** `ayushdocs/SESSION-RECAP.md`  
Write ~every **15 minutes** of active work and at checkpoints.

```markdown
# Session recap
**When:** …
**HEAD:** `sha`
**Active kill (intent):** …
**Repo truth this window:** paths + commands
**Plan/checklist contradicted:** yes/no + what
**Addendum written:** path or none
**Red / blocked:** …
**Next 15m:** …
**Do not claim:** …
```

---

## 10. Subagent brief template

```text
/using-superpowers
Bar: Agents/Agents-elon-standard.md (highest)
Epistemic: repo is truth · assume gaps · no paper PASS · addendum not plan bloat
Seat: <implementer|reviewer|browser|verifier|debug|scout>
Kill (intent): <one owner goal>
Do not trust: checklists, prior PASS, owner status claims — re-verify
Skills: <fit from §6>
Checkout: D:\OandO07072026 only · no worktrees
Evidence: results/<module>/<slice>/
TDD if product code. No done without fresh verify.
Return: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED + paths + any addendum path.
```

---

## 11. Done (Elon checklist) — still re-verify each box in repo

1. **Match** — owner kill only; zero bloat  
2. **Truth** — plan/checklist re-checked against repo  
3. **Gaps** — assumed; addendum if needed (not master-plan rewrite)  
4. **TDD** — failing test first for product behavior  
5. **Verify** — fresh commands; full output  
6. **Evidence** — `results/` paths  
7. **Review** — structure held or improved  
8. **check-work** — verifier PASS on **repo**, not paper  
9. **Land** — commit (+ push when green)  
10. **Recap** — SESSION-RECAP = what repo proves  
11. **Residual** — named OPEN/HALF or none  

Empty box → not PASS.

---

## 12. Suggestion log (owner 2026-07-10) — adopted

| Owner idea | Adopted as |
|------------|------------|
| Brainstorming for new ideas | §2.5 + pipeline step 3 |
| Always assume gaps | §2.1, iron rule |
| No plan ever perfect / changes with repo | §2.1–2.3 |
| Goal remains the same | §2.1 stable column |
| Don’t expand plan — phase/slice **addendum** | §2.4 |
| Don’t trust checklist — check repo | §2.2, verifier seat |
| Don’t trust owner or plan for facts | §1 conflict table + §2.2 |

---

**Document date:** 2026-07-10  
**Owner stance:** no micromanage / no prompt theater — intent clear → run this bar.  
**Owner epistemic stance:** do not trust me or any plan for **repo facts**; re-prove.
