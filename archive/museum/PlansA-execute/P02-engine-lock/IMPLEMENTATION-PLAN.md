# P02 Engine Lock — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-prove and freeze the locked 2D/3D stack (Fabric destination · Feasibility interim · Three + orbit ON · no hybrid · SKU · BOQ>photoreal) under canonical evidence `results/planner/world-standard-wave/01-engine-lock/`, so P03+ agents ship product gates without engine thrash.

**Architecture:** One document model (UUID entities, mm) is the source of truth. Live interactive 2D is **FeasibilityCanvas** (Canvas 2D API). Destination 2D is **Fabric.js v7 full stage** via `canvas-fabric-stage/` (furniture flag default OFF; migration spike only). Planner 3D is **Three.js + R3F ecosystem** with **OrbitControls ON** (`OPEN3D_ORBIT_DEFAULT_ENABLED` + `getOpen3dViewerControlProps()` at workspace). Admin `@google/model-viewer` is not the workspace engine. **Never** Konva+Fabric hybrid. Fail-forward = Konva **full** only after failed Fabric spike with `results/` proof.

**Tech Stack:** TypeScript · Next.js (`site/`) · Vitest · Fabric.js `7.4.0` (exact) · three `^0.185.1` · `@react-three/fiber` `^9.6.1` · `@react-three/drei` `^10.7.7` · Canvas 2D (Feasibility) · OrbitControls from `three/examples/jsm/controls/OrbitControls.js` · pnpm monorepo · evidence only under repo-root `results/`.

**Inputs consumed:**
- Repo read: 2026-07-10 · workspace `.` · tree dirty honesty assumed until Task 0 records `HEAD.txt` · key paths in § Repo reality
- Brainstormer: `Idiots2/P02-engine-lock/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P02-engine-lock/` (all five files)
- Maps: `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
- Expert essays: `02-canvas-2d.md` (SHIP), `05-packages-stack.md` (FIX)
- Research ideas (not product truth): `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`, `MASTER-CHART.md`

**Done when:**
1. Evidence folder `results/planner/world-standard-wave/01-engine-lock/` exists with full artifact checklist (not only prose in Plans).
2. `ENGINE-LOCK-RECORD.md` freezes Fabric dest / Feasibility interim / Three+orbit / no hybrid / SKU / BOQ>photoreal with **live 2026-07-10 code truth** (including `getOpen3dViewerControlProps()`).
3. `PACKAGE-PIN.md` records exact strings from live `site/package.json` (fabric exact `7.4.0`; three/r3f/drei carets; konva absent).
4. Fabric flag unit suite re-run logged (raw log + run.json) with package-relative paths from `site/`.
5. Orbit contract unit re-run logged (`orbitControlsDefault.test.tsx`) proving default ON + product helper forces `enableControls: true`.
6. `FLAG-INVENTORY.md` + `ENTRYPOINT-MAP.md` match live host chains (guest/canvas via `Open3dPlannerWorkspaceRoute`).
7. `OWNER-SIGNOFF.md` has owner marks **or** explicit written deferral (no dual spaced filename).
8. `ANTI-THRASH-AUDIT.md` greps complete; no product package upgrades; no second interactive 2D lib introduced.
9. `CP-02-SUMMARY.md` + map-minimum `NOTES.md` present; CP-02 criteria 1–8 can be checked from evidence paths only.
10. **No** claim that Fabric full walls cutover shipped, select/delete is green, or orbit Playwright journey is done (those are P03/P04/later).

**Evidence folder (canonical):** `results/planner/world-standard-wave/01-engine-lock/`  
**Forbidden evidence name:** `02-engine-lock/` (reserved for P07 browser journey).  
**Product code policy for this phase:** **Default = zero product implementation.** Evidence + docs + unit re-runs only. Optional tiny test-only reinforcement allowed only if Task 5/5b FAIL for a real lock regression — then stop, fix minimally, re-prove. **No Fabric cutover. No Konva. No package upgrades.**

**Save path for this plan:** `plans1/P02-engine-lock/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality

### 1.1 What the phase file claims vs disk

| Claim | Live 2026-07-10 |
|-------|-----------------|
| CP-02 pack **DONE** under `01-engine-lock/` | **FALSE on this checkout** — entire `results/` tree **missing** (list_dir failed). Plan status table is **stale**. Re-prove from zero. |
| CP-02.1–.8 checkboxes marked `[x]` in phase file | **Unproven** without evidence files. Treat as historical aspiration, not PASS. |
| Owner sign-off complete | **Unproven** — expert pass still said open; no `OWNER-SIGNOFF.md` on disk. |
| `Plans/trustdata/*` paths in phase file / RESEARCH-MAP | **Dead** — `Plans/INDEX.md` says `Plans/trustdata/` removed. Use `Plans/phases/`, `Plans/Research/RESULTS-MAP.md`, `Plans/INDEX.md`. |
| Evidence root `01-engine-lock/` | Canonical per RESULTS-MAP; **must create**. Never invent `02-engine-lock/`. |

### 1.2 Live engine code (verified by file read)

#### Fabric flag (exact `"1"` only)

`site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts`:

```typescript
export const OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" as const;

export function isOpen3dFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
}
```

#### Workspace flag wire + 3D orbit (evolved since 2026-07-09 plan text)

`OOPlannerWorkspace.tsx` (live):

- `fabricFurnitureEnabled = isOpen3dFabricFurnitureEnabled()`
- Flag ON → `layerVisibility.furniture = false` on Feasibility + mount `FurnitureFabricLayer`
- Flag OFF → sole `FeasibilityCanvas` for furniture draw
- 3D: **not** bare omit-only — explicit product helper:

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

`orbitDefaults.ts` (live):

```typescript
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;

export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

`ThreeLazyViewer.tsx` / `ThreeViewerInner.tsx`: default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` (`true`). When true, Inner dynamic-imports `OrbitControls`.

**Contradiction with phase plan prose:** Phase file Task 3 still says workspace “omits `enableControls` prop.” **Repo wins:** workspace **spreads** `getOpen3dViewerControlProps()` → stronger lock (typed force true). Evidence `ENTRYPOINT-MAP.md` and `ENGINE-LOCK-RECORD.md` **must** document the helper, not the stale omit-only sentence.

#### Host chains (live)

| Route | Chain |
|-------|--------|
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/guest` | `…/(workspace)/guest/page.tsx` → **`Open3dPlannerWorkspaceRoute`** (Providers + ProjectSetupGate + dynamic host) → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/canvas` | `…/(workspace)/canvas/page.tsx` → **`Open3dPlannerWorkspaceRoute`** → same |

**Stale docs:** `open3d/README.md` route table still says guest/canvas → Host directly (omits WorkspaceRoute). Anti-thrash audit lists this for later docs pass — **do not mass-rewrite README in P02 unless owner asks**.

#### Packages (live `site/package.json`)

| Package | Live string |
|---------|-------------|
| `fabric` | `"7.4.0"` (exact, no caret) |
| `three` | `"^0.185.1"` |
| `@react-three/fiber` | `"^9.6.1"` |
| `@react-three/drei` | `"^10.7.7"` |
| `@google/model-viewer` | `"^4.3.1"` (admin boundary) |
| `konva` / `react-konva` | **Absent** |
| `@fancyapps/ui` | `"^6.1.14"` (proprietary hygiene — packages expert FIX) |
| `gsap` / `@gsap/react` | present; used outside engine vote |

#### Tests already present (re-run, do not invent fake coverage)

| File | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | Mapper + flag OFF/non-1/exact `"1"` + near-miss strictness + barrel re-export |
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | `OPEN3D_ORBIT_DEFAULT_ENABLED`, `getOpen3dViewerControlProps`, OrbitControls construct + `data-orbit-enabled` |
| `site/tests/unit/features/planner/open3d/threeLazy.test.tsx` | Lazy3DViewer smoke |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | Mocks Lazy3DViewer (not orbit authority alone) |

#### Fabric stage files (keep; do not delete)

| Path | Role |
|------|------|
| `…/canvas-fabric-stage/fabricFurnitureFlag.ts` | Flag |
| `…/canvas-fabric-stage/FurnitureFabricLayer.tsx` | Overlay |
| `…/canvas-fabric-stage/furnitureFabricMapper.ts` | Document ↔ Fabric pose (mm; entityId = furniture.id) |
| `…/canvas-fabric-stage/furnitureFabricLayer.module.css` | Styles |
| `…/canvas-fabric-stage/index.ts` | Barrel |
| `…/canvas-feasibility/FeasibilityCanvas.tsx` | **Live interim 2D** |
| `…/editor/OOPlannerWorkspace.tsx` | Host 2D/3D + flag |
| `…/_archive/fabric/` | Archive — not live guest/canvas |

#### Secondary surfaces (not engine re-votes)

