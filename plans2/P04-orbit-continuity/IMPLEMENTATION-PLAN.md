# P04 Orbit Continuity (W4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** A facilities buyer on open3d (`/planner/guest` or `/planner/open3d`) can place furniture in **2D**, switch to **3D** with **OrbitControls ON by default**, **left-drag orbit** without crash, round-trip **3D → 2D → 3D** with the **same entity ids / mm position / document rotation (degrees)**, leave a **clean console**, and leave **re-proven artifacts** under `results/planner/world-standard-wave/04-orbit-continuity/` — never a paper PASS from phase headers alone.

**Architecture:** View mode is chrome only. Sole pose authority is `Open3dProject` (UUID furniture/walls, position mm, furniture rotation **degrees**). 2D (`FeasibilityCanvas`) and 3D (`Lazy3DViewer` → `ThreeViewerInner`) both read the same document. 3D rebuilds via pure `buildOpen3dSceneNodes` (document degrees → node radians) → `createSceneObjectFromNode` (mesh `rotation.y = -node.rotation` intentional plan-Y→world-Z). Orbit is **three-layer**: (1) Lazy+Inner defaults ON, (2) workspace **must** pass `getOpen3dViewerControlProps()` / `enableControls={true}`, (3) unit construct-spy + `data-orbit-enabled` + Playwright left-drag + evidence. Stay **imperative Three** — no R3F rewrite of open3d mid-W4. Unmount of 3D on 2D is expected; remount re-reads document.

**Tech Stack:** Next.js open3d workspace · React · Three.js · `three/examples/jsm/controls/OrbitControls.js` · Vitest · Playwright · repo-root `results/` evidence only · pnpm from monorepo root / commands from `site/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — key paths in §1 Repo reality; entire `results/` tree **absent** on this disk
- Brainstormer: `Idiots/P04-orbit-continuity/REPORT.md` **only** (NEVER `Idiots2/`)
- Phase plan: `Plans/phases/P04-orbit-continuity/` (execute card + experts + suggestions)
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W4
- Evidence map: `Plans/Research/RESULTS-MAP.md` → `04-orbit-continuity/`
- Expert pass: `Plans/phases/EXPERT-PASS.md` · `03-r3f-3d.md` · `01-react-open3d.md`

**Done when:**
1. Layers 1–2 locked in code (defaults + explicit workspace wiring) and still present after re-read.
2. Unit green for pose continuity (incl. double rebuild) **and** orbit construct/`data-orbit-enabled` **with logs** under `results/planner/world-standard-wave/04-orbit-continuity/`.
3. Browser green: Playwright `open3d-w4-orbit-continuity.spec.ts` green with PNGs + `browser-run.json` + console honesty **or** owner-written browser deferral in NOTES (never silent “works”).
4. CP-04 checkboxes honest; no claim from phase header alone; THREE-LAYER-AUDIT regeneratable from code + tests.
5. No competitor assets; no J4 selectors; no furniture document→radians thrash; no R3F port of open3d viewer.

**Evidence folder:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**Create on execute; re-prove if missing.** (2026-07-10 repo scan: **entire `results/` tree absent** — phase header “PASS 2026-07-09” is **paper until re-run**.)

**Canonical plan path:** `plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`

**Execute posture:** Product code for three-layer + degrees adapter + e2e shape is **already present** in `site/`. This plan is primarily **verify → capture evidence → harden gaps → raise bar where cheap**. Do **not** greenfield-rewrite. Do **not** invent RED by breaking green product. If a step expects FAIL and product already PASSes, record “already green” and still capture evidence logs.

---

## 1. Repo reality (live 2026-07-10)

### 1.1 What actually exists (product)

| Path | Live fact |
|------|-----------|
| `site/features/planner/open3d/3d/orbitDefaults.ts` | `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const`; `getOpen3dViewerControlProps(): { enableControls: true }` returns `{ enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED }` |
| `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | Exports `Lazy3DViewer`; default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`; `data-testid="planner-3d-canvas"` on **div** (not canvas); re-exports helper from orbitDefaults |
| `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`; dynamic import OrbitControls; damping `0.08`; `maxPolarAngle = Math.PI/2 - 0.05`; min/max distance `1`/`40`; `setOrbitEnabled(true)` after construct; `data-testid="three-viewer-container"` + `data-orbit-enabled={orbitEnabled ? "true" : "false"}`; rebuild content from `buildOpen3dSceneNodes` + `addNodesToGroup` |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `viewMode` `"2d" \| "3d"`; 3D branch (~L1010): `<Lazy3DViewer projectData={workspaceCanvas.project} {...getOpen3dViewerControlProps()} />` — **layer 2 closed in code** |
| `site/features/planner/open3d/editor/TopBar.tsx` | Radiogroup + radios labeled **2D** / **3D** (`role="radio"`) |
| `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` | Pure adapter; furniture node `rotation: degreesToRadians(item.rotation)` |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | All furniture mesh paths set `rotation.y = -node.rotation`; `userData.entityId` |
| `site/features/planner/open3d/model/units.ts` | `normalizeDegrees` → `[0,360)`; `degreesToRadians` documents “Plan / document rotation is degrees; Three scene nodes use radians.” |
| `site/features/planner/open3d/3d/index.ts` | Re-exports `Lazy3DViewer`, `OPEN3D_ORBIT_DEFAULT_ENABLED`, `getOpen3dViewerControlProps` |

### 1.2 What actually exists (tests)

| Path | Live fact |
|------|-----------|
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Helper true; construct spy; attribute true/false; normalizeDegrees contract (**note extension `.tsx`**, not `.ts`) |
| `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | Double rebuild; document degrees 90 → node rad; document immutable after rebuilds |
| `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts` | Wall + furniture modular place; rebuild after pose update; degrees→radians equality |
| `site/tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts` | Adapter suite |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | Mesh factory suite |
| `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | Guest → configurator **Place 4 seats** → radio 3D → orbit attr → left-drag → radio 2D count → 3D again; writes PNGs + `browser-run.json` under `04-orbit-continuity/` |
| `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` | Manifest gate **W4** → `open3d-w4-orbit-continuity.spec.ts` |
| `site/config/build/playwright-open3d-world-specs.json` | Pack lists W4 spec; `gates.W4` mapping |

### 1.3 What is missing / contradictory

| Claim | Reality on disk | Plan action |
|-------|-----------------|-------------|
| Phase header W4 **PASS** + THREE-LAYER-AUDIT | **No** `results/` tree at all | Re-prove; never inherit PASS |
| Early P04 architecture “document + scene nodes = radians” | Live document furniture = **degrees**; nodes = radians | Tests assert conversion; **do not** rewrite document |
| Expert `03-r3f-3d.md` path truth “no data-orbit / omit enable” (2026-07-09) | **Stale vs live code** — attribute + helper wiring present | Trust **live files** over expert baseline dated 2026-07-09 |
| Full double-rebuild deep-equal matrix (wall + furniture + multi pose) | Partially covered across two unit files | Harden `poseContinuityW4.test.ts` if any case missing (Task 01b) |
| Workspace wiring **unit** (product file still spreads helper) | Helper tested; workspace not unit-asserted | Optional pure/source contract test (Task 04b) |
| Browser pose = exact UUID + mm + deg | e2e uses **furniture count proxy** | Admit in NOTES; optional raised-bar harness later |
| Evidence artifacts | **Absent** | Task 00 + capture commands mandatory |
| WAVE-style “no orbit” | Stale vs layer 1 code | Inventory code-present vs product-proven separately |

### 1.4 Host chain (product path)

```
app/planner/open3d → features/planner/ui/Open3dPlannerHost
  → open3d/ui/Open3dNativeHost → OOPlannerWorkspace

guest/canvas → Open3dPlannerWorkspaceRoute (+ gate) → same Host
```

Prefer guest `?plannerDevTools=1` for clean IDB during e2e (`enterGuestPlannerWorkspace`).

### 1.5 Do not touch (W4 non-goals / thrash ban)

| Path / topic | Rule |
|--------------|------|
| `site/features/planner/3d/Planner3DViewer.tsx` | Legacy R3F — do not thrash for W4 proof |
| `site/tests/e2e/planner-j4-3d-parity.spec.ts` | Anti-pattern reference only — do not rewrite as open3d W4 proof |
| Fabric full-stage cutover | Out of W4 |
| Walk / first-person / auto-rotate product | Out of W4 |
| Camera bookmark across modes | Non-goal (not entity pose) |
| Mesh toe/photoreal (P08) | Out of W4 |
| Save honesty labels (P06) | Out of W4 |
| Select/delete redesign (P03) | Only need place path for browser |
| Competitor assets under `D:\websites` | Research only — never paste into `site/` |
| Firecrawl re-scrape | Dead for routine work |

### 1.6 HEAD / tree honesty

Record at execute start:

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
```

