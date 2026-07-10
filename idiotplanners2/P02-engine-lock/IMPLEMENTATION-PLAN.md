# P02 Engine Lock — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-prove and freeze the locked 2D/3D stack (Fabric.js v7 full stage **destination** · FeasibilityCanvas **interim** · Three + orbit **ON** · no hybrid · manufacturer SKU · BOQ/quote > photoreal) under canonical evidence `results/planner/world-standard-wave/01-engine-lock/`, so P03+ agents ship product gates without engine thrash.

**Architecture:** One document model (UUID entities, mm) is the source of truth. Live interactive 2D is **FeasibilityCanvas** (native Canvas 2D API). Destination 2D is **Fabric.js v7 full stage** via `site/features/planner/open3d/canvas-fabric-stage/` (furniture flag default **OFF**; migration spike only when `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`). Planner 3D is **Three.js + R3F ecosystem** with **OrbitControls ON** via `OPEN3D_ORBIT_DEFAULT_ENABLED` + `getOpen3dViewerControlProps()` at workspace product mount. Admin `@google/model-viewer` is **not** the workspace engine. **Never** Konva+Fabric hybrid interactive 2D. Fail-forward = Konva **full** only after failed Fabric spike with `results/` proof.

**Tech Stack:** TypeScript · Next.js (`site/`) · Vitest · Fabric.js `7.4.0` (exact) · three `^0.185.1` · `@react-three/fiber` `^9.6.1` · `@react-three/drei` `^10.7.7` · Canvas 2D (Feasibility) · OrbitControls from `three/examples/jsm/controls/OrbitControls.js` · pnpm monorepo · evidence **only** under repo-root `results/`.

**Inputs consumed:**
- Repo read: 2026-07-10 · workspace `D:\OandO07072026` · tree dirty honesty deferred to Task 0 `HEAD.txt` · key paths in §1 Repo reality
- Brainstormer: **`Idiots/P02-engine-lock/REPORT.md` only** — **never** `Idiots2/`
- Phase plan: `Plans/phases/P02-engine-lock/` (all five files)
- Maps: `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (Approach **A** APPROVED)
- Expert essays: `02-canvas-2d.md` (**SHIP**), `05-packages-stack.md` (**FIX**)
- Research ideas (not product truth): `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`, `MASTER-CHART.md`

**Done when:**
1. Evidence folder `results/planner/world-standard-wave/01-engine-lock/` exists with full artifact checklist (not only prose in Plans).
2. `ENGINE-LOCK-RECORD.md` freezes Fabric dest / Feasibility interim / Three+orbit / no hybrid / SKU / BOQ>photoreal with **live 2026-07-10 code truth** including `getOpen3dViewerControlProps()`.
3. `PACKAGE-PIN.md` records exact strings from live `site/package.json` (fabric exact `7.4.0`; three/r3f/drei carets; konva absent).
4. Fabric flag unit suite re-run logged (raw log + run.json) with package-relative paths from `site/`.
5. Orbit contract unit re-run logged (`orbitControlsDefault.test.tsx`) proving default ON + product helper forces `enableControls: true`.
6. `FLAG-INVENTORY.md` + `ENTRYPOINT-MAP.md` match live host chains (guest/canvas via `Open3dPlannerWorkspaceRoute`).
7. `OWNER-SIGNOFF.md` has owner marks **or** explicit written deferral (no dual spaced filename).
8. `ANTI-THRASH-AUDIT.md` greps complete; no product package upgrades; no second interactive 2D lib introduced.
9. `CP-02-SUMMARY.md` + map-minimum `NOTES.md` present; CP-02 criteria 1–8 can be checked from evidence paths only.
10. **No** claim that Fabric full walls cutover shipped, select/delete is green, or orbit Playwright journey is done (those are P03/P04/later).

**Evidence folder (canonical):** `results/planner/world-standard-wave/01-engine-lock/`  
**Forbidden evidence name:** `02-engine-lock/` (reserved for P07 browser journey prefix).  
**Product code policy for this phase:** **Default = zero product implementation.** Evidence + docs + unit re-runs only. Optional tiny test-only reinforcement allowed only if Task 5/5b FAIL for a real lock regression — then stop, fix minimally, re-prove. **No Fabric cutover. No Konva. No package upgrades.**

**Save path for this plan:** `idiotplanners2/P02-engine-lock/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality

### 1.1 What the phase file claims vs disk

| Claim | Live 2026-07-10 (this planner session) |
|-------|----------------------------------------|
| CP-02 pack **DONE** under `01-engine-lock/` | **FALSE on this checkout** — entire `results/` tree **missing** (`list_dir` failed). Phase status table is **stale**. **Re-prove from zero.** |
| CP-02.1–.8 checkboxes marked `[x]` in phase file | **Unproven** without evidence files. Treat as historical aspiration, not PASS. |
| Owner sign-off complete | **Unproven** — expert pass still said open; no `OWNER-SIGNOFF.md` on disk. |
| `Plans/trustdata/*` paths in phase file / RESEARCH-MAP footnotes | **Dead / moved** — operational home is `Plans/phases/`, `Plans/Research/RESULTS-MAP.md`, `Plans/INDEX.md`. |
| Evidence root `01-engine-lock/` | Canonical per RESULTS-MAP; **must create**. Never invent `02-engine-lock/`. |
| ENGINE-DECISION research status | **PROPOSED — owner confirm** (research file). Plan PASS does not rewrite research. |

**Iron rule for this plan:** Missing `results/` = re-prove. Do not cite ghost PASS.

### 1.2 Live engine code (verified by file read 2026-07-10)

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

#### Workspace flag wire + 3D orbit (live — evolved past omit-only prose)

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