| Path | Note |
|------|------|
| `site/features/planner/3d/Planner3DViewer.tsx` | R3F+drei OrbitControls — still Three family |
| `site/features/planner/admin/svg-editor/ModelViewerPreview.tsx` | Admin single-asset only |
| `site/features/planner/lib/featureFlags.ts` | Product flags — **not** Fabric env reader |

### 1.3 Authority path map (post-trustdata cleanup)

| Concern | Live path |
|---------|-----------|
| Phase execute card | `Plans/phases/P02-engine-lock/P02-engine-lock.md` |
| Suggestions | `Plans/phases/P02-engine-lock/P02-suggestions.md` |
| Canvas expert | `Plans/phases/P02-engine-lock/02-canvas-2d.md` |
| Packages expert | `Plans/phases/P02-engine-lock/05-packages-stack.md` |
| Program index | `Plans/INDEX.md` |
| Evidence map | `Plans/Research/RESULTS-MAP.md` |
| Design Approach A | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Dead path (do not write evidence pointers only to) | `Plans/trustdata/*` |

### 1.4 Approach A (binding)

From design + phase + Idiots2:

- Ship W1–W8 on **Feasibility + document** first.
- Fabric full stage remains **destination** (Plan A 2B.2 after W), **not** insurance to delete.
- Three + orbit ON is planner 3D.
- No hybrid thrash.
- Success metric: **BOQ/quote > photoreal**.
- Catalog pattern: manufacturer SKU (O&O products).

### 1.5 What P02 is NOT

- Not P03 select/delete implementation.
- Not P04 orbit Playwright continuity pack.
- Not Fabric walls cutover.
- Not package upgrades / Konva experiment.
- Not claiming product is shippable because packages exist (O&O research self-score ~2).

### 1.6 Repo-first checklist (completed before brainstormer consumption)

- [x] Listed real files that evidence tasks will cite
- [x] Noted contradictions: phase DONE vs missing `results/`; omit-prop vs `getOpen3dViewerControlProps()`; open3d README host chain incomplete; trustdata paths dead
- [x] Noted missing evidence → plan re-proves entire pack
- [x] HEAD honesty deferred to Task 0 real commands

---

## 2. Brainstormer synthesis (`Idiots2/P02-engine-lock/REPORT.md`)

### 2.1 One-liner (binding intent)

**Stop arguing about engines. One document model (mm + UUID). Interim 2D = FeasibilityCanvas. Destination 2D = Fabric.js v7 full stage. 3D = Three + R3F with orbit on. No Konva hybrid. Ship buyer gates on that stack. BOQ beats photoreal.**

### 2.2 What engine lock means (operational)

Freeze: destination vs interim 2D; planner 3D tech; hybrid ban; fail-forward rule; flag location/default; what is **not** an engine vote (Block2D, SVG publish, model-viewer admin, photoreal queue).  
Not: shipping Fabric walls; proving W3–W8; upgrading packages; “evaluating Konva just in case.”

### 2.3 Approach A/B/C (recommendation)

| Approach | Verdict |
|----------|---------|
| **A** Feasibility first, Fabric destination | **RECOMMENDED / BINDING** |
| **B** Fabric cutover before W | Reject for current wave |
| **C** Konva/Babylon re-platform | Reject; fail-forward only after Fabric failed spike evidence |

### 2.4 Decision matrix D1–D14 (inline for tasks)

| # | Decision |
|---|----------|
| D1 | Fabric.js v7 full stage = 2D destination |
| D2 | FeasibilityCanvas = 2D interim |
| D3 | Fabric furniture flag default OFF; ON = spike |
| D4 | No Konva+Fabric hybrid |
| D5 | Fail-forward Konva full only after failed Fabric spike + evidence |
| D6 | Three + R3F ecosystem = planner 3D |
| D7 | Orbit ON by default |
| D8 | model-viewer admin only |
| D9 | Block2D symbols now; SVG publish separate |
| D10 | Modular mesh + own GLB path |
| D11 | Manufacturer SKU catalog |
| D12 | BOQ/quote > photoreal |
| D13 | Photoreal race / multiplayer / LiDAR non-goals now |
| D14 | Research = patterns only |

### 2.5 False-green / false-reverse traps (must block)

| Trap | Plan block |
|------|------------|
| Claim CP-02 green without `01-engine-lock/` files | Tasks 0–8 force artifacts |
| Invent `02-engine-lock/` | Explicit ban + CP fail |
| Enable Fabric flag for W proofs | Document flag OFF for product gates |
| Treat flag-ON as dual-CAD product | FLAG-INVENTORY + anti-thrash |
| Delete `canvas-fabric-stage/` as insurance | Anti-thrash #5–6 |
| Disable orbit for CI | Orbit unit + lock record |
| Switch Babylon for mesh | Route to P08 content |
| Photoreal first | Strategy checkboxes |
| Score O&O as 4 because packages installed | Summary honesty |
| Copy competitor assets | Ethics section |
| Blur plan-only continue with CP-02 PASS | OWNER-SIGNOFF deferral language |

### 2.6 Raised bar beyond process PASS

- Agents can answer 10 lock questions without grepping (REPORT §20).
- Evidence includes **orbit helper** truth, not stale omit-only wording.
- PACKAGE-PIN exact strings + konva absence + license hygiene note (not silent SHIP on packages).
- Map minimum `NOTES.md` **and** phase richer pack (both).
- Vitest raw logs preserved (zero suppression).

### 2.7 Open questions (not engine re-votes)

Record in evidence README; do **not** block CP-02 on them unless owner forces:

1. Fabric walls cutover timing vs W8 green  
2. Owner B/C override? (default A)  
3. Walkthrough camera when?  
4. Measure suite depth schedule  
5. Cloud vs local honesty schedule  
6. Fancyapps/GSAP cleanup schedule  
7. Mesh bar aggressiveness for W7  

### 2.8 Conflict rule applied

| Topic | Winner |
|-------|--------|
| What code does | **Repo** |
| Intent / bar / failure modes | **Idiots2** when repo silent |
| Evidence folder names | **RESULTS-MAP** |
| Phase DONE without files | **Missing evidence → re-prove** |

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Study competitor **behavior** / JTBD | Paste JS, shaders, GLB, icons, brands into `site/` |
| Use hiring-stack signals to pick **open** npm | Ship competitor CDN/app bundles |
| Study open-source under license (reimplement) | Paste GPL (e.g. SH3D) into MIT product without compliance |
| Screenshots of **O&O** under `results/` | Competitor shots as product assets |
| Research under `D:\websites` ideas only | Firecrawl re-scrape for routine P02 |

**Rule of thumb:** Reasonable person says “rebuilt the idea” → OK. Says “took their implementation or look” → stop.

---

## 4. File map

### 4.1 Create (evidence only — primary P02 work)

Under `results/planner/world-standard-wave/01-engine-lock/`:

| Artifact | Task |
|----------|------|
| `HEAD.txt` | 0 |
| `run.json` | 0 |
| `README.md` | 0 |
| `NOTES.md` | 0 (RESULTS-MAP minimum) |
| `ENGINE-LOCK-RECORD.md` | 1 |
| `FLAG-INVENTORY.md` | 2 |
| `ENTRYPOINT-MAP.md` | 3 |
| `PACKAGE-PIN.md` | 4 |
| `vitest-fabric-flag-raw.log` | 5 |
| `vitest-fabric-flag-run.json` | 5 |
| `vitest-orbit-default-raw.log` | 5b |
| `vitest-orbit-default-run.json` | 5b |
| `OWNER-SIGNOFF.md` | 6 |
| `ANTI-THRASH-AUDIT.md` | 7 |
| `CP-02-SUMMARY.md` | 8 |
| `LICENSE-HYGIENE-NOTE.md` | 4b (packages FIX — not engine re-vote) |

### 4.2 Modify (docs only if needed; default none in product)

| Path | When |
|------|------|
| `Plans/phases/P02-engine-lock/P02-engine-lock.md` | Optional: after re-prove, correct status table DONE→re-proved date; **do not** mark CP green without files |
| Root `Failures.md` | Only if vitest fails or lock violation found |
| `ayushdocs/17-LICENSES-CLEARED.md` | **Owner** for GSAP/Fancyapps — agent records need, does not purchase |

### 4.3 Product code modify

**None by default.**  

Optional only on regression FAIL:

| Path | Why |
|------|-----|
| Flag/orbit/mapper production files | Only if unit lock tests fail for real bug |
| New interactive 2D library | **Forbidden** |

### 4.4 Tests (re-run authority)

| Path | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | Fabric flag + mapper |
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Orbit lock |

### 4.5 Cite only (do not relocate)