Paste into `04-orbit-continuity/NOTES.md`. Dirty tree is allowed; do not invent SHA.

### 1.7 Contradiction register (repo wins on code)

| # | Claim A | Claim B | Resolution for execute |
|---|---------|---------|------------------------|
| 1 | Early P04: document+nodes radians | Expert + live: furniture document degrees | **Degrees document; radians nodes** |
| 2 | ENGINE: Three+R3F | Expert: imperative Three for open3d | **Family R3F; product path imperative** |
| 3 | WAVE: no orbit | Code constructs OrbitControls when enabled | **Code-present ≠ product-proven** until layers 2+3 + evidence |
| 4 | Phase header PASS | Disk missing `results/` | **Re-prove before trusting** |
| 5 | Plan e2e inventory place | Live e2e Place 4 seats | **Accepted flake-resistant place path** |
| 6 | Expert 03 baseline omit enableControls | Live spreads `getOpen3dViewerControlProps()` | **Repo wins** |
| 7 | Floorplanner/R3F inspiration wording | Open3d uses OrbitControls.js | **Pattern only; implementation ours** |

---

## 2. Brainstormer synthesis (`Idiots/P04-orbit-continuity/REPORT.md`)

> Conflict rule: **Repo wins** on what code does. **Idiots brainstormer wins** on intent/bar/failure modes when repo is silent — and plan inlines those decisions (never “see report”).

### 2.1 North star & W4 slice

Design authority: facilities buyer lays out furniture and can **switch 2D↔3D with orbit** without a developer. W4 is the **inspection** gate, not authoring (authoring stays 2D-primary on Approach A).

| Gate | Criterion | Proof class |
|------|-----------|-------------|
| **W4** | 2D↔3D preserves pose; 3D orbit enabled | Playwright + console clean + units under `04-orbit-continuity/` |

### 2.2 Buyer journeys (acceptance drivers)

Happy path (Approach A):

1. Open guest or open3d planner.  
2. Place ≥1 real O&O-scale furniture (cabinet-v0 / systems seats / desk).  
3. Confirm 2D: ids on document; status furniture count.  
4. TopBar radio **3D** → wait loading → `three-viewer-container` with `data-orbit-enabled="true"`.  
5. Left-drag orbit; wheel zoom; right-drag pan if needed.  
6. Radio **2D** — same furniture count/ids/poses.  
7. Optional 3D again — remount rebuilds; no re-author.  
8. Console free of app errors.

Failure journeys buyers feel (map to tests):

| Buyer symptom | Root class | Countermeasure in this plan |
|---------------|------------|------------------------------|
| “3D is empty” | Place never landed / project not passed | Live `projectData`; place before toggle |
| “Furniture jumped” | Pose rewrite / wrong units | Document authority + degrees→rad units |
| “I can’t rotate the view” | Orbit off / middle-only | Three-layer + left-drag e2e |
| “It crashed when I switched” | Dispose race / console error | Console capture; dispose discipline |
| “I lost my work switching views” | Mode switch mutates document | Continuity units; no pose mutate on setViewMode |
| “Pretty boxes but can’t inspect” | Auto-rotate only / locked camera | Auto-rotate off; free orbit |
| “Looks different every toggle” | Non-deterministic rebuild | UUID stable; pure rebuild |

### 2.3 Competitive JTBD → O&O (ideas only — no copy)

| Industry pattern | O&O translation | Gate |
|------------------|-----------------|------|
| Instant 2D↔3D one document (P5D / SH3D / Floorplanner / RoomSketcher narrative) | Same `Open3dProject` UUIDs; mode is chrome | **W4** |
| Orbit default 3D navigation (Sketchfab grammar / Floorplanner orbital) | Three OrbitControls left-drag; polar clamp | **W4** |
| Explicit top-bar 2D\|3D | TopBar radiogroup already | **W4** |
| Lazy-load 3D | `Lazy3DViewer` | **W4** |
| Walk / photoreal / 360 / cloud render | **Out of W4** | later / never as W4 |

**Ethics fence:** Patterns and JTBD only. No competitor JS, CSS, GLB, icons, screenshots in product. Research under `D:\websites`. Firecrawl dead for routine re-scrape.

### 2.4 Raised bar (stronger than process PASS)

From Idiots §12:

1. Three-layer orbit — layer 1 alone is **false green**.  
2. Evidence under **root** `results/…/04-orbit-continuity/` only.  
3. Degrees document honesty — false-reverse if “fix” to radians.  
4. Anti-J4 browser grammar.  
5. Paper PASS ban when evidence folder missing.  
6. Optional: pose browser assertion (UUID + x/y/rotation deg) beyond count proxy.  
7. Optional: non-blank 3D screenshot; dispose stress across toggles.  
8. THREE-LAYER-AUDIT regeneratable from code + tests (not prose-only).

### 2.5 Approaches (architecture choice)

#### Product journey

| Approach | Description | Decision |
|----------|-------------|----------|
| **A** | Product journey on FeasibilityCanvas + document model | **Chosen** (design + phase + Idiots) |
| B | Fabric full-stage first | Deferred; not required to close W4 |
| C | R3F rewrite of open3d viewer for “ENGINE says R3F” | **Rejected** for W4 — false-reverse thrash |

#### Orbit implementation options (Idiots §13.2)

| Option | Description | Verdict |
|--------|-------------|---------|
| A1 | Defaults only | **Reject** as sole W4 |
| **A2** | Explicit prop + defaults + attr + units | **Accept (shipped shape)** |
| A3 | Always-on, delete prop | Reject — tests need false |
| A4 | Custom camera without OrbitControls | Reject — MIT Three fine |
| A5 | drei OrbitControls via R3F rewrite | **Reject for W4** |
| A6 | Middle-button orbit only | Reject — web buyers + J4 trap |

#### Continuity options

| Option | Verdict |
|--------|---------|
| **C2** Unmount 3D on 2D; document authority | **Accept (current)** |
| C1 Keep both mounted CSS hide | Optional later |
| C3 Camera bookmark | Non-goal W4 |
| C4 Serialize Three scene into document | Reject |
| C5 Always split dual view | Later product |

#### Rotation unit options

| Option | Verdict |
|--------|---------|
| Document degrees, node radians (adapter) | **Accept — live** |
| Document radians everywhere | False reverse — massive rewrite |
| Document degrees, convert only at mesh | Alternate; **do not thrash** mid-gate |

#### Playwright place options

| Option | Verdict |
|--------|---------|
| Inventory catalog click + canvas | Flaky historically |
| **Configurator Place N seats** | **Live W4 e2e — accept** |
| Pure seed inject | Fine for unit; weaker buyer story |
| Depend on full P07 only | Delays W4 unnecessarily if configurator works |

### 2.6 Failure modes → plan coverage

Product/UX (Idiots F1–F12):

| ID | Failure | Plan coverage |
|----|---------|---------------|
| F1 | Orbit disabled in product | Layer 2+3 units + e2e attr |
| F2 | Orbit works in unit, dead in browser | Left-drag e2e; pointer/layout debug |
| F3 | Pose jumps on toggle | Continuity units |
| F4 | New UUIDs each 3D entry | Id equality unit |
| F5 | Degrees shown as radians in UI | normalizeDegrees unit + hygiene |
| F6 | Mesh rotated 90° wrong | Adapter + mesh sign separation |
| F7 | Black WebGL canvas | Screenshot + console |
| F8 | Infinite “Initializing 3D…” | Timeout in e2e waits |
| F9 | Console errors on toggle | Playwright console filter |
| F10 | Auto-rotate confuses | Force off (product; no product autoRotate) |
| F11 | Under-floor camera | maxPolarAngle keep |
| F12 | Orbit zoom clipped | min/max 1–40 keep |

Process/gate (G1–G8):

| ID | Failure | Plan coverage |
|----|---------|---------------|
| G1 | Layer-1-only PASS | THREE-LAYER-AUDIT all rows |
| G2 | J4 selectors copied | Anti-J4 checklist in Task 06 |
| G3 | Evidence under `site/results` | check:layout; EVIDENCE path uses `..` from site cwd |
| G4 | R3F rewrite mid-gate | Explicit ban + non-goal |
| G5 | Furniture→radians document rewrite | Degrees tests + stop rule |
| G6 | PASS without `results/` | Task 00 mandatory first |
| G7 | Unit-green called Done | Status vocabulary §9 |
| G8 | Photoreal scope creep | Non-goals |

### 2.7 Open questions → plan resolutions

