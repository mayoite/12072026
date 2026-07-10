# START HERE — residual wave execute

**One package. One path. No dual trees.**  
**Four-seat review:** [`FOUR-SEAT-REVIEW.md`](./FOUR-SEAT-REVIEW.md) (executor 6/10 · planner · critic SHIP-WITH-FIXES · benchmark 84/100)

| | |
|--|--|
| **Execute** | **`plans1/`** (this folder) |
| **How + folder names** | `Plans/Research/RESULTS-MAP.md` |
| **Archived (not execute)** | `archive/plans2/`, `archive/PlansA/` — open only if stuck on hardness |
| **Optional cross-check** | `archive/plans2/P0X/CODE-REVIEW-REPORT.md` — if FAIL vs plans1 APPROVE, **gate is FAIL** |

**Session-zero path re-prove (mandatory):**

```powershell
cd D:\OandO07072026
@Test-Path Plans\Research\RESULTS-MAP.md
@Test-Path plans1\START-HERE.md
@Test-Path results   # expect False until you create it
# If Plans map False → use archive\Plans\Research\RESULTS-MAP.md and fix docs before claiming PASS
```

---

## You open exactly these (in order)

1. **This file**
2. [`EXECUTE-NOW.md`](./EXECUTE-NOW.md) — kill order + posture (5 min)
3. [`00-START.md`](./00-START.md) — session zero commands
4. Active phase: `P0X-*/CODE-REVIEW-REPORT.md` **first**, then residual tasks in [`EXECUTABLE-PLAN.md`](./EXECUTABLE-PLAN.md)
5. Tick [`CHECKLIST-MASTER.md`](./CHECKLIST-MASTER.md) with real `results/` paths
6. End: [`P11-CHECKLIST.md`](./P11-CHECKLIST.md)

**Per phase you read at most two files:**  
`CODE-REVIEW-REPORT.md` + (if needed) `IMPLEMENTATION-PLAN.md`.

---

## Kill order (binding)

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

| Order | Phase | Evidence folder | Code residual? |
|------:|-------|-----------------|----------------|
| 0 | Session | `00-start/` optional | — |
| 1 | P01 inventory | `00-product-truth/` | No — pack only |
| 2 | P02 freeze | `01-engine-lock/` | No — no rebuild |
| 3 | P03 W3 | `03-select-delete/` | Small unit gaps + **browser required** |
| 4 | P07 W1–W2 | `02-browser-open3d-journey/` | **Yes** — journey rewrite |
| 5 | P06 W5–W6 | `06-save-honesty/` | **Yes** — help / UUID / labels |
| 6 | P04 W4 | `04-orbit-continuity/` | Small harden |
| 7 | P05 symbols | `05-symbols-svg/` | No thrash if unit green |
| 8 | P08 mesh | `08-mesh-quality/` | Evidence only if mesh green |
| 9 | P09 W8 | `09-shortcuts-chrome/` | **Yes** — aria + rail |
| 10 | P10 pack | `10-handover/` | Mode A if results thin |
| 11 | P11 close | `11-integration-closeout/` | Honesty board |

Wave root: `results/planner/world-standard-wave/` only.

---

## Stricter rules (merged from plans2 — already binding here)

You do **not** need archived packages for these (already binding here):

1. **W3:** unit alone = **FAIL** — browser pack mandatory  
2. **W5:** UUID identity, not furniture **count**  
3. **P06:** leave path must flush **latest** envelope / projectRef — not bare dead flush  
4. **P07:** identity from **place CTA**; no configurator-only green; no force-true cabinet  
5. **P09:** `aria-keyshortcuts` + Dimension(M)/Wall(W) rail — not optional polish  
6. **P10:** Mode B blocked until map-min green on **this HEAD**  
7. **Cloud autosave Task 07:** **cancel** (local honesty first)  
8. **Paper PASS** without disk under `results/` = **FAIL**

---

## What each folder is for (stop the confusion)

| Folder | Use it? | Why |
|--------|---------|-----|
| **plans1/** | **Yes — execute** | Only live residual package |
| **Plans/** | Maps only | RESULTS-MAP + phase how |
| **archive/plans2/** | Rare | Frozen Idiots reviews |
| **archive/PlansA/** | Rare | Frozen merge museum |
| **archive/Plans/** | No | Backup of Plans |

---

## First commands

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
# results missing ⇒ re-prove everything
if (-not (Test-Path results)) { Write-Output "results/: MISSING — unproven" }
pnpm run check:layout   # may fail until results/ exists — OK
```

Then open [`EXECUTE-NOW.md`](./EXECUTE-NOW.md) and start **P01**.

**Honesty:** Earlier docs said “execute PlansA.” That was wrong for humans/agents. PlansA is the most confusing tree. **Execute plans1.**
