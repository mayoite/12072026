# P04 Orbit Continuity (W4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** A facilities buyer on open3d (`/planner/guest` or `/planner/open3d`) can place furniture in 2D, switch to 3D with **OrbitControls ON by default**, left-drag orbit without crash, round-trip **3D → 2D → 3D** with **same entity ids / mm position / document rotation**, leave a **clean console**, and leave **proof under** `results/planner/world-standard-wave/04-orbit-continuity/` — not a paper PASS.

**Architecture:** View mode is chrome only. Sole pose authority is `Open3dProject` (UUID furniture/walls, position mm, furniture rotation **degrees**). 2D (`FeasibilityCanvas`) and 3D (`Lazy3DViewer` → `ThreeViewerInner`) both read the same document. 3D rebuilds via pure `buildOpen3dSceneNodes` (document degrees → node radians) → `createSceneObjectFromNode` (mesh `rotation.y = -node.rotation` intentional). Orbit is three-layer: (1) Lazy+Inner defaults ON, (2) workspace **must** pass `getOpen3dViewerControlProps()` / `enableControls={true}`, (3) unit construct-spy + `data-orbit-enabled` + Playwright left-drag + artifacts. Stay **imperative Three** — no R3F rewrite of open3d mid-W4.

**Tech Stack:** Next.js open3d workspace · React · Three.js · `three/examples/jsm/controls/OrbitControls.js` · Vitest · Playwright · repo-root `results/` evidence only · pnpm from monorepo root / `site/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — workspace dirty tree honesty (plan does not require clean tree to start); key paths in § Repo reality
- Brainstormer: `Idiots2/P04-orbit-continuity/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P04-orbit-continuity/` (execute card + expert passes)
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W4
- Evidence map: `Plans/Research/RESULTS-MAP.md` → `04-orbit-continuity/`

**Done when:**
1. Layers 1–2 locked in code (defaults + explicit workspace wiring).
2. Unit green for pose continuity (incl. double rebuild) **and** orbit construct/`data-orbit-enabled` **with logs** under `results/planner/world-standard-wave/04-orbit-continuity/`.
3. Browser green: Playwright `open3d-w4-orbit-continuity.spec.ts` green with PNGs + `browser-run.json` + console honesty **or** owner-written browser deferral in NOTES (never silent “works”).
4. CP-04 checkboxes honest; no claim from phase header alone.
5. No competitor assets; no J4 selectors; no furniture document→radians thrash; no R3F port.

**Evidence folder:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**Create on execute; re-prove if missing.** (2026-07-10 repo scan: **entire `results/planner/world-standard-wave/` tree absent** — phase header “PASS 2026-07-09” is **paper until re-run**.)

**Canonical plan path:** `plans1/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality (live 2026-07-10)

### 1.1 What actually exists (product)

| Path | Live fact |
|------|-----------|
| `site/features/planner/open3d/3d/orbitDefaults.ts` | `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; `getOpen3dViewerControlProps(): { enableControls: true }` |
| `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | `Lazy3DViewer`; default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`; `data-testid="planner-3d-canvas"` on **div**; re-exports helper |
| `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Default enableControls ON; dynamic import OrbitControls; damping `0.08`; `maxPolarAngle = π/2 - 0.05`; min/max distance 1/40; `data-testid="three-viewer-container"` + `data-orbit-enabled={orbitEnabled ? "true" : "false"}`; rebuild from `buildOpen3dSceneNodes` |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `viewMode` `"2d"\|"3d"`; 3D branch: `<Lazy3DViewer projectData={workspaceCanvas.project} {...getOpen3dViewerControlProps()} />` — **layer 2 closed in code** |
| `site/features/planner/open3d/editor/TopBar.tsx` | `role="radiogroup"` + radios labeled **2D** / **3D** |
| `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` | Pure adapter; furniture `rotation: degreesToRadians(item.rotation)` |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | `rotation.y = -node.rotation`; `userData.entityId` |
| `site/features/planner/open3d/model/units.ts` | `normalizeDegrees`; `degreesToRadians` — document = degrees |

### 1.2 What actually exists (tests)

| Path | Live fact |
|------|-----------|
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Helper true; construct spy; attribute true/false (**note `.tsx` not `.ts`**) |
| `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | Double rebuild + document degrees 90 → node rad; document immutable after rebuild |
| `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts` | Place wall+furniture modular; rebuild after pose update; degrees→radians |
| `site/tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts` | Adapter unit suite |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | Mesh factory suite |
| `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | Guest place 4 seats → 3D orbit attr → 2D count → 3D again; writes evidence under `04-orbit-continuity/` |
| `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` | Manifest gate **W4** → `open3d-w4-orbit-continuity.spec.ts` |
| `site/config/build/playwright-open3d-world-specs.json` | Pack lists W4 spec |

### 1.3 What is missing / contradictory

| Claim | Reality on disk | Plan action |
|-------|-----------------|-------------|
| Phase header W4 **PASS** + `THREE-LAYER-AUDIT.md` | **No** `results/planner/world-standard-wave/` tree | Re-prove; never inherit PASS |
| Early phase architecture “document + nodes = radians” | Live document = **degrees**; nodes = radians | Tests assert conversion; **do not** rewrite document |
| Expert `03-r3f-3d.md` path truth “no data-orbit / omit enable” | **Stale vs live code** — attribute + helper wiring present | Trust **live files** over expert baseline dated 2026-07-09 |
| Full double-rebuild deep-equal matrix (C1–C6 from brainstormer) | Partially covered across two unit files | Harden `poseContinuityW4.test.ts` to full matrix if any case missing |
| Workspace wiring **unit** (Lazy3DViewer receives enableControls true) | Helper tested; workspace file not unit-asserted | Add pure/source or RTL smoke if risk of silent omit returns |
| Evidence artifacts (vitest logs, PNGs, browser-run.json) | **Absent** | Task 00 + capture commands mandatory |

### 1.4 Do not touch (W4 non-goals / thrash ban)

- `site/features/planner/3d/Planner3DViewer.tsx` (legacy R3F) as W4 proof path  
- Rewrite `planner-j4-3d-parity.spec.ts` as open3d proof  
- Fabric full-stage cutover  
- Walk / first-person / auto-rotate product  
- Camera bookmark across modes  
- Mesh toe/photoreal (P08)  
- Save honesty labels (P06)  
- Select/delete redesign (P03) beyond needing placed furniture for browser  

### 1.5 HEAD / tree honesty

Record at execute start:

```powershell
cd .
git rev-parse HEAD
git status -sb
```

Paste into `04-orbit-continuity/NOTES.md`. Dirty tree is allowed; do not invent SHA.

---

