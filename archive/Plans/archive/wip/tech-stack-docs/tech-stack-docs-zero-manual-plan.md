# Archived Draft: Plan: Zero-Manual Tech Stack Documentation

Superseded by `plans/wip/tech-stack-docs/PLAN.md`.

**Status:** Planning only. No implementation in this document.  
**Scope:** `tech-stack-generator/`, `tech-stack-docs/`, repo scripts, CI checks, and live repo inputs used to generate docs.  
**Read against:** `AGENTS.md`, `Readme.md`, `plans/tech-stack-docs-consolidation.md`.

---

## 1. Objective

Build a docs system where the tech-stack site is generated only from live code and live repo data, with no hand-written prose files to maintain.

For this plan, "100% accuracy" means:

- every published fact must be mechanically derived from a canonical repo input
- every docs section must point back to a provable source
- any claim that cannot be generated from code or structured data must be removed from the docs surface

This is stricter than the current consolidation plan. The current plan still allows markdown narrative. This plan does not.

---

## 2. Core rules

- No markdown or MDX narrative as a source of truth for tech-stack docs.
- No hand-maintained TSX prose pages.
- No duplicated version numbers, route lists, script lists, or feature claims.
- If a fact has no canonical machine-readable source, it is out of scope until such a source exists.
- Generated docs are a build artifact, not an editable content layer.

---

## 3. Canonical source model

Every docs section must be generated from one of these source classes:

| Docs area | Canonical source |
|----------|------------------|
| dependencies and versions | root `package.json`, `site/package.json`, `tech-stack-generator/package.json`, lockfile |
| scripts and commands | package `scripts` fields |
| routes | `site/config/route-contract.json` first, route tree scan second |
| app structure | live folder tree with allowlisted roots |
| API endpoints | `site/app/api/` and route contract metadata |
| environment requirements | `.env.example`, env validation scripts, config readers |
| database | Drizzle schema, migrations, Supabase config, SQL files |
| tests and verification | package scripts, test file inventory, config files |
| deployment and build | Next, Vite, TypeScript, pnpm, CI config, Vercel config if present |
| planner features | explicit feature registries or machine-readable module metadata only |

If a page cannot be generated from one of these, the page must not exist yet.

---

## 4. Three-phase execution plan

### Phase 1: Canonicalize every input

**Purpose:** remove ambiguity about where each fact comes from.

**Tasks**

1. Define one canonical machine-readable source for every docs section.
2. Replace heuristic-only sections with explicit structured inputs where needed.
3. Add missing registries for drift-prone areas such as planner features, module inventories, and environment contracts.
4. Mark every source as either:
   - primary canonical input
   - derived input
   - forbidden input
5. Remove any docs section whose facts cannot yet be proven from code or structured data.

**Implementation shape**

- Prefer existing canonical files before adding new metadata.
- Where repo structure is not explicit enough, add typed manifests near the owning code.
- Do not add prose files. If extra explanation is needed, store short structured labels and descriptions in typed source metadata owned by the code that uses them.

**Exit criteria**

- each docs card, table, and page has a declared canonical source
- no section depends on human memory or free-form prose
- no section depends on scanning that is known to be lossy when a canonical manifest can exist

### Phase 2: Generate the entire docs surface

**Purpose:** make the docs site a pure render of extracted live data.

**Tasks**

1. Build one extractor pipeline, for example `pnpm run docs:sync:tech-stack`.
2. Read canonical inputs and emit deterministic generated artifacts.
3. Replace hand-written page content with template-driven renderers over generated data.
4. Generate navigation, search index, page summaries, tables, diagrams, and evidence links from the extracted data.
5. Add source backlinks on every page so each rendered fact can be traced to the originating file.

**Expected generated outputs**

- `tech-stack-generator/src/data/dependencies.generated.json`
- `tech-stack-generator/src/data/scripts.generated.json`
- `tech-stack-generator/src/data/routes.generated.json`
- `tech-stack-generator/src/data/api.generated.json`
- `tech-stack-generator/src/data/database.generated.json`
- `tech-stack-generator/src/data/features.generated.json`
- `tech-stack-generator/src/data/search.generated.json`
- optional generated diagram specs if architecture views are still needed

**Rendering rule**

- the UI may format data, group data, filter data, and visualize relationships
- the UI may not introduce new factual claims not present in generated inputs

**Exit criteria**

- the full tech-stack docs site is render-only
- deleting hand-written page prose does not remove any required information
- rebuilding from a clean checkout reproduces the same generated docs output

### Phase 3: Enforce accuracy and ban manual drift

**Purpose:** make stale or hand-maintained docs impossible to merge.

**Tasks**

1. Add CI checks for sync, drift, typecheck, tests, and build.
2. Fail CI when generated artifacts differ from live sources.
3. Fail CI when forbidden manual content appears in docs inputs.
4. Add a repo rule that tech-stack docs changes must come from source changes plus generated output.
5. Remove or archive obsolete manual docs paths once the generated system is complete.

**Required checks**

- `pnpm run docs:sync:tech-stack`
- `pnpm run docs:check:tech-stack`
- `pnpm run build:tech-stack`
- `pnpm run typecheck:tech-stack`
- `pnpm run test:tech-stack`

**Guardrails**

- forbid non-generated prose files under the tech-stack docs source path
- forbid manual edits to generated artifacts except through the sync command
- require source-evidence mapping in every generated page model

**Exit criteria**

- CI fails on any stale docs output
- CI fails on any new hand-written docs layer
- reviewers can verify every fact from source to generated output

---

## 5. Verification model

No claim of "accurate" is valid unless all three checks pass:

1. source proof: the fact exists in the canonical input
2. generation proof: the extractor emits the expected artifact deterministically
3. render proof: the docs site displays only generated facts from that artifact

Evidence standard:

- each rendered section must expose its source file path
- each generated artifact must be reproducible from a clean checkout
- each docs build in CI must re-run extraction before validation

---

## 6. Risks and controls

| Risk | Impact | Control |
|------|--------|---------|
| some sections are not machine-provable today | missing docs sections | do not fake them; add canonical metadata first |
| feature scanning is heuristic and lossy | false claims | replace scans with typed feature manifests |
| architecture pages become shallow | lower narrative richness | accept reduced prose in exchange for provable accuracy |
| generated output becomes noisy | review fatigue | keep artifact formats deterministic and compact |
| external systems are not fully represented in repo | blind spots | only document externally sourced facts if mirrored into canonical repo data |

---

## 7. Non-goals

- preserving human-written narrative for context
- explaining intent that is not encoded in code or structured metadata
- generating deep architecture reasoning from arbitrary source code without explicit canonical inputs
- documenting external runtime state that is not represented in the repo

---

## 8. Recommended first slice

1. Lock the canonical input matrix for dependencies, scripts, routes, API, database, and env.
2. Build `docs:sync:tech-stack` to emit generated artifacts for those sections only.
3. Convert the current tech-stack site pages to render from generated inputs and delete manual factual content from the page layer.

This slice gives the highest accuracy gain first and exposes which sections still lack canonical machine-readable inputs.