| Question | Resolution in this plan |
|----------|-------------------------|
| Is product code already done? | **Mostly yes** — execute is **verify + harden + re-prove evidence**, not greenfield rewrite |
| Browser required for Done? | Yes for full W4 Done unless owner **written** deferral in NOTES |
| Double rebuild where? | `poseContinuityW4.test.ts` primary; keep `documentViewContinuity` complementary |
| Filename `.ts` vs `.tsx` for orbit unit? | Live is **`orbitControlsDefault.test.tsx`** — use that path always |
| Count vs pose in e2e? | Count is accepted proxy for gate; NOTES must admit; raised bar optional |
| ENGINE R3F wording? | Family lock only; freeze imperative Three for open3d this phase |
| Git push? | AGENTS.md wins: push when landable; mayoite ~45m; no force-push |

### 2.8 Kill order / adjacency

```
CP-00 ethics → CP-01 product truth → CP-02 engine lock
  → CP-03 W3 select/delete → CP-07 journey (place) → CP-06 save
  → parallel: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
  → CP-10 handover
```

- **P04 unit work** can proceed without P03 browser.  
- **P04 browser** needs a place path (configurator or inventory).  
- **P08** needs P04 contracts frozen, not reopened.

### 2.9 Handover freezes for other phases (Idiots App G)

| Phase | What P04 freezes |
|-------|------------------|
| P05 | View mode does not rewrite furniture ids |
| P06 | Pose fields W4 protects must survive save/reload |
| P07 | Journey may include radio 3D; open3d selectors not J4 |
| P08 | Orbit works for inspection; raise mesh children only; keep `-rotation.y` |
| P09 | 2D/3D are radios |
| P10 | Harvest `04-orbit-continuity/` only; refuse PASS without artifacts |

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Orbit as default navigation pattern | Competitor JS/CSS/GLB/logos/screenshots in `site/` |
| Explicit 2D\|3D toggle grammar | Pixel-clone Planner5D / Floorplanner chrome trade dress |
| Three MIT `OrbitControls` | Shipping Planner5D `app.js` / reverse-engineered FML |
| O&O Phosphor + CSS modules | “Make it look like brand X” |
| Research under `D:\websites` as ideas only | Firecrawl re-scrape for routine W4 |
| Study SH3D dual-view under license awareness | Paste GPL into MIT product |
| Scores in MASTER-CHART as decision aids | Treat scores as license to clone or as live product truth |

No new paid seats for W4. Cleared packages pointer: `ayushdocs/17-LICENSES-CLEARED.md`.

---

## 4. File map

### 4.1 Create (execute)

| Path | Role |
|------|------|
| `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` | HEAD, three-layer table, pass/fail, honesty |
| `results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md` | Layer audit filled from code + tests |
| `results/planner/world-standard-wave/04-orbit-continuity/HEAD.txt` | `git rev-parse HEAD` |
| `results/planner/world-standard-wave/04-orbit-continuity/STATUS.txt` | `git status -sb` |
| `results/planner/world-standard-wave/04-orbit-continuity/*-raw.log` / `*-run.json` | Command evidence |
| PNGs + `browser-run.json` | Playwright artifacts (spec already writes these when run from `site/`) |

### 4.2 Modify (only if gaps found)

| Path | When |
|------|------|
| `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | Harden full double-rebuild / wall+furniture matrix |
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Only if construct/attr cases regress |
| Optional: `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts` | Pure assert helper + optional workspace source contract |
| Product files in §1.1 | **Only if unit/browser red** — code is expected green |

### 4.3 Read / regression only

| Path | Role |
|------|------|
| `buildOpen3dSceneNodes.ts` | Adapter |
| `createSceneObjectFromNode.ts` | Mesh sign |
| `TopBar.tsx` | Radio selectors |
| `OOPlannerWorkspace.tsx` | Wiring |
| `units.ts` | Degrees contract |
| `open3d-w4-orbit-continuity.spec.ts` | Browser contract |
| `playwright-open3d-world-specs.json` | Gate → spec map |
| `scripts/run-evidence-cmd.ps1` | Evidence wrapper |
| `planner-j4-3d-parity.spec.ts` | Forbidden grammar reference |

### 4.4 Boundaries

- One writer on `site/features/planner/open3d/` during execute.  
- Evidence **only** repo-root `results/` — never `site/results/`.  
- No edits to legacy Fabric archive or Planner3DViewer for W4 green.  
- No third parallel constant file for orbit defaults — single `orbitDefaults.ts`.

---

## 5. Architecture & data flow

```
                    ┌─────────────────────────────────┐
                    │         Open3dProject            │
                    │  furniture.id / position mm      │
                    │  furniture.rotation DEGREES      │
                    │  walls geometry                  │
                    └───────────────┬─────────────────┘
                                    │
                 viewMode chrome only (2d | 3d)
                                    │
           ┌────────────────────────┴────────────────────────┐
           v                                                 v
  FeasibilityCanvas                                   Lazy3DViewer
  (2D plan edit)                            data-testid=planner-3d-canvas (div)
           │                                                 │
           │                                      ThreeViewerInner
           │                           data-testid=three-viewer-container
           │                           data-orbit-enabled true|false
           │                                                 │
           │                    ┌────────────────────────────┼────────────────┐
           │                    v                            v                v
           │         buildOpen3dSceneNodes            OrbitControls     content Group
           │         (degrees→radians)                enableDamping     userData.entityId
           │                    │                     polar clamp
           │                    v                     distances 1–40
           │         createSceneObjectFromNode
           │         rotation.y = -node.rotation
           └──────────── same entity ids ────────────────────┘
```

### 5.1 Continuity law (normative)

| Statement | Force |
|-----------|-------|
| View mode is chrome only | Normative |
| Document is the only pose authority | Normative |
| Switching modes must not mutate furniture position/rotation/id | Normative |
| 3D rebuilds from `buildOpen3dSceneNodes`; must not invent poses | Normative |
| Returning to 2D unmounts Lazy3DViewer — expected | Normative |
| Remount re-reads the same project | Normative |
| Camera position across toggles is non-goal for W4 | Normative non-goal |
| Mesh sign flip is not document drift | Normative interpretation |

### 5.2 Orbit three-layer contract (binding)

| Layer | Requirement | Live path |
|-------|-------------|-----------|
| 1 | Defaults ON | Lazy + Inner `OPEN3D_ORBIT_DEFAULT_ENABLED` |
| 2 | Explicit product prop | `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps()` |
| 3 | Proof | Units + Playwright + `04-orbit-continuity/` artifacts |

**Defaults alone ≠ W4 green.**

### 5.3 Orbit product parameters (keep)

| Control | Value |
|---------|-------|
| enableControls product default | `true` |
| damping | `enableDamping=true`, `dampingFactor=0.08` |
| maxPolarAngle | `Math.PI / 2 - 0.05` |
| minDistance / maxDistance | `1` / `40` |
| autoRotate | **off** |
| left-drag | rotate (Three default) |
| pan / zoom | enabled (Three defaults) |
| product opt-out | **never** — `enableControls={false}` tests/stories only |

### 5.4 Rotation convention (locked)

| Layer | Unit | Rule |
|-------|------|------|
| Document furniture.rotation | **degrees** | `normalizeDegrees` / pureActions `% 360` |
| Scene node.rotation | **radians** | `degreesToRadians` in adapter |
| Mesh rotation.y | node radians with **negation** | intentional plan Y→world Z |
| Pick hit-test | ephemeral radians | convert from document degrees only for geometry |
| Wall scene rotation | radians from segment atan2 | not furniture document units |
| Orbit polar angles | radians (Three API) | polar clamp above |

**False reverse:** converting furniture **document** to radians mid-spine rewrites pick, furniture actions, pureActions, fabric mapper, fixtures, properties UX. **Do not.**

### 5.5 What may remount without counting as “drift”

| Object | Remount OK? | Pose authority |
|--------|-------------|----------------|
| Three scene graph | Yes | Rebuild from document |
| OrbitControls instance | Yes | New controls; camera may reset |
| WebGL renderer | Yes | Expected with Lazy3D unmount |
| Furniture UUID / mm / deg | **No change** | Document only |
| Wall geometry ids | **No rewrite** on mode toggle | Document only |

### 5.6 Imperative Three vs R3F (engine honesty)

| Interpretation | Guidance |
|----------------|----------|
| Family lock | Stay in Three ecosystem; no Babylon/Unity switch |
| R3F as optional React binding | Valid for legacy viewer / future unification — **not** W4 acceptance |
| Orbit ON | Product requirement regardless of R3F vs imperative |
| W4 acceptance | Imperative OrbitControls + three-layer + continuity |

**Decision for P04:** Freeze imperative. Migration is a **separate** phase with its own proof.

---

## 6. Task list (TDD / verify-first)

> Prefer **run → prove → harden** over rewrite. If expected RED does not appear because product already green, record “already green” and still capture evidence. Do not invent failing product changes to satisfy theater.

---

### Task 00: Evidence scaffold + honesty baseline

**Files:**
- Create: `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md`
- Create: `results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md`
- Create: `results/planner/world-standard-wave/04-orbit-continuity/HEAD.txt`
- Create: `results/planner/world-standard-wave/04-orbit-continuity/STATUS.txt`
- Modify: none product

- [ ] **Step 1: Create evidence directory**

```powershell
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity"
```

Expected: directory exists. Later `pnpm run check:layout` must not flag evidence under `site/`.

- [ ] **Step 2: Capture HEAD and status**

```powershell
cd D:\OandO07072026
git rev-parse HEAD | Out-File -Encoding utf8 results\planner\world-standard-wave\04-orbit-continuity\HEAD.txt
git status -sb | Out-File -Encoding utf8 results\planner\world-standard-wave\04-orbit-continuity\STATUS.txt
```

Expected: two files with real SHA and branch status (dirty OK).

- [ ] **Step 3: Write NOTES.md**

Create `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` with:

```markdown
# P04 / W4 NOTES — Orbit Continuity

