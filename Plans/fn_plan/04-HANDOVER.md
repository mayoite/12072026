# Planner Overhaul Handover

Status: Phase 1 in progress — **1A** (open3d shell) active; **1B** (SVG path) queued  
Revision: **2026-07-05** — [`00-REVISION.md`](00-REVISION.md)  
Active phase: Phase 1A  
Active route: `/planner/open3d`  
Rollback path: Existing Open3D route and explicit Fabric fallback routes

## Authority stack

```text
00-REVISION.md
  → PACKAGES.md + rules_plan/01-phase1-execution/01-implementation-decisions.md
  → fn_plan/01-START.md, 02-PHASE-1.md, 03-PHASE-2.md (this file)
  → docs/architecture/MODULE-LAYOUT.md (where new code goes)
  → docs/architecture/MODULE-UI-CONTRACT.md (surface anti-drift)
  → docs/Lockedfiles/INDEX.md (module current/proposed pairs)
```

| Doc | Role |
|-----|------|
| [`docs/architecture/README.md`](../../docs/architecture/README.md) | Architecture index — open first for layout, CSS, data flow |
| [`docs/architecture/MODULE-LAYOUT.md`](../../docs/architecture/MODULE-LAYOUT.md) | New code → `features/planner/open3d/`; thin `app/` routes |
| [`docs/architecture/MODULE-UI-CONTRACT.md`](../../docs/architecture/MODULE-UI-CONTRACT.md) | Layer → surface → module; `lint:ui` gates |
| [`docs/Lockedfiles/INDEX.md`](../../docs/Lockedfiles/INDEX.md) | Domain snapshots (`<module>/current` / `proposed`) |

## Objective

Deliver the professional One&Only planner (**1A**) and the safe Lego-like SVG block system (**1B**) per `01-START.md` and `00-REVISION.md`, without changing engine ownership or document compatibility.

## Completed (planning + partial implementation)

- [x] Master architecture defined — see [`docs/architecture/README.md`](../../docs/architecture/README.md).
- [x] Global benchmark principles defined (`01-START.md` §3).
- [x] Plan revision locked (Option A SVG, 1A/1B split).
- [x] CSS and no-hardcoding contract defined (`MODULE-UI-CONTRACT.md`).
- [x] SVG security and publication model defined (server compiler path).
- [x] Phase 1 and Phase 2 checklists created.
- [x] **UI/TEST workflow:** Expert plans + coordinator revisions filed.
- [x] **UI-0 (partial):** ThemeEditor on admin tokens; open3d layout imports `open3d-workspace.css` bundle; `lint:ui` + `lint:ui:strict` scripts exist.
- [x] Phase 1 route containment: `/planner/open3d` workspace + chrome rules (tests in repo).
- [x] Phase 1 semantic token foundation.
- [x] Phase 1 responsive foundation.
- [x] Inventory fallback index synchronous before async descriptor replacement.
- [x] Versioned workspace preference schema with corrupt-state recovery.
- [x] Explicit planner tool lifecycle and semantic panel contracts.
- [x] `PlannerCommand` type + `executePlannerCommand` (unit-tested); registry and permission scaffolding.
- [x] SVG compiler module, sanitizer, resvg, Sharp, boundary tests (1B foundation).
- [x] Puck registry + `Render` preview on admin svg-editor and portal svg-catalog routes.

## Not accepted (honest blockers)

### 1A — Open3D shell

- [ ] **P0:** Route all document mutations through `executePlannerCommand` — `useWorkspaceCanvas` still calls `dispatchOpen3dAction` directly.
- [ ] **P1:** Phosphor-only chrome — emoji icons remain in `inventoryTaxonomy.ts`; partial Phosphor adoption in tool rail / top bar only.
- [ ] **P1:** Bottom command / status surface (REC-03), command palette (`Ctrl/Cmd+K`), catalog search cap ≤24.
- [ ] Full draw → save → reload acceptance workflow (§11A in `02-PHASE-1.md`).
- [ ] **UI-1 L1 shell** not signed off — `lint:ui:strict` not in `release:gate:fast`.

### 1B — SVG production path

