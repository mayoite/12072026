# Archived Draft: Final 3-Phase Plan: Tech Stack Docs

Superseded by `plans/wip/tech-stack-docs/PLAN.md`.

**Status:** Planning only.  
**Scope:** `tech-stack-generator/`, `Documents/`, repo scripts, and docs checks.

This is the master document for tech-stack docs work.

Supersedes and folds in:

- `plans/wip/tech-stack-docs-zero-manual-plan.md`
- `plans/wip/tech-stack-docs-generation-3-phase-plan.md`
- `plans/wip/tech-stack-docs-consolidation.md`

## Start

Goal:

Build one docs system where factual content is generated from live repo sources only, all generated outputs live under `Documents/`, and the interactive docs UI becomes a render-only surface over generated facts.

Success definition:

- one canonical source for each docs fact class
- one documented generated output tree under `Documents/`
- one sync/check flow for docs generation and drift detection
- no hand-maintained factual TSX pages, data files, or search facts
- no hardcoded factual content anywhere in the docs flow
- docs generation is owned by the `site` package, not by a separate package workflow
- fake tests and low-value coverage padding are removed
- contributors can answer where a docs fact comes from and how to refresh it in one step

Output location:

- all generated docs artifacts go under a structured `Documents/` folder
- current `tech-stack-docs/` output is moved under `Documents/`

Rules:

- no hardcoded factual content in docs pages, docs data, or docs search data
- no manual dependency versions, script lists, route lists, API lists, or feature claims
- no fake tests, synthetic-only coverage padding, or assertion-free tests counted as proof
- UI can render, sort, filter, and group data, but cannot invent facts
- if a fact has no canonical repo source, remove it or add typed source metadata first

Canonical sources:

- dependencies: root `package.json`, `site/package.json`, `tech-stack-generator/package.json`, `pnpm-lock.yaml`
- scripts: package `scripts`
- routes: `site/config/route-contract.json` first, route scan second
- API: `site/app/api/` plus route metadata
- structure: allowlisted repo tree
- database: Drizzle schema, migrations, SQL files, generated DB types if needed
- env: `.env.example`, validation scripts, config readers
- tests/build/deploy: package scripts, config files, CI files
- features: typed manifests only

Package ownership:

- the long-term owner of docs generation is the `site` package
- `tech-stack-generator/` may survive temporarily as a render shell during migration
- final scripts, generation logic, checks, and ownership must be driven from `site/package.json` and `site/scripts/`

## Phase 1: Remove Hardcoding And Lock Sources

Tasks:

1. Inventory hardcoded facts in `tech-stack-generator/`.
2. Remove manual facts from:
   - `src/pages/*.tsx`
   - `src/data/techStack.ts`
   - `src/hooks/useSearch.ts`
   - docs readmes that conflict with package truth
3. Classify each removed fact as:
   - generate from live source
   - move to typed metadata
   - delete as unsupported
4. Write one source-of-truth matrix for all docs sections.
5. Define the structured `Documents/` output contract.
6. Lock naming and ownership rules for:
   - source package
   - generated output
   - canonical source files
7. Define the migration from separate docs package ownership to `site` package ownership.
8. Mark forbidden manual fact locations.
9. Define unsupported sections up front instead of guessing.

Exit criteria:

- no hand-maintained factual page content remains
- no hardcoded versions, routes, scripts, APIs, or feature claims remain
- package ownership migration is decided and documented
- `Documents/` structure is fixed and documented
- every kept section has one canonical source

## Phase 2: Generate Facts And Make The UI Render-Only

Tasks:

1. Add one sync command:
   - `pnpm run docs:sync:tech-stack`
2. Generate deterministic artifacts:
   - `dependencies.generated.json`
   - `scripts.generated.json`
   - `routes.generated.json`
   - `api.generated.json`
   - `database.generated.json`
   - `features.generated.json`
   - `search.generated.json`
   - `pages.generated.json`
   - `Documents/_manifest.json`
   - `Documents/_sources.json`
3. Write all generated artifacts into a structured `Documents/` tree.
4. Move current `tech-stack-docs/` output into `Documents/` and treat that new path as the only generated output location.
5. Generate markdown outputs for human-readable docs where needed.
6. Replace manual page models with renderers over generated artifacts only.
7. Generate search from the same artifacts as the rendered pages.
8. Add source backlinks for each rendered fact group.
9. Keep only thin UI-only hardcoding such as labels, category order, and styles.
10. Move command ownership into `site/package.json` and generation logic into `site/scripts/`.
11. Update root references that point to the old docs topology.

Exit criteria:

- docs pages are render-only
- search is generated, not hand-maintained
- generated output lives only under `Documents/`
- generated markdown and generated data stay in sync
- docs generation runs from the `site` package as the canonical owner
- the same repo state always produces the same generated output

## Phase 3: Enforce Drift Checks And Coverage

Tasks:

1. Add commands:
   - `pnpm --filter oando-site run docs:sync:tech-stack`
   - `pnpm --filter oando-site run docs:check:tech-stack`
   - `pnpm --filter oando-site run docs:build:tech-stack`
   - `pnpm --filter oando-site run docs:typecheck:tech-stack`
   - `pnpm --filter oando-site run docs:test:tech-stack`
2. Fail when generated output is stale.
3. Fail when forbidden manual factual content appears.
4. Expand tests from package wiring into:
   - extractor tests
   - generated artifact determinism tests
   - renderer tests
   - source-backlink tests
   - forbidden-hardcoding tests
   - fake-test detection tests and audit checks
5. Add explicit fake-test gates:
   - fail tests with no real assertions
   - fail synthetic-only coverage padding
   - fail coverage claims that come from fixture-only or data-only execution without behavioral assertions
6. Update contributor guidance in:
   - `Readme.md`
   - `START.md`
   - `DOC-MAP.md`
   - `tech-stack-generator` docs readmes
7. Archive or remove deprecated docs paths only after replacement is live.
8. Enforce coverage thresholds for the docs system.

Coverage policy:

- target: `95%` statements, branches, functions, lines
- enforced floor: `80%` statements, branches, functions, lines
- coverage must come from real behavior tests, not smoke-only imports or fake tests

Exit criteria:

- CI fails on drift
- CI fails on new hardcoded factual content
- CI fails on fake tests or coverage padding
- docs-system coverage is at or above `80%`
- work is not considered finished to target until coverage reaches `95%`

## Handover

Handover is complete only when a new contributor can answer all of these:

- what command refreshes tech-stack docs
- what command checks for docs drift
- which files are canonical inputs
- which files under `Documents/` are generated
- which old paths are deprecated
- what is forbidden to edit manually

Handover package must include:

- final command list
- source-of-truth matrix
- `Documents/` file map
- known unsupported sections
- deprecated path list
- expected operator actions when sync/check fails

## Failures

Per `AGENTS.md`, log failures, skips, blockers, and follow-ups in `Failures.md`.

For this work, log at least:

- missing canonical sources
- sections removed because they are not machine-provable
- stale generated output incidents
- failed drift checks
- fake tests removed or blocked
- coverage padding removed or blocked
- failed coverage thresholds
- deferred path migrations
- skipped verification with reason

## Proof Standard

No accuracy claim is valid unless all three are true:

1. the fact exists in a canonical source
2. the generator emits it deterministically
3. the UI renders only that generated fact

## First Slice

1. remove `src/data/techStack.ts` as a factual source
2. remove manual factual entries from `src/hooks/useSearch.ts`
3. generate dependencies, scripts, routes, API, and search first
4. convert existing pages to generated inputs before deeper sections
