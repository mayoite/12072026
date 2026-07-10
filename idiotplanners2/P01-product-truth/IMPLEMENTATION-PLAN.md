# P01 Product Truth Inventory — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-establish a data-backed map of what the live open3d planner **actually does** versus what docs/README/UI copy **claim**, so P02–P10 fix real gaps against W1–W8 — not stories — with artifacts under `results/planner/world-standard-wave/00-product-truth/`.

**Architecture:** Inventory-only phase. Production planner source under `site/features/planner/open3d/`; thin App Router hosts under `site/app/planner/`; dual host entry (guest/canvas via `Open3dPlannerWorkspaceRoute`, pilot `/planner/open3d` via direct `Open3dPlannerHost`). Live 2D = FeasibilityCanvas (Canvas 2D API); Fabric full stage is archive + permanent redirect + optional furniture overlay flag. 3D = imperative Three in `ThreeViewerInner` with OrbitControls when `enableControls` (product default ON via `orbitDefaults.ts` + `getOpen3dViewerControlProps()`). Persistence = local IDB autosave with honest “local” status labels. **No product-feature code changes** under `site/features/planner/open3d/**` unless owner unlocks. Evidence-only writes under `results/…`. Optional: re-run / extend **pure inventory unit tests** already in tree (`hostWiringP01.test.ts`) — no feature behavior changes.

**Tech Stack:** Next.js (`oando-site`), FeasibilityCanvas, Three.js + OrbitControls (jsm examples), Vitest, PowerShell inventory scripts from repo root, pnpm.