`ThreeLazyViewer.tsx` / `ThreeViewerInner.tsx`: default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` (`true`). When true, Inner dynamic-imports `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js` and sets `data-orbit-enabled`.

**Contradiction with phase plan prose + Idiots §10.3:** Phase file Task 3 still says workspace “omits `enableControls` prop.” Idiots report §10.3 still says “prop omitted → default true.” **Repo wins:** workspace **spreads** `getOpen3dViewerControlProps()` → stronger lock (typed force `true`). Evidence `ENTRYPOINT-MAP.md` and `ENGINE-LOCK-RECORD.md` **must** document the helper, not the stale omit-only sentence. Idiots §11 C5 (omit vs explicit) is **resolved on disk** in favor of explicit helper — record that in evidence.

#### Host chains (live)

| Route | Chain |
|-------|--------|
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` → **`Open3dPlannerWorkspaceRoute`** (Providers + ProjectSetupGate + dynamic host) → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` → **`Open3dPlannerWorkspaceRoute`** → same |

Guest page truth:

```tsx
return <Open3dPlannerWorkspaceRoute guestMode planId={planId} />;
```

Open3d pilot page truth:

```tsx
return <Open3dPlannerHost guestMode={isGuest} planId={planId} />;
```

**Stale docs risk:** `open3d/README.md` route table may still omit WorkspaceRoute. Anti-thrash audit lists this for later docs pass — **do not mass-rewrite README in P02 unless owner asks**.

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
| `gsap` / `@gsap/react` | present; used outside engine vote (`useScrollAnimation` + ScrollTrigger) |

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
| Canvas expert | `Plans/phases/P02-engine-lock/02-canvas-2d.md` (**SHIP**) |
| Packages expert | `Plans/phases/P02-engine-lock/05-packages-stack.md` (**FIX**) |
| Program index | `Plans/INDEX.md` |
| Evidence map | `Plans/Research/RESULTS-MAP.md` |
| Design Approach A | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Licenses | `Plans/Research/Others/17-LICENSES-CLEARED.md` (ayushdocs path may be missing) |
| Dead path (do not write evidence only there) | `Plans/trustdata/*` |

### 1.4 Approach A (binding)

From design + phase + Idiots report:

- Ship W1–W8 on **Feasibility + document** first.
- Fabric full stage remains **destination** (Plan A 2B.2 after W), **not** insurance to delete.
- Three + orbit ON is planner 3D.
- No hybrid thrash.
- Success metric: **BOQ/quote > photoreal**.
- Catalog pattern: manufacturer SKU (O&O products).

Approach **B** (Fabric full stage first) and **C** (chrome first) are **rejected** for this wave unless owner changes the goal.

### 1.5 What P02 is NOT

- Not P03 select/delete implementation.
- Not P04 orbit Playwright continuity pack.
- Not Fabric walls cutover.
- Not package upgrades / Konva experiment.
- Not claiming product is shippable because packages exist (O&O research self-score ~2).
- Not photoreal, multiplayer CRDT, LiDAR/AR.
- Not mass rewrite of residual “hybrid” comments (list only).

### 1.6 Repo-first checklist (completed before brainstormer consumption)

- [x] Listed real files that evidence tasks will cite
- [x] Noted contradictions: phase DONE vs missing `results/`; omit-prop prose vs `getOpen3dViewerControlProps()`; trustdata paths dead; ENGINE-DECISION PROPOSED vs plan PASS
- [x] Noted missing evidence → plan re-proves entire pack
- [x] HEAD honesty deferred to Task 0 real commands

---

## 2. Brainstormer synthesis (`Idiots/P02-engine-lock/REPORT.md`)

> **Input restriction:** This plan wave uses **Idiots only**. Do not import Idiots2 conclusions as authority. Where Idiots and live code disagree, **repo wins**.

### 2.1 One-liner (binding intent — Idiots §1)

**Confirm once, in writing and in repo evidence, the locked 2D/3D stack so later phases stop thrashing engines and only ship product gates (W1–W8) on the locked path.**

Operational paraphrase for agents:

> Stop arguing about engines. One document model (mm + UUID). Interim 2D = FeasibilityCanvas. Destination 2D = Fabric.js v7 full stage. 3D = Three family with orbit on. No Konva hybrid. Ship buyer gates on that stack. BOQ beats photoreal.

### 2.2 What engine lock means (operational — Idiots §1.3)

| Locked question | Binding answer |
|-----------------|----------------|
| 2D **destination** interaction engine? | Fabric.js v7 full stage |
| 2D **live interim** interactive path? | FeasibilityCanvas (Canvas 2D API) |
| Planner **3D**? | Three.js family via open3d `ThreeViewerInner` / `Lazy3DViewer`; R3F ecosystem present; orbit ON |
| Konva + Fabric dual interactive OK? | **No** |
| Fail-forward if Fabric dies? | Konva **full** only after failed spike + evidence |
| Catalog philosophy? | Manufacturer SKU-first (O&O products) |
| Success metric? | BOQ/quote path > photoreal race |
| May P03+ re-vote engines? | **No** without owner written override |

**Not engine lock:** shipping Fabric walls; proving W3–W8; upgrading packages; “evaluating Konva just in case.”

### 2.3 Critical honesty finding (Idiots §0.5 / §8.5) — **drives this plan**

At brainstormer write, **`results/planner/world-standard-wave` is missing**. Plan claims CP-02 PASS. Agent 02 rule:

> Treat plan **text** as intent + historical claim. Treat **missing `results/` folder** as **unproven on this checkout**. Re-execution of Tasks 0–8 is the only honest path.

**This implementation plan adopts that rule as law.**

### 2.4 Approach A/B/C (Idiots + design)

| Approach | Verdict |
|----------|---------|
| **A** Feasibility first, Fabric destination | **RECOMMENDED / BINDING** |
| **B** Fabric cutover before W | Reject for current wave |
| **C** Chrome first | Reject (canvas still unusable) |

### 2.5 Three layers of 2D reality (Idiots §3.1 — do not collapse language)

| Layer | Name | Status |
|-------|------|--------|
| L0 Document | UUID entities, mm, history, selection | Live authority |
| L1 Interim view | FeasibilityCanvas | Live interactive (W1–W8 surface) |
| L2 Destination view | Fabric full stage | Partial spike only (furniture flag OFF) |

Kill language: “Fabric is insurance” · “Feasibility is final forever without override” · “Flag-ON dual mode is product” · “Archive `/planner/fabric` is live”.

### 2.6 Decision matrix D1–D14 (for ENGINE-LOCK-RECORD)

| # | Decision |
|---|----------|
| D1 | Fabric.js v7 full stage = 2D destination |
| D2 | FeasibilityCanvas = 2D interim |
| D3 | Fabric furniture flag default OFF; ON = migration spike |
| D4 | No Konva+Fabric hybrid |
| D5 | Fail-forward Konva full only after failed Fabric spike + evidence |
| D6 | Three + R3F ecosystem = planner 3D family |
| D7 | Orbit ON by default + product helper forces true at workspace |
| D8 | model-viewer admin only |
| D9 | Block2D symbols now; SVG publish separate (not P02 implement) |
| D10 | Modular mesh + own GLB path (P08 content, not engine swap) |
| D11 | Manufacturer SKU catalog |
| D12 | BOQ/quote > photoreal |
| D13 | Photoreal race / multiplayer / LiDAR non-goals now |
| D14 | Research = patterns only |

### 2.7 False-green / false-reverse traps (Idiots §3.3.3, §4.4, §13.5)

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
| Port open3d 3D to R3F mid-gate | Explicit non-goal |
| Furniture rotation radians rewrite | Document degrees stay |

### 2.8 Raised bar beyond process PASS (Idiots §13)

1. Name **live path before destination** in every status recap.
2. Evidence folder existence is part of green.
3. Owner PROPOSED vs APPROVED must match OWNER-SIGNOFF.
4. Flag matrix in W proofs: `fabricFurniture=OFF`.
5. Orbit: default + call-site helper + (for P04) DOM attribute.
6. License pending blocks “packages SHIP” language even if engines locked.
7. Engine lock alone does not raise O&O self-score from ~2 to 4.
8. No silent orbit-off for CI.
9. Agents answer lock questions from evidence without grepping whole monorepo.

### 2.9 Packages expert FIX (Idiots §5) — not engine re-vote

- Engine path MIT-aligned (fabric/three/r3f/drei).
- `@fancyapps/ui` proprietary, likely unused → clear or remove (**ask before purchase**).
- `gsap` Standard used → owner acceptance row pending.
- PACKAGE-PIN required; no upgrades in P02.
- Packages **SHIP** is **separate** from engine lock green — record hygiene note; do not invent license clearance.

### 2.10 Competitive JTBD → O&O only (Idiots §6–7)

| Pattern source | Steal idea (not UI/assets) | O&O action |
|----------------|---------------------------|------------|
| RoomSketcher | Measure rigor / plan accuracy | Later quality; not engine swap |
| Planner5D | 2D structure + 3D decorate split; ease | Keep Three + dual mode |
| Homestyler/Foyr | Mesh/photoreal marketing | **Reject as success metric** |
| IKEA | SKU-first → quote path | Catalog + BOQ metric |
| Floorplanner | Orbit as nav; dual view | Orbit ON lock |

### 2.11 Anti-thrash rules 1–13 (Idiots §4.3 — bind in ENGINE-LOCK-RECORD)

1. Decide once after CP-02 — no “evaluate Konva” PRs without owner override.  
2. One interactive 2D engine at a time — flag-ON is spike not dual-CAD.  
3. No hybrid ban exceptions for “just this toolbar.”  
4. Archive ≠ live — never wire `_archive/fabric` as guest/canvas.  
5. Insurance language invalid — Fabric is destination until failed spike evidence.  
6. Approach A does not abandon Fabric — keep `canvas-fabric-stage/`.  
7. Orbit is default 3D nav — no hard-off for flaky tests.  
8. model-viewer admin only.  
9. Research inspiration only — no competitor paste into `site/`.  
10. Success metric BOQ/quote > photoreal thrash.  
11. Evidence or it did not happen — `01-engine-lock/`.  
12. No worktrees — main checkout only.  
13. Supersession — ENGINE-LOCK-RECORD wins over residual “under evaluation.”

### 2.12 What P02 does NOT prove (Idiots §8)

Select/delete · orbit browser journey · Block2D quality · save honesty · draw journey · mesh · shortcuts · photoreal · cloud multiplayer · buyer-ready product · license SHIP · Fabric walls cutover.

### 2.13 Open questions (record in evidence README — do not re-open engines)

1. Fabric walls cutover timing after W8 green (Cutover-1 big bang vs Cutover-2 layered — Idiots §14).  
2. Owner B/C override? (default A).  
3. Walkthrough camera when?  
4. Measure suite depth schedule.  
5. Cloud vs local honesty schedule.  
6. Fancyapps/GSAP cleanup schedule.  
7. Mesh bar aggressiveness for W7.  
8. Fail-forward spike criteria definition (FPS? selection bugs?) — Idiots C12.

### 2.14 Conflict rule applied

| Topic | Winner |
|-------|--------|
| What code does | **Repo** |
| Intent / bar / failure modes | **Idiots REPORT** when repo silent |
| Evidence folder names | **RESULTS-MAP** |
| Phase DONE without files | **Missing evidence → re-prove** |
| Orbit call-site | **Repo** (`getOpen3dViewerControlProps`) over Idiots omit-prop prose |

### 2.15 Critique absorbed (Idiots §11)

| ID | Issue | Plan response |
|----|-------|---------------|
| C1 | PASS vs missing results | Re-prove entire pack; status only green when files exist |
| C2 | ENGINE-DECISION PROPOSED | OWNER-SIGNOFF; optional research status patch only after owner |
| C3 | Plan A archive path may be dead | Prefer live design + P02 phase as authority |
| C4 | Packages FIX vs engine PASS | LICENSE-HYGIENE-NOTE; packages SHIP separate |
| C5 | Orbit omit vs explicit | Repo already explicit — document helper |
| C10 | Plan-only continue vs CP PASS | Hard language in OWNER-SIGNOFF + CP-02-SUMMARY |

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Study competitor **behavior** / JTBD | Paste JS, shaders, GLB, icons, brands into `site/` |
| Use hiring-stack signals to pick **open** npm | Ship competitor CDN/app bundles |
| Study open-source under license (reimplement) | Paste GPL (e.g. SH3D) into MIT product without compliance |
| Screenshots of **O&O** under `results/` | Competitor shots as product assets |
| Research under `D:\websites` ideas only | Firecrawl re-scrape for routine P02 |
| Rebuild patterns originally | “Confusing substitute” trade dress |

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
| `LICENSE-HYGIENE-NOTE.md` | 4b |
| `vitest-fabric-flag-raw.log` | 5 |
| `vitest-fabric-flag-run.json` | 5 |
| `vitest-orbit-default-raw.log` | 5b |
| `vitest-orbit-default-run.json` | 5b |
| `OWNER-SIGNOFF.md` | 6 |
| `ANTI-THRASH-AUDIT.md` | 7 |
| `CP-02-SUMMARY.md` | 8 |

### 4.2 Modify (docs only if needed; default none in product)

| Path | When |
|------|------|
| `Plans/phases/P02-engine-lock/P02-engine-lock.md` | Optional after re-prove: correct status table DONE→re-proved date; **do not** mark CP green without files |
| Root `Failures.md` | Only if vitest fails or lock violation found |
| `Plans/Research/Others/17-LICENSES-CLEARED.md` | **Owner** for GSAP/Fancyapps — agent records need, does not purchase |

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

| Path | Note |
|------|------|
| `results/planner/fabric-stage-slice/` | Prior mapper pack — may be missing on this checkout |
| `results/planner/world-standard-wave/COMPARISON-CHART.md` | Wave root context — may be missing; recreate pointer optional |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | Ideas + owner boxes; not CP evidence |

### 4.6 Boundaries

| In P02 | Out of P02 |
|--------|------------|
| Evidence pack under `01-engine-lock/` | W3 select/delete product code |
| Unit re-runs for flag + orbit | Playwright orbit continuity (P04) |
| Anti-thrash greps | Mass docs rewrite |
| License hygiene **note** | Fancyapps purchase / GSAP Club plugins |
| Approach A confirmation | Fabric full stage cutover |

---

## 5. Architecture & data flow

### 5.1 Locked stack ASCII

```
Document (UUID entities, mm)  ← product spine (engine-agnostic)
  ├── 2D destination: Fabric.js v7 full stage
  │     └── path: canvas-fabric-stage/ (flag OFF default; spike when =1)
  ├── 2D interim (live): FeasibilityCanvas (Canvas 2D API)
  │     └── walls/rooms/tools/Block2D furniture when furniture layer on
  ├── 3D: Three.js + R3F ecosystem + OrbitControls ON
  │     └── Lazy3DViewer → ThreeViewerInner (+ getOpen3dViewerControlProps at workspace)
  ├── Catalog: O&O manufacturer SKUs + Block2D + modular mesh (not this phase)
  └── Persist: IDB first; cloud honesty later (not this phase)
```

### 5.2 Runtime flow (2D mode, production default)

```
User on /planner/guest | /planner/canvas | /planner/open3d
  → host chain → OOPlannerWorkspace
  → isOpen3dFabricFurnitureEnabled() === false
  → FeasibilityCanvas sole interactive 2D
  → document selection / pick / draw tools (P03+)
```

### 5.3 Runtime flow (2D mode, flag-ON spike)

```
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
  → FeasibilityCanvas with furniture layer forced OFF
  → FurnitureFabricLayer overlay (Rects; mapper mm↔screen)
  → NOT product dual-CAD; known pan/zoom desync risk
```

### 5.4 Runtime flow (3D mode)

```
viewMode === 3d
  → Lazy3DViewer {...getOpen3dViewerControlProps()}
  → enableControls: true (typed)
  → ThreeViewerInner dynamic OrbitControls
  → data-orbit-enabled=true when constructed
```

### 5.5 Hybrid ban precision (Idiots §4.1)

**Banned:** Simultaneous **interactive** 2D edit ownership by multiple object-stage libraries (Canvas+Konva+Fabric thrash history).

**Not banned:** Canvas interim + Three 3D modes · Fabric furniture spike with Feasibility furniture forced off · SVG export pipeline · admin model-viewer.

### 5.6 Fail-forward only path

```
Fabric destination
    │ failed spike + results/ evidence
    ▼
Konva FULL stage (single engine)
    └── still NO hybrid
```

---

## 6. Task list

### Task 0: Evidence directory, HEAD, run meta, approach record

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/HEAD.txt`
- Create: `results/planner/world-standard-wave/01-engine-lock/run.json`
- Create: `results/planner/world-standard-wave/01-engine-lock/README.md`
- Create: `results/planner/world-standard-wave/01-engine-lock/NOTES.md`
- Read: `Plans/phases/P02-engine-lock/P02-engine-lock.md`, `Plans/Research/RESULTS-MAP.md`, `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`, `Idiots/P02-engine-lock/REPORT.md` §0–1

- [ ] **Step 1: Create evidence root on main checkout only**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-engine-lock" | Out-Null
git rev-parse --show-toplevel
git worktree list
# Expect single worktree at D:\OandO07072026 (or path-equivalent). Do NOT add worktrees.
```

Expected: directory exists; one main worktree.

- [ ] **Step 2: Write `HEAD.txt` with real command output (no placeholders)**

```powershell
cd D:\OandO07072026
git rev-parse HEAD | Out-File -Encoding utf8 results\planner\world-standard-wave\01-engine-lock\HEAD.txt
git status -sb | Out-File -Encoding utf8 -Append results\planner\world-standard-wave\01-engine-lock\HEAD.txt
Get-Content results\planner\world-standard-wave\01-engine-lock\HEAD.txt
```

Expected: file contains 40-char SHA + short branch status.

- [ ] **Step 3: Write `run.json` with real ISO timestamps and head**

Fill after Step 2 (replace `REPLACE_*`):

```json
{
  "phase": "P02-engine-lock",
  "checkpoint": "CP-02",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/01-engine-lock",
  "forbiddenEvidenceNames": ["02-engine-lock"],
  "scope": "engine-lock-confirm-only",
  "approach": "A",
  "worktrees": false,
  "commitAsYouGo": true,
  "productCodeChanges": false,
  "reProveReason": "results/ tree missing on checkout; phase PASS unproven",
  "brainstormer": "Idiots/P02-engine-lock/REPORT.md",
  "implementationPlan": "idiotplanners2/P02-engine-lock/IMPLEMENTATION-PLAN.md",
  "startedAt": "REPLACE_ISO8601",
  "head": "REPLACE_SHA",
  "agentNote": "Re-proving full CP-02 pack from zero. No Fabric cutover. No package upgrades."
}
```

- [ ] **Step 4: Write `README.md` for the evidence pack**

Must state:

1. Goal = **confirm lock**, not implement Fabric cutover.  
2. Approach **A**.  
3. Canonical root = `01-engine-lock` per RESULTS-MAP (never `02-engine-lock`).  
4. Re-prove reason: prior PASS claims unproven because `results/` was missing.  
5. Product code policy: default none.  
6. Open questions list from §2.13 (non-blocking).  
7. Pointer to ENGINE-DECISION research path as **ideas only**.

Template body:

```markdown
# 01-engine-lock — CP-02 evidence pack

**Phase:** P02-engine-lock  
**Goal:** Confirm locked engines (Fabric dest · Feasibility interim · Three+orbit · no hybrid · SKU · BOQ>photoreal).  
**Not goal:** Fabric walls cutover, W3 select, orbit Playwright, package upgrades.

**Approach:** A (Product Journey First) — design APPROVED 2026-07-09.

**Canonical folder:** `results/planner/world-standard-wave/01-engine-lock/`  
**Forbidden:** `02-engine-lock/` as canonical.

**Honesty:** This pack was re-proved because the wave folder was missing on checkout when plan headers claimed PASS.

**Research (ideas only):** `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`
```

- [ ] **Step 5: Write RESULTS-MAP minimum `NOTES.md`**

```markdown
# NOTES — 01-engine-lock (CP-02 floor)

**Date:** (ISO date of write)  
**Agent:** (executor id)  
**Approach:** A  

## Lock (one paragraph)
Fabric.js v7 full stage is 2D destination (`canvas-fabric-stage/`, flag default OFF). FeasibilityCanvas is live interim 2D. Planner 3D is Three + orbit ON via Lazy3DViewer/ThreeViewerInner and `getOpen3dViewerControlProps()`. No Konva+Fabric hybrid. Catalog: manufacturer SKU. Success metric: BOQ/quote > photoreal.

## Research link (ideas only)
`D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` (status may still say PROPOSED until owner sign-off mirrored).

## Richer pack
See ENGINE-LOCK-RECORD, FLAG-INVENTORY, ENTRYPOINT-MAP, PACKAGE-PIN, vitest logs, OWNER-SIGNOFF, ANTI-THRASH-AUDIT, CP-02-SUMMARY in this folder.
```

- [ ] **Step 6: Confirm Approach A in design spec**

Read `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §3 — expect **Owner pick (locked): A**. Quote one line into README.

- [ ] **Step 7: Commit meta scaffold**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-engine-lock/HEAD.txt `
  results/planner/world-standard-wave/01-engine-lock/run.json `
  results/planner/world-standard-wave/01-engine-lock/README.md `
  results/planner/world-standard-wave/01-engine-lock/NOTES.md
git commit -m "docs(p02): scaffold 01-engine-lock evidence root (re-prove CP-02)"
```

**Done when:** Folder exists; HEAD + run.json real; approach A recorded; NOTES present.

---

### Task 1: ENGINE-LOCK-RECORD (decision freeze)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ENGINE-LOCK-RECORD.md`
- Read: phase P02 § Locked stack, Idiots §2–3, design §3–4, live orbitDefaults + fabricFurnitureFlag

- [ ] **Step 1: Write full lock record (no “maybe Konva now” language)**

Required sections and tables:

```markdown
# ENGINE-LOCK-RECORD — CP-02

**Written:** (ISO)  
**Head:** (from HEAD.txt)  
**Supersedes for agent engine choice:** residual Plan A / README “under evaluation” / “hybrid stack” marketing language after CP-02 green on this pack.

## Locked stack

| Layer | Locked choice | Interim / notes | Live path |
|-------|---------------|-----------------|-----------|
| 2D destination | Fabric.js v7 full stage | Flag path; default OFF | `site/features/planner/open3d/canvas-fabric-stage/` · `fabric@7.4.0` |
| 2D live interim | FeasibilityCanvas | Sole interactive 2D when flag OFF | `…/canvas-feasibility/FeasibilityCanvas.tsx` |
| 3D planner | Three + R3F ecosystem + orbit ON | Imperative open3d path primary | `ThreeLazyViewer.tsx` · `ThreeViewerInner.tsx` · `orbitDefaults.ts` |
| Orbit product contract | ON | Workspace spreads `getOpen3dViewerControlProps()` → `{ enableControls: true }` | `OOPlannerWorkspace.tsx` |
| Hybrid | Forbidden | No Konva+Fabric dual interactive | konva absent in package.json |
| Fail-forward | Konva **full** only after failed Fabric spike with `results/` proof | Still no hybrid | — |
| Catalog pattern | Manufacturer SKU (O&O products) | Not 260k generic race | research ENGINE-DECISION |
| Success metric | BOQ/quote path > photoreal | Do not thrash engines for renders | MASTER-CHART / Idiots §7 |
| Admin 3D | model-viewer | Single-asset only | `admin/svg-editor/ModelViewerPreview.tsx` |

## Decisions D1–D14
(copy matrix from plan §2.6)

## Approach A implication
W1–W8 may land on Feasibility first; Fabric remains destination (not insurance, not abandoned).

## Anti-thrash rules 1–13
(short form list from plan §2.11)

## Orbit code truth (2026-07-10)
- `OPEN3D_ORBIT_DEFAULT_ENABLED = true`
- `getOpen3dViewerControlProps(): { enableControls: true }`
- Lazy/Inner default enableControls from that constant
- Workspace call site spreads helper (not omit-only)

## Stale claims inventory (do not re-open engines)
- Phase Task 3 omit-prop sentence → superseded by helper
- WAVE.md “no orbit” if present → stale
- Idiots §10.3 omit-prop line → repo wins

## Explicit non-claims
- Fabric full stage not live
- Select/delete not proven (P03)
- Orbit Playwright not proven (P04)
- Packages commercial hygiene still FIX until Fancyapps/GSAP resolved
```

- [ ] **Step 2: Self-check placeholders**

Scan file for TBD / “maybe” / “under evaluation as open choice” — fix.

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ENGINE-LOCK-RECORD.md
git commit -m "docs(p02): ENGINE-LOCK-RECORD Fabric dest / Feasibility interim / Three orbit"
```

**Done when:** Record has no open engine vote language; includes live orbit helper truth.

---

### Task 2: FLAG-INVENTORY (code truth)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/FLAG-INVENTORY.md`
- Read: `fabricFurnitureFlag.ts`, `OOPlannerWorkspace.tsx` flag branch, `open3d/README.md` limits, Idiots §9

- [ ] **Step 1: Grep consumers (paste real matches into inventory)**

```powershell
cd D:\OandO07072026
rg -n "isOpen3dFabricFurnitureEnabled|NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE|OPEN3D_FABRIC_FURNITURE_ENV" site/features/planner site/tests --glob "*.{ts,tsx,md}"
```

Expected consumers (at minimum):

- `fabricFurnitureFlag.ts`
- `canvas-fabric-stage/index.ts`
- `OOPlannerWorkspace.tsx`
- `furnitureFabricMapper.test.ts`
- `open3d/README.md` (docs)

- [ ] **Step 2: Write FLAG-INVENTORY.md**

Must include:

| Field | Value |
|-------|-------|
| Env name | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` |
| Constant | `OPEN3D_FABRIC_FURNITURE_ENV` |
| Enable rule | exact `=== "1"` only |
| Missing/other | OFF |
| Production default | OFF → Feasibility sole furniture |
| Flag ON | Feasibility furniture forced off + `FurnitureFabricLayer` |
| Not controlling Fabric | `site/features/planner/lib/featureFlags.ts` |
| Local enable only | `.env.local` + restart next dev |

Known flag-ON limits (must list):

1. Separate pointer ownership.  
2. Pan/zoom desync risk.  
3. Fabric symbols as plain Rect — **not** Block2D W2 proof.  
4. W3 select/delete authority = document/Feasibility pick — **not** Fabric object selection.  
5. Dual hit surface if furniture layer not fully gated.  
6. Flag-ON = **migration spike only** (anti-thrash #2).

Local enable block:

```powershell
# repo-root or site .env.local — then restart next dev
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
```

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/FLAG-INVENTORY.md
git commit -m "docs(p02): FLAG-INVENTORY Fabric furniture env exact-1 only"
```

**Done when:** Enable rule is exact-1; consumers listed from real grep; limits honest.

---

### Task 3: ENTRYPOINT-MAP (routes → engines)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ENTRYPOINT-MAP.md`
- Read: three page.tsx files, WorkspaceRoute, Host, NativeHost, OOPlannerWorkspace 2D/3D mounts, orbitDefaults

- [ ] **Step 1: Verify each page import chain by reading files**

Confirm:

| Route | Page | First shell |
|-------|------|-------------|
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | `Open3dPlannerHost` |
| `/planner/guest` | `…/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` |
| `/planner/canvas` | `…/(workspace)/canvas/page.tsx` | `Open3dPlannerWorkspaceRoute` |

- [ ] **Step 2: Write ENTRYPOINT-MAP.md**

Required content:

```markdown
# ENTRYPOINT-MAP — engines by route

## Chain A — /planner/open3d
page.tsx → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace

## Chain B — /planner/guest
page.tsx → Open3dPlannerWorkspaceRoute (Providers + ProjectSetupGate + dynamic Host)
  → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace

## Chain C — /planner/canvas
(same as guest from WorkspaceRoute down)

## Inside OOPlannerWorkspace
| Mode | Component | Condition |
|------|-----------|-----------|
| 2D | FeasibilityCanvas | always in 2D mode |
| 2D optional | FurnitureFabricLayer | flag ON only |
| 3D | Lazy3DViewer | 3D mode |
| 3D props | {...getOpen3dViewerControlProps()} | forces enableControls: true |

## Orbit implementation
ThreeViewerInner dynamic-imports OrbitControls when enableControls true (default OPEN3D_ORBIT_DEFAULT_ENABLED).

## Secondary surfaces
Planner3DViewer = R3F ecosystem, not second product engine vote.
ModelViewerPreview = admin only.
_archive/fabric = not live guest/canvas.

## Absolute path index
(copy tables from plan §1.2 + Idiots §10.4)
```

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ENTRYPOINT-MAP.md
git commit -m "docs(p02): ENTRYPOINT-MAP open3d/guest/canvas host chains"
```

**Done when:** New agent can find every engine file from this map alone.

---

### Task 4: PACKAGE-PIN from live package.json

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/PACKAGE-PIN.md`
- Read: `site/package.json` (exact strings)

- [ ] **Step 1: Extract pins (re-read package.json; do not copy stale numbers from memory)**

```powershell
cd D:\OandO07072026
# Prefer Select-String / rg on site/package.json for:
# fabric, three, @react-three/fiber, @react-three/drei, @google/model-viewer, konva, @fancyapps/ui, gsap
rg -n '"fabric"|"three"|"@react-three|"@google/model-viewer|"konva|"@fancyapps|"gsap' site/package.json
```

Expected (verify live; update if bumped intentionally later):

| Package | Expected string (2026-07-10) |
|---------|------------------------------|
| fabric | `"7.4.0"` exact |
| three | `"^0.185.1"` |
| @react-three/fiber | `"^9.6.1"` |
| @react-three/drei | `"^10.7.7"` |
| @google/model-viewer | `"^4.3.1"` |
| konva / react-konva | absent |

- [ ] **Step 2: Write PACKAGE-PIN.md**

```markdown
# PACKAGE-PIN — engine stack

**Source:** `site/package.json`  
**Rule:** No upgrades/downgrades in P02. If versions differ later, update this pin — do not thrash engines.

| Package | package.json string | Role | License claim (expert) |
|---------|---------------------|------|------------------------|
| fabric | 7.4.0 | 2D destination | MIT |
| three | ^0.185.1 | 3D | MIT |
| @react-three/fiber | ^9.6.1 | R3F | MIT |
| @react-three/drei | ^10.7.7 | helpers | MIT |
| @google/model-viewer | ^4.3.1 | admin only | Apache-2.0 |

## Hybrid ban check
konva / react-konva: **absent** from site/package.json (correct).

## Not engine pins (hygiene)
See LICENSE-HYGIENE-NOTE.md for Fancyapps + GSAP.
```

- [ ] **Step 3: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/PACKAGE-PIN.md
git commit -m "docs(p02): PACKAGE-PIN fabric 7.4.0 + three/r3f/drei from site/package.json"
```

**Done when:** Pins match live package.json; konva absence asserted.

---

### Task 4b: LICENSE-HYGIENE-NOTE (packages FIX — not engine re-vote)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/LICENSE-HYGIENE-NOTE.md`
- Read: `Plans/phases/P02-engine-lock/05-packages-stack.md`, `Plans/Research/Others/17-LICENSES-CLEARED.md`, Idiots §5

- [ ] **Step 1: Write hygiene note (no purchase, no product code)**

```markdown
# LICENSE-HYGIENE-NOTE — packages expert FIX (P02)

**Verdict:** Engine lock path MIT-aligned. Packages **SHIP** is **not** claimed by CP-02 alone.

| Item | Status | Action (owner) |
|------|--------|----------------|
| @fancyapps/ui ^6.1.14 | Proprietary; likely unused | Remove preferred OR clear+license — **ask before purchase** |
| gsap / @gsap/react | Standard free-use; used in marketing scroll | Owner acceptance row in 17-LICENSES-CLEARED |
| GSAP Club plugins | Paid | Do not add without owner ask |
| Competitor assets | Forbidden | Keep D:\websites out of site/ |

**Does not block:** Approach A planning, unit re-runs, engine decision record.  
**Does block:** Language “all packages SHIP / fully cleared” until Fancyapps/GSAP resolved.
```

- [ ] **Step 2: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/LICENSE-HYGIENE-NOTE.md
git commit -m "docs(p02): license hygiene note Fancyapps/GSAP pending (packages FIX)"
```

**Done when:** Note exists; no agent purchase; no false SHIP claim.

---

### Task 5: Re-run Fabric flag + mapper unit suite (TDD-style verify)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-raw.log`
- Create: `results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-run.json`
- Test: `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts`
- Product: **no edits** unless FAIL proves lock regression

This phase does **not** write new product code first. Existing tests are the lock contract. Run them; expect PASS; preserve raw log.

- [ ] **Step 1: Confirm test contract covers flag cases (read file — do not rewrite)**

Required cases already present:

```typescript
// furnitureFabricMapper.test.ts — flag suite (abbreviated; file is source of truth)
describe("isOpen3dFabricFurnitureEnabled", () => {
  it("exports OPEN3D_FABRIC_FURNITURE_ENV as the public Next env key", () => {
    expect(OPEN3D_FABRIC_FURNITURE_ENV).toBe("NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE");
  });

  it("is false by default and for non-1 values", () => {
    expect(isOpen3dFabricFurnitureEnabled({})).toBe(false);
    expect(isOpen3dFabricFurnitureEnabled({ [OPEN3D_FABRIC_FURNITURE_ENV]: "0" })).toBe(false);
    expect(isOpen3dFabricFurnitureEnabled({ [OPEN3D_FABRIC_FURNITURE_ENV]: "true" })).toBe(false);
  });

  it("is true only when env is exactly 1", () => {
    expect(isOpen3dFabricFurnitureEnabled({ [OPEN3D_FABRIC_FURNITURE_ENV]: "1" })).toBe(true);
  });
  // near-miss values, wrong keys, barrel re-export — also present
});
```

- [ ] **Step 2: Run vitest with package-relative path; tee absolute log**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-engine-lock" | Out-Null
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log"
echo "EXIT=$LASTEXITCODE"
```

**Critical:** CWD is `site/`. Path is `tests/unit/...` — **not** `site/tests/unit/...`.

Expected: EXIT=0; all tests pass (mapper + flag suites). Count from log — do not invent.

- [ ] **Step 3: If FAIL — stop, file Failures.md, minimal fix only**

Do **not**:

- Delete the flag  
- Invent a second env reader in `featureFlags.ts`  
- Disable tests  
- Claim green with partial log  

If FAIL is real regression: fix minimal production code under canvas-fabric-stage only; re-run; document in run.json `productCodeChanges: true` with reason.

- [ ] **Step 4: Write vitest-fabric-flag-run.json with real counts**

```json
{
  "command": "pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose",
  "cwd": "D:\\OandO07072026\\site",
  "testFile": "tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts",
  "exitCode": 0,
  "passed": "REPLACE_FROM_LOG",
  "failed": 0,
  "timestamp": "REPLACE_ISO8601",
  "log": "results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-raw.log",
  "covers": [
    "flag OFF missing",
    "flag non-1",
    "flag exact 1",
    "mapper mm round-trip",
    "barrel re-export"
  ]
}
```

- [ ] **Step 5: Commit logs**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-raw.log `
  results/planner/world-standard-wave/01-engine-lock/vitest-fabric-flag-run.json
git commit -m "test(p02): re-run fabric flag/mapper vitest under 01-engine-lock"
```

**Done when:** Raw log preserved; exit 0 or honest fail filed; no log filtering.

---

### Task 5b: Re-run orbit default unit suite

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-raw.log`
- Create: `results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-run.json`
- Test: `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx`
- Product: **no edits** unless FAIL

- [ ] **Step 1: Confirm contract (read — do not rewrite unless FAIL)**

Existing tests assert:

```typescript
expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
expect(getOpen3dViewerControlProps()).toEqual({ enableControls: true });
// ThreeViewerInner default constructs OrbitControls + data-orbit-enabled=true
// enableControls={false} does not construct OrbitControls
// normalizeDegrees keeps furniture rotation in degrees
```

- [ ] **Step 2: Run vitest**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 | Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\01-engine-lock\vitest-orbit-default-raw.log"
echo "EXIT=$LASTEXITCODE"
```

Expected: EXIT=0.

- [ ] **Step 3: Write vitest-orbit-default-run.json**

```json
{
  "command": "pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose",
  "cwd": "D:\\OandO07072026\\site",
  "testFile": "tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx",
  "exitCode": 0,
  "passed": "REPLACE_FROM_LOG",
  "failed": 0,
  "timestamp": "REPLACE_ISO8601",
  "log": "results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-raw.log",
  "covers": [
    "OPEN3D_ORBIT_DEFAULT_ENABLED true",
    "getOpen3dViewerControlProps enableControls true",
    "OrbitControls construct default ON",
    "data-orbit-enabled",
    "opt-out false path",
    "normalizeDegrees degrees contract"
  ]
}
```

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-raw.log `
  results/planner/world-standard-wave/01-engine-lock/vitest-orbit-default-run.json
git commit -m "test(p02): re-run orbit default vitest under 01-engine-lock"
```

**Done when:** Orbit lock re-proven in evidence; raw log full.

---

### Task 6: OWNER-SIGNOFF (or written deferral)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF.md` **only** (never `OWNER-SIGN OFF.md`)
- Present checkboxes to owner in chat/handover

- [ ] **Step 1: Write OWNER-SIGNOFF.md template with unchecked boxes + deferral section**

```markdown
# OWNER-SIGNOFF — CP-02 Engine lock

**File rule:** This is the only sign-off filename (no spaces).  
**Date presented:** (ISO)  
**Head:** (from HEAD.txt)

## Engine lock

- [ ] Owner approves **Fabric.js v7 full stage** as 2D **destination**
- [ ] Owner approves **FeasibilityCanvas** as 2D **interim** under Approach A
- [ ] Owner approves **Three + orbit ON** as planner 3D (including product helper force-true)
- [ ] Owner approves **no Konva + Fabric hybrid**
- [ ] Owner approves fail-forward: Konva **full** only after failed Fabric spike with evidence
- [ ] Owner approves Fabric furniture flag remains **default OFF** until explicit cutover work

## Product strategy (engine-adjacent)

- [ ] Owner approves manufacturer SKU catalog strategy (O&O products)
- [ ] Owner approves success metric **BOQ/quote path > photoreal**
- [ ] Owner confirms Approach **A** (or writes B/C override below)

## Process

- [ ] Owner unlocks later phases (P03+) for **implementation** after CP-02 (or continues plan-only explicitly)
- [ ] Owner acknowledges anti-thrash rules bind agents without re-litigation

## Owner override / approach change
(none | paste text)

## Deferral (if owner silent or partial)

If owner has not marked boxes, do **not** claim CP-02 green for execution waves.

```text
DEFERRED: Owner has not completed engine checkboxes as of <ISO>.
Approach A remains default for **planning**.
Agents must not claim "CP-02 PASS" or "engines locked forever" on this checkout until boxes or explicit written waiver exist.
Plan-only continue is NOT the same as CP-02 green.
```

## Agent presentation checklist

- Linked ENGINE-LOCK-RECORD.md
- Linked FLAG-INVENTORY.md
- Linked PACKAGE-PIN.md
- Stated re-prove reason (results missing)
```

- [ ] **Step 2: Present to owner**

In handover message: list boxes + paths + re-prove honesty. Wait for marks or explicit deferral text.

- [ ] **Step 3: Mirror marks or write DEFERRED**

If owner marks: update checkboxes to `[x]` with date.  
If owner silent and work must continue plan-only: leave boxes unchecked and fill **Deferral** section with real date — **do not** check CP-02.6 green.

- [ ] **Step 4: Optional research status patch (only after owner approves)**

If owner fully signs engines: optional one-line note that ENGINE-DECISION research file still may say PROPOSED — patching research is **out of site/** and optional; evidence OWNER-SIGNOFF is authority for agents.

- [ ] **Step 5: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF.md
git commit -m "docs(p02): OWNER-SIGNOFF engine lock boxes or written deferral"
```

**Done when:** File exists with marks **or** explicit deferral; no dual filenames.

---

### Task 7: ANTI-THRASH-AUDIT (read-only greps)

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/ANTI-THRASH-AUDIT.md`
- Grep only; no mass docs rewrite

- [ ] **Step 1: Grep interactive 2D libs in planner**

```powershell
cd D:\OandO07072026
rg -n "konva|react-konva|pixi|paper\.js|babylon" site/features/planner site/package.json --glob "*.{ts,tsx,json,md}" 
```

Record hits. Expected: no product konva dependency; any mention should be ban/docs only.

- [ ] **Step 2: Grep thrash language (list for later docs pass)**

```powershell
rg -n -i "insurance|under evaluation|hybrid" site/features/planner/open3d Plans/phases/P02-engine-lock --glob "*.{ts,tsx,md}"
```

List files; **do not** mass-rewrite. ENGINE-LOCK-RECORD supersedes for agent thrash after CP-02.

- [ ] **Step 3: Confirm workspace does not import archive fabric**

```powershell
rg -n "_archive/fabric|planner/_archive" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: no production import of archive path.

- [ ] **Step 4: Confirm orbit not hard-off at product mount**

```powershell
rg -n "enableControls|getOpen3dViewerControlProps|Lazy3DViewer" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
rg -n "OPEN3D_ORBIT_DEFAULT_ENABLED" site/features/planner/open3d/3d
```

Expected: helper spread; defaults true; no `enableControls={false}` at product call site.

- [ ] **Step 5: Write ANTI-THRASH-AUDIT.md**

```markdown
# ANTI-THRASH-AUDIT — CP-02

**Date:** (ISO)  
**Head:** (SHA)

## Grep: second interactive 2D libs
(command + results)

## Grep: residual thrash language
(command + file list for later docs pass — not mass rewrite)

## Archive boundary
OOPlannerWorkspace imports archive fabric? (yes/no + proof)

## Orbit default
OPEN3D_ORBIT_DEFAULT_ENABLED = ?  
Workspace call site = getOpen3dViewerControlProps / enableControls false?  

## package.json konva
Absent? (yes/no)

## Conclusion
P03+ must not reopen engine choice without owner written override.

## Violations
(none | Failures.md entries)
```

- [ ] **Step 6: If violation found, file Failures.md**

Honest stop — do not greenwash.

- [ ] **Step 7: Commit**

```powershell
git add results/planner/world-standard-wave/01-engine-lock/ANTI-THRASH-AUDIT.md
git commit -m "docs(p02): ANTI-THRASH-AUDIT greps for hybrid/insurance/konva/orbit"
```

**Done when:** Greps + conclusions filed; thrash language listed not mass-rewritten.

---

### Task 8: CP-02-SUMMARY + phase exit check

**Files:**
- Create: `results/planner/world-standard-wave/01-engine-lock/CP-02-SUMMARY.md`
- Update: `run.json` with `finishedAt` if desired
- Optional: correct phase status table only after files exist

- [ ] **Step 1: List artifacts present**

```powershell
Get-ChildItem D:\OandO07072026\results\planner\world-standard-wave\01-engine-lock | Select-Object Name
```

Required presence:

| Artifact | Required |
|----------|----------|
| HEAD.txt | yes |
| run.json | yes |
| README.md | yes |
| NOTES.md | yes (map min) |
| ENGINE-LOCK-RECORD.md | yes |
| FLAG-INVENTORY.md | yes |
| ENTRYPOINT-MAP.md | yes |
| PACKAGE-PIN.md | yes |
| LICENSE-HYGIENE-NOTE.md | yes (this plan) |
| vitest-fabric-flag-raw.log + run.json | yes |
| vitest-orbit-default-raw.log + run.json | yes (this plan raised bar) |
| OWNER-SIGNOFF.md | yes (marks or deferral) |
| ANTI-THRASH-AUDIT.md | yes |
| CP-02-SUMMARY.md | this task |

- [ ] **Step 2: Write CP-02-SUMMARY.md**

```markdown
# CP-02-SUMMARY — Engine lock

**Date:** (ISO)  
**Head:** (SHA)  
**Evidence:** `results/planner/world-standard-wave/01-engine-lock/`

## One-paragraph honest status
Engines locked in writing: Fabric.js v7 destination (flag OFF default), FeasibilityCanvas interim live 2D, Three + orbit ON (product helper force-true). No hybrid. Fabric not fully cut over (expected). Approach A. Packages commercial hygiene still FIX (Fancyapps/GSAP). Re-proved because results/ was missing on this checkout.

## CP-02 criteria

| # | Requirement | Proof path | Status |
|---|-------------|------------|--------|
| CP-02.1 | Locked stack written | ENGINE-LOCK-RECORD.md | PASS/FAIL |
| CP-02.2 | Flag inventory | FLAG-INVENTORY.md + fabricFurnitureFlag.ts | PASS/FAIL |
| CP-02.3 | Entrypoint map | ENTRYPOINT-MAP.md | PASS/FAIL |
| CP-02.4 | Package pins | PACKAGE-PIN.md | PASS/FAIL |
| CP-02.5 | Fabric flag unit re-run | vitest-fabric-flag-* | PASS/FAIL |
| CP-02.6 | Owner boxes or deferral | OWNER-SIGNOFF.md | PASS / DEFERRED |
| CP-02.7 | Anti-thrash audit | ANTI-THRASH-AUDIT.md | PASS/FAIL |
| CP-02.8 | Summary → P03 | this file | PASS/FAIL |

**Orbit unit re-run (plan raised bar):** vitest-orbit-default-* — PASS/FAIL  
**Packages SHIP:** NOT claimed (LICENSE-HYGIENE-NOTE)

## Next phase
`Plans/phases/P03-select-delete/` — W3 select/delete on Feasibility with flag OFF.  
Do not execute P03 product code until CP-02 green **or** owner written waiver.

## Forbidden claims after this pack
- Fabric full stage live
- Select/delete done
- Orbit Playwright done
- Product self-score jumped solely from package install
```

- [ ] **Step 3: Gate honesty**

If OWNER-SIGNOFF is DEFERRED: CP-02 overall is **not** execution-green. State **DEFERRED / plan-only** explicitly.

If all criteria PASS including owner marks: CP-02 **green for this checkout** — unlock P03 product work.

- [ ] **Step 4: Final commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-engine-lock/
git commit -m "docs(p02): CP-02-SUMMARY complete 01-engine-lock re-prove pack"
```

- [ ] **Step 5: Push/mirror when landable (agent call per AGENTS.md)**

Push `main` to origin when green enough not to strand remote. Mayoite mirror if ~45m work / big land.

**Done when:** Summary exists; criteria table filled from real files; next phase pointer clear.

---

## 7. Test matrix

| ID | Layer | Command / action | Expected | Evidence |
|----|-------|------------------|----------|----------|
| T-F1 | Unit | vitest furnitureFabricMapper.test.ts | exit 0; flag OFF/non-1/1 + mapper | vitest-fabric-flag-* |
| T-O1 | Unit | vitest orbitControlsDefault.test.tsx | exit 0; default ON + helper + construct | vitest-orbit-default-* |
| T-G1 | Grep | konva/pixi in planner product path | no product konva dep | ANTI-THRASH-AUDIT |
| T-G2 | Grep | isOpen3dFabricFurnitureEnabled consumers | known set | FLAG-INVENTORY |
| T-R1 | Read | package.json pins | fabric 7.4.0 exact; three/r3f/drei carets | PACKAGE-PIN |
| T-R2 | Read | host chains | WorkspaceRoute on guest/canvas | ENTRYPOINT-MAP |
| T-R3 | Read | OOPlannerWorkspace 3D | getOpen3dViewerControlProps spread | ENGINE-LOCK-RECORD |
| T-B1 | Browser | **None required for CP-02** | — | P04/P07 |

**Not in matrix (false green if claimed):** Playwright select · flag-ON dual mode as product · archive fabric routes.

---

## 8. False-green catalog

| ID | Trap | Why false green | Plan block |
|----|------|-----------------|------------|
| FG-01 | Plan header PASS without folder | Status theater | Re-prove Tasks 0–8 |
| FG-02 | Create `02-engine-lock/` | Wrong map | Ban; RESULTS-MAP |
| FG-03 | NOTES.md only, skip rich pack | Map min ≠ phase done | Task 8 list |
| FG-04 | Vitest path `site/tests/...` from site CWD | Command fails / empty | package-relative path |
| FG-05 | Truncated/filtered log | testing-handbook zero suppression | Tee full raw log |
| FG-06 | Flag-ON for W proofs | Dual pointer; wrong surface | FLAG inventory + later phase bind |
| FG-07 | Delete fabric stage “unused” | Abandons destination | Anti-thrash 5–6 |
| FG-08 | Orbit off for CI | Product 3D dead | Orbit unit + rules |
| FG-09 | Packages SHIP with Fancyapps pending | License dishonesty | LICENSE-HYGIENE-NOTE |
| FG-10 | Plan-only continue = CP PASS | C10 | OWNER-SIGNOFF deferral language |
| FG-11 | “We use Fabric for 2D” marketing | Flag OFF interim truth | ENGINE-LOCK-RECORD language |
| FG-12 | Photoreal needs engine swap | Metric thrash | D12 + anti-thrash 10 |
| FG-13 | Competitor asset import | Ethics fail | Ethics section |
| FG-14 | Unit-only claim for product W gates | Wrong phase | Summary non-claims |
| FG-15 | Omit-prop orbit lock only | Stale vs helper | Document helper |

---

## 9. Stop-if-fail / CP criteria

### Hard stops

| Condition | Action |
|-----------|--------|
| Vitest fabric flag FAIL | Stop; Failures.md; minimal fix; re-run; no green |
| Vitest orbit FAIL | Stop; same |
| Konva added to package.json “to try” | Reject; reverse |
| Product Fabric cutover started in P02 | Out of scope; stop |
| Owner silent + claim CP PASS | Forbidden; use DEFERRED |
| Evidence under site/results/ | Redirect to root results/ |
| Worktree created | Abort; use main checkout |

### Checkpoint CP-02 table

| # | Requirement | Proof path |
|---|-------------|------------|
| CP-02.1 | Locked stack written | `…/01-engine-lock/ENGINE-LOCK-RECORD.md` |
| CP-02.2 | Flag location + enable rule | `…/FLAG-INVENTORY.md` + `fabricFurnitureFlag.ts` |
| CP-02.3 | Entrypoint map open3d/guest/canvas | `…/ENTRYPOINT-MAP.md` |
| CP-02.4 | Package pins | `…/PACKAGE-PIN.md` |
| CP-02.5 | Fabric flag unit re-run | vitest-fabric-flag-raw.log + run.json |
| CP-02.6 | Owner boxes or deferral | `…/OWNER-SIGNOFF.md` |
| CP-02.7 | Anti-thrash audit | `…/ANTI-THRASH-AUDIT.md` |
| CP-02.8 | Summary → P03 | `…/CP-02-SUMMARY.md` |

**Raised bar (this plan):** orbit unit re-run + LICENSE-HYGIENE-NOTE + NOTES.md map min.

**Hard stop before P03 product:** CP-02 green **or** owner explicit written waiver.

---

## 10. Commit sequence

| Commit | After task | Message pattern |
|--------|------------|-----------------|
| 1 | 0 | `docs(p02): scaffold 01-engine-lock evidence root (re-prove CP-02)` |
| 2 | 1 | `docs(p02): ENGINE-LOCK-RECORD Fabric dest / Feasibility interim / Three orbit` |
| 3 | 2 | `docs(p02): FLAG-INVENTORY Fabric furniture env exact-1 only` |
| 4 | 3 | `docs(p02): ENTRYPOINT-MAP open3d/guest/canvas host chains` |
| 5 | 4 | `docs(p02): PACKAGE-PIN fabric 7.4.0 + three/r3f/drei` |
| 6 | 4b | `docs(p02): license hygiene note Fancyapps/GSAP pending` |
| 7 | 5 | `test(p02): re-run fabric flag/mapper vitest under 01-engine-lock` |
| 8 | 5b | `test(p02): re-run orbit default vitest under 01-engine-lock` |
| 9 | 6 | `docs(p02): OWNER-SIGNOFF engine lock boxes or written deferral` |
| 10 | 7 | `docs(p02): ANTI-THRASH-AUDIT greps` |
| 11 | 8 | `docs(p02): CP-02-SUMMARY complete 01-engine-lock re-prove pack` |

Frequent commits; landable slices; no force-push.

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation |
|------|----------|------------|
| Status theater (PASS without disk) | Critical | Re-prove; evidence existence = green |
| Owner silent blur with PASS | High | DEFERRED language mandatory |
| Packages FIX ignored → fake SHIP | Medium | LICENSE-HYGIENE-NOTE |
| Stale omit-prop docs thrash | Medium | ENGINE-LOCK-RECORD helper truth |
| Permanent interim / never Fabric cutover | Medium | Destination + keep stage; cutover after W (Idiots §14) |
| Fail-forward without criteria | Medium | Record open Q; only after spike evidence |
| Folder-name thrash `02-engine-lock` | High | RESULTS-MAP ban |
| Photoreal metric thrash | High | D12 + anti-thrash 10 |
| Agent purchases Fancyapps | Hard stop | Ask owner; never agent buy |
| Mid-gate R3F rewrite | High | Explicit ban; P04 stays imperative Three |

### Owner decisions required

1. Engine checkboxes (Task 6).  
2. Approach A confirm or B/C override.  
3. Fancyapps remove vs clear.  
4. GSAP acceptance row.  
5. When to start Fabric walls cutover after W (later).

---

## 12. Self-review vs brainstormer + repo

### Repo coverage

| Repo item | Task |
|-----------|------|
| Missing results/ re-prove | 0–8 |
| fabricFurnitureFlag exact-1 | 2, 5 |
| FeasibilityCanvas live | 1, 3 |
| canvas-fabric-stage keep | 1, 7 |
| getOpen3dViewerControlProps | 1, 3, 5b |
| Host chains + WorkspaceRoute | 3 |
| package pins | 4 |
| konva absent | 4, 7 |
| unit tests re-run | 5, 5b |
| archive boundary | 3, 7 |
| RESULTS-MAP folder name | 0, 8 |

### Brainstormer (Idiots) coverage

| Idiots theme | Task / section |
|--------------|----------------|
| §0.5 missing results honesty | Goal + Task 0 |
| Fabric dest / Feasibility interim / Three orbit | Task 1 |
| Hybrid ban / AP catalog | Task 7 + §8 |
| Packages FIX Fancyapps/GSAP | Task 4b |
| BOQ > photoreal | Task 1 D12 |
| What P02 does not prove | Task 8 non-claims |
| Flag inventory | Task 2 |
| Host chains | Task 3 |
| Raised bar | Tasks 5b, 4b, NOTES |
| Binding later phases | §13 appendix |
| Ethics non-copy | §3 |
| Cutover approaches | Open Q + appendix |
| C1–C10 critiques | absorbed §2.15 |

### Placeholder scan

No TBD steps. Full artifact templates. Full commands. Full expected paths. Types/helpers used (`isOpen3dFabricFurnitureEnabled`, `getOpen3dViewerControlProps`) defined in repo and quoted.

### Length honesty

Plan is long because: re-prove full pack + raised orbit bar + license hygiene + Idiots failure modes + complete templates. Not padded ceremony.

---

## 13. Appendices

### Appendix A — Type / signature catalog (engine lock)

```typescript
// fabricFurnitureFlag.ts
export const OPEN3D_FABRIC_FURNITURE_ENV = "NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" as const;
export function isOpen3dFabricFurnitureEnabled(
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>,
): boolean;

// orbitDefaults.ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
export function getOpen3dViewerControlProps(): { enableControls: true };

// Lazy3DViewerProps (relevant)
enableControls?: boolean; // default OPEN3D_ORBIT_DEFAULT_ENABLED
```

### Appendix B — Research translation table (ideas → O&O)

| Research idea | O&O translation | Product paste? |
|---------------|-----------------|----------------|
| P5D 2D+3D split | Feasibility/Fabric + Three modes | No |
| RoomSketcher measure | Later snap/dimension quality | No UI clone |
| IKEA SKU → cart | Manufacturer SKU + BOQ metric | No brands |
| Homestyler photoreal | Defer; not success metric | No |
| ENGINE-DECISION PROPOSED | OWNER-SIGNOFF | No code from research |

### Appendix C — Binding stub for later phase headers

```
ENGINE LOCK (CP-02): Feasibility interim 2D · Fabric v7 destination · Three+orbit · no hybrid · BOQ>photoreal · flag OFF for W proofs
Authority: results/planner/world-standard-wave/01-engine-lock/ENGINE-LOCK-RECORD.md
Re-open engines: owner written override only
```

### Appendix D — PR self-gate after CP-02 (Idiots §12.3)

1. Adds konva/pixi/babylon for interactive 2D? → Reject  
2. Disables orbit default? → Reject  
3. Deletes canvas-fabric-stage? → Reject  
4. Enables Fabric flag in W proof CI? → Reject  
5. Imports `_archive/fabric`? → Reject  
6. Photoreal needs engine change? → Reject  
7. Invents `02-engine-lock`? → Reject  
8. Pastes D:\websites assets? → Reject  

### Appendix E — Cutover approaches (post-W; not P02 execute)

| Approach | Summary | When |
|----------|---------|------|
| Cutover-1 Big bang | Freeze Feasibility tools → Fabric walls/furniture/select → flip default | After W green + spike |
| Cutover-2 Layered (recommended by Idiots) | Furniture → openings → walls; keep document constant | Preferred risk control |
| Do nothing forever | Permanent interim | Rejects destination lock — owner only |

### Appendix F — Artifact checklist (quick)

```
results/planner/world-standard-wave/01-engine-lock/
  HEAD.txt
  run.json
  README.md
  NOTES.md
  ENGINE-LOCK-RECORD.md
  FLAG-INVENTORY.md
  ENTRYPOINT-MAP.md
  PACKAGE-PIN.md
  LICENSE-HYGIENE-NOTE.md
  vitest-fabric-flag-raw.log
  vitest-fabric-flag-run.json
  vitest-orbit-default-raw.log
  vitest-orbit-default-run.json
  OWNER-SIGNOFF.md
  ANTI-THRASH-AUDIT.md
  CP-02-SUMMARY.md
```

### Appendix G — Commands cheat sheet

```powershell
# Evidence root
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\01-engine-lock"

# Fabric flag suite
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose

# Orbit suite
pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose

# Greps
Set-Location D:\OandO07072026
rg -n "isOpen3dFabricFurnitureEnabled|NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE" site/features/planner site/tests
rg -n "konva|react-konva" site/package.json site/features/planner
```

### Appendix H — Phase binding matrix (Idiots §3.7 / §12)

| Phase | Fabric dest | Feasibility interim | Three orbit |
|-------|-------------|---------------------|-------------|
| P03 W3 | Flag OFF; not selection authority | Select/delete here | N/A |
| P04 W4 | No thrash | Document pose | Prove orbit + continuity |
| P05 W2 | Flag-ON ≠ W2 | Block2D authority | N/A |
| P06 | Persist document not Fabric JSON | IDB document | Rebuild from document |
| P07 | Flag OFF browser pack | Draw/place here | Toggle 3D optional |
| P08 | N/A | N/A | Mesh content not engine swap |
| P09 | No engine swap for labels | Tools map | N/A |
| P10 | Re-verify 01-engine-lock present | — | — |

### Appendix I — Language blocklist (Idiots §13.4)

| Blocked | Replace with |
|---------|--------------|
| Fabric is insurance | Fabric is destination (flag path preserved) |
| Hybrid production stack | Feasibility interim + Fabric destination (not dual interactive) |
| Under evaluation Konva/Fabric | Locked Fabric dest; fail-forward Konva full only |
| No orbit controls | Stale; code default ON — verify |
| Photoreal priority | BOQ/quote priority |

---

## Execution handoff

**Plan complete and saved to `idiotplanners2/P02-engine-lock/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

Executor brief seed:

```
/using-superpowers
ENGINE LOCK re-prove — do not re-pick engines.
2D interim: FeasibilityCanvas
2D dest: Fabric v7 (flag OFF for W proofs)
3D: Three/orbit ON via getOpen3dViewerControlProps
Evidence only: results/planner/world-standard-wave/01-engine-lock/
Never: 02-engine-lock/, product cutover, package upgrades, Idiots2 as input
Input plan: idiotplanners2/P02-engine-lock/IMPLEMENTATION-PLAN.md
```
