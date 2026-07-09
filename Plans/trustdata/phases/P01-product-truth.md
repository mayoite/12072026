# P01 — Product Truth Inventory

## Expert revision note

**Date:** 2026-07-09  
**Source suggestions:** `Plans/trustdata/reviews/P01-suggestions.md`

- Aligned CP-01 artifacts with `RESULTS-MAP.md` / `CHECKPOINTS.md`: required **`INVENTORY.md`** + **`CONTRADICTIONS.md`** (plus supporting matrix/claims/notes).
- Corrected Fabric truth: archive at `site/features/planner/_archive/fabric/`; **no** `site/app/planner/fabric/*` pages; permanent redirects `/planner/fabric*` → `/planner/open3d/`.
- Corrected host/route chain: dual entry (`Open3dPlannerWorkspaceRoute` for guest/canvas; direct `Open3dPlannerHost` for `/planner/open3d`); absolute paths for UI hosts.
- Vitest smoke is **required attempt** with explicit `run.json` outcome (`ok` | `failed` | `skipped` + reason) — no silent skip; conflicts with “optional if time” removed.
- Expanded key-file existence checks, W6 greps, tightened W4 greps, full claims-source concat, Failures.md path, CHECKPOINTS close step, Approach A in `run.json`.
- **FOLDER-LOCK 2026-07-09:** evidence root **`00-product-truth/`** (was `01-product-truth/` in earlier drafts). Phase **file** remains `P01-product-truth.md`. See `reviews/FOLDER-LOCK-suggestions.md`.

---

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Load skills as fit (verification, systematic-debugging, executing-plans, writing-plans). **This phase is inventory only** — no product-feature implementation. Steps use checkbox syntax.  
> **Checkout:** `D:\OandO07072026` only · **No worktrees** · **Commit as we go** after each landable evidence slice · **Push only on owner ask**.

**Goal:** Produce a data-backed map of what the live open3d planner **actually does** versus what docs/README/UI copy **claim**, so later phases (P02–P10) fix real gaps against world-standard gates W1–W8 — not stories.

**Architecture:** One main checkout; production planner source under `site/features/planner/open3d/`; thin App Router hosts under `site/app/planner/`; thin route adapters under `site/features/planner/ui/`; honesty baseline in `ayushdocs/`; historical evidence in `results/planner/`; **this phase’s proof** lands only under `results/planner/world-standard-wave/00-product-truth/`. Document model (UUID entities, mm) → FeasibilityCanvas interim 2D → Three/R3F 3D → IDB autosave; Fabric full stage remains **destination** (archive + future 2B), not assumed live.

**Tech Stack:** Next.js site (`oando-site`), FeasibilityCanvas (Canvas 2D), optional Fabric furniture overlay flag, Three + OrbitControls path, Vitest unit suite under `site/tests/unit/features/planner/open3d/`, Playwright catalog/guest specs already in tree, PowerShell inventory scripts from repo root. Package manager: **pnpm**.

**Authority order:** Owner message > `Plans/trustdata/` > `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` > Plan A core > `ayushdocs/` honesty.

**Canonical evidence map:** `Plans/trustdata/RESULTS-MAP.md` row for `00-product-truth/` — minimum green artifacts include **`INVENTORY.md`** and **`CONTRADICTIONS.md`**.

**Out of scope for P01:** Select/delete fixes, orbit product work, Fabric cutover, mesh quality, new Playwright journey product code, package upgrades, CRM/auth/SSR, any edit under `site/features/planner/open3d/**` except if a later owner unlock explicitly expands scope. Read-only inventory + evidence write under `results/planner/world-standard-wave/00-product-truth/`.

**Stop / failure log path:** `D:\OandO07072026\Failures.md` (append blocker rows with phase `P01`, path, and command that failed). Do not invent alternate failure logs.

---

## Preconditions

- [ ] Read `Plans/trustdata/00-START.md` and `Plans/trustdata/INDEX.md`
- [ ] Read `Plans/trustdata/RESULTS-MAP.md` row for `00-product-truth/` and CP-01 row in `Plans/trustdata/checkpoints/CHECKPOINTS.md`
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