## 2. Brainstormer synthesis (`Idiots2/P04-orbit-continuity/REPORT.md`)

### 2.1 Buyer journeys (acceptance drivers)

1. Place in 2D → open 3D → **same ids, mm, rotation**.  
2. 3D → 2D → 3D without pose drift (unmount OK; document sole authority).  
3. Orbit **immediately** (no hidden enable; no product default off).  
4. Clean console on the toggle path.

### 2.2 Competitive JTBD → O&O (ideas only — no copy)

| Industry pattern | O&O translation |
|------------------|-----------------|
| Instant 2D↔3D one document (P5D / SH3D / Floorplanner) | Same `Open3dProject` UUIDs; mode is chrome |
| Orbit default 3D navigation (Sketchfab grammar / Floorplanner orbital) | Three OrbitControls left-drag; polar clamp |
| Explicit top-bar 2D\|3D | TopBar radiogroup already |
| Lazy-load 3D | `Lazy3DViewer` |
| Walk / photoreal / 360 | **Out of W4** |

### 2.3 Raised bar (stronger than process PASS)

- **Three-layer orbit rule** — layer 1 alone is false green.  
- Evidence under **root** `results/…/04-orbit-continuity/` only.  
- Degrees document honesty — false-reverse if “fix” to radians.  
- Anti-J4 browser grammar.  
- Paper PASS ban when evidence folder missing.

### 2.4 Approaches (architecture choice)

| Approach | Description | Decision |
|----------|-------------|----------|
| **A** | Product journey on FeasibilityCanvas + document model | **Chosen** (design + phase + brainstormer) |
| B | Fabric full-stage first | Deferred; not required to close W4 |
| C | R3F rewrite of open3d viewer for “ENGINE says R3F” | **Rejected** for W4 — false-reverse thrash |

### 2.5 Failure modes / false-green traps (drive tests)

See §8 False-green catalog. Highest severity:

1. Claim orbit from defaults alone.  
2. Phase PASS without `results/`.  
3. Rotation unit rewrite.  
4. J4 e2e copy-paste.  
5. Treat mesh `-rotation.y` as pose drift.  
6. Evidence under `site/results/`.

### 2.6 Open questions → plan resolutions

| Question | Resolution in this plan |
|----------|-------------------------|
| Is product code already done? | **Mostly yes** — execute is **verify + harden + re-prove evidence**, not greenfield rewrite |
| Browser required for Done? | Yes for full W4 Done unless owner **written** deferral in NOTES |
| Double rebuild where? | `poseContinuityW4.test.ts` primary; keep `documentViewContinuity` complementary |
| Filename `.ts` vs `.tsx` for orbit unit? | Live is **`orbitControlsDefault.test.tsx`** |

### 2.7 Conflict rule applied

| Topic | Winner |
|-------|--------|
| What code does | **Repo** |
| Intent / bar / false greens | **Idiots2 brainstormer** when repo silent |
| Rotation units | **Repo + expert pass** (degrees document) over early phase prose |
| Expert 03 path truth 2026-07-09 | **Stale** — live code superseded |

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Orbit as default navigation pattern | Competitor JS/CSS/GLB/logos/screenshots in `site/` |
| Explicit 2D\|3D toggle grammar | Pixel-clone Planner5D / Floorplanner chrome |
| Three MIT `OrbitControls` | Shipping Planner5D `app.js` or reverse-engineered FML |
| O&O Phosphor + CSS modules | “Make it look like brand X” |
| Research under `D:\websites` as ideas only | Firecrawl re-scrape for routine W4 |

---

## 4. File map

### 4.1 Create (execute)

| Path | Role |
|------|------|
| `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` | HEAD, three-layer table, pass/fail |
| `results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md` | Layer audit template filled |
| `results/planner/world-standard-wave/04-orbit-continuity/*-raw.log` / `*-run.json` | Command evidence |
| PNGs + `browser-run.json` | Playwright artifacts (spec already writes these) |

### 4.2 Modify (only if gaps found)

| Path | When |
|------|------|
| `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | Harden full double-rebuild / wall+furniture matrix |
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Only if construct/attr cases regress |
| Optional new: `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts` | Pure assert helper + optional workspace source contract |
| Product files in §1.1 | **Only if unit/browser red** — code is expected green |

### 4.3 Read / regression only

| Path | Role |
|------|------|
| `buildOpen3dSceneNodes.ts` | Adapter |
| `createSceneObjectFromNode.ts` | Mesh sign |
| `TopBar.tsx` | Radio selectors |
| `OOPlannerWorkspace.tsx` | Wiring |
| `open3d-w4-orbit-continuity.spec.ts` | Browser contract |
| `scripts/run-evidence-cmd.ps1` | Evidence wrapper |

### 4.4 Boundaries

- One writer on `site/features/planner/open3d/` during execute.  
- Evidence **only** repo-root `results/` — never `site/results/`.  
- No edits to legacy Fabric archive or Planner3DViewer for W4 green.

---

## 5. Architecture & data flow

```
                    ┌─────────────────────────────┐
                    │      Open3dProject          │
                    │ furniture.id / position mm  │
                    │ furniture.rotation DEGREES  │
                    │ walls geometry              │
                    └─────────────┬───────────────┘
                                  │
              viewMode chrome only (2d | 3d)
                                  │
           ┌──────────────────────┴──────────────────────┐
           v                                             v
  FeasibilityCanvas                              Lazy3DViewer
  (2D plan edit)                                 data-testid=planner-3d-canvas (div)
           │                                             │
           │                                    ThreeViewerInner
           │                                    data-testid=three-viewer-container
           │                                    data-orbit-enabled true|false
           │                                             │
           │                          ┌──────────────────┼──────────────────┐
           │                          v                  v                  v
           │               buildOpen3dSceneNodes   OrbitControls      content Group
           │               (degrees→radians)       enableDamping      userData.entityId
           │                          │
           │                          v
           │               createSceneObjectFromNode
           │               rotation.y = -node.rotation
           └────────── same entity ids ──────────────────┘
