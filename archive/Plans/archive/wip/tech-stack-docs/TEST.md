# Tech Stack Docs Test Standard

## Permission

Do not run tests, Playwright, test-like builds, or coverage without explicit user permission.

## Planned Commands

```powershell
pnpm run docs:check:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:test:tech-stack
pnpm run docs:build:tech-stack
```

## Required Behavior Tests

- canonical-source extraction
- malformed-source and schema failures
- deterministic generation and ordering
- stale, missing, unexpected, and modified output detection
- forbidden-hardcoding detection with UI-only exceptions
- renderer and search behavior from generated artifacts
- source-backlink and manifest integrity
- full regeneration and ownership enforcement for `Documents/`
- structured Markdown folder and source-trace validation
- exact required Markdown file-map validation
- generated source-section validation for every Markdown file
- `_accuracy.json` totals, exact matches, mismatches, and per-document fact counts
- copied CSS refresh and validated fallback under `tech-stack-generator/src/generated-css/`
- standalone output enforcement at `Documents/tech-stack-generated/`
- exact canonical-source comparison for every emitted factual statement

## Fake-Test Rejection

Tests without meaningful assertions, import-only tests, copied-constant assertions, fixture-only execution, mock-only bypasses, and unreachable coverage branches do not count.

Every test must exercise production behavior and assert an observable result or failure.

## Accuracy Gate

Generation and build fail unless:

- all factual fields have provenance
- all factual fields exactly match normalized canonical sources
- `_accuracy.json` has zero mismatches
- every Markdown factual value maps to a fact identifier
- every required Markdown file contains a generated source section

## Coverage

| Metric | Enforced floor | Completion target |
|---|---:|---:|
| Statements | 80% | 95% |
| Branches | 80% | 95% |
| Functions | 80% | 95% |
| Lines | 80% | 95% |

Any metric below 80% fails. A metric from 80% through 94.99% passes with warning and remains incomplete. All four metrics must reach 95% to pass without warning and complete the work.

## Acceptance Challenges

Prove checks fail when a version or route changes without regeneration, any `Documents/` file is manually edited or missing, Markdown is written outside its approved subject folder, a generated fact differs from its canonical source, root `tech-stack-docs/` reappears, a fact is hardcoded in UI/search, an unexpected output appears, or an assertion-free coverage test is introduced. Also prove CSS refresh, validated fallback, and failure when both source CSS and snapshot are absent.

Every failed or skipped command must be logged immediately in the packet `FAILURES.md`; material issues must also be added to root `Failures.md`.
