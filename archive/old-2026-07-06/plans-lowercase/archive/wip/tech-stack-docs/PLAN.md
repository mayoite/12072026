# Tech Stack Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate human-readable tech-stack documentation with 100% provenance coverage, exact field-level source matching, copied site CSS, and standalone Vite output.

**Architecture:** Monorepo-root scripts extract canonical facts, normalize them once, generate JSON/Markdown/search/page data, and copy canonical site CSS into the Vite package. The separate Vite renderer consumes only generated local inputs and builds to `Documents/tech-stack-docs/`.

**Tech Stack:** Node.js ESM, TypeScript, Zod, ts-morph, Vitest, React, and Vite.

---

## Execution Rules

- Follow `START.md` and the approved `DESIGN.md`.
- Do not run tests, builds, coverage, or Playwright without explicit user permission.
- Do not commit, push, publish, migrate, or destructively delete without explicit user permission.
- Log skips and failures in this packet's `FAILURES.md` and material issues in root `Failures.md`.
- Log each failed or skipped generation, check, test, build, and coverage command immediately; include date, phase, command, evidence, impact, and required action.
- Implement exactly three phases and prove each phase exit before starting the next.

## Source Precedence

1. Dependencies: manifests provide requested ranges; `pnpm-lock.yaml` provides resolved versions. Emit both.
2. Commands: package `scripts` are authoritative.
3. Routes: `site/app/**/page.tsx` proves existence; `site/config/route-contract.json` adds metadata. Missing-route metadata fails.
4. APIs: `site/app/api/**/route.ts` proves paths and exported methods. Metadata may describe but cannot override them.
5. Environment: `.env.example` provides documented names; readers and validators provide usage and required status. Conflicts are emitted and fail strict checks.
6. Database: migrations describe history, `site/platform/drizzle/schema.ts` describes current Drizzle state, and generated Supabase types describe external state. Conflicts are reported, never merged silently.
7. Features: only typed feature metadata can produce feature claims. Folder existence alone is insufficient.
8. Build, test, and deploy: checked-in scripts and configuration are authoritative.
9. Structure: only allowlisted repository-relative POSIX paths may be emitted.

## Phase 1: Contracts, Inventory, And Safety

**Execution status (2026-07-01):** Complete.

### Task 1: Define Schemas And Source Policy

**Files:**

- Create: `tech-stack-generator/scripts/schema.mjs`
- Create: `tech-stack-generator/scripts/source-policy.mjs`
- Create: `tech-stack-generator/tests/generator/schema.test.ts`
- Create: `tech-stack-generator/tests/generator/source-policy.test.ts`

- [ ] Define `FactField` as `{ value, sourcePath, sourceKind, sourcePointer }`.
- [ ] Define schemas for normalized facts, conflicts, pages, search records, `_sources.json`, `_accuracy.json`, and `_manifest.json`.
- [ ] Encode the precedence rules above as data, not scattered conditionals.
- [ ] Write tests proving missing provenance and source conflicts are rejected.
- [ ] With test permission, run:

```powershell
pnpm --filter oando-tech-stack-docs exec vitest run tests/generator/schema.test.ts tests/generator/source-policy.test.ts
```

Expected: tests pass; malformed provenance and conflicting precedence fail validation.

### Task 2: Define Deterministic Filesystem Safety

**Files:**

- Create: `tech-stack-generator/scripts/filesystem.mjs`
- Create: `tech-stack-generator/tests/generator/filesystem.test.ts`

- [ ] Require `Documents/.generated-root` with exact content `oando-tech-stack-docs:v1\n`.
- [ ] Stage output under `.tmp/tech-stack-docs/Documents/`.
- [ ] Define canonical output as UTF-8, LF, two-space JSON, final newline, sorted keys/arrays, and POSIX relative paths.
- [ ] Exclude timestamps, drive letters, absolute paths, and `_manifest.json` self-hashing.
- [ ] Replace or remove only files listed by the previous manifest.
- [ ] Fail without deletion when `Documents/` contains an unknown file.
- [ ] Write tests for empty initialization, unknown-file refusal, manifest-owned replacement, and stable hashes.
- [ ] With test permission, run:

```powershell
pnpm --filter oando-tech-stack-docs exec vitest run tests/generator/filesystem.test.ts
```

Expected: safe cases pass; unknown files and unsafe paths fail without deletion.

### Task 3: Inventory Existing Claims

**Files:**

- Create: `tech-stack-generator/scripts/inventory.mjs`
- Generate: `plans/wip/tech-stack-docs/claim-inventory.json`
- Modify: `plans/wip/tech-stack-docs/FAILURES.md`
- Modify: `Failures.md`

- [ ] Scan `tech-stack-generator/src/pages/`, `src/data/techStack.ts`, `src/hooks/useSearch.ts`, tests, and package readmes.
- [ ] Classify each claim as generated fact, typed metadata, UI-only, or unsupported.
- [ ] Record exact canonical source pointers for every retained field.
- [ ] Record unsupported architecture, security, deployment, database, and feature narrative instead of guessing.
- [ ] Do not remove renderer content during Phase 1.

Phase 1 exit:

- Schemas, precedence, deterministic serialization, and replacement safety are tested.
- Every retained factual field has one extraction rule.
- Unsupported claims and missing metadata are explicitly logged.

## Phase 2: Deterministic Generation And Atomic Renderer Migration

**Execution status (2026-07-01):** Partial. Core generator, extractors, JSON/Markdown rendering, CSS sync, root docs commands, and generator tests exist. Remaining blocker: `tech-stack-generator/vite.config.ts` still points to `../Documents/tech-stack-generated`.

### Task 4: Implement Extractors And Normalization

**Files:**

- Create: `tech-stack-generator/scripts/extract-dependencies.mjs`
- Create: `tech-stack-generator/scripts/extract-commands.mjs`
- Create: `tech-stack-generator/scripts/extract-routes.mjs`
- Create: `tech-stack-generator/scripts/extract-api.mjs`
- Create: `tech-stack-generator/scripts/extract-environment.mjs`
- Create: `tech-stack-generator/scripts/extract-database.mjs`
- Create: `tech-stack-generator/scripts/extract-features.mjs`
- Create: `tech-stack-generator/scripts/normalize.mjs`
- Create: `tech-stack-generator/tests/generator/extractors.test.ts`

- [ ] Write a failing behavior test for each source class and conflict rule.
- [ ] Implement pure extractors returning schema-validated records.
- [ ] Normalize all records into one model used by every output.
- [ ] Prohibit unsupported feature claims when typed metadata is absent.
- [ ] With test permission, run:

```powershell
pnpm --filter oando-tech-stack-docs exec vitest run tests/generator/extractors.test.ts
```

Expected: canonical inputs pass; missing, malformed, and conflicting sources fail with paths.

### Task 5: Generate Data, Markdown, Search, And Provenance

**Files:**

- Create: `tech-stack-generator/scripts/render-json.mjs`
- Create: `tech-stack-generator/scripts/render-markdown.mjs`
- Create: `tech-stack-generator/scripts/render-search.mjs`
- Create: `tech-stack-generator/scripts/generate.mjs`
- Create: `tech-stack-generator/scripts/check.mjs`
- Create: `tech-stack-generator/tests/generator/generation.test.ts`

- [ ] Generate `Documents/data/`, `_sources.json`, `_accuracy.json`, and `_manifest.json` from one model.
- [ ] Generate this exact Markdown structure:

```text
Documents/markdown/
  overview/index.md
  architecture/index.md
  architecture/repository-structure.md
  dependencies/index.md
  commands/index.md
  routes-and-api/routes.md
  routes-and-api/api.md
  environment/index.md
  database/index.md
  testing/index.md
  testing/coverage.md
  build-and-deploy/index.md
  features/index.md
  governance/provenance.md
  governance/unsupported.md
```

