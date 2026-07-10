# Elon standard — agent skill workflow

**Audience:** main agent + every subagent  
**Authority:** Owner message > `AGENTS.md` > this file > `Plans/trustdata/`  
**Scoreboard (product truth):** `results/planner/elon-standard/OWNER-BOARD.md`  
**Why:** `18-PRODUCT-CONTEXT.md` · **What now:** `19-GOALS-SLICES.md` · **Pending:** `00-PENDING.md`  
**Rule:** PASS only with paths. No hype. Spine ≠ ship-ready product.

---

## 0. Iron rules (never waive)

| Rule | Detail |
|------|--------|
| **`/using-superpowers` first** | Main agent **and every subagent** start with it, then load **only fit skills** for that seat |
| **One owner task** | Finish it. No multi-epic thrash |
| **No worktrees** | Only `D:\OandO07072026` |
| **Evidence** | Repo-root `results/` only |
| **Real tests** | Purpose over %; fake coverage = fail |
| **No done without proof** | `verification-before-completion` before any pass/complete claim |
| **Commit as you go** | Landable slice → commit → push when green; mirror ~45m |

---

## 1. Owner proposal → refined order

Owner proposed (paraphrased): whole-repo dual scout → goal → brainstorm → plan → SDD (2–4) → parallel if needed → TDD seat → chrome seat → verify → finish → 15m recap.

**Adopted with these changes** (agent takes the call; owner does not micromanage):

| Keep | Change | Why |
|------|--------|-----|
| Goal lock before build | — | Intent first |
| Brainstorm → plan → SDD | Brainstorm **only if design gap** | Trustdata phase often *is* the design |
| SDD **min 2 / max 4** implement seats | Parallel **only independent** files | Matches “one task”; avoids edit conflicts |
| TDD always | **Not a separate idle agent** | Every implementer brief **requires** TDD |
| Chrome DevTools | **Stand up when UI proof needed** | Not a permanent seat on pure unit slices |
| Dual context agents | **Scoped explore, not full-repo every time** | Whole monorepo dual-scan every slice wastes context |
| Verify + finish + recap | Add **check-work** + **code-review** + **systematic-debugging** | Catch lies, structure debt, root-cause thrash |

**Skills not permanently “always on” as seats:** idle TDD agent, idle chrome agent, dual full-repo scout every micro-fix.  
**Skills always available / required by role:** listed in §2–3.

---

## 2. Ordered pipeline (before / during any task)

```
0  /using-superpowers          → main + every subagent (always)
1  /goal                       → lock ONE kill from 19 + 00-PENDING + trustdata INDEX
2  Context scout (0–2)         → explore agents; scoped paths; dual only if domain is wide
3  brainstorming               → ONLY if product/design unclear (skip if phase file is enough)
4  writing-plans               → sub-plan OR checklist with checkboxes (always multi-step)
5  SDD implementers (2–4)      → subagent-driven-development; each brief: superpowers + TDD
6  dispatching-parallel-agents → ONLY if independent domains (else stay serial under SDD)
7  chrome-devtools             → 0–1 agent when browser / a11y / visual evidence required
8  systematic-debugging        → on any red / unexpected (root cause before fix)
9  requesting-code-review
   + code-review               → after each landable slice (spec then quality if SDD)
10 verification-before-completion → fresh commands; read output; then claim
11 check-work                  → verifier subagent; PASS/FAIL; fix ≤3 loops
12 finishing-a-development-branch → commit / push / close slice (main only; no worktree cleanup)
13 /recap                      → ayushdocs rolling recap (see §5)
```

**Fallback:** if subagents unavailable or task is tiny single-file, use **executing-plans** inline instead of full SDD — still TDD + verify + check-work.

---

## 3. Skill roster (active stack)

