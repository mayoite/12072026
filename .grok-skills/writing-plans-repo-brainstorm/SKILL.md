---
name: writing-plans-repo-brainstorm
description: Use when writing an implementation plan after brainstormer reports exist (Idiots/Idiots2 or similar), or when the plan must be grounded in live repo truth first—before any code
---

# Writing Plans (Repo-First + Brainstormer Reports)

## Overview

This is a **fork of superpowers:writing-plans** with a hard read order and **no length cap**.

Write an **extensive** implementation plan for an engineer with zero codebase context and questionable taste. Document everything: files to touch, full code in steps, tests, commands, expected output, docs, risks. Bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

**This variant adds:** (1) read the **live repo first**, (2) then read **brainstormer reports**, (3) then write a plan that may be **thousands of lines** — there is **no upper limit**.

**Announce at start:** "I'm using the writing-plans-repo-brainstorm skill (repo first → brainstormer reports → extensive plan)."

**Parent skill:** Keep the discipline of superpowers:writing-plans (task structure, no placeholders, TDD steps, self-review, execution handoff). This skill **overrides** only read order, plan depth, and default save paths where stated below.

---

## Iron Law (This Variant)

```
NO PLAN WITHOUT:
  1) Live repo read FIRST
  2) Brainstormer report(s) read SECOND
  3) Plan written only AFTER both
```

**Violating the letter is violating the spirit.**

| Excuse | Reality |
|--------|---------|
| "I already know the phase" | Repo moved; plans lie; read disk. |
| "Brainstorm reports are fluff" | Owner ordered them as input; use them. |
| "Plan should stay short" | This skill forbids artificial length caps. |
| "I'll skim RESEARCH only" | Repo code/paths first; research is not product truth. |
| "PASS in old docs is enough" | If evidence folders missing, plan must re-prove. |
| "Copy writing-plans and ship" | Wrong order = wrong plan. |

### Red flags — STOP

- Writing plan tasks before opening `site/` / phase sources  
- Citing brainstormer claims without repo path checks  
- "TBD", "similar to Task N", steps without code  
- Short plan "to save tokens" when this skill is active  
- Treating `results/` PASS as live when folder was deleted  

---

## Mandatory Read Order

### Phase 0 — Resolve inputs (before Phase 1)

1. **Owner message** — which phase/slice/gate/feature?  
2. **Brainstormer report roots** (default for this monorepo):
   - `Idiots2/<phase-slug>/REPORT.md` (websites-first wave — prefer when both exist)
   - `Idiots/<phase-slug>/REPORT.md` (phase-first wave)
   - Or path owner names  
3. **Phase plan folder** if trustdata-style: `Plans/phases/P0X-*/`  
4. **Research maps** (after repo code, still required for O&O): `Plans/Research/`  

If report missing: **stop** and say so — do not invent a brainstormer. Offer to run brainstormers first or plan from repo-only with owner OK.

### Phase 1 — Repo first (HARD)

Read **live** product and plan sources **before** treating brainstormer prose as truth.

**Minimum for O&O planner work:**

| Priority | What | Why |
|----------|------|-----|
| 1 | `AGENTS.md` | Workspace, evidence, one-task rules |
| 2 | Owning code under `site/features/planner/` (or named feature) | What actually exists |
| 3 | Unit/e2e paths under `site/tests/` for that feature | What is already tested |
| 4 | `Plans/phases/<owning-phase>/` execute card + appendix + experts | Intended gate |
| 5 | `Plans/Research/RESULTS-MAP.md` | Evidence folder names |
| 6 | `Plans/INDEX.md` / `Plans/README.md` if present | Tree map |
| 7 | Design spec if present (e.g. world-standard planner) | W-gate definitions |

**Repo-first checklist (must complete before Phase 2):**

- [ ] List **real** files that will be touched (paths exist or are new and justified)  
- [ ] Note **contradictions**: plan claims vs code  
- [ ] Note **missing evidence** (e.g. `results/` deleted → re-prove in plan)  
- [ ] Record HEAD or "dirty tree" honesty  

**Do not** start task list yet.

### Phase 2 — Brainstormer reports second (HARD)

Read the full `REPORT.md` for the owning phase (prefer Idiots2 if both).

Extract into working notes (these become plan sections, not optional):

| Extract | Use in plan |
|---------|-------------|
| Buyer journeys | Goal + acceptance |
| Competitive JTBD (ideas only) | UX/product steps — **no** competitor copy |
| Failure modes / false-green traps | Tests + stop-if-fail |
| Raised bar | Done criteria stronger than process PASS |
| Approaches A/B/C | Architecture choice + why |
| Open questions | Resolve in plan or mark owner decision |
| Path index from report | Cross-check against Phase 1 repo read |

**Conflict rule:** **Repo wins** over brainstormer when they disagree on what code does. Brainstormer wins on **intent/bar/failure modes** only when repo is silent — and plan must say so.

### Phase 3 — Write extensive plan (no upper limit)

Only after Phase 1 + 2.

**There is NO maximum length.** Prefer too long over too thin. Thousands of lines OK. Multiple task groups OK. Full code in every code step. Full test source. Full commands. Full expected output. Appendices encouraged:

- Full file map  
- Full type/signature catalog used in plan  
- Full test matrix  
- Risk register  
- Research translation table (ideas → O&O)  
- False-green catalog  
- Commit sequence  

