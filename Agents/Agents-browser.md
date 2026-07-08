# Agents/Agents-browser.md

## 1. Authority
- **Docs:** Read `../testing-handbook.md` and `../Readme.md`.

## 2. Verification Protocol
- **No Hallucinations:** Never claim a layout is "correct" or "visible" without Playwright traces or E2E passes in `results/`.
- **Targeted Subagents:** Strictly define subagent task, stopping condition, and exact output.

## 3. Execution
- **Scope:** Execute E2E tests only for modified routes.
- **Evidence:** Save all Playwright HTML, JSON, traces, and screenshots to `results/`.

## 4. Sanity Rules
- **Zero Bypass:** Do not ignore accessibility (a11y) checks or console errors to force a pass.
- **Port Conflict = Stop:** If environment fails or ports conflict, STOP and log in `../Failures.md`.

## 5. Escalation
- **Complex UI = Stop:** If visual check is too complex for automated script, STOP and ask user to manually verify.