**Date:** YYYY-MM-DD
**HEAD:** <sha from HEAD.txt>
**Approach:** A (FeasibilityCanvas + document model)
**Brainstormer:** Idiots/P04-orbit-continuity/REPORT.md
**Plan:** plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md

## W4 wording
Document pose continuity + OrbitControls ON by default with explicit workspace wiring
+ data-orbit-enabled; Vitest then Playwright left-drag + radio toggle; imperative Three;
furniture degrees in document.

## Three-layer baseline (pre-run)
| Layer | Expected live | Verified? |
|-------|---------------|-----------|
| 1 Defaults | Lazy+Inner ON | pending |
| 2 Workspace | getOpen3dViewerControlProps() | pending |
| 3 Unit proof | orbit + pose logs here | pending |
| 3 Browser proof | PNGs + browser-run.json | pending |

## Degrees / radians contract
Document furniture.rotation = degrees. Scene nodes = radians via degreesToRadians.
Mesh rotation.y = -node.rotation intentional. Not pose drift.

## Honesty
Phase file may claim PASS. This folder was re-created because disk had no artifacts.
Status only after commands below green.

## Known e2e limitation
Browser continuity uses furniture **count** proxy, not UUID+mm+deg equality.
Units own exact pose equality.
```

- [ ] **Step 4: THREE-LAYER-AUDIT scaffold**

Create `results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md`:

```markdown
# THREE-LAYER-AUDIT — W4

| Layer | Claim | Path / artifact | Pass? |
|-------|-------|-----------------|-------|
| 1 Defaults | enableControls default true Lazy+Inner | ThreeLazyViewer.tsx / ThreeViewerInner.tsx |  |
| 2 Workspace | {...getOpen3dViewerControlProps()} | OOPlannerWorkspace.tsx |  |
| 3 Unit | construct spy + data-orbit-enabled | orbit-default-* logs |  |
| 3 Unit | double rebuild pose | pose-continuity-* logs |  |
| 3 Unit | adapter regression | adapter-regression-* logs |  |
| 3 Browser | left-drag + radio + console | browser-run.json + PNGs |  |

HEAD:
Date:
```

- [ ] **Step 5: Commit scaffold (optional if results gitignored — skip commit if policy excludes results)**

```bash
# Only if results/ is tracked or NOTES are under a tracked path per repo policy.
# Prefer commit of any product/test changes later; evidence often untracked.
git status -sb
```

**Done when:** folder exists; NOTES + AUDIT templates written; HEAD recorded; no product code changed yet.

---

### Task 01: Pose continuity units — verify + evidence (primary)

**Files:**
- Test: `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts`
- Test: `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts`
- Read: `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts`
- Read: `site/features/planner/open3d/model/units.ts`

- [ ] **Step 1: Read live poseContinuityW4 contract (must remain)**

Current live test (do not weaken):

```typescript
/**
 * W4: document is pose authority — 3D scene nodes rebuild without mutating project.
 * Document rotation = degrees; scene node rotation = radians.
 */
import { describe, expect, it } from "vitest";

import { buildOpen3dSceneNodes } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import { addFurniture } from "@/features/planner/open3d/model/operations/pureActions";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { degreesToRadians } from "@/features/planner/open3d/model/units";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("W4 pose continuity (document ↔ scene nodes)", () => {
  it("rebuilds furniture pose without mutating document ids/position/rotation", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
      name: "W4 continuity",
      now: "2026-07-09T22:00:00.000Z",
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1200, y: 800 }, {
      idFactory: ids("furn-w4"),
      width: 600,
      depth: 580,
      height: 720,
    }));

    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((item) =>
            item.id === "furn-w4" ? { ...item, rotation: 90 } : item,
          ),
        },
      ],
    };

    const before = structuredClone(
      project.floors[0]!.furniture.find((f) => f.id === "furn-w4")!,
    );
    const nodesA = buildOpen3dSceneNodes(project);
    const nodesB = buildOpen3dSceneNodes(project);
    const furnA = nodesA.find((n) => n.id === "furn-w4");
    const furnB = nodesB.find((n) => n.id === "furn-w4");

    expect(furnA).toBeDefined();
    expect(furnA?.kind).toBe("furniture");
    expect(furnA?.xMm).toBe(1200);
    expect(furnA?.yMm).toBe(800);
    expect(furnA?.rotation).toBeCloseTo(degreesToRadians(90), 8);
    expect(furnB?.rotation).toBeCloseTo(furnA!.rotation, 8);

    const after = project.floors[0]!.furniture.find((f) => f.id === "furn-w4")!;
    expect(after.id).toBe(before.id);
    expect(after.position).toEqual(before.position);
    expect(after.rotation).toBe(90);
  });
});
```

- [ ] **Step 2: Run pose continuity suite (expect PASS if code intact)**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose
```

Expected: PASS all tests in both files.  
If FAIL: do **not** convert document to radians; debug adapter first (Task 05).

- [ ] **Step 3: Capture evidence with run-evidence-cmd**

```powershell
cd D:\OandO07072026
pwsh -File scripts/run-evidence-cmd.ps1 `
  -Name "pose-continuity" `
  -Module "planner" `
  -Phase "world-standard-wave/04-orbit-continuity" `
  -Command "npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose" `
  -Cwd "D:\OandO07072026\site"
```

Expected: under `results/planner/world-standard-wave/04-orbit-continuity/pose-continuity/`:
- `pose-continuity-raw.log` (full output, untruncated)
- `pose-continuity-run.json` (exit code 0)

**Note:** If `run-evidence-cmd` nests an extra name folder, copy/rename artifacts into the flat names the phase card expects (`pose-continuity-vitest-raw.log`, `pose-continuity-run.json`) **or** link paths in NOTES to the nested folder. Honesty > filename purity.

- [ ] **Step 4: Alternate capture if wrapper awkward**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\pose-continuity-vitest-raw.log"
```

Write companion JSON manually:

```json
{
  "phase": "P04",
  "gate": "W4",
  "suite": "pose-continuity",
  "status": "unit-green",
  "command": "npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose",
  "exitCode": 0
}
```

Save as `pose-continuity-run.json` next to the log.

- [ ] **Step 5: Commit only if product/test files changed**

If no product/test change this task, skip commit. If tests hardened in Task 01b:

```bash
git add site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts
git commit -m "test(open3d): harden W4 pose continuity double-rebuild matrix"
```

**Done when:** logs under 04-orbit-continuity prove double rebuild + document degrees stability.

---

### Task 01b: Harden pose matrix if gaps (optional — only if cases missing)

**When to run:** If after reading both continuity files, any of these is **not** covered:

1. Wall id stable after furniture pose-only update  
2. Two consecutive rebuilds deep-equal furniture id/xMm/yMm/rotation  
3. Document rotation remains degrees after rebuilds  
4. Node rotation equals `degreesToRadians(document.rotation)`  

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts`

- [ ] **Step 1: Write additional failing case only if gap real**

Append to `poseContinuityW4.test.ts` (full additional case — do not weaken existing):

```typescript
import { addWall, updateFurniture } from "@/features/planner/open3d/model/operations/pureActions";

// ... existing helpers ...