| Path |
|------|
| `results/planner/fabric-stage-slice/` (if present; prior mapper pack — may be missing) |
| `results/planner/world-standard-wave/COMPARISON-CHART.md` (if present) |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` |

---

## 5. Architecture & data flow

```
                    ┌─────────────────────────────┐
                    │  Document (UUID, mm)        │
                    │  walls · openings · furniture│
                    └─────────────┬───────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           ▼                      ▼                      ▼
   FeasibilityCanvas      FurnitureFabricLayer     Lazy3DViewer
   (interim 2D live)      (flag exact "1" only)    → ThreeViewerInner
   walls/tools/Block2D    flat Rects, spike          OrbitControls ON
           │                      │                      │
           └──────── write entity poses ─────────────────┘
                                  │
                           Persist IDB first
                           (not this phase)

Routes:
  /planner/open3d  → Host → NativeHost → OOPlannerWorkspace
  /planner/guest   → WorkspaceRoute → Host → … → Workspace
  /planner/canvas  → WorkspaceRoute → Host → … → Workspace
```

**Persist rule:** Fabric JSON is never source of truth; document furniture is.

**Pointer ownership when flag ON:** Fabric interactive only on select tool; walls stay Feasibility; known desync — not product dual-CAD.

---

## 6. Task list

### Task 00: Preconditions — single checkout, no thrash, read authorities

**Files:**
- Read: this plan, `Plans/phases/P02-engine-lock/P02-engine-lock.md`, `P02-suggestions.md`, `02-canvas-2d.md`, `05-packages-stack.md`, `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`, `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §3–4
- Read code: flag, orbitDefaults, OOPlannerWorkspace 2D/3D mounts, three host pages, package.json deps
- Create: none yet

- [ ] **Step 1: Confirm checkout and ban worktrees**

Run:

```powershell
cd .
git rev-parse --show-toplevel
git worktree list
```

Expected: single worktree at `.` (or path-equivalent). **Stop** if extra worktrees invented for this phase.

- [ ] **Step 2: Confirm results tree policy**

Run:

```powershell
Test-Path "results"
Test-Path "site\results"
```

Expected: `results` may be false (missing — OK); `site\results` should be false (layout ban). If `site\results` exists, do not dump P02 there.

- [ ] **Step 3: Confirm Approach A still binding in design + INDEX**

Read design §3 Approach A owner pick and `Plans/INDEX.md` kill order row for P02 → `01-engine-lock/`.  
Record for Task 0 README: approach = **A**.

- [ ] **Step 4: Mental ban list (agent self-check before writing evidence)**

Do **not** in this phase:

- Install/upgrade `fabric` / `three` / r3f / drei  
- Add konva / react-konva / pixi / paper  
- Enable Fabric flag in CI product proofs  
- Re-open Babylon/Unity  
- Write under `02-engine-lock/`  
- Mark CP-02 green before OWNER-SIGNOFF or explicit deferral  
- Start P03 product select/delete code under this phase label  

- [ ] **Step 5: Commit nothing yet** (no landable artifact)

---

### Task 0: Setup evidence directory, HEAD, run meta, README, NOTES

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/` (+ artifacts below)

- [ ] **Step 1: Create evidence root**

```powershell
cd .
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-engine-lock" | Out-Null
# Explicit ban: do NOT create 02-engine-lock
if (Test-Path "results\planner\world-standard-wave\02-engine-lock") {
  Write-Error "FORBIDDEN folder 02-engine-lock exists — fix before continuing"
}
```

Expected: directory created; no `02-engine-lock`.

- [ ] **Step 2: Capture HEAD.txt with real output**

```powershell
cd .
$head = git rev-parse HEAD
$status = git status -sb
@"
repo: .
HEAD: $head
status:
$status
capturedAt: $([DateTimeOffset]::UtcNow.ToString('o'))
"@ | Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-engine-lock\HEAD.txt"
Get-Content "results\planner\world-standard-wave\01-engine-lock\HEAD.txt"
```

Expected: file contains real 40-char (or current) hash; not `TBD`.

- [ ] **Step 3: Write run.json with real values**

Write `results/planner/world-standard-wave/01-engine-lock/run.json` **after** filling head from Step 2:

```json
{
  "phase": "P02-engine-lock",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/01-engine-lock",
  "scope": "engine-lock-confirm-only",
  "approach": "A",
  "worktrees": false,
  "commitAsYouGo": true,
  "productCodeChanges": false,
  "packageUpgrades": false,
  "fabricCutover": false,
  "canonicalFolderNote": "01-engine-lock not 02-engine-lock",
  "startedAt": "REPLACE_WITH_ISO8601_UTC",
  "head": "REPLACE_WITH_git_rev_parse_HEAD",
  "brainstormer": "Idiots2/P02-engine-lock/REPORT.md",
  "plan": "plans1/P02-engine-lock/IMPLEMENTATION-PLAN.md",
  "phaseCard": "Plans/phases/P02-engine-lock/P02-engine-lock.md",
  "agentNote": "Re-prove CP-02 because results/ was missing on checkout; no product cutover."
}
```

Replace `startedAt` and `head` with real command outputs. **No placeholders left.**

- [ ] **Step 4: Write README.md (confirm lock, not cutover)**

Write `results/planner/world-standard-wave/01-engine-lock/README.md` with **at least** this substance (expand freely):

```markdown
# CP-02 / P02 — Engine lock evidence

**Goal:** Confirm lock. **Not** implement Fabric full stage cutover.

**Approach:** A (W1–W8 on Feasibility + document first; Fabric destination preserved).

**Canonical folder:** `01-engine-lock/` only (RESULTS-MAP). Never `02-engine-lock/`.

## Locked stack (summary)

| Layer | Choice |
|-------|--------|
| 2D destination | Fabric.js v7 full stage |
| 2D interim live | FeasibilityCanvas |
| Fabric furniture flag | Default OFF; exact env `1` only |
| 3D | Three + R3F path; orbit ON (`getOpen3dViewerControlProps`) |
| Hybrid | Forbidden |
| Success metric | BOQ/quote > photoreal |
| Catalog | Manufacturer SKU (O&O) |

## Artifact index

See ENGINE-LOCK-RECORD, FLAG-INVENTORY, ENTRYPOINT-MAP, PACKAGE-PIN,
vitest logs, OWNER-SIGNOFF, ANTI-THRASH-AUDIT, CP-02-SUMMARY, NOTES.md.

## Explicit non-claims

- Fabric walls not cut over
- Select/delete not proven here (P03)
- Orbit product journey not proven here (P04)
```

- [ ] **Step 5: Write NOTES.md (RESULTS-MAP floor)**

Write `results/planner/world-standard-wave/01-engine-lock/NOTES.md`:

```markdown
# NOTES — P02 engine lock (map minimum)

**Phase:** P02-engine-lock · **CP:** CP-02  
**Approach:** A  
**Date:** (ISO date of this re-prove)

## Research link (ideas only)

`D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`

## Lock one-liner

Fabric destination · Feasibility interim · Three+orbit ON · no hybrid · SKU · BOQ>photoreal.

## Honesty

Phase card previously claimed DONE while this checkout had no `results/` tree.
This folder is the re-prove pack. Product gates still later phases.
```

- [ ] **Step 6: Commit meta slice**

```powershell
cd .
git add results/planner/world-standard-wave/01-engine-lock/HEAD.txt `
  results/planner/world-standard-wave/01-engine-lock/run.json `
  results/planner/world-standard-wave/01-engine-lock/README.md `
  results/planner/world-standard-wave/01-engine-lock/NOTES.md
git commit -m "docs(p02): seed 01-engine-lock evidence meta (HEAD, run, README, NOTES)"
```

Expected: commit succeeds on main checkout.

---

### Task 1: ENGINE-LOCK-RECORD.md (binding decision record)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ENGINE-LOCK-RECORD.md`

- [ ] **Step 1: Write the full lock record**

Create the file with the following content structure (agent fills live package strings from Task 4 cross-check; architecture tables must match repo):

