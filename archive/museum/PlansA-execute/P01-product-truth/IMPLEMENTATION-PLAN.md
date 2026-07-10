# P01 Product Truth Inventory — Implementation Plan (Re-proof)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-materialize a data-backed product-truth pack under `results/planner/world-standard-wave/00-product-truth/` that maps what the live open3d planner **actually does** versus what docs/README/UI/scoreboard **claim**, so P02–P10 fix real gaps against W1–W8 — not stories, not historical PASS labels when evidence is gone.

**Architecture:** Inventory-only on main checkout `.`. Production planner source under `site/features/planner/open3d/`; thin App Router hosts under `site/app/planner/`; thin adapters under `site/features/planner/ui/`. Document model (UUID entities, mm) → FeasibilityCanvas interim 2D → Three/R3F 3D with OrbitControls default ON → IDB autosave with honest local labels. Fabric full stage remains **destination** (archive + optional furniture overlay flag); permanent redirects make `/planner/fabric*` non-interactive. This phase writes **evidence only** under the FOLDER-LOCK path `00-product-truth/` (never `01-product-truth/`). No product feature code edits.

**Tech Stack:** Next.js site package `oando-site`, FeasibilityCanvas (Canvas 2D), optional Fabric furniture overlay (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`), Three + OrbitControls path, Vitest unit suite under `site/tests/unit/features/planner/open3d/`, Playwright specs under `site/tests/e2e/`, PowerShell inventory from repo root, **pnpm**.

**Inputs consumed:**
- Repo read: 2026-07-10 — tree dirty state not frozen here; live paths verified on disk this session. Key paths listed in § Repo reality.
- Brainstormer: `Idiots2/P01-product-truth/REPORT.md` only (Idiots wave 1 **not** opened).
- Phase plan: `Plans/phases/P01-product-truth/P01-product-truth.md` + `P01-suggestions.md`.
- Evidence map: `Plans/Research/RESULTS-MAP.md` (live; historical `Plans/trustdata/` **does not exist**).
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`.
- Honesty / product: `Plans/Research/Others/{00-PENDING,04-HONEST-QUALITY,18-PRODUCT-CONTEXT,19-GOALS-SLICES,08-EVIDENCE-INDEX,09-VERIFY-SNAPSHOT,SESSION-RECAP}.md` (root `ayushdocs/` **does not exist** — live honesty lives under `Plans/Research/Others/`).

**Done when:**
1. Canonical pack exists at `results/planner/world-standard-wave/00-product-truth/` with **`INVENTORY.md`** + **`CONTRADICTIONS.md`** (RESULTS-MAP CP-01 floor) plus full supporting artifact list in § Evidence contract.
2. All key production paths confirmed `True` in `key-files-exist.tsv`.
3. Dual host entry + fabric redirect truth documented with greps and ROUTES.md.
4. W1–W8 CAPABILITY-MATRIX filled with path:line (no empty gates); status tokens only from the vocabulary; no browser-green without Playwright artifacts under `results/planner/`.
5. CLAIMS-REGISTER has ≥11 material claims with verdicts; high-severity contradictions include **claim=PASS + evidence missing** and fabric route lies.
6. Vitest capability smoke attempted; non-empty log; `run.json.vitestSmoke` ∈ {`ok`,`failed`,`skipped`} with reason if not ok — never silent skip.
7. Deep-read notes for FeasibilityCanvas, OOPlannerWorkspace, ThreeViewerInner.
8. `run.json` has real HEAD, timestamps, approach `A`, `cp01` ready-for-review or blocked — **not** auto-marked pass from historical plan narrative.
9. Zero edits under `site/features/planner/open3d/**` product logic (read-only). Evidence + this plan only.
10. Local commits for evidence slices; no worktrees; push only on owner ask.

**Evidence folder (trustdata-style):** `results/planner/world-standard-wave/00-product-truth/` — **create on execute; re-prove because entire `results/` tree is currently MISSING on this checkout.**

**Out of scope (hard):** Select/delete product fixes, orbit product work, Fabric cutover, mesh polish, new Playwright journey product code, package upgrades, CRM/auth/SSR, any feature edit under open3d. P01 does **not** unlock P03 implementation.

**Stop / failure log:** `Failures.md` — append rows with phase `P01`, path, command.

**Authority order (live):** Owner message > `AGENTS.md` > `Plans/` (`INDEX.md` → phase execute card → `Plans/Research/RESULTS-MAP.md`) > design spec > honesty docs under `Plans/Research/Others/`. Historical references to `Plans/trustdata/` and root `ayushdocs/` are **stale path names** — map them to live paths in this plan; do not invent missing trees.

---

## 1. Repo reality (2026-07-10 live read)

### 1.1 Brutal workspace facts

| Check | Live fact |
|-------|-----------|
| Checkout | `.` only; no worktrees allowed |
| `results/` | **DOES NOT EXIST** |
| `results/planner/world-standard-wave/` | **MISSING** |
| `00-product-truth/` pack | **UNREADABLE on disk** |
| `WAVE.md` / `COMPARISON-CHART.md` | **MISSING** (claimed by older plans as wave-root context) |
| `Plans/trustdata/` | **NOT present** — live plan tree is `Plans/phases/` + `Plans/Research/` |
| Root `ayushdocs/` | **NOT present** — honesty docs under `Plans/Research/Others/` |
| Phase card status table | Claims inventory **DONE** + CP-01 **PASS** (2026-07-09) |
| `00-PENDING.md` | Claims W1–W8 **GATE PASS (artifacts)** AND **product not finished** |
| Competitive research `D:\websites` | Present (ideas only; not gate proof) |

**Implication:** Historical CP-01 PASS is **plan narrative**, not file-of-record on this machine. Re-execute inventory. Do not invent PASS from chat or scoreboard.

### 1.2 Live plan tree (authority)

```
Plans/
├── INDEX.md
├── README.md
├── phases/
│   ├── EXPERT-PASS.md
│   ├── P01-product-truth/
│   │   ├── P01-product-truth.md   ← execute card (inventory tasks 00–07, CP-01)
│   │   ├── P01-suggestions.md     ← expert P0/P1 fixes (artifact names, fabric, dual host)
│   │   └── README.md
│   └── P02…P10/
└── Research/
    ├── RESULTS-MAP.md             ← evidence folder lock (00-product-truth/)
    ├── RESEARCH-MAP.md
    └── Others/                    ← honesty / product context (was ayushdocs-shaped)
```

### 1.3 Production open3d inventory (code present)

**Root:** `site/features/planner/open3d/`

| Top-level folder | Role (observed) |
|------------------|-----------------|
| `canvas-feasibility/` | Live 2D: `FeasibilityCanvas.tsx` |
| `canvas-fabric-stage/` | Opt-in furniture overlay + `fabricFurnitureFlag.ts` |
| `editor/` | `OOPlannerWorkspace.tsx`, keyboard, tool rail, inventory, status labels, TopBar |
| `3d/` | `ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx` (`Lazy3DViewer` export), `orbitDefaults.ts`, scene builders |
| `catalog/` | placement, Block2D, modularCabinetV0, workstation v0, inventory helpers |
| `model/` | project, types, units, actions (walls/openings/furniture), operations |
| `persistence/` | autosave hook, projectJson, guest/member repos, session |
| `ui/` | `Open3dNativeHost.tsx` |
| `lib/` | commands, geometry picking/snapping, image import |
| `store/`, `shared/`, `ai/`, `cleanup/` | preferences, export, advisor, import graph proof |
| `README.md` | Hybrid stack claims (some route rows **stale** — see contradictions) |

**Archive:** `site/features/planner/_archive/fabric/` (`editor/`, `canvas-fabric/`, `README.md`) — code only, not live routes.

### 1.4 Must-include production paths (existence confirmed this session)

| Role | Path | Present |
|------|------|---------|
| 2D canvas | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Yes |
| Workspace shell | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Yes |
| 3D viewer | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Yes |
| Lazy 3D host | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | Yes (`Lazy3DViewer`) |
| Orbit defaults | `site/features/planner/open3d/3d/orbitDefaults.ts` | Yes (`OPEN3D_ORBIT_DEFAULT_ENABLED = true`) |
| Native host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | Yes |
| Route host | `site/features/planner/ui/Open3dPlannerHost.tsx` | Yes → NativeHost only |
| Workspace route | `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` | Yes → Providers + ProjectSetupGate + dynamic Host |
| Keyboard | `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Yes (Delete/Backspace → `deleteSelection`) |
| Canvas hooks | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` | Yes |
| Autosave | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Yes |
| Status labels | `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | Yes (local-only honesty strings) |
| Delete helper | `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` (`applySelectionDelete`) | Yes |
| Fabric flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Yes (exact `"1"` only) |
| Import graph | `site/features/planner/open3d/cleanup/importGraphProof.ts` | Yes (**contains stale fabric-legacy route rows**) |
| Module README | `site/features/planner/open3d/README.md` | Yes |
| Fabric archive dir | `site/features/planner/_archive/fabric/` | Yes |
| Redirects | `site/config/build/next.config.js` lines ~206–207 | Yes: `/planner/fabric` and `/planner/fabric/:path*` → `/planner/open3d/` permanent |
| Entity IDs | `site/features/planner/lib/newEntityId.ts` | Yes (`crypto.randomUUID` only) |

### 1.5 Live routes (App Router — verified)

| Route | Page file | Mount |
|-------|-----------|-------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` (`guestMode` forced true) |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | `Open3dPlannerWorkspaceRoute` (guest from auth) |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | **Direct** `Open3dPlannerHost` (no WorkspaceRoute / ProjectSetupGate) |
| `/planner/fabric/*` | **No page tree** under `site/app/planner/` | Permanent redirect to `/planner/open3d/` |

**Guest/canvas chain:**
```
page.tsx
  → Open3dPlannerWorkspaceRoute.tsx
    → Providers + ProjectSetupGate
      → dynamic Open3dPlannerHost.tsx
        → Open3dNativeHost.tsx
          → OOPlannerWorkspace.tsx
            → FeasibilityCanvas (2D) | Lazy3DViewer → ThreeViewerInner (3D)
```

**Pilot open3d chain:**
```
open3d/page.tsx
  → Open3dPlannerHost.tsx
    → Open3dNativeHost → OOPlannerWorkspace → same canvas/viewer
```

### 1.6 Code surface pre-read (hypotheses to confirm in matrix — not browser green)

| Topic | Code observation (pre-inventory) | Inventory rule |
|-------|----------------------------------|----------------|
| Live 2D | FeasibilityCanvas; Fabric not default | Confirm + claim |
| Fabric overlay | Flag default OFF | Confirm env exact `"1"` |
| Fabric routes | Redirect only; archive README still claims fallback URLs | **Contradiction** |
| Orbit | `OrbitControls` async import when `enableControls`; default true; workspace spreads `getOpen3dViewerControlProps()` | code-present; product-usable needs browser later (P04) |
| Select/delete | `deleteSelection` + keyboard Delete/Backspace + `applySelectionDelete` + furniture pick helpers in FeasibilityCanvas | code-present; browser still P03/P07 unless evidence restored |
| Save honesty | `formatAutosaveStatus` always says local / guest local | code-present for W6 honesty path |
| IDs | `newEntityId` → `crypto.randomUUID` | supported |
| Import graph proof | Still lists `site/app/planner/(workspace)/fabric/guest|canvas` as fabric-legacy | **stale claim in code comments/data** |
| open3d README route table | Claims `/planner/fabric/*` legacy fallback → archive | **stale vs next.config redirect** |
| Design spec “honest today” | Still says “no furniture select/delete” in §1 Problem | **stale vs current code** — register as claim |

### 1.7 Unit tests (open3d root present)

**Root:** `site/tests/unit/features/planner/open3d/`

Capability-smoke named files (exist):
- `open3dWorkspaceKeyboard.test.tsx`
- `threeViewerInner.test.tsx`
- `open3dFeasibilityCanvas.test.tsx`
- `saveReloadContinuity.test.ts`
- `workspaceStatusLabels.test.ts`
- Also present and inventory-relevant: `hostWiringP01.test.ts`, `orbitControlsDefault.test.tsx`, `applySelectionDelete.test.ts`, `poseContinuityW4.test.ts`, `toolShortcutTruth.test.ts`, modular/cabinet/workstation suites, persistence suites.

**Package scripts:**
- Package name: `oando-site` (`site/package.json`)
- `test:planner`: `vitest run planner`
- Vitest site config: `site/vitest.site.config.ts`
- From monorepo root: `pnpm --filter oando-site exec …` with paths relative to `site/`

### 1.8 E2E specs (planner-related — names on disk)

Under `site/tests/e2e/` (non-exhaustive for inventory list task):
- `*planner*` family: `planner-canvas-trust`, `planner-catalog`, `planner-chrome`, `planner-custom-tools`, `planner-guest-workspace`, `planner-j3-template`, `planner-j4-3d-parity`, `planner-j5-ai-assist`, `planner-j6-member-restore`, landing/marketing/offline/onboarding/shell specs
- Open3d / world-standard named: `open3d-world-standard-journey.spec.ts`, `open3d-w3-select-delete.spec.ts`, `open3d-w4-orbit-continuity.spec.ts`, `open3d-save-honesty.spec.ts`, mesh/systems/console specs
- Related non-`planner*` names: `admin-svg-publish-p01.spec.ts`, `sketch-to-plan-pipeline.spec.ts`

**Inventory rule:** Listing specs ≠ browser proof. Without `results/planner/**` Playwright artifacts, matrix status for browser is `browser-missing` (or cite restored historical dirs if/when restored — still not invent).

### 1.9 Contradictions already known (seed CONTRADICTIONS.md)

| ID | Claim source | Claim | Code/config fact | Severity |
|----|--------------|-------|------------------|----------|
| C-EVIDENCE | `P01-product-truth.md` status + `00-PENDING` GATE PASS | CP-01 / W-gates pass with artifacts | `results/` missing | **P0** |
| C-FABRIC-REDIRECT | open3d README + archive README + importGraphProof fabric-legacy rows | Fabric routes still fallback workspace | next.config permanent redirect to open3d; no app fabric pages | **P0** |
| C-FABRIC-GRAPH | `importGraphProof.ts` | Paths `…/fabric/guest|canvas/page.tsx` exist in production graph | Files do not exist under `site/app/planner/` | **P0** |
| C-ORBIT-DOCS | Design/WAVE-era “no orbit” language (WAVE file missing) | Orbit absent or unusable | OrbitControls + default true + workspace props | Medium (docs vs code) |
| C-SELECT-DOCS | Design §1 “no furniture select/delete” | Select/delete missing | Handlers + tests exist in tree | Medium (docs lag) |
| C-GATE-PRODUCT | `00-PENDING` | GATE PASS language | Same doc: product not finished | Product honesty (keep both) |
| C-PATH-TRUSTDATA | Older plans/spec | `Plans/trustdata/` authority | Live Plans tree without trustdata | Process |
| C-PATH-AYUSH | Older plans | `ayushdocs/*` claim sources | Live under `Plans/Research/Others/` | Process |

### 1.10 Phase card vs live path corrections (executors must use live paths)

| Phase card / historical wording | Use instead |
|---------------------------------|-------------|
| `Plans/trustdata/00-START.md`, `CHECKPOINTS.md`, `RESULTS-MAP.md` under trustdata | `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`; checkpoint ledger may be absent — if missing, record in `run.json.blockers` and still land pack with `cp01: ready-for-review` |
| `ayushdocs/04-HONEST-QUALITY.md` etc. | `Plans/Research/Others/04-HONEST-QUALITY.md` (same for 00-PENDING, 08, 09, SESSION-RECAP) |
| Evidence `01-product-truth/` | **Forbidden.** Canonical: `00-product-truth/` |
| `results/planner/world-standard-wave/WAVE.md` as required claim source | Prefer if restored; if MISSING mark claim source `(MISSING FILE)` and still register WAVE-era claims from design/PENDING language where applicable |
| “Optional vitest if time” (old drafts) | **Required attempt** (P01-suggestions + execute card) |

### 1.11 Product definition (repo + research — inventory lens)

O&O is a **manufacturer office/workstation systems planner** (not DIY home theater, not photoreal race): real SKUs, mm truth, structure → place → select/delete → 2D↔3D orbit → honest local save → BOQ/quote path. North star (design):

> A facilities buyer can, **without a developer**, open the planner, lay out a small office with **real O&O-scale furniture**, switch **2D↔3D** with orbit, **select/edit/delete**, **save and return** the next day, and trust dimensions enough to **quote** later.

P01 answers: which parts of that sentence are **code-present**, **unit-proven**, **browser-proven**, or **docs-overclaim** — given missing evidence, browser-proven starts empty.

---

## 2. Brainstormer synthesis (`Idiots2/P01-product-truth/REPORT.md`)

### 2.1 Chosen approach

| Approach | Meaning | Decision |
|----------|---------|----------|
| **A — Multi-surface inventory** | Code + claims + evidence + buyer later | **Chosen** (matches program Approach A + P01 card) |
| B — Buyer-only demos | Only Playwright | Reject for P01 alone (misses engine/claim contradictions) |
| C — Competitive parity checklist | Score to 4+ vs MASTER-CHART | Reject as identity (clone risk; wrong product) |

### 2.2 Five surfaces of product truth

| Surface | Question | Authority |
|---------|----------|-----------|
| Code | Handlers/routes/engines? | `site/` path:line |
| Claim | Docs/UI/README/scoreboard? | Verbatim + path |
| Evidence | `results/…` artifacts? | RESULTS-MAP minima |
| Buyer | Unaided facilities journey? | Browser + screenshots |
| Competitive pattern | Industry jobs? | `D:\websites` ideas only |

**Rule:** Patterns raise the bar; code+evidence prove O&O; claims beyond code+evidence → CONTRADICTIONS; buyer is only “product works.”

### 2.3 Raised bar beyond process PASS

- GATE PASS ≠ product finished (PENDING already).
- Missing `results/` means GATE PASS not locally falsifiable — restore or re-prove.
- Record **code-present vs product-usable vs docs claim** separately (especially orbit, select/delete).
- Manufacturer SKU + BOQ wedge > photoreal (competitive teaching).
- Never treat SYNTHESIS scores as W-gate green.

### 2.4 Failure modes / false-green traps (must block)

| Trap | Block how |
|------|-----------|
| Invent CP-01 PASS from plan status table | Require artifacts on disk |
| Treat unit smoke as browser journey | Matrix forbids browser-green without results Playwright pack |
| Bare `2d\|3d` W4 grep noise | Tightened patterns only |
| W6 only `*Status*` files | Grep TopBar, repos, labels |
| Silent vitest skip | `vitestSmoke` never leave `pending`; reason required |
| Fabric page tree assumed | key-files + redirect greps |
| WAVE bullets as code truth | path:line verification only |
| Research as sole W proof | Explicit ethics section |
| Mark unit-green without log cite | Smoke log or named list + outcome |
| Clone competitor chrome/assets | Anti-copy fence |

### 2.5 Competitive JTBD → O&O verbs (ideas only)

| Job | O&O verb |
|-----|----------|
| Structure | Draw wall / Draw room |
| Openings | Add opening / door / window |
| Furnish | Place from catalog |
| Transform | Select / Move / Delete / Undo |
| Inspect 3D | Switch 2D/3D / Orbit |
| Persist | Saved locally / Synced only if true |
| Commerce | BOQ / Quote request |
| Start | Template / Draw room / Import |

### 2.6 Engine lock teaching (for inventory freeze, not thrash)

| Layer | Decision |
|-------|----------|
| 2D destination | Fabric full stage |
| 2D interim | FeasibilityCanvas |
| Forbidden | Konva hybrid thrash |
| 3D | Three + orbit; not photoreal race |
| Mesh | Modular parametric + GLB path; no designer static GLB |
| Persist | IDB now; cloud later with honest labels |

### 2.7 Minimum claims (≥11) from brainstormer + phase card

1. Live 2D = FeasibilityCanvas not Fabric full stage  
2. Fabric furniture overlay flag-gated  
3. `/planner/fabric/*` working fallback vs permanent redirect  
4. P0 spine ≠ ship quality  
5. Select/delete furniture user-visible status  
6. 3D mesh quality (boxes vs modular readability)  
7. Orbit present vs usable vs docs “no orbit”  
8. Save local IDB; cloud honesty  
9. Playwright open3d journey pack under world-standard-wave  
10. Entity IDs via `newEntityId` / crypto  
11. Dual entry host chain  
12. **(Raised)** Scoreboard GATE PASS vs missing `results/`  
13. **(Raised)** importGraphProof fabric-legacy paths vs disk  

### 2.8 Open questions → plan resolutions

| Question | Resolution in this plan |
|----------|-------------------------|
| Restore backup vs full re-inventory? | Prefer full re-inventory into `00-product-truth/` (Task 00); optional parallel restore note if `E:\OandO-backups\trustdata-2026-07-10\` accessible — never invent PASS either way |
| CHECKPOINTS.md missing? | Do not block pack land; set `cp01: ready-for-review`; note ledger path missing in blockers |
| WAVE.md missing? | claims-sources-concat marks MISSING; do not fail entire CP for missing WAVE if design+PENDING cover orbit/gate claims |
| Product code fix for importGraphProof? | **Out of scope** for P01 — record contradiction only; P02/docs may fix later |

---

## 3. Ethics / non-copy

- Research under `D:\websites` is **ideas only** — patterns, JTBD, chrome zones abstractly.
- **Forbidden:** competitor minified JS, shaders, meshes, icons, screenshots in product, brand/trade dress clones, help-center wording as product strings, shipping deep bundles from planner5d raw.
- **Icons:** Phosphor only if any UI work (none in P01 product code).
- **Screenshots in results:** O&O only (if any browser capture accidentally happens, do not use competitor images).
- Firecrawl **dead** for routine — do not re-scrape Planner5D.
- Do not open or cite `Idiots/` wave-1 for this plan execution path (owner Idiots2-only).

---

## 4. File map

### 4.1 Create (evidence only)

All under `results\planner\world-standard-wave\00-product-truth\`:

| Artifact | Purpose |
|----------|---------|
| `run.json` | Phase meta + CP/smoke outcomes |
| `HEAD.txt` | git HEAD + status |
| `open3d-file-list.txt` | Full open3d file list |
| `open3d-folder-counts.tsv` | Per top-level folder counts |
| `key-files-exist.tsv` | Must-include path existence |
| `host-wiring-rg.txt` | Host import greps |
| `fabric-redirect-and-archive-rg.txt` | Fabric redirect/archive greps |
| `fabric-flag-rg.txt` | Flag usage |
| `ROUTES.md` | Claims vs code routes |
| `w1-draw-rg.txt` … `w8-shortcuts-rg.txt` | Gate greps |
| `CAPABILITY-MATRIX.md` | W1–W8 code surface matrix |
| `claims-sources-concat.txt` | Claim corpus dump |
| `CLAIMS-REGISTER.md` | ≥11 claims + verdicts |
| `unit-test-list.txt` | Unit inventory |
| `e2e-planner-spec-names.txt` | E2E names |
| `results-planner-dirs.txt` | Historical dirs (empty/missing note OK) |
| `EVIDENCE-COVERAGE.md` | What is proven vs gap |
| `NOTE-FeasibilityCanvas.md` | Deep read |
| `NOTE-OOPlannerWorkspace.md` | Deep read |
| `NOTE-ThreeViewerInner.md` | Deep read |
| **`INVENTORY.md`** | **CP-01 canonical** |
| **`CONTRADICTIONS.md`** | **CP-01 canonical** |
| `PRODUCT-TRUTH.md` | Pointer or companion to INVENTORY |
| `README.md` | Folder index |
| `vitest-capability-smoke-raw.log` | Required smoke |
| `vitest-test-planner-raw.log` | Optional broader if capacity |
| `import-graph-stale-paths.tsv` | Prove fabric-legacy paths missing on disk |
| `authority-path-map.md` | trustdata/ayushdocs → live paths |

### 4.2 Modify (process only if present; no product code)

| Path | Change |
|------|--------|
| `Failures.md` | Append only on blockers |
| `Plans/phases/P01-product-truth/P01-product-truth.md` | Optional note that re-proof ran (prefer **not** rewriting historical DONE table; put re-proof truth in evidence `INVENTORY.md` + `run.json`) |
| Checkpoint ledger | Only if a live CHECKPOINTS path exists; else skip with note |

### 4.3 Read-only (never edit during P01)

All of `site/features/planner/open3d/**`, hosts, routes, `next.config.js`, unit/e2e sources, design spec, honesty docs, `D:\websites/**`.

### 4.4 Test paths exercised (read + run only)

| Test | Role in P01 |
|------|-------------|
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Smoke W8/W3 keyboard |
| `…/threeViewerInner.test.tsx` | Smoke W4 orbit shell |
| `…/open3dFeasibilityCanvas.test.tsx` | Smoke W1 canvas |
| `…/saveReloadContinuity.test.ts` | Smoke W5 unit |
| `…/workspaceStatusLabels.test.ts` | Smoke W6 labels |
| `…/hostWiringP01.test.ts` | Optional extra smoke (host graph) — log if run |

---

## 5. Architecture & data flow (inventory lens)

```
[Buyer opens route]
   guest/canvas → WorkspaceRoute (Providers, ProjectSetupGate)
   open3d       → direct Host
        ↓
Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace
        ↓
  viewMode 2d → FeasibilityCanvas (walls, openings, place, pick, Block2D draw)
  viewMode 3d → Lazy3DViewer → ThreeViewerInner (OrbitControls if enableControls)
        ↓
  project model (UUID, mm) ← placementAction / walls / openings / applySelectionDelete
        ↓
  useOpen3dWorkspaceAutosave → IDB via createAutoSaver
  formatAutosaveStatus → honest "local" strings

Fabric full stage: _archive/fabric + redirects (not live)
Fabric furniture overlay: env === "1" only
```

**P01 data flow:** PowerShell greps + file reads → evidence markdown/tsv/json → CP-01 review. No mutations to document model.

---

## 6. Task list (TDD-style inventory execution)

### Task 00 — Preconditions + evidence scaffold

**Files:**
- Create: `results/planner/world-standard-wave/00-product-truth/{run.json,HEAD.txt,authority-path-map.md}`
- Read: `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`, `Plans/phases/P01-product-truth/P01-product-truth.md`

- [ ] **Step 1: Confirm single worktree and record intent**

Run:

```powershell
cd .
git rev-parse --show-toplevel
git worktree list
git rev-parse HEAD
git status -sb
```

Expected:
- Toplevel is `.` (or equivalent).
- Single worktree only.
- HEAD prints full SHA.
- Status may show dirty files; record honestly in HEAD.txt later.

If multiple worktrees appear: **STOP**, append Failures.md, do not continue.

- [ ] **Step 2: Write authority-path-map.md (live path translation)**

Create `results/planner/world-standard-wave/00-product-truth/authority-path-map.md` with exact content:

```markdown
# Authority path map (P01 re-proof)

| Historical / stale | Live on this checkout |
|--------------------|------------------------|
| `Plans/trustdata/` | **Missing** — use `Plans/phases/` + `Plans/Research/` |
| `Plans/trustdata/RESULTS-MAP.md` | `Plans/Research/RESULTS-MAP.md` |
| `Plans/trustdata/checkpoints/CHECKPOINTS.md` | **May be missing** — CP ledger optional; pack still lands |
| `ayushdocs/*.md` | `Plans/Research/Others/*.md` |
| Evidence `01-product-truth/` | **Forbidden** — use `00-product-truth/` |
| Root `results/` historical PASS | **Missing entire tree 2026-07-10** — re-prove |

Approach: A (product journey first).
Scope: inventory-only. No open3d product edits.
```

- [ ] **Step 3: Create evidence root**

```powershell
cd .
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
Test-Path "results\planner\world-standard-wave\00-product-truth"
```

Expected: `True`

- [ ] **Step 4: Write HEAD.txt**

```powershell
cd .
$out = "results\planner\world-standard-wave\00-product-truth\HEAD.txt"
git rev-parse HEAD | Set-Content -Encoding utf8 $out
git status -sb | Add-Content -Encoding utf8 $out
Get-Content $out
```

Expected: Non-empty file with SHA first line.

- [ ] **Step 5: Write run.json (initial)**

Create `results/planner/world-standard-wave/00-product-truth/run.json` (fill real timestamps/HEAD/agent from Step 1 — example shape):

```json
{
  "phase": "P01-product-truth",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/00-product-truth",
  "scope": "inventory-only",
  "approach": "A",
  "worktrees": false,
  "commitAsWeGo": true,
  "startedAt": "2026-07-10T00:00:00.000Z",
  "head": "REPLACE_WITH_git_rev_parse_HEAD",
  "agent": "P01-reproof-executor",
  "vitestSmoke": "pending",
  "vitestSmokeReason": "",
  "cp01": "in-progress",
  "blockers": [],
  "counts": {
    "filesListed": 0,
    "claimsRegistered": 0,
    "gatesFilled": 0,
    "contradictions": 0
  },
  "notes": "Re-proof because results/ was missing; historical CP-01 PASS not trusted without artifacts."
}
```

Replace `startedAt` and `head` with real values. Do not leave REPLACE placeholders.

- [ ] **Step 6: Commit scaffold**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git status -sb
git commit -m "evidence(P01): re-proof scaffold 00-product-truth (results was missing)"
```

Expected: Commit succeeds with scaffold files.

---

### Task 01 — Tree inventory of production open3d

**Files:**
- Create: `open3d-file-list.txt`, `open3d-folder-counts.tsv`, `key-files-exist.tsv`

- [ ] **Step 1: Write failing existence assertion (pre-list)**

```powershell
cd .
$must = @(
  "site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx",
  "site\features\planner\open3d\editor\OOPlannerWorkspace.tsx",
  "site\features\planner\open3d\3d\ThreeViewerInner.tsx",
  "site\features\planner\open3d\3d\ThreeLazyViewer.tsx",
  "site\features\planner\open3d\ui\Open3dNativeHost.tsx",
  "site\features\planner\ui\Open3dPlannerHost.tsx",
  "site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx",
  "site\features\planner\open3d\editor\useWorkspaceKeyboard.ts",
  "site\features\planner\open3d\editor\useWorkspaceCanvas.ts",
  "site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts",
  "site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric",
  "site\config\build\next.config.js"
)
$bad = @($must | Where-Object { -not (Test-Path $_) })
if ($bad.Count -gt 0) { $bad | ForEach-Object { "MISSING $_" }; exit 1 } else { "ALL_KEY_PATHS_PRESENT" }
```

Expected: `ALL_KEY_PATHS_PRESENT`. If MISSING lines: **STOP**, Failures.md, `cp01: blocked`.

- [ ] **Step 2: Directory listing**

```powershell
cd .
Get-ChildItem -Path "site\features\planner\open3d" -Recurse -File |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\open3d-file-list.txt"
(Get-Content "results\planner\world-standard-wave\00-product-truth\open3d-file-list.txt" | Measure-Object).Count
```

Expected: Count ≫ 50 (repo has large open3d tree). Non-zero required.

- [ ] **Step 3: Folder counts TSV**

```powershell
cd .
Get-ChildItem "site\features\planner\open3d" -Directory |
  ForEach-Object {
    $n = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object).Count
    "{0}`t{1}" -f $_.Name, $n
  } |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\open3d-folder-counts.tsv"
Get-Content "results\planner\world-standard-wave\00-product-truth\open3d-folder-counts.tsv"
```

Expected: Rows for `3d`, `editor`, `catalog`, `canvas-feasibility`, `persistence`, etc.

- [ ] **Step 4: key-files-exist.tsv**

```powershell
cd .
@(
  "site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx",
  "site\features\planner\open3d\editor\OOPlannerWorkspace.tsx",
  "site\features\planner\open3d\3d\ThreeViewerInner.tsx",
  "site\features\planner\open3d\3d\ThreeLazyViewer.tsx",
  "site\features\planner\open3d\ui\Open3dNativeHost.tsx",
  "site\features\planner\ui\Open3dPlannerHost.tsx",
  "site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx",
  "site\features\planner\open3d\editor\useWorkspaceKeyboard.ts",
  "site\features\planner\open3d\editor\useWorkspaceCanvas.ts",
  "site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts",
  "site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric",
  "site\config\build\next.config.js"
) | ForEach-Object {
  "{0}`t{1}" -f $_, (Test-Path $_)
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\key-files-exist.tsv"
Get-Content "results\planner\world-standard-wave\00-product-truth\key-files-exist.tsv"
```

Expected: Every second column `True`. Any `False` → STOP + Failures.md.

- [ ] **Step 5: Update run.json counts.filesListed**

Set `counts.filesListed` to the line count from Step 2 (integer).

- [ ] **Step 6: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): open3d tree inventory file lists"
```

---

### Task 02 — Route and host wiring (claims vs code)

**Files:**
- Create: `host-wiring-rg.txt`, `fabric-redirect-and-archive-rg.txt`, `import-graph-stale-paths.tsv`, `ROUTES.md`
- Read: guest/canvas/open3d pages, both hosts, NativeHost, open3d README, archive README, next.config.js, `importGraphProof.ts`

- [ ] **Step 1: Grep host wiring**

```powershell
cd .
$out = "results\planner\world-standard-wave\00-product-truth"
rg -n "Open3dNativeHost|OOPlannerWorkspace|FeasibilityCanvas|ThreeLazyViewer|ThreeViewerInner|Open3dPlannerHost|Open3dPlannerWorkspaceRoute|Lazy3DViewer" site/app/planner site/features/planner --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "$out\host-wiring-rg.txt"
(Get-Item "$out\host-wiring-rg.txt").Length
```

Expected: Non-empty file; includes app pages and feature hosts.

- [ ] **Step 2: Grep fabric redirect + archive**

```powershell
cd .
$out = "results\planner\world-standard-wave\00-product-truth"
rg -n "planner/fabric|OPEN3D_FABRIC|fabricFurnitureFlag|_archive/fabric" site/config/build/next.config.js site/features/planner site/app/planner --glob "*.{js,ts,tsx,md}" |
  Set-Content -Encoding utf8 "$out\fabric-redirect-and-archive-rg.txt"
Select-String -Path "$out\fabric-redirect-and-archive-rg.txt" -Pattern "destination: \"/planner/open3d"
```

Expected: next.config redirect lines present in grep output.

- [ ] **Step 3: Prove importGraphProof fabric paths missing on disk**

```powershell
cd .
@(
  "site\app\planner\(workspace)\fabric\guest\page.tsx",
  "site\app\planner\(workspace)\fabric\canvas\page.tsx",
  "site\app\planner\fabric"
) | ForEach-Object {
  "{0}`t{1}" -f $_, (Test-Path $_)
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\import-graph-stale-paths.tsv"
Get-Content "results\planner\world-standard-wave\00-product-truth\import-graph-stale-paths.tsv"
```

Expected: All `False` (proves graph staleness).

- [ ] **Step 4: Deep-read route sources (no edits) — capture notes into ROUTES.md**

Read each file completely enough to quote import targets:

1. `site/app/planner/(workspace)/guest/page.tsx` — imports WorkspaceRoute; comment may still mention fabric archive fallback.
2. `site/app/planner/(workspace)/canvas/page.tsx` — same.
3. `site/app/planner/open3d/page.tsx` — direct Host; force-dynamic; guest from auth.
4. `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` — Providers + ProjectSetupGate + dynamic Host ssr:false.
5. `site/features/planner/ui/Open3dPlannerHost.tsx` — thin wrapper to NativeHost.
6. `site/features/planner/open3d/ui/Open3dNativeHost.tsx` — OOPlannerWorkspace.
7. `site/features/planner/open3d/README.md` Route wiring table.
8. `site/features/planner/_archive/fabric/README.md` Rollback section.
9. `site/config/build/next.config.js` redirects around lines 206–207.
10. `site/features/planner/open3d/cleanup/importGraphProof.ts` PRODUCTION_IMPORT_GRAPH fabric-legacy rows.

- [ ] **Step 5: Write ROUTES.md**

Create `results/planner/world-standard-wave/00-product-truth/ROUTES.md` using this full template (fill Actual behavior from Step 4; Match? column must be honest):

```markdown
# ROUTES — claims vs code (P01)

## Dual host entry

| Claim source | Claim text (quote) | Code path | Actual behavior | Match? |
|--------------|-------------------|-----------|-----------------|--------|
| guest page header | (quote) | site/app/planner/(workspace)/guest/page.tsx | Open3dPlannerWorkspaceRoute → … | yes/no |
| canvas page header | (quote) | …/canvas/page.tsx | WorkspaceRoute | yes/no |
| open3d page header | (quote) | …/open3d/page.tsx | Direct Open3dPlannerHost | yes/no |
| open3d README route table | guest → Open3dPlannerHost | README.md | Actually WorkspaceRoute first | no (partial) |
| open3d README | fabric/* legacy fallback | README.md | Redirect only | no |
| archive README | explicit fallback /planner/fabric/guest | _archive/fabric/README.md | Redirect to open3d | no |
| next.config.js | permanent redirect fabric → open3d | next.config.js | Confirmed | yes |
| importGraphProof | fabric-legacy page paths | importGraphProof.ts | Files missing on disk | no |

## Live mount chains

### Guest / canvas
`page → Open3dPlannerWorkspaceRoute → Providers + ProjectSetupGate → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace → FeasibilityCanvas | Lazy3DViewer → ThreeViewerInner`

### Pilot open3d
`page → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace → …` (no ProjectSetupGate)

## Fabric truth

| Fact | Evidence |
|------|----------|
| No app fabric page tree | import-graph-stale-paths.tsv all False |
| Permanent redirects | fabric-redirect-and-archive-rg.txt + next.config.js |
| Live 2D | FeasibilityCanvas |
| Overlay flag | fabricFurnitureFlag.ts exact "1" |

## Grep artifacts
- host-wiring-rg.txt
- fabric-redirect-and-archive-rg.txt
- import-graph-stale-paths.tsv
```

- [ ] **Step 6: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): route and host wiring claims vs code"
```

---

### Task 03 — W1–W8 capability matrix (code surface)

**Files:**
- Create: `w1-draw-rg.txt` … `w8-shortcuts-rg.txt`, `CAPABILITY-MATRIX.md`
- Read: FeasibilityCanvas (selection/draw), OOPlannerWorkspace (deleteSelection, viewMode, Lazy3DViewer mount), ThreeViewerInner (OrbitControls), useWorkspaceKeyboard, useOpen3dWorkspaceAutosave, placement/modular paths

- [ ] **Step 1: Symbol greps (one file per gate — no bare 2d|3d)**

```powershell
cd .
$out = "results\planner\world-standard-wave\00-product-truth"

rg -n "addOpen3dWall|drawWall|wallTool|useDoorWindowPlacement|addDoor|addWindow" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w1-draw-rg.txt"
rg -n "placementAction|placeModular|cabinet-v0|furnitureBlock2D|Block2D|handleInventoryPlace" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w2-place-rg.txt"
rg -n "deleteSelection|applySelectionDelete|selectedFurniture|pickFurnitureAtPoint|Backspace|Delete" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w3-select-delete-rg.txt"
rg -n "OrbitControls|enableControls|enableOrbit|viewMode|getOpen3dViewerControlProps|OPEN3D_ORBIT_DEFAULT" site/features/planner/open3d/3d site/features/planner/open3d/editor --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w4-orbit-view-rg.txt"
rg -n "autosave|flush|idb|indexedDB|saveProject|schedulePersist|createAutoSaver" site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w5-save-rg.txt"
rg -n "Saved locally|local|cloud|statusLabel|workspaceStatus|formatAutosaveStatus|memberPlan|guestProject" site/features/planner/open3d/editor site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w6-honesty-rg.txt"
rg -n "modularCabinet|box|mesh|procedural|generatedGlb|createSceneObjectFromNode" site/features/planner/open3d/catalog site/features/planner/open3d/3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w7-mesh-rg.txt"
rg -n "CANVAS_TOOL_SHORTCUTS|key ===|shortcut|Hotkey|paletteCommands|CanvasTool|useWorkspaceKeyboard" site/features/planner/open3d/editor site/features/planner/open3d/lib/commands --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w8-shortcuts-rg.txt"

1..8 | ForEach-Object { $f = Get-ChildItem $out -Filter "w$_-*.txt"; "{0}`t{1}" -f $f.Name, (Get-Item $f.FullName).Length }
```

Expected: All eight files non-empty.

- [ ] **Step 2: Line-level reads for matrix (record path:line)**

Minimum symbols to locate (use rg output; read surrounding lines):

| Gate | Symbol | Expected path (verify) |
|------|--------|------------------------|
| W1 | `addOpen3dWall` / wall tool | FeasibilityCanvas + `model/actions/walls.ts` |
| W1 | `useDoorWindowPlacement` | `editor/useDoorWindowPlacement.ts` |
| W2 | `handleInventoryPlace` / `placementAction` | OOPlannerWorkspace + `catalog/placementAction.ts` |
| W2 | `furnitureBlock2D` / modularCabinetV0 | catalog files |
| W3 | `deleteSelection` | OOPlannerWorkspace ~line 326 |
| W3 | Delete/Backspace handler | useWorkspaceKeyboard ~83–86 |
| W3 | `applySelectionDelete` | workspaceEntityHelpers.ts ~112 |
| W3 | `pickFurnitureAtPoint` | canvasPicking + FeasibilityCanvas |
| W4 | `OrbitControls` import | ThreeViewerInner ~171–176 |
| W4 | `getOpen3dViewerControlProps` | OOPlannerWorkspace Lazy3DViewer mount ~1010 |
| W4 | `OPEN3D_ORBIT_DEFAULT_ENABLED` | orbitDefaults.ts = true |
| W5 | `schedulePersist` / flush | useOpen3dWorkspaceAutosave |
| W6 | `formatAutosaveStatus` | workspaceStatusLabels.ts ~31–48 |
| W7 | modular cabinet + scene object | modularCabinetV0 + createSceneObjectFromNode |
| W8 | `CANVAS_TOOL_SHORTCUTS` | canvasTool.ts; keyboard invert map |

- [ ] **Step 3: Write CAPABILITY-MATRIX.md**

Create full matrix. **Status vocabulary only:**  
`code-present`, `code-partial`, `code-absent`, `unit-green`, `unit-missing`, `browser-missing`, `docs-overclaim`  
Combine with `+` when needed.

**Rules:**
- No empty gate rows.
- Do **not** mark `unit-green` until Task 05 smoke log exists; until then use `unit-missing` or name unit file path with `unit-missing` if file exists but not yet proven this run.
- Do **not** mark browser-green; use `browser-missing` while results tree was empty (after Task 05, if no Playwright artifacts under results/planner, keep browser-missing).

Template (fill every cell; example pre-fill based on 2026-07-10 pre-read — executor must re-verify line numbers from greps):

```markdown
# CAPABILITY-MATRIX — W1–W8 (code surface, P01)

| Gate | Symbol / handler exists? | Path:line | Wired to UI? | Unit test file | Browser proof in results/? | Honest status |
|------|--------------------------|-----------|--------------|----------------|----------------------------|---------------|
| W1 | addOpen3dWall / wall tool | FeasibilityCanvas.tsx + model/actions/walls.ts | yes via CanvasToolRail wall | open3dFeasibilityCanvas.test.tsx; doorWindowPlacement.test.ts | browser-missing | code-present+unit-missing+browser-missing |
| W1 | door/window placement | useDoorWindowPlacement.ts | yes | doorWindowPlacement.test.ts | browser-missing | code-present+browser-missing |
| W2 | inventory place | OOPlannerWorkspace handleInventoryPlace; placementAction.ts | yes InventoryPanel | catalog tests; modular place tests | browser-missing | code-present+browser-missing |
| W2 | cabinet-v0 / Block2D | modularCabinetV0.ts; furnitureBlock2D.ts | partial product quality | furnitureBlock2D.cabinet-v0.test.ts | browser-missing | code-present+code-partial+browser-missing |
| W3 | deleteSelection | OOPlannerWorkspace.tsx | yes keyboard | applySelectionDelete.test.ts; open3dWorkspaceKeyboard.test.tsx | browser-missing | code-present+browser-missing |
| W3 | pick furniture | canvasPicking pickFurnitureAtPoint + FeasibilityCanvas | yes select tool | open3dFeasibilityCanvas / geometry tests | browser-missing | code-present+browser-missing |
| W4 | OrbitControls | ThreeViewerInner.tsx | yes when enableControls | threeViewerInner.test.tsx; orbitControlsDefault.test.tsx | browser-missing | code-present+browser-missing |
| W4 | viewMode 2d/3d | OOPlannerWorkspace viewMode + Tab toggle | yes | poseContinuityW4.test.ts | browser-missing | code-present+browser-missing |
| W5 | autosave IDB | useOpen3dWorkspaceAutosave.ts | yes workspace | saveReloadContinuity.test.ts | browser-missing | code-present+browser-missing |
| W6 | formatAutosaveStatus local | workspaceStatusLabels.ts | yes status UI | workspaceStatusLabels.test.ts | browser-missing | code-present+browser-missing |
| W7 | modular mesh path | modularCabinetV0; createSceneObjectFromNode | yes 3D path | modularCabinetV0.test.ts; createSceneObjectFromNode.test.ts | browser-missing | code-present+code-partial+browser-missing+docs-overclaim-if-ship-claim |
| W8 | shortcuts map | canvasTool CANVAS_TOOL_SHORTCUTS + useWorkspaceKeyboard | yes tool rail labels | toolShortcutTruth.test.ts; open3dWorkspaceKeyboard.test.tsx | browser-missing | code-present+browser-missing |

## Orbit honesty (three-layer)

| Layer | Finding |
|-------|---------|
| code-present | OrbitControls constructed when enableControls true |
| product default | OPEN3D_ORBIT_DEFAULT_ENABLED = true; getOpen3dViewerControlProps forces true |
| docs claim | WAVE.md missing; design §1 older “fails world bar” language may lag |
| product-usable | **Not proven in P01** without browser pack under results/ |

## Select/delete honesty (three-layer)

| Layer | Finding |
|-------|---------|
| code-present | deleteSelection + keyboard + applySelectionDelete + pickFurniture |
| unit | named tests exist; smoke in Task 05 |
| docs claim | design §1 still says no furniture select/delete — likely stale |
| product-usable | browser-missing until results Playwright |

## After Task 05
Update unit-* tokens using vitest-capability-smoke-raw.log cites only.
```

- [ ] **Step 4: Set run.json counts.gatesFilled = 8**

- [ ] **Step 5: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): W1-W8 capability matrix from live code greps"
```

---

### Task 04 — Claims corpus + CLAIMS-REGISTER

**Files:**
- Create: `claims-sources-concat.txt`, `CLAIMS-REGISTER.md`, `fabric-flag-rg.txt`
- Read: live claim sources listed below

**Claim sources (live paths):**

| Source | Path |
|--------|------|
| Open3d README | `site/features/planner/open3d/README.md` |
| Fabric archive README | `site/features/planner/_archive/fabric/README.md` |
| Honest quality | `Plans/Research/Others/04-HONEST-QUALITY.md` |
| Evidence index | `Plans/Research/Others/08-EVIDENCE-INDEX.md` |
| Verify snapshot | `Plans/Research/Others/09-VERIFY-SNAPSHOT.md` |
| Pending | `Plans/Research/Others/00-PENDING.md` |
| Goals scoreboard | `Plans/Research/Others/19-GOALS-SLICES.md` |
| Product context | `Plans/Research/Others/18-PRODUCT-CONTEXT.md` |
| Session recap | `Plans/Research/Others/SESSION-RECAP.md` |
| Design | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Phase card | `Plans/phases/P01-product-truth/P01-product-truth.md` |
| WAVE | `results/planner/world-standard-wave/WAVE.md` (expect MISSING) |
| Import graph | `site/features/planner/open3d/cleanup/importGraphProof.ts` |

- [ ] **Step 1: Concat claim sources**

```powershell
cd .
@(
  "Plans\Research\Others\04-HONEST-QUALITY.md",
  "Plans\Research\Others\08-EVIDENCE-INDEX.md",
  "Plans\Research\Others\09-VERIFY-SNAPSHOT.md",
  "Plans\Research\Others\00-PENDING.md",
  "Plans\Research\Others\19-GOALS-SLICES.md",
  "Plans\Research\Others\18-PRODUCT-CONTEXT.md",
  "Plans\Research\Others\SESSION-RECAP.md",
  "results\planner\world-standard-wave\WAVE.md",
  "docs\superpowers\specs\2026-07-09-world-standard-planner-design.md",
  "Plans\phases\P01-product-truth\P01-product-truth.md",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric\README.md",
  "site\features\planner\open3d\cleanup\importGraphProof.ts"
) | ForEach-Object {
  "===== $_ ====="
  if (Test-Path $_) { Get-Content $_ -Raw } else { "(MISSING FILE)" }
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\claims-sources-concat.txt"
Select-String -Path "results\planner\world-standard-wave\00-product-truth\claims-sources-concat.txt" -Pattern "MISSING FILE"
```

Expected: WAVE.md (and any other missing) marked MISSING FILE; Others paths present.

- [ ] **Step 2: Fabric flag dedicated grep**

```powershell
cd .
rg -n "OPEN3D_FABRIC_FURNITURE|fabricFurnitureFlag|isOpen3dFabricFurnitureEnabled" site/features/planner/open3d --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\fabric-flag-rg.txt"
```

- [ ] **Step 3: Write CLAIMS-REGISTER.md**

Create with **≥13** rows (minimum 11 + raised). Verdict ∈ `supported` | `contradicted` | `stale` | `unverified`.

```markdown
# CLAIMS-REGISTER (P01)

| ID | Source path | Claim (verbatim short) | Verified against | Verdict |
|----|-------------|------------------------|------------------|---------|
| C01 | open3d/README.md | Live 2-D is FeasibilityCanvas not Fabric | FeasibilityCanvas.tsx; flag default off | supported |
| C02 | fabricFurnitureFlag.ts / README | Overlay only when env exactly 1 | fabric-flag-rg.txt; isOpen3dFabricFurnitureEnabled | supported |
| C03 | open3d README + archive README | /planner/fabric/* legacy fallback workspace | next.config permanent redirect; no app pages; import-graph-stale-paths.tsv | contradicted |
| C04 | 04-HONEST-QUALITY.md | Spine ≠ ship quality / ~20–30% production | product context; PENDING product not finished | supported |
| C05 | design §1 Problem | no furniture select/delete (user-visible fail) | deleteSelection + keyboard + pickFurniture + unit tests | stale (code advanced; browser still unverified this checkout) |
| C06 | 00-PENDING / honest quality | Mesh still boxy residual | modular multiparts; mesh greps | supported (partial product quality) |
| C07 | design / historical WAVE | orbit / 3D world bar fail | OrbitControls + default true + workspace props | stale or contradicted for code-present; product-usable unverified |
| C08 | workspaceStatusLabels + PENDING | Save local-only honesty; no cloud | formatAutosaveStatus strings; member cloud not claimed in labels | supported for local honesty |
| C09 | PENDING / RESULTS-MAP | Playwright journey pack under world-standard-wave | results/ missing | contradicted (artifacts absent) |
| C10 | newEntityId.ts / design | Entity ids crypto.randomUUID | newEntityId.ts | supported |
| C11 | route pages + WorkspaceRoute | Dual entry guest/canvas vs open3d pilot | ROUTES.md; host-wiring-rg | supported |
| C12 | P01 plan status + PENDING GATE PASS | CP-01 / W-gates pass with artifacts | results/ missing | contradicted on this checkout |
| C13 | importGraphProof.ts | fabric-legacy production routes exist | import-graph-stale-paths.tsv False | contradicted |
| C14 | open3d README guest/canvas → Open3dPlannerHost | Omits WorkspaceRoute | guest/canvas import WorkspaceRoute | stale/partial |
| C15 | 18-PRODUCT-CONTEXT | Fabric destination; Feasibility interim; Three 3D | ENGINE teaching + code hybrid | supported as intent + live interim |
```

Executor must refresh claim quotes with short verbatim snippets from concat file.

- [ ] **Step 4: Update run.json counts.claimsRegistered**

- [ ] **Step 5: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): claims register vs live code"
```

---

### Task 05 — Tests + results map + required vitest smoke

**Files:**
- Create: `unit-test-list.txt`, `e2e-planner-spec-names.txt`, `results-planner-dirs.txt`, `EVIDENCE-COVERAGE.md`, `vitest-capability-smoke-raw.log`
- Update: `run.json` vitestSmoke fields; CAPABILITY-MATRIX unit tokens after smoke

- [ ] **Step 1: List open3d unit tests**

```powershell
cd .
Get-ChildItem "site\tests\unit\features\planner\open3d" -Recurse -File -Filter "*.ts*" |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\unit-test-list.txt"
(Get-Content "results\planner\world-standard-wave\00-product-truth\unit-test-list.txt" | Measure-Object).Count
```

Expected: Dozens of files (hostWiringP01, keyboard, threeViewer, etc.).

- [ ] **Step 2: List Playwright planner-related specs**

```powershell
cd .
$names = @(
  Get-ChildItem "site\tests\e2e" -File -Filter "*planner*" | ForEach-Object { $_.Name }
  Get-ChildItem "site\tests\e2e" -File -Filter "open3d-*" | ForEach-Object { $_.Name }
  @("admin-svg-publish-p01.spec.ts", "sketch-to-plan-pipeline.spec.ts") |
    Where-Object { Test-Path "site\tests\e2e\$_" }
) | Sort-Object -Unique
$names | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\e2e-planner-spec-names.txt"
Get-Content "results\planner\world-standard-wave\00-product-truth\e2e-planner-spec-names.txt"
```

Expected: Includes `open3d-world-standard-journey.spec.ts`, w3/w4/save-honesty specs, planner-* suite, admin-svg + sketch-to-plan.

- [ ] **Step 3: Map results/planner directories (honest missing)**

```powershell
cd .
$out = "results\planner\world-standard-wave\00-product-truth\results-planner-dirs.txt"
if (Test-Path "results\planner") {
  Get-ChildItem "results\planner" -Directory |
    Select-Object -ExpandProperty Name |
    Sort-Object |
    Set-Content -Encoding utf8 $out
} else {
  @(
    "(results/planner MISSING on disk at inventory time)",
    "NOTE: world-standard-wave/00-product-truth is being created by this re-proof only"
  ) | Set-Content -Encoding utf8 $out
}
Get-Content $out
```

Expected: Missing note OR directory names if partially created.

- [ ] **Step 4: Write EVIDENCE-COVERAGE.md**

```markdown
# EVIDENCE-COVERAGE (P01)

## Snapshot

| Concern | Unit test path(s) | results/planner/* dir | Covers W? | Gap for world-standard |
|---------|-------------------|----------------------|-----------|------------------------|
| Keyboard / delete | open3dWorkspaceKeyboard.test.tsx; applySelectionDelete.test.ts | missing historically | W3/W8 unit | browser pack |
| Feasibility canvas | open3dFeasibilityCanvas.test.tsx; feasibility.test.ts | missing | W1 unit | browser draw |
| Orbit / 3D shell | threeViewerInner.test.tsx; orbitControlsDefault.test.tsx; poseContinuityW4.test.ts | missing | W4 unit | browser orbit continuity |
| Save continuity unit | saveReloadContinuity.test.ts | missing (historical save-reload-continuity/) | W5 unit | hard-reload Playwright |
| Status honesty | workspaceStatusLabels.test.ts; topBarGuest tests | missing | W6 unit | UI e2e labels |
| Place / modular | modular*.test.ts; furnitureBlock2D*.test.ts | missing modular-* historical | W2/W7 unit | mesh bar browser |
| Host wiring | hostWiringP01.test.ts; routesCoverage.test.tsx | this pack greps | baseline | n/a |
| Journey e2e source | open3d-world-standard-journey.spec.ts | **no results artifacts** | W1–W2 intended | re-run → 02-browser-open3d-journey/ |
| Select e2e source | open3d-w3-select-delete.spec.ts | missing | W3 | 03-select-delete/ |
| Orbit e2e source | open3d-w4-orbit-continuity.spec.ts | missing | W4 | 04-orbit-continuity/ |
| Save honesty e2e | open3d-save-honesty.spec.ts | missing | W5–W6 | 06-save-honesty/ |

## Explicit notes

1. `results/planner/world-standard-wave/` at start of re-proof: **absent** (only 00-product-truth being created).
2. WAVE.md / COMPARISON-CHART.md: missing — research context may live only under D:\websites.
3. Template journey folder `02-browser-open3d-journey/` is **later** (P07), not P01 browser work.
4. Spec files under `site/tests/e2e/` do **not** equal green gates without results artifacts.
5. PENDING claims GATE PASS — **not re-verified** on this checkout until folders restored or re-run.
6. Historical sibling dirs (p0-1, modular-place, save-reload-continuity, a11y-open3d, …) are spine-only when present; currently parent tree missing.

## Smoke this run

See vitest-capability-smoke-raw.log + run.json vitestSmoke.
```

- [ ] **Step 5: Required unit smoke attempt (non-mutating)**

```powershell
cd .
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/threeViewerInner.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --config vitest.site.config.ts 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-capability-smoke-raw.log"
$LASTEXITCODE
```

Then set `run.json`:

| Outcome | vitestSmoke | vitestSmokeReason |
|---------|-------------|-------------------|
| Exit 0, log non-empty | `ok` | `""` |
| Non-zero / env failure | `failed` | first-line error / short reason |
| Owner-waived only | `skipped` | waiver + who |

**Silent skip = CP-01 fail.** `pending` forbidden at CP close.

If smoke ok, update CAPABILITY-MATRIX rows for those five suites to include `unit-green` with cite `vitest-capability-smoke-raw.log`.

Optional broader:

```powershell
cd site
pnpm run test:planner 2>&1 | Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-test-planner-raw.log"
```

- [ ] **Step 6: Optional hostWiring smoke (recommended)**

```powershell
cd .
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/hostWiringP01.test.ts `
  --config vitest.site.config.ts 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-hostWiringP01-raw.log"
```

Note: test asserts PRODUCTION_IMPORT_GRAPH shape including fabric-legacy **ids** — may **pass** even when files missing (graph is data, not fs). Record this as honesty note: unit pass ≠ routes exist. Cross-link import-graph-stale-paths.tsv.

- [ ] **Step 7: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): unit/e2e/results coverage map and smoke logs"
```

---

### Task 06 — Deep-read notes (three core files)

**Files:**
- Create: `NOTE-FeasibilityCanvas.md`, `NOTE-OOPlannerWorkspace.md`, `NOTE-ThreeViewerInner.md`
- Read: full FeasibilityCanvas.tsx, OOPlannerWorkspace.tsx, ThreeViewerInner.tsx, ThreeLazyViewer.tsx props/orbitDefaults

- [ ] **Step 1: NOTE-FeasibilityCanvas.md**

Required headings (fill from code, with path:line citations):

```markdown
# NOTE — FeasibilityCanvas

## 1. Props / handle API
- FeasibilityCanvasHandle: undo, redo, cancel, commit, resetZoom, fitToView, setTool, getProject
- Variants: proof | embedded
- CanvasStatusSnapshot fields as found

## 2. Tools implemented
- Map PlannerTool → behavior (wall, select, room, door, window, placement, pan, dimension, text, opening)
- DrawingState machine summary

## 3. Furniture hit-testing / selection
- pickFurnitureAtPoint / pickWall / pickOpening usage
- How selection is exposed to parent (callbacks / context)

## 4. What it does **not** do (code absence)
- Not Fabric full stage
- Not cloud save
- Not 3D rendering

## 5. Dependencies on workspace store/model
- Open3dProject, addOpen3dWall, pureActions, furnitureBlock2D, newEntityId, WorkspaceCanvasContext
```

- [ ] **Step 2: NOTE-OOPlannerWorkspace.md**

```markdown
# NOTE — OOPlannerWorkspace

## 1. Composition tree
- TopBar, CanvasToolRail, InventoryPanel, FeasibilityCanvas vs Lazy3DViewer, panels, status strings

## 2. deleteSelection behavior
- applySelectionDelete; entity types; locked entities; wall cascade doors/windows
- Clears selection after delete

## 3. Keyboard wiring
- useWorkspaceKeyboard handlers map (delete, undo, redo, toggleView Tab, tools)

## 4. Persistence hooks
- useOpen3dWorkspaceAutosave; formatAutosaveStatus display

## 5. Guest vs member differences
- guestMode props; status label differences; planId

## 6. 3D mount
- viewMode toggle; Lazy3DViewer + getOpen3dViewerControlProps()
```

- [ ] **Step 3: NOTE-ThreeViewerInner.md**

```markdown
# NOTE — ThreeViewerInner (+ Lazy3DViewer)

## 1. Scene construction entry
- dynamic three import; scene/camera/renderer/lights/grid/floor; content group name

## 2. OrbitControls
- when created (enableControls); defaults OPEN3D_ORBIT_DEFAULT_ENABLED true
- damping, maxPolarAngle, min/max distance
- orbitEnabled state for Playwright truth

## 3. GLB vs procedural mesh path
- buildOpen3dSceneNodes / createSceneObjectFromNode / loadGeneratedGlbObject references

## 4. Continuity / camera assumptions
- initial camera position; lookAt; no claim of pose restore in this file alone

## 5. Known failure modes
- cancelled load; dispose while OrbitControls import in flight; WebGL errors

## 6. Docs conflict note
- Design/PENDING/historical WAVE vs code presence — cite path:line for OrbitControls construct
```

- [ ] **Step 4: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): deep-read notes for canvas workspace viewer"
```

---

### Task 07 — Canonical inventory pack + CP-01 ready

**Files:**
- Create: `INVENTORY.md`, `CONTRADICTIONS.md`, `PRODUCT-TRUTH.md`, `README.md`
- Update: `run.json` finalize

- [ ] **Step 1: Write CONTRADICTIONS.md**

Pull all `contradicted` / `stale` claims + matrix `docs-overclaim`. Minimum rows:

```markdown
# CONTRADICTIONS.md (CP-01 canonical)

| ID | Claim source | Claim | Code / config path | Evidence | Severity |
|----|--------------|-------|--------------------|----------|----------|
| X01 | P01 status + PENDING GATE PASS | Artifacts pass / CP-01 pass | results/ was missing | results-planner-dirs.txt; this re-proof | P0 |
| X02 | open3d README + archive README | Fabric URL fallback works | next.config.js redirects | fabric-redirect-and-archive-rg.txt | P0 |
| X03 | importGraphProof.ts | fabric guest/canvas pages in production graph | missing page files | import-graph-stale-paths.tsv | P0 |
| X04 | design §1 | no furniture select/delete | OOPlannerWorkspace deleteSelection; keyboard; pickFurniture | w3-select-delete-rg.txt; NOTE-* | P1 stale docs |
| X05 | design/WAVE-era orbit absence | no orbit / 3D fail | ThreeViewerInner OrbitControls; orbitDefaults true | w4-orbit-view-rg.txt; NOTE-ThreeViewerInner | P1 |
| X06 | README guest → Host only | skips WorkspaceRoute | guest/canvas pages | ROUTES.md | P1 |
| X07 | Any “cloud saved” UI if found | cloud truth | formatAutosaveStatus local only | w6-honesty-rg.txt | P1 if present |
| X08 | P0 done = ship | ship quality | 04-HONEST-QUALITY; PENDING product OPEN | CLAIMS-REGISTER | P0 honesty |

## Product honesty (not a bug)

GATE PASS language (when artifacts exist) ≠ product finished. Keep both facts.
```

- [ ] **Step 2: Write INVENTORY.md (CP-01 path of record)**

```markdown
# Product inventory — open3d (P01 re-proof)

## One-paragraph reality
(Fill only from code + this pack's evidence — no buyer browser claims.)

Example structure to complete with measured facts:

> On this checkout, a facilities buyer **can reach** live hybrid planner routes `/planner/guest`, `/planner/canvas`, and `/planner/open3d`. Live 2D is **FeasibilityCanvas** (not Fabric full stage). Fabric furniture overlay is flag-gated default OFF; `/planner/fabric*` permanently redirects to open3d. Workspace wires **deleteSelection**, keyboard Delete/Backspace, inventory place, Tab 2D↔3D, OrbitControls default ON, and **local-only** autosave status strings. **Browser journey green is not re-proven here** because `results/` was missing at start; unit smoke outcome: **[ok|failed|skipped from run.json]**. Product is **not** buyer-finished per PENDING honesty.

## Engine truth

| Layer | Live engine | Flag / archive / redirect |
|-------|-------------|---------------------------|
| 2D interactive | FeasibilityCanvas (Canvas 2D) | Fabric overlay env=1 only |
| 2D destination | Fabric v7 full stage | archive `_archive/fabric/`; Phase 2B later |
| Fabric routes | none live | permanent redirect → /planner/open3d/ |
| 3D | Three via Lazy3DViewer / ThreeViewerInner | Orbit default ON |
| Persist | IDB autosave | local labels; cloud not claimed in status helper |
| IDs | crypto.randomUUID via newEntityId | — |

## Host / routes
(dual entry — paste from ROUTES.md)

## Gate snapshot (W1–W8)

| Gate | Code | Unit | Browser | Blocker one-liner |
|------|------|------|---------|-------------------|
| W1 | from matrix | from matrix/smoke | browser-missing | need P07 pack |
| W2 | | | browser-missing | need P07 + P05 |
| W3 | | | browser-missing | need P03 pack |
| W4 | | | browser-missing | need P04 pack |
| W5 | | | browser-missing | need P06 save-reload |
| W6 | | | browser-missing | need P06 labels e2e |
| W7 | | | browser-missing | need P08 mesh bar |
| W8 | | | browser-missing | need P09 |

## Evidence index
- CAPABILITY-MATRIX.md
- CLAIMS-REGISTER.md
- CONTRADICTIONS.md
- ROUTES.md
- NOTE-*
- EVIDENCE-COVERAGE.md
- greps w1–w8, host, fabric
- vitest-capability-smoke-raw.log
- run.json / HEAD.txt

## Inputs for P02 engine lock
1. Freeze live 2D = FeasibilityCanvas; Fabric = destination + overlay flag + redirect — do not thrash Konva.
2. OrbitControls code location: ThreeViewerInner + orbitDefaults; do not treat missing WAVE as code truth.
3. Do not thrash engines because canvas DOM bugs (render diagnostic teaching).
4. Stale importGraphProof fabric routes are claim bugs, not alternate live engines.
5. approach A in run.json.

## CP-01
- status: ready-for-review
- reviewer: (pending owner/reviewer)
- date: (ISO date of pack land)
- notes: re-proof after missing results/; historical PASS not trusted without this pack
```

- [ ] **Step 3: Write PRODUCT-TRUTH.md pointer**

```markdown
# PRODUCT-TRUTH

Canonical inventory: [INVENTORY.md](./INVENTORY.md)  
Contradictions: [CONTRADICTIONS.md](./CONTRADICTIONS.md)  
Matrix: [CAPABILITY-MATRIX.md](./CAPABILITY-MATRIX.md)  
Claims: [CLAIMS-REGISTER.md](./CLAIMS-REGISTER.md)
```

- [ ] **Step 4: Write folder README.md**

List **every** artifact from §4.1 with one-line purpose. Mark INVENTORY.md and CONTRADICTIONS.md as **CP-01 required**.

- [ ] **Step 5: Finalize run.json**

Required final keys:

```json
{
  "phase": "P01-product-truth",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/00-product-truth",
  "scope": "inventory-only",
  "approach": "A",
  "worktrees": false,
  "commitAsWeGo": true,
  "startedAt": "<ISO>",
  "finishedAt": "<ISO>",
  "head": "<start HEAD>",
  "headEnd": "<git rev-parse HEAD after final commit>",
  "agent": "<id>",
  "vitestSmoke": "ok|failed|skipped",
  "vitestSmokeReason": "",
  "cp01": "ready-for-review",
  "blockers": [],
  "counts": {
    "filesListed": 0,
    "claimsRegistered": 0,
    "gatesFilled": 8,
    "contradictions": 0
  },
  "notes": "Re-proof complete; awaiting reviewer pass mark"
}
```

Set real counts from artifacts. If blockers remain, `cp01: "blocked"` with non-empty blockers array.

- [ ] **Step 6: Final evidence commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git status -sb
git commit -m "evidence(P01): product truth inventory ready for CP-01 (re-proof)"
```

- [ ] **Step 7: CP-01 self-check script (fail closed)**

```powershell
cd .
$root = "results\planner\world-standard-wave\00-product-truth"
$required = @(
  "run.json","HEAD.txt","open3d-file-list.txt","open3d-folder-counts.tsv","key-files-exist.tsv",
  "host-wiring-rg.txt","fabric-redirect-and-archive-rg.txt","ROUTES.md",
  "w1-draw-rg.txt","w2-place-rg.txt","w3-select-delete-rg.txt","w4-orbit-view-rg.txt",
  "w5-save-rg.txt","w6-honesty-rg.txt","w7-mesh-rg.txt","w8-shortcuts-rg.txt",
  "CAPABILITY-MATRIX.md","claims-sources-concat.txt","CLAIMS-REGISTER.md","fabric-flag-rg.txt",
  "unit-test-list.txt","e2e-planner-spec-names.txt","results-planner-dirs.txt","EVIDENCE-COVERAGE.md",
  "NOTE-FeasibilityCanvas.md","NOTE-OOPlannerWorkspace.md","NOTE-ThreeViewerInner.md",
  "INVENTORY.md","CONTRADICTIONS.md","PRODUCT-TRUTH.md","README.md",
  "vitest-capability-smoke-raw.log"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) -or ((Get-Item (Join-Path $root $_)).Length -eq 0) })
if ($missing.Count -gt 0) { "FAIL missing/empty:"; $missing; exit 1 } else { "PASS all required artifacts non-empty" }
# key files all True
$badKeys = Get-Content "$root\key-files-exist.tsv" | Where-Object { $_ -notmatch "`tTrue$" }
if ($badKeys) { "FAIL key-files"; $badKeys; exit 1 } else { "PASS key-files-exist" }
# vitestSmoke not pending
$rj = Get-Content "$root\run.json" -Raw | ConvertFrom-Json
if ($rj.vitestSmoke -eq "pending") { "FAIL vitestSmoke pending"; exit 1 } else { "PASS vitestSmoke=$($rj.vitestSmoke)" }
```

Expected: all PASS. If FAIL → fix artifacts before claiming ready-for-review.

---

### Task 08 — CP-01 reviewer close (owner/reviewer — not auto)

- [ ] **Step 1: Review pack against criteria table §9**

- [ ] **Step 2: Footer in INVENTORY.md**

```markdown
## CP-01
- status: pass|fail
- reviewer: <name>
- date: <ISO date>
- notes: re-proof pack under 00-product-truth/
```

- [ ] **Step 3: Set run.json cp01 to pass|fail**

- [ ] **Step 4: If a checkpoints ledger exists on disk, update it; else note absence in INVENTORY**

- [ ] **Step 5: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/00-product-truth
git commit -m "checkpoint(CP-01): product truth pass|fail (re-proof)"
```

**Hard stop:** Do not start P02 engine-lock **execution** until CP-01 pass. Planning P02 is fine; code/engine thrash is not.

---

## 7. Test matrix

| # | What | Command | Expected |
|---|------|---------|----------|
| T1 | Key paths exist | Task 01 Step 1 script | ALL_KEY_PATHS_PRESENT |
| T2 | File list non-empty | measure open3d-file-list.txt | count > 50 |
| T3 | Host greps | Task 02 Step 1 | non-empty host-wiring-rg.txt |
| T4 | Redirect greps | Task 02 Step 2 | fabric → open3d lines |
| T5 | Stale fabric pages | import-graph-stale-paths.tsv | all False |
| T6 | Gate greps | Task 03 Step 1 | 8 non-empty files |
| T7 | Claims concat | MISSING FILE only for truly missing | WAVE missing OK |
| T8 | Unit smoke | pnpm --filter oando-site exec vitest run (5 files) | exit 0 preferred; failed allowed if logged |
| T9 | hostWiring optional | hostWiringP01.test.ts | interpret with stale graph honesty |
| T10 | Artifact self-check | Task 07 Step 7 | PASS all required |
| T11 | Worktree | git worktree list | single tree |
| T12 | Layout gate note | if results only under root | check:layout expects root results/ |

**Not in P01:** Playwright product journey green claims; mesh visual bar; cloud wire.

---

## 8. False-green catalog

| Trap | Why false | Plan block |
|------|-----------|------------|
| Plan status DONE/PASS | results missing | Re-proof; contradiction X01 |
| PENDING GATE PASS | artifacts absent | C12 contradicted |
| unit test file exists | not run this session | unit-green only after smoke log |
| hostWiringP01 pass | graph data may be stale vs FS | import-graph-stale-paths.tsv |
| e2e spec exists | no results screenshots | browser-missing |
| Research SYNTHESIS score | not product proof | ethics + coverage map |
| Orbit code-present | not product-usable proven | three-layer orbit honesty |
| deleteSelection exists | not unaided buyer proven | three-layer select honesty |
| “Saved” without local | cloud lie | W6 labels grep + formatAutosaveStatus |
| Optional smoke skip | CP fail condition | required attempt |
| Writing site/results | wrong layout | AGENTS: root results only |
| Evidence under 01-product-truth | FOLDER-LOCK forbid | only 00-product-truth |
| Product code “quick fix” while inventorying | scope breach | stop + ask |

---

## 9. Stop-if-fail / CP-01 criteria

### 9.1 Pass criteria (all required)

| # | Criterion | Proof |
|---|-----------|-------|
| 1 | Non-empty file list | open3d-file-list.txt |
| 2 | Key files all True | key-files-exist.tsv |
| 3 | Dual entry + fabric redirect | ROUTES.md + greps + stale-paths tsv |
| 4 | W1–W8 matrix filled | CAPABILITY-MATRIX.md |
| 5 | ≥11 claims with verdicts | CLAIMS-REGISTER.md |
| 6 | Canonical inventory + contradictions | INVENTORY.md, CONTRADICTIONS.md |
| 7 | Three deep-read notes | NOTE-* |
| 8 | Coverage map | EVIDENCE-COVERAGE.md |
| 9 | Vitest smoke attempted | log + vitestSmoke ≠ pending |
| 10 | run.json meta complete | head, timestamps, approach A, cp01 |
| 11 | Local commits; no worktree; no unsolicited push | git log / worktree list |

### 9.2 Fail conditions

- Missing INVENTORY or CONTRADICTIONS  
- Empty/invented gate paths  
- Browser journey green without results Playwright artifacts  
- Product feature edits under open3d while inventorying  
- Git worktree  
- Silent vitest skip  
- WAVE/docs bullets as code truth without path:line  
- Claiming historical CP-01 PASS without this pack  

### 9.3 Failures.md row format

```markdown
| ISO-date | P01 | <path or command> | <error summary> | blocked |
```

Path: `Failures.md`

---

## 10. Commit sequence

| Order | Message | Contents |
|------:|---------|----------|
| 1 | `evidence(P01): re-proof scaffold 00-product-truth (results was missing)` | Task 00 |
| 2 | `evidence(P01): open3d tree inventory file lists` | Task 01 |
| 3 | `evidence(P01): route and host wiring claims vs code` | Task 02 |
| 4 | `evidence(P01): W1-W8 capability matrix from live code greps` | Task 03 |
| 5 | `evidence(P01): claims register vs live code` | Task 04 |
| 6 | `evidence(P01): unit/e2e/results coverage map and smoke logs` | Task 05 |
| 7 | `evidence(P01): deep-read notes for canvas workspace viewer` | Task 06 |
| 8 | `evidence(P01): product truth inventory ready for CP-01 (re-proof)` | Task 07 |
| 9 | `checkpoint(CP-01): product truth pass\|fail (re-proof)` | Task 08 |

Push: **only on owner ask.** Mirror mayoite: agent call per AGENTS after big land — optional for pure evidence if owner prefers hold.

---

## 11. Risks & owner decisions

| Risk | Mitigation |
|------|------------|
| Historical PASS confuses owner | INVENTORY + CONTRADICTIONS lead with evidence-missing contradiction |
| Docs lag (design select/delete) | Mark stale; do not “fix product” in P01 |
| importGraphProof unit still green | Document FS vs graph data divergence |
| Vitest env fails | vitestSmoke=failed + full log; still land inventory; cp01 may be ready-for-review with blocker note or blocked if policy wants green smoke — **prefer ready-for-review with failed smoke logged rather than silent skip** |
| Backup restore races re-proof | Prefer re-proof as source of truth for CP-01; restored backups can merge later with NOTES pointer |
| CHECKPOINTS.md missing | Do not invent tree; ready-for-review in run.json |
| Scope creep into P03/P04 fixes | Hard stop; Failures.md |

**Owner decisions (only if goal changes):**
- Accept re-proof as new CP-01 baseline vs restore E: backup only  
- Whether failed vitest smoke blocks pass vs ready-for-review with residual  
- Whether to open product fix for importGraphProof / README fabric lies in a later phase  

---

## 12. Self-review (planner vs repo + brainstormer)

| Check | Result |
|-------|--------|
| Repo paths verified | Yes — open3d, routes, redirects, tests, missing results |
| Brainstormer five surfaces | Embedded in §2 + tasks |
| FOLDER-LOCK 00-product-truth | Enforced |
| CP-01 INVENTORY+CONTRADICTIONS | Required Task 07 |
| Dual host + fabric redirect | Task 02 |
| Vitest required attempt | Task 05 |
| No TBD placeholders | Commands and templates full |
| No product code in plan execution | Explicit out of scope |
| Raised bars (evidence missing, import graph stale) | Claims C12–C13, contradictions X01–X03 |
| Ethics | §3 |
| P02 handoff inputs | INVENTORY section |
| Idiots wave 1 not used | Only Idiots2 REPORT |
| Length honesty | Extensive inventory plan; still inventory-only (not feature implementation bloat) |

---

## 13. Execution handoff

**Plan complete and saved to** `plans1/P01-product-truth\IMPLEMENTATION-PLAN.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

Executor rules:
- `/using-superpowers`  
- Main checkout only  
- Evidence only under `results/planner/world-standard-wave/00-product-truth/`  
- Commit as you go  
- No `site/` product edits  
- Stop on key-file False or worktree  

---

## Appendix A — Full artifact checklist (copy into evidence README)

```
run.json
HEAD.txt
authority-path-map.md
open3d-file-list.txt
open3d-folder-counts.tsv
key-files-exist.tsv
host-wiring-rg.txt
fabric-redirect-and-archive-rg.txt
import-graph-stale-paths.tsv
ROUTES.md
w1-draw-rg.txt
w2-place-rg.txt
w3-select-delete-rg.txt
w4-orbit-view-rg.txt
w5-save-rg.txt
w6-honesty-rg.txt
w7-mesh-rg.txt
w8-shortcuts-rg.txt
CAPABILITY-MATRIX.md
claims-sources-concat.txt
CLAIMS-REGISTER.md
fabric-flag-rg.txt
unit-test-list.txt
e2e-planner-spec-names.txt
results-planner-dirs.txt
EVIDENCE-COVERAGE.md
NOTE-FeasibilityCanvas.md
NOTE-OOPlannerWorkspace.md
NOTE-ThreeViewerInner.md
INVENTORY.md
CONTRADICTIONS.md
PRODUCT-TRUTH.md
README.md
vitest-capability-smoke-raw.log
vitest-hostWiringP01-raw.log (optional)
vitest-test-planner-raw.log (optional)
```

---

## Appendix B — Status vocabulary (matrix only)

| Token | Meaning |
|-------|---------|
| code-present | Handler/symbol exists and is reachable in production tree |
| code-partial | Exists but incomplete for product bar |
| code-absent | Not found |
| unit-green | Named unit suite green **this run** with log cite |
| unit-missing | No unit proof this run |
| browser-missing | No Playwright artifacts under results/planner for this concern |
| docs-overclaim | Docs/UI claim more than code+evidence support |

---

## Appendix C — Research translation (ideas only → inventory language)

| Research teaching | Inventory / later phase use |
|-------------------|----------------------------|
| IKEA SKU truth | W2 catalog honesty claims; not photoreal |
| BOQ > photoreal | Out of P01 code; claim register if docs overclaim BOQ done |
| Structure then furnish | W1 then W2 matrix order |
| Same document continuity | W4 claim; dual-view same UUIDs |
| Save honesty | W6 matrix + labels |
| Chrome zones | Descriptive only in inventory notes |
| ENGINE-DECISION lock | P02 freeze inputs from INVENTORY |
| O&O self-score ~2 | Honesty baseline until re-proven browser |
| Ease score 1 | Do not claim unaided buyer success without P07 pack |

---

## Appendix D — Key code anchors (2026-07-10 pre-read; re-verify)

| Anchor | Location |
|--------|----------|
| WorkspaceRoute composition | `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` lines 25–30 |
| Thin Host | `Open3dPlannerHost.tsx` → NativeHost |
| NativeHost | `Open3dNativeHost.tsx` → OOPlannerWorkspace |
| deleteSelection | `OOPlannerWorkspace.tsx` ~326–333 |
| applySelectionDelete | `workspaceEntityHelpers.ts` ~112+ |
| Keyboard Delete | `useWorkspaceKeyboard.ts` ~83–86 |
| OrbitControls construct | `ThreeViewerInner.tsx` ~171–186 |
| Orbit default | `orbitDefaults.ts` OPEN3D_ORBIT_DEFAULT_ENABLED = true |
| Lazy mount props | `OOPlannerWorkspace.tsx` Lazy3DViewer + getOpen3dViewerControlProps ~1010 |
| Local save labels | `workspaceStatusLabels.ts` formatAutosaveStatus |
| Fabric flag | `fabricFurnitureFlag.ts` env === "1" |
| Redirects | `next.config.js` ~206–207 |
| UUID policy | `newEntityId.ts` |
| Stale fabric graph | `importGraphProof.ts` route-fabric-guest/canvas |

---

## Appendix E — Parallelism (optional)

| Agent | Owns files (exclusive) |
|-------|------------------------|
| A | open3d-file-list, folder-counts, key-files |
| B | host greps, fabric greps, stale-paths, ROUTES draft |
| C | w1–w4 greps + partial matrix draft |
| D | w5–w8 greps + remainder matrix |
| E | claims concat + CLAIMS-REGISTER draft |
| F | unit/e2e lists + EVIDENCE-COVERAGE draft |
| G | NOTE-FeasibilityCanvas + NOTE-OOPlannerWorkspace |
| H | NOTE-ThreeViewerInner + smoke run |

**Merger only:** INVENTORY.md, CONTRADICTIONS.md, run.json, CAPABILITY-MATRIX final, PRODUCT-TRUTH, README.

Max 8 concurrent; hard max 10. Read-only on site/.

---

## Appendix F — run.json schema (required keys end state)

| Key | Type | Notes |
|-----|------|-------|
| phase | string | `P01-product-truth` |
| checkout | string | absolute |
| evidenceRoot | string | relative 00-product-truth |
| scope | string | inventory-only |
| approach | string | A |
| worktrees | boolean | false |
| commitAsWeGo | boolean | true |
| startedAt | ISO-8601 | |
| finishedAt | ISO-8601 | |
| head | string | start SHA |
| headEnd | string | end SHA |
| agent | string | |
| vitestSmoke | enum | ok\|failed\|skipped |
| vitestSmokeReason | string | empty if ok |
| cp01 | enum | in-progress\|ready-for-review\|blocked\|pass\|fail |
| blockers | string[] | |
| counts.filesListed | number | |
| counts.claimsRegistered | number | |
| counts.gatesFilled | number | 8 |
| counts.contradictions | number | |
| notes | string | re-proof context |

---

## Appendix G — PowerShell encoding note

`Set-Content -Encoding utf8` on Windows PowerShell may write BOM. Prefer:

```powershell
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
```

if a downstream parser fails — **do not discard evidence**.

---

## Appendix H — Kill order reminder (after CP-01)

```
CP-01 product truth (this plan)
  → CP-02 engine lock
  → CP-03 W3 select/delete
  → CP-07 W1–W2 browser journey
  → CP-06 W5–W6 save honesty
  → fill CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
  → CP-10 handover
```

P01 does not unlock W3 product implementation.

---

## Appendix I — Idiots2 REPORT mapping (coverage)

| REPORT section | Plan section/task |
|----------------|-------------------|
| §0 results missing | §1.1, Task 00, X01 |
| §3 competitive synthesis | §2, Appendix C |
| §4 product definition | §1.11 |
| §5 W1–W8 contract | Tasks 03–07 matrix |
| §6 five surfaces | §2.2 |
| §7 P01 OS / tasks | Tasks 00–08 |
| §8 contradiction classes | Task 07 CONTRADICTIONS |
| §9 verbs | §2.5 |
| §11 anti-copy | §3 |
| §13 GATE≠product | §1.1, §2.3, X08 |
| §20 priorities missing evidence | Task 00 re-proof path |
| §23 verdict | Done when + INVENTORY template |

---

**End of IMPLEMENTATION-PLAN.md — P01 product truth re-proof.**  
**Planner 01/10 complete. Plan document only; no product code changed.**
