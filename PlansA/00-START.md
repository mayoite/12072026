# 00-START — Session zero (PlansA)

**For:** next engineer or agent on `D:\OandO07072026`  
**Maps to:** EXECUTABLE-PLAN Task 00  
**Date of package:** 2026-07-10  
**Repo HEAD at source synthesis:** `cb62c4e` — **re-check on execute**

> **For agentic workers:** `/using-superpowers` first. Work only in `D:\OandO07072026` (no worktrees).  
> **Do not** mark any W gate PASS from this card alone.

---

## Prerequisites

| Requirement | Detail |
|-------------|--------|
| Checkout | **Only** `D:\OandO07072026` main · **no worktrees** |
| Package manager | **pnpm** from repo root (`pnpm-workspace.yaml`) |
| Env | Repo-root `.env.local` (never commit). Copy from `.env.example` if missing |
| Node | Match repo engines (see root / site `package.json`) |
| Evidence path | **Only** repo-root `results/` — never `site/results/`, never `site/test-results/` |
| Shell | PowerShell OK; **`rg` may be missing** → use Select-String or install ripgrep |
| Skills | `/using-superpowers` + fit skills (verification, TDD for residual code) |
| Firecrawl | **Dead** — do not re-run research scrapes |
| Ethics | Research under `D:\websites` = ideas only — **no** competitor paste into product |
| Execute authority | **`PlansA/`** only — not dual plans1/plans2 |

### Immediate first commands

```powershell
cd D:\OandO07072026
git worktree list
# Expect: single main checkout only

git log -1 --oneline
git status -sb
git rev-parse HEAD

# results/ honesty
if (Test-Path results) { Get-ChildItem results -Recurse -Depth 2 | Select-Object -First 40 FullName } else { Write-Output "results/: MISSING — re-prove all gates" }

# Source trees present (reference, not dual-run)
Test-Path .\PlansA\README.md
Test-Path .\plans1\README.md
Test-Path .\plans2\README.md

pnpm install
pnpm run check:layout
# Expect FAIL with REQUIRED missing: results/ until you create results/

# After mkdir:
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-start" | Out-Null
pnpm run check:layout
# Expect PASS once results/ exists (and no forbidden site/ dumps)
```

Optional env check:

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

Dev server (later browser work):

```powershell
pnpm run dev
# Guest planner: http://localhost:3000/planner/guest/
# Open3d:        http://localhost:3000/planner/open3d
```

---

## What is already shipped vs residual

### Shipped (do **not** rebuild)

From CODE-REVIEW reports (plans1 + plans2, 2026-07-10) vs live `site/features/planner/open3d/`:

| Area | Status | Primary paths |
|------|--------|---------------|
| Hybrid open3d host chain | Live | guest/canvas → `Open3dPlannerWorkspaceRoute`; open3d → `Open3dPlannerHost` |
| 2D interim | Live | `FeasibilityCanvas` (Fabric furniture flag OFF by default) |
| Fabric destination spike | Present, gated | `canvas-fabric-stage/` · env exact `"1"` only |
| Select / delete / undo | **Landed** | `applySelectionDelete`, `deleteSelection`, keyboard Del/Bksp |
| Orbit ON + helper | **Landed** | `orbitDefaults.ts`, workspace spreads `getOpen3dViewerControlProps()` |
| Local autosave flush spine | **Partial land** | `createAutoSaver.flush`, pagehide/unmount flush, “Saved locally” path |
| Block2D cabinet-v0 multi-prim | **Landed** · units green | `furnitureBlock2D.ts` modular path |
| Mesh toe→carcass→door | **Landed** · primary units green | `modularCabinetV0.ts` |
| Shortcut map invert D/M honest | **Landed** · key suites green | `canvasTool.ts` + `useWorkspaceKeyboard` |
| Permanent fabric → open3d redirects | Live | `site/config/build/next.config.js` |
| Unit/e2e **sources** | Dense under `site/tests/` | **Not green for gates** without `results/` artifacts |

### Residual (this package)

| Bucket | What |
|--------|------|
| **Universal** | Entire `results/` tree missing → re-prove every CP/W |
| **P01–P02** | Evidence packs only (inventory + engine freeze) |
| **P03** | Unit gap cases + browser W3 + evidence (Mode A) |
| **P07** | Rewrite journey (Opening + cabinet-v0 + honest identity); kill configurator-as-W2 |
| **P06** | Help honesty, UUID W5 e2e, label/testids, projectRef, write-proof units |
| **P04** | Wiring unit + e2e console harden + evidence |
| **P05** | Re-prove units + prim-JSON + honesty NOTES only |
| **P08** | NOTES + smoke + G5 honesty + evidence; **skip** geometry rewrite |
| **P09** | `aria-keyshortcuts` helper, rail a11y, evidence |
| **P10** | Mode A FAIL-honest six-file pack; Mode B blocked until map-min green |
| **P11** | End-to-end buyer journey + evidence integrity + layout gate |