**Inputs consumed:**
- Repo read: 2026-07-10 — working tree under `D:\OandO07072026`; **`results/` directory absent** (list_dir fails). Key paths verified live in § Repo reality.
- Brainstormer: `Idiots/P01-product-truth/REPORT.md` (full; Idiots2 **not** read per owner).
- Phase plan: `Plans/phases/P01-product-truth/` (entire: `P01-product-truth.md`, `P01-suggestions.md`, `README.md`).
- Evidence map: `Plans/Research/RESULTS-MAP.md` (canonical folder **`00-product-truth/`**).
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`.
- Honesty corpus live path: `Plans/Research/Others/*` (repo-root `ayushdocs/` **does not exist** in this checkout — treat as relocated honesty docs).

**Done when:**
1. `results/planner/world-standard-wave/00-product-truth/` exists with **all** phase contract artifacts (§ Evidence contract).
2. Map minimum green: **`INVENTORY.md`** + **`CONTRADICTIONS.md`** with repo paths and path:line cites.
3. W1–W8 capability matrix has **no blank gates**; browser column defaults to `browser-missing` unless real Playwright artifacts under `results/planner/` are found.
4. Vitest capability smoke attempted with non-empty log; `run.json.vitestSmoke` ∈ {`ok`,`failed`,`skipped`} — never `pending`.
5. Dual-state language recorded: `CP-01 artifacts: ready-for-review|pass` **and** `Buyer product truth: not ship|partial` — never collapse them.
6. P02 freeze list written in INVENTORY (engine identity, orbit location, do-not-thrash myths).
7. **No** product feature edits; no worktrees; no browser-green claim without artifacts.

**Evidence folder (canonical):** `results/planner/world-standard-wave/00-product-truth/`  
**Forbidden primary names:** `01-product-truth/` (pointer-only alias if needed with `NOTES.md` absolute path).  
**Failures log:** `D:\OandO07072026\Failures.md`

**Epistemic status of phase file header (2026-07-09 DONE / CP-01 PASS / smoke 27/27):** **STALE relative to this checkout.** Artifacts missing → **re-execute full inventory**. “Do not re-run thrash” applies only when evidence is on disk and HEAD-aligned; missing evidence = mandatory re-proof (brainstormer §0.6, §1.10, §17.6).

---

## 1. Repo reality (live code facts — 2026-07-10)

### 1.1 Critical absences

| Path | Live status | Impact |
|------|-------------|--------|
| `D:\OandO07072026\results\` | **MISSING** | Cannot re-prove CP-01; WAVE.md unreadable; historical spine dirs unreadable |
| `results/planner/world-standard-wave/00-product-truth/` | **MISSING** | Map minimum fail; phase DONE header unverified |
| `D:\OandO07072026\ayushdocs\` | **MISSING** | Claims corpus must use `Plans/Research/Others/` |
| `Plans/trustdata/` | **MISSING** (tree cleaned 2026-07-10) | Phase card fossils; live authority = `Plans/phases` + `Plans/Research` |
| `Plans/Research/checkpoints/CHECKPOINTS.md` | **MISSING** (linked from RESULTS-MAP but not on disk) | CP ledger: write CP-01 footer in `INVENTORY.md` + `run.json`; create `results/.../CP-01-LEDGER.md` if parent CHECKPOINTS absent |

### 1.2 Production open3d tree (exists)

Root: `site/features/planner/open3d/`

| Top-level | Role |
|-----------|------|
| `canvas-feasibility/FeasibilityCanvas.tsx` | Live interactive 2D (Canvas 2D API) |
| `canvas-fabric-stage/` | Opt-in Fabric furniture overlay only |
| `editor/` | `OOPlannerWorkspace`, TopBar, InventoryPanel, keyboard, status labels |
| `3d/` | `ThreeLazyViewer`, `ThreeViewerInner`, scene builders, `orbitDefaults.ts` |
| `catalog/` | placement, modular cabinet-v0, Block2D, workstation-v0, SVG pipeline |
| `model/` | project types, walls/openings/furniture actions, pure operations |
| `persistence/` | autosave, guest/member repos, projectJson, session |
| `ui/Open3dNativeHost.tsx` | Thin host → workspace |
| `lib/commands/`, `lib/geometry/` | palette + picking/snapping |
| `shared/` | document bridge, export helpers, theme colors |
| `store/`, `ai/`, `cleanup/` | prefs/history, advisor, import graph proof |
| `README.md` | Hybrid stack truth + route table |

**Archive:** `site/features/planner/_archive/fabric/` (editor + canvas-fabric); not live default 2D.

### 1.3 Host / route wiring (verified by file read)

| Route | Page | Mount chain |
|-------|------|-------------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → (Providers + ProjectSetupGate) → dynamic `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | Same WorkspaceRoute; `guestMode` from optional auth |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | **Direct** `Open3dPlannerHost` — **no** WorkspaceRoute / ProjectSetupGate in page |

```
# Guest (verified)
import { Open3dPlannerWorkspaceRoute } from "@/features/planner/ui/Open3dPlannerWorkspaceRoute";
return <Open3dPlannerWorkspaceRoute guestMode planId={planId} />;

# Pilot (verified)
import { Open3dPlannerHost } from "@/features/planner/ui/Open3dPlannerHost";
return <Open3dPlannerHost guestMode={isGuest} planId={planId} />;

# Host (verified)
return <Open3dNativeHost planId={planId} guestMode={guestMode} />;

# Native (verified)
return <OOPlannerWorkspace guestMode={guestMode} planId={planId} />;
```

**Unit lock already in tree:** `site/tests/unit/features/planner/open3d/hostWiringP01.test.ts` — dual entry, fabric pages absent, next.config redirects, fabric furniture flag default OFF.

### 1.4 Fabric truth (verified)

| Fact | Evidence |
|------|----------|
| No `site/app/planner/fabric` page tree | `hostWiringP01` expects existsSync false; list_dir of app planner has no fabric |
| Permanent redirect | `site/config/build/next.config.js` L206–207: `/planner/fabric` and `/planner/fabric/:path*` → `/planner/open3d/` |
| Overlay flag | `fabricFurnitureFlag.ts`: `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` exact `"1"` only |
| Live 2D | `open3d/README.md` + FeasibilityCanvas |
| **Stale claims** | Guest/canvas page comments still say “archive fallback: /planner/fabric/…”. Archive README “Rollback” § still lists `/planner/fabric/guest` and `/planner/fabric/canvas` as “unchanged” fallbacks — **contradicted by redirects** |
| **Graph stale** | `importGraphProof.ts` still lists `route-fabric-guest` / `route-fabric-canvas` as `fabric-legacy` nodes with page paths that **do not exist** — inventory must flag as docs/code-graph overclaim |

### 1.5 W-gate code surface (verified samples — inventory fills path:line)

| Gate | Live code snapshot | Status tokens (pre-matrix) |
|------|--------------------|----------------------------|
| **W1** | `addOpen3dWall` imported in FeasibilityCanvas; tools wall/door/window; `useDoorWindowPlacement.ts` present | `code-present` expected; browser unknown |
| **W2** | `InventoryPanel`, `placementAction.ts`, `modularCabinetV0.ts`, `furnitureBlock2D.ts`, workspace place arm message | `code-present` expected |
| **W3** | `deleteSelection` in OOPlannerWorkspace (~L326) → `applySelectionDelete` in `workspaceEntityHelpers.ts`; keyboard Delete/Backspace in `useWorkspaceKeyboard.ts`; pick helpers `pickFurnitureAtPoint` in canvasPicking; unit `applySelectionDelete.test.ts` | `code-present` + unit files exist; **browser-missing** until P03 evidence; design-spec “no furniture select/delete” line may be **stale vs code** |
| **W4** | `viewMode` 2d\|3d in OOPlannerWorkspace; `getOpen3dViewerControlProps()` spread on viewer (~L1012); `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; OrbitControls construct in ThreeViewerInner when enableControls; `setOrbitEnabled` for Playwright truth | `code-present`; product-usable needs browser; WAVE “no orbit” (if restored) = docs-overclaim risk |
| **W5** | `useOpen3dWorkspaceAutosave` IDB via `createAutoSaver`; flush on pagehide/visibility hidden/unmount; `saveReloadContinuity.test.ts` | unit may green; browser W5 missing |
| **W6** | `workspaceStatusLabels.formatAutosaveStatus` returns **local** strings only (`Draft saved locally`, `Saved locally`, never cloud) | honesty code-present; still inventory labels vs TopBar wiring |
| **W7** | modular cabinet + createSceneObjectFromNode + buildOpen3dSceneNodes; historical honesty: boxes partial | code-present; bar later P08 |
| **W8** | `CANVAS_TOOL_SHORTCUTS` authority; invert map in keyboard; Dimension→`M` not `D` (D=door) | code-present; labels vs handlers unit suite exists |

### 1.6 Tests already present (inventory coverage map inputs)

**Unit root:** `site/tests/unit/features/planner/open3d/` — large suite including:

- `hostWiringP01.test.ts` (P01 inventory lock)
- `open3dWorkspaceKeyboard.test.tsx`, `open3dFeasibilityCanvas.test.tsx`, `threeViewerInner.test.tsx`
- `saveReloadContinuity.test.ts`, `workspaceStatusLabels.test.ts`
- `applySelectionDelete.test.ts`, `poseContinuityW4.test.ts`, `orbitControlsDefault.test.tsx`
- catalog/modular/workstation suites, persistence suites, a11y TopBar/tool rail

**E2E (names under `site/tests/e2e/`):**

- World-standard pack scripts: `open3d-world-standard-journey.spec.ts`, `open3d-w3-select-delete.spec.ts`, `open3d-w4-orbit-continuity.spec.ts`, `open3d-save-honesty.spec.ts`, `open3d-systems-v0-batch-place.spec.ts`
- Config: `site/config/build/playwright-open3d-world-specs.json`
- Scripts: `test:e2e:open3d-world`, `gate:open3d`
- Planner family: `planner-guest-workspace`, `planner-catalog`, `planner-j*`, etc.
- Related non-`*planner*`: `admin-svg-publish-p01.spec.ts`, `sketch-to-plan-pipeline.spec.ts`

**P01 rule:** Specs **existing in tree ≠ browser proof green**. Browser green requires artifacts under `results/planner/` (RESULTS-MAP). With `results/` missing, all browser columns = `browser-missing`.

### 1.7 Package / commands (live)

Package name: `oando-site` (`site/package.json`).

| Command | Use in P01 |
|---------|------------|
| `pnpm --filter oando-site exec vitest run …` | Required capability smoke |
| `pnpm --filter oando-site run test:planner` | Optional broader capture |
| `pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts` | Inventory lock re-prove |
| Playwright open3d world | **Out of scope for product work**; may **list** specs only; do not claim green |

Vitest config: default `site/vitest.config.ts` (not always `vitest.site.config.ts`). Prefer:

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run <paths relative to site> --reporter=verbose
```

or from root:

```powershell
cd D:\OandO07072026
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

### 1.8 Contradictions already known (seed CONTRADICTIONS.md)

| ID | Claim | Live fact | Severity |
|----|-------|-----------|----------|
| X01 | P01 DONE / CP-01 PASS | `results/` missing | **P0** |
| X02 | `Plans/trustdata/…` paths in execute card | Live: `Plans/phases`, `Plans/Research` | P1 |
| X03 | Fabric fallback routes work | next.config permanent redirect to open3d | **P0** |
| X04 | Archive README rollback fallbacks “unchanged” | Pages absent + redirect | **P0** |
| X05 | Guest/canvas comments “archive fallback: /planner/fabric/…” | Redirects | P1 |
| X06 | `importGraphProof` fabric-legacy page nodes | Pages do not exist; tests assert absence | **P0** graph honesty |
| X07 | Design spec “no furniture select/delete” (honest today) | Code has pick + deleteSelection + unit tests | P1 re-verify buyer-visible |
| X08 | Root `ayushdocs/` claims sources | Relocated to `Plans/Research/Others/` | P1 |
| X09 | CHECKPOINTS.md ledger | Not on disk under Research | P1 |
| X10 | WAVE “no orbit” (historical) | OrbitControls + default ON + workspace force props | P0 three-way split |
| X11 | Scoreboard PASS language | No map minimum files here | **P0** paper green |

### 1.9 Repo-first checklist (completed for this plan)

- [x] Real files that will be **read** listed (open3d tree, hosts, tests)
- [x] Real files that will be **created** are evidence under `results/…/00-product-truth/` only (+ optional CP ledger)
- [x] Contradictions plan claims vs code noted
- [x] Missing evidence noted (`results/` deleted/absent → re-prove)
- [x] HEAD honesty: plan writer did not require clean tree; executor records `git rev-parse HEAD` + `git status -sb` into HEAD.txt

---

## 2. Brainstormer synthesis (`Idiots/P01-product-truth/REPORT.md`)

### 2.1 Chosen inventory approach

**Primary A (journey-first inventory)** + **B freeze appendix** + **C claims pass** (brainstormer §13.4).

Order:

1. Tasks 00–02: engines/hosts/fabric (B core)
2. Task 03: W1–W8 journey-ordered gates (A)
3. Task 04: claims corpus (C) using **live** honesty paths
4. Tasks 05–07: tests/results map, deep notes, INVENTORY + CONTRADICTIONS

### 2.2 Raised bar (must appear in INVENTORY)

1. One-paragraph buyer reality (facilities, unaided)
2. **BUYER-HARD-STOP.md** (first failure + gate + code pointer)
3. Document model note: UUID entities, mm, furniture rotation degrees
4. SVG triple-path honesty (inventory SVG ≠ canvas Path2D ≠ publish pipeline)
5. Dual-state: CP artifacts vs buyer product
6. P02 freeze list ≤1 page
7. Zero unmarked P0 docs-overclaim

### 2.3 False-green traps (from brainstormer §10)

F01 WAVE-as-code · F02 grep-only · F03 skip dual host · F04 skip fabric redirect · F05 unit-green without log · F06 browser-green without PNG · F07 empty W rows · F08 no CONTRADICTIONS · F09 SVG conflation · F10 skip save labels · F11 orbit default-only · F12 re-scrape · F13 edit product mid-inventory · F14 worktrees · F15 skip key-files · F16 matrix clobber · F17 CP-01 forever after prune · F18 scoreboard without map files · F19 degrees reverse · F20 Fabric flag ON for later W proofs.

### 2.4 Kill order after CP-01 green

P02 engine lock → P03 W3 → P07 journey → P06 save → fill P04/P05/P08/P09 → P10.  
**Do not** start P02 implementation until this inventory pack is on disk.

### 2.5 Ethics (binding)

- Research under `D:\websites` = jobs/ideas only — **no** competitor copy into product or evidence as “our UI”
- Firecrawl dead for routine work
- No plagiarism of bundles / SVG path blobs / screenshots into `site/`

### 2.6 Recovery path if results pruned

1. Check local `results/`
2. Else try `E:\OandO-backups\trustdata-2026-07-10\` (PENDING cite; verify existence — do not invent)
3. Else **full re-run** Tasks 00–07 (this plan)

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Cite research JTBD as inventory questions | Paste competitor CSS/JS/SVG/GLB |
| Map RoomSketcher/Floorplanner jobs to W rows | Claim research scores as live product |
| Use oando-render-options triple-path honesty | Treat `D:\websites` as RESULTS-MAP evidence |
| Phosphor/O&O original chrome only later | Re-scrape Planner5D for “truth” |

---

## 4. File map

### 4.1 Create (evidence only)

```text
results/planner/world-standard-wave/00-product-truth/
  run.json
  HEAD.txt
  open3d-file-list.txt
  open3d-folder-counts.tsv
  key-files-exist.tsv
  host-wiring-rg.txt
  fabric-redirect-and-archive-rg.txt
  ROUTES.md
  w1-draw-rg.txt … w8-shortcuts-rg.txt
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
  INVENTORY.md                    # CP-01 canonical
  CONTRADICTIONS.md               # CP-01 canonical
  PRODUCT-TRUTH.md
  README.md
  BUYER-HARD-STOP.md              # raised bar (brainstormer)
  P02-FREEZE-LIST.md              # handoff
  vitest-capability-smoke-raw.log
  vitest-hostWiringP01-raw.log    # recommended extra
  CP-01-LEDGER.md                 # if Plans CHECKPOINTS missing
```

Optional wave root (only if truly missing after restore attempt):

```text
results/planner/world-standard-wave/WAVE.md   # if restoring; else note MISSING in INVENTORY
results/planner/world-standard-wave/COMPARISON-CHART.md
```

### 4.2 Modify (product)

**None** under `site/features/planner/open3d/**`, app routes, or package code for feature behavior.

### 4.3 Test (run; optional assert-only if already green)

| Path | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/hostWiringP01.test.ts` | Dual entry + fabric redirect + flag |
| Smoke set (keyboard, threeViewerInner, feasibility canvas, saveReload, status labels) | CP-01 smoke |
| `applySelectionDelete.test.ts` | Optional W3 code-present support cite |

**Do not** add Playwright product journeys in this phase.

### 4.4 Read-only sources (claims corpus — live paths)

```text
site/features/planner/open3d/README.md
site/features/planner/_archive/fabric/README.md
Plans/Research/Others/04-HONEST-QUALITY.md
Plans/Research/Others/08-EVIDENCE-INDEX.md
Plans/Research/Others/09-VERIFY-SNAPSHOT.md
Plans/Research/Others/00-PENDING.md
Plans/Research/Others/19-GOALS-SLICES.md
Plans/Research/Others/SESSION-RECAP.md
docs/superpowers/specs/2026-07-09-world-standard-planner-design.md
Plans/phases/P01-product-truth/P01-product-truth.md  # status claims
# WAVE.md only if results restored
```

---

## 5. Architecture & data flow (inventory subject)

```text
                    ┌─────────────────────────────┐
 /planner/guest ──► │ Open3dPlannerWorkspaceRoute │
 /planner/canvas ─► │ Providers + ProjectSetupGate│
                    └─────────────┬───────────────┘
                                  ▼
                    ┌─────────────────────────────┐
 /planner/open3d ────────────────► Open3dPlannerHost
                    └─────────────┬───────────────┘
                                  ▼
                           Open3dNativeHost
                                  ▼
                          OOPlannerWorkspace
                     ┌────────────┴────────────┐
                     ▼                         ▼
            FeasibilityCanvas           ThreeLazyViewer
            (walls, pick, place)        → ThreeViewerInner
                     │                   OrbitControls if enableControls
                     ▼
              Open3dProject (UUID, mm)
                     │
                     ▼
           useOpen3dWorkspaceAutosave → IDB
           formatAutosaveStatus → local labels only
```

**Inventory freezes this diagram in ROUTES.md + INVENTORY engine table — does not change it.**

---

## 6. Task list (execute in order)

### Task 00: Preconditions + evidence scaffold

**Files:**
- Create: `results/planner/world-standard-wave/00-product-truth/run.json`
- Create: `results/planner/world-standard-wave/00-product-truth/HEAD.txt`
- Create: (optional) parent dirs only

- [ ] **Step 1: Confirm single worktree**

```powershell
cd D:\OandO07072026
git rev-parse --show-toplevel
git worktree list
```

Expected: single worktree at `D:\OandO07072026` (or path-equivalent). **Stop** if extra worktrees — do not inventory across worktrees.

- [ ] **Step 2: Attempt evidence recovery (before thrash)**

```powershell
cd D:\OandO07072026
Test-Path "results\planner\world-standard-wave\00-product-truth\INVENTORY.md"
Test-Path "E:\OandO-backups\trustdata-2026-07-10"
```

| Outcome | Action |
|---------|--------|
| Local INVENTORY exists | Diff vs HEAD; if complete pack, mark re-verify smoke only (still run Tasks 05 smoke + matrix spot-check) |
| E: backup exists with pack | Copy **only** `world-standard-wave/00-product-truth` into local results; then re-verify key files + smoke against current HEAD |
| Neither | Full re-run from Step 3 |

- [ ] **Step 3: Create evidence root**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
```

- [ ] **Step 4: Write HEAD.txt**

```powershell
cd D:\OandO07072026
git rev-parse HEAD | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\HEAD.txt"
git status -sb | Add-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\HEAD.txt"
```

- [ ] **Step 5: Write run.json (start)**

Create `results/planner/world-standard-wave/00-product-truth/run.json` with real values (replace angle brackets):

```json
{
  "phase": "P01-product-truth",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/00-product-truth",
  "scope": "inventory-only",
  "approach": "A",
  "worktrees": false,
  "commitAsWeGo": true,
  "startedAt": "<ISO-8601>",
  "head": "<git rev-parse HEAD>",
  "agent": "P01-inventory-executor",
  "vitestSmoke": "pending",
  "vitestSmokeReason": "",
  "cp01": "in-progress",
  "blockers": [],
  "recovery": {
    "localResultsPresentAtStart": false,
    "eDriveChecked": true,
    "eDriveRestored": false
  },
  "pathAuthority": {
    "plansLive": "Plans/phases + Plans/Research",
    "honestyDocs": "Plans/Research/Others",
    "forbiddenEvidenceFolder": "01-product-truth"
  },
  "counts": {
    "filesListed": 0,
    "claimsRegistered": 0,
    "gatesFilled": 0,
    "contradictions": 0
  }
}
```

- [ ] **Step 6: Commit scaffold**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git status -sb
git commit -m "evidence(P01): product-truth scaffold + HEAD (re-open; results was missing)"
```

**Stop-if-fail:** cannot create directory or git commit blocked → append `Failures.md`, set `cp01: "blocked"`.

---

### Task 01: Tree inventory of production open3d

**Files:**
- Create: `open3d-file-list.txt`, `open3d-folder-counts.tsv`, `key-files-exist.tsv`

- [ ] **Step 1: Directory listing**

```powershell
cd D:\OandO07072026
Get-ChildItem -Path "site\features\planner\open3d" -Recurse -File |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\open3d-file-list.txt"
```

Expected: non-empty list; includes `FeasibilityCanvas.tsx`, `OOPlannerWorkspace.tsx`, `ThreeViewerInner.tsx`.

- [ ] **Step 2: Counts by top-level folder**

```powershell
cd D:\OandO07072026
Get-ChildItem "site\features\planner\open3d" -Directory |
  ForEach-Object {
    $n = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object).Count
    "{0}`t{1}" -f $_.Name, $n
  } |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\open3d-folder-counts.tsv"
```

- [ ] **Step 3: Key files existence matrix**

```powershell
cd D:\OandO07072026
@(
  "site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx",
  "site\features\planner\open3d\editor\OOPlannerWorkspace.tsx",
  "site\features\planner\open3d\3d\ThreeViewerInner.tsx",
  "site\features\planner\open3d\3d\ThreeLazyViewer.tsx",
  "site\features\planner\open3d\3d\orbitDefaults.ts",
  "site\features\planner\open3d\ui\Open3dNativeHost.tsx",
  "site\features\planner\ui\Open3dPlannerHost.tsx",
  "site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx",
  "site\features\planner\open3d\editor\useWorkspaceKeyboard.ts",
  "site\features\planner\open3d\editor\useWorkspaceCanvas.ts",
  "site\features\planner\open3d\editor\workspaceStatusLabels.ts",
  "site\features\planner\open3d\editor\workspaceEntityHelpers.ts",
  "site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts",
  "site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts",
  "site\features\planner\open3d\cleanup\importGraphProof.ts",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric",
  "site\config\build\next.config.js",
  "site\tests\unit\features\planner\open3d\hostWiringP01.test.ts",
  "site\app\planner\(workspace)\guest\page.tsx",
  "site\app\planner\(workspace)\canvas\page.tsx",
  "site\app\planner\open3d\page.tsx"
) | ForEach-Object {
  "{0}`t{1}" -f $_, (Test-Path $_)
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\key-files-exist.tsv"
```

**Every path must be `True`.** If any `False`:

```powershell
# append Failures.md then stop
Add-Content -Encoding utf8 "D:\OandO07072026\Failures.md" @"
## P01 blocked $(Get-Date -Format o)
key-files-exist.tsv has False path(s). See results/planner/world-standard-wave/00-product-truth/key-files-exist.tsv
"@
```

Set `run.json` `"cp01": "blocked"`. Do not invent alternate paths.

- [ ] **Step 4: Update run.json counts.filesListed**

Set `counts.filesListed` to line count of `open3d-file-list.txt`.

- [ ] **Step 5: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): open3d tree inventory file lists"
```

---

### Task 02: Route and host wiring (claims vs code)

**Files:**
- Create: `host-wiring-rg.txt`, `fabric-redirect-and-archive-rg.txt`, `ROUTES.md`
- Test: run `hostWiringP01.test.ts` (see steps)

- [ ] **Step 1: Write failing inventory lock expectation (TDD — unit already exists; re-run as red/green proof)**

This phase does **not** invent new product tests unless hostWiringP01 fails. First **run** the lock:

```powershell
cd D:\OandO07072026
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-hostWiringP01-raw.log"
```

Expected: **PASS** 4 tests (dual entry, source imports, no fabric pages + redirects, fabric flag OFF).  
If **FAIL**: treat as inventory fact — do **not** “fix product” mid-P01 unless failure is env-only; log blocker; document in CONTRADICTIONS.

Full test source already in repo (do not rewrite product; cite for executors):

```1:129:site/tests/unit/features/planner/open3d/hostWiringP01.test.ts
// P01 product-truth host wiring — pure source / import-graph checks only.
// asserts: dual entry guest/canvas vs open3d pilot;
// no app/planner/fabric pages; next.config redirects;
// isOpen3dFabricFurnitureEnabled default false
```

- [ ] **Step 2: Host import greps**

```powershell
cd D:\OandO07072026
$out = "results\planner\world-standard-wave\00-product-truth"
rg -n "Open3dNativeHost|OOPlannerWorkspace|FeasibilityCanvas|ThreeLazyViewer|ThreeViewerInner|Open3dPlannerHost|Open3dPlannerWorkspaceRoute" site/app/planner site/features/planner --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "$out\host-wiring-rg.txt"
rg -n "planner/fabric|OPEN3D_FABRIC|fabricFurnitureFlag|_archive/fabric" site/config/build/next.config.js site/features/planner site/app/planner --glob "*.{js,ts,tsx,md}" |
  Set-Content -Encoding utf8 "$out\fabric-redirect-and-archive-rg.txt"
```

- [ ] **Step 3: Read route pages and hosts (no edits)**

Read and quote imports only into ROUTES.md:

- `site/app/planner/(workspace)/guest/page.tsx`
- `site/app/planner/(workspace)/canvas/page.tsx`
- `site/app/planner/open3d/page.tsx`
- `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx`
- `site/features/planner/ui/Open3dPlannerHost.tsx`
- `site/features/planner/open3d/ui/Open3dNativeHost.tsx`
- `site/features/planner/open3d/README.md`
- Redirect lines in `site/config/build/next.config.js`
- `site/features/planner/open3d/cleanup/importGraphProof.ts` (stale fabric-legacy rows)
- `site/features/planner/_archive/fabric/README.md` Rollback section

- [ ] **Step 4: Write ROUTES.md**

Create `results/planner/world-standard-wave/00-product-truth/ROUTES.md` using this full template (fill with real quotes):

```markdown
# ROUTES — claims vs code (P01)

## Dual entry

| Entry | Page | Imports | Gates |
|-------|------|---------|-------|
| Guest hybrid | site/app/planner/(workspace)/guest/page.tsx | Open3dPlannerWorkspaceRoute | ProjectSetupGate yes |
| Canvas hybrid | site/app/planner/(workspace)/canvas/page.tsx | Open3dPlannerWorkspaceRoute | ProjectSetupGate yes |
| Open3d pilot | site/app/planner/open3d/page.tsx | Open3dPlannerHost direct | ProjectSetupGate **no** in page |

## Host chain (verified)

### Guest / canvas
page → Open3dPlannerWorkspaceRoute → Providers → ProjectSetupGate → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace → FeasibilityCanvas | ThreeLazyViewer

### Pilot
page → Open3dPlannerHost → Open3dNativeHost → OOPlannerWorkspace → …

## Fabric

| Claim | Code | Match? |
|-------|------|--------|
| app/planner/fabric pages exist | Test-Path false | contradicted |
| /planner/fabric works as Fabric UI | next.config permanent → /planner/open3d/ | contradicted |
| Archive code present | _archive/fabric True | supported |
| Overlay default ON | fabricFurnitureFlag exact 1 only; default false | contradicted if claimed ON |

## CLAIMS-vs-CODE table

| Claim source | Claim text (quote) | Code path | Actual behavior | Match? |
|--------------|-------------------|-----------|-----------------|--------|
| guest page comment | archive fallback: /planner/fabric/guest | next.config.js L206-207 | redirect to open3d | **No** |
| open3d README | Live 2D FeasibilityCanvas | FeasibilityCanvas.tsx | Canvas 2D | **Yes** |
| archive README Rollback | fallback routes unchanged | no pages + redirect | dead | **No** |
| importGraphProof | route-fabric-guest path | pages missing | stale graph | **No** |
| hostWiringP01 | dual entry + redirect | tests pass log | supported | **Yes** |
```

- [ ] **Step 5: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): route and host wiring claims vs code"
```

---

### Task 03: Capability matrix W1–W8 (code surface only)

**Files:**
- Create: `w1-draw-rg.txt` … `w8-shortcuts-rg.txt`, `CAPABILITY-MATRIX.md`

- [ ] **Step 1: Symbol greps (one file per gate)**

```powershell
cd D:\OandO07072026
$out = "results\planner\world-standard-wave\00-product-truth"

rg -n "addOpen3dWall|drawWall|wallTool|useDoorWindowPlacement|addDoor|addWindow" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w1-draw-rg.txt"
rg -n "placementAction|placeModular|cabinet-v0|furnitureBlock2D|Block2D|InventoryPanel|handleInventoryPlace" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w2-place-rg.txt"
rg -n "deleteSelection|applySelectionDelete|selectedFurniture|Backspace|pickFurnitureAtPoint" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w3-select-delete-rg.txt"
rg -n "OrbitControls|enableControls|enableOrbit|viewMode|getOpen3dViewerControlProps|OPEN3D_ORBIT_DEFAULT" site/features/planner/open3d/3d site/features/planner/open3d/editor --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w4-orbit-view-rg.txt"
rg -n "autosave|flush|idb|indexedDB|createAutoSaver|schedulePersist|pagehide" site/features/planner/open3d/persistence site/features/planner/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w5-save-rg.txt"
rg -n "Saved locally|Draft saved|statusLabel|formatAutosaveStatus|memberPlan|guestProject|cloud" site/features/planner/open3d/editor site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w6-honesty-rg.txt"
rg -n "modularCabinet|createSceneObjectFromNode|buildOpen3dSceneNodes|generatedGlb|procedural" site/features/planner/open3d/catalog site/features/planner/open3d/3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w7-mesh-rg.txt"
rg -n "CANVAS_TOOL_SHORTCUTS|key ===|shortcut|paletteCommands|CanvasToolRail|TOOL_BY_SHORTCUT" site/features/planner/open3d/editor site/features/planner/open3d/lib/commands --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w8-shortcuts-rg.txt"
```

Do **not** use bare `2d|3d` as sole W4 pattern.

- [ ] **Step 2: Deep handler read (line notes → matrix)**

Read with line numbers (use editor or `rg -n`):

1. `FeasibilityCanvas.tsx` — props, tools, pickFurnitureAtPoint usage, selection
2. `OOPlannerWorkspace.tsx` — `deleteSelection` (~326), `viewMode`, `getOpen3dViewerControlProps` (~1012), keyboard wiring
3. `ThreeViewerInner.tsx` — OrbitControls (~171–186), `enableControls` default from `OPEN3D_ORBIT_DEFAULT_ENABLED`
4. `useWorkspaceKeyboard.ts` — Delete/Backspace (~83–86)
5. `useOpen3dWorkspaceAutosave.ts` — schedule + flush (~33–74)
6. `workspaceStatusLabels.ts` — formatAutosaveStatus (~31–48)
7. `workspaceEntityHelpers.ts` — applySelectionDelete (~112+)
8. `orbitDefaults.ts` — force enableControls true

- [ ] **Step 3: Write CAPABILITY-MATRIX.md**

Use **only** status tokens:  
`code-present`, `code-partial`, `code-absent`, `unit-green`, `unit-missing`, `browser-missing`, `docs-overclaim` (combine with `+`).

**Rules:**

- No empty gate rows.
- Do **not** mark `unit-green` without smoke log cite or explicit unit file + smoke outcome.
- Do **not** mark browser green without `results/planner/` Playwright pack.

Template (fill path:line from greps/reads):

```markdown
# CAPABILITY-MATRIX — W1–W8 (P01 code surface)

| Gate | Symbol / handler exists? | Path:line | Wired to UI? | Unit test file | Browser proof in results/? | Honest status |
|------|--------------------------|-----------|--------------|----------------|----------------------------|---------------|
| W1 Draw | addOpen3dWall / door-window tools | FeasibilityCanvas.tsx:…; walls.ts; useDoorWindowPlacement.ts | CanvasToolRail + workspace tools | open3dFeasibilityCanvas.test.tsx; doorWindowPlacement.test.ts | browser-missing | code-present+unit-?+browser-missing |
| W2 Place | placementAction; InventoryPanel; modularCabinetV0 | placementAction.ts; InventoryPanel.tsx; OOPlannerWorkspace handleInventoryPlace | Inventory place arm | modular*/placement* unit | browser-missing | code-present+browser-missing |
| W3 Select/delete | pickFurniture; deleteSelection; applySelectionDelete; Del/Backspace | canvasPicking; OOPlannerWorkspace:326; useWorkspaceKeyboard:83; workspaceEntityHelpers:112 | select tool + keyboard | applySelectionDelete.test.ts; open3dWorkspaceKeyboard.test.tsx | browser-missing | code-present+unit-?+browser-missing (buyer-usable unverified) |
| W4 2D↔3D+orbit | viewMode; OrbitControls; getOpen3dViewerControlProps | OOPlannerWorkspace viewMode; ThreeViewerInner:171; orbitDefaults.ts; workspace ~1012 | TopBar 2d/3d | threeViewerInner; poseContinuityW4; orbitControlsDefault | browser-missing | code-present+browser-missing; docs-overclaim if WAVE says no orbit |
| W5 Save reload | createAutoSaver; flush pagehide | useOpen3dWorkspaceAutosave.ts | autosave on project change | saveReloadContinuity.test.ts | browser-missing | code-present+unit-?+browser-missing |
| W6 Honesty | formatAutosaveStatus local strings | workspaceStatusLabels.ts:31-48; TopBar | status strip | workspaceStatusLabels.test.ts | browser-missing | code-present (local-only labels) |
| W7 Mesh | modularCabinet; scene nodes | modularCabinetV0.ts; createSceneObjectFromNode.ts | place path | modular* tests | browser-missing | code-partial (bar later) |
| W8 Shortcuts | CANVAS_TOOL_SHORTCUTS; invert map | canvasTool.ts:28-38; useWorkspaceKeyboard | CanvasToolRail labels | toolShortcutTruth; canvasToolRail.a11y | browser-missing | code-present+unit-? |

