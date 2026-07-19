# WORKFLOW INSTRUCTIONS

## MOST IMPORTANT RULE  
- **User instructions override all other rules and instructions.**
- **INVOCATION** - INVOKED ONLY WHEN EXPLICITY INSTRUCTED BY THE USER - This is to be invoked when the user mentions the word workflow or 3 agent use or such similar languages/instructions.
- **WITHDRAWAL** - As per the users wishes and instructions- To be withdrawn immididately without delay when the user says stop workflow,single agent, remove agents or such similar languages/instructions.
- **Current owner request wins** when the user says stop workflow,single agent, remove agents or such similar languages/instructions.

## MULTI-AGENT WORKFLOW RULES
- Default = **Single agent**.
- When activated:
  - Use exactly **one writer + two peer reviewers**.
  - The parent is one of the reviewers.
  - One writer edits at a time.
- A peer FAIL blocks completion until fixed and re-reviewed.

## Core RULES
- Live code and fresh verification beat plans, notes, and old reports.
- Read relevant code before editing
- Make the smallest safe change.
- Preserve unrelated work.
- Do not use unsafe shortcuts, suppressed tests, or force-pushes.
- Do not claim browser behavior from a unit test.
- **RECORD REAL BLOCKERS** - Record real blockers in`Failures.md` - Keep reports short and factual. 
- Keep reports short and factual.  

## GENERAL RULES
- The user wins when the user says stop workflow,single agent, remove agents or such similar languages/instructions.
- Re-read this file before each task
- **DO NOT LIE** - Say the brutal truth. 
- **VERIFY CODE** - Never trust old ticks or reports.
- **KEEP SENTENCES SHORT** - Keep sentences short.
- **CLEAR GOALS ARE EXECUTED WITHOUT CEREMONY** - Clear goals are executed without ceremony.
- **GOAL CHANGES REQUIRE OWNER ALIGNMENT** - Goal changes require owner alignment.
- **QUALITY FLOOR** - `Agents/01 — Standard.md`.

## PRODUCT RULES
- **ADMIN MANAGES TRUSTED PUBLIC INVENTORY** - Admin manages trusted public inventory.     
- **SITE INFORMS PUBLIC VISITORS AND SENDS QUALIFIED CUSTOMERS TO PLANNER** - Site informs public visitors and sends qualified customers to Planner.
- **PLANNER SERVES ANY EXTERNAL CUSTOMER** - Planner serves any external customer.
- **SECURITY VERIFIES PROTECTED DATA, PERMISSIONS, INTEGRATIONS, AND RELEASES** - Security verifies protected data, permissions, integrations, and releases.
- **UI AND ACCESSIBILITY ARE ACCEPTANCE CONCERNS** - UI and accessibility are acceptance concerns.
- **THEY ARE NOT SEPARATE PRODUCT TRACKS** - They are not separate product tracks.

## LAYOUT RULES
- Execution lives in the checklists under `plan/Admin/`, `plan/Planner/`, `plan/Site/`, and `plan/Security/` - Execution lives in the checklists under `plan/Admin/`, `plan/Planner/`, `plan/Site/`, and `plan/Security/`.
- No work is deferred to a later decision bucket
- Product and architecture facts live in `docs/` - Product and architecture facts live in `docs/`.
- Agent process lives in `Agents/` - Agent process lives in `Agents/`.
- Agent-authored reports belong only in `agent-reports/` - Agent-authored reports belong only in `agent-reports/`.
- Active blockers live in `Failures.md` - Active blockers live in `Failures.md`.
- `results/` is tool output only. - `results/` is tool output only.
- Do not write Markdown reports under `results/` - Do not write Markdown reports under `results/`.
- Never use `results/` as proof of PASS or completion. - Never use `results/` as proof of PASS or completion.
- Never write under `site/results/` or `site/test-results/`. - Never write under `site/results/` or `site/test-results/`.
- `site/` contains product code only. - `site/` contains product code only.
- `websites/` and `.archive/` are reference only.

## EXECUTION RULES
- Test isolation is the first plan task - Test isolation is the first plan task.
- Tests never mutate canonical catalog files. - Tests never mutate canonical catalog files.
- Block only the exact dependent item - Block only the exact dependent item.
- Continue unrelated work - Continue unrelated work.
- Use `pnpm` from the repository root - Use `pnpm` from the repository root. - Use `pnpm` from the repository root.
- Never run package installation inside `site/` or `tech-docs-generator/` - Never run package installation inside `site/` or `tech-docs-generator/`.
- No `any` in handwritten code. - No `any` in handwritten code.
- Facts, tests, and operations: `Readme.md` - Facts, tests, and operations: `Readme.md`.