```

### 5.1 Orbit three-layer contract (binding)

| Layer | Requirement | Live path |
|-------|-------------|-----------|
| 1 | Defaults ON | Lazy + Inner `OPEN3D_ORBIT_DEFAULT_ENABLED` |
| 2 | Explicit product prop | `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps()` |
| 3 | Proof | Units + Playwright + `04-orbit-continuity/` artifacts |

### 5.2 Orbit product parameters (keep)

| Control | Value |
|---------|-------|
| enableControls product default | `true` |
| damping | `enableDamping=true`, `dampingFactor=0.08` |
| maxPolarAngle | `Math.PI / 2 - 0.05` |
| minDistance / maxDistance | `1` / `40` |
| autoRotate | **off** |
| left-drag | rotate (Three default) |
| pan / zoom | enabled |

### 5.3 Rotation convention (locked)

| Layer | Unit | Rule |
|-------|------|------|
| Document furniture.rotation | **degrees** | `normalizeDegrees` / pureActions |
| Scene node.rotation | **radians** | `degreesToRadians` in adapter |
| Mesh rotation.y | node radians with **negation** | intentional plan Y→world Z |

---

## 6. Task list (TDD / verify-first)

> **Execute posture:** Prefer **run → prove → harden** over rewrite. If a step’s expected RED does not appear because product already green, record “already green” and still capture evidence. Do not invent failing product changes.

---

### Task 00: Evidence scaffold + honesty baseline

**Files:**
- Create: `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md`
- Create: `results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md` (template fill starts empty pass/fail)
- Modify: none product

- [ ] **Step 1: Create evidence directory**

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\04-orbit-continuity"
```

Expected: directory exists; `pnpm run check:layout` later must not flag evidence under `site/`.

- [ ] **Step 2: Capture HEAD**

```powershell
cd .
git rev-parse HEAD | Out-File -Encoding utf8 results\planner\world-standard-wave\04-orbit-continuity\HEAD.txt
git status -sb | Out-File -Encoding utf8 results\planner\world-standard-wave\04-orbit-continuity\STATUS.txt
```

- [ ] **Step 3: Write NOTES.md**

Write exactly this structure (fill HEAD after Step 2):

```markdown
# P04 / W4 NOTES — Orbit Continuity

**Date:** YYYY-MM-DD
**HEAD:** <sha from HEAD.txt>
**Approach:** A (FeasibilityCanvas + document model)
**Brainstormer:** Idiots2/P04-orbit-continuity/REPORT.md
**Plan:** plans1/P04-orbit-continuity/IMPLEMENTATION-PLAN.md

## W4 wording
Document pose continuity + OrbitControls ON by default with explicit workspace wiring + data-orbit-enabled; Vitest then Playwright left-drag + radio toggle; imperative Three; furniture degrees in document.

## Three-layer baseline (pre-run)
| Layer | Expected live | Verified? |
|-------|---------------|-----------|
| 1 Defaults | Lazy+Inner ON | pending |
| 2 Workspace | getOpen3dViewerControlProps() | pending |
| 3 Unit proof | orbit + pose logs here | pending |
| 3 Browser proof | PNGs + browser-run.json | pending |

## Honesty
Phase file may claim PASS. This folder was re-created because disk had no artifacts. Status only after commands below green.
```

- [ ] **Step 4: THREE-LAYER-AUDIT scaffold**

```markdown
# THREE-LAYER-AUDIT — W4

| Layer | Claim | Path / artifact | Pass? |
|-------|-------|-----------------|-------|
| 1 Defaults | enableControls default true Lazy+Inner | ThreeLazyViewer.tsx / ThreeViewerInner.tsx |  |
| 2 Workspace | {...getOpen3dViewerControlProps()} | OOPlannerWorkspace.tsx |  |
| 3 Unit | construct spy + data-orbit-enabled | orbit-default-* logs |  |
| 3 Unit | double rebuild pose | pose-continuity-* logs |  |
| 3 Browser | left-drag + radio + console | browser-run.json + PNGs |  |

HEAD:
Date:
```

- [ ] **Step 5: Commit docs-only scaffold (optional if evidence not committed by policy)**

If repo commits evidence:

```bash
git add results/planner/world-standard-wave/04-orbit-continuity/NOTES.md results/planner/world-standard-wave/04-orbit-continuity/THREE-LAYER-AUDIT.md results/planner/world-standard-wave/04-orbit-continuity/HEAD.txt
git commit -m "docs(w4): scaffold 04-orbit-continuity evidence folder"
```

If evidence is gitignored, keep files on disk only and note that in NOTES.

**Done when:** folder + NOTES + HEAD exist; no product code changed.

---

### Task 01: Pose continuity units (double rebuild + degrees honesty)

**Files:**
- Modify (if gaps): `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts`
- Keep: `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts`
- Test: same

#### Case matrix (must all pass)

| ID | Assert |
|----|--------|
| C1 | Stable furniture id across two builds |
| C2 | Node xMm/yMm/rotation equal across two builds (no mutation) |
| C3 | Document rotation stays degrees after rebuilds |
| C4 | Node rotation = degreesToRadians(document) |
| C5 | Wall + furniture ids stable after furniture pose update |
| C6 | Document not mutated by `buildOpen3dSceneNodes` |

- [ ] **Step 1: Write / harden the failing-or-locking test**

Replace or expand `poseContinuityW4.test.ts` to the full source below (covers C1–C6). If tests already green, this still is the contract.

```typescript
/**
 * W4: document is pose authority — 3D scene nodes rebuild without mutating project.
 * Document rotation = degrees; scene node rotation = radians.
 * Double rebuild models Lazy3DViewer unmount/remount (view toggle).
 */
import { describe, expect, it } from "vitest";

import { buildOpen3dSceneNodes } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import {
  addFurniture,
  addWall,
  updateFurniture,
} from "@/features/planner/open3d/model/operations/pureActions";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { degreesToRadians } from "@/features/planner/open3d/model/units";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function furniturePoseFields(nodes: ReturnType<typeof buildOpen3dSceneNodes>) {
  return nodes
    .filter((n) => n.kind === "furniture")
    .map((n) => ({
      id: n.id,
      xMm: n.xMm,
      yMm: n.yMm,
      rotation: n.rotation,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

describe("W4 pose continuity (document ↔ scene nodes)", () => {
  it("double rebuild preserves furniture id/xMm/yMm/rotation; document stays degrees", () => {
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
    expect(furnB?.id).toBe(furnA!.id);
    expect(furnB?.xMm).toBe(furnA!.xMm);
    expect(furnB?.yMm).toBe(furnA!.yMm);
    expect(furnB?.rotation).toBeCloseTo(furnA!.rotation, 8);
    expect(furniturePoseFields(nodesA)).toEqual(furniturePoseFields(nodesB));

    const after = project.floors[0]!.furniture.find((f) => f.id === "furn-w4")!;
    expect(after.id).toBe(before.id);
    expect(after.position).toEqual(before.position);
    expect(after.rotation).toBe(90);
  });

  it("wall + furniture ids stable after pose-only furniture update; nodes track document", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-2", "project-2"),
      name: "W4 wall+furn",
      now: "2026-07-09T22:05:00.000Z",
    });
    ({ project } = addWall(
      project,
      { x: 0, y: 0 },
      { x: 4000, y: 0 },
      { idFactory: ids("wall-w4") },
    ));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1000, y: 500 }, {
      idFactory: ids("furn-w4b"),
      width: 800,
      depth: 580,
      height: 720,
    }));
    ({ project } = updateFurniture(project, "furn-w4b", {
      position: { x: 2500, y: 1500 },
      rotation: 45,
    }));

    const nodes1 = buildOpen3dSceneNodes(project);
    const nodes2 = buildOpen3dSceneNodes(project);
    expect(furniturePoseFields(nodes1)).toEqual(furniturePoseFields(nodes2));

    const wall1 = nodes1.find((n) => n.kind === "wall");
    const wall2 = nodes2.find((n) => n.kind === "wall");
    expect(wall1?.id).toBe("wall-w4");
    expect(wall2?.id).toBe("wall-w4");

    const furn = nodes1.find((n) => n.id === "furn-w4b");
    expect(furn?.xMm).toBe(2500);
    expect(furn?.yMm).toBe(1500);
    expect(furn?.rotation).toBeCloseTo(degreesToRadians(45), 8);

    const doc = project.floors[0]!.furniture.find((f) => f.id === "furn-w4b")!;
    expect(doc.rotation).toBe(45);
    expect(project.floors[0]!.walls[0]!.id).toBe("wall-w4");
  });
});
```