**Still:** each **step** remains one action (2–5 minutes). Extensiveness = **more steps and more complete content**, not mega-steps.

---

## Save Location

Default for this monorepo (owner layout):

```
docs/superpowers/plans/YYYY-MM-DD-<feature-or-phase>-plan.md
```

If `docs/superpowers/plans/` missing, use:

```
Plans/phases/<phase-slug>/IMPLEMENTATION-PLAN.md
```

or path owner specifies. Prefer one canonical path stated in the plan header.

**Announce path** when saved.

---

## Scope Check

Same as writing-plans: multi-subsystem specs → separate plans. Each plan must yield working, testable software alone.

---

## File Structure (before tasks)

Map files create/modify/test. Clear boundaries. Prefer focused files. In existing codebases follow patterns; propose splits only when a touched file is unwieldy.

---

## Bite-Sized Task Granularity

**Each step is one action (2–5 minutes):**

- Write the failing test  
- Run it — expect FAIL  
- Minimal implementation  
- Run tests — expect PASS  
- Commit  

Never combine "implement everything + tests + docs" into one step.

---

## Plan Document Header (required)

Every plan MUST start with:

```markdown
# [Feature / Phase] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** [One sentence]

**Architecture:** [2–5 sentences]

**Tech Stack:** [Key technologies]

**Inputs consumed:**
- Repo read: [date] HEAD `[sha or dirty]` — key paths listed in § Repo reality
- Brainstormer: `Idiots2/.../REPORT.md` and/or `Idiots/.../REPORT.md`
- Phase plan: `Plans/phases/...`

**Done when:** [Buyer-visible or testable criteria — not "CP PASS" alone]

**Evidence folder (if trustdata-style):** `results/planner/world-standard-wave/<canonical>/` (create on execute; re-prove if missing)

---
```

---

## Required Plan Sections (extensive)

Include **all** of the following (expand freely; add more):

1. **Repo reality** — what code/tests actually exist; contradictions  
2. **Brainstormer synthesis** — bar, failures, approaches chosen  
3. **Ethics / non-copy** — research ideas only  
4. **File map** — create / modify / test paths  
5. **Architecture & data flow**  
6. **Task list** — Task 00…N with full steps (TDD)  
7. **Test matrix** — unit / browser / commands / expected  
8. **False-green catalog** — traps and how plan blocks them  
9. **Stop-if-fail / CP criteria** (if gated)  
10. **Commit sequence**  
11. **Risks & owner decisions**  
12. **Self-review vs brainstormer + repo**  
13. **Appendices** as needed (types, fixtures, selector tables, research translation)

---

## Task Structure (same shape as writing-plans)

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts` (what changes)
- Test: `site/tests/.../file.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// full test source — not "add tests"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd site && pnpm exec vitest run path/to/test.ts --reporter=verbose`
Expected: FAIL with [specific message]

- [ ] **Step 3: Write minimal implementation**

```typescript
// full code
```

- [ ] **Step 4: Run test to verify it passes**

Run: [exact command]
Expected: PASS [counts]

- [ ] **Step 5: Commit**

```bash
git add [paths]
git commit -m "feat(...): ..."
```
````

---

## No Placeholders

Plan failures — never write:

- TBD / TODO / "implement later" / "fill in"  
- "Add appropriate error handling" without code  
- "Write tests for the above" without full test source  
- "Similar to Task N" (repeat content)  
- Steps without how (code/commands required)  
- Types/functions not defined in any task  
- "See brainstormer report" without inlining the decision into a task  

---

## Self-Review (after plan written)

1. **Repo coverage:** Every touched path from Phase 1 appears in a task.  
2. **Brainstormer coverage:** Each major bar / failure mode from REPORT has a task or explicit WAIVE.  
3. **Placeholder scan:** Fix all red flags.  
4. **Type consistency** across tasks.  
5. **Length honesty:** If plan is short because content is simple, say so; if short because skipped sections, **expand**.  

---

## Execution Handoff

After saving:

**"Plan complete and saved to `<path>`. Two execution options:**

**1. Subagent-Driven (recommended)** — superpowers:subagent-driven-development  

**2. Inline Execution** — superpowers:executing-plans  

**Which approach?"**

---

## Remember

| Keep from writing-plans | Changed in this fork |
|-------------------------|----------------------|
| TDD steps, checkboxes, commits | **Repo read first** |
| Exact paths, full code | **Brainstormer reports second** |
| No placeholders | **No upper length limit** |
| Self-review + handoff | O&O evidence / ethics defaults |

- Exact file paths always  
- Complete code in every code step  
- Exact commands with expected output  
- DRY, YAGNI, TDD, frequent commits  
- **Extensive** > brief when this skill is invoked  

---

## When NOT to use

- Tiny one-file fix with no brainstormer reports and owner wants speed → use superpowers:writing-plans  
- No code change (docs-only) → skip implementation plan skill  
- Brainstorming product design not yet ready for plan → superpowers:brainstorming first  

---

## Relationship

```
superpowers:writing-plans          ← base discipline
writing-plans-repo-brainstorm      ← THIS skill (read order + depth)
superpowers:brainstorming          ← produces Idiots*/REPORT.md inputs
superpowers:executing-plans        ← after plan exists
superpowers:subagent-driven-development
```
