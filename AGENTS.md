# AGENTS.md

## 1. Overrides
- **User Wins:** The user's current message supersedes all rules.
- **Re-read:** Read this file before every task.
- **Unclear = Stop:** Never guess scope or next steps. Ask.

## 2. Routing (Mandatory Handbooks)
- **Plan:** `Agents/Agents-Plan.md`
- **Failures:** `Agents/Agents-failure.md`
- **Testing:** `Agents/Agents-testing.md` & `testing-handbook.md`
- **Browser:** `Agents/Agents-browser.md`
- **Docs:** `Agents/Agents-docs.md`
- **Architecture:** `Agents/Agents-architecture.md`

## 3. Permission & Scope
- **Act on Ask:** Execute required reads/edits without pausing, unless scope grows.
- **Scope Creep = Stop:** If you need files/commands beyond the ask, STOP and ask.
- **Read-Only:** Review tasks do NOT alter files.
- **Minimal:** No silent fixes or unrelated refactors.
- **Destructive:** Archive over delete. No commits/pushes without asking.

## 4. Standards & Safety
- **No `any`:** Strictly prohibited in handwritten code.
- **Facts:** Repo facts → `Readme.md`. Commands → `START.md`.
- **Convention:** Match surrounding code. Read owning docs before editing.
- **Safety:** No secrets leaked. Respect auth rules in `Readme.md`.

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