## Authority
1. Current owner request wins.
2. Live code and fresh verification beat plans, notes, and old reports.
3. Do not invent requirements, scope, or success claims.
4. If the request is unclear, ask one focused question before changing code.

## Core rules
- **READ RELEVANT CODE BEFORE EDITING** - Read relevant code before editing.
- **MAKE THE SMALLEST SAFE CHANGE** - Make the smallest safe change.
- **PRESERVE UNRELATED WORK** - Preserve unrelated work.
- **DO NOT USE UNSAFE SHORTCUTS, SUPPRESSED TESTS, FORCE-PUSHES, OR FAKE PROOF** - Do not use unsafe shortcuts, suppressed tests, force-pushes, or fake proof.
- **DO NOT CLAIM BROWSER BEHAVIOR FROM A UNIT TEST** - Do not claim browser behavior from a unit test.
- **DO NOT CLAIM WORK IS DONE WITHOUT FRESH EVIDENCE** - Do not claim work is done without fresh evidence.
- **RECORD REAL BLOCKERS CLEARLY AND CONTINUE UNRELATED WORK WHEN POSSIBLE** - Record real blockers clearly and continue unrelated work when possible.
- **KEEP REPORTS SHORT AND FACTUAL** -Keep reports short and factual.

## Normal workflow
1. **INSPECT THE RELEVANT CODE AND CURRENT BEHAVIOR** - Inspect the relevant code and current behavior.
2. **MAKE THE SMALLEST VALID CHANGE** - Make the smallest valid change.
3. **RUN THE SMALLEST RELEVANT VERIFICATION** - Run the smallest relevant verification.
4. **USE BROWSER VERIFICATION FOR UI CHANGES** - Use browser verification for UI changes.
5. **RUN THE LAYOUT CHECK BEFORE COMPLETION** - Run the layout check before completion.
6. **REPORT: CHANGED, VERIFIED, BLOCKED, AND NEXT ACTION** - Report: changed, verified, blocked, and next action.

## Rule references
- **STANDARD RULES** - [`01 — Standard.md`](Agents/01 — Standard.md)
- **TESTING RULES** - [`02 — Testing.md`](Agents/02 — Testing.md)
- **BROWSER RULES** - [`03 — Browser.md`](Agents/03 — Browser.md)
- **FAILURES RULES** - [`04 — Failures.md`](Agents/04 — Failures.md)
- **DOCUMENTATION RULES** - [`05 — Documentation.md`](Agents/05 — Documentation.md)
- **ARCHITECTURE RULES** - [`06 — Architecture.md`](Agents/06 — Architecture.md)
- **CSS RULES** - [`07 — CSS.md`](Agents/07 — CSS.md)

## Completion
- **BEFORE SAYING DONE** - Before saying done:
- **CONFIRM THE CHANGED BEHAVIOR WITH FRESH EVIDENCE** - Confirm the changed behavior with fresh evidence.
- **STATE WHAT WAS NOT VERIFIED** - State what was not verified.
- **STATE ACTIVE RISKS OR BLOCKERS HONESTLY** - State active risks or blockers honestly.

**DO NOT MODIFY AGENT MARKDOWN FILES UNLESS THE USER EXPLICITLY APPROVES OR DIRECTLY INSTRUCTS THE CHANGE** - Do not modify Agent markdown files unless the user explicitly approves or directly instructs the change.

**ROOT `AGENTS.md` WINS IF ANYTHING CONFLICTS** - Root `AGENTS.md` wins if anything conflicts. - Root `AGENTS.md` wins if anything conflicts.

## Rules
- **STANDARD RULES** - `01 — Standard.md`
- **TESTING RULES** - `02 — Testing.md`
- **BROWSER RULES** - `03 — Browser.md`
- **FAILURES RULES** - `04 — Failures.md`
- **DOCUMENTATION RULES** - `05 — Documentation.md`
- **ARCHITECTURE RULES** - `06 — Architecture.md`
- **CSS RULES** - `07 — CSS.md`

## Role References
Workflow files are not to be touched unless the owner explicitly asks.

- `A — UI Researcher.md`
- `B — Executor.md`
- `C — Critic.md`