it("wall + furniture ids stable across double rebuild after pose-only update", () => {
  let project = createOpen3dProject({
    idFactory: ids("floor-w", "project-w"),
    name: "W4 wall+furniture",
    now: "2026-07-10T00:00:00.000Z",
  });
  ({ project } = addWall(project, { x: 0, y: 0 }, { x: 4000, y: 0 }, {
    idFactory: ids("wall-w4"),
  }));
  ({ project } = addFurniture(project, "cabinet-v0", { x: 1000, y: 500 }, {
    idFactory: ids("furn-w4b"),
    width: 600,
    depth: 580,
    height: 720,
  }));
  ({ project } = updateFurniture(project, "furn-w4b", {
    position: { x: 1500, y: 700 },
    rotation: 45,
  }));

  const docBefore = structuredClone(project.floors[0]!);
  const nodes1 = buildOpen3dSceneNodes(project);
  const nodes2 = buildOpen3dSceneNodes(project);

  const wall1 = nodes1.find((n) => n.id === "wall-w4");
  const wall2 = nodes2.find((n) => n.id === "wall-w4");
  const f1 = nodes1.find((n) => n.id === "furn-w4b");
  const f2 = nodes2.find((n) => n.id === "furn-w4b");

  expect(wall1?.id).toBe("wall-w4");
  expect(wall2?.id).toBe(wall1?.id);
  expect(f1?.xMm).toBe(1500);
  expect(f1?.yMm).toBe(700);
  expect(f1?.rotation).toBeCloseTo(degreesToRadians(45), 8);
  expect(f2?.id).toBe(f1?.id);
  expect(f2?.xMm).toBe(f1?.xMm);
  expect(f2?.yMm).toBe(f1?.yMm);
  expect(f2?.rotation).toBeCloseTo(f1!.rotation, 8);

  // Document untouched by pure rebuilds
  expect(project.floors[0]!.furniture[0]!.rotation).toBe(45);
  expect(project.floors[0]!.furniture[0]!.id).toBe(docBefore.furniture[0]!.id);
  expect(project.floors[0]!.walls[0]!.id).toBe("wall-w4");
});
```

- [ ] **Step 2: Run test**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts --reporter=verbose
```

Expected: PASS (adapter already pure). If FAIL on wall id mapping, fix `buildOpen3dSceneNodes` with TDD — **not** document radians rewrite.

- [ ] **Step 3: Re-capture pose evidence** (same as Task 01 Step 3–4)

- [ ] **Step 4: Commit**

```bash
git add site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts
git commit -m "test(open3d): W4 wall+furniture double-rebuild continuity matrix"
```

**Done when:** matrix covered; skip entirely if documentViewContinuity already covers wall+furniture and double rebuild is in poseContinuityW4.

---

### Task 02: Orbit default / three-layer unit — verify + evidence

**Files:**
- Test: `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx`
- Product: `site/features/planner/open3d/3d/orbitDefaults.ts`
- Product: `site/features/planner/open3d/3d/ThreeViewerInner.tsx` (construct path)

- [ ] **Step 1: Confirm product helper source**

`orbitDefaults.ts` must remain:

```typescript
/**
 * Open3d product orbit contract (W4 three-layer).
 * Workspace product path must pass these props explicitly — defaults alone are not enough.
 */

/** Product default: OrbitControls ON for open3d 3D view. */
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;

/**
 * Explicit control props for the product Lazy3DViewer mount.
 * Type forces enableControls: true so silent opt-out cannot type-check.
 */
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

- [ ] **Step 2: Run orbit unit suite**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose
```

Expected PASS cases:

1. `OPEN3D_ORBIT_DEFAULT_ENABLED is true`  
2. `getOpen3dViewerControlProps forces enableControls: true`  
3. `furniture document rotation stays degrees via normalizeDegrees`  
4. omitted enableControls constructs OrbitControls + `data-orbit-enabled=true`  
5. `enableControls={false}` does **not** construct + attr `false`  
6. explicit `enableControls={true}` construct + attr `true`  

- [ ] **Step 3: Capture evidence**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\orbit-default-vitest-raw.log"
```

Write `orbit-default-run.json`:

```json
{
  "phase": "P04",
  "gate": "W4",
  "suite": "orbit-default",
  "status": "unit-green",
  "file": "orbitControlsDefault.test.tsx",
  "exitCode": 0,
  "layers": {
    "defaultConstant": true,
    "helperLiteralTrue": true,
    "constructSpy": true,
    "dataOrbitEnabled": true
  }
}
```

- [ ] **Step 4: If RED — implement minimal fix (only then)**

| Failure | Fix |
|---------|-----|
| Constant false | Restore `true as const` in orbitDefaults |
| Helper returns boolean | Force return type `{ enableControls: true }` |
| Construct not called | Restore OrbitControls path in ThreeViewerInner when enableControls |
| Attr missing | Keep `data-orbit-enabled={orbitEnabled ? "true" : "false"}` on container |
| normalizeDegrees wrong | Fix units.ts — do not change document to radians |

Full construct path that must exist in `ThreeViewerInner.tsx` (reference — already live):

```typescript
if (enableControls && camera && renderer) {
  const { OrbitControls } = await import(
    "three/examples/jsm/controls/OrbitControls.js"
  );
  if (disposed || !camera || !renderer) return;
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.08;
  orbit.target.set(0, 0, 0);
  orbit.maxPolarAngle = Math.PI / 2 - 0.05;
  orbit.minDistance = 1;
  orbit.maxDistance = 40;
  controls = orbit;
  if (!disposed) {
    setOrbitEnabled(true);
  }
} else if (!disposed) {
  setOrbitEnabled(false);
}
```

DOM:

```tsx
return (
  <div
    className={styles.container}
    data-testid="three-viewer-container"
    data-orbit-enabled={orbitEnabled ? "true" : "false"}
  >
    <div ref={containerRef} className={styles.viewerRoot} />
  </div>
);
```

- [ ] **Step 5: Commit only if product/test changed**

```bash
git add site/features/planner/open3d/3d/orbitDefaults.ts site/features/planner/open3d/3d/ThreeViewerInner.tsx site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx
git commit -m "fix(open3d): W4 orbit three-layer default + data-orbit-enabled"
```

**Done when:** orbit unit green with log under 04-orbit-continuity.

---

### Task 03: Layer 1 + attribute inventory (code read, no thrash)

**Files:**
- Read: `ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx`, `orbitDefaults.ts`
- Update: `THREE-LAYER-AUDIT.md` rows for layer 1

- [ ] **Step 1: Grep product defaults**

```powershell
cd D:\OandO07072026
rg -n "OPEN3D_ORBIT_DEFAULT_ENABLED|enableControls|data-orbit-enabled|OrbitControls" site/features/planner/open3d/3d
```

Expected hits:

- `orbitDefaults.ts` — constant true + helper  
- `ThreeLazyViewer.tsx` — default from constant; pass-through to Inner  
- `ThreeViewerInner.tsx` — default; construct; data-orbit-enabled  

- [ ] **Step 2: Fill THREE-LAYER-AUDIT layer 1**

Mark Pass with file paths. Note damping 0.08, polar clamp, distances 1–40, no autoRotate.

- [ ] **Step 3: Anti-pattern scan**

```powershell
rg -n "autoRotate\s*=\s*true" site/features/planner/open3d
rg -n "enableControls=\{false\}" site/features/planner/open3d/editor
```

Expected:

- No product autoRotate true on open3d path  
- No `enableControls={false}` in OOPlannerWorkspace  

**Done when:** audit layer 1 filled; no product anti-patterns.

---

### Task 04: Layer 2 workspace wiring — verify + optional unit

**Files:**
- Read/Modify: `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- Optional Create: `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`

- [ ] **Step 1: Confirm product mount**

Workspace 3D branch must be equivalent to:

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

Or explicit:

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  enableControls={true}
/>
```

Preferred: helper spread (type forces `enableControls: true`).

- [ ] **Step 2: Grep workspace**

```powershell
rg -n "Lazy3DViewer|getOpen3dViewerControlProps|enableControls" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: import helper; spread on Lazy3DViewer; projectData from live project.

- [ ] **Step 3: If wiring missing (gap) — RED unit then GREEN**

Create `workspaceOrbitWiring.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  getOpen3dViewerControlProps,
  OPEN3D_ORBIT_DEFAULT_ENABLED,
} from "@/features/planner/open3d/3d/orbitDefaults";

describe("workspace orbit wiring (W4 layer 2)", () => {
  it("helper forces literal enableControls true", () => {
    expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
    expect(getOpen3dViewerControlProps()).toEqual({ enableControls: true });
  });

  it("OOPlannerWorkspace product 3D branch spreads getOpen3dViewerControlProps", () => {
    const file = path.join(
      process.cwd(),
      "features/planner/open3d/editor/OOPlannerWorkspace.tsx",
    );
    // Vitest cwd is site/ when run from site
    const src = readFileSync(
      path.resolve(
        process.cwd(),
        "features/planner/open3d/editor/OOPlannerWorkspace.tsx",
      ),
      "utf8",
    );
    expect(src).toMatch(/getOpen3dViewerControlProps/);
    expect(src).toMatch(/Lazy3DViewer/);
    expect(src).toMatch(/\{\.\.\.getOpen3dViewerControlProps\(\)\}/);
    // Product must not hard-disable
    expect(src).not.toMatch(/enableControls=\{false\}/);
  });
});
```