```markdown
# ENGINE-LOCK-RECORD — CP-02

**Status:** LOCKED for agent engine choice after owner sign-off (or supersedes residual “under evaluation” wording once CP-02 green).  
**Approach:** A  
**Evidence root:** `results/planner/world-standard-wave/01-engine-lock/`  
**Phase:** `Plans/phases/P02-engine-lock/P02-engine-lock.md`  
**Brainstormer intent:** `Idiots2/P02-engine-lock/REPORT.md`

## Locked stack table

| Layer | Locked choice | Live path / notes |
|-------|---------------|-------------------|
| 2D destination | Fabric.js v7 full stage | `site/features/planner/open3d/canvas-fabric-stage/` · flag default OFF |
| 2D interim (live) | FeasibilityCanvas (Canvas 2D API) | `…/canvas-feasibility/FeasibilityCanvas.tsx` |
| Fabric furniture spike | Exact env `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` only | `fabricFurnitureFlag.ts` · migration spike, not dual-CAD |
| 3D planner | Three.js + R3F ecosystem | `ThreeLazyViewer` → `ThreeViewerInner` |
| Orbit | ON by default | `OPEN3D_ORBIT_DEFAULT_ENABLED=true`; workspace spreads `getOpen3dViewerControlProps()` → `{ enableControls: true }` |
| Secondary R3F surface | Still Three family | `site/features/planner/3d/Planner3DViewer.tsx` — not a second engine vote |
| Admin single-asset 3D | `@google/model-viewer` | `admin/svg-editor/ModelViewerPreview.tsx` only |
| Hybrid ban | No Konva + Fabric (+ Canvas) simultaneous interactive 2D | konva absent from package.json |
| Fail-forward | Konva **full** only after failed Fabric spike with `results/` proof | Still one engine; never hybrid |
| Catalog pattern | Manufacturer SKU (O&O products) | ENGINE-DECISION / product context |
| Success metric | BOQ/quote path > photoreal | MASTER-CHART §D idea |
| Archive boundary | `_archive/fabric/` not live guest/canvas | Never wire as production path |

## Document-first diagram

Document (UUID, mm)
  ├── 2D destination: Fabric.js v7 full stage (flag path)
  ├── 2D interim: FeasibilityCanvas
  ├── 3D: Three + orbit ON
  ├── Catalog: O&O SKUs + Block2D + modular mesh
  └── Persist: IDB first; cloud honesty later

## Approach A implication

W1–W8 may land on Feasibility first. Fabric remains destination. Deleting canvas-fabric-stage is forbidden. Flag stays OFF for product W proofs.

## Anti-thrash rules (1–13 + brainstorm add-ons 14–18)

1. Decide once — no engine tourism without owner override.  
2. One interactive 2D engine for product tools; flag-ON is spike.  
3. No hybrid exceptions for “just this toolbar.”  
4. Archive ≠ live.  
5. Insurance language invalid.  
6. Approach A does not abandon Fabric.  
7. Orbit is default 3D nav — do not hard-off for flaky tests.  
8. model-viewer stays admin-only.  
9. Research is inspiration only.  
10. BOQ/quote over photoreal thrash.  
11. Evidence or it did not happen (this folder).  
12. No worktrees.  
13. This record supersedes residual “under evaluation” / production “hybrid” titles for **agent engine choice**.  
14. New interactive 2D npm requires written “why Fabric cannot” evidence pack.  
15. Mesh complaints → P08 content, not “change Three.”  
16. Measure envy → tools on document, not engine switch.  
17. Stale WAVE “no orbit” claims are inventory contradictions, not votes.  
18. Guest/canvas/open3d share one workspace engine stack.

## Supersession

After CP-02 green, agents treat this file as authority over residual Plan A “Konva/Fabric under evaluation” and open3d README “hybrid” marketing language for **engine choice**. Residual language may remain until a docs pass — listed in ANTI-THRASH-AUDIT, not re-litigated here.

## Orbit code truth (2026-07-10)

- `orbitDefaults.ts`: `OPEN3D_ORBIT_DEFAULT_ENABLED = true`
- `getOpen3dViewerControlProps(): { enableControls: true }`
- `OOPlannerWorkspace` mounts `<Lazy3DViewer {...getOpen3dViewerControlProps()} />`
- Inner constructs OrbitControls when enableControls true

## Explicit non-goals of this record

P03 select/delete · P04 orbit Playwright · Fabric walls cutover · package upgrades · photoreal.

## Sources

- Live code under `site/features/planner/open3d/`
- `Plans/phases/P02-engine-lock/*`
- `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
- Research ideas: ENGINE-DECISION, MASTER-CHART (not product truth alone)
- Idiots2 P02 REPORT
```

- [ ] **Step 2: Grep-verify no soft language**

```powershell
cd .
Select-String -Path "results\planner\world-standard-wave\01-engine-lock\ENGINE-LOCK-RECORD.md" -Pattern "maybe Konva now|under evaluation as product|insurance only|TBD|TODO"
```

Expected: no matches that reopen engines (empty or only quoted forbidden phrases as bans).

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ENGINE-LOCK-RECORD.md
git commit -m "docs(p02): ENGINE-LOCK-RECORD Fabric dest Feasibility interim Three orbit"
```

---

### Task 2: FLAG-INVENTORY.md (code truth)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/FLAG-INVENTORY.md`
- Read: `fabricFurnitureFlag.ts`, `OOPlannerWorkspace.tsx`, `open3d/README.md`, unit test flag describe block

- [ ] **Step 1: Trace consumers with rg**

```powershell
cd .
rg -n "isOpen3dFabricFurnitureEnabled|NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE|OPEN3D_FABRIC_FURNITURE_ENV" site/features/planner site/tests --glob "!**/node_modules/**"
```

Expected consumers (at minimum):

- `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts`
- `site/features/planner/open3d/canvas-fabric-stage/index.ts`
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts`
- `site/features/planner/open3d/README.md` (docs)

Paste full match list into inventory.

- [ ] **Step 2: Write FLAG-INVENTORY.md**

Full content must include:

```markdown
# FLAG-INVENTORY — Fabric furniture stage

## Env

| Item | Value |
|------|-------|
| Public env name | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` |
| Constant | `OPEN3D_FABRIC_FURNITURE_ENV` |
| Enable rule | `env[OPEN3D_FABRIC_FURNITURE_ENV] === "1"` **only** |
| Default | missing / any other value → **OFF** |

## Enable for local spike only

```powershell
# repo-root .env.local — then restart next dev
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
```

## Default production behavior

| Flag | 2D furniture | Walls/tools |
|------|--------------|-------------|
| OFF | FeasibilityCanvas sole furniture draw | FeasibilityCanvas |
| ON | `FurnitureFabricLayer` overlay; Feasibility `furniture` layer forced false | FeasibilityCanvas still owns walls/draw |

## Not this flag

`site/features/planner/lib/featureFlags.ts` — product registry (`planner2D`, export/AI, etc.). **Do not** add a second Fabric env reader there without owner ask.

## Known flag-ON limits (from open3d README + expert pass)

- Select + flag: fabric host pointer-events can block empty-space Feasibility picks
- Pan/zoom transform not fully shared → overlay desync risk
- Fabric symbols are flat Rects — **not** Block2D W2 authority
- Flag-ON = **migration spike**, not permanent dual-CAD product mode

## Product W-gate rule

W2/W3/W1 proofs run with flag **OFF** (env unset or not exact `"1"`).

## Unit coverage

`furnitureFabricMapper.test.ts` describe `isOpen3dFabricFurnitureEnabled`:
- false default / non-1
- true only exact `"1"`
- rejects near-miss (`"1 "`, `"true"`, `"01"`, etc.)
- barrel re-export
```

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/FLAG-INVENTORY.md
git commit -m "docs(p02): FLAG-INVENTORY exact env=1 Fabric furniture spike"
```

---

### Task 3: ENTRYPOINT-MAP.md (host chains + engines)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ENTRYPOINT-MAP.md`
- Read: three app pages, WorkspaceRoute, Host, NativeHost, workspace mounts, ThreeLazy/Inner, Planner3DViewer, ModelViewerPreview, archive fabric README

- [ ] **Step 1: Verify route imports live**

```powershell
cd .
rg -n "Open3dPlannerWorkspaceRoute|Open3dPlannerHost" site/app/planner site/features/planner/ui --glob "*.tsx"
```

Expected: guest + canvas import WorkspaceRoute; open3d page imports Host.

- [ ] **Step 2: Verify workspace 3D orbit call site**

```powershell
rg -n "getOpen3dViewerControlProps|Lazy3DViewer|FurnitureFabricLayer|FeasibilityCanvas" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: all four present; Lazy3DViewer with getOpen3dViewerControlProps spread.

- [ ] **Step 3: Write ENTRYPOINT-MAP.md**

Must include:

```markdown
# ENTRYPOINT-MAP — 2D/3D engines

## Route → host chains

### /planner/open3d
site/app/planner/open3d/page.tsx
  → Open3dPlannerHost (site/features/planner/ui/Open3dPlannerHost.tsx)
  → Open3dNativeHost (site/features/planner/open3d/ui/Open3dNativeHost.tsx)
  → OOPlannerWorkspace (site/features/planner/open3d/editor/OOPlannerWorkspace.tsx)

### /planner/guest
site/app/planner/(workspace)/guest/page.tsx
  → Open3dPlannerWorkspaceRoute (Providers + ProjectSetupGate + dynamic Host)
  → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace

### /planner/canvas
site/app/planner/(workspace)/canvas/page.tsx
  → Open3dPlannerWorkspaceRoute → same as guest

## Inside OOPlannerWorkspace

| Mode | Components |
|------|------------|
| 2D flag OFF | FeasibilityCanvas only (furniture + walls/tools) |
| 2D flag ON | FeasibilityCanvas (furniture layer forced off) + FurnitureFabricLayer |
| 3D | Lazy3DViewer + getOpen3dViewerControlProps() |

## Orbit implementation

| Layer | Path | Fact |
|-------|------|------|
| Product helper | `open3d/3d/orbitDefaults.ts` | forces `{ enableControls: true }` |
| Lazy wrapper | `ThreeLazyViewer.tsx` | default enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED |
| Imperative viewer | `ThreeViewerInner.tsx` | dynamic import OrbitControls when enabled |
| Unit proof | `tests/unit/.../orbitControlsDefault.test.tsx` | construct + data-orbit-enabled |

## Secondary / non-workspace

| Surface | Path | Engine vote? |
|---------|------|--------------|
| Planner3DViewer | `features/planner/3d/Planner3DViewer.tsx` | No — still Three/R3F |
| ModelViewerPreview | admin svg-editor | No — admin single-asset |
| Archive fabric | `_archive/fabric/` | No — not live guest/canvas |

## Document / identity (engine-agnostic)

- `open3d/model/` types + project
- `lib/newEntityId.ts`
- history/selection stores under `open3d/store/`

## Stale doc note

`open3d/README.md` route table may omit WorkspaceRoute for guest/canvas — code truth is this map. Later docs pass; do not thrash engines.
```

- [ ] **Step 4: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ENTRYPOINT-MAP.md
git commit -m "docs(p02): ENTRYPOINT-MAP host chains WorkspaceRoute orbit helper"
```

---

### Task 4: PACKAGE-PIN.md (exact strings from site/package.json)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/PACKAGE-PIN.md`
- Read: `site/package.json`

- [ ] **Step 1: Extract live pins with node (no hand-wavy copy)**

```powershell
cd site
node -e "const p=require('./package.json'); const d=p.dependencies; const keys=['fabric','three','@react-three/fiber','@react-three/drei','@google/model-viewer','gsap','@gsap/react','@fancyapps/ui']; for (const k of keys) console.log(k+'='+(d[k]??'ABSENT')); console.log('konva='+(d.konva??'ABSENT')); console.log('react-konva='+(d['react-konva']??'ABSENT'));"
```

Expected (as of plan authoring; re-read live and record **whatever is real**):

```
fabric=7.4.0
three=^0.185.1
@react-three/fiber=^9.6.1
@react-three/drei=^10.7.7
@google/model-viewer=^4.3.1
...
konva=ABSENT
react-konva=ABSENT
```

- [ ] **Step 2: Write PACKAGE-PIN.md**

```markdown
# PACKAGE-PIN — engine-relevant deps

**Source:** `site/package.json`  
**Captured:** (ISO timestamp)  
**HEAD:** (from HEAD.txt)  
**Rule:** No upgrades/downgrades in P02. Intentional later bumps must refresh this file.

## Engine pins (record exact package.json strings)

| Package | package.json string | Role | License note |
|---------|---------------------|------|--------------|
| fabric | `7.4.0` | 2D destination + furniture spike | MIT |
| three | `^0.185.1` | 3D core | MIT |
| @react-three/fiber | `^9.6.1` | R3F bridge | MIT |
| @react-three/drei | `^10.7.7` | R3F helpers / secondary surface | MIT |
| @google/model-viewer | `^4.3.1` | Admin preview only | Apache-2.0 |

## Explicit absences (hybrid ban support)

| Package | Status |
|---------|--------|
| konva | ABSENT |
| react-konva | ABSENT |

## Fabric major

Fabric major must remain **v7** for Plan A alignment. Exact pin without caret is intentional until cutover plan.

## Not engine upgrades

Do not thrash: three minor caret within lockfile, r3f, drei — freeze lockfile in normal installs; do not “explore” major bumps in P02.

## Hygiene (not engine re-vote) — see LICENSE-HYGIENE-NOTE.md

| Package | Issue |
|---------|-------|
| @fancyapps/ui | Proprietary; clear or remove — ask before purchase |
| gsap / @gsap/react | Standard free-use; used in scroll — owner acceptance row |

## Policy

Presence of unused packages does **not** authorize hybrid interactive 2D.  
AI SDKs are metered — keys only in `.env.local`; no new paid seats without owner.
```

- [ ] **Step 3: Assert Fabric major is 7**

```powershell
cd site
node -e "const v=require('./package.json').dependencies.fabric; if(!String(v).startsWith('7')) { console.error('FAIL fabric major', v); process.exit(1);} console.log('OK fabric', v);"
```

Expected: `OK fabric 7.4.0` (or live 7.x exact string).

- [ ] **Step 4: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/PACKAGE-PIN.md
git commit -m "docs(p02): PACKAGE-PIN fabric 7.4.0 three r3f drei no konva"
```

---

### Task 4b: LICENSE-HYGIENE-NOTE.md (packages expert FIX — not SHIP)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/LICENSE-HYGIENE-NOTE.md`

- [ ] **Step 1: Write hygiene note (no purchase; no silent remove without owner)**

```markdown
# LICENSE-HYGIENE-NOTE — adjacent to engine lock

**Verdict from packages expert:** Engine path MIT-aligned; packages overall **FIX** not SHIP until hygiene + owner engine sign-off + PACKAGE-PIN exist.

## Items

| Dep | Issue | Agent action in P02 |
|-----|-------|---------------------|
| @fancyapps/ui | Proprietary; likely unused in app | Record; **ask owner** before remove or purchase |
| gsap / @gsap/react | Standard license; used (scroll) | Record need for `ayushdocs/17-LICENSES-CLEARED.md` row |
| Engine stack | fabric/three/r3f/drei MIT | OK |

## Explicit

This note does **not** reopen engines. Cleanup is hygiene, not Konva/Fabric debate.
```

- [ ] **Step 2: Optional rg for fancyapps imports (read-only)**

```powershell
cd site
rg -n "@fancyapps/ui|fancybox|Fancybox" --glob "!**/node_modules/**" app components features lib | Select-Object -First 40
```

Paste hit count / sample into note under “import scan.”

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/LICENSE-HYGIENE-NOTE.md
git commit -m "docs(p02): license hygiene note Fancyapps GSAP (not engine thrash)"
```

---

### Task 5: Re-run Fabric flag + mapper unit suite (no product code)

**Files:**
- Create: `vitest-fabric-flag-raw.log`, `vitest-fabric-flag-run.json`
- Test (existing): `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts`

- [ ] **Step 1: Run vitest with package-relative path and absolute Tee**

```powershell
cd .
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-engine-lock" | Out-Null
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath "results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log"
echo "EXIT=$LASTEXITCODE"
```

**Critical path rules:**

- CWD = `site/`
- Test path = `tests/unit/...` (**no** `site/` prefix)
- Tee path absolute under repo-root `results/.../01-engine-lock/`

Expected: exit code **0**; all tests PASS (mapper suite + flag describe).  
As of plan authoring the file contains many `it(...)` cases including flag near-miss strictness — count from raw log; do not invent zeros.

If FAIL:

1. Do **not** delete the flag  
2. Do **not** invent a second env reader  
3. Log in root `Failures.md`  
4. Fix only if true regression in lock-related code; re-run  

- [ ] **Step 2: Confirm raw log non-empty and not suppressed**

```powershell
Get-Item "results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log" | Format-List Length, FullName
Select-String -Path "results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log" -Pattern "FAIL|PASS|Tests " | Select-Object -First 30
```

Expected: Length > 0; shows test results; no silent empty file.

- [ ] **Step 3: Write vitest-fabric-flag-run.json with REAL fields**

Parse counts from the log/terminal. Template (replace numbers):

```json
{
  "command": "pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose",
  "cwd": "D:\\OandO07072026\\site",
  "testFile": "tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts",
  "exitCode": 0,
  "passed": "REPLACE_INT",
  "failed": 0,
  "timestamp": "REPLACE_ISO8601",
  "covers": [
    "furnitureFabricMapper poses/entityId/round-trip",
    "isOpen3dFabricFurnitureEnabled exact 1 only",
    "near-miss truthy rejected",
    "barrel re-export"
  ],
  "rawLog": "results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-raw.log"
}
```

**Forbidden:** fabricated zeros when tests failed; deleting FAIL lines from raw log.

- [ ] **Step 4: Spot-check flag cases exist in source (sanity)**

```powershell
cd .
rg -n "is true only when env is exactly 1|rejects near-miss|is false by default" site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts
```

Expected: matches present.

- [ ] **Step 5: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-raw.log `
  results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-run.json
git commit -m "test(p02): re-run fabric flag+mapper vitest into 01-engine-lock"
```

---

### Task 5b: Re-run orbit default unit suite (Three orbit lock)

**Why this plan adds 5b:** Repo evolved beyond phase card’s “omit prop” story. Orbit lock is now **helper + default + construct**. Idiots2 + anti-thrash #7 require proof orbit ON. This is still **no product code** — re-run existing tests into evidence.

**Files:**
- Create: `vitest-orbit-default-raw.log`, `vitest-orbit-default-run.json`
- Test: `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx`

- [ ] **Step 1: Run orbit unit suite**

```powershell
cd .
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 | Tee-Object -FilePath "results\planner\world-standard-wave\01-engine-lock\vitest-orbit-default-raw.log"
echo "EXIT=$LASTEXITCODE"
```

Expected: exit 0; includes:

- `OPEN3D_ORBIT_DEFAULT_ENABLED is true`
- `getOpen3dViewerControlProps forces enableControls: true`
- OrbitControls constructed when default/true
- Not constructed when `enableControls={false}`

- [ ] **Step 2: Write vitest-orbit-default-run.json**

```json
{
  "command": "pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose",
  "cwd": "D:\\OandO07072026\\site",
  "testFile": "tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx",
  "exitCode": 0,
  "passed": "REPLACE_INT",
  "failed": 0,
  "timestamp": "REPLACE_ISO8601",
  "covers": [
    "OPEN3D_ORBIT_DEFAULT_ENABLED true",
    "getOpen3dViewerControlProps enableControls true",
    "OrbitControls construct default ON",
    "opt-out enableControls false"
  ],
  "rawLog": "results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-raw.log",
  "workspaceCallSite": "OOPlannerWorkspace spreads getOpen3dViewerControlProps()"
}
```

- [ ] **Step 3: Optional static assert workspace still spreads helper**

```powershell
cd .
rg -n "getOpen3dViewerControlProps" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: import + JSX spread present. If missing → **STOP** — that is an orbit lock regression; restore spread before claiming CP-02.7/orbit rows.

- [ ] **Step 4: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-raw.log `
  results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-run.json
git commit -m "test(p02): re-run orbit default vitest into 01-engine-lock"
```

---

### Task 5c (conditional): Only if flag or orbit tests FAIL for real lock bug

**Default: SKIP.** Execute only on FAIL from 5/5b.

#### 5c-A — Flag enable rule broken

- [ ] **Step 1: Write/extend failing test first** (if missing case)

Full existing coverage already includes exact `"1"` and near-miss. Prefer fix production flag to match tests:

`fabricFurnitureFlag.ts` must remain:

```typescript
export const OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" as const;

export function isOpen3dFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
}
```

- [ ] **Step 2: Re-run Task 5 command — expect PASS**
- [ ] **Step 3: Commit fix with message `fix(p02): restore Fabric furniture exact-1 flag`**

#### 5c-B — Orbit helper or default broken

Restore `orbitDefaults.ts`:

```typescript
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;

export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

And workspace mount:

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

- [ ] Re-run Task 5b — expect PASS  
- [ ] Commit `fix(p02): restore open3d orbit default ON product helper`

#### 5c-C — Never “fix” by

- Adding konva  
- Disabling tests  
- Setting `enableControls={false}` on workspace  
- Softening flag to truthy coercion  

---

### Task 6: OWNER-SIGNOFF.md (single filename)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF.md`  
- **Forbidden:** `OWNER-SIGN OFF.md` (space)

- [ ] **Step 1: Present checkboxes to owner (chat/handover)**

Copy this list:

**Engine lock**

- [ ] Owner approves **Fabric.js v7 full stage** as 2D **destination**
- [ ] Owner approves **FeasibilityCanvas** as 2D **interim** under Approach A
- [ ] Owner approves **Three + orbit ON** as planner 3D
- [ ] Owner approves **no Konva + Fabric hybrid**
- [ ] Owner approves fail-forward: Konva **full** only after failed Fabric spike with evidence
- [ ] Owner approves Fabric furniture flag remains **default OFF** until explicit cutover work

**Product strategy (engine-adjacent)**

- [ ] Owner approves manufacturer SKU catalog strategy (O&O products)
- [ ] Owner approves success metric **BOQ/quote path > photoreal**
- [ ] Owner confirms Approach **A** (or writes B/C override)

**Process**

- [ ] Owner unlocks later phases (P03+) for implementation after CP-02
- [ ] Owner acknowledges anti-thrash rules bind agents without re-litigation

- [ ] **Step 2: Write OWNER-SIGNOFF.md — either marks or explicit deferral**

**Template A — owner marked (agent copies owner response + date):**

```markdown
# OWNER-SIGNOFF — CP-02 engine lock

**Date:** YYYY-MM-DD  
**Owner:** (name)  
**Recorded by agent from:** (chat / message ref)

## Engine

- [x] Fabric.js v7 full stage = 2D destination
- [x] FeasibilityCanvas = 2D interim (Approach A)
- [x] Three + orbit ON = planner 3D
- [x] No Konva + Fabric hybrid
- [x] Fail-forward Konva full only after failed Fabric spike + evidence
- [x] Fabric furniture flag default OFF

## Strategy

- [x] Manufacturer SKU catalog (O&O)
- [x] BOQ/quote > photoreal
- [x] Approach A

## Process

- [x] Unlock P03+ implementation after CP-02
- [x] Anti-thrash binds agents

## Quote / evidence of owner intent

> (paste owner words)
```

**Template B — owner silent / plan-only continue:**

```markdown
# OWNER-SIGNOFF — CP-02 engine lock

**Status:** DEFERRAL (not green for execution waves)

**Date:** YYYY-MM-DD

Approach A remains the planning default per design + INDEX.
Engine lock CP-02 is **not** claimed PASS for execution until owner marks Template A boxes
or writes an explicit override.

**Explicit:** Plan-only continue ≠ CP-02 green.
```

- [ ] **Step 3: Do not start P03 product code under “CP-02 green” without Template A or written owner waive**

Planning P03 docs is allowed with deferral; claiming W3 execution green is not.

- [ ] **Step 4: Mirror note**

`Plans/trustdata/00-START.md` is **dead**. If owner marks Template A, record mirror into:

- `results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF.md` (primary)  
- Optionally a short line in `Plans/INDEX.md` kill-order note **only if owner asks** — do not invent a second source of truth.

- [ ] **Step 5: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF.md
git commit -m "docs(p02): OWNER-SIGNOFF (marks or explicit CP-02 deferral)"
```

---

### Task 7: ANTI-THRASH-AUDIT.md (read-only greps)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ANTI-THRASH-AUDIT.md`
- Product code: **none**

- [ ] **Step 1: Grep interactive 2D thrash libs under planner**

```powershell
cd .
rg -n "\bkonva\b|react-konva|from ['\"]pixi|paper\.js|createjs" site/features/planner site/package.json --glob "!**/node_modules/**" | Select-Object -First 80
```

Record hits. Expected: no product interactive Konva path; package.json absent for konva.

- [ ] **Step 2: Grep residual thrash language (list for later docs pass)**

```powershell
rg -n "insurance|under evaluation|hybrid" site/features/planner/open3d Plans/phases/P02-engine-lock --glob "*.md" --glob "*.tsx" --glob "*.ts" | Select-Object -First 100
```

List files. **Do not mass-rewrite** in P02.

- [ ] **Step 3: Confirm workspace does not import archive fabric**

```powershell
rg -n "_archive/fabric|features/planner/_archive" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: no matches.

- [ ] **Step 4: Confirm orbit default + workspace not false**

```powershell
rg -n "enableControls=\{false\}|OPEN3D_ORBIT_DEFAULT_ENABLED|getOpen3dViewerControlProps" site/features/planner/open3d/3d site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: default true / helper present; workspace does not pass `enableControls={false}`.

- [ ] **Step 5: Confirm package.json no konva**

```powershell
rg -n "konva" site/package.json
```

Expected: no dependency lines (or only comments if any — currently absent).

- [ ] **Step 6: Write ANTI-THRASH-AUDIT.md**

```markdown
# ANTI-THRASH-AUDIT — P02

**Date:** …  
**Conclusion:** P03+ must not reopen engine choice.

## Grep results

### Interactive 2D libs
(paste)

### Residual language for later docs pass
(paste paths)

### Archive import into live workspace
(none expected)

### Orbit default
OPEN3D_ORBIT_DEFAULT_ENABLED true; workspace uses getOpen3dViewerControlProps(); no enableControls={false} at product mount.

### konva in package.json
ABSENT

## Violations

(none | list + Failures.md)

## Binding statement

P03+ implement product gates on locked stack. No Konva hybrid. No Babylon thrash. No orbit hard-off for CI. Fabric destination retained.
```

If any real violation: append to root `Failures.md` with path + severity.

- [ ] **Step 7: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ANTI-THRASH-AUDIT.md
git commit -m "docs(p02): ANTI-THRASH-AUDIT greps orbit helper no konva"
```

---

### Task 8: CP-02-SUMMARY.md + checkpoint close

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/CP-02-SUMMARY.md`
- Optionally update phase status honesty in plan card (docs only)

- [ ] **Step 1: List artifacts with Test-Path**

```powershell
cd .
$root = "results\planner\world-standard-wave\01-engine-lock"
@(
  "HEAD.txt","run.json","README.md","NOTES.md",
  "ENGINE-LOCK-RECORD.md","FLAG-INVENTORY.md","ENTRYPOINT-MAP.md",
  "PACKAGE-PIN.md","LICENSE-HYGIENE-NOTE.md",
  "vitest-fabric-flag-raw.log","vitest-fabric-flag-run.json",
  "vitest-orbit-default-raw.log","vitest-orbit-default-run.json",
  "OWNER-SIGNOFF.md","ANTI-THRASH-AUDIT.md","CP-02-SUMMARY.md"
) | ForEach-Object { "$_ : $(Test-Path (Join-Path $root $_))" }
```

Expected: all `True` before claiming complete (CP-02-SUMMARY may be written in this step).

- [ ] **Step 2: Write CP-02-SUMMARY.md**

```markdown
# CP-02-SUMMARY — Engine lock

**Date:** …  
**HEAD:** (from HEAD.txt)  
**Approach:** A  

## One-paragraph honest status

Engines are locked in writing under `01-engine-lock/`. Fabric.js v7 remains
2D destination; FeasibilityCanvas is live interim 2D; Fabric furniture flag
default OFF; Three + orbit ON via product helper; no Konva hybrid; package
pins recorded without upgrades. Fabric full walls are **not** cut over.
Select/delete and orbit Playwright journeys are **not** claimed here.

## CP-02 criteria map

| # | Requirement | Path | Status |
|---|-------------|------|--------|
| CP-02.1 | Locked stack written | ENGINE-LOCK-RECORD.md | PASS/FAIL |
| CP-02.2 | Flag inventory | FLAG-INVENTORY.md + fabricFurnitureFlag.ts | PASS/FAIL |
| CP-02.3 | Entrypoint map incl WorkspaceRoute | ENTRYPOINT-MAP.md | PASS/FAIL |
| CP-02.4 | Package pins | PACKAGE-PIN.md | PASS/FAIL |
| CP-02.5 | Fabric flag unit re-run | vitest-fabric-flag-* | PASS/FAIL |
| CP-02.5b | Orbit unit re-run (plan extension) | vitest-orbit-default-* | PASS/FAIL |
| CP-02.6 | Owner sign-off or deferral | OWNER-SIGNOFF.md | PASS / DEFER |
| CP-02.7 | Anti-thrash audit | ANTI-THRASH-AUDIT.md | PASS/FAIL |
| CP-02.8 | Summary + next | this file | PASS/FAIL |

## Map minimum

NOTES.md present with ENGINE-DECISION link.

## Next phase

`Plans/phases/P03-select-delete/` — W3 select/delete on **Feasibility**, flag OFF.
Do not re-pick engines.

## Non-claims

- Not W1–W8 green  
- Not Fabric 2B.2 complete  
- Not mesh class-leading  
- Not photoreal
```

- [ ] **Step 3: Honest phase card note (optional docs)**

If updating `Plans/phases/P02-engine-lock/P02-engine-lock.md` status table: set evidence re-proved date; **do not** leave DONE if OWNER-SIGNOFF is DEFERRAL.

- [ ] **Step 4: Final commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/
git status -sb
git commit -m "docs(p02): CP-02-SUMMARY complete 01-engine-lock evidence pack"
```

- [ ] **Step 5: Push/mirror when landable (agent call per AGENTS.md)**

```powershell
# when green enough not to strand remote
git push origin HEAD
# mayoite mirror ~45m / big land
# git push mayoite HEAD
```

Log push failure if cannot access remote — do not invent success.

---

## 7. Test matrix

| ID | Layer | Command | Expected | Evidence |
|----|-------|---------|----------|----------|
| T1 | Unit Fabric flag+mapper | `cd site && pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose` | exit 0; flag exact-1; near-miss OFF | `vitest-fabric-flag-*` |
| T2 | Unit orbit contract | `cd site && pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose` | exit 0; default ON; helper forces true | `vitest-orbit-default-*` |
| T3 | Static package pin | node extract deps | fabric `7.4.0`; konva ABSENT | PACKAGE-PIN.md |
| T4 | Static host chain | rg WorkspaceRoute on guest/canvas | present | ENTRYPOINT-MAP |
| T5 | Static orbit call site | rg getOpen3dViewerControlProps on workspace | present | ENTRYPOINT-MAP / audit |
| T6 | Browser Playwright orbit journey | **Out of scope P02** | — | P04 |
| T7 | Browser select/delete | **Out of scope P02** | — | P03 |
| T8 | Flag-ON dual CAD e2e | **Not product proof** | spike only if owner asks later | not CP-02 |

### Expected output shapes

**Vitest success fragment (illustrative):**

```
✓ isOpen3dFabricFurnitureEnabled > is true only when env is exactly 1
✓ isOpen3dFabricFurnitureEnabled > rejects near-miss enable values
✓ orbitControlsDefault > getOpen3dViewerControlProps forces enableControls: true
Test Files  1 passed
```

Exact counts: take from live run into JSON.

---

## 8. False-green catalog

| Trap | Why false | Plan block |
|------|-----------|------------|
| Phase checkboxes `[x]` without files | Status theater | Re-prove; disk missing |
| Empty raw log | Suppression | Length check Step 5.2 |
| Invent `02-engine-lock` | Wrong map | Task 0 ban |
| Claim Fabric cutover from flag unit pass | Units ≠ full stage | Summary non-claims |
| Flag-ON for W3 | Dual pointer | FLAG-INVENTORY W-gate rule |
| “Orbit locked” without unit/helper | Stale omit-prop story | Task 5b + ENTRYPOINT |
| CP-02 green with DEFERRAL sign-off | Ambiguous unlock | Template B language |
| Packages installed = product score 4 | Self-score ~2 | Summary honesty |
| Delete tests to “fix” thrash | Fake green | Forbidden |
| Site results dump | Layout ban | `check:layout` / root results only |
| LICENSE hygiene ignored as engine SHIP | Packages FIX | Task 4b |
| trustdata path as proof | Dead tree | Use Plans/Research + results |

---

## 9. Stop-if-fail / CP criteria

### Hard stops

| Condition | Action |
|-----------|--------|
| Vitest T1 or T2 fails | Fix or Failures.md; no CP-02.5 pass |
| Workspace loses orbit helper / sets false | Stop; restore before green |
| Agent creates `02-engine-lock` as canonical | Delete/redirect; use `01-` only |
| Product package upgrade mid-phase without owner | Revert; not P02 |
| Owner silent | Template B deferral; plan-only; **no execution green claim** |
| Hybrid lib introduced | Fail CP-02.7; remove |

### CP-02 gate table (execution checklist)

| # | Requirement | Proof |
|---|-------------|-------|
| CP-02.1 | Locked stack written | `ENGINE-LOCK-RECORD.md` |
| CP-02.2 | Flag location + exact-1 rule | `FLAG-INVENTORY.md` + flag source |
| CP-02.3 | Entrypoints open3d/guest/canvas + WorkspaceRoute | `ENTRYPOINT-MAP.md` |
| CP-02.4 | Package pins from site/package.json | `PACKAGE-PIN.md` |
| CP-02.5 | Fabric flag unit re-run | raw log + run.json |
| CP-02.5b | Orbit unit re-run | raw log + run.json |
| CP-02.6 | Owner marks or explicit deferral | `OWNER-SIGNOFF.md` only |
| CP-02.7 | Anti-thrash audit | `ANTI-THRASH-AUDIT.md` |
| CP-02.8 | Summary → P03 | `CP-02-SUMMARY.md` |
| Map floor | NOTES + ENGINE-DECISION link | `NOTES.md` |

**Unlock P03 product code:** CP-02 green with Template A **or** owner written waive. Deferral alone ≠ unlock for implementation waves.

---

## 10. Commit sequence

| Order | Message |
|------:|---------|
| 1 | `docs(p02): seed 01-engine-lock evidence meta (HEAD, run, README, NOTES)` |
| 2 | `docs(p02): ENGINE-LOCK-RECORD Fabric dest Feasibility interim Three orbit` |
| 3 | `docs(p02): FLAG-INVENTORY exact env=1 Fabric furniture spike` |
| 4 | `docs(p02): ENTRYPOINT-MAP host chains WorkspaceRoute orbit helper` |
| 5 | `docs(p02): PACKAGE-PIN fabric 7.4.0 three r3f drei no konva` |
| 6 | `docs(p02): license hygiene note Fancyapps GSAP (not engine thrash)` |
| 7 | `test(p02): re-run fabric flag+mapper vitest into 01-engine-lock` |
| 8 | `test(p02): re-run orbit default vitest into 01-engine-lock` |
| 9 | `docs(p02): OWNER-SIGNOFF (marks or explicit CP-02 deferral)` |
| 10 | `docs(p02): ANTI-THRASH-AUDIT greps orbit helper no konva` |
| 11 | `docs(p02): CP-02-SUMMARY complete 01-engine-lock evidence pack` |
| 12c | `fix(p02): …` only if 5c triggered |

Push origin when landable; mayoite on ~45m / big land.

---

## 11. Risks & owner decisions

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Agents re-open Konva | Medium | OWNER-SIGNOFF + anti-thrash + this plan |
| Flag-ON treated as product | Medium | FLAG inventory W-gate rule |
| Stale “no orbit” docs | Medium | Code + Task 5b win |
| Mesh → engine switch PR | High | Route P08 |
| Photoreal envy | Medium | BOQ lock |
| Fabric abandoned as insurance | Medium | Anti-thrash 5–6; keep stage |
| Missing results claimed DONE | High on this checkout | Re-prove entire pack |
| Owner silent | Medium | Explicit deferral Template B |
| Fancyapps/GSAP debt | Medium | Hygiene note; ask before purchase |
| Wrong evidence folder | Low if audited | RESULTS-MAP ban list |
| trustdata path thrash | Medium | Use Plans/* live tree only |
| Phase card still shows DONE | Medium | Optional honesty edit after re-prove |

### Owner decisions required

1. Template A marks vs Template B deferral  
2. Fancyapps remove vs license (ask before purchase)  
3. GSAP acceptance row schedule  
4. When Fabric 2B.2 starts relative to W8 (not blocking CP-02 write-up)

---

## 12. Self-review vs brainstormer + repo

| Check | Result |
|-------|--------|
| Repo coverage: Feasibility, Fabric stage, Three, orbit helper, host chains, package pins, tests | Tasks 0–8 + 5b |
| Brainstormer Approach A/B/C | A chosen; B/C rejected in §2 |
| False reverses catalog | §8 |
| Evidence `01-engine-lock` only | Task 0 ban |
| PACKAGE-PIN exact | Task 4 |
| No placeholder TBD in tasks | Templates use REPLACE only until agent fills from commands |
| Orbit evolved truth | Documented vs stale omit-prop |
| Ethics non-copy | §3 |
| No product cutover in scope | Explicit |
| Idiots2 only (not Idiots) | Inputs header |
| Length honesty | Extensive by design; evidence phase still has many small steps |

### Placeholder scan

No `TBD`/`TODO` left as agent excuses. `REPLACE_*` markers appear only where live command output must be inserted (correct pattern for evidence meta).

### Type / API consistency

- Flag: `=== "1"` only  
- Orbit: `{ enableControls: true }` from helper  
- Fabric entityId = furniture.id  
- Document mm source of truth  

---

## 13. Appendices

### Appendix A — Full absolute path index

```
plans1/P02-engine-lock\IMPLEMENTATION-PLAN.md
Idiots2\P02-engine-lock\REPORT.md
Plans\phases\P02-engine-lock\P02-engine-lock.md
Plans\phases\P02-engine-lock\P02-suggestions.md
Plans\phases\P02-engine-lock\02-canvas-2d.md
Plans\phases\P02-engine-lock\05-packages-stack.md
Plans\INDEX.md
Plans\Research\RESULTS-MAP.md
docs\superpowers\specs\2026-07-09-world-standard-planner-design.md
site\package.json
site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts
site\features\planner\open3d\canvas-fabric-stage\FurnitureFabricLayer.tsx
site\features\planner\open3d\canvas-fabric-stage\furnitureFabricMapper.ts
site\features\planner\open3d\canvas-fabric-stage\index.ts
site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx
site\features\planner\open3d\editor\OOPlannerWorkspace.tsx
site\features\planner\open3d\3d\orbitDefaults.ts
site\features\planner\open3d\3d\ThreeLazyViewer.tsx
site\features\planner\open3d\3d\ThreeViewerInner.tsx
site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx
site\features\planner\ui\Open3dPlannerHost.tsx
site\features\planner\open3d\ui\Open3dNativeHost.tsx
site\app\planner\open3d\page.tsx
site\app\planner\(workspace)\guest\page.tsx
site\app\planner\(workspace)\canvas\page.tsx
site\tests\unit\features\planner\open3d\canvas-fabric-stage\furnitureFabricMapper.test.ts
site\tests\unit\features\planner\open3d\orbitControlsDefault.test.tsx
results\planner\world-standard-wave\01-engine-lock\   (create on execute)
```

### Appendix B — Flag API catalog

```typescript
// fabricFurnitureFlag.ts
export const OPEN3D_FABRIC_FURNITURE_ENV: "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE";
export function isOpen3dFabricFurnitureEnabled(
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>
): boolean;
```

Enable matrix:

| env value | result |
|-----------|--------|
| unset | false |
| `""` | false |
| `"0"` | false |
| `"true"` | false |
| `"1 "` | false |
| `"1"` | true |

### Appendix C — Orbit API catalog

```typescript
// orbitDefaults.ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED: true;
export function getOpen3dViewerControlProps(): { enableControls: true };

// Lazy3DViewerProps.enableControls?: boolean // default OPEN3D_ORBIT_DEFAULT_ENABLED
// ThreeViewerInner same default; constructs OrbitControls when true
```

### Appendix D — Mapper contracts (destination path)

```typescript
export const DEFAULT_FURNITURE_FOOTPRINT_MM = 600;
export const DEFAULT_FABRIC_STAGE_TRANSFORM: CanvasTransform = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
};
export const FURNITURE_ENTITY_ID_PROP = "entityId";
// furnitureToFabricPose(item, transform?)
// fabricPoseToDocumentUpdate(input, transform?)
// entityId MUST equal Open3dFurnitureItem.id
// Fabric JSON never persisted
```

### Appendix E — Research translation (ideas → O&O only)

| Research idea | O&O action | Phase |
|---------------|------------|-------|
| Hybrid web 2D structure / 3D decorate | Feasibility now + Three; Fabric later | P02 lock / W gates |
| Instant 2D↔3D continuity | Same UUIDs; rebuild 3D from document | P04 |
| Select/delete grammar | Feasibility hit-test + document selection | P03 |
| Manufacturer SKU / BOQ | Catalog + quote path | Strategy + later BOQ |
| RoomSketcher measure bar | Tools on document — not engine switch | Later measure UX |
| Photoreal climax | Deprioritize; async later | Non-goal P02 |
| Open peers (blueprint3d etc.) | Pattern study under license | Not paste |

### Appendix F — Binding freeze statement (wall text)

```
Document (UUID, mm)
  ├── 2D destination: Fabric.js v7 full stage
  ├── 2D interim:     FeasibilityCanvas (live tools)
  ├── 3D:             Three.js + R3F + orbit ON
  ├── Admin preview:  model-viewer (not workspace)
  ├── Symbols:        Block2D → later SVG authority
  ├── Mesh:           modular + own GLB path
  ├── Catalog:        O&O manufacturer SKUs
  └── Persist:        IDB first, honest labels

Forbidden: hybrid Konva+Fabric · Unity thrash · competitor assets ·
  photoreal as engine justification · flag-ON dual-CAD · invent 02-engine-lock
```

### Appendix G — Ten questions every agent must answer post-CP-02

1. Interim 2D? → FeasibilityCanvas  
2. Destination 2D? → Fabric v7 full stage  
3. Fabric default on? → No  
4. Planner 3D? → Three + R3F path, orbit ON  
5. Konva hybrid? → Never  
6. model-viewer planner 3D? → No  
7. Why not photoreal first? → BOQ/SKU manufacturer wedge  
8. Evidence folder? → `01-engine-lock/`  
9. Approach? → A  
10. Next product work? → P03 select/delete on Feasibility, not engine shopping  

### Appendix H — Vitest commands cheat sheet (PowerShell)

```powershell
# From repo root always create evidence dir first
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-engine-lock" | Out-Null

# Fabric
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log"

# Orbit
pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\01-engine-lock\vitest-orbit-default-raw.log"
```

### Appendix I — Relationship to later phases (lock stays locked)

| Phase | May re-pick engines? | Work |
|-------|----------------------|------|
| P03 | No | Select/delete Feasibility; flag OFF |
| P04 | No | Orbit + UUID continuity browser |
| P05 | No | Block2D honesty |
| P06 | No | Save honesty |
| P07 | No | Browser journey on locked stack |
| P08 | No | Mesh quality content |
| P09 | No | Shortcuts/chrome |
| P10 | No | Handover pack |
| Post-W Fabric 2B.2 | Still one 2D engine | Migrate walls/tools to Fabric |

### Appendix J — What “done” is not

- Fabric still flag-OFF → **expected**, not incomplete  
- Select/delete weak → P03  
- Orbit Playwright unproven → P04  
- Packages expert FIX items open → hygiene, not engine re-vote  

---

## Execution handoff

**Plan complete and saved to `plans1/P02-engine-lock/IMPLEMENTATION-PLAN.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

---

*End of P02 engine-lock implementation plan. Plan-only deliverable. No site product edits performed by planner. Repo first · Idiots2 second · extensive tasks 00–8 + 5b orbit re-prove · evidence only under `01-engine-lock/`.*