## Status vocabulary used
…list combinations…

## Notes
- Browser column is missing because results/ was absent at inventory start.
- unit-green only after Task 05 smoke cites.
```

- [ ] **Step 4: Set counts.gatesFilled = 8**

- [ ] **Step 5: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): W1-W8 capability matrix from live code greps"
```

---

### Task 04: Claims corpus

**Files:**
- Create: `claims-sources-concat.txt`, `CLAIMS-REGISTER.md`, `fabric-flag-rg.txt`

- [ ] **Step 1: Concat claim sources (live paths)**

```powershell
cd D:\OandO07072026
@(
  "Plans\Research\Others\04-HONEST-QUALITY.md",
  "Plans\Research\Others\08-EVIDENCE-INDEX.md",
  "Plans\Research\Others\09-VERIFY-SNAPSHOT.md",
  "Plans\Research\Others\00-PENDING.md",
  "Plans\Research\Others\19-GOALS-SLICES.md",
  "Plans\Research\Others\SESSION-RECAP.md",
  "docs\superpowers\specs\2026-07-09-world-standard-planner-design.md",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric\README.md",
  "Plans\phases\P01-product-truth\P01-product-truth.md",
  "results\planner\world-standard-wave\WAVE.md"
) | ForEach-Object {
  "===== $_ ====="
  if (Test-Path $_) { Get-Content $_ -Raw } else { "(MISSING FILE)" }
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\claims-sources-concat.txt"
```

