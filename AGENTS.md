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

### Git & Workspace Rules (User Standing Instructions)

- **Work only in the repo, no worktrees**: Always operate directly in this repo's main checkout (`D:\OandO07072026`). Never run `git worktree add`, never create/switch to worktrees, and never follow any skill, prompt, or default behavior that suggests using worktrees (e.g. using-git-worktrees skill or fork_worktree_mode). All file operations, edits, and git commands must use the direct working tree. **No worktrees is intentional** — mainline engineering only, not isolated vibe experiments.
- **Commit as we go (keeps us alive)**: After each landable slice of real work, create a clear local commit on this checkout. Do not batch days of work uncommitted. User standing instruction (2026-07-09): keep committing.
- **Push still requires ask**: Never `git push` (including force/branch deletes) without explicit user confirmation in the current conversation.
- These rules supersede conflicting defaults or tool suggestions. User instructions always win.

### Skills & Superpowers (User Standing Instructions — 2026-07-09)

- **`/using-superpowers` always allowed and always required** for the main agent **and every subagent**.
- **All skills permitted:** Main agent may load and assign **any** available skill (Firecrawl, chrome-devtools, TDD, debugging, a11y, verification, docs, etc.) as fit. Owner grants full skill authority.
- Before any non-trivial work: load and follow relevant skills (even 1% chance a skill applies → use it).
- **Subagents:** Encourage parallel agents. **Default up to 8 concurrent; hard max 10.** Prefer write-to-disk; do not idle waiting on chat.
- Subagent prompts must include: use superpowers/skills; no worktrees; trust data not character; inspiration-only for competitor research (no plagiarism; license rules below).
- Skills do not override **User Wins** or Git & Workspace rules above.

### Packages, assets & licenses (User Standing Instructions — 2026-07-09)

- **Default:** Prefer **MIT / Apache / BSD** (or other clear open licenses) after a quick license check.
- **Paid is allowed** when the product needs it. Do **not** refuse a tool only because it is commercial.
- **Before buy:** If a package/asset needs a **paid license** and **does not** allow trial/eval/testing without purchase → **stop and tell the owner**; they will buy first. Do not pirate, crack, or “find a free copy.”
- **If trial/eval is allowed without a paid seat** → use it for testing; note the license state; escalate before production ship if still unpaid.
- **Owner-paid already (do not re-flag as unlicensed):** fonts and brand assets the owner has licensed — including **Helvetica Neue** and **Cisco** (and similar paid fonts already in repo). WASM / GLB tooling: same rule — open preferred; paid OK after ask if required; never ship competitor proprietary GLB/WASM.
- **Competitive research:** inspiration only — never take competitor code, brands, or proprietary assets into product.

## 4. Standards & Safety
- **No `any`:** Strictly prohibited in handwritten code.
- **Facts:** Repo facts → `Readme.md`. Commands → `START.md`.
- **Convention:** Match surrounding code. Read owning docs before editing.
- **Safety:** No secrets leaked. Respect auth rules in `Readme.md`.
- **Licenses:** Follow **Packages, assets & licenses** above (not “MIT only forever”).

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