Write both lines into `results/planner/world-standard-wave/00-product-truth/HEAD.txt` when the evidence dir exists (Task 00).

- [ ] Record approach for this run: default **A** (product journey first) unless owner set B/C in `00-START.md`. Put `"approach": "A"` (or B/C) in `run.json` (Task 00).

---

## Task 00 — Evidence directory + run meta

**Files / dirs:**

- Create: `D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\`
- Already present (do not overwrite meaning): `results/planner/world-standard-wave/WAVE.md`, `results/planner/world-standard-wave/COMPARISON-CHART.md`

- [ ] **Step 1: Create evidence root**

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
```

- [ ] **Step 2: Write HEAD.txt + run meta**

```powershell
cd D:\OandO07072026
git rev-parse HEAD | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\HEAD.txt"
git status -sb | Add-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\HEAD.txt"
```

Create `results/planner/world-standard-wave/00-product-truth/run.json` with real values (no TBD placeholders):

```json
{
  "phase": "P01-product-truth",
  "checkout": "D:\\OandO07072026",
  "evidenceRoot": "results/planner/world-standard-wave/00-product-truth",
  "scope": "inventory-only",
  "approach": "A",
  "worktrees": false,
  "commitAsWeGo": true,
  "startedAt": "<ISO-8601 from agent clock>",
  "head": "<git rev-parse HEAD>",
  "agent": "<agent id or short note>",
  "vitestSmoke": "pending",
  "cp01": "in-progress"
}
```

Required keys at end of phase: `startedAt`, `finishedAt`, `head`, `headEnd`, `approach`, `vitestSmoke` (`ok` | `failed` | `skipped`), `vitestSmokeReason` (string; empty if ok), `cp01` (`ready-for-review` | `blocked` | `pass` | `fail`), `blockers` (array), `counts` (object with at least `filesListed`, `claimsRegistered`, `gatesFilled`).

- [ ] **Step 3: Commit evidence scaffold**

```powershell
cd D:\OandO07072026
git add Plans/trustdata/phases/P01-product-truth.md Plans/trustdata/reviews/P01-suggestions.md results/planner/world-standard-wave/00-product-truth
git status -sb
git commit -m "plans(trustdata): P01 product-truth inventory plan + evidence scaffold"
```

(Only stage files that exist and belong to this slice. Do not `git push`.)

---

## Task 01 — Tree inventory of production open3d

**Primary path:** `D:\OandO07072026\site\features\planner\open3d\`

**Must include these files in the inventory tables (repo-relative):**

| Role | Path |
|------|------|
| 2D canvas | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Workspace shell | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| 3D viewer | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` |
| Lazy 3D host | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Native host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` |
| Route host (thin) | `site/features/planner/ui/Open3dPlannerHost.tsx` |
| Guest/canvas route adapter | `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` |
| Keyboard | `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` |
| Canvas hooks | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` |
| Autosave | `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` |
| Fabric overlay flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Module README | `site/features/planner/open3d/README.md` |
| Fabric archive (code only) | `site/features/planner/_archive/fabric/` (directory) |
| Fabric redirect config | `site/config/build/next.config.js` (redirect rules for `/planner/fabric*`) |

- [ ] **Step 1: Directory listing (depth-aware)**

```powershell
cd D:\OandO07072026
Get-ChildItem -Path "site\features\planner\open3d" -Recurse -File |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1) } |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\open3d-file-list.txt"
```

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

- [ ] **Step 3: Confirm key files exist**

```powershell
cd D:\OandO07072026
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
```

Every path must be `True`. If any `False`, **stop**, append to `D:\OandO07072026\Failures.md`, set `run.json` `cp01: "blocked"` — do not invent alternate paths.