**Note:** Source-grep tests are brittle but acceptable as **layer-2 regression fence** when RTL workspace mount is too heavy. Prefer helper purity as primary; source contract as secondary.

If wiring was missing, restore workspace mount:

```tsx
import {
  Lazy3DViewer,
  getOpen3dViewerControlProps,
} from "@/features/planner/open3d/3d";

// in render branch:
viewMode === "2d" ? (
  /* FeasibilityCanvas tree */
) : (
  <Lazy3DViewer
    projectData={workspaceCanvas.project}
    {...getOpen3dViewerControlProps()}
  />
)
```

Rules:

1. Always pass current `workspaceCanvas.project`.  
2. Do not clone/strip furniture pose when entering 3D.  
3. Do not wipe entity pose on viewMode change.  
4. Unmount on 2D OK.  

- [ ] **Step 4: Run optional unit**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose
```

Expected: PASS if helper + source contract hold.

- [ ] **Step 5: Update THREE-LAYER-AUDIT layer 2 = Pass**

- [ ] **Step 6: Commit if changed**

```bash
git add site/features/planner/open3d/editor/OOPlannerWorkspace.tsx site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts
git commit -m "fix(open3d): W4 workspace explicit enableControls via getOpen3dViewerControlProps"
```

**Done when:** layer 2 audited Pass; optional unit green if added.

---

### Task 05: Adapter + mesh sign regression

**Files:**
- Read: `buildOpen3dSceneNodes.ts`, `createSceneObjectFromNode.ts`
- Test: `buildOpen3dSceneNodes.test.ts`, `createSceneObjectFromNode.test.ts`, continuity tests

- [ ] **Step 1: Run regression pack**

```powershell
cd D:\OandO07072026\site
npx vitest run `
  tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/documentViewContinuity.test.ts `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  --reporter=verbose
```

Expected: all PASS.

- [ ] **Step 2: Capture evidence**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\adapter-regression-vitest-raw.log"
```

- [ ] **Step 3: Lock intentional mesh sign interpretation in NOTES**

Add to NOTES.md:

```markdown
## Mesh sign
createSceneObjectFromNode sets mesh.rotation.y = -node.rotation for plan Y → world Z.
W4 bar is document ↔ node equality after degreesToRadians, not document === mesh.y.
```

- [ ] **Step 4: If pose bug found — TDD first**

1. Write failing unit on adapter.  
2. Minimal fix in `buildOpen3dSceneNodes` only.  
3. Never rewrite furniture document to radians.  
4. Never “fix” mesh sign by matching wrong bar.  

Adapter furniture node shape (reference):

```typescript
nodes.push({
  id: item.id,
  kind: "furniture",
  xMm: item.position.x,
  yMm: item.position.y,
  widthMm,
  depthMm,
  heightMm,
  // Document rotation is degrees (2D canvas, properties); scene nodes are radians.
  rotation: degreesToRadians(item.rotation),
  color: item.color,
  catalogId: item.catalogId,
  // ... geometryMode / modularOptions / glb ...
});
```

- [ ] **Step 5: Commit if fixed**

```bash
git add site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts site/tests/unit/features/planner/open3d/
git commit -m "fix(open3d): W4 pose adapter regression — document degrees to node radians"
```

**Done when:** adapter-regression log green; mesh sign noted as intentional.

---

### Task 06: Playwright W4 browser proof (primary gate)

**Files:**
- Test: `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`
- Manifest: `site/config/build/playwright-open3d-world-specs.json`
- Unit guard: `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts`
- Evidence: `results/planner/world-standard-wave/04-orbit-continuity/`

#### Anti-J4 checklist (must pass before writing/editing e2e)

| Forbidden (J4) | Required (open3d W4) |
|----------------|----------------------|
| `getByRole("button", { name: "3D" })` | `getByRole("radio", { name: "3D", exact: true })` |
| Split / middle-button drag | Left-button drag ~40–50px |
| `canvas[data-testid="planner-3d-canvas"]` | `planner-3d-canvas` is a **div** |
| Rewrite planner-j4 as W4 proof | Keep separate legacy |

#### Live e2e contract (already on disk — verify; edit only if red)

Full expected source of `open3d-w4-orbit-continuity.spec.ts`:

```typescript
/**
 * W4 browser — place seats (configurator) → 3D orbit attr → 2D same furniture count.
 * Place path uses proven systems-v0 "Place N seats" (catalog click was flaky).
 * Evidence: results/planner/world-standard-wave/04-orbit-continuity/
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import { waitForPlannerCanvas } from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "04-orbit-continuity",
);

async function furnitureCount(page: Page): Promise<number> {
  const body = await page.locator("body").innerText();
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("W4 orbit + 2D↔3D continuity (browser)", () => {
  test("place furniture → 3D orbit attr → 2D same count", async ({ page }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await enterGuestPlannerWorkspace(page, { projectName: "W4 continuity" });
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    const configurator = page.getByRole("region", {
      name: "Workstation systems configurator",
    });
    await expect(configurator).toBeVisible({ timeout: 15_000 });
    await configurator.getByRole("button", { name: "Place 4 seats" }).click();

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(before + 4);
    const afterPlace = await furnitureCount(page);

    await page.screenshot({ path: path.join(EVIDENCE, "01-2d-after-place.png") });

    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({
      timeout: 20_000,
    });

    const orbit = page.locator(
      '[data-testid="three-viewer-container"][data-orbit-enabled="true"]',
    );
    await expect(orbit.first()).toBeVisible({ timeout: 15_000 });

    const box = await orbit.first().boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 40, cy + 10, { steps: 5 });
      await page.mouse.up();
    }
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible();

    await page.screenshot({ path: path.join(EVIDENCE, "02-3d-orbit-on.png") });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);

    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.locator(
        '[data-testid="three-viewer-container"][data-orbit-enabled="true"]',
      ),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);

    await page.screenshot({ path: path.join(EVIDENCE, "03-2d-restored.png") });

    const hardAppErrors = consoleErrors.filter(
      (t) =>
        !t.includes("Download the React DevTools") &&
        !t.includes("favicon") &&
        !/net::ERR_/i.test(t),
    );

    fs.writeFileSync(
      path.join(EVIDENCE, "browser-run.json"),
      JSON.stringify(
        {
          phase: "P04",
          gate: "W4",
          status: "browser-green",
          furnitureBefore: before,
          furnitureAfterPlace: afterPlace,
          furnitureAfterToggle: afterPlace,
          orbitEnabled: true,
          placePath: "configurator Place 4 seats",
          consoleErrorCount: hardAppErrors.length,
          screenshots: [
            "01-2d-after-place.png",
            "02-3d-orbit-on.png",
            "03-2d-restored.png",
          ],
        },
        null,
        2,
      ),
      "utf8",
    );
  });
});
```

