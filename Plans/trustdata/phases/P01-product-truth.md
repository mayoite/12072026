# P01 — Product Truth Inventory

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Load skills as fit (verification, systematic-debugging, executing-plans). **This phase is inventory only** — no product-feature implementation. Steps use checkbox syntax.  
> **Checkout:** `D:\OandO07072026` only · **No worktrees** · **Commit as we go** after each landable evidence slice · **Push only on owner ask**.

**Goal:** Produce a data-backed map of what the live open3d planner **actually does** versus what docs/README/UI copy **claim**, so later phases (P02–P10) fix real gaps against world-standard gates W1–W8 — not stories.

**Architecture:** One main checkout; production planner source under `site/features/planner/open3d/`; thin App Router hosts under `site/app/planner/`; honesty baseline in `ayushdocs/`; historical evidence in `results/planner/`; **this phase’s proof** lands only under `results/planner/world-standard-wave/01-product-truth/`. Document model (UUID entities, mm) → FeasibilityCanvas interim 2D → Three/R3F 3D → IDB autosave; Fabric full stage remains target, not assumed live.

**Tech Stack:** Next.js site (`oando-site`), FeasibilityCanvas (Canvas 2D), optional Fabric furniture overlay flag, Three + OrbitControls path, Vitest unit suite under `site/tests/unit/features/planner/open3d/`, Playwright catalog/guest specs already in tree, PowerShell inventory scripts from repo root. Package manager: **pnpm**.

**Authority order:** Owner message > `Plans/trustdata/` > `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` > Plan A core > `ayushdocs/` honesty.

**Out of scope for P01:** Select/delete fixes, orbit product work, Fabric cutover, mesh quality, new Playwright journey product code, package upgrades, CRM/auth/SSR, any edit under `site/features/planner/open3d/**` except if a later owner unlock explicitly expands scope. Read-only inventory + evidence write under `results/planner/world-standard-wave/01-product-truth/`.

---

## Preconditions

- [ ] Read `Plans/trustdata/00-START.md` and `Plans/trustdata/INDEX.md`
- [ ] Confirm working tree is main checkout only:

```powershell
cd D:\OandO07072026
git rev-parse --show-toplevel
git worktree list
# Expect single worktree at D:\OandO07072026 (or path-equivalent). Do not add worktrees.
```

- [ ] Record HEAD before inventory:

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
```

Write both lines into `results/planner/world-standard-wave/01-product-truth/HEAD.txt` when the evidence dir exists (Task 00).

---

## Task 00 — Evidence directory + run meta

**Files / dirs:**

- Create: `D:\OandO07072026\results\planner\world-standard-wave\01-product-truth\`
- Already present (do not overwrite meaning): `results/planner/world-standard-wave/WAVE.md`, `results/planner/world-standard-wave/COMPARISON-CHART.md`

- [ ] **Step 1: Create evidence root**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-product-truth" | Out-Null
```

- [ ] **Step 2: Write run meta**

Create `results/planner/world-standard-wave/01-product-truth/run.json` with:

```json
{
  "phase": "P01-product-truth",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/01-product-truth",
  "scope": "inventory-only",
  "worktrees": false,
  "commitAsWeGo": true
}
```

Fill `startedAt` (ISO-8601), `head` (from `git rev-parse HEAD`), `agent` note after Step 1 commands run — use real values, not placeholders.

- [ ] **Step 3: Commit evidence scaffold**

```powershell
cd D:\OandO07072026
git add Plans/trustdata/phases/P01-product-truth.md results/planner/world-standard-wave/01-product-truth
git status -sb
git commit -m "plans(trustdata): P01 product-truth inventory plan + evidence scaffold"
```

(Only stage files that exist and belong to this slice. Do not `git push`.)

---

## Task 01 — Tree inventory of production open3d