- [ ] **Step 2: Run pose tests — expect PASS (or fix product only if FAIL)**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose
```

Expected PASS sample:

```
✓ W4 pose continuity ... double rebuild preserves ...
✓ W4 pose continuity ... wall + furniture ids stable ...
✓ open3d document view continuity ...
Test Files  2 passed
```

If FAIL on degrees/radians mismatch: **fix adapter or test expectation**, not document storage to radians.

- [ ] **Step 3: Capture evidence**

Preferred (wrapper creates nested name folders — also copy summary into `04-orbit-continuity/`):

```powershell
cd .
pwsh -File scripts/run-evidence-cmd.ps1 `
  -Name "pose-continuity" `
  -Module "planner" `
  -Phase "world-standard-wave/04-orbit-continuity" `
  -Cwd "site" `
  -Command "npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose"
```

Alternative direct capture:

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\04-orbit-continuity\pose-continuity-vitest-raw.log"
```

Also write `pose-continuity-run.json`:

```json
{
  "phase": "P04",
  "gate": "W4",
  "suite": "pose-continuity",
  "status": "unit-green",
  "files": [
    "poseContinuityW4.test.ts",
    "documentViewContinuity.test.ts"
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts
git commit -m "test(open3d): harden W4 pose double-rebuild continuity units"
```

**Done when:** C1–C6 covered and green; logs under `04-orbit-continuity/`.

---

### Task 02: Orbit default ON unit contract (three-layer unit half)

**Files:**
- Test: `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx`
- Product (only if red): `orbitDefaults.ts`, `ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx`

#### Case matrix

| ID | Assert |
|----|--------|
| O1 | `OPEN3D_ORBIT_DEFAULT_ENABLED === true` |
| O2 | `getOpen3dViewerControlProps()` → `{ enableControls: true }` |
| O3 | omit enableControls → OrbitControls constructed once |
| O4 | `enableControls={false}` → not constructed; attr false |
| O5 | `enableControls={true}` → constructed; attr true |
| O6 | document degrees helper still via `normalizeDegrees` (contract note) |

- [ ] **Step 1: Confirm live test source exists**

Do **not** create a parallel `orbitControlsDefault.test.ts` if `.tsx` exists. Open:

`site\tests\unit\features\planner\open3d\orbitControlsDefault.test.tsx`

If any O1–O5 case missing, add it. Full locked source (current live shape, keep mocks):

```tsx
/**
 * W4 orbit three-layer contract:
 * 1) enableControls defaults ON (Lazy + Inner)
 * 2) product helper forces enableControls: true for workspace
 * 3) OrbitControls constructed when enabled; data-orbit-enabled attribute
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "@/features/planner/open3d/3d/orbitDefaults";
import { ThreeViewerInner } from "@/features/planner/open3d/3d/ThreeViewerInner";
import { normalizeDegrees } from "@/features/planner/open3d/model/units";

const {
  renderCalls,
  disposeCalls,
  geometryDispose,
  materialDispose,
  OrbitControlsCtor,
} = vi.hoisted(() => {
  const OrbitControlsCtor = vi.fn(function MockOrbitControls(
    this: {
      enableDamping: boolean;
      dampingFactor: number;
      target: { set: ReturnType<typeof vi.fn> };
      maxPolarAngle: number;
      minDistance: number;
      maxDistance: number;
      update: ReturnType<typeof vi.fn>;
      dispose: ReturnType<typeof vi.fn>;
    },
  ) {
    this.enableDamping = false;
    this.dampingFactor = 0;
    this.target = { set: vi.fn() };
    this.maxPolarAngle = 0;
    this.minDistance = 0;
    this.maxDistance = 0;
    this.update = vi.fn();
    this.dispose = vi.fn();
  });
  return {
    renderCalls: vi.fn(),
    disposeCalls: vi.fn(),
    geometryDispose: vi.fn(),
    materialDispose: vi.fn(),
    OrbitControlsCtor,
  };
});

vi.mock("three", () => {
  class MockMesh {
    geometry = { dispose: geometryDispose };
    material = { dispose: materialDispose };
    rotation = { x: 0, y: 0, z: 0 };
    position = { set: vi.fn(), x: 0, y: 0, z: 0 };
    receiveShadow = false;
    castShadow = false;
    name = "";
    userData: Record<string, unknown> = {};
  }
  class MockGroup {
    name = "";
    children: unknown[] = [];
    add = vi.fn((object: unknown) => {
      this.children.push(object);
    });
    remove = vi.fn((object: unknown) => {
      this.children = this.children.filter((c) => c !== object);
    });
    traverse = vi.fn((callback: (object: unknown) => void) => {
      for (const child of this.children) {
        callback(child);
      }
    });
  }
  class MockScene {
    background: unknown = null;
    private readonly children: unknown[] = [];
    add = vi.fn((object: unknown) => {
      this.children.push(object);
    });
    traverse = vi.fn((callback: (object: unknown) => void) => {
      for (const child of this.children) {
        callback(child);
      }
    });
  }
  class MockPerspectiveCamera {
    position = { set: vi.fn() };
    aspect = 1;
    lookAt = vi.fn();
    updateProjectionMatrix = vi.fn();
  }
  class MockWebGLRenderer {
    domElement = document.createElement("canvas");
    shadowMap = { enabled: false, type: undefined };
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = renderCalls;
    dispose = disposeCalls;
  }
  class MockDirectionalLight {
    position = { set: vi.fn() };
    castShadow = false;
    shadow = { mapSize: { width: 0, height: 0 } };
  }
  return {
    __esModule: true,
    Scene: MockScene,
    Group: MockGroup,
    PerspectiveCamera: MockPerspectiveCamera,
    WebGLRenderer: MockWebGLRenderer,
    AmbientLight: vi.fn(),
    DirectionalLight: MockDirectionalLight,
    GridHelper: vi.fn(),
    PlaneGeometry: vi.fn(),
    BoxGeometry: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Mesh: MockMesh,
    Color: vi.fn(),
    PCFSoftShadowMap: "PCFSoftShadowMap",
    PCFShadowMap: "PCFShadowMap",
    DoubleSide: "DoubleSide",
  };
});

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
  OrbitControls: OrbitControlsCtor,
}));

describe("orbitControlsDefault — product helper / prop contract", () => {
  it("OPEN3D_ORBIT_DEFAULT_ENABLED is true", () => {
    expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
  });

  it("getOpen3dViewerControlProps forces enableControls: true", () => {
    const props = getOpen3dViewerControlProps();
    expect(props).toEqual({ enableControls: true });
    expect(props.enableControls).toBe(OPEN3D_ORBIT_DEFAULT_ENABLED);
  });

  it("furniture document rotation stays degrees via normalizeDegrees", () => {
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(90)).toBe(90);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(-90)).toBe(270);
  });
});

describe("orbitControlsDefault — ThreeViewerInner construct + data-orbit-enabled", () => {
  beforeEach(() => {
    OrbitControlsCtor.mockClear();
    renderCalls.mockClear();
    disposeCalls.mockClear();
    geometryDispose.mockClear();
    materialDispose.mockClear();
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    vi.spyOn(window, "addEventListener").mockImplementation(() => undefined);
    vi.spyOn(window, "removeEventListener").mockImplementation(() => undefined);
    Object.defineProperty(window, "devicePixelRatio", {
      value: 1,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("omitted enableControls (default ON) constructs OrbitControls and sets data-orbit-enabled=true", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} />
      </div>,
    );
    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
      expect(OrbitControlsCtor).toHaveBeenCalledTimes(1);
    });
    const container = screen.getByTestId("three-viewer-container");
    await waitFor(() => {
      expect(container.getAttribute("data-orbit-enabled")).toBe("true");
    });
  });

  it("enableControls={false} does not construct OrbitControls and sets data-orbit-enabled=false", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} enableControls={false} />
      </div>,
    );
    await waitFor(() => {
      expect(renderCalls).toHaveBeenCalled();
    });
    await waitFor(() => {
      const container = screen.getByTestId("three-viewer-container");
      expect(container.getAttribute("data-orbit-enabled")).toBe("false");
    });
    expect(OrbitControlsCtor).not.toHaveBeenCalled();
  });

  it("enableControls={true} explicit construct + data-orbit-enabled=true", async () => {
    render(
      <div style={{ width: 640, height: 480 }}>
        <ThreeViewerInner enableShadows={false} enableControls={true} />
      </div>,
    );
    await waitFor(() => {
      expect(OrbitControlsCtor).toHaveBeenCalledTimes(1);
    });
    const container = screen.getByTestId("three-viewer-container");
    await waitFor(() => {
      expect(container.getAttribute("data-orbit-enabled")).toBe("true");
    });
  });
});
```

- [ ] **Step 2: If product RED — minimal implementation**

**`orbitDefaults.ts` (must exist):**

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

**ThreeViewerInner critical fragments (do not rewrite whole file):**

```typescript
import { OPEN3D_ORBIT_DEFAULT_ENABLED } from "./orbitDefaults";

// props:
// enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED

// after OrbitControls construct:
setOrbitEnabled(true);
// else:
setOrbitEnabled(false);

// render:
// <div data-testid="three-viewer-container" data-orbit-enabled={orbitEnabled ? "true" : "false"}>
```

Orbit construct block (keep parameters):

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

- [ ] **Step 3: Run orbit unit**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose
```

Expected:

```
✓ OPEN3D_ORBIT_DEFAULT_ENABLED is true
✓ getOpen3dViewerControlProps forces enableControls: true
✓ omitted enableControls ... data-orbit-enabled=true
✓ enableControls={false} ... data-orbit-enabled=false
✓ enableControls={true} explicit ...
Test Files  1 passed
```

- [ ] **Step 4: Capture evidence**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\04-orbit-continuity\orbit-default-vitest-raw.log"
```

Write `orbit-default-run.json` with `status: "unit-green"`.

- [ ] **Step 5: Commit**

```bash
git add site/features/planner/open3d/3d/orbitDefaults.ts site/features/planner/open3d/3d/ThreeViewerInner.tsx site/features/planner/open3d/3d/ThreeLazyViewer.tsx site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx
git commit -m "feat(open3d): W4 orbit default ON + data-orbit-enabled contract"
```

(If no product diff, commit test-only only when tests changed.)

**Done when:** O1–O5 green with logs under `04-`.

---

### Task 03: Workspace explicit wiring (layer 2 lock)

**Files:**
- Modify if gap: `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- Create (recommended hardening): `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`

- [ ] **Step 1: Read product 3D branch**

Confirm live snippet:

```tsx
import {
  Lazy3DViewer,
  getOpen3dViewerControlProps,
} from "../3d/ThreeLazyViewer"; // or barrel — live uses Lazy3DViewer + getOpen3dViewerControlProps

// ...
{viewMode === "2d" ? (
  /* FeasibilityCanvas tree */
) : (
  <Lazy3DViewer
    projectData={workspaceCanvas.project}
    {...getOpen3dViewerControlProps()}
  />
)}
```

If omit helper:

```tsx
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

