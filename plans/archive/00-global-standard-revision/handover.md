# Planner Handover (Live)

Date: 2026-07-04

## Current status at a glance

| Item | Status |
|---|---|
| Engines locked | Fabric 7.4.0 (2D), Three.js r185 + r3f (3D) |
| New packages | `pnpm add` not yet run for SVG pipeline + admin panel set |
| Admin SVG-editor | Planned (`/admin/svg-editor`, gated by `withAuth`) |
| Portal preview | Planned (`/portal/svg-catalog/[slug]`) |
| Planner consumer | Planned (`svgBlockDescriptorLoader`) |
| Block descriptor persistence | JSON-on-disk v1; R2 PNG thumbs |
| Live routes | /planner/guest + /planner/canvas = Fabric (deploy); /planner/open3d = pilot; /planner/fabric/* = rollback drill |

## Phase status table

| Phase | Status | Owner |
|---|---|---|
| 01 Engine Lock & Workspace Bootstrap | Planned | Build |
| 02 Catalog Source of Truth + BlockDescriptor | Planned (resolver unit test surface added: 25/25 on blocksResolver.test.ts). Phase file status: Planned. Prior "Implemented/Verified-at-unit" claims and `results/qa/resolver/test-planner/` evidence path were incorrect (path does not exist). Full gates + Phase 03/06 integration pending. | Catalog |
| 03 SVG Pipeline (Option A) | Planned | SVG |
| 04 Admin Portal SVG Editor | Planned | UI |
| 05 Portal Public Render | Planned | UI |
| 06 Planner Inventory + Symbol Consumer | Planned | Planner |
| 07 Auth and Permissions | Planned | Identity |
| 08 Persistence and Migration | Planned | Persistence |
| 09 3D Lazy, Export, AI | Planned | 3D |
| 10 Route Swap, Cleanup, Handover | Planned | Coordinator |

## Phase 02 — Unit test surface added (2026-07-04)

`resolveBlocks()` (source-of-truth at `site/features/planner/open3d/catalog/svg/blocksResolver.ts`) has unit test coverage in `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` (25/25 on the resolver slice).

Coverage spans explicit-blocks, synthesised-block, error paths, default IDs, and clamps. Schema now includes optional `blocks` (per recent update). Casts were removed in resolver per PLAN-FAIL-0413 resolution notes.

**Status**: Phase file declares "Planned". Prior claims of "Implemented — unit-verified" and evidence at non-existent `results/qa/resolver/test-planner/` were inaccurate (path does not exist per list_dir). Actual test artifacts are under results/planner/phase-*/ or results/tests/. Full phase exit requires Phase 03/06 integration + evidence in mandated layout. No promotion beyond Planned yet.