- [ ] **Step 2: Fabric flag grep**

```powershell
cd D:\OandO07072026
rg -n "OPEN3D_FABRIC_FURNITURE|fabricFurnitureFlag|isOpen3dFabricFurnitureEnabled" site/features/planner/open3d --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\fabric-flag-rg.txt"
```

- [ ] **Step 3: Write CLAIMS-REGISTER.md (≥11 material + extras)**

Minimum + raised-bar extras:

```markdown
# CLAIMS-REGISTER (P01)

| ID | Source path | Claim (verbatim short) | Verified against | Verdict |
|----|-------------|------------------------|------------------|---------|
| C01 | open3d/README.md | Live 2D is FeasibilityCanvas not Fabric full stage | FeasibilityCanvas path; fabric flag | supported |
| C02 | fabricFurnitureFlag.ts | Overlay only when env exact 1 | flag + hostWiringP01 | supported |
| C03 | archive README / guest comments | /planner/fabric/* Fabric fallback | next.config redirect; no pages | contradicted |
| C04 | 04-HONEST-QUALITY.md | P0 spine ≠ ship quality | design north star; no results browser pack | supported |
| C05 | design spec honest-today | no furniture select/delete | deleteSelection + pick + units | re-verify (code-present; buyer unproven) |
| C06 | 04-HONEST-QUALITY | modular place boxes partial | modular mesh code; historical honesty | supported (partial mesh) |
| C07 | WAVE (if present) / historical | no orbit controls | ThreeViewerInner OrbitControls + defaults ON | contradicted if WAVE says none |
| C08 | workspaceStatusLabels | save local IDB labels | formatAutosaveStatus strings | supported |
| C09 | RESULTS-MAP / missing results | no world-standard journey pack under wave | results missing | supported (browser-missing) |
| C10 | newEntityId / model | entity IDs crypto UUID | newEntityId import in FeasibilityCanvas | supported (spot-check) |
| C11 | route pages | dual entry guest/canvas vs open3d | hostWiringP01 + pages | supported |
| C12 | P01-product-truth.md status | CP-01 PASS DONE 2026-07-09 | results/ missing | stale |
| C13 | 19-GOALS-SLICES | product truth / gates PASS | no map files | stale / unverified |
| C14 | importGraphProof | fabric-legacy page routes exist | Test-Path false | contradicted |
| C15 | oando-render-options (research) | SVG on canvas as one path | furnitureBlock2D Path2D vs publish svg | must-split (three authorities) |
| C16 | canvasTool.ts | Dimension shortcut M; Door D | CANVAS_TOOL_SHORTCUTS | supported |
```

