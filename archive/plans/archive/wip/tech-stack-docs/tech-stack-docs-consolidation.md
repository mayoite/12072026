# Archived Draft: Master Plan: Tech Stack Documentation System

Superseded by `plans/wip/tech-stack-docs/PLAN.md`.

**Status:** Planning only. No implementation in this document.  
**Scope:** `docs/`, `tech-stack-generator/`, root docs, supporting scripts, CI checks, and repo documentation flow.  
**Read against:** `AGENTS.md`, `Readme.md`, `DOC-MAP.md`, `START.md`, `tech-stack-generator/`, `docs/`, `site/`, root `package.json`.

---

## 1. Executive summary

Turn the current tech-stack documentation effort into a single governed documentation system that is:

- accurate against the live repo
- clear about canonical sources
- easy to update
- hard to let drift
- usable both as repo reference and interactive docs site

The current plan solves only part of the problem: it improves the Vite docs site and syncs some generated data. The broader problem is bigger:

- source-of-truth boundaries are unclear
- the interactive site and markdown docs are partially duplicated
- update workflows are not enforced
- ownership and review rules are implicit
- build output and package naming are confusing
- route, script, dependency, and feature references can drift separately

This master plan treats the tech-stack docs as a system, not just a Vite package cleanup.

---

## 2. Mission

Build one documentation system for the repo that:

1. exposes the technical shape of the platform clearly
2. pulls drift-prone facts from live code where possible
3. keeps human narrative in markdown where humans add value
4. provides an interactive docs surface for discovery
5. fails CI when generated facts or required docs are stale

---

## 3. Success criteria

The work is complete only when all of the following are true:

- there is one clearly documented canonical source for each docs category
- the interactive tech-stack site builds from a stable, predictable folder layout
- dependency versions, key scripts, route inventory, and selected architecture metadata are generated from the live repo
- prose docs live in markdown or MDX rather than scattered hand-written TSX pages
- the repo explains how to update docs and how docs are verified
- CI can detect stale generated docs artifacts
- contributors can answer "where do I edit this?" in one step

---

## 4. Problem statement

### 4.1 Current issues

| Area | Current state | Problem |
|------|---------------|---------|
| Interactive docs source | `tech-stack-generator/src/pages/*.tsx` | Prose and structure are hand-maintained and can drift |
| Build output | `tech-stack-docs/` sibling output | Naming and ownership are ambiguous |
| Repo docs | `docs/`, `DOC-MAP.md`, `START.md`, `Readme.md` | Canonical vs summary vs interactive boundaries are weak |
| Live repo facts | packages, scripts, routes, features | Partly copied manually into docs |
| Search | local UI search only | No guaranteed sync with markdown corpus |
| Governance | implicit | No strong stale-doc enforcement path |

### 4.2 Root causes

- historical layering of docs instead of one designed system
- prose and data mixed together in UI code
- generated facts and human-authored narrative not separated
- no explicit doc ownership matrix
- no routine gate for documentation drift

---

## 5. Canonical source model

Every doc area needs one canonical home.

| Content type | Canonical source | Derived surfaces |
|--------------|------------------|------------------|
| Technical narrative | `docs/tech-stack/*.md` and linked `docs/*` | interactive site render |
| Dependency versions | live `package.json` files | generated docs data |
| Commands and workflows | live package scripts + curated markdown notes | command cards, workflow pages |
| Route inventory | route scan or canonical route manifest | generated route docs |
| Planner/platform structure | markdown docs plus selected generated indexes | interactive navigation |
| Build output | existing `tech-stack-docs/` sibling output | deploy artifact only |

Rules:

- no manually duplicated version numbers unless clearly labeled as examples
- no parallel prose copies when a markdown source can drive the site
- interactive UI may enrich canonical docs, but should not become the source of truth

---

## 6. Master scope

This plan covers six workstreams:

1. package and output consolidation
2. generated live-data sync
3. markdown or MDX content migration
4. information architecture and navigation cleanup
5. governance, CI, and contributor workflow
6. rollout, archival, and handover

It does not cover:

- moving the docs system into the Next.js app or changing the current repo topology
- auto-generating deep architecture judgment from code
- replacing all existing `docs/architecture/*` material immediately
- publishing or deployment policy outside the current repo toolchain

---

## 7. Target architecture

### 7.1 Content layers

| Layer | Purpose | Format |
|------|---------|--------|
| Canonical narrative | human explanation | markdown or MDX |
| Generated facts | drift-prone repo data | generated TS or JSON |
| Presentation shell | nav, search, layout, rendering | React/Vite |
| Validation | stale-check, build, type, tests | scripts + CI |

### 7.2 Folder intent

| Path | Role |
|------|------|
| `docs/tech-stack/` | canonical tech-stack narrative docs |
| `tech-stack-generator/src/` | shell, components, renderers |
| `tech-stack-generator/src/data/` | generated and thin curated metadata |
| `tech-stack-docs/` | build output only under the current topology |
| `site/scripts/` or `tech-stack-generator/scripts/` | sync and indexing scripts |

