# AGENTS.md

## 1. Overrides
- **User Wins:** The user's current message supersedes all rules.
- **Re-read:** Read this file before every task.
- **Unclear goal = Stop:** If the *product ask* is ambiguous, ask. Do **not** ask how to implement once the goal is clear — take the call.
- **No prompt theater:** Short rules + real work. Do not inflate AGENTS or agent briefs into 400-line “prompt engineering.”
- **Honesty over comfort:** Pushback and suggestions are **always** welcome. Be brutal. Do **not** optimize for making the owner happy — owner is happy when you are honest. Flattery and soft lies = fail.
- **Raise the bar, never lower it:** `Agents/Agents-ELON-STANDARD.md` is a floor. Improve process when quality rises; never skip proof/root-cause/TDD/phase-complete for speed.

## 2. Routing (Mandatory Handbooks)

**All agent process handbooks live under `Agents/`.**

### Head / partner (main agent) — read first

| Who | Primary handbook |
|-----|------------------|
| **You (head / partner / main thread)** | **`Agents/Agents-ELON-STANDARD.md`** |
| Every subagent | Same bar + fit skills; brief starts with `/using-superpowers` |

- **Elon standard (highest bar):** `Agents/Agents-ELON-STANDARD.md` — phase grain, seats, epistemic law, **git backup/mirror**, pushback duty, Firecrawl **dead**. Raise to this; never lower it.
- **Plan:** `Agents/Agents-Plan.md`
- **Failures:** `Agents/Agents-failure.md`
- **Testing:** `Agents/Agents-testing.md` & `testing-handbook.md`
- **Browser:** `Agents/Agents-browser.md`
- **Docs:** `Agents/Agents-docs.md`
- **Architecture:** `Agents/Agents-architecture.md`
- **Ops backup (DB/R2/deploy):** `OPERATIONS_RUNBOOK.md` + `START.md`

**Owner thin pointer (not authority):** `ayushdocs/20-ELON-STANDARD.md` → `Agents/Agents-ELON-STANDARD.md`

## 3. Permission & Scope
- **Goals + intent:** **You and the agent set goals** together. **Owner owns intent.** If the **goal changes**, stop and align. Otherwise agent has **full freedom**.
- **Full execute freedom (no ask unless goal changes):** Read/change repo code; **fit skills** (not dead tools); **browser / DevTools**; **any command** needed for the goal; land commits; push/mirror; choose checkpoints; decide agent count/order. Prefer ship-and-show with data.
- **Still stop and ask (hard only):** purchase/subscribe / new paid seat with no trial; force-push or delete remote branches; destroy/archive owner data beyond the ask; competitor-asset edge cases; true **goal** change or new product area not requested.
- **Owner availability:** Often reachable (~most of the time); may miss 5–10 min windows — agent does **not** block on owner for routine work.
- **Read-Only:** Review-only tasks do NOT alter files.
- **Minimal:** No silent unrelated refactors outside the goal.
- **Destructive:** Prefer archive over delete for user content.
- **Pushback:** Challenge weak ideas, premature scope, paper PASS, and ceremony that does not buy phase proof. Suggest better paths. Always.

### Git & Workspace Rules (User Standing Instructions)

- **Work only in the repo, no worktrees**: Always `D:\OandO07072026` main checkout. Never worktrees.
- **Commit as we go:** Local commit after each landable task inside the phase.
- **Push when right (agent call):** Push `main` to **origin** when a landable slice is committed and green enough to not strand the remote. No need to ask each time.
- **Mirror backup (agent call):** Push the same tip to **mayoite** about every **~45 min of real work** (or sooner after a big land). Remotes: `origin` = primary, `mayoite` = mirror (`mayoite/OandO07072026`). Never force-push unless owner asks.
- **Full backup map:** `Agents/Agents-ELON-STANDARD.md` §5 (git) + `OPERATIONS_RUNBOOK.md` (DB/R2/deploy).
- **Checkpoints:** Agent decides when to CP (docs, tests, push, evidence) — trustdata CPs when on that program.
- User instructions always win on intent; **repo** wins on facts.

### Repo layout (hard — one results tree)

| Rule | Location |
|------|----------|
| **Evidence / artifacts** | **Only** repo-root `results/` (`results/<module>/<phase>/…`). **Never** `site/results/`, **never** `site/test-results/`. |
| **Playwright / vitest reports** | `results/test-results/`, `results/playwright-report/`, `results/tests/` |
| **IDE config** | Repo-root `.cursor/` only — **not** `site/.cursor/` |
| **Research scrapes (historical)** | **`D:\websites`** ideas only. **Firecrawl is dead** for active work — do not re-run as routine. **No** `.firecrawl/` under `site/` or as product source |
| **Install** | `pnpm` from **repo root**. Do not invent a second monorepo under `site/` |
| **Tech-stack built docs** | Repo-root `tech-stack-docs/` + `tech-stack-generated/` |
| **Plans** | `Plans/` live (`INDEX.md` · `phases/` · `Research/`); history in `archive/Plans/` |
| **Residual execute (world-standard wave)** | **`plans1/START-HERE.md`** only |
| **Archived plan packages** | `archive/plans2/`, `archive/PlansA/` — not execute |

