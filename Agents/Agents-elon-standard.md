# Agents/Agents-elon-standard.md

## 1. Rank (highest bar)

**This handbook is the highest process + quality benchmark for every agent on this repo.**

| Layer | File | Role |
|-------|------|------|
| **Constitution** | `../AGENTS.md` | Law: overrides, git, layout, licenses, hard stops |
| **Highest bar (this file)** | `Agents/Agents-elon-standard.md` | Skill order, seats, honesty bar, recap — **max quality** |
| **Peer handbooks** | `Agents/Agents-*.md` | Plan · testing · browser · failure · docs · architecture |
| **Owner scoreboards** | `ayushdocs/19-*`, `00-PENDING`, `results/planner/elon-standard/OWNER-BOARD.md` | What/why/status |
| **Live plan** | `Plans/trustdata/` | Phase kill order + evidence paths |

**Conflict rule:** Owner message > `AGENTS.md` > **this file** > other `Agents/*` handbooks > trustdata > ayushdocs.

When any handbook or habit is softer than this file, **raise to this bar**. Do not lower this bar to match average work.

**Product board (PASS only with paths):** `results/planner/elon-standard/OWNER-BOARD.md`  
**Rolling recap:** `ayushdocs/SESSION-RECAP.md`  
**Thin owner pointer (not authority):** `ayushdocs/20-ELON-STANDARD.md` → **this file**

---

## 2. What “Elon standard” means here

Not hype. Not theater. Not “looks done.”

| Principle | Demand |
|-----------|--------|
| **Path or it didn’t happen** | PASS requires command output and/or `results/` artifact path |
| **Quality over speed** | Global manufacturer-planner bar; slow correct > fast greenwash |
| **Honesty** | HALF and OPEN are valid; lying PASS is FAIL |
| **One kill** | Finish the owner task; no multi-epic thrash |
| **Real tests** | One real assertion on changed behavior > hollow coverage % |
| **Evidence first** | `verification-before-completion` before any done/pass claim |
| **Fresh context** | Subagents + `/using-superpowers` so the main thread does not rot |

**Do not claim:** ship-ready polish, photoreal mesh, cloud save, Fabric cutover complete, a11y clean, undefined W9, or that fast `pnpm gate` = full open3d browser pack (use `gate:open3d` when that pack is the proof).

---

## 3. Iron rules (never waive)

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

---

## 4. Ordered pipeline (before / during any task)

```
0  /using-superpowers            → main + every subagent (always)
1  /goal                         → ONE kill: 19 + 00-PENDING + Plans/trustdata/INDEX
2  Context scout (0–2)           → scoped explore; dual only if domain is wide
3  brainstorming                 → ONLY if design gap (skip if phase file is enough)
4  writing-plans                 → sub-plan OR checkbox task list (multi-step always)
5  SDD implementers (2–4)        → subagent-driven-development; each brief: superpowers + TDD
6  dispatching-parallel-agents   → ONLY independent domains
7  chrome-devtools               → 0–1 when browser / a11y / visual evidence required
8  systematic-debugging          → any red / unexpected (root cause before fix)
9  requesting-code-review
   + code-review                 → after each landable slice (spec then quality under SDD)
10 verification-before-completion → run full proof commands; read output; then claim
11 check-work                    → verifier subagent; PASS/FAIL; fix ≤3 loops
12 finishing-a-development-branch → commit / push on main (no worktree workflow)
13 /recap                        → ayushdocs/SESSION-RECAP.md (~15m + every checkpoint)
```

**Fallback:** tiny single-file or no subagents → **executing-plans** inline; still TDD + verify + check-work.

**Peer handbooks at the right step:** testing → `Agents-testing.md`; browser → `Agents-browser.md`; fail → `Agents-failure.md`; plan shape → `Agents-Plan.md`; docs → `Agents-docs.md`; arch → `Agents-architecture.md`.

---

## 5. Skill roster