- [ ] **Step 1: Confirm manifest maps W4**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts --reporter=verbose
```

Expected: PASS; `gates.W4` === `open3d-w4-orbit-continuity.spec.ts`.

- [ ] **Step 2: Run Playwright W4**

```powershell
cd D:\OandO07072026\site
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\playwright-raw.log"
```

Expected:

- 1 passed  
- Files created under `results/planner/world-standard-wave/04-orbit-continuity/`:  
  - `01-2d-after-place.png`  
  - `02-3d-orbit-on.png`  
  - `03-2d-restored.png`  
  - `browser-run.json` with `status: "browser-green"`, `orbitEnabled: true`, `consoleErrorCount: 0` (or filtered 0 hard errors)

- [ ] **Step 3: Console honesty**

If `consoleErrorCount > 0`, dump filtered errors into `console-messages.txt`. Do **not** claim W4.5 console clean. Fix app errors or document owner-accepted known noise with justification (must not be real app crashes).

- [ ] **Step 4: If Playwright environment blocked**

Chrome-devtools manual fallback (does **not** auto-claim browser-green without owner waiver):

1. Open `/planner/guest/?plannerDevTools=1`.  
2. Place ≥1 furniture (configurator or inventory).  
3. Radio 3D; DevTools assert `data-orbit-enabled="true"`.  
4. Left-drag; no console error.  
5. 2D→3D; status furniture count unchanged.  
6. Dump screenshots + console into **04-** folder.  
7. NOTES must say **manual** and **not** `browser-green` unless owner writes waiver.

- [ ] **Step 5: Update NOTES + THREE-LAYER-AUDIT browser row**

- [ ] **Step 6: Commit if e2e fixed**

```bash
git add site/tests/e2e/open3d-w4-orbit-continuity.spec.ts
git commit -m "test(e2e): W4 orbit continuity browser proof (open3d radios + left-drag)"
```

**Done when:** either (a) Playwright green + PNGs + browser-run.json, or (b) unit+hooks green and NOTES explicitly states Playwright deferred with owner acceptance language.

---

### Task 06b: Raised bar — optional pose browser harness (do not block historical minimum)

**Only if owner wants stronger than count proxy.** Non-blocking for phase minimum if already owner-accepted.

**Idea:** expose one furniture id + pose via existing UI (properties panel) or a small `data-testid` harness on status — still **document** fields, not Three internals.

- [ ] **Step 1: Prefer properties panel read if already available**  
- [ ] **Step 2: After 3D→2D, assert same id and rotation degrees string**  
- [ ] **Step 3: Do not block CP-04 if count proxy was previously accepted and NOTES admits limitation**

---

### Task 07: Fill CP-04 + final NOTES + commit land

**Files:**
- Update: `results/.../NOTES.md`, `THREE-LAYER-AUDIT.md`
- Optional: phase card checkbox hygiene only if owner wants docs sync (not required for product)

- [ ] **Step 1: Final three-layer table in NOTES**

| Layer | Pass? | Proof |
|-------|-------|-------|
| 1 Defaults | Y/N | paths |
| 2 Workspace | Y/N | paths |
| 3 Unit orbit | Y/N | log path |
| 3 Unit pose | Y/N | log path |
| 3 Browser | Y/N or deferred | PNGs / waiver |

- [ ] **Step 2: Status vocabulary**

| Word | Meaning |
|------|---------|
| Unit-green | Vitest evidence in 04- + layers 1–2 closed |
| Browser-green | Playwright + screenshots + console artifact |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted browser deferral in NOTES) |

Do not mark Done for code-complete without evidence paths.

- [ ] **Step 3: CP-04 checklist**

- [ ] Pose continuity units green (incl. double rebuild); evidence under `04-orbit-continuity/`  
- [ ] Orbit default ON green; `data-orbit-enabled` wired  
- [ ] Workspace explicitly passes helper / enableControls true + live projectData  
- [ ] Adapter regression green  
- [ ] Playwright green with PNGs **or** deferred with honest NOTES  
- [ ] Console-clean claim only with artifact  
- [ ] Local commits for landable slices; no worktrees; push when landable per AGENTS  
- [ ] W4 not marked done if orbit disabled, workspace silent-default only, or pose drifts  

- [ ] **Step 4: Layout check**

```powershell
cd D:\OandO07072026
pnpm run check:layout
```

Expected: PASS — no evidence under `site/results/`.

- [ ] **Step 5: Final product commit if any remaining dirty W4 files**

```bash
git status -sb
git add site/features/planner/open3d site/tests/unit/features/planner/open3d site/tests/e2e/open3d-w4-orbit-continuity.spec.ts
git commit -m "feat(open3d): W4 orbit continuity three-layer + pose proof"
```

- [ ] **Step 6: Push when green enough (AGENTS)**

```bash
git push origin HEAD
# mayoite mirror if ~45m / big land
```

Never force-push.

**Done when:** CP-04 honest; NOTES final; evidence folder self-explanatory for P10 harvest.

---

### Task 08: Failure-mode smoke matrix (manual checklist against F-catalog)

After Task 06 green, walk Idiots failure table quickly:

| ID | Smoke check | Result |
|----|-------------|--------|
| F1 | data-orbit-enabled true on product 3D | |
| F2 | left-drag does not crash | |
| F3 | count stable after toggle | |
| F4 | place once, not on each 3D entry | |
| F7 | 02-3d-orbit-on.png not pure black (eyeball) | |
| F9 | consoleErrorCount 0 hard | |
| G1 | all three layers in AUDIT | |
| G3 | artifacts under repo-root results only | |

**Done when:** table filled in NOTES appendix or THREE-LAYER-AUDIT.

---

## 7. Test matrix

| ID | Class | Command | Expected | Artifact |
|----|-------|---------|----------|----------|
| U1 | Unit pose W4 | `npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts --reporter=verbose` | PASS | pose-continuity log |
| U2 | Unit document continuity | `npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose` | PASS | same / combined |
| U3 | Unit orbit three-layer | `npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose` | PASS | orbit-default log |
| U4 | Unit adapter | `npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts --reporter=verbose` | PASS | adapter-regression log |
| U5 | Unit mesh factory | `npx vitest run tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose` | PASS | adapter-regression log |
| U6 | Unit manifest W4 | `npx vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts --reporter=verbose` | PASS | optional |
| U7 | Optional workspace wiring | `npx vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose` | PASS if added | optional |
| B1 | Playwright W4 | `npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line` | 1 passed | PNGs + browser-run.json + playwright-raw.log |
| L1 | Layout | `pnpm run check:layout` from repo root | PASS | — |

All product commands from `D:\OandO07072026\site` unless noted. Evidence lands under  
`D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\`.

### 7.1 Acceptance matrix (W4.1–W4.6)

| ID | Criterion | Unit | Browser | Notes |
|----|-----------|------|---------|-------|
| W4.1 | Entity ids stable across 2D↔3D rebuild | Double rebuild | Count / optional id harness | Document UUIDs |
| W4.2 | Position + rotation match document after rebuild | degrees + rad convert | Count proxy today | Raise bar: explicit pose |
| W4.3 | Orbit default ON three-layer | Helper + construct + attr | attr true | **All three required** |
| W4.4 | Left-drag without crash | — | e2e drag | Not middle |
| W4.5 | Console clean | — | filtered errors | Artifact required |
| W4.6 | No competitor code/assets | Review | — | Three MIT OrbitControls only |

---

## 8. False-green catalog

| Trap | Why false | How this plan blocks |
|------|-----------|----------------------|
| Defaults alone “orbit works” | Silent workspace omit / mock viewer | Layer 2+3 mandatory |
| Phase header PASS | No results/ on disk | Task 00 re-prove first |
| WAVE silence | Docs lag code | Inventory code-present vs product-proven |
| `document.rotation === node.rotation` raw | Degrees vs radians | Convert with degreesToRadians |
| Treat `-rotation.y` as drift | Coordinate system | NOTES + Task 05 |
| J4 e2e copy-paste | Wrong chrome | Anti-J4 table Task 06 |
| Unit-green = Done | Missing browser | Status vocabulary |
| Evidence under `site/results` | Layout law | check:layout + EVIDENCE `..` path |
| R3F port “to match ENGINE” | Thrash mid-W | Explicit reject A5 |
| Furniture document → radians | Cascading rewrite | Degrees units + ban |
| Count continuity over-claimed as full pose | Proxy weakness | NOTES admit + optional 06b |
| Auto-rotate showcase as motion | Not inspection | Keep autoRotate off |
| Middle-only drag product | J4 / DCC grammar | Left-drag e2e |
| Photoreal as “3D works” | Scope cancer | Non-goals |
| THREE-LAYER-AUDIT prose only | Paper audit | Regeneratable from code+tests |

---

## 9. Stop-if-fail / CP-04 criteria

**Stop and fix before claiming W4 Done if:**

1. Orbit construct unit red or `data-orbit-enabled` never true on product path.  
2. Workspace omits explicit enable / helper.  
3. Pose double rebuild fails or document rotation mutates.  
4. Someone proposes furniture document radians conversion.  
5. Someone proposes R3F rewrite of ThreeViewerInner for this gate.  
6. Playwright fails and NOTES lacks honest deferral.  
7. Evidence only lives under `site/results/`.  
8. Console hard errors on toggle path with no fix.  

**CP-04 unlock next:** P05 symbols/SVG only after CP-04 checked or owner waives in writing.

---

## 10. Commit sequence (landable slices)

| Order | Message | Paths typical |
|-------|---------|---------------|
| 1 | `test(open3d): W4 pose continuity units` | poseContinuityW4 / documentViewContinuity |
| 2 | `fix(open3d): orbit default ON + data-orbit-enabled` | orbitDefaults, ThreeViewerInner, orbitControlsDefault.test.tsx |
| 3 | `fix(open3d): workspace explicit getOpen3dViewerControlProps` | OOPlannerWorkspace (+ optional wiring test) |
| 4 | `test(e2e): W4 orbit continuity browser proof` | open3d-w4-orbit-continuity.spec.ts |
| 5 | docs/evidence not always committed | NOTES / results per repo gitignore policy |

Commit as you go. No worktrees. Push when landable. Mayoite ~45m.

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation |
|------|----------|------------|
| Missing `results/` after prior PASS | High | Re-run all evidence commands |
| Playwright flaky place path | Med | Configurator Place 4 seats already accepted |
| WebGL unavailable in CI | Med | Honest deferral NOTES + unit-green; owner waiver for Done |
| Count vs pose overclaim | Med | NOTES limitation + optional 06b |
| ENGINE R3F thrash agent | Med | Plan bans rewrite; freeze imperative |
| Degrees residual plan prose | High if acted on | Repo + units tests win |
| Dispose leaks after many toggles | Low | Optional stress; not W4 minimum |
| P08 mesh work reopens pose | Med | Freeze contract message for mesh agents |
| Git push policy phase vs AGENTS | Low | Prefer AGENTS push-when-right |

### Owner decisions (only if blocked)

1. Accept count proxy as browser continuity? (historical yes if NOTES admit)  
2. Accept browser deferral? (only written)  
3. Require raised-bar UUID pose harness? (optional)  

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Repo path | Task |
|-----------|------|
| orbitDefaults.ts | 02, 03, 04 |
| ThreeViewerInner.tsx | 02, 03, 05 |
| ThreeLazyViewer.tsx | 03, 04 |
| OOPlannerWorkspace.tsx | 04 |
| buildOpen3dSceneNodes.ts | 01, 05 |
| createSceneObjectFromNode.ts | 05 |
| units.ts | 01, 02 |
| poseContinuityW4.test.ts | 01, 01b |
| documentViewContinuity.test.ts | 01 |
| orbitControlsDefault.test.tsx | 02 |
| open3d-w4-orbit-continuity.spec.ts | 06 |
| playwright-open3d-world-specs.json | 06 |
| results/04-orbit-continuity/ | 00, all capture steps |

### 12.2 Brainstormer coverage (Idiots REPORT)

| Idiots theme | Plan section / task |
|--------------|---------------------|
| Three-layer orbit | §5.2, Tasks 02–04, 06 |
| Document pose authority | §5.1, Task 01 |
| Degrees vs radians honesty | §5.4, Tasks 01–02, 05 |
| Imperative Three freeze | §5.6, non-goals |
| Anti-J4 | Task 06 checklist |
| Buyer journeys | §2.2, Task 06 steps |
| Failure modes F/G | §2.6, §8, Task 08 |
| Approaches A2/C2 | §2.5 |
| Raised bar | §2.4, Task 06b |
| Evidence filenames | Task 00, 01, 02, 05, 06 |
| Ethics | §3 |
| P08 freeze | §2.9, non-goals |
| Paper PASS ban | Done when + Task 00 |
| Configurator place path | Task 06 e2e |
| Status vocabulary | Task 07 |

### 12.3 Placeholder scan

No TBD / “implement later” / “similar to Task N” left. Full test sources inlined for primary contracts. Commands with expected output present.

### 12.4 Type consistency

- `getOpen3dViewerControlProps(): { enableControls: true }` literal true throughout.  
- Document rotation number = degrees.  
- Node rotation number = radians.  
- `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const`.  

### 12.5 Length honesty

Plan is long because: (1) product mostly done → verify + re-prove needs explicit evidence choreography; (2) Idiots report is deep on failure modes / ethics / adjacency; (3) skill forbids artificial length caps. Not short-cut.

---

## 13. Appendices

### Appendix A — Selector table (open3d W4)

| Step | Selector / action |
|------|-------------------|
| Host | `/planner/guest/?plannerDevTools=1` or `/planner/open3d` |
| Mode 3D | `getByRole("radio", { name: "3D", exact: true })` |
| Mode 2D | `getByRole("radio", { name: "2D", exact: true })` |
| Mount | `[data-testid="planner-3d-canvas"]` then `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` |
| Orbit drag | Left button ~40–50px on viewer surface |
| Continuity | Furniture count and/or document ids after 3D→2D→3D |
| Place (e2e) | Configurator region “Workstation systems configurator” → “Place 4 seats” |

### Appendix B — Type / signature catalog used in plan

```typescript
// orbitDefaults.ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
export function getOpen3dViewerControlProps(): { enableControls: true };

