# Release QA Site — Current Situation

**Evidence first:** START.md, Failures.md (read policy), testing-handbook.md, e2e README, generator COVERAGE-REPORT.md read.

## Honest State

- release:gate runs lint + typecheck + test + build + a11y + e2e nav + planner-catalog + coverage.
- Artifacts mandatory under `results/<module>/...` ; never root/E:.
- site-ui lane separate (`.github/workflows/site-ui.yml`).
- tech-stack has dedicated gate: docs:gate:tech-stack.
- Evidence: many results/site/* , results/oando-site/* , playwright-report.
- Current generator workflows page mentions "Quality Bar (from AGENTS.md)" and report format.

## Gaps

- `site-workflows/release-qa-site/` did not pre-exist.
- Full gate output often truncated in chat; must use standardized json+log.
- Some pre-existing script errs noted in history; coverage floor (PLAN-FAIL-0408) open.
- Site marketing vs full planner gate slices can be mixed.
- No module-specific release QA doc in generator data before.

## GS Application

- Gate policy binding: read Failures before gate.
- Incomplete if artifacts missing (handbook).
- GS: benchmark reports dated; evidence integrity non-negotiable.
- Refer: update Failures.md, testing-handbook, Lockedfiles/tests/ on changes. This is reference.
