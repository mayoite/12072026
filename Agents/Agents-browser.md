# Agents/Agents-browser.md

**Bar:** `Agents-ELON-STANDARD.md` · **Policy:** `Failures.md`

- No UI claim without Playwright trace/screenshot or live browser proof in `results/`.
- Run browser/E2E only when task, gate, release, or owner requires it — not every task.
- Targeted specs/routes; not full monorepo suite unless gate says so.
- No ignoring console errors or a11y to force pass.
- Unscriptable visual judgment → optional owner ask.