- [ ] Full `<Puck>` mount on `/admin/svg-editor/[id]` with `onPublish` → API (today: JSON edit view + `Render` preview only).
- [ ] Unify exec `generate-svg.mjs` and in-process `svgCompiler.server.ts` (dual compile path remains).
- [ ] Three reference blocks published end-to-end (definitions + compiler tests exist; no live publish).
- [ ] Supabase revision table — **deferred Phase 08** (`PLAN-FAIL-0409`); disk JSON OK for 1B interim.

## Verified (from repo; re-run before sign-off)

| Check | Status | Notes |
|-------|--------|-------|
| Route shell / workspace tests | Present | `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` and related |
| `PlannerCommand` unit tests | Pass (when run) | `phase1CommandCatalog.test.ts` — command layer only, not UI wiring |
| Typecheck | Not re-run this session | Capture fresh evidence under `results/<module>/<phase>/<cmd>/` before acceptance |
| `@svgdotjs/*` in `site/package.json` | **Still present** | Deferred per revision; remove when import graph confirms unused |
| Evidence artifacts | **Stale / missing** | Prior `results/site/planner-phase-1/*` paths not verified on disk — re-capture before claiming pass |

Do not mark 1A or 1B accepted without evidence from one unchanged revision per `AGENTS.md`.

## Execution plans (2026-07-05)

| Plan | Authority |
|------|-----------|
| Coordinator revision | [`00-REVISION.md`](00-REVISION.md) |
| UI | [`06-UI-PLAN.md`](06-UI-PLAN.md) |
| Module contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../docs/architecture/MODULE-UI-CONTRACT.md) |
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../docs/architecture/MODULE-LAYOUT.md) |
| Doc revision batch | [`09-DOC-REVISION.md`](09-DOC-REVISION.md) |
| Tests | [`08-TEST-PLAN.md`](08-TEST-PLAN.md) |
| Locked modules | [`docs/Lockedfiles/INDEX.md`](../../docs/Lockedfiles/INDEX.md) |

**Workflow:** Composer subagent drafts → coordinator revises → agent executes.  
**Anti-drift:** layer → surface → module; new open3d code only under `features/planner/open3d/` per `MODULE-LAYOUT.md`.

## Package decisions

Adopted (aligned with `PACKAGES.md` + revision):

- Fabric and Three engine ownership.
- Puck and Zod for admin composition.
- **Option A:** flatten-js, polygon-clipping, svgo, resvg, sharp, DOMPurify (server).
- Phosphor for planner chrome (enforcement open).
- Disk `block-descriptors/` + R2 thumbs for Phase 1B publish.

Deferred:

- `@svgdotjs/*` — not Phase 1; **still in `site/package.json`** until confirmed unused and removed.
- Supabase revision table — Phase 08 (`PLAN-FAIL-0409`).
- Full geometry constraint engine — beyond reference fixtures until 1B hardening.

Rejected:

- Second canvas engine.
- Second page builder.
- SVG.js in Phase 1 production pipeline.
- Arbitrary scripts, CSS, URLs, executable formulas, or unrestricted SVG.
- SVG authoring / compiler packages in planner bundles.

## Open risks

- Dual descriptor models (`BlockDescriptor` vs `SvgBlockDefinitionV1`) — owner 1B; adapter at publish.
- Dual compile path (exec script vs in-process) — owner 1B; unify before publish sign-off.
- Parametric constraint conflicts — owner Phase 2.
- Route promotion — guest/canvas unchanged until Phase 2 after **1A + 1B** on one revision.

## Next action

**1A P0:** Wire `executePlannerCommand` through `useWorkspaceCanvas` and every other document mutation surface; add `plannerCommandWiring.test.ts`.

**UI-1 L1:** `planner / L1 / shell` — frame before inventory module (`MODULE-UI-CONTRACT.md` § Layers).

**TEST-1:** Red `plannerCommandWiring.test.ts` + `open3dIconPolicy.test.ts` alongside P0 wire.

**1B P0 (after 1A P0):** Mount full `<Puck>` on admin svg-editor; unify compile path.

**Lock:** Enable `lint:ui:strict` in `release:gate:fast` when UI-1 shell acceptance passes.

## Research (2026-07-05)

`RESEARCH-2026-07-05-synthesis.md` (entry). Revision implements synthesis P0 decisions. Research files are reference only — not execution authority.

## Preservation statement

Fabric remains the 2D engine. Three/r3f/drei remain the 3D stack. Existing documents, package locks, repository governance, and rollback routes remain preserved until verified implementation explicitly changes their status.
