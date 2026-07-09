# AGENTS.md

## 1. Overrides
- **User Wins:** The user's current message supersedes all rules.
- **Re-read:** Read this file before every task.
- **Unclear goal = Stop:** If the *product ask* is ambiguous, ask. Do **not** ask how to implement once the goal is clear — take the call.
- **No prompt theater:** Short rules + real work. Do not inflate AGENTS or agent briefs into 400-line “prompt engineering.”

## 2. Routing (Mandatory Handbooks)
- **Plan:** `Agents/Agents-Plan.md`
- **Failures:** `Agents/Agents-failure.md`
- **Testing:** `Agents/Agents-testing.md` & `testing-handbook.md`
- **Browser:** `Agents/Agents-browser.md`
- **Docs:** `Agents/Agents-docs.md`
- **Architecture:** `Agents/Agents-architecture.md`

## 3. Permission & Scope
- **Goals + intent:** **You and the agent set goals** together. **Owner owns intent.** If the **goal changes**, stop and align. Otherwise agent has **full freedom**.
- **Full execute freedom (no ask unless goal changes):** Read/change repo code; **any skill**; **browser / DevTools**; **any command** needed for the goal; land commits; push/mirror; choose checkpoints; decide agent count/order. Prefer ship-and-show with data.
- **Still stop and ask (hard only):** purchase/subscribe / new paid seat with no trial; force-push or delete remote branches; destroy/archive owner data beyond the ask; competitor-asset edge cases; true **goal** change or new product area not requested.
- **Owner availability:** Often reachable (~most of the time); may miss 5–10 min windows — agent does **not** block on owner for routine work.
- **Read-Only:** Review-only tasks do NOT alter files.
- **Minimal:** No silent unrelated refactors outside the goal.
- **Destructive:** Prefer archive over delete for user content.

### Git & Workspace Rules (User Standing Instructions)

- **Work only in the repo, no worktrees**: Always `D:\OandO07072026` main checkout. Never worktrees.
- **Commit as we go:** Local commit after each landable slice.
- **Push when right (agent call):** Push `main` to **origin** when a landable slice is committed and green enough to not strand the remote (tests/evidence as fits the slice). No need to ask each time.
- **Mirror backup (agent call):** Also push the same tip to the **mirror** remote on a **~30–60 min of real work** cadence (or sooner after a big land). Default remotes: `origin` = primary, `mayoite` = mirror (`mayoite/OandO07072026`). Never force-push mirror/origin unless owner asks.
- **Checkpoints:** Agent decides when to CP (docs, tests, push, evidence folders) — use trustdata CPs when on that program.
- User instructions always win.

### Skills & Superpowers (User Standing Instructions — 2026-07-09)

- **`/using-superpowers` always allowed and always required** for the main agent **and every subagent**.
- **All skills permitted:** Main agent may load and assign **any** available skill (Firecrawl, chrome-devtools, TDD, debugging, a11y, verification, docs, etc.) as fit. Owner grants full skill authority.
- Load **skills that fit the job** (TDD, debug, browser, etc.) — not every skill for ceremony.
- **Subagents:** Prefer parallel when useful. **Default up to 8–10; up to 12 when confident** the split is clean (agent call — don’t spam). Write to disk. Briefs stay short; point at MDs.
- Skills do not override **User Wins** or Git & Workspace rules above.

### Packages, assets & licenses (hard — no exceptions)

- Prefer open (MIT/Apache/BSD). Paid allowed. Trial before buy. **Ask before any purchase.**
- **No competitor assets** (code, UI, GLB, WASM, fonts, logos, brands) into product.
- **Detail + cleared-paid table:** `ayushdocs/17-LICENSES-CLEARED.md`
- **Secrets / keys:** `.env.local` only (never commit).

### Point agents at the right MD (keep AGENTS short)

| Need | File |
|------|------|
| Licenses / paid cleared | `ayushdocs/17-LICENSES-CLEARED.md` |
| Why this product (business) | `ayushdocs/18-PRODUCT-CONTEXT.md` |
| Goals / near slices | `ayushdocs/19-GOALS-SLICES.md` (scoreboard; plan = how) |
| Owner pending / workflow | `ayushdocs/00-PENDING.md`, `ayushdocs/12-WORKFLOW.md` |
| Trust-data plan | `Plans/trustdata/INDEX.md` |
| Research home | `D:\websites\README.md` + `Plans/trustdata/RESEARCH-MAP.md` |
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

## 7. Done Checklist
1. **Match:** Does it perfectly match the ask with zero bloat?
2. **Verify:** Is there concrete evidence in `results/`?
3. **Log:** Are blockers logged in `Failures.md`?
4. **Report:** State exactly what ran, what failed, and the next step.


## 8. Master Plan Alignment
- **Read Master Plans First:** Before proposing an implementation_plan.md, always check for a Plans/ or documentation directory. You must strictly follow the sequential phases outlined in the master blueprints. Do not skip phases or jump to feature work if foundational refactors (e.g., Phase 2A before Phase 2B) are pending.
- **Strict Task Checklists:** Always create a task.md checklist starting from 00 (Setup/Verification) that maps exactly to the master plan's phases.