---

## 8. Workstream A: Stabilize current package layout

**Objective:** Make the current docs-site layout understandable without relocating it.

### Tasks

1. Keep the current source package and current build output where they are.
2. Align package naming, readmes, references, and scripts to one naming scheme.
3. Update ignore rules, tests, and path assumptions so they describe the current topology correctly.
4. Separate clearly between source package, generated output, and canonical docs content.

### Decisions required

- keep folder name `tech-stack-generator` and call the product "tech-stack docs"
- keep sibling build output `tech-stack-docs/` and stop treating it as an architectural ambiguity

Recommendation:

- keep current folder and current output path
- clean up terminology everywhere else

### Exit criteria

- one package path
- one documented output path
- no conflicting documentation about where source lives and where output lands

---

## 9. Workstream B: Generate live repo facts

**Objective:** Remove manual maintenance from high-drift technical facts.

### Data to generate

- dependency versions from root and `site/package.json`
- script inventory from root and key package manifests
- route inventory from the app tree or route contract source
- high-level package/module inventory
- search index inputs
- optional feature inventory if there is a reliable source

### Implementation shape

Create one sync entry point such as:

- `pnpm run docs:sync:tech-stack`

That entry point can:

1. read live repo inputs
2. normalize data
3. emit generated files
4. fail if required inputs are missing

### Output examples

- `techStack.generated.ts`
- `scripts.generated.json`
- `routes.generated.json`
- `searchIndex.generated.ts`
- optional `packages.generated.json`

### Guardrails

- generated files must be clearly marked generated
- hand-edited metadata must stay in separate small override files
- generated output should be deterministic to avoid noisy diffs

### Exit criteria

- changing live package or route data updates generated docs through one command
- generated files are small enough to review and diff sanely

---

## 10. Workstream C: Migrate prose to markdown-driven docs

**Objective:** Move technical narrative out of page TSX into maintainable content files.

### Migration target

Create a structured `docs/tech-stack/` tree such as:

- `overview.md`
- `platform.md`
- `architecture.md`
- `features.md`
- `api.md`
- `testing.md`
- `workflow.md`
- `deployment.md`
- `data-and-storage.md`
- `security-and-ops.md`
- `planner.md`
- `appendix.md`

### Supporting files

- `_nav.json` or equivalent ordered navigation metadata
- frontmatter for title, order, tags, status, and ownership

### Renderer requirements

- markdown and MDX support
- code fences
- tables
- mermaid if currently required
- internal linking
- generated data embeds through small components only where needed

### Migration order

1. workflow and testing pages
2. API and deployment pages
3. architecture and feature pages
4. overview and tech stack summary pages

### Exit criteria

- TSX pages are wrappers or removed
- core prose edits happen in markdown, not component source

---

## 11. Workstream D: Information architecture cleanup

**Objective:** Make the documentation system navigable and predictable.

### Tasks

1. Define primary docs audience splits:
   - new contributor
   - engineer changing app code
   - reviewer verifying architecture facts
   - operator checking workflows
2. Clarify boundaries between:
   - `Readme.md`
   - `START.md`
   - `DOC-MAP.md`
   - `docs/tech-stack/*`
   - deep reference docs under `docs/architecture/*`, `docs/api/*`, and others
3. Introduce a simple docs hierarchy:
   - entry docs
   - operational docs
   - architecture docs
   - generated reference
4. Remove circular references and dead-end pages.

### Output

- a cleaner `DOC-MAP.md`
- clearer entry points in `Readme.md`
- a nav tree aligned with the interactive site

### Exit criteria

- each top-level doc answers one clear question
- no duplicate “start here” paths without reason

---

## 12. Workstream E: Governance and contribution workflow

**Objective:** Make docs maintenance routine, not optional.

### Rules to encode

- when live technical facts change, generated docs must be updated
- when structure changes, affected narrative docs must be reviewed
- interactive docs site changes must not bypass canonical markdown

### Proposed scripts

- `docs:sync:tech-stack`
- `docs:check:tech-stack`
- `docs:build:tech-stack`
- `docs:test:tech-stack`
- optional `docs:gate`

### Proposed CI checks

- sync generated docs
- fail on generated drift
- typecheck docs site
- test docs site
- build docs site

### Contributor guidance updates

- `Readme.md`
- `START.md`
- `DOC-MAP.md`
- `AGENTS.md`

### Exit criteria

- docs drift is visible in CI
- update path is documented in one place

---

## 13. Workstream F: Rollout, archival, and handover

**Objective:** Land the system without confusing contributors or losing historical context.

### Tasks

1. Archive obsolete TSX docs pages only if reference value remains.
2. Remove or mark deprecated paths clearly.
3. Update all references to the old output model.
4. Record remaining gaps in `Failures.md` if any phase stops short.
5. Document operating model for future maintenance.

### Exit criteria

- old docs paths are either gone or explicitly archived
- there is no active ambiguity about where docs live

---

## 14. Phased execution plan