// units.ts
export function normalizeDegrees(value: number): number;
export function degreesToRadians(degrees: number): number;

// buildOpen3dSceneNodes
// furniture node: { id, kind: "furniture", xMm, yMm, rotation /* radians */, ... }

// Lazy3DViewerProps
// projectData?: Pick<Open3dProject, "id" | "name" | "floors">
// enableControls?: boolean  // product default true

// ThreeViewerInner
// enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED
// data-orbit-enabled "true" | "false"
```

### Appendix C — Evidence filename lock (P10 harvest)

| Artifact | Source |
|----------|--------|
| `NOTES.md` | Task 00 / 07 |
| `THREE-LAYER-AUDIT.md` | Task 00 / 03 / 04 / 07 |
| `HEAD.txt` / `STATUS.txt` | Task 00 |
| `pose-continuity-vitest-raw.log` + `pose-continuity-run.json` | Task 01 |
| `orbit-default-vitest-raw.log` + `orbit-default-run.json` | Task 02 |
| `adapter-regression-vitest-raw.log` | Task 05 |
| `playwright-raw.log` / `browser-run.json` | Task 06 |
| `01-2d-after-place.png` | Task 06 |
| `02-3d-orbit-on.png` | Task 06 |
| `03-2d-restored.png` | Task 06 |
| `console-messages.txt` | optional if errors |

### Appendix D — Research translation (ideas → O&O)

| Research idea | O&O implementation |
|---------------|--------------------|
| Instant 2D↔3D | Same Open3dProject UUIDs; rebuild 3D |
| Orbit default | OrbitControls three-layer |
| Top bar 2D\|3D | TopBar radios |
| Orbital inspect (Floorplanner) | Left-drag OrbitControls; walk deferred |
| Lazy WebGL | Lazy3DViewer |
| Sketchfab nav grammar | Orbit/pan/zoom Three defaults; custom chrome |
| BOQ > photoreal | Do not race photoreal for W4 |

### Appendix E — Commands cheat sheet (copy block)

```powershell
cd D:\OandO07072026\site

# Units
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts --reporter=verbose
npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose
npx vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts --reporter=verbose

# Browser
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line

# Layout (repo root)
cd D:\OandO07072026
pnpm run check:layout
```

### Appendix F — One-page execute card (subagent)

```
GOAL: W4 orbit + 2D↔3D continuity proof
STACK: Feasibility 2D + document + Lazy3D imperative Three + OrbitControls
DO:
  1) three-layer orbit (defaults, getOpen3dViewerControlProps, data-orbit-enabled)
  2) pose units: document degrees stable; nodes rad via degreesToRadians; double rebuild
  3) Playwright: radio 2D|3D, div planner-3d-canvas, left-drag, count/pose, console
  4) evidence only under results/planner/world-standard-wave/04-orbit-continuity/
DON'T:
  - convert furniture document to radians
  - port open3d to R3F mid-gate
  - copy J4 selectors / middle-only drag
  - claim green from defaults alone
  - thrash mesh photoreal / save / select in this phase
  - competitor assets
PROOF: units + browser artifacts or honest NOTES deferral
INPUT BRAINSTORMER: Idiots/P04-orbit-continuity/REPORT.md only
PLAN: plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md
```

### Appendix G — Non-goals recap

- Camera bookmark memory across 2D↔3D  
- Walk mode / first-person  
- Auto-rotate showcase mode  
- Fixing select/delete (P03) or save labels (P06) in this plan’s commit slices  
- Fabric full stage  
- Rewriting legacy J4 e2e as W4 proof  
- Mesh toe→carcass→door polish (P08)  
- Photoreal materials  

### Appendix H — Handover one-liner

**W4 = document pose continuity + OrbitControls ON by default with explicit workspace wiring + `data-orbit-enabled`; prove with Vitest under `results/planner/world-standard-wave/04-orbit-continuity/`, then Playwright left-drag + radio toggle; stay imperative Three; furniture degrees in document; re-prove evidence if `results/` missing; superpowers; no worktrees; commit as you go.**

### Appendix I — Idiots brutal pushback absorbed

1. GATE PASS without `results/` is not re-proven — Task 00 + re-run.  
2. Furniture count is weaker than pose — NOTES admit + units hold truth.  
3. Expert file named r3f while forbidding R3F is confusing — plan freezes imperative; rename is docs hygiene not W4 block.  
4. ENGINE R3F without open3d note is thrash magnet — §5.6 reconciliation.  
5. Orbit without mesh still feels toy — W4 necessary not sufficient; P08 next for trust.  
6. Do not re-scrape competitors — grammar known; work is proof.  
7. Defaults-only PASS is a lie — three-layer non-negotiable.  
8. Camera bookmark is not continuity — reject for W4.  

---

*End of IMPLEMENTATION-PLAN.md — PLANNER 04/10 · writing-plans-repo-brainstorm · plans2/P04-orbit-continuity · brainstormer Idiots only · plan only, no product code.*