Verdicts: `supported` | `contradicted` | `stale` | `unverified`.

- [ ] **Step 4: Update counts.claimsRegistered**

- [ ] **Step 5: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): claims register vs live code"
```

---

### Task 05: Existing tests + results map + required vitest smoke

**Files:**
- Create: `unit-test-list.txt`, `e2e-planner-spec-names.txt`, `results-planner-dirs.txt`, `EVIDENCE-COVERAGE.md`, `vitest-capability-smoke-raw.log`

- [ ] **Step 1: List open3d unit tests**

```powershell
cd D:\OandO07072026
Get-ChildItem "site\tests\unit\features\planner\open3d" -Recurse -File -Filter "*.ts*" |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\unit-test-list.txt"
```

- [ ] **Step 2: List Playwright planner-related specs**

```powershell
cd D:\OandO07072026
$names = @(
  Get-ChildItem "site\tests\e2e" -File -Filter "*planner*" | ForEach-Object { $_.Name }
  Get-ChildItem "site\tests\e2e" -File -Filter "open3d-*" | ForEach-Object { $_.Name }
  @("admin-svg-publish-p01.spec.ts", "sketch-to-plan-pipeline.spec.ts") |
    Where-Object { Test-Path "site\tests\e2e\$_" }
) | Sort-Object -Unique
$names | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\e2e-planner-spec-names.txt"
```

- [ ] **Step 3: Map results/planner directories**

```powershell
cd D:\OandO07072026
if (Test-Path "results\planner") {
  Get-ChildItem "results\planner" -Directory |
    Select-Object -ExpandProperty Name |
    Sort-Object |
    Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\results-planner-dirs.txt"
} else {
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\results-planner-dirs.txt" "(results/planner missing at inventory — only 00-product-truth being created)"
}
```

- [ ] **Step 4: Write EVIDENCE-COVERAGE.md**

```markdown
# EVIDENCE-COVERAGE (P01)

