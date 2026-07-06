# Archived Draft: Tech Stack Docs Generation Plan

Superseded by `plans/wip/tech-stack-docs/PLAN.md`.

**Status:** Planning only. No implementation in this document.  
**Purpose:** define how to generate repo-driven docs into `Documents/` on demand, without manual maintenance of the generated content.  
**Read against:** `AGENTS.md`, `Readme.md`, `plans/tech-stack-docs-zero-manual-plan.md`.

---

## Start

### Goal

Build a generation flow where:

- the repo remains the only source of truth
- generated documents are written into `Documents/`
- old docs and old build output stay untouched until an explicit migration step
- every generation run reflects the current repo state
- no manual editing is required for generated docs

### Scope

In scope:

- generation command design
- canonical repo inputs for generated docs
- generated markdown output under `Documents/`
- optional live-site rendering from generated artifacts
- validation and handover requirements

Out of scope:

- deleting or relocating current `tech-stack-docs/`
- rewriting existing historical docs
- claiming facts that are not provable from repo inputs

### Success definition

This plan succeeds only if:

- one command generates the docs set into `Documents/`
- generated files are reproducible from a clean checkout
- generated docs are not hand-maintained
- repo changes are reflected on the next generation run
- each generated section is traceable to a canonical source

---

## Phase 1: Source Lock And Generation Contract

### Objective

Define exactly what the generator is allowed to say and where every fact comes from.

### Tasks

1. Create a source-of-truth matrix for every planned generated document.
2. Classify inputs as:
   - canonical
   - derived
   - forbidden
3. Lock the first generated document set.
4. Define the output contract for `Documents/`.
5. Define the generation command and its failure behavior.

### Canonical inputs

Initial allowed inputs should be:

- root `package.json`
- `site/package.json`
- `tech-stack-generator/package.json`
- `pnpm-lock.yaml`
- `site/config/route-contract.json`
- route trees under `site/app/`
- API handlers under `site/app/api/`
- env definitions from `.env.example`
- validation scripts under `site/scripts/`
- database schema and migration files
- test config and test file inventory

### First generated outputs

The first pass should generate a small, defensible set:

- `Documents/tech-stack-overview.md`
- `Documents/dependencies.md`
- `Documents/scripts-and-commands.md`
- `Documents/routes-and-api.md`
- `Documents/environment-and-validation.md`

### Command contract

Recommended command:

- `pnpm run docs:generate`

Required behavior:

- clear `Documents/` generated targets before writing
- fail if a required canonical source is missing
- fail if output cannot be generated deterministically
- write a small manifest describing what was generated and from which sources

### Exit criteria

- each planned document has a defined source map
- output filenames and structure are fixed
- the generation command contract is documented
- unsupported narrative sections are excluded up front

---

## Phase 2: Build The Generator And Site Integration

### Objective

Implement the generator so a single run produces usable markdown docs and optional site data from live repo state.

### Tasks

1. Add a generator entry point under repo scripts.
2. Extract normalized facts from canonical inputs.
3. Render markdown documents into `Documents/`.
4. Emit machine-readable companion artifacts if the live site needs them.
5. Add source references into generated files.
6. Keep the generator deterministic and reviewable.

### Implementation shape

Preferred layout:

- generator code under `site/scripts/` or a dedicated docs script folder
- markdown outputs under `Documents/`
- optional JSON manifests adjacent to the markdown outputs

Recommended generated support files:

- `Documents/_manifest.json`
- `Documents/_sources.json`

Recommended rendering rules:

- only generate claims backed by code or structured metadata
- group facts into readable sections, but do not invent prose
- prefer short generated summaries over large speculative explanations
- where the repo lacks structure, output an omission note rather than a guess

### Live-site integration

Two acceptable models:

1. Site reads generated markdown and renders it directly.
2. Site reads generated JSON plus markdown and renders both.

Recommended model:

- keep markdown for human-readable outputs in `Documents/`
- emit structured sidecar data for the live site where needed

### Exit criteria

- one generation run writes the full first document set into `Documents/`
- generated files include source traceability
- re-running with no repo changes produces identical output
- site integration path is defined, even if rollout is staged

---

## Phase 3: Verification, Operations, And Handover

### Objective

Make generation reliable enough that it can be operated repeatedly without manual cleanup or content editing.

### Tasks

1. Add a verification command for generated docs.
2. Add drift detection between repo inputs and generated outputs.
3. Define when generation runs:
   - manual `docs:generate`
   - optional build pre-step
   - optional CI validation
4. Document operator expectations.
5. Prepare handover notes for future maintenance.

### Verification commands

Recommended commands:

- `pnpm run docs:generate`
- `pnpm run docs:check`

`docs:check` should verify:

- required inputs exist
- generated files exist
- manifest matches outputs
- regeneration produces no diff
- source references in generated files point to real repo files

### Operational rules

- generated files in `Documents/` are not manually edited
- source changes drive docs changes
- if a section cannot be generated, it is omitted or marked unsupported by the generator
- build or CI should fail if required generated output is stale when that gate is enabled

### Handover

The handover package for this work should include:

- the final command list
- the source-of-truth matrix
- the output file map for `Documents/`
- known unsupported sections
- failure conditions and expected operator actions

The handover is complete only when a new contributor can answer:

- what command generates the docs
- which files are canonical inputs
- which files in `Documents/` are generated
- how stale output is detected
- what not to edit manually

### Exit criteria

- generation and verification commands are documented
- `Documents/` is reserved for generated artifacts only
- future maintainers have a clear operating model

---

## Risks

- Some useful explanations may not be representable from current repo metadata.
- Route or feature extraction can become brittle if the repo structure changes without canonical manifests.
- If generated markdown becomes too thin, the site may be accurate but not very explanatory.

---

## Recommended First Slice

1. Define the source matrix for the first five generated documents.
2. Implement `docs:generate` for dependencies, scripts, routes, API, and env.
3. Write outputs only into `Documents/`.
4. Add `_manifest.json` and `docs:check`.
5. Leave `tech-stack-docs/` and existing manual docs untouched until a later migration decision.