- [ ] Add a generated source section to every Markdown file.
- [ ] Require every Markdown factual value to reference a normalized fact identifier.
- [ ] Keep Markdown human-readable without introducing factual values not present in the model.
- [ ] Populate `_accuracy.json` with `totalFactualFields`, `fieldsWithProvenance`, `exactSourceMatches`, `mismatches`, and per-document fact counts.
- [ ] Fail generation unless provenance and exact-source matches both equal total factual fields and `mismatches` is empty.
- [ ] Generate `governance/provenance.md` from `_accuracy.json` and `governance/unsupported.md` from omitted claims.
- [ ] Validate staging completely before manifest-owned replacement.
- [ ] Make check mode generate in staging and compare without modifying final output.
- [ ] Write a two-run test requiring byte-identical output.
- [ ] Write drift tests for changed values, missing output, unexpected output, and broken source pointers.

### Task 6: Synchronize Site CSS Into The Vite Package

**Files:**

- Create: `tech-stack-generator/scripts/sync-css.mjs`
- Create: `tech-stack-generator/src/generated-css/.gitkeep`
- Create: `tech-stack-generator/tests/generator/css-sync.test.ts`
- Modify: `tech-stack-generator/src/index.css`

- [ ] Copy canonical site CSS and required relative imports into `tech-stack-generator/src/generated-css/`.
- [ ] Record source paths and hashes in `_sources.json`.
- [ ] Make Vite import only the copied local CSS.
- [ ] Refresh the snapshot on every generation/build.
- [ ] Warn and retain the last validated snapshot if canonical CSS is unavailable.
- [ ] Fail when both canonical CSS and a validated snapshot are unavailable.
- [ ] Test refresh, changed hashes, fallback warning, and total absence.

### Task 7: Convert The Vite UI To Generated Inputs

**Files:**

- Create: `tech-stack-generator/src/generated-data/index.ts`
- Modify: `tech-stack-generator/src/data/techStack.ts`
- Modify: `tech-stack-generator/src/hooks/useSearch.ts`
- Modify: `tech-stack-generator/src/pages/*.tsx`
- Modify: `tech-stack-generator/src/data/navigation.ts`
- Modify: `tech-stack-generator/src/types/index.ts`
- Modify: `tech-stack-generator/vite.config.ts`

- [ ] Replace factual arrays and prose atomically with imports from generated data.
- [ ] Generate search and navigation from the same page model.
- [ ] Keep only allowlisted labels, layout, styles, and accessibility text in renderer source.
- [ ] Change Vite `outDir` to `../Documents/tech-stack-docs`.
- [ ] Fail if legacy root `tech-stack-docs/` reappears.
- [ ] Preserve the separate Vite package and standalone output.

### Task 8: Wire Root Commands And Documentation

**Files:**

- Modify: `package.json`
- Modify: `tech-stack-generator/package.json`
- Modify: `Readme.md`
- Modify: `START.md`
- Modify: `DOC-MAP.md`
- Modify: `tech-stack-generator/README.md`
- Modify: `tech-stack-generator/Readme_Techstack.md`
- Modify: `site/scripts/generate-contents-md.mjs`

- [ ] Add root-owned `docs:sync:tech-stack`, `docs:check:tech-stack`, `docs:build:tech-stack`, `docs:typecheck:tech-stack`, and `docs:test:tech-stack`.
- [ ] Make build run CSS sync, factual generation, Vite typecheck, then Vite build.
- [ ] Remove stale manual-update and old-output instructions.
- [ ] Update generated folder manifests at their canonical generator source.
- [ ] With permission, run:

```powershell
pnpm run docs:sync:tech-stack
pnpm run docs:check:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:build:tech-stack
```

Expected: no drift; typecheck passes; output exists only at `Documents/tech-stack-docs/`; a second sync changes no bytes.