### Phase 0: Discovery and design lock

Purpose:
confirm source-of-truth rules, naming decisions, and migration boundaries before edits spread.

Tasks:

- inventory all tech-stack-related docs inputs
- map duplicated content
- choose final naming and folder conventions
- define generated artifact list

Deliverables:

- approved source-of-truth matrix
- approved folder and naming scheme

### Phase 1: Package consolidation

Purpose:
clean path language and ownership first without relocating files.

Tasks:

- script and path updates
- remove sibling build confusion
- preserve current source/output placement

Deliverables:

- stable documented current build path

### Phase 2: Live-data generation

Purpose:
make key facts auto-synced.

Tasks:

- build sync scripts
- emit deterministic generated data
- wire current UI to generated outputs

Deliverables:

- working `docs:sync:tech-stack`
- working stale-check

### Phase 3: Markdown migration

Purpose:
move narrative to canonical markdown.

Tasks:

- add markdown or MDX pipeline
- migrate sections incrementally
- preserve interactive shells where useful

Deliverables:

- markdown-driven docs site

### Phase 4: IA and contributor flow

Purpose:
finish navigation, entry points, and reference boundaries.

Tasks:

- update root docs
- tighten cross-linking
- clean doc map

Deliverables:

- one clear reader journey

### Phase 5: CI and governance

Purpose:
make drift fail fast.

Tasks:

- add checks
- document update workflow
- ensure local and CI parity

Deliverables:

- enforced docs gate

### Phase 6: Archive and handoff

Purpose:
close the migration cleanly.

Tasks:

- archive deprecated material
- record unresolved gaps
- finalize owner guidance

Deliverables:

- finished operating model

---

## 15. Dependencies and sequencing

| Dependency | Needed by | Why |
|-----------|-----------|-----|
| naming decision | A, D | prevents repeated path churn |
| generated route source | B, C | avoids duplicate route inventories |
| markdown render strategy | C | defines migration mechanics |
| CI entry points | E | depends on sync/build script design |
| doc boundary decisions | C, D | avoids duplicate prose migration |

Recommended order:

1. lock source-of-truth and naming
2. fix package/output structure
3. add generated facts
4. migrate prose
5. clean navigation and entry points
6. enforce in CI

---

## 16. Risks and controls

| Risk | Impact | Control |
|------|--------|---------|
| folder or output relocation creates broad churn | noisy diffs, broken scripts | avoid relocation; preserve current topology |
| generated artifacts are too noisy | reviewers ignore docs diffs | keep generated scope tight and deterministic |
| markdown migration loses interactive behavior | lower docs usefulness | keep thin React components for dynamic blocks |
| canonical boundaries remain fuzzy | duplicate docs return | publish explicit source-of-truth matrix |
| route scanning becomes brittle | false drift or broken docs | prefer canonical route metadata where possible |
| CI becomes heavy | docs checks get skipped locally | keep scripts fast and composable |

---

## 17. Verification strategy

Per phase, verification should be explicit.

### Core checks

- `pnpm run build:tech-stack`
- `pnpm run typecheck:tech-stack`
- `pnpm run test:tech-stack`
- `pnpm run docs:sync:tech-stack`
- `pnpm run docs:check:tech-stack`

### Manual checks

- browse all primary docs routes after build
- inspect search results for migrated content
- verify generated version and route facts against live repo inputs
- confirm root docs point to the right canonical locations

### Evidence standard

No claim of “synced” or “canonical” without showing:

- the source
- the generated output
- the check that proves drift would fail

---

## 18. Deliverables

At full completion, the repo should contain:

- a markdown-driven `docs/tech-stack/` source tree
- a cleaned `tech-stack-generator/` package with the current output path documented consistently
- generated fact files and sync scripts
- updated root docs and doc map
- CI checks for stale docs
- archived or removed deprecated docs-site paths

---

## 19. Estimated effort

| Phase | Focus | Estimate |
|------|-------|----------|
| 0 | discovery, decisions, boundaries | 0.5 day |
| 1 | package consolidation | 0.5-1 day |
| 2 | live-data generation | 1-1.5 days |
| 3 | markdown migration | 2-3 days |
| 4 | IA and root docs cleanup | 0.5-1 day |
| 5 | CI and governance | 0.5 day |
| 6 | archive and handoff | 0.25-0.5 day |
| **Total** | | **~5-8 days** |

---

## 20. Approval structure

- [ ] Phase 0: source-of-truth and naming decisions
- [ ] Phase 1: package consolidation
- [ ] Phase 2: generated live-data sync
- [ ] Phase 3: markdown migration
- [ ] Phase 4: IA and root docs cleanup
- [ ] Phase 5: CI and governance
- [ ] Phase 6: archive and handoff

---

## 21. Recommended next implementation slice

If this master plan is accepted, the best first execution slice is:

1. lock the canonical-source matrix
2. keep the current source/output layout and fix the conflicting references
3. add generated package and script sync

That gives the highest-value accuracy improvement with the lowest migration risk, before the markdown conversion begins.