| Concern | Unit test path(s) | results/planner/* dir | Covers W? | Gap for world-standard |
|---------|-------------------|----------------------|-----------|------------------------|
| Host wiring | hostWiringP01.test.ts | 00-product-truth (this run) | baseline | n/a |
| Keyboard / W8 | open3dWorkspaceKeyboard; toolShortcutTruth | (missing historical) | W8 partial | P09 browser |
| Select delete pure | applySelectionDelete.test.ts | (missing) | W3 unit only | P03 browser required |
| Orbit defaults | orbitControlsDefault; threeViewerInner; poseContinuityW4 | (missing) | W4 unit | P04 browser |
| Save continuity | saveReloadContinuity.test.ts | historical save-reload-continuity if restored | W5 unit | P06 browser hard reload |
| Status honesty | workspaceStatusLabels.test.ts | (missing) | W6 unit | P06 UI proof |
| Journey e2e specs in tree | open3d-world-standard-journey.spec.ts etc. | **no green folder** | W1–W2 code only | Must not claim PASS without 02-browser-open3d-journey artifacts |
| WAVE / COMPARISON | n/a | missing at start | context | research not gate |

## Explicit notes
- world-standard-wave today holds only recreated 00-product-truth until WAVE restored.
- Template journey folder `02-browser-open3d-journey/` is P07 — not P01.
- Prior p0-* dirs prove spines only if restored from backup; not W1–W8 alone.
- Specs living under site/tests/e2e do **not** equal RESULTS-MAP green.
```

- [ ] **Step 5: Required unit smoke attempt**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/threeViewerInner.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-capability-smoke-raw.log"
```

Then set `run.json`:

| Outcome | vitestSmoke | vitestSmokeReason |
|---------|-------------|-------------------|
| Exit 0, log non-empty | `ok` | `""` |
| Non-zero / env failure | `failed` | first-line reason |
| Owner waived only | `skipped` | waiver text |

**Silent skip = CP-01 fail.**

Optional broader:

```powershell
cd D:\OandO07072026\site
pnpm run test:planner 2>&1 | Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\vitest-test-planner-raw.log"
```

- [ ] **Step 6: Back-fill matrix unit-green tokens** only where smoke/log + unit-test-list support it.

- [ ] **Step 7: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): unit/e2e/results coverage map and smoke logs"
```

---

### Task 06: Deep-read notes (three cores)

**Files:**
- Create: `NOTE-FeasibilityCanvas.md`, `NOTE-OOPlannerWorkspace.md`, `NOTE-ThreeViewerInner.md`

- [ ] **Step 1: NOTE-FeasibilityCanvas.md**

Required headings (fill from live read — sample seed from planner repo read 2026-07-10):

```markdown
# NOTE — FeasibilityCanvas.tsx

## 1. Props / handle API
- forwardRef canvas; tools via PlannerTool; project/update callbacks from workspace canvas context
- Commands via feasibilityCommands registry; toolToCommandId maps wall → draw-wall

## 2. Tools implemented
- wall draw, room, door/window/opening, dimension, placement, select, pan, text (as found)
- snapping via snapDrawingPoint; transforms INITIAL_TRANSFORM scale 0.1

## 3. Furniture hit-testing / selection
- pickFurnitureAtPoint, pickOpeningAtPoint, pickWallAtPoint from canvasPicking
- Block2D render via furnitureBlock2DFromItem + renderBlock2DCentered

## 4. What it does **not** do
- Not Fabric.js stage
- Not cloud sync
- Not full 3D

## 5. Dependencies
- model/actions walls; pureActions doors/windows/rooms; newEntityId; proofCatalog
```

- [ ] **Step 2: NOTE-OOPlannerWorkspace.md**

```markdown
# NOTE — OOPlannerWorkspace.tsx

## 1. Composition tree
- TopBar (2d/3d), CanvasToolRail, InventoryPanel, Properties, FeasibilityCanvas vs ThreeLazyViewer by viewMode
- Optional FurnitureFabricLayer when isOpen3dFabricFurnitureEnabled()

## 2. deleteSelection
- useCallback: applySelectionDelete(project, selection); clear selection
- Entity types via CanvasSelection + COLLECTION_BY_SELECTION in helpers
- Single history step (comment in source)

## 3. Keyboard wiring
- useWorkspaceKeyboard({ deleteSelection, toggleView, undo, redo, … })

## 4. Persistence hooks
- useOpen3dWorkspaceAutosave(project, guestMode, planId, …)

## 5. Guest vs member
- guestMode prop; status labels branch in formatAutosaveStatus
- canvas route computes guest from auth; guest route forces guestMode
```

- [ ] **Step 3: NOTE-ThreeViewerInner.md**

```markdown
# NOTE — ThreeViewerInner.tsx (+ ThreeLazyViewer)

## 1. Scene construction entry
- dynamic import("three"); buildOpen3dSceneNodes + addNodesToGroup; content group open3d-document-content

## 2. OrbitControls
- enableControls default OPEN3D_ORBIT_DEFAULT_ENABLED (true)
- if enableControls: import OrbitControls jsm; construct; setOrbitEnabled(true)
- Workspace product path: {...getOpen3dViewerControlProps()} forces enableControls: true

## 3. GLB vs procedural
- shouldLoadGlb policy; loadGeneratedGlbObject path; else procedural nodes

## 4. Continuity / camera
- rebuild from projectData floors; dispose on unmount/cancel

## 5. Known failure modes
- late load cancel (disposed flag)
- unmount during OrbitControls import

## 6. Docs conflict
- Historical WAVE “no orbit” vs code presence path:line (~171-186) = docs-overclaim if WAVE unrestored still cited
```

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): deep-read notes for canvas workspace viewer"
```

---

### Task 07: BUYER-HARD-STOP + P02 freeze (raised bar)

**Files:**
- Create: `BUYER-HARD-STOP.md`, `P02-FREEZE-LIST.md`

- [ ] **Step 1: BUYER-HARD-STOP.md**

```markdown
# Buyer hard stop (P01 raised bar)

1. **URL opened:** `/planner/guest` or `/planner/open3d` (record which)
2. **First success:** (from matrix — e.g. workspace shell loads; wall tool arms — code-present)
3. **First failure (hypothesis until manual observation):**  
   - If select/delete not buyer-usable despite handlers → W3  
   - If 3D static / no orbit in browser → W4  
   - If reload loses plan → W5  
   - If blank canvas abandon → ease (adjacent)
4. **Gate:** (W3/W4/W5/…)
5. **Code pointer:** path:line from matrix
6. **Evidence pointer:** browser-missing unless results pack exists
7. **Honesty:** Code-present ≠ unaided buyer success

## Manual 15-minute script (observation only — no Playwright product work)

| Step | Action | Pass/Fail note |
|------|--------|----------------|
| 1 | Open /planner/guest | |
| 2 | Draw wall | |
| 3 | Place door | |
| 4 | Place 2 catalog items incl storage | |
| 5 | Select furniture + Delete | |
| 6 | Toggle 3D + orbit | |
| 7 | Wait autosave; hard reload | |
| 8 | Read save label | |

Executor fills Pass/Fail from observation if time; otherwise leave Fail/unobserved and keep browser-missing.
```

- [ ] **Step 2: P02-FREEZE-LIST.md**

```markdown
# P02 freeze list (from P01)

## Engines
1. Live interactive 2D = FeasibilityCanvas — do not thrash to Fabric mid-W.
2. Fabric full stage = destination after W green; flag path preserved; default OFF.
3. /planner/fabric* = permanent redirect to open3d — not a working Fabric UI.
4. 3D = imperative ThreeViewerInner — do not port to R3F Canvas mid-gate.
5. Orbit = product ON (orbitDefaults + getOpen3dViewerControlProps); three-layer proof later in P04.
6. Persistence = local IDB + honest local labels; do not market cloud until wired.
7. Entity IDs = crypto/newEntityId; furniture rotation degrees (EXPERT-PASS false-reverse).
8. No Konva+Fabric interactive hybrid.
9. importGraphProof fabric-legacy page nodes are stale relative to redirects — fix graph in later cleanup, not mid-W thrash.
10. Approach A locked — do not reopen Fabric-first or chrome-first as default.

## Do-not-thrash myths
- Fabric is live 2D
- Orbit absent because WAVE said so
- Unit green = browser green
- CP-01 forever after results prune
- SVG inventory path = canvas authority
```

- [ ] **Step 3: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): buyer hard stop + P02 freeze list"
```

---

### Task 08: Canonical inventory pack + CP-01 ready

**Files:**
- Create: `INVENTORY.md`, `CONTRADICTIONS.md`, `PRODUCT-TRUTH.md`, `README.md`, finalize `run.json`, `CP-01-LEDGER.md`

- [ ] **Step 1: Write INVENTORY.md**

```markdown
# Product inventory — open3d (P01)

## Dual-state status
- **CP-01 artifacts:** ready-for-review (or pass after reviewer)
- **Buyer product truth:** not ship / partial (never “PASS” alone)

## One-paragraph reality
Today a facilities buyer can open `/planner/guest` or `/planner/canvas` (WorkspaceRoute + setup gate) or `/planner/open3d` (direct host) into the open3d workspace: **FeasibilityCanvas** 2D + **Three** 3D. Live 2D is not Fabric full stage; Fabric furniture overlay is flag-gated (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`); `/planner/fabric*` permanently redirects to open3d. Select/delete **handlers and pure delete exist** (OOPlannerWorkspace + applySelectionDelete + keyboard); buyer-visible journey remains **browser-missing** until P03 evidence. OrbitControls construct with product defaults ON; browser orbit proof is P04. Save is local IDB with honest local status strings (W6 code). Mesh/catalog spines exist; manufacturer bar is later. **This is a real spine, not ship quality.**

## Engine truth
| Layer | Live engine | Flag / archive / redirect |
|-------|-------------|---------------------------|
| 2D interactive | FeasibilityCanvas | Fabric overlay flag OFF default |
| Fabric full stage | not live | `_archive/fabric` + future 2B |
| Fabric URLs | redirect → /planner/open3d/ | next.config permanent |
| 3D | ThreeViewerInner imperative | Orbit default ON |
| Persist | IDB autosave | local labels |

## Host / routes
(dual entry — cite ROUTES.md)

## Gate snapshot (W1–W8)
| Gate | Code | Unit | Browser | Blocker one-liner |
|------|------|------|---------|-------------------|
| W1 | … from matrix | … | browser-missing | journey pack later |
| W2 | … | … | browser-missing | |
| W3 | … | … | browser-missing | unit≠buyer |
| W4 | … | … | browser-missing | |
| W5 | … | … | browser-missing | |
| W6 | … | … | browser-missing | |
| W7 | … | … | browser-missing | bar P08 |
| W8 | … | … | browser-missing | |

## Evidence index
- CAPABILITY-MATRIX.md
- CLAIMS-REGISTER.md
- CONTRADICTIONS.md
- NOTE-*
- EVIDENCE-COVERAGE.md
- BUYER-HARD-STOP.md
- P02-FREEZE-LIST.md
- greps + smoke logs

## Inputs for P02 engine lock
See P02-FREEZE-LIST.md — cite CAPABILITY-MATRIX + CONTRADICTIONS.

## CP-01
- status: ready-for-review
- reviewer:
- date:
- notes: re-opened because results/ missing 2026-07-10; full pack recreated under 00-product-truth/
```

- [ ] **Step 2: Write CONTRADICTIONS.md**

Pull all `contradicted`/`stale` claims + known X01–X11. Minimum topics:

- Fabric fallback vs redirects  
- importGraphProof stale fabric pages  
- Orbit / WAVE wording vs ThreeViewerInner  
- Save / cloud honesty (if any overclaim)  
- Select-delete design-spec vs code  
- P0/P01 DONE vs missing evidence  
- Plans/trustdata fossils  
- Scoreboard PASS vs map files  

```markdown
| ID | Claim source | Claim | Code / config path | Evidence | Severity |
|----|--------------|-------|--------------------|----------|----------|
| X01 | P01-product-truth.md | CP-01 PASS DONE | results/ missing | this pack recreate | P0 |
| X03 | archive README | fabric fallback routes | next.config.js | fabric-redirect-and-archive-rg | P0 |
| X06 | importGraphProof.ts | fabric-legacy pages | pages missing | hostWiringP01 | P0 |
| … | … | … | … | … | … |
```

- [ ] **Step 3: PRODUCT-TRUTH.md pointer**

```markdown
# PRODUCT-TRUTH

Canonical inventory: [INVENTORY.md](./INVENTORY.md)  
Contradictions: [CONTRADICTIONS.md](./CONTRADICTIONS.md)  
Buyer hard stop: [BUYER-HARD-STOP.md](./BUYER-HARD-STOP.md)  
P02 freeze: [P02-FREEZE-LIST.md](./P02-FREEZE-LIST.md)
```

- [ ] **Step 4: Folder README.md**

List every artifact with one-line purpose; mark INVENTORY + CONTRADICTIONS as **CP-01 required**.

- [ ] **Step 5: Finalize run.json**

```json
{
  "finishedAt": "<ISO-8601>",
  "headEnd": "<git rev-parse HEAD>",
  "vitestSmoke": "ok|failed|skipped",
  "vitestSmokeReason": "",
  "cp01": "ready-for-review",
  "blockers": [],
  "counts": {
    "filesListed": <n>,
    "claimsRegistered": <n>,
    "gatesFilled": 8,
    "contradictions": <n>
  }
}
```

- [ ] **Step 6: CP-01-LEDGER.md** (CHECKPOINTS absent)

```markdown
# CP-01 ledger (local — Plans/Research/checkpoints missing)

| Field | Value |
|-------|-------|
| Status | ready-for-review |
| Date | <ISO date> |
| Evidence | results/planner/world-standard-wave/00-product-truth/ |
| Reviewer | |
| Pass criteria checklist | see phase P01 CP-01 table |
```

- [ ] **Step 7: Final evidence commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git status -sb
git commit -m "evidence(P01): product truth inventory ready for CP-01 review"
```

---

### Task 09: CP-01 reviewer close (owner/unlocked reviewer only)

- [ ] **Step 1:** Verify all CP-01 criteria (§8).

- [ ] **Step 2:** Footer in INVENTORY.md:

```markdown
## CP-01
- status: pass
- reviewer: <name>
- date: <YYYY-MM-DD>
- notes: full pack under 00-product-truth/; re-prove after results prune
```

- [ ] **Step 3:** `run.json` `"cp01": "pass"` or `"fail"`.

- [ ] **Step 4:** Commit:

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "checkpoint(CP-01): product truth pass|fail"
```

Until pass, **do not** start P02 implementation.

---

## 7. Test matrix

| Test | Command | Expected | Maps to |
|------|---------|----------|---------|
| hostWiringP01 | `pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose` | PASS ~4 tests | dual entry, fabric redirect, flag |
| Capability smoke | Task 05 Step 5 command | PASS or logged fail | CP-01 smoke |
| applySelectionDelete | `… applySelectionDelete.test.ts` | PASS (optional cite) | W3 pure |
| workspaceStatusLabels | in smoke set | PASS | W6 labels |
| threeViewerInner | in smoke set | PASS | W4 orbit construct unit |
| Playwright open3d-world | **do not run for green claim in P01** | n/a | list only |
| Manual buyer script | BUYER-HARD-STOP | observation notes | raised bar |

### Expected smoke log shape (ok)

```text
✓ open3dWorkspaceKeyboard …
✓ threeViewerInner …
✓ open3dFeasibilityCanvas …
✓ saveReloadContinuity …
✓ workspaceStatusLabels …
Test Files  5 passed
```

(Exact counts may differ; non-empty log + exit 0 required for `ok`.)

---

## 8. False-green catalog (how this plan blocks)

| Trap | Plan control |
|------|--------------|
| Treat phase DONE as true | Task 00 re-open when results missing |
| WAVE as code | CLAIMS + three-way orbit |
| unit-green without log | Task 05 required smoke |
| browser-green | Explicit browser-missing default |
| Fabric live | ROUTES + hostWiring + redirects |
| Scoreboard PASS | CONTRADICTIONS X11 / dual-state |
| Edit product mid-inventory | Scope: evidence only |
| Worktree | Task 00 worktree list |
| Empty matrix | gatesFilled=8 required |
| SVG one-path myth | Claim C15 + freeze note |
| Orbit default-only | NOTE forces prop + data-attr layers documented |
| Silent smoke skip | vitestSmoke pending forbidden |

---

## 9. Stop-if-fail / CP-01 criteria

### Stop-if-fail

| Condition | Action |
|-----------|--------|
| Key file False | Failures.md; cp01 blocked |
| Cannot write results/ | Failures.md; stop |
| Product change seems required to inventory | stop; ask owner |
| Vitest smoke silently skipped | CP-01 fail |
| Invented paths | CP-01 fail |

### CP-01 pass criteria (all required)

| # | Criterion | Artifact |
|---|-----------|----------|
| 1 | Non-empty file list | open3d-file-list.txt |
| 2 | Key files all True | key-files-exist.tsv |
| 3 | Dual entry + fabric redirect | ROUTES.md + greps |
| 4 | W1–W8 matrix filled | CAPABILITY-MATRIX.md |
| 5 | ≥11 claims | CLAIMS-REGISTER.md |
| 6 | Canonical inventory + contradictions | INVENTORY.md, CONTRADICTIONS.md |
| 7 | Three deep notes | NOTE-* |
| 8 | Coverage map | EVIDENCE-COVERAGE.md |
| 9 | Vitest smoke attempted | log + vitestSmoke ≠ pending |
| 10 | run.json meta real | run.json |
| 11 | Commits; no worktree; no push unless asked | git log / worktree list |
| 12 (raised) | Buyer hard stop + freeze list | BUYER-HARD-STOP.md, P02-FREEZE-LIST.md |

### CP-01 fail conditions

- Missing INVENTORY or CONTRADICTIONS  
- Empty/invented gate rows  
- Browser journey green without Playwright under results/planner/  
- Product feature edits while inventorying  
- Worktrees  
- Silent vitest skip  
- WAVE bullets as code without path:line  

---

## 10. Commit sequence

| Commit | Message |
|--------|---------|
| 1 | `evidence(P01): product-truth scaffold + HEAD (re-open; results was missing)` |
| 2 | `evidence(P01): open3d tree inventory file lists` |
| 3 | `evidence(P01): route and host wiring claims vs code` |
| 4 | `evidence(P01): W1-W8 capability matrix from live code greps` |
| 5 | `evidence(P01): claims register vs live code` |
| 6 | `evidence(P01): unit/e2e/results coverage map and smoke logs` |
| 7 | `evidence(P01): deep-read notes for canvas workspace viewer` |
| 8 | `evidence(P01): buyer hard stop + P02 freeze list` |
| 9 | `evidence(P01): product truth inventory ready for CP-01 review` |
| 10 | `checkpoint(CP-01): product truth pass\|fail` (reviewer) |

Push: only if owner standing rules allow (AGENTS: agent may push main when landable; this inventory evidence is landable when pack complete). Mayoite mirror per ELON standard ~45m if long session.

---

## 11. Risks & owner decisions

| Risk | Mitigation | Owner decision? |
|------|------------|-----------------|
| results intentionally pruned | re-run pack | Confirm if E: is source of truth |
| CHECKPOINTS.md missing | CP-01-LEDGER.md local | Recreate Plans checkpoints later? |
| design “no select/delete” vs code | matrix dual: code vs buyer | Accept code-present ≠ W3 pass |
| importGraphProof stale | document; do not fix mid-P01 unless unlocked | Cleanup phase later |
| Dual program global-standard vs wave | evidence still under world-standard-wave | Confirm authority |
| Cloud next vs systems catalog | out of P01 | Post-wave product |

### Owner questions (optional)

1. Reopen CP-01 until artifacts restored? **Plan assumes yes.**  
2. Prefer restore from E: over recreate?  
3. Fix importGraphProof fabric-legacy rows now (tiny honesty) or later? Default: **later** (inventory-only).  

---

## 12. Self-review vs brainstormer + repo

| Requirement | Covered? |
|-------------|----------|
| Repo first then Idiots REPORT | Yes |
| results missing = re-prove | Task 00 + X01 |
| INVENTORY + CONTRADICTIONS | Task 08 |
| Dual entry + fabric redirect | Task 02 + hostWiring |
| W1–W8 matrix | Task 03 |
| Vitest smoke required | Task 05 |
| Buyer hard stop raised bar | Task 07 |
| Approaches A/B/C hybrid | §2.1 |
| False-green catalog | §8 |
| No site product feature edits | §4.2 |
| No Idiots2 | Not read |
| Ethics non-copy | §3 |
| Full commands no TBD | Tasks 00–09 |
| P02 freeze handoff | Task 07 |
| trustdata path fossils | Claims C + honesty live paths |
| SVG triple path | C15 |
| importGraphProof contradiction | X06 / ROUTES |

**Placeholder scan:** No TBD remaining in executable steps. Counts use `<n>` only where measured at runtime (filesListed etc.) — executor fills real integers from artifacts.

**Length honesty:** Plan is extensive because P01 is multi-hour inventory with full artifact contract; inventory-only still requires complete evidence machinery.

---

## 13. Appendices

### Appendix A — Full key path index (must-read / must-exist)

```
site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx
site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
site/features/planner/open3d/editor/useWorkspaceKeyboard.ts
site/features/planner/open3d/editor/useWorkspaceCanvas.ts
site/features/planner/open3d/editor/workspaceStatusLabels.ts
site/features/planner/open3d/editor/workspaceEntityHelpers.ts
site/features/planner/open3d/editor/canvasTool.ts
site/features/planner/open3d/editor/TopBar.tsx
site/features/planner/open3d/editor/InventoryPanel.tsx
site/features/planner/open3d/editor/CanvasToolRail.tsx
site/features/planner/open3d/3d/ThreeViewerInner.tsx
site/features/planner/open3d/3d/ThreeLazyViewer.tsx
site/features/planner/open3d/3d/orbitDefaults.ts
site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts
site/features/planner/open3d/3d/createSceneObjectFromNode.ts
site/features/planner/open3d/ui/Open3dNativeHost.tsx
site/features/planner/ui/Open3dPlannerHost.tsx
site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx
site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts
site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts
site/features/planner/open3d/cleanup/importGraphProof.ts
site/features/planner/open3d/catalog/placementAction.ts
site/features/planner/open3d/catalog/modularCabinetV0.ts
site/features/planner/open3d/catalog/furnitureBlock2D.ts
site/features/planner/open3d/README.md
site/features/planner/_archive/fabric/README.md
site/config/build/next.config.js
site/app/planner/(workspace)/guest/page.tsx
site/app/planner/(workspace)/canvas/page.tsx
site/app/planner/open3d/page.tsx
site/tests/unit/features/planner/open3d/hostWiringP01.test.ts
Plans/phases/P01-product-truth/P01-product-truth.md
Plans/Research/RESULTS-MAP.md
docs/superpowers/specs/2026-07-09-world-standard-planner-design.md
Idiots/P01-product-truth/REPORT.md
```

### Appendix B — Status token definitions

| Token | Meaning |
|-------|---------|
| code-present | Handler/symbol exists and is reachable in production paths |
| code-partial | Exists but incomplete for gate bar |
| code-absent | Not found |
| unit-green | Unit test exists **and** smoke/log supports pass |
| unit-missing | No unit test |
| browser-missing | No RESULTS-MAP browser pack |
| docs-overclaim | Docs/README claim exceeds code or evidence |

### Appendix C — Research translation (ideas only)

| Industry job | Inventory question | Gate |
|--------------|-------------------|------|
| Draw walls then decorate | Wall tools wired? | W1 |
| Place openings on walls | Door/window on wall? | W1 |
| Drag catalog | Inventory place path? | W2 |
| Select + delete | Hit-test + Del? | W3 |
| Instant 2D↔3D | viewMode + same UUIDs? | W4 |
| Leave and return | IDB reload? | W5 |
| Trust save label | local vs cloud strings? | W6 |
| Product looks like product | multiparts? | W7 |
| Labels match keys | CANVAS_TOOL_SHORTCUTS? | W8 |

### Appendix D — Parallelism ownership (optional)

| Agent | Owns |
|-------|------|
| A1 | file lists + key-files |
| A2 | routes + fabric redirect + hostWiring log |
| A3 | W1–W4 greps |
| A4 | W5–W8 greps |
| A5 | claims concat + register draft |
| A6 | unit/e2e lists + smoke |
| Merger | INVENTORY, CONTRADICTIONS, matrix, run.json |

Max 8; no two writers same evidence filename.

### Appendix E — Evidence contract checklist (copy to README)

- [ ] run.json  
- [ ] HEAD.txt  
- [ ] open3d-file-list.txt  
- [ ] open3d-folder-counts.tsv  
- [ ] key-files-exist.tsv  
- [ ] host-wiring-rg.txt  
- [ ] fabric-redirect-and-archive-rg.txt  
- [ ] ROUTES.md  
- [ ] w1…w8 greps  
- [ ] CAPABILITY-MATRIX.md  
- [ ] claims-sources-concat.txt  
- [ ] CLAIMS-REGISTER.md  
- [ ] fabric-flag-rg.txt  
- [ ] unit-test-list.txt  
- [ ] e2e-planner-spec-names.txt  
- [ ] results-planner-dirs.txt  
- [ ] EVIDENCE-COVERAGE.md  
- [ ] NOTE-FeasibilityCanvas.md  
- [ ] NOTE-OOPlannerWorkspace.md  
- [ ] NOTE-ThreeViewerInner.md  
- [ ] INVENTORY.md  
- [ ] CONTRADICTIONS.md  
- [ ] PRODUCT-TRUTH.md  
- [ ] README.md  
- [ ] BUYER-HARD-STOP.md  
- [ ] P02-FREEZE-LIST.md  
- [ ] vitest-capability-smoke-raw.log  
- [ ] CP-01-LEDGER.md (if CHECKPOINTS absent)  

### Appendix F — hostWiringP01 expected assertions (for failure diagnosis)

1. `open3dHybridRoutes()` contains route-guest, route-canvas, workspace-route-open3d  
2. `open3dNativeRoutes()` contains route-open3d-pilot, host-open3d, native-host  
3. Guest/canvas source match WorkspaceRoute; open3d source match Host not WorkspaceRoute  
4. No fabric app paths; next.config redirect regex match  
5. Workspace sources match fabric flag helper; env `{}` → false; `"1"` → true  

### Appendix G — Format autosave strings (W6 inventory quotes)

From live `workspaceStatusLabels.ts`:

| Status | Guest | Member |
|--------|-------|--------|
| saving | Saving locally… | Saving locally… |
| saved | Draft saved locally | Saved locally |
| unsaved | Unsaved draft | Unsaved changes |
| error | Save failed | Save failed |
| idle | Guest session (local) | Ready (local) |

Any UI string “Saved to cloud” without cloud wire = contradiction.

### Appendix H — Orbit three-layer checklist (document in matrix notes)

1. Default `OPEN3D_ORBIT_DEFAULT_ENABLED === true`  
2. Workspace spreads `getOpen3dViewerControlProps()` → `{ enableControls: true }`  
3. ThreeViewerInner constructs OrbitControls when enableControls  
4. `orbitEnabled` state for Playwright (`data-` attr if present — note if found)  
5. Browser proof later P04 — not P01 green  

### Appendix I — What P01 does **not** do

- Implement select/delete product fixes  
- Implement orbit product work  
- Fabric cutover  
- Mesh quality raise  
- New Playwright journey product code  
- Package upgrades  
- CRM/auth/SSR  
- Re-scrape competitors  
- Mark any W1–W8 PASS  

### Appendix J — Failure log template

```markdown
## P01 | <ISO-8601>
- path: results/planner/world-standard-wave/00-product-truth/
- command: <exact>
- exit: <code>
- blocker: <one line>
```

### Appendix K — Relationship to phase execute card

This plan **re-implements** `Plans/phases/P01-product-truth/P01-product-truth.md` Tasks 00–07 with:

- Live path authority post-cleanup  
- results-missing recovery  
- raised-bar buyer hard stop + freeze list  
- honesty docs under `Plans/Research/Others`  
- known live contradictions pre-seeded  

Execute card status DONE is **not** authority when evidence absent.

---

## Execution handoff

**Plan complete and saved to** `D:\OandO07072026\idiotplanners2\P01-product-truth\IMPLEMENTATION-PLAN.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

Executor reminder: inventory-only; write under `results/planner/world-standard-wave/00-product-truth/` only; repo wins on code facts; dual-state honesty forever.

---

*End of P01 Product Truth Implementation Plan — idiotplanners2.*
