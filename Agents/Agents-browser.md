# Agents/Agents-browser.md

## 1. Authority
- **Head bar:** `Agents-ELON-STANDARD.md` (phase grain, honesty, backup).
- **Docs:** Read `../testing-handbook.md` and `../Readme.md`.
- **Gate policy:** `../Failures.md` — no full E2E/Playwright on every task by default.

## 2. Verification Protocol
- **No Hallucinations:** Never claim a layout is "correct" or "visible" without Playwright traces, chrome-devtools proof, or E2E passes in `results/`.
- **Tools:** Playwright for scripted e2e; **chrome-devtools** MCP for live debug / a11y snapshots when the task needs UI proof.
- **Targeted Subagents:** Strictly define subagent task, stopping condition, and exact output.

## 3. Execution
- **When:** Browser/E2E only if the **phase task** requires UI proof, phase gate, release, or owner ask.
- **Scope:** Prefer modified routes / targeted specs — not the whole monorepo pack unless the gate says so.
- **Evidence:** Save Playwright HTML, JSON, traces, screenshots (and DevTools notes) under repo-root `results/`.

## 4. Sanity Rules
- **Zero Bypass:** Do not ignore accessibility (a11y) checks or console errors to force a pass.
- **Port Conflict:** Log in `../Failures.md`; fix or stop — hard stop only if environment blocks the phase and no safe path exists.

## 5. Escalation
- **Optional:** Unscriptable visual judgment → ask owner. Normal multi-step UI automation → agent takes the call with evidence.