See plannnerplan/FAILURESPLAN.md for tracked PLAN-FAILs.
- Prior citations to non-existent `results/qa/resolver/test-planner/` removed. Test evidence exists under `results/planner/phase-*/` and `results/tests/` (see testing-handbook for required layout).
- `results/tests/vitest-results.json` (vitest's full JSON report)

Next-step seams (deferred to other agents; do not solve in this worktree):

- **Pipeline integrator (Phase 03)**: synthesised-row geometry + viewBox-anchor semantics must be consumed by `scripts/generate-svg.mjs`. Resolver does not currently export `DEFAULT_BLOCKID_PREFIX`; Phase 03 may need to either accept the `block-synth` literal or request that the resolver expose the constant.
- **Loader integrator (Phase 06)**: `BlockDescriptor` Zod schema in `svgTypes.ts` does not yet declare a `blocks` field. The resolver currently reads it via an `as { blocks?: unknown }` extension at the input boundary. A schema extension in Phase 06 is the cleanest seam to remove that cast; tracked as `PLAN-FAIL-0413` in `FAILURESPLAN.md`.

## Architecture snapshot

Admin JSON → Zod BlockDescriptor validated → `scripts/generate-svg.mjs` runs Option A pipeline (`@flatten-js/core` → `polygon-clipping` → `svgo` → `@resvg/resvg-js`) → outputs to `public/svg-catalog/{slug}.svg` (small, runtime-served) + R2 `<bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png` (CDN-cached imagery) → portal `<Puck.Render>` mounts at `/portal/svg-catalog/[slug]` → planner `features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts` reads registered descriptors → catalog/symbol consumers update.

## Modified files (this session)

- `benchmarks/INDEX.md` — benchmark corpus routing map for imported OOFPLWeb advisory docs and local execution reports
- `IMPLEMENTATION-DECISIONS.md` — locked package set, route map
- `QUALITY-GATES.md` — coverage, accessibility, performance gates
- `DESIGN-BENCHMARK-PROTOCOL.md` — benchmark protocol (refreshed)
- `FAILURESPLAN.md` — failure index (re-id to 4xxx range) + PLAN-FAIL-0413 logged for `BlockDescriptor.blocks` schema extension seam
- `HANDOVER.md` (this file) — live status corrected to reflect Phase 02 Planned (unit test surface present; prior Implemented claim inaccurate)

### resolver-test-author (Phase 02 unit-test author) — 2026-07-04

Worktree: `D:\worktrees\resolver-test-author` (branch `orchestrator/resolver-test-author`).

| File | Action |
|---|---|
| `site/features/planner/open3d/catalog/svg/svgTypes.ts` | Carried staged Phase-02 Zod schema into the worktree (no edit) |
| `site/features/planner/open3d/catalog/svg/blocksResolver.ts` | Carried untracked canonical resolver into the worktree (no edit) |
| `site/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts` | Carried for parity (no edit) |
| `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` | Created (vitest, 25 cases across 5 describe blocks). Pass 25/25. Honours AGENTS.md Type Safety rule (no `: any`, no `as any`, no `@ts-ignore`, no eslint-disable, no mantine imports, no `--no-frozen-lockfile`, no donor trade-dress). |
| Actual test evidence | Located in `results/planner/phase-*/` + `results/tests/` (qa/resolver path previously cited does not exist) |

## Open items

- Benchmark corpus index: `benchmarks/INDEX.md` now maps the imported OOFPLWeb advisory docs (`01a`, `01b`, `03a`) plus the local execution benchmarks (`phase-00-precheck`, `phase-05`, `phase-06`, `conversion-execution`). Consult it before revising any phase text.
- Review workflow: `benchmarks/REVIEW-WORKFLOW.md` defines the post-execution critic → QA → UI sequence, with no opinion passing between agents before primary-agent finalization.
- Tier-3 note: `@vercel-labs/json-render` remains installed but inactive; Phase 09 owns activation.
- pnpm add for the locked package set.
- `scripts/generate-svg.mjs` skeleton.
- Zod `BlockDescriptor` schema (with optional `blocks` array) at `features/planner/open3d/catalog/svg/svgTypes.ts`. PLAN-FAIL-0413 tracked for full loader/Phase 06 integration (casts removed per recent updates).
- R2 bucket name: `site-block-thumbs/` per PLAN-FAIL-0407 resolved entry.
- **Phase 00 status (2026-07-04T11:40Z)**: R2 authority consolidated (PLAN-FAIL-0410 Resolved). Remaining blocker is PLAN-FAIL-0411 — `any` in `site/scripts/*` and `eslint-disable-next-line` in `site/components/*` and a planner hook/view. Resolution path: narrow exception inventory under AGENTS.md type-safety rules, OR scope-reset the §00-PRE-02 scan (these are scripts/UI, not converted-planner code). See `benchmarks/phase-00-precheck.md`.
- Phase 02 unit-test surface added. Status remains Planned (per phase file). Promotion awaits full gates, integration, and correct evidence layout.

## Upcoming execution (next prompt cycle)

- Phase 01 install sequence (single `pnpm add --filter oando-site fabric@7.4.0 three @react-three/fiber @flatten-js/core polygon-clipping svgo @resvg/resvg-js @puckeditor/core @ark-ui/react react-aria-components zod @phosphor-icons/react`).
- Phase 02 first author: BlockDescriptor Zod schema and `Open3dCatalogClient` adaptation.
- Phase 03 `scripts/generate-svg.mjs` minimum-viable script with 3 fixture blocks.

## Forbidden without explicit ask

- Do NOT commit in `D:\new` (work happens in `D:\oandO04072026`).
- Do NOT delete `_archive/fabric/` mirrors (Phase 10 cleanup gate).
- Do NOT enable `@vercel-labs/json-render` yet — Tier-3 reserved, install but inactive.
- Do NOT add Mantine — Plan-Mantine question resolved as deferred.

## 2026-07-04 Global Standard Revision (Intensified Hybrid)

**Approved design**: `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` ("this is good" — provisional pending tests + site up). See also `plans/2026-07-04/benchmark.md` (or archived version in `plans/archive/2026-07-04/benchmark.md`) and `plannnerplan/critique/plan-revision-2026-07-04.md` (or plans/2026-07-04/critique.md) for full BP + gaps. Structure alignment (plans/2026-07-04/ + plannnerplan/ phases/gov) verified against benchmark (BP-01 to BP-07, REC-01 to REC-05, REJ-01 to REJ-06, FACTs, 5-product, anti-copy); explicit BP/REC cites live in phases/ (per design + benchmark §4); see design structure note.

**Key updates this session**:
- IMPLEMENTATION-DECISIONS.md: Added binding Global Standard Framework, UI/UX Standards (Intensified), SVG/Features/Packages Mandates (design §6-10).
- QUALITY-GATES.md: New Global Standard Gate (release-blocking).
- benchmarks/REVIEW-WORKFLOW.md: Intensified for explicit global standard scoring.
- FAILURESPLAN.md: New "2026-07-04 Revision — Global Standard Intensification" subsection + PLAN-FAIL-0414 to 0420 (UI panels, benchmark gate, agent workflow, registry, SVG, features, packages).
- Reality sync: Phase 02 resolver test surface added (blocksResolver.test.ts 25/25); evidence paths corrected (no `results/qa/...`); status remains Planned per phase file. Other tests from Failures.md noted.
- Current blockers incorporated from Failures.md (2026-07-04): route naming (verified), Phase 04 persist (verified), Phase 03 restores (verified), native not deployable (routes restored to Fabric), autosave continued. Phase 01 typecheck debt (0412), any/eslint (0411) remain.
- Cross-refs to benchmark report, critique (plannnerplan/critique/plan-revision-2026-07-04.md), design for 5-product model (Figma, Sketchfab, AutoCAD, Planner 5D, Floorplanner), anti-copy, global standard.

**Critique merge (2026-07-04)**: Applied top 5 priority fixes from critique:
- GeneratedAt idempotency (Phase 02/08): stamp first-write only.
- 409 error codes: sticky suffixes (409.lock_busy, etc.).
- versionMismatch: 422 not 404 (Phase 08).
- R2 bucket: moved out of "needs approval" in I-D (already done).
- Registry alias: documented in I-D (puckBlockRegistry canonical + alias).
Also addressed forbidden-list omissions, status hygiene, cross-drift in updates to phases/governance. See FAILURESPLAN for tracked items. Verdict from critique: revise (now in progress).

**Phase status updates**:
- Phase 02: Unit test surface added; status Planned. Global standard items tracked in FAILURESPLAN.
- Other phases: Updated checklists for Global Standard Gate, UI/UX, resolver contracts (see phases/ and design §11).

**Open items / workstreams** (expanded):
- UI Global Standards (Figma minimize-UI, Sketchfab search, etc.; small-screen panel wiring baseline).
- Workflow & Agent Orchestration (independent reviews per intensified REVIEW-WORKFLOW).
- Benchmark & Global Standard Gate (mandatory dated reports).
- Revisit after tests + site up (dev server; validate UI/UX/SVG/features/packages live per design §16).

**Evidence**: Per testing-handbook.md. Current tests: blocksResolver 25/25, admin/catalog SVG 116 pass, Phase 03 smoke/sanitize/restore verified. Blockers logged with status/owners.

**Provisional**: Full validation of UI/UX, SVG output, features, packages deferred until after tests and site is up (per user and design §16). No "Implemented/Verified" claims on global standard elements yet.

**Modified files (included in full 2026-07-04 Global Standard Revision section)**:
- `plannnerplan/IMPLEMENTATION-DECISIONS.md` — binding global standard sections
- `plannnerplan/QUALITY-GATES.md` — Global Standard Gate
- `plannnerplan/benchmarks/REVIEW-WORKFLOW.md` — intensification
- `plannnerplan/FAILURESPLAN.md` — intensification subsection + new PLAN-FAILs
- `plans/2026-07-04/HANDOVER.md` (this file) — revision section, reality sync, tests/blockers
- `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` — approved design

**Revisit plan**: After tests (targeted vitest, etc.) and `pnpm run dev` (site up): validate live UI/UX (panels, inventory, minimize), generated SVGs/PNGs (visuals, tokens, resolver match, anti-copy), feature flows (catalog, placement, 2D/3D), package rendering. Update plans, run fresh benchmark if needed, re-confirm gates.