| # | Skill | When |
|---|--------|------|
| 0 | **using-superpowers** | Always — first |
| 1 | **/goal** | Always — lock one kill |
| 2 | **explore / context** | 0–2 scouts at task start |
| 3 | **brainstorming** | Design gap only |
| 4 | **writing-plans** | Multi-step checklist / sub-plan |
| 5 | **subagent-driven-development** | Default; **2–4** implementers |
| 6 | **executing-plans** | Fallback |
| 7 | **dispatching-parallel-agents** | Independent sub-slices only |
| 8 | **test-driven-development** | **Required on every implementer** |
| 9 | **chrome-devtools** | UI/browser proof in slice |
| 10 | **systematic-debugging** | Any failure |
| 11 | **code-review** | Strict maintainability / code-judo |
| 12 | **requesting-code-review** | Dispatch reviewer with SHAs + plan text |
| 13 | **verification-before-completion** | Before any done language |
| 14 | **check-work** | End-of-slice verifier |
| 15 | **finishing-a-development-branch** | Land on main per AGENTS |
| 16 | **/recap** | Rolling truth in ayushdocs |

**Forbidden skill for this repo:** `using-git-worktrees` (AGENTS: never worktrees).

**Load if fit (not critical path):** firecrawl → research only under `D:\websites`; a11y-debugging; memory-leak-debugging.

---

## 6. Subagent seats

| Seat | Count | Brief skills |
|------|------:|--------------|
| Context scout | 0–2 | superpowers · explore · paths only |
| Implementer | 2–4 | superpowers · TDD · task text · commit |
| Browser | 0–1 | superpowers · chrome-devtools · `results/` |
| Spec / quality reviewer | 1–2 | superpowers · code-review · requesting-code-review |
| Verifier | 1 | superpowers · check-work · verification-before-completion |
| Debug | 0–1 | superpowers · systematic-debugging · TDD regression |

**Caps:** default ≤8 concurrent; hard max **10**. Prefer quality over filling seats.

**TDD / chrome are roles on briefs**, not idle permanent agents burning seats.

---

## 7. Judgment bar (PASS / HALF / OPEN / FAIL)

| Bar | Meaning |
|-----|---------|
| **PASS** | Fresh proof path under `results/` (or commit + test log path) covers the claim |
| **HALF** | Real progress; residual **named**; no greenwash |
| **OPEN** | Not started or pack missing |
| **FAIL** | Claim without path, suppressed tests, policy break, or soft-bar below this handbook |

Raise every slice toward manufacturer-buyer trust: dimensions, place/select/save honesty, browser-proven paths — not demo theater.

---

## 8. Recap cadence

**File:** `ayushdocs/SESSION-RECAP.md`  
**Archive (optional):** `ayushdocs/recaps/YYYY-MM-DD.md`

Write ~every **15 minutes of active work** and at every checkpoint (plan, green, FAIL, blocker, push).

```markdown
# Session recap
**When:** …
**HEAD:** `sha`
**Active kill:** …
**Done this window:** bullets + paths
**Red / blocked:** honest or none
**Next 15m:** one action
**Do not claim:** unproven items
```

---

## 9. Subagent brief template

```text
/using-superpowers
Bar: Agents/Agents-elon-standard.md (highest)
Seat: <implementer|reviewer|browser|verifier|debug|scout>
Kill: <one checklist item>
Skills: <fit only from this handbook §5>
Checkout: D:\OandO07072026 only · no worktrees
Evidence: results/<module>/<slice>/
TDD if product code. No done without fresh verify.
Return: DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED + paths.
```

---

## 10. Done (Elon checklist)

1. **Match** — exact owner kill; zero bloat  
2. **TDD** — failing test first for product behavior  
3. **Verify** — fresh commands; read full output  
4. **Evidence** — paths under `results/`  
5. **Review** — structure held or improved (code-review bar)  
6. **check-work** — verifier PASS  
7. **Land** — commit (+ push when green)  
8. **Recap** — SESSION-RECAP updated  
9. **Honest residual** — named or none  

If any box is empty, status is not PASS.

---

**Document date:** 2026-07-10  
**Owner stance:** no micromanage / no prompt theater — once intent is clear, agent runs this bar without asking how.
