# Tech Stack Docs Failures

**Current status:** All recorded Phase 3 blockers were resolved on 2026-07-01. The full `pnpm run docs:gate:tech-stack` passed with all four coverage metrics above 95%.

[2026-07-01] Final handover update invalidated renderer metadata.
- Command: `pnpm run docs:check:tech-stack`
- Evidence: `_accuracy-renderer.json: stale renderer accuracy report`.
- Impact: handover edits changed the integrity fingerprint after the passing gate.
- Required action: sync and rerun the full gate.
[2026-07-01] Final gate wrapper timed out after reaching the production build.
- Command: `pnpm run docs:sync:tech-stack; pnpm run docs:gate:tech-stack`
- Evidence: the 122-second command timeout occurred after coverage, typecheck, tests, and the Vite build command ran.
- Impact: final exit status was not captured.
- Required action: rerun with a longer timeout and make no later tracked edits.

Track plan-specific failures, skips, blockers, and follow-ups here. Mirror meaningful repository-level items in root `Failures.md`.

Every failed or skipped generation, check, test, build, or coverage command must be added before retrying. Include the command and evidence in `Item`, and the impact plus next action in `Required action`.

| Date | Phase | Status | Item | Required action |
|---|---|---|---|---|
| 2026-06-27 | Start | Open | Implementation has not started. | Execute Phase 1. |
| 2026-06-27 | Start | `[~]` | `Readme.md` now uses repo-root wording (2026-06-28). Vite `outDir` migration still open. |
| 2026-06-27 | Test | Skipped | No tests ran during plan consolidation. | Obtain explicit user permission. |
| 2026-06-27 | Test | Skipped | No tests ran during the 100% accuracy and Markdown-structure plan recheck. | Obtain explicit user permission before implementation verification. |
| 2026-06-27 | Output | Open | Vite output path still drifts. Current live blocker: `tech-stack-generator/vite.config.ts` still builds to `../Documents/tech-stack-generated` instead of `../Documents/tech-stack-docs`. | Change `vite.config.ts` and rerun the docs gate. |
| 2026-06-27 | Dependency | Open | Root generator dependencies such as Zod and ts-morph are currently declared only by `site`. | Declare generator tooling at the correct workspace boundary during command integration. |
| 2026-06-27 | Discovery | Resolved | CSS source-mapping command failed on missing `site/app/globals.css`; output proved `site/app/css/index.css` is the canonical entry. | Use `site/app/css/index.css`; no implementation impact. |
| 2026-06-27 | Phase 1 | Resolved | Initial schema/source-policy test run failed because missing-provenance errors did not expose the field path. | Error reporting was corrected; rerun passed 4 tests. |

Future entries must include missing sources, unsupported sections, stale output, failed checks, fake tests, coverage padding, threshold failures, deferred migrations, and skipped verification.
[2026-07-01] Phase 3 coverage test assertion failed after adding a resolved-only case.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: the test received the expected additional `Runtime` item but its list assertion still expected four items.
- Impact: coverage stopped on a stale assertion.
- Required action: include the new item in the assertion, run the targeted test, sync, and rerun.
[2026-06-27] Phase 2 env extractor test failed.
- Command: `pnpm --dir tech-stack-generator exec vitest run tests/generator/extractors.test.ts`
- Evidence: `EISDIR: illegal operation on a directory, read` from `tech-stack-generator/scripts/extract-environment.mjs:46`.
- Impact: environment scanning is reading a directory entry instead of only files.
- Required action: tighten the workspace walker or skip non-files before `readFileSync`.
[2026-06-27] Phase 2 feature extractor test failed.
- Command: `pnpm --dir tech-stack-generator exec vitest run tests/generator/extractors.test.ts`
- Evidence: `Cannot find module 'D:\\OOFPLWeb\\node_modules\\typescript\\lib\\typescript.js'` from `tech-stack-generator/scripts/extract-features.mjs:8`.
- Impact: typed planner feature metadata cannot be parsed with the current hardcoded TypeScript path.
- Required action: resolve `typescript` via package resolution or the local package install path.
[2026-07-01] Phase 3 gate rerun skipped.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: only targeted rerun was `pnpm --dir tech-stack-generator exec vitest run tests/generator/generation.test.ts tests/generator/filesystem.test.ts` with `10/10` passing.
- Impact: the latest output-path corrections are not yet proven by the full docs gate.
- Required action: fix `tech-stack-generator/vite.config.ts` to `../Documents/tech-stack-docs` and rerun the full docs gate.
[2026-07-01] Phase 3 docs gate failed on committed drift.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: `Generated output does not match Documents/` with manifest and generated-file hash mismatches including `data/index.json`, `data/search.json`, `data/dependencies.json`, and Markdown architecture/build/overview pages.
- Impact: generated docs tree was stale relative to the current generator implementation, so the gate stopped before coverage/typecheck/build.
- Required action: run `pnpm run docs:sync:tech-stack` and rerun the docs gate.
[2026-07-01] Phase 3 docs sync failed on unknown legacy output.
- Command: `pnpm run docs:sync:tech-stack`
- Evidence: `Unknown file(s) in Documents/` under legacy `Documents/tech-stack-generated/**`.
- Impact: manifest safety refused to overwrite `Documents/` while obsolete legacy Vite output still existed at the old path.
- Required action: archive or remove legacy `Documents/tech-stack-generated/`, then rerun sync.
[2026-07-01] Phase 3 docs gate failed in renderer coverage tests.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: `TypeError: Cannot read properties of undefined (reading 'value')` from `tech-stack-generator/src/data/techStack.ts:38`, triggered by `tests/app-overlay.test.tsx`, `tests/rendering.test.tsx`, and `tests/package.test.ts`.
- Impact: renderer adapter still expects the old dependency record shape (`resolved` / `requested`) while generated data now uses normalized fact records.
- Required action: update `src/data/techStack.ts` to consume normalized dependency facts, then rerun the docs gate.
[2026-07-01] Phase 3 docs gate failed on stale renderer accuracy metadata.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: `Renderer accuracy failed (1): _accuracy-renderer.json: stale renderer accuracy report — run docs:sync:tech-stack`.
- Impact: renderer source changed after the last generated-data sync, so `checkDocs` rejected stale renderer accuracy output before rerunning the rest of the gate.
- Required action: rerun `pnpm run docs:sync:tech-stack`, then rerun the docs gate.
[2026-07-01] Phase 3 coverage failed on a stale dependency mock.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: `data-branch-coverage.test.ts` expected four categories but received none.
- Impact: the mock still used the removed nested dependency shape.
- Required action: update the mock to normalized fact records and rerun the gate.
[2026-07-01] Phase 3 gate retry found stale renderer accuracy metadata.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: `_accuracy-renderer.json: stale renderer accuracy report`.
- Impact: the integrity report predates the test correction.
- Required action: sync generated metadata and rerun the gate.
[2026-07-01] Phase 3 coverage threshold failed.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: statements 98.8%, branches 92.51%, functions 99.35%, lines 99.35%.
- Impact: branch coverage was below the required 95% completion threshold.
- Required action: cover meaningful dependency fallbacks, remove unreachable fallbacks, sync, and rerun.
[2026-07-01] Phase 3 docs gate retry failed on generated output drift.
- Command: `pnpm run docs:gate:tech-stack`
- Evidence: manifest and `_sources.json` hashes differed from `Documents/`.
- Impact: the final gate stopped before coverage, typecheck, and build.
- Required action: rerun `pnpm run docs:sync:tech-stack`, then rerun the docs gate.
