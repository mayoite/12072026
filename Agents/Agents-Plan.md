# Agents/Agents-Plan.md

## 1. Authority
- **Docs:** Read `../AGENTS.md`, `../Readme.md`, and active lane in `../Plans/README.md`.

## 2. Discovery
- **No Guessing:** Verify live file paths. Do not assume.
- **Mismatch = Stop:** If repo conflicts with docs, STOP and report.
- **Underspecified = Ask:** Do not infer scope.

## 3. Plan Rules
- **Scope:** Smallest possible change. No silent fixes.
- **Format:** Exact canonical casing. Relative links only.
- **Content:** Exact files to modify. No implementation code unless architectural.
- **Respect Git Rules:** Follow the "Git & Workspace Rules (User Standing Instructions)" from `../AGENTS.md` (direct repo only; no worktrees ever; ask before any commit/push).

## 4. Verification
- **Evidence:** Explicitly state the verification strategy (commands and `results/` paths).
- **Proof Required:** A plan is incomplete without defining visible evidence.

## 5. Execution Gate
- **Approval Required:** NEVER execute without explicit user approval of the plan.
- **Blockers:** If blocked during execution, STOP and ask.