| # | Skill | Seat / when |
|---|--------|-------------|
| 0 | **using-superpowers** | Always — first line of every brief |
| 1 | **/goal** (19 + PENDING + INDEX) | Always — lock one kill before work |
| 2 | **explore / context** (via subagents) | 0–2 at task start; scoped |
| 3 | **brainstorming** | Design gap only; hard-gate: no code until design approved when used |
| 4 | **writing-plans** | Multi-step: detailed checklist or sub-plan |
| 5 | **subagent-driven-development** | Default execution; **2–4** implementers |
| 6 | **executing-plans** | Fallback when SDD not used |
| 7 | **dispatching-parallel-agents** | Independent sub-slices only; still one owner task |
| 8 | **test-driven-development** | **Required on every implementer** (not a freeloading permanent seat) |
| 9 | **chrome-devtools** | When UI/browser proof is in the slice |
| 10 | **systematic-debugging** | Any failure / weird behavior |
| 11 | **code-review** | Strict maintainability bar |
| 12 | **requesting-code-review** | Dispatch reviewer with SHAs + plan text |
| 13 | **verification-before-completion** | Before any done/pass language |
| 14 | **check-work** | End-of-slice verifier loop |
| 15 | **finishing-a-development-branch** | Land slice on main per AGENTS |
| 16 | **/recap** | Rolling session truth in ayushdocs |

**Not on the critical path (load if fit):** firecrawl (research only → `D:\websites`), a11y-debugging, memory-leak-debugging, using-git-worktrees (**forbidden** by AGENTS — do not use).

---

## 4. Subagent seats (default layout)

For one landable slice:

| Seat | Count | Skills on brief |
|------|------:|-----------------|
| Context scout | 0–2 | `/using-superpowers` · explore · report paths only |
| Implementer | 2–4 | `/using-superpowers` · TDD · SDD task text · commit slice |
| Browser | 0–1 | `/using-superpowers` · chrome-devtools · evidence under `results/` |
| Spec / quality reviewer | 1–2 | `/using-superpowers` · requesting-code-review · code-review |
| Verifier | 1 | `/using-superpowers` · check-work · verification-before-completion |
| Debug | 0–1 | `/using-superpowers` · systematic-debugging · TDD regression |

**Caps:** default ≤8 concurrent; hard max 10 (`AGENTS.md`). Prefer **quality over seat fill** — empty seats OK.

**Implementer rule:** no production code without a failing test first (TDD). Real assertion > coverage theater.

---

## 5. Recap cadence (`/recap`)

**File:** `ayushdocs/SESSION-RECAP.md` (rolling current session)  
**Optional archive:** `ayushdocs/recaps/YYYY-MM-DD.md` when day rolls or big land

**When to write:**
- ~every **15 minutes of active work** on a long session, **and**
- at every natural checkpoint (plan written, slice green, FAIL, blocker, push)

**Template (keep short):**

```markdown
# Session recap

**UTC/local:** …
**HEAD:** `sha` short
**Active kill:** one line from 19 / PENDING
**Done this window:** bullets + evidence paths
**Red / blocked:** honest or “none”
**Next 15m:** one concrete action
**Do not claim:** anything not path-proven
```

No novel. Paths or it didn’t happen.

---

## 6. Elon bar (how we judge “done”)

| Bar | Meaning |
|-----|---------|
| **PASS** | Command + artifact path under `results/` (or committed code + test log path) |
| **HALF** | Real progress, residual named, no greenwash |
| **OPEN** | Not started or pack missing |
| **FAIL** | Claimed without path, suppressed tests, or policy break |

**Do not claim:** ship-ready polish, photoreal mesh, cloud save, Fabric cutover, a11y clean, undefined W9, or that fast `pnpm gate` includes full open3d browser pack (use `gate:open3d`).

Product scoreboard lives in: `results/planner/elon-standard/OWNER-BOARD.md`.

---

## 7. One-liner for every subagent brief

```text
/using-superpowers
Seat: <implementer|reviewer|browser|verifier|debug|scout>
Kill: <one task from plan checklist>
Skills: <fit only from 20-ELON-STANDARD.md>
Checkout: D:\OandO07072026 only · no worktrees
Evidence: results/<module>/<slice>/
TDD if you write product code. No done without fresh verify.
Return: status DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED + paths.
```

---

## 8. Map to older docs

| Doc | Role |
|-----|------|
| `AGENTS.md` | Constitution |
| `12-WORKFLOW.md` | Owner daily loop (thin) |
| **This file** | Skill order + seats + recap |
| `07-AGENT-PROCESS.md` | Pointer only |
| `results/planner/elon-standard/OWNER-BOARD.md` | Product PASS/HALF board |

---

**Document date:** 2026-07-10  
**Owner stance:** no micromanage / no prompt theater — agent executes this stack once intent is clear.