Phase 2 exit:

- Root commands own cross-package generation.
- Data, Markdown, search, pages, and UI share one normalized model.
- CSS is refreshed into `tech-stack-generator/src/generated-css/`.
- Vite output is standalone and deterministic.

## Phase 3: Enforcement, Test Quality, Coverage, And Handover

**Execution status (2026-07-01):** Partial. Hardcoding guard, fake-test audit, coverage gate logic, root docs gate wiring, and CI workflow exist. Remaining unproven items are full docs gate rerun, final coverage proof, and final Vite output-path alignment.

### Task 9: Add Hardcoding And Provenance Gates

**Files:**

- Create: `tech-stack-generator/scripts/hardcoding-guard.mjs`
- Create: `tech-stack-generator/tests/generator/hardcoding-guard.test.ts`
- Create: `tech-stack-generator/tests/generator/provenance.test.ts`

- [ ] Use ts-morph to reject factual literals in pages, search, data modules, and tests outside the explicit UI allowlist.
- [ ] Require rendered factual values to originate from generated imports.
- [ ] Compare every emitted factual field with its source pointer.
- [ ] Compare every Markdown fact identifier and rendered UI fact against `_accuracy.json`.
- [ ] Fail when any Markdown file lacks its generated source section.
- [ ] Add deliberate mutation cases for versions, routes, APIs, hashes, and backlinks.

### Task 10: Remove Fake Coverage And Enforce Thresholds

**Files:**

- Create: `tech-stack-generator/scripts/fake-test-audit.mjs`
- Modify: `tech-stack-generator/tests/*.test.ts`
- Modify: `tech-stack-generator/vitest.config.ts`
- Modify: `tech-stack-generator/package.json`

- [ ] Audit assertion-free, import-only, fixture-only, copied-constant, mock-only, unreachable-branch, and coverage-padding tests.
- [ ] Replace synthetic tests with observable generator, search, and renderer behavior tests.
- [ ] Include production code under `tech-stack-generator/scripts/**` and `tech-stack-generator/src/**`.
- [ ] Exclude generated files, declarations, tests, and configuration-only files.
- [ ] Fail any metric below 80%.
- [ ] Pass with warning when any metric is 80% through 94.99%.
- [ ] Pass without warning and qualify for completion only when all metrics are at least 95%.

### Task 11: Final Gate And Handover

**Files:**

- Modify: `package.json`
- Modify: `plans/wip/tech-stack-docs/TEST.md`
- Modify: `plans/wip/tech-stack-docs/HANDOVER.md`
- Modify: `plans/wip/tech-stack-docs/FAILURES.md`
- Modify: `Failures.md`

- [ ] Add drift, provenance, hardcoding, fake-test, coverage, typecheck, and build checks to the docs gate.
- [ ] Integrate the docs gate into a wider release gate only after runtime is measured and approved.
- [ ] Deliberately prove each acceptance challenge in `TEST.md`.
- [ ] Resolve or assign every failure and complete the handover checklist.
- [ ] Log every failed or skipped command in both required failure logs before retrying or handing over.
- [ ] With permission, run:

```powershell
pnpm run docs:test:tech-stack
pnpm run docs:check:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:build:tech-stack
```

Expected: behavioral checks pass; deliberate mutations fail; `_accuracy.json` proves 100% provenance and exact field matches; all metrics are at least 80%; completion requires all metrics at 95%.

Phase 3 exit:

- Drift, unsupported hardcoding, fake tests, provenance mismatches, and sub-80% coverage fail.
- `_accuracy.json` reports zero mismatches and 100% provenance/exact-source matches.
- Every required Markdown file exists in its structured folder with a generated source section.
- Every failure, skip, blocker, and follow-up is logged.
- Coverage from 80% through 94.99% warns and remains incomplete.
- All metrics at 95% or higher pass without warning.
- Handover is complete.

No commit step is included. Committing requires separate explicit user permission.