- [ ] **Step 4: Commit file list evidence**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): open3d tree inventory file lists"
```

---

## Task 02 — Route and host wiring (claim vs code)

**Live routes (App Router pages that exist):**

| Route | Page file | Mount pattern |
|-------|-----------|---------------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → dynamic `Open3dPlannerHost` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | `Open3dPlannerWorkspaceRoute` → dynamic `Open3dPlannerHost` |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | **Direct** `Open3dPlannerHost` (no WorkspaceRoute wrapper) |

**Fabric paths (honest inventory facts — verify, do not assume README alone):**

| Claim often seen | Live fact to confirm |
|------------------|----------------------|
| `site/app/planner/fabric/*` pages | **Do not exist** as page tree under `site/app/planner/` |
| Archive source | `site/features/planner/_archive/fabric/` (`editor/`, `canvas-fabric/`) |
| URL `/planner/fabric/*` | Permanent redirect → `/planner/open3d/` in `site/config/build/next.config.js` (confirm with rg) |
| Live 2D | `FeasibilityCanvas` under open3d; Fabric full stage **not** default interactive 2D |
| Opt-in Fabric furniture overlay | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` via `canvas-fabric-stage/fabricFurnitureFlag.ts` |

**Host chain (document both entries as found):**

1. **Guest / canvas:**  
   `site/app/planner/(workspace)/{guest|canvas}/page.tsx`  
   → `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx`  
   → (Providers + ProjectSetupGate)  
   → `site/features/planner/ui/Open3dPlannerHost.tsx`  
   → `site/features/planner/open3d/ui/Open3dNativeHost.tsx`  
   → `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
   → `FeasibilityCanvas` (2D) / `ThreeLazyViewer` → `ThreeViewerInner` (3D).

2. **Pilot open3d:**  
   `site/app/planner/open3d/page.tsx`  
   → `Open3dPlannerHost` → same open3d chain (**no** `Open3dPlannerWorkspaceRoute` / ProjectSetupGate in this page file).

- [ ] **Step 1: Grep host imports + fabric redirects**

```powershell
cd D:\OandO07072026
$out = "results\planner\world-standard-wave\00-product-truth"
rg -n "Open3dNativeHost|OOPlannerWorkspace|FeasibilityCanvas|ThreeLazyViewer|ThreeViewerInner|Open3dPlannerHost|Open3dPlannerWorkspaceRoute" site/app/planner site/features/planner --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "$out\host-wiring-rg.txt"
rg -n "planner/fabric|OPEN3D_FABRIC|fabricFurnitureFlag|_archive/fabric" site/config/build/next.config.js site/features/planner site/app/planner --glob "*.{js,ts,tsx,md}" |
  Set-Content -Encoding utf8 "$out\fabric-redirect-and-archive-rg.txt"
```

- [ ] **Step 2: Read route pages and hosts (no edits)**

Read and note import targets only:

- `site/app/planner/(workspace)/guest/page.tsx`
- `site/app/planner/(workspace)/canvas/page.tsx`
- `site/app/planner/open3d/page.tsx`
- `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx`
- `site/features/planner/ui/Open3dPlannerHost.tsx`
- `site/features/planner/open3d/ui/Open3dNativeHost.tsx`
- `site/features/planner/open3d/README.md` (Route wiring table)
- Redirect lines in `site/config/build/next.config.js` for `/planner/fabric`

- [ ] **Step 3: Write CLAIMS-vs-CODE table (ROUTES.md)**

Create `results/planner/world-standard-wave/00-product-truth/ROUTES.md` with columns:

| Claim source | Claim text (quote) | Code path | Actual behavior (from imports/comments/redirects) | Match? |

Include at minimum claims from:

- Route file header comments on guest/canvas/open3d pages  
- `site/features/planner/open3d/README.md` hybrid stack + route table  
- `site/features/planner/_archive/fabric/README.md` rollback/fallback bullets  
- `site/config/build/next.config.js` fabric redirects  
- `results/planner/world-standard-wave/WAVE.md` top blockers list (as **claims**, not assumed code truth)  

Explicit rows required:

- Dual host entry (WorkspaceRoute vs direct Host)  
- Fabric page tree absent + redirect behavior  
- Live 2D = FeasibilityCanvas  

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
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
| **W4** 2D↔3D + orbit | view mode toggle, OrbitControls, `enableControls` | `OOPlannerWorkspace.tsx`, `ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` |
| **W5** Save reload | autosave, project JSON, continuity tests | `persistence/useOpen3dWorkspaceAutosave.ts`, `persistence/projectJson.ts`, `tests/.../saveReloadContinuity.test.ts` |
| **W6** Save honesty | status labels local vs cloud | `editor/workspaceStatusLabels.ts`, `editor/TopBar.tsx`, `persistence/memberPlanRepository.ts`, `persistence/guestProjectRepository.ts` |
| **W7** Mesh quality | modular mesh vs box factory | `catalog/modularCabinetV0.ts`, `3d/createSceneObjectFromNode.ts`, `3d/buildOpen3dSceneNodes.ts` |
| **W8** Shortcuts truth | keyboard map vs UI labels | `useWorkspaceKeyboard.ts`, `editor/CanvasToolRail.tsx`, `lib/commands/paletteCommands.ts` |

- [ ] **Step 1: Symbol greps (one file per gate)**

```powershell
cd D:\OandO07072026
$out = "results\planner\world-standard-wave\00-product-truth"

rg -n "addOpen3dWall|drawWall|wallTool|useDoorWindowPlacement" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w1-draw-rg.txt"
rg -n "placementAction|placeModular|cabinet-v0|furnitureBlock2D|Block2D" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w2-place-rg.txt"
rg -n "deleteSelection|selectedFurniture|Backspace|Delete" site/features/planner/open3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w3-select-delete-rg.txt"
rg -n "OrbitControls|enableControls|enableOrbit|viewMode" site/features/planner/open3d/3d site/features/planner/open3d/editor --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w4-orbit-view-rg.txt"
rg -n "autosave|flush|idb|indexedDB|saveProject" site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w5-save-rg.txt"
rg -n "local|cloud|Saved|statusLabel|workspaceStatus|memberPlan|guestProject" site/features/planner/open3d/editor site/features/planner/open3d/persistence --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w6-honesty-rg.txt"
rg -n "modularCabinet|box|mesh|procedural|generatedGlb" site/features/planner/open3d/catalog site/features/planner/open3d/3d --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w7-mesh-rg.txt"
rg -n "key ===|shortcut|Hotkey|paletteCommands|CanvasTool" site/features/planner/open3d/editor site/features/planner/open3d/lib/commands --glob "*.{ts,tsx}" | Set-Content -Encoding utf8 "$out\w8-shortcuts-rg.txt"
```

Do **not** use bare `2d|3d` as sole W4 pattern (too noisy).

- [ ] **Step 2: Read core handlers (line-level notes, no code changes)**

Read with line notes into `CAPABILITY-MATRIX.md`:

1. `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` — selection state, hit-test, draw tools exported props  
2. `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` — `deleteSelection`, view toggle, wiring into keyboard/canvas  
3. `site/features/planner/open3d/3d/ThreeViewerInner.tsx` — OrbitControls load path, `enableControls` default  
4. `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` — Delete/Backspace and other bindings  
5. `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` — when flush runs  

Special honesty rule for **W4 / orbit:** WAVE.md may claim “no orbit controls.” Code may still import/construct `OrbitControls`. Record **code-present vs product-usable vs docs claim** separately; do not collapse them.

- [ ] **Step 3: Write capability matrix**

Create `results/planner/world-standard-wave/00-product-truth/CAPABILITY-MATRIX.md`:

| Gate | Symbol / handler exists? | Path:line | Wired to UI? | Unit test file (from unit-test-list or smoke) | Browser proof in results/? | Honest status |
|------|--------------------------|-----------|--------------|-----------------------------------------------|----------------------------|---------------|

Status vocabulary (use only these tokens, combine with `+` if needed):  
`code-present`, `code-partial`, `code-absent`, `unit-green`, `unit-missing`, `browser-missing`, `docs-overclaim`.

Rules:

- No empty gate rows.  
- Do **not** mark `unit-green` without a log cite (`vitest-capability-smoke-raw.log` or existing results path) or an explicit file in `unit-test-list.txt` plus smoke attempt outcome.  
- Do **not** mark browser-green; browser journey is out of scope (expect `browser-missing` unless a real Playwright artifact already exists under `results/planner/`).

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): W1-W8 capability matrix from live code greps"
```

---

## Task 04 — Claims corpus: ayushdocs + WAVE + README

**Claim sources (read-only):**

| Source | Path |
|--------|------|
| Open3d README | `site/features/planner/open3d/README.md` |
| Fabric archive README | `site/features/planner/_archive/fabric/README.md` |
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
@(
  "ayushdocs\04-HONEST-QUALITY.md",
  "ayushdocs\08-EVIDENCE-INDEX.md",
  "ayushdocs\09-VERIFY-SNAPSHOT.md",
  "ayushdocs\00-PENDING.md",
  "results\planner\world-standard-wave\WAVE.md",
  "docs\superpowers\specs\2026-07-09-world-standard-planner-design.md",
  "results\planner\SESSION-RECAP.md",
  "site\features\planner\open3d\README.md",
  "site\features\planner\_archive\fabric\README.md"
) | ForEach-Object {
  "===== $_ ====="
  if (Test-Path $_) { Get-Content $_ -Raw } else { "(MISSING FILE)" }
} | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\claims-sources-concat.txt"
```

- [ ] **Step 2: Build CLAIMS-REGISTER.md**

Create `results/planner/world-standard-wave/00-product-truth/CLAIMS-REGISTER.md` with one row per material claim:

| ID | Source path | Claim (verbatim short) | Verified against | Verdict |
|----|-------------|------------------------|------------------|---------|
| C01 | … | … | Task 03 matrix / grep file / next.config | `supported` / `contradicted` / `stale` / `unverified` |

Minimum claims to register (do not skip if source still says them):

1. Live 2D is FeasibilityCanvas, not Fabric full stage  
2. Fabric furniture overlay is flag-gated (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`)  
3. `/planner/fabric/*` still a working Fabric fallback vs permanent redirect to open3d  
4. P0.1–P0.3 spine ≠ ship quality  
5. Select/delete furniture user-visible status  
6. 3D default mesh quality (boxes vs modular cabinet readability)  
7. Orbit controls present vs product-usable vs WAVE “no orbit” wording  
8. Save is local IDB; cloud member path honesty  
9. No Playwright open3d draw→place→3D→save pack under world-standard-wave yet  
10. Entity IDs via crypto / `newEntityId`  
11. Production routes: guest / canvas / open3d host chain (including dual entry)  

- [ ] **Step 3: Cross-check fabric flag + redirects (dedicated)**

```powershell
cd D:\OandO07072026
rg -n "OPEN3D_FABRIC_FURNITURE|fabricFurnitureFlag" site/features/planner/open3d --glob "*.{ts,tsx}" |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\fabric-flag-rg.txt"
```

(Also keep Task 02 `fabric-redirect-and-archive-rg.txt`.)

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
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
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\unit-test-list.txt"
```

- [ ] **Step 2: List Playwright planner-related specs**

```powershell
cd D:\OandO07072026
# Name filter + known related specs that omit "planner" in the filename
$names = @(
  Get-ChildItem "site\tests\e2e" -File -Filter "*planner*" | ForEach-Object { $_.Name }
  @("admin-svg-publish-p01.spec.ts", "sketch-to-plan-pipeline.spec.ts") |
    Where-Object { Test-Path "site\tests\e2e\$_" }
) | Sort-Object -Unique
$names | Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\e2e-planner-spec-names.txt"
```

- [ ] **Step 3: Map results/planner directories**

```powershell
cd D:\OandO07072026
Get-ChildItem "results\planner" -Directory |
  Select-Object -ExpandProperty Name |
  Sort-Object |
  Set-Content -Encoding utf8 "results\planner\world-standard-wave\00-product-truth\results-planner-dirs.txt"
```

- [ ] **Step 4: Write EVIDENCE-COVERAGE.md**

Create `results/planner/world-standard-wave/00-product-truth/EVIDENCE-COVERAGE.md`:

| Concern | Unit test path(s) | results/planner/* dir | Covers W? | Gap for world-standard |
|---------|-------------------|----------------------|-----------|------------------------|

Explicitly note:

- `results/planner/world-standard-wave/` today holds research (`WAVE.md`, `COMPARISON-CHART.md`) — **not** a completed browser journey pack  
- Template journey folder named in START: `results/planner/world-standard-wave/02-browser-open3d-journey/` is for **later** phase execution, not P01  
- Prior P0 dirs (`p0-1-admin-svg-publish`, `p0-2-*`, `a11y-open3d`, `save-reload-continuity`, `modular-place*`, `g8-*`) prove spines, not full W1–W8 buyer journey  

- [ ] **Step 5: Required unit smoke attempt (non-mutating)**

**Required:** Attempt the smoke once. Never claim pass without log. Never leave `vitestSmoke` as `pending` at CP-01.

From **repo root**, package-filtered vitest (cwd for package is `site/` when using filter exec — paths are relative to `site/`):

```powershell
cd D:\OandO07072026
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/threeViewerInner.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --config vitest.site.config.ts 2>&1 |
  Tee-Object -FilePath "results\planner\world-standard-wave\00-product-truth\vitest-capability-smoke-raw.log"
```

Then set `run.json`:

| Outcome | `vitestSmoke` | `vitestSmokeReason` |
|---------|---------------|---------------------|
| Exit 0, log non-empty | `ok` | `""` |
| Non-zero exit / env failure | `failed` | first-line stderr or short reason (keep full log) |
| Owner-waived only (rare) | `skipped` | waiver text + who |

**Silent skip = CP-01 fail.**

Also accept broader capture if agent has capacity:

```powershell
cd D:\OandO07072026\site
pnpm run test:planner 2>&1 | Tee-Object -FilePath "D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\vitest-test-planner-raw.log"
```

- [ ] **Step 6: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): unit/e2e/results coverage map and smoke logs"
```

---

## Task 06 — FeasibilityCanvas / OOPlannerWorkspace / ThreeViewerInner deep read

**Purpose:** One short technical truth note per file. No refactors.

- [ ] **Step 1: FeasibilityCanvas**

Read `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` and write  
`results/planner/world-standard-wave/00-product-truth/NOTE-FeasibilityCanvas.md`:

Required headings:

1. Props / handle API  
2. Tools implemented (draw/select/pan/zoom as found)  
3. Furniture hit-testing / selection  
4. What it does **not** do (from code absence)  
5. Dependencies on workspace store/model  

- [ ] **Step 2: OOPlannerWorkspace**

Read `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` →  
`results/planner/world-standard-wave/00-product-truth/NOTE-OOPlannerWorkspace.md`:

Required headings:

1. Composition tree (canvas vs 3D vs panels)  
2. `deleteSelection` behavior and entity types covered  
3. Keyboard wiring (`useWorkspaceKeyboard`)  
4. Persistence hooks  
5. Guest vs member differences in this file  

- [ ] **Step 3: ThreeViewerInner**

Read `site/features/planner/open3d/3d/ThreeViewerInner.tsx` (+ `ThreeLazyViewer.tsx` props) →  
`results/planner/world-standard-wave/00-product-truth/NOTE-ThreeViewerInner.md`:

Required headings:

1. Scene construction entry  
2. OrbitControls: when created, defaults (`enableControls`)  
3. GLB vs procedural mesh path  
4. Continuity / camera assumptions  
5. Known failure modes implied by code (late load cancel, etc.)  
6. Docs conflict note: WAVE “no orbit” vs code presence (cite path:line)  

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth
git commit -m "evidence(P01): deep-read notes for canvas workspace viewer"
```

---

## Task 07 — Canonical inventory pack + CP-01 ready

**Authority minimum (RESULTS-MAP / CHECKPOINTS):**  
`INVENTORY.md` and `CONTRADICTIONS.md` are **required**. Supporting files below feed them.

- [ ] **Step 1: Write INVENTORY.md (canonical CP-01 inventory)**

Create `results/planner/world-standard-wave/00-product-truth/INVENTORY.md`:

```markdown
# Product inventory — open3d (P01)

## One-paragraph reality
(What a facilities buyer can do today without a developer, based only on code + existing evidence.)

## Engine truth
| Layer | Live engine | Flag / archive / redirect |
|-------|-------------|---------------------------|

## Host / routes
(dual entry: guest/canvas vs open3d pilot — paths)

## Gate snapshot (W1–W8)
| Gate | Code | Unit | Browser | Blocker one-liner |
|------|------|------|---------|-------------------|

## Evidence index
(link CAPABILITY-MATRIX, CLAIMS-REGISTER, NOTE-*, EVIDENCE-COVERAGE, greps)

## Inputs for P02 engine lock
(exactly what P02 must freeze — cite CAPABILITY-MATRIX + CLAIMS-REGISTER + CONTRADICTIONS)
```

Also write companion synthesis (same content allowed to overlap):  
`results/planner/world-standard-wave/00-product-truth/PRODUCT-TRUTH.md`  
— may be a short pointer file:

```markdown
# PRODUCT-TRUTH

Canonical inventory: [INVENTORY.md](./INVENTORY.md)  
Contradictions: [CONTRADICTIONS.md](./CONTRADICTIONS.md)
```

or a full copy of the narrative sections; **INVENTORY.md remains the CP-01 path of record**.

- [ ] **Step 2: Write CONTRADICTIONS.md (canonical CP-01 contradictions)**

Create `results/planner/world-standard-wave/00-product-truth/CONTRADICTIONS.md`:

| ID | Claim source | Claim | Code / config path | Evidence | Severity |
|----|--------------|-------|--------------------|----------|----------|

Pull rows from CLAIMS-REGISTER where verdict is `contradicted` or `stale`, plus any matrix `docs-overclaim` rows. Minimum topics:

- Fabric fallback routes vs next.config redirects  
- Orbit / WAVE wording vs ThreeViewerInner  
- Save / cloud honesty  
- Select-delete user-visible vs keyboard handler existence  
- P0 “done” vs ship quality  

- [ ] **Step 3: Write folder README index**

Create `results/planner/world-standard-wave/00-product-truth/README.md` listing every artifact file produced in Tasks 00–07 with one-line purpose each. Mark `INVENTORY.md` and `CONTRADICTIONS.md` as **CP-01 required**.

- [ ] **Step 4: Finalize run.json**

Update `results/planner/world-standard-wave/00-product-truth/run.json` with:

- `finishedAt` (ISO-8601)  
- `headEnd` (`git rev-parse HEAD`)  
- `vitestSmoke` + `vitestSmokeReason`  
- `cp01: "ready-for-review"` or `cp01: "blocked"` + `blockers: []`  
- `counts`: `{ "filesListed", "claimsRegistered", "gatesFilled", "contradictions" }`  

- [ ] **Step 5: Final evidence commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/00-product-truth Plans/trustdata/phases/P01-product-truth.md
git status -sb
git commit -m "evidence(P01): product truth inventory ready for CP-01"
```

---

## Checkpoint CP-01 — Product truth accepted

**Hard stop.** Do not start P02 engine-lock execution until CP-01 passes.

### CP-01 pass criteria (all required)

| # | Criterion | Proof artifact |
|---|-----------|----------------|
| 1 | Evidence directory exists with non-empty inventory file list | `open3d-file-list.txt` |
| 2 | All key production files confirmed present | `key-files-exist.tsv` all `True` for FeasibilityCanvas, OOPlannerWorkspace, ThreeViewerInner, Host, WorkspaceRoute, keyboard, autosave, archive dir, next.config |
| 3 | Host/route wiring documented (dual entry + fabric redirect) | `ROUTES.md` + `host-wiring-rg.txt` + `fabric-redirect-and-archive-rg.txt` |
| 4 | W1–W8 capability matrix filled with paths (no empty gates) | `CAPABILITY-MATRIX.md` |
| 5 | Claims register has ≥11 material claims with verdicts | `CLAIMS-REGISTER.md` |
| 6 | Canonical inventory + contradictions (RESULTS-MAP / CHECKPOINTS) | **`INVENTORY.md`**, **`CONTRADICTIONS.md`** |
| 7 | Deep-read notes for three core files | `NOTE-FeasibilityCanvas.md`, `NOTE-OOPlannerWorkspace.md`, `NOTE-ThreeViewerInner.md` |
| 8 | Coverage map links unit tests + `results/planner/*` history | `EVIDENCE-COVERAGE.md` |
| 9 | Vitest smoke attempted with non-empty log + `run.json` outcome | `vitest-capability-smoke-raw.log` + `vitestSmoke` ≠ `pending` |
| 10 | `run.json` has real `head` / timestamps / approach / cp01 status | `run.json` |
| 11 | Local commits exist for evidence slices; no worktree created; no push unless owner asked | `git log --oneline -10`, `git worktree list` |

### CP-01 fail conditions

- Missing `INVENTORY.md` or `CONTRADICTIONS.md`  
- Any gate row left blank or filled with invented paths  
- Claiming “browser journey green” without Playwright artifacts under `results/planner/`  
- Editing product feature code “while inventorying”  
- Using a git worktree  
- Silent skip of vitest smoke (`vitestSmoke` still `pending` or skipped without reason)  
- Treating WAVE.md bullets as code truth without path:line verification  

### CP-01 owner / reviewer close

- [ ] Reviewer marks CP-01 in evidence footer and updates checkpoint ledger:

1. Footer in `INVENTORY.md`:

```markdown
## CP-01
- status: pass | fail
- reviewer:
- date:
- notes:
```

2. Update status cell for **CP-01** in `Plans/trustdata/checkpoints/CHECKPOINTS.md` to `PASS` or `FAIL` (with date in notes if fail).  
3. Set `run.json` `"cp01": "pass"` or `"fail"`.  
4. Commit ledger update when status changes:

```powershell
cd D:\OandO07072026
git add Plans/trustdata/checkpoints/CHECKPOINTS.md results/planner/world-standard-wave/00-product-truth
git commit -m "checkpoint(CP-01): product truth pass|fail"
```

Until owner/reviewer marks pass, executing agents leave `cp01: "ready-for-review"` and **do not** start P02 implementation.

---

## Evidence contract (this phase only)

All new proof for P01 **must** land under:

```text
D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\
```

| Artifact | Required |
|----------|----------|
| `run.json` | yes |
| `HEAD.txt` | yes |
| `open3d-file-list.txt` | yes |
| `open3d-folder-counts.tsv` | yes |
| `key-files-exist.tsv` | yes |
| `host-wiring-rg.txt` | yes |
| `fabric-redirect-and-archive-rg.txt` | yes |
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
| **`INVENTORY.md`** | **yes (CP-01 canonical)** |
| **`CONTRADICTIONS.md`** | **yes (CP-01 canonical)** |
| `PRODUCT-TRUTH.md` | yes (full or pointer to INVENTORY) |
| `README.md` (folder index) | yes |
| `vitest-capability-smoke-raw.log` | yes (from required smoke attempt) |

Do **not** write P01 proof into `archive/results/`, worktrees, or chat-only summaries.

---

## Agent operating rules (standing)

1. **Superpowers** always (`/using-superpowers`); load verification / docs skills as needed.  
2. **No worktrees** — main tree `D:\OandO07072026` only.  
3. **Commit as we go** after each task’s evidence slice.  
4. **Push** only when the owner explicitly asks in the current conversation.  
5. **Trust data** — repo greps, file reads, test logs — not character or vibes.  
6. **Parallelism:** up to 8 concurrent agents for read-only greps/notes; hard max 10.  
   - **File ownership:** each parallel agent writes **distinct** filenames under `00-product-truth/`; one designated merger owns `INVENTORY.md`, `CONTRADICTIONS.md`, `run.json`, `CAPABILITY-MATRIX.md`.  
7. **Ethics:** competitor research inspiration-only; no plagiarism; MIT/open packages only if any package note appears. Do not re-scrape Planner5D blindly (see `Plans/trustdata/RESEARCH-MAP.md`).  
8. **Scope creep = stop** — if inventory requires product code changes, stop and ask; log `Failures.md`.  
9. **Encoding:** prefer UTF-8 logs; if BOM breaks a downstream parser, re-write without BOM — do not discard evidence.  

---

## Exit → next phase

When CP-01 passes, hand off to **P02 — Engine lock** (`Plans/trustdata/phases/P02-engine-lock.md`) with:

- Frozen live 2D engine identity (FeasibilityCanvas vs Fabric flag path vs archive/redirects) from `INVENTORY.md`  
- OrbitControls code location truth from `NOTE-ThreeViewerInner.md` + contradiction row if WAVE disagreed  
- Explicit “do not thrash engines” list derived from `CONTRADICTIONS.md`  

P01 does **not** unlock W3 select/delete implementation; that is P03 after engine lock.