**Forbidden:**

```tsx
// BAD — silent default only
<Lazy3DViewer projectData={workspaceCanvas.project} />

// BAD — product opt-out
<Lazy3DViewer projectData={workspaceCanvas.project} enableControls={false} />
```

- [ ] **Step 2: Write workspace wiring unit (pure + source contract)**

Create `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`:

```typescript
/**
 * W4 layer 2: product workspace must not ship silent-default-only orbit.
 * Asserts helper contract + source wiring in OOPlannerWorkspace.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "@/features/planner/open3d/3d/orbitDefaults";

const workspacePath = path.resolve(
  __dirname,
  "../../../../../features/planner/open3d/editor/OOPlannerWorkspace.tsx",
);

describe("W4 workspace orbit wiring (layer 2)", () => {
  it("helper forces enableControls true", () => {
    expect(OPEN3D_ORBIT_DEFAULT_ENABLED).toBe(true);
    expect(getOpen3dViewerControlProps()).toEqual({ enableControls: true });
  });

  it("OOPlannerWorkspace spreads getOpen3dViewerControlProps into Lazy3DViewer", () => {
    const src = fs.readFileSync(workspacePath, "utf8");
    expect(src).toMatch(/getOpen3dViewerControlProps/);
    expect(src).toMatch(/\{\.\.\.getOpen3dViewerControlProps\(\)\}/);
    expect(src).toMatch(/Lazy3DViewer/);
    // Product path must not hard-disable orbit
    expect(src).not.toMatch(/enableControls=\{false\}/);
  });
});
```

