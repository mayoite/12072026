# BROWSER USE

## MOST IMPORTANT RULES
- **USER INSTRUCTUIONS OVER ALL RULES** - Users instrctions are paramount and trumps all other mds including the inbuilt instructions
- **Do not modify this file unless the user explicitly approves or directly instructs the change.**

## 1. Authority
- **Docs:** Read `../Testing-handbook.md` and `../Readme.md`.

## 2. Verification Protocol
- **No Hallucinations:** Never claim a layout is "correct" or "visible" without Playwright traces or E2E passes in `results/`.

## 3. Execution
- **Scope:** Execute E2E tests only for modified routes.
- **Evidence:** Save all Playwright HTML, JSON, traces, and screenshots to `results/`.

## 4. Sanity Rules
- **Zero Bypass:** Do not ignore accessibility (a11y) checks or console errors to force a pass.
- **Port Conflict = Stop:** If environment fails or ports conflict, STOP and log in `../Failures.md`.