If a tool defaults output into `site/`, **redirect it to root `results/`** or fix the config.  
**Enforcement:** `pnpm run check:layout` (also first step of `gate` / `release:gate*`).

### Skills & Superpowers

- **`/using-superpowers` always required** for main agent **and every subagent**.
- **Fit skills only** — TDD, debug, chrome-devtools, verification, SDD, etc. as the **phase** needs.
- **Firecrawl: dead.** One-time research history only. Do not load for normal phases unless owner **explicitly** restarts research.
- **One phase at a time — finish it completely, then the next.** Phase = multi-hour **task list**. Head **decides** what to implement when intent is clear. **Use subagents** for real work (fresh context; saves the head window). Not multi-epic thrash. Not vibe coding.
- **Tests are part of the phase.** Real tests; purpose over %; zero fake coverage.
- **Parallel agents:** Only **inside** the active phase; **never two writers on the same package**. Default ≤8; hard max 10. Fresh context — not multi-product thrash.
- **Bar + pipeline + backup:** **`Agents/Agents-ELON-STANDARD.md`** (head’s primary).
- **Facts vs intent:** Owner owns intent. Agent re-proves all status claims against the repo.
- **Assign with superpowers:** Every subagent brief starts with `/using-superpowers` (+ fit skills). Short briefs; point at MDs.
- Skills do not override **User Wins** or Git & Workspace rules above.

### Packages, assets & licenses (hard — no exceptions)

- **Open preferred, not mandatory.** Paid OK when product needs it — **owner buys**, agent never purchases.
- **No plagiarism. Ever.** Research / old Firecrawl scrapes ≠ license to ship others’ work.
- Research/ideas only under `D:\websites` (patterns/JTBD only — **not** paste into `site/`).
- **Cleared paid table:** `ayushdocs/17-LICENSES-CLEARED.md`
- **Secrets / keys:** `.env.local` only (never commit).

### Point agents at the right MD (keep AGENTS short)

| Need | File |
|------|------|
| **Head / partner bar** | **`Agents/Agents-ELON-STANDARD.md`** |
| Licenses / paid cleared | `ayushdocs/17-LICENSES-CLEARED.md` |
| Why this product | `ayushdocs/18-PRODUCT-CONTEXT.md` |
| Goals / near slices | `ayushdocs/19-GOALS-SLICES.md` |
| Session recap | `ayushdocs/SESSION-RECAP.md` |
| Owner pending / workflow | `ayushdocs/00-PENDING.md`, `ayushdocs/12-WORKFLOW.md` |
| All agent handbooks | `Agents/` |
| Git + ops backup | `Agents/Agents-ELON-STANDARD.md` §5 · `OPERATIONS_RUNBOOK.md` · `START.md` |
| Trust-data / program how | `Plans/INDEX.md` · `Plans/phases/` · `Plans/Research/RESULTS-MAP.md` |
| Residual wave execute | `plans1/START-HERE.md` · four-seat review: `plans1/FOUR-SEAT-REVIEW.md` |
| Research (historical ideas) | `D:\websites\README.md` · `Plans/Research/RESEARCH-MAP.md` |
| Testing | `testing-handbook.md` + `Agents/Agents-testing.md` |

## 4. Standards & Safety
- **No `any`:** Strictly prohibited in handwritten code.
- **Facts:** Repo facts → `Readme.md`. Commands → `START.md`.
- **Convention:** Match surrounding code. Read owning docs before editing.
- **Safety:** No secrets in git. Keys → `.env.local`. Auth → `Readme.md`.

## 5. Test Evidence & Type Safety (See `testing-handbook.md`)
- **Zero Suppression:** Never delete or filter test output. Preserve all artifacts.
- **No Silent Passes:** Missing console output or skipped tests = FAIL.
- **Type Exceptions:** Require adjacent reason, owner, and removal condition.

## 6. Verification & Honesty
- **Evidence First:** Prove it with live checks. Don't trust stale notes.
- **Failure:** Fix it or refuse it. Do not defend bad output.
- **Pushback:** Say when the ask is wrong-sized, theatrical, or unsafe. Suggest the better path.

## 7. Done Checklist
1. **Match:** Does it perfectly match the ask with zero bloat?
2. **Verify:** Is there concrete evidence in `results/`?
3. **Backup:** origin pushed when right; mayoite if ~45m / big land (log fail if agent cannot access)?
4. **Recap:** SESSION-RECAP on land/block / ~**30 min** active phase work?
5. **Log:** Blockers in `Failures.md`?
6. **Report:** What ran, what failed, next phase step — honest.

## 8. Master Plan Alignment
- **Read live plan first:** residual execute → `plans1/START-HERE.md`; program how / maps → `Plans/INDEX.md` · `Plans/phases/P0X-*` · `Plans/Research/RESULTS-MAP.md`. Do not skip foundational phases. Do **not** execute from `archive/plans2/` or `archive/PlansA/`.
- **Phase task lists:** Map work to phase checklists; prove in repo; addenda for gaps — do not invent a second program plan.