Note: adjust relative path if `__dirname` resolution fails under vitest — prefer:

```typescript
import { fileURLToPath } from "node:url";
// or path from site root:
const workspacePath = path.join(
  process.cwd(),
  "features/planner/open3d/editor/OOPlannerWorkspace.tsx",
);
```

when tests run with `cwd = site`.

**Preferred robust path (use this):**

```typescript
const workspacePath = path.join(
  process.cwd(),
  "features/planner/open3d/editor/OOPlannerWorkspace.tsx",
);
```

- [ ] **Step 3: Run**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose
```

Expected: PASS 2 tests.

- [ ] **Step 4: Evidence + commit**

```powershell
npx vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\04-orbit-continuity\workspace-wiring-vitest-raw.log"
```

```bash
git add site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
git commit -m "test(open3d): lock W4 workspace explicit orbit wiring"
```

**Done when:** Layer 2 cannot silently regress without unit failure.

---

### Task 04: Adapter + mesh regression (pose path intact)

**Files:**
- Test only unless bug: `buildOpen3dSceneNodes.test.ts`, `createSceneObjectFromNode.test.ts`
- Product only on fail: adapter / factory

- [ ] **Step 1: Run regression suite**

```powershell
cd site
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose
```

Expected: all PASS.

- [ ] **Step 2: Capture**

```powershell
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\04-orbit-continuity\adapter-regression-vitest-raw.log"
```

- [ ] **Step 3: Mesh sign honesty check (do not “fix”)**

If a new assertion is needed for intentional negation, add only:

```typescript
// In createSceneObjectFromNode.test.ts — furniture node rotation π/2 → mesh.rotation.y === -π/2
import { degreesToRadians } from "@/features/planner/open3d/model/units";

it("applies plan-Y to world-Z sign flip on mesh rotation.y", () => {
  const node = boxNode({ rotation: degreesToRadians(90) });
  const object = createSceneObjectFromNode(THREE, node, false);
  expect(object.rotation.y).toBeCloseTo(-degreesToRadians(90), 8);
});
```

Do **not** fail W4 because mesh sign ≠ document degrees.

- [ ] **Step 4: Commit only if tests changed**

```bash
git add site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts
git commit -m "test(open3d): document intentional mesh rotation sign for W4"
```

**Done when:** adapter regression green + log present.

---

### Task 05: Combined open3d unit pack for W4 (optional single gate command)

- [ ] **Step 1: Run combined**

```powershell
cd site
npx vitest run `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  tests/unit/features/planner/open3d/documentViewContinuity.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts `
  tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  --reporter=verbose