### Paper-green sources (ignore for PASS)

- Phase cards under `Plans/phases/P0X-*/` claiming DONE/PASS without disk folders
- `Plans/Research/Others/00-PENDING.md` / goals slices W PASS language
- Historical `10-handover/W-GATES.md` GATE PASS from git/E: backup without re-prove on HEAD
- Root `Idiots2/` / `Idiots/` (do not exist — use `archive/Idiots2/` and `archive/Idiots/`)

---

## Order of work

```
00-START → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

Do **not** start P03 product thrash before P02 evidence + owner posture.  
Do **not** run P10 Mode B before P01–P09 residual DONE.  
Do **not** claim ship until **P11** exits green/honest.

Detailed tasks: [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md) · Flat board: [CHECKLIST-MASTER.md](./CHECKLIST-MASTER.md)

---

## Stop rules / owner decisions

| Stop if | Action |
|---------|--------|
| Goal changes to new product area | Stop; realign with owner |
| Two writers on same package | Stop; serialize |
| Tempted to rewrite Feasibility/Fabric engines | Stop — Approach A lock (P02) |
| Tempted to re-implement toe/mesh geometry (P08 units green) | Stop — evidence only |
| Tempted to re-implement shortcut invert (P09 units green) | Stop — residual aria only |
| W5 e2e “green” on furniture **count** only | Stop — must assert UUIDs (P06) |
| Journey “green” via chair/configurator | Stop — must be cabinet-v0 + second real SKU (P07) |
| `results/` still missing and claiming PASS | **Always FAIL** |
| Mode B / CP-10 PASS with empty wave | Forbidden (P10) |
| Purchase / force-push / destroy owner data | Stop; owner only |
| `rg` missing and greps empty | Fail closed or Select-String fallback — do not invent matrix |

### Owner decisions (explicit)

| Decision | Default in this package |
|----------|-------------------------|
| P02 OWNER-SIGNOFF Template A vs B | Template **B (deferral)** keeps planning/evidence; **A** unlocks product residual confidence narrative — still re-prove W gates |
| P06 cloud autosave | **Cancel** (Task 07) unless owner unlocks |
| P10 recovery from E: backup | Optional Pack-B with **remap** + re-verify; prefer rebuild via P01–P09 |
| P04 Playwright deferral if unit green | Prefer browser green; deferral only with **written** NOTES + owner OK |
| Fabric full-stage cutover in this wave | **No** |
| Push origin / mayoite | AGENTS standing: agent may push landable green slices; never force-push |

---

## Session-zero checklist

- [ ] Single worktree at `D:\OandO07072026` (`git worktree list`)
- [ ] Record HEAD: `git log -1 --format="%H %s"` → `results/planner/world-standard-wave/00-start/HEAD.txt` after mkdir
- [ ] Record dirty honesty: `git status -sb` → `00-start/DIRTY.txt` if dirty
- [ ] Confirm `results/` missing or inventory existing (do not claim historical PASS)
- [ ] `pnpm install` succeeds
- [ ] Create at least: `results/planner/world-standard-wave/` (and `00-start/`)
- [ ] `pnpm run check:layout` **PASS** after `results/` exists
- [ ] Confirm brainstormer paths: `archive/Idiots2/` and `archive/Idiots/` exist; root `Idiots*` do **not**
- [ ] Grep tool: `Get-Command rg` — if missing, document Select-String fallback in `00-start/NOTES.md`
- [ ] Read this package: README · EXECUTABLE-PLAN header · MERGE-NOTES · CHANGES-JUSTIFICATION
- [ ] Confirm Fabric flag OFF for all W proofs: `$env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset or not `"1"`
- [ ] Optional: note E: backup path if present (`E:\OandO-backups\trustdata-2026-07-10\`) — **not** auto-PASS
- [ ] Write `00-start/NOTES.md` with: approach A binding, date, agent id, “results re-prove wave”, source = PlansA
- [ ] Do **not** edit product code in session zero
- [ ] Do **not** empty/delete `plans1/` or `plans2/`
- [ ] Ready for P01 Task group only when checkboxes above done

---

## Evidence paths (session zero)

```
results/planner/world-standard-wave/00-start/
  HEAD.txt
  DIRTY.txt          # if dirty
  NOTES.md
  run.json           # optional session zero meta
```

Canonical later folders: [Plans/Research/RESULTS-MAP.md](../Plans/Research/RESULTS-MAP.md)

---

## Next step after session zero

Open [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md) → **Task group P01** (product truth re-materialize).  
Track ticks in [CHECKLIST-MASTER.md](./CHECKLIST-MASTER.md).