**Primary path:** `D:\OandO07072026\site\features\planner\open3d\`

**Must include these files in the inventory tables (absolute or repo-relative):**

| Role | Path |
|------|------|
| 2D canvas | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Workspace shell | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| 3D viewer | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` |
| Lazy 3D host | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Native host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` |
| Keyboard | `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` |
| Canvas hooks | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` |
| Autosave | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` |
| Module README | `site/features/planner/open3d/README.md` |

- [ ] **Step 1: Directory listing (depth-aware)**

```powershell
cd D:\OandO07072026
Get-ChildItem -Path "site\features\planner\open3d" -Recurse -File |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\open3d-file-list.txt"
```

- [ ] **Step 2: Counts by top-level folder**

```powershell
cd D:\OandO07072026
Get-ChildItem "site\features\planner\open3d" -Directory |
  ForEach-Object {
    $n = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object).Count
    "{0}`t{1}" -f $_.Name, $n
  } |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\open3d-folder-counts.tsv"
```

- [ ] **Step 3: Confirm key files exist**

```powershell
cd D:\OandO07072026
@(
  "site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx",
  "site\features\planner\open3d\editor\OOPlannerWorkspace.tsx",
  "site\features\planner\open3d\3d\ThreeViewerInner.tsx",
  "site\features\planner\open3d\3d\ThreeLazyViewer.tsx",
  "site\features\planner\open3d\ui\Open3dNativeHost.tsx",
  "site\features\planner\open3d\README.md"
) | ForEach-Object {
  "{0}`t{1}" -f $_, (Test-Path $_)
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\key-files-exist.tsv"
```

Every path must be `True`. If any `False`, stop and log under Failures — do not invent alternate paths.

- [ ] **Step 4: Commit file list evidence**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): open3d tree inventory file lists"
```

---

## Task 02 — Route and host wiring (claim vs code)

**Routes (live hosts per open3d README):**

| Route | Page file |
|-------|-----------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` |
| Fabric archive | `site/app/planner/fabric/*` (legacy; not default live 2D) |

**Host chain (document as found):**  
`Open3dPlannerHost` → `site/features/planner/open3d/ui/Open3dNativeHost.tsx` → `editor/OOPlannerWorkspace.tsx` → `FeasibilityCanvas` (2D) / `ThreeLazyViewer` → `ThreeViewerInner` (3D).

- [ ] **Step 1: Grep host imports**

```powershell
cd D:\OandO07072026
rg -n "Open3dNativeHost|OOPlannerWorkspace|FeasibilityCanvas|ThreeLazyViewer|ThreeViewerInner|Open3dPlannerHost" site/app/planner site/features/planner --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\host-wiring-rg.txt"
```

- [ ] **Step 2: Read route pages (no edits)**

Read and note import targets only:

- `site/app/planner/(workspace)/guest/page.tsx`
- `site/app/planner/(workspace)/canvas/page.tsx`
- `site/app/planner/open3d/page.tsx`
- `site/features/planner/open3d/ui/Open3dNativeHost.tsx`
- `site/features/planner/open3d/README.md` (Route wiring table)

- [ ] **Step 3: Write CLAIMS-vs-CODE table**

Create `results/planner/world-standard-wave/01-product-truth/ROUTES.md` with columns:

| Claim source | Claim text (quote) | Code path | Actual behavior (from imports/comments) | Match? |

Include at minimum claims from:

- Route file header comments on guest/canvas/open3d pages
- `site/features/planner/open3d/README.md` hybrid stack bullets
- `results/planner/world-standard-wave/WAVE.md` top blockers list

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): route and host wiring claims vs code"
```

---

## Task 03 — Capability matrix for W1–W8 (code surface only)

Map each world-standard gate to **symbols/handlers found in code**, not browser proof (browser journey is later phase).

| Gate | Inventory focus | Primary paths |
|------|-----------------|---------------|
| **W1** Draw structure | wall draw tools, door/window placement hooks | `FeasibilityCanvas.tsx`, `useDoorWindowPlacement.ts`, `model/actions/walls.ts`, `model/actions/openings.ts` |
| **W2** Place catalog | inventory place, modular cabinet-v0, Block2D | `InventoryPanel.tsx`, `catalog/placementAction.ts`, `catalog/modularCabinetV0.ts`, `catalog/furnitureBlock2D.ts` |
| **W3** Select + delete | furniture pick, `deleteSelection`, Delete/Backspace | `FeasibilityCanvas.tsx`, `OOPlannerWorkspace.tsx`, `useWorkspaceKeyboard.ts` |
| **W4** 2D↔3D + orbit | view mode toggle, OrbitControls | `OOPlannerWorkspace.tsx`, `ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` |
| **W5** Save reload | autosave, project JSON, continuity tests | `persistence/useOpen3dWorkspaceAutosave.ts`, `persistence/projectJson.ts`, `tests/.../saveReloadContinuity.test.ts` |
| **W6** Save honesty | status labels local vs cloud | `editor/workspaceStatusLabels.ts`, `persistence/memberPlanRepository.ts`, `persistence/guestProjectRepository.ts` |
| **W7** Mesh quality | modular mesh vs box factory | `catalog/modularCabinetV0.ts`, `3d/createSceneObjectFromNode.ts`, `3d/buildOpen3dSceneNodes.ts` |
| **W8** Shortcuts truth | keyboard map vs UI labels | `useWorkspaceKeyboard.ts`, `editor/CanvasToolRail.tsx`, `lib/commands/paletteCommands.ts` |

- [ ] **Step 1: Symbol greps (one file per gate)**

```powershell
cd D:\OandO07072026
$out = "results\planner\world-standard-wave\01-product-truth"

rg -n "addOpen3dWall|drawWall|wallTool|useDoorWindowPlacement" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w1-draw-rg.txt"
rg -n "placementAction|placeModular|cabinet-v0|furnitureBlock2D|Block2D" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w2-place-rg.txt"
rg -n "deleteSelection|selectedFurniture|Backspace|Delete" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w3-select-delete-rg.txt"
rg -n "OrbitControls|enableOrbit|viewMode|2d|3d" site/features/planner/open3d/3d site/features/planner/open3d/editor --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w4-orbit-view-rg.txt"
rg -n "autosave|flush|idb|indexedDB|saveProject" site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w5-save-rg.txt"
rg -n "local|cloud|Saved|statusLabel|workspaceStatus" site/features/planner/open3d --glob "*Status*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w6-honesty-rg.txt"
rg -n "modularCabinet|box|mesh|procedural|generatedGlb" site/features/planner/open3d/catalog site/features/planner/open3d/3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w7-mesh-rg.txt"
rg -n "key ===|shortcut|Hotkey|paletteCommands|CanvasTool" site/features/planner/open3d/editor site/features/planner/open3d/lib/commands --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w8-shortcuts-rg.txt"
```

- [ ] **Step 2: Read core handlers (line-level notes, no code changes)**

Read with line notes into `CAPABILITY-MATRIX.md`:

1. `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` — selection state, hit-test, draw tools exported props  
2. `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` — `deleteSelection`, view toggle, wiring into keyboard/canvas  
3. `site/features/planner/open3d/3d/ThreeViewerInner.tsx` — OrbitControls load path and enable conditions  
4. `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` — Delete/Backspace and other bindings  
5. `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` — when flush runs  

- [ ] **Step 3: Write capability matrix**

Create `results/planner/world-standard-wave/01-product-truth/CAPABILITY-MATRIX.md`:

| Gate | Symbol / handler exists? | Path:line | Wired to UI? | Unit test file | Browser proof in results/? | Honest status |
|------|--------------------------|-----------|--------------|----------------|----------------------------|---------------|

Status vocabulary (use only these): `code-present`, `code-partial`, `code-absent`, `unit-green`, `unit-missing`, `browser-missing`, `docs-overclaim`.

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): W1-W8 capability matrix from live code greps"
```

---

## Task 04 — Claims corpus: ayushdocs + WAVE + README

**Claim sources (read-only):**

| Source | Path |
|--------|------|
| Open3d README | `site/features/planner/open3d/README.md` |
| Honest quality | `ayushdocs/04-HONEST-QUALITY.md` |
| Evidence index | `ayushdocs/08-EVIDENCE-INDEX.md` |
| Verify snapshot | `ayushdocs/09-VERIFY-SNAPSHOT.md` |
| Pending | `ayushdocs/00-PENDING.md` |
| Wave verdict | `results/planner/world-standard-wave/WAVE.md` |
| World-standard design | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Session recap | `results/planner/SESSION-RECAP.md` |

- [ ] **Step 1: Extract claim sentences**

```powershell
cd D:\OandO07072026
# Capture honesty + wave files into one readable blob for agents (no mutation of sources)
@(
  "ayushdocs\04-HONEST-QUALITY.md",
  "ayushdocs\08-EVIDENCE-INDEX.md",
  "ayushdocs\00-PENDING.md",
  "results\planner\world-standard-wave\WAVE.md",
  "site\features\planner\open3d\README.md"
) | ForEach-Object {
  "===== $_ ====="
  Get-Content $_ -Raw
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\claims-sources-concat.txt"
```

- [ ] **Step 2: Build CLAIMS-REGISTER.md**

Create `results/planner/world-standard-wave/01-product-truth/CLAIMS-REGISTER.md` with one row per material claim:

| ID | Source path | Claim (verbatim short) | Verified against | Verdict |
|----|-------------|------------------------|------------------|---------|
| C01 | … | … | Task 03 matrix / grep file | `supported` / `contradicted` / `stale` / `unverified` |

Minimum claims to register (do not skip if source still says them):

1. Live 2D is FeasibilityCanvas, not Fabric full stage  
2. Fabric furniture overlay is flag-gated (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`)  
3. P0.1–P0.3 spine ≠ ship quality  
4. Select/delete furniture user-visible status  
5. 3D default mesh quality (boxes vs modular cabinet readability)  
6. Orbit controls present vs product-usable  
7. Save is local IDB; cloud member path honesty  
8. No Playwright open3d draw→place→3D→save pack under world-standard-wave yet  
9. Entity IDs via crypto / `newEntityId`  
10. Production routes: guest / canvas / open3d host chain  

- [ ] **Step 3: Cross-check fabric flag**

```powershell
cd D:\OandO07072026
rg -n "OPEN3D_FABRIC_FURNITURE|fabricFurnitureFlag" site/features/planner/open3d --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\fabric-flag-rg.txt"
```

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): claims register vs live code"
```

---

## Task 05 — Existing test and results map (what is already proven)

**Unit root:** `site/tests/unit/features/planner/open3d/`  
**Historical results:** `results/planner/`  
**This wave root:** `results/planner/world-standard-wave/`

- [ ] **Step 1: List open3d unit tests**

```powershell
cd D:\OandO07072026
Get-ChildItem "site\tests\unit\features\planner\open3d" -Recurse -File -Filter "*.ts*" |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\unit-test-list.txt"
```

- [ ] **Step 2: List Playwright planner specs (names only)**

```powershell
cd D:\OandO07072026
Get-ChildItem "site\tests\e2e" -File -Filter "*planner*" |
  ForEach-Object { $_.Name } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\e2e-planner-spec-names.txt"
```

- [ ] **Step 3: Map results/planner directories**

```powershell
cd D:\OandO07072026
Get-ChildItem "results\planner" -Directory |
  Select-Object -ExpandProperty Name |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\01-product-truth\results-planner-dirs.txt"
```

- [ ] **Step 4: Write EVIDENCE-COVERAGE.md**

Create `results/planner/world-standard-wave/01-product-truth/EVIDENCE-COVERAGE.md`:

| Concern | Unit test path(s) | results/planner/* dir | Covers W? | Gap for world-standard |
|---------|-------------------|----------------------|-----------|------------------------|

Explicitly note:

- `results/planner/world-standard-wave/` today holds research (`WAVE.md`, `COMPARISON-CHART.md`) — **not** a completed browser journey pack  
- Template journey folder named in START: `results/planner/world-standard-wave/02-browser-open3d-journey/` is for **later** phase execution, not P01  
- Prior P0 dirs (`p0-1-admin-svg-publish`, `p0-2-*`, `a11y-open3d`, `save-reload-continuity`, `modular-place*`, `g8-*`) prove spines, not full W1–W8 buyer journey  

- [ ] **Step 5: Run non-mutating unit smoke (optional if time; preferred for data)**

From repo root, capture planner open3d-focused suites that already exist (no product code changes):

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\01-product-truth" | Out-Null
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx tests/unit/features/planner/open3d/threeViewerInner.test.tsx tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx tests/unit/features/planner/open3d/saveReloadContinuity.test.ts tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts --config vitest.site.config.ts 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\01-product-truth\vitest-capability-smoke-raw.log"
```

If the command fails due to environment, record exact stderr in the log and set `run.json` field `vitestSmoke: "failed"` with reason — do not “pass” silently.

Also accept broader capture if agent has capacity:

```powershell
cd D:\OandO07072026\site
pnpm run test:planner 2>&1 | Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\01-product-truth\vitest-test-planner-raw.log"
```

- [ ] **Step 6: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): unit/e2e/results coverage map and smoke logs"
```

---

## Task 06 — FeasibilityCanvas / OOPlannerWorkspace / ThreeViewerInner deep read

**Purpose:** One short technical truth note per file. No refactors.

- [ ] **Step 1: FeasibilityCanvas**

Read `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` and write  
`results/planner/world-standard-wave/01-product-truth/NOTE-FeasibilityCanvas.md`:

Required headings:

1. Props / handle API  
2. Tools implemented (draw/select/pan/zoom as found)  
3. Furniture hit-testing / selection  
4. What it does **not** do (from code absence)  
5. Dependencies on workspace store/model  

- [ ] **Step 2: OOPlannerWorkspace**

Read `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` →  
`results/planner/world-standard-wave/01-product-truth/NOTE-OOPlannerWorkspace.md`:

Required headings:

1. Composition tree (canvas vs 3D vs panels)  
2. `deleteSelection` behavior and entity types covered  
3. Keyboard wiring (`useWorkspaceKeyboard`)  
4. Persistence hooks  
5. Guest vs member differences in this file  

- [ ] **Step 3: ThreeViewerInner**

Read `site/features/planner/open3d/3d/ThreeViewerInner.tsx` (+ `ThreeLazyViewer.tsx` props) →  
`results/planner/world-standard-wave/01-product-truth/NOTE-ThreeViewerInner.md`:

Required headings:

1. Scene construction entry  
2. OrbitControls: when created, defaults  
3. GLB vs procedural mesh path  
4. Continuity / camera assumptions  
5. Known failure modes implied by code (late load cancel, etc.)  

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth
git commit -m "evidence(P01): deep-read notes for canvas workspace viewer"
```

---

## Task 07 — Product truth summary + CP-01 pack

- [ ] **Step 1: Write PRODUCT-TRUTH.md**

Create `results/planner/world-standard-wave/01-product-truth/PRODUCT-TRUTH.md`:

```markdown
# Product truth — open3d (P01)

## One-paragraph reality
(What a facilities buyer can do today without a developer, based only on code + existing evidence.)

## Engine truth
| Layer | Live engine | Flag / archive |
|-------|-------------|----------------|

## Gate snapshot (W1–W8)
| Gate | Code | Unit | Browser | Blocker one-liner |
|------|------|------|---------|-------------------|

## Overclaims to stop repeating
(bullets with source paths)

## Under-documented real strengths
(bullets with paths — crypto ids, command seam pieces, etc.)

## Inputs for P02 engine lock
(exactly what P02 must freeze — cite CAPABILITY-MATRIX + CLAIMS-REGISTER)
```

- [ ] **Step 2: Write INDEX for this evidence folder**

Create `results/planner/world-standard-wave/01-product-truth/README.md` listing every artifact file produced in Tasks 00–07 with one-line purpose each.

- [ ] **Step 3: Finalize run.json**

Update `results/planner/world-standard-wave/01-product-truth/run.json` with:

- `finishedAt` (ISO-8601)  
- `headEnd`  
- `cp01: "ready-for-review"` or `cp01: "blocked"` + `blockers: []`  
- counts: files listed, claims registered, gates marked  

- [ ] **Step 4: Final commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/01-product-truth Plans/trustdata/phases/P01-product-truth.md
git status -sb
git commit -m "evidence(P01): product truth summary ready for CP-01"
```

---

## Checkpoint CP-01 — Product truth accepted

**Hard stop.** Do not start P02 engine-lock execution until CP-01 passes.

### CP-01 pass criteria (all required)

| # | Criterion | Proof artifact |
|---|-----------|----------------|
| 1 | Evidence directory exists with non-empty inventory | `results/planner/world-standard-wave/01-product-truth/open3d-file-list.txt` |
| 2 | All key production files confirmed present | `key-files-exist.tsv` all `True` for FeasibilityCanvas, OOPlannerWorkspace, ThreeViewerInner |
| 3 | Host/route wiring documented | `ROUTES.md` + `host-wiring-rg.txt` |
| 4 | W1–W8 capability matrix filled with paths (no empty gates) | `CAPABILITY-MATRIX.md` |
| 5 | Claims register has ≥10 material claims with verdicts | `CLAIMS-REGISTER.md` |
| 6 | Deep-read notes for three core files | `NOTE-FeasibilityCanvas.md`, `NOTE-OOPlannerWorkspace.md`, `NOTE-ThreeViewerInner.md` |
| 7 | Coverage map links unit tests + `results/planner/*` history | `EVIDENCE-COVERAGE.md` |
| 8 | Product truth summary written without marketing voice | `PRODUCT-TRUTH.md` |
| 9 | `run.json` has real `head` / timestamps / cp01 status | `run.json` |
| 10 | Local commits exist for evidence slices; no worktree created; no push unless owner asked | `git log --oneline -10`, `git worktree list` |

### CP-01 fail conditions

- Any gate row left blank or filled with invented paths  
- Claiming “browser journey green” without Playwright artifacts under `results/planner/`  
- Editing product feature code “while inventorying”  
- Using a git worktree  
- Silent skip of vitest smoke without log of why  

### CP-01 owner checkbox

- [ ] Owner (or delegated agent with owner unlock) marks CP-01 **pass** in `Plans/trustdata/checkpoints/CHECKPOINTS.md` when that file is maintained; until then, mark pass only inside `run.json` + `PRODUCT-TRUTH.md` footer:

```markdown
## CP-01
- status: pass | fail
- reviewer:
- date:
- notes:
```

---

## Evidence contract (this phase only)

All new proof for P01 **must** land under:

```text
D:\OandO07072026\results\planner\world-standard-wave\01-product-truth\
```

| Artifact | Required |
|----------|----------|
| `run.json` | yes |
| `HEAD.txt` | yes |
| `open3d-file-list.txt` | yes |
| `open3d-folder-counts.tsv` | yes |
| `key-files-exist.tsv` | yes |
| `host-wiring-rg.txt` | yes |
| `ROUTES.md` | yes |
| `w1-draw-rg.txt` … `w8-shortcuts-rg.txt` | yes |
| `CAPABILITY-MATRIX.md` | yes |
| `claims-sources-concat.txt` | yes |
| `CLAIMS-REGISTER.md` | yes |
| `fabric-flag-rg.txt` | yes |
| `unit-test-list.txt` | yes |
| `e2e-planner-spec-names.txt` | yes |
| `results-planner-dirs.txt` | yes |
| `EVIDENCE-COVERAGE.md` | yes |
| `NOTE-FeasibilityCanvas.md` | yes |
| `NOTE-OOPlannerWorkspace.md` | yes |
| `NOTE-ThreeViewerInner.md` | yes |
| `PRODUCT-TRUTH.md` | yes |
| `README.md` (folder index) | yes |
| `vitest-capability-smoke-raw.log` | preferred; required if Step 5 smoke attempted |

Do **not** write P01 proof into `archive/results/`, worktrees, or chat-only summaries.

---

## Agent operating rules (standing)

1. **Superpowers** always (`/using-superpowers`); load verification / docs skills as needed.  
2. **No worktrees** — main tree `D:\OandO07072026` only.  
3. **Commit as we go** after each task’s evidence slice.  
4. **Push** only when the owner explicitly asks in the current conversation.  
5. **Trust data** — repo greps, file reads, test logs — not character or vibes.  
6. **Parallelism:** up to 8 concurrent agents for read-only greps/notes; hard max 10; merge evidence carefully without overwriting each other’s files.  
7. **Ethics:** competitor research inspiration-only; no plagiarism; MIT/open packages only if any package note appears.  
8. **Scope creep = stop** — if inventory requires product code changes, stop and ask.  

---

## Exit → next phase

When CP-01 passes, hand off to **P02 — Engine lock** (`Plans/trustdata/phases/P02-engine-lock.md`) with:

- Frozen live 2D engine identity (FeasibilityCanvas vs Fabric flag path) from `PRODUCT-TRUTH.md`  
- OrbitControls code location truth from `NOTE-ThreeViewerInner.md`  
- Explicit “do not thrash engines” list derived from overclaims  

P01 does **not** unlock W3 select/delete implementation; that is P03 after engine lock.