```

Expected: all files passed.

- [ ] **Step 2: Write `unit-pack-run.json`**

```json
{
  "phase": "P04",
  "gate": "W4",
  "status": "unit-green",
  "suites": [
    "poseContinuityW4",
    "documentViewContinuity",
    "orbitControlsDefault",
    "workspaceOrbitWiring",
    "buildOpen3dSceneNodes",
    "createSceneObjectFromNode"
  ]
}
```

**Done when:** Unit-green vocabulary satisfied for CP-04 unit half.

---

### Task 06: Playwright W4 browser (anti-J4)

**Files:**
- Test: `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` (exists)
- Helpers: `site/tests/e2e/guestProjectSetup.ts`, `plannerCanvasHelpers.ts`
- Evidence: auto-written under `results/planner/world-standard-wave/04-orbit-continuity/`

#### Selector contract (open3d only)

| Use | Do not use |
|-----|------------|
| `getByRole("radio", { name: "3D", exact: true })` | `getByRole("button", { name: "3D" })` |
| `getByRole("radio", { name: "2D", exact: true })` | Split-view assumptions |
| `getByTestId("planner-3d-canvas")` as **div** | `canvas[data-testid="planner-3d-canvas"]` |
| `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` | Middle-button-only drag |
| Left mouse drag | J4 middle drag grammar |

- [ ] **Step 1: Confirm spec body (live contract — do not J4-rewrite)**

Full expected spec (already in repo; restore if corrupted):

```typescript
/**
 * W4 browser — place seats (configurator) → 3D orbit attr → 2D same furniture count.
 * Place path uses proven systems-v0 "Place 4 seats" (catalog click was flaky).
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
      path.join(EVIDENCE, "console-messages.txt"),
      hardAppErrors.join("\n") || "(no hard app console errors)",
      "utf8",
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

    expect(hardAppErrors, hardAppErrors.join("\n")).toEqual([]);
  });
});
```

Note: if live spec does not assert `consoleErrors` empty or write `console-messages.txt`, **add those lines** (W4.5).

- [ ] **Step 2: Ensure dev server / Playwright config per START.md**

From site (match project’s usual e2e pattern). Typical:

```powershell
cd site
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line
```

Or package gate:

```powershell
cd site
pnpm run test:e2e:open3d-world -- tests/e2e/open3d-w4-orbit-continuity.spec.ts
```

(Use the actual script name from `package.json` if different — live has `test:e2e:open3d-world` / `gate:open3d`.)

Expected:

```
1 passed
```

Artifacts present:

| File | Required |
|------|----------|
| `01-2d-after-place.png` | yes |
| `02-3d-orbit-on.png` | yes |
| `03-2d-restored.png` | yes |
| `browser-run.json` | yes |
| `console-messages.txt` | yes (after Step 1 hardening) |
| `playwright-raw.log` | capture via Tee if not automatic |

- [ ] **Step 3: Capture playwright log**

```powershell
cd site
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\04-orbit-continuity\playwright-raw.log"
```

- [ ] **Step 4: On failure — systematic debug (do not declare browser-green)**

| Symptom | Check |
|---------|-------|
| Radio 3D not found | TopBar mounted? guest enter failed? |
| orbit attr never true | OrbitControls import fail? enableControls false? |
| Place 4 seats missing | configurator region not open — open systems panel |
| Furniture count -1 | status text pattern changed — fix helper, don’t invent private API |
| Console errors on dispose | race in ThreeViewerInner cleanup |

- [ ] **Step 5: Honesty deferral (only if environment blocks browser)**

If WebGL/Playwright cannot run in this environment:

1. Do **not** write `status: browser-green`.  
2. NOTES: `Playwright deferred: <reason>; unit contract closed`.  
3. Log blocker in `Failures.md`.  
4. Owner must accept deferral for full W4 Done.

- [ ] **Step 6: Commit**

```bash
git add site/tests/e2e/open3d-w4-orbit-continuity.spec.ts
git commit -m "test(e2e): W4 orbit continuity console assert + evidence"
```

**Done when:** browser-green artifacts exist **or** honest deferral documented.

---

### Task 07: Manifest / pack contract non-regression

**Files:**
- Read: `site/config/build/playwright-open3d-world-specs.json`
- Test: `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts`

- [ ] **Step 1: Run pack contract unit**

```powershell
cd site
npx vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts --reporter=verbose
```

Expected: gates.W4 → `open3d-w4-orbit-continuity.spec.ts`; file exists.

- [ ] **Step 2: If gate missing, fix manifest**

Ensure:

```json
{
  "gates": {
    "W4": "open3d-w4-orbit-continuity.spec.ts"
  },
  "specs": [
    "tests/e2e/open3d-w4-orbit-continuity.spec.ts"
  ]
}
```

(merge with existing full list — do not delete other gates).

**Done when:** pack unit green.

---

### Task 08: Fill THREE-LAYER-AUDIT + final NOTES + CP-04

- [ ] **Step 1: Fill audit**

Example filled:

```markdown
# THREE-LAYER-AUDIT — W4

| Layer | Claim | Path / artifact | Pass? |
|-------|-------|-----------------|-------|
| 1 Defaults | enableControls default true | ThreeLazyViewer.tsx + ThreeViewerInner.tsx + orbitDefaults.ts | YES |
| 2 Workspace | {...getOpen3dViewerControlProps()} | OOPlannerWorkspace.tsx + workspaceOrbitWiring unit | YES |
| 3 Unit orbit | construct + data-orbit-enabled | orbit-default-vitest-raw.log | YES |
| 3 Unit pose | double rebuild | pose-continuity-vitest-raw.log | YES |
| 3 Browser | left-drag + radio + console | browser-run.json + PNGs + console-messages.txt | YES/NO |

HEAD: <from HEAD.txt>
Date: <ISO>
```

- [ ] **Step 2: Final NOTES table**

Update status vocabulary:

| Word | Criteria |
|------|----------|
| Unit-green | Layers 1–2 + vitest evidence in `04-` |
| Browser-green | Playwright + PNGs + console artifact |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted browser deferral) |

- [ ] **Step 3: CP-04 checklist**

- [ ] Pose continuity units green; evidence under `04-orbit-continuity/`
- [ ] Orbit default ON green; `data-orbit-enabled` wired
- [ ] Workspace explicit enable + live `projectData`
- [ ] Adapter regression green
- [ ] Playwright green **or** deferred with honest NOTES
- [ ] Console-clean claim only with artifact
- [ ] Local commits; **no worktrees**; push per AGENTS when green slice
- [ ] W4 not marked done if orbit disabled, silent-default only, or pose drifts

- [ ] **Step 4: Layout check**

```powershell
cd .
pnpm run check:layout
```

Expected: PASS — no `site/results` pollution.

- [ ] **Step 5: Final commit**

```bash
git add results/planner/world-standard-wave/04-orbit-continuity
git commit -m "docs(w4): CP-04 orbit continuity evidence pack"
```

**Done when:** CP-04 honest; unlock P05 only after this or owner waiver.

---

## 7. Test matrix

| Layer | Command | Expected |
|-------|---------|----------|
| Pose | `npx vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose` | All pass |
| Orbit | `npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose` | All pass |
| Wiring | `npx vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose` | All pass |
| Adapter | `npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose` | All pass |
| Pack | `npx vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts --reporter=verbose` | W4 gate present |
| Browser | `npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line` | 1 passed |
| Layout | `pnpm run check:layout` (repo root) | PASS |

All product commands from `site` unless noted. Evidence → `results\planner\world-standard-wave\04-orbit-continuity\`.

---

## 8. False-green catalog

| Trap | Why false | Blocked by |
|------|-----------|------------|
| Defaults alone = orbit works | Silent omit still “works” until prop removed | Task 03 source + helper unit |
| Phase PASS header | No artifacts on disk 2026-07-10 | Task 00 re-prove |
| WAVE “no orbit” silence as pass | Research debt ≠ product proof | Ignore WAVE as pass |
| Mesh `-rotation.y` as drift | Intentional transform | Task 04 honesty |
| Document→radians rewrite | Breaks pick/actions/UI | Degrees tests Task 01 |
| J4 e2e | Wrong chrome | Task 06 selector table |
| Unit-only “browser-green” | No PNG | Task 06 honesty |
| Evidence in `site/results` | Layout gate fail | Task 08 check:layout |
| R3F port “to match ENGINE” | Weeks thrash | Architecture lock |
| Photoreal as W4 | Scope steal | Non-goals |
| Furniture count flaky catalog | Place fails | Configurator Place 4 seats path |
| Middle-button only | Not product grammar | Left-drag in e2e |
| `canvas[data-testid=planner-3d-canvas]` | Root is div | Wait div testid |
| Auto-rotate showcase | Not product | Params table |
| Camera bookmark as continuity | Wrong authority | Continuity = document |

---

## 9. Stop-if-fail / CP criteria

**Stop and fix (do not continue to “Done”):**

1. Orbit unit fails construct or attribute.  
2. Workspace has `enableControls={false}` or omits helper.  
3. Pose double rebuild drifts.  
4. Playwright red without root-cause NOTES.  
5. Console hard errors on toggle path.  
6. Evidence written under `site/`.  

**CP-04 green floor (RESULTS-MAP + phase):**

- `run.json` / `browser-run.json`  
- Screenshots  
- Console log excerpt  
- Unit logs  
- NOTES + three-layer honesty  

---

## 10. Commit sequence

| Order | Message | Intent |
|-------|---------|--------|
| 1 | `docs(w4): scaffold 04-orbit-continuity evidence folder` | Task 00 |
| 2 | `test(open3d): harden W4 pose double-rebuild continuity units` | Task 01 |
| 3 | `feat(open3d): W4 orbit default ON + data-orbit-enabled contract` | Task 02 if product needed |
| 4 | `test(open3d): lock W4 workspace explicit orbit wiring` | Task 03 |
| 5 | `test(open3d): document intentional mesh rotation sign for W4` | Task 04 optional |
| 6 | `test(e2e): W4 orbit continuity console assert + evidence` | Task 06 |
| 7 | `docs(w4): CP-04 orbit continuity evidence pack` | Task 08 |

Rules: main checkout only; no worktrees; push origin when slice green; mayoite per AGENTS ~45m / big land.

---

## 11. Risks & owner decisions

| Risk | Mitigation | Owner decision? |
|------|------------|-----------------|
| Browser WebGL blocked in CI | Unit closed + honest deferral | Yes if claim Done without browser |
| Place path flaky | Keep configurator Place 4 seats | No |
| Parallel writer on open3d | Single writer | Process |
| Phase PASS trust | Re-prove | No — agent honesty duty |
| Rotation thrash temptation | Degrees lock in tests | No |
| Scope creep mesh/save | Out of scope list | No unless goal change |

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Live path | Task |
|-----------|------|
| orbitDefaults.ts | 02 |
| ThreeViewerInner.tsx | 02 |
| ThreeLazyViewer.tsx | 02 |
| OOPlannerWorkspace.tsx | 03 |
| TopBar.tsx | 06 (read selectors) |
| buildOpen3dSceneNodes.ts | 01, 04 |
| createSceneObjectFromNode.ts | 04 |
| poseContinuityW4.test.ts | 01 |
| documentViewContinuity.test.ts | 01 |
| orbitControlsDefault.test.tsx | 02 |
| open3d-w4-orbit-continuity.spec.ts | 06 |
| playwright pack unit | 07 |
| results/04-orbit-continuity/ | 00, 08 |

### 12.2 Brainstormer coverage

| Bar / failure | Task / section |
|---------------|----------------|
| Three-layer rule | §5.1, Tasks 02–03, 08 |
| Double rebuild | Task 01 |
| Degrees honesty | Task 01, §5.3 |
| Anti-J4 | Task 06 |
| Paper PASS ban | Task 00, §1.3 |
| Evidence filenames | Tasks 01–06 |
| Approach A | Architecture |
| No R3F thrash | §1.4 |
| No photoreal | Non-goals |
| Left-drag orbit | Task 06 |
| Console clean | Task 06 |
| Ethics | §3 |

### 12.3 Placeholder scan

No TBD / “similar to Task N” / empty test steps. Full sources provided for new/hardened tests and product fragments.

### 12.4 Length honesty

Plan is long because: (1) product is mostly landed but **proof is missing**, (2) false-green traps require exhaustive contracts, (3) skill forbids artificial caps. Execute agent still runs bite-sized checkboxes.

---

## 13. Appendices

### Appendix A — Type / signature catalog

```typescript
// orbitDefaults.ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
export function getOpen3dViewerControlProps(): { enableControls: true };

// buildOpen3dSceneNodes.ts
export interface Open3dSceneNode {
  readonly id: string;
  readonly kind: "wall" | "furniture";
  readonly xMm: number;
  readonly yMm: number;
  readonly widthMm: number;
  readonly depthMm: number;
  readonly heightMm: number;
  readonly rotation: number; // radians
  // ...
}
export function buildOpen3dSceneNodes(
  project: Pick<Open3dProject, "floors" | "activeFloorId">,
): Open3dSceneNode[];

// units.ts
export function normalizeDegrees(value: number): number;
export function degreesToRadians(degrees: number): number;

// ThreeViewerInner props
interface ThreeViewerInnerProps {
  projectData?: {
    id: string;
    name: string;
    floors: Open3dFloor[];
    activeFloorId?: string;
  };
  enableShadows?: boolean;
  enableControls?: boolean; // default OPEN3D_ORBIT_DEFAULT_ENABLED
  backgroundColor?: string;
  onReady?: () => void;
}
```

### Appendix B — Research translation table (ideas → O&O)

| Research idea | O&O action | Gate |
|---------------|------------|------|
| Instant 2D↔3D same document | Open3dProject UUIDs | W4 |
| Orbit default | OrbitControls + three-layer | W4 |
| Explicit top toggle | TopBar radios | W4 |
| Lazy 3D | Lazy3DViewer | W4 hygiene |
| Orbital vs walk | Orbit only | W4 |
| Photoreal race | Defer | P08/out |
| SH3D dual projection | Already document model | W4 proof |

### Appendix C — Selector table (browser)

| Purpose | Selector |
|---------|----------|
| View mode group | `role=radiogroup` name View mode |
| 3D | `getByRole("radio", { name: "3D", exact: true })` |
| 2D | `getByRole("radio", { name: "2D", exact: true })` |
| 3D root | `[data-testid="planner-3d-canvas"]` |
| Orbit truth | `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` |
| Place path | region “Workstation systems configurator” → button “Place 4 seats” |
| Top bar | `.pw-topbar` |

### Appendix D — Evidence file checklist

```
results/planner/world-standard-wave/04-orbit-continuity/
  HEAD.txt
  STATUS.txt
  NOTES.md
  THREE-LAYER-AUDIT.md
  pose-continuity-vitest-raw.log
  pose-continuity-run.json
  orbit-default-vitest-raw.log
  orbit-default-run.json
  workspace-wiring-vitest-raw.log
  adapter-regression-vitest-raw.log
  unit-pack-run.json
  playwright-raw.log
  browser-run.json
  console-messages.txt
  01-2d-after-place.png
  02-3d-orbit-on.png
  03-2d-restored.png
```

### Appendix E — Glossary

| Term | Meaning |
|------|---------|
| W4 | Pose continuity + orbit ON + proof |
| CP-04 | Hard stop checklist for P04 |
| Three-layer | Defaults + explicit wiring + proof |
| Double rebuild | Two pure `buildOpen3dSceneNodes` calls |
| Paper PASS | Status without artifacts |
| J4 | Legacy e2e grammar — forbidden |
| Approach A | Feasibility + document first |

### Appendix F — Cross-phase interfaces

| Phase | Interface |
|-------|-----------|
| P03 | Not required for pure units; browser uses place path |
| P05 | Symbols unrelated to pose contract |
| P06 | Save identity culture adjacent; not this gate |
| P07 | May share journey; keep open3d selectors |
| P08 | Mesh while orbiting; not required for orbit ON |
| P02 | Engine lock already; do not re-open |

### Appendix G — Execute order (fast path if code already green)

1. Task 00 scaffold  
2. Run Task 01–05 units → capture logs  
3. Task 03 add wiring unit if missing  
4. Task 06 Playwright  
5. Task 07–08 audit + CP-04  
6. Commits  

Do not open P05 until CP-04 honest.

---

## Execution handoff

**Plan complete and saved to `plans1/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — superpowers:subagent-driven-development  

**2. Inline Execution** — superpowers:executing-plans  

**Which approach?**

---

*End of idiotplanners P04 IMPLEMENTATION-PLAN (PLANNER 04/10). Plan only — no product code in this pass.*
