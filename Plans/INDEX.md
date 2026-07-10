# Plans — detailed index

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026`  
**Live tree only:** what is on disk under `Plans/` after cleanup (no `trustdata/`, no empty process thrash).

**Constitution:** repo-root `AGENTS.md`  
**Evidence (not plans):** `results/planner/world-standard-wave/`  
**History (not authority):** `archive/Plans/`

---

## Tree (on disk)

```
Plans/
├── INDEX.md                 ← this file (detailed catalog)
├── README.md                ← short entry + kill order
├── phases/                  ← product how (P01–P10)
│   ├── README.md
│   ├── EXPERT-PASS.md
│   ├── P01-product-truth/
│   ├── P02-engine-lock/
│   ├── P03-select-delete/
│   ├── P04-orbit-continuity/
│   ├── P05-symbols-svg/
│   ├── P06-save-honesty/
│   ├── P07-draw-place-journey/
│   ├── P08-mesh-quality/
│   ├── P09-shortcuts-chrome/
│   └── P10-evidence-handover/
└── Research/                ← maps + structure notes (ideas / path lock)
    ├── RESEARCH-MAP.md
    ├── RESULTS-MAP.md
    ├── STRUCTURE-ADVICE.md
    ├── STRUCTURE-ADVICE-2.md
    └── STRUCTURE-REWRITE-NOTE.md
```

**File count:** 53 markdown files under `Plans/` (phases + Research).

---

## How to use (2 minutes)

| Step | Open | Why |
|-----:|------|-----|
| 1 | [README.md](./README.md) | Kill order + authority |
| 2 | [phases/README.md](./phases/README.md) | Phase folder map |
| 3 | [phases/EXPERT-PASS.md](./phases/EXPERT-PASS.md) | Merged expert must-fix |
| 4 | One `phases/P0X-*/` execute card | How for the active CP |
| 5 | [Research/RESULTS-MAP.md](./Research/RESULTS-MAP.md) | Where evidence must land |
| 6 | `results/planner/world-standard-wave/` | Data as truth |

---

## Authority order

1. Owner message  
2. `AGENTS.md`  
3. **This plan tree** (`Plans/README.md` → phase execute card → RESULTS-MAP)  
4. `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
5. `ayushdocs/` (honesty / scoreboard — not gate pass alone)

---

## Kill order (Approach A)

Serial spine first, then fill. One owner task at a time (`AGENTS.md`).

```
CP-00 / unlock history (if any) → CP-01 product truth → CP-02 engine lock
  → CP-03 W3 select/delete (unit + browser)
  → CP-07 W1–W2 browser journey
  → CP-06 W5–W6 save honesty
  → fill: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
  → CP-10 handover pack
```

| Order | Gate | Phase folder | Evidence folder under `world-standard-wave/` |
|------:|------|--------------|-----------------------------------------------|
| 1 | Baseline | [P01-product-truth](./phases/P01-product-truth/) | `00-product-truth/` |
| 2 | Engine | [P02-engine-lock](./phases/P02-engine-lock/) | `01-engine-lock/` |
| 3 | **W3** | [P03-select-delete](./phases/P03-select-delete/) | `03-select-delete/` |
| 4 | **W1–W2** browser | [P07-draw-place-journey](./phases/P07-draw-place-journey/) | `02-browser-open3d-journey/` |
| 5 | **W5–W6** | [P06-save-honesty](./phases/P06-save-honesty/) | `06-save-honesty/` |
| 6 | **W4** | [P04-orbit-continuity](./phases/P04-orbit-continuity/) | `04-orbit-continuity/` |
| 7 | **W2** symbols | [P05-symbols-svg](./phases/P05-symbols-svg/) | `05-symbols-svg/` |
| 8 | **W7** | [P08-mesh-quality](./phases/P08-mesh-quality/) | `08-mesh-quality/` |
| 9 | **W8** | [P09-shortcuts-chrome](./phases/P09-shortcuts-chrome/) | `09-shortcuts-chrome/` |
| 10 | Pack | [P10-evidence-handover](./phases/P10-evidence-handover/) | `10-handover/` |

**Folder numbers ≠ phase numbers** (intentional). Full map: [Research/RESULTS-MAP.md](./Research/RESULTS-MAP.md).

---

## W1–W8 (one screen)

| Gate | Meaning | Primary proof |
|------|---------|---------------|
| **W1** | Draw walls + door/opening | P07 browser pack |
| **W2** | Place ≥2 incl. cabinet-v0; Block2D readable | P07 place + P05 symbols |
| **W3** | Select + Delete/Backspace + undo | P03 unit **+** browser |
| **W4** | 2D↔3D pose + orbit ON | P04 |
| **W5** | Save → hard reload → same entity ids | P06 `save-reload/` |
| **W6** | Local vs cloud labels honest | P06 |
| **W7** | Toe / door / carcass readable mesh | P08 |
| **W8** | Tool labels match keyboard handlers | P09 |

---

## `phases/` — detailed file catalog

### Root of `phases/`

| File | Role |
|------|------|
| [README.md](./phases/README.md) | Map of all ten phase folders |
| [EXPERT-PASS.md](./phases/EXPERT-PASS.md) | Consolidated expert verdict + must-fix list |

### File-kind legend (inside each `P0X-*` folder)

| Kind | Pattern | Role |
|------|---------|------|
| **Execute card** | `P0X-<slug>.md` | Day-to-day how: goal, tasks, CP criteria |
| **Appendix** | `P0X-appendix.md` | Long skeletons (only P03, P05, P07) |
| **Suggestions** | `P0X-suggestions.md` | Expert review notes applied into the card |
| **Expert essay** | `0N-*.md` | Domain expert deep-dive (may be copied into several phase folders) |
| **Folder README** | `README.md` | Local file list + links |

---

### P01 — Product truth (CP-01 · baseline)

**Folder:** [phases/P01-product-truth/](./phases/P01-product-truth/)  
**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**Gate:** Inventory only — what open3d actually does vs claims.

| File | Role |
|------|------|
| [P01-product-truth.md](./phases/P01-product-truth/P01-product-truth.md) | Execute card — inventory tasks, CAPABILITY matrix, CP-01 |
| [P01-suggestions.md](./phases/P01-product-truth/P01-suggestions.md) | Expert suggestions for P01 |
| [README.md](./phases/P01-product-truth/README.md) | Local index |

---

### P02 — Engine lock (CP-02 · engine)

**Folder:** [phases/P02-engine-lock/](./phases/P02-engine-lock/)  
**Evidence:** `01-engine-lock/`  
**Gate:** Fabric dest · Feasibility interim · Three+orbit · no hybrid thrash.

| File | Role |
|------|------|
| [P02-engine-lock.md](./phases/P02-engine-lock/P02-engine-lock.md) | Execute card — lock record, flags, package pin, anti-thrash |
| [P02-suggestions.md](./phases/P02-engine-lock/P02-suggestions.md) | Expert suggestions for P02 |
| [02-canvas-2d.md](./phases/P02-engine-lock/02-canvas-2d.md) | Expert: Canvas 2D / Fabric path |
| [05-packages-stack.md](./phases/P02-engine-lock/05-packages-stack.md) | Expert: packages / licenses |
| [README.md](./phases/P02-engine-lock/README.md) | Local index |

---

### P03 — Select / delete / undo (CP-03 · **W3**)

**Folder:** [phases/P03-select-delete/](./phases/P03-select-delete/)  
**Evidence:** `03-select-delete/`  
**Gate:** Furniture select + Delete/Backspace + undo — **unit + browser** (unit alone = FAIL).

| File | Role |
|------|------|
| [P03-select-delete.md](./phases/P03-select-delete/P03-select-delete.md) | Execute card — TDD tasks + browser hard gate |
| [P03-appendix.md](./phases/P03-select-delete/P03-appendix.md) | Pure API / pick cases / run.json skeleton |
| [P03-suggestions.md](./phases/P03-select-delete/P03-suggestions.md) | Expert suggestions for P03 |
| [01-react-open3d.md](./phases/P03-select-delete/01-react-open3d.md) | Expert: React / open3d workspace |
| [02-canvas-2d.md](./phases/P03-select-delete/02-canvas-2d.md) | Expert: Canvas 2D (copy) |
| [04-playwright-evidence.md](./phases/P03-select-delete/04-playwright-evidence.md) | Expert: Playwright / evidence |
| [README.md](./phases/P03-select-delete/README.md) | Local index |

---

### P04 — Orbit + 2D↔3D (CP-04 · **W4**)

**Folder:** [phases/P04-orbit-continuity/](./phases/P04-orbit-continuity/)  
**Evidence:** `04-orbit-continuity/`  
**Gate:** Pose continuity + orbit three-layer (defaults + workspace wiring + proof).

| File | Role |
|------|------|
| [P04-orbit-continuity.md](./phases/P04-orbit-continuity/P04-orbit-continuity.md) | Execute card — pose units, orbit default, Playwright |
| [P04-suggestions.md](./phases/P04-orbit-continuity/P04-suggestions.md) | Expert suggestions for P04 |
| [01-react-open3d.md](./phases/P04-orbit-continuity/01-react-open3d.md) | Expert: React / open3d (copy) |
| [03-r3f-3d.md](./phases/P04-orbit-continuity/03-r3f-3d.md) | Expert: 3D / orbit / mesh path |
| [README.md](./phases/P04-orbit-continuity/README.md) | Local index |

---

### P05 — Symbols / Block2D (CP-05 · **W2** symbols)

**Folder:** [phases/P05-symbols-svg/](./phases/P05-symbols-svg/)  
**Evidence:** `05-symbols-svg/`  
**Gate:** Readable cabinet-v0 Block2D; SVG publish ≠ plan canvas authority.

| File | Role |
|------|------|
| [P05-symbols-svg.md](./phases/P05-symbols-svg/P05-symbols-svg.md) | Execute card — Block2D quality + SVG honesty |
| [P05-appendix.md](./phases/P05-symbols-svg/P05-appendix.md) | Test / modularCabinetBlock skeletons |
| [P05-suggestions.md](./phases/P05-symbols-svg/P05-suggestions.md) | Expert suggestions for P05 |
| [02-canvas-2d.md](./phases/P05-symbols-svg/02-canvas-2d.md) | Expert: Canvas 2D / symbols (copy) |
| [README.md](./phases/P05-symbols-svg/README.md) | Local index |

---

### P06 — Save honesty (CP-06 · **W5–W6**)

**Folder:** [phases/P06-save-honesty/](./phases/P06-save-honesty/)  
**Evidence:** `06-save-honesty/` (+ `save-reload/` for W5)  
**Gate:** Flush + hard-reload same ids; no bare “Saved” / cloud lie.

| File | Role |
|------|------|
| [P06-save-honesty.md](./phases/P06-save-honesty/P06-save-honesty.md) | Execute card — AutoSaver flush, labels, Playwright reload |
| [P06-suggestions.md](./phases/P06-save-honesty/P06-suggestions.md) | Expert suggestions for P06 |
| [01-react-open3d.md](./phases/P06-save-honesty/01-react-open3d.md) | Expert: React / autosave path (copy) |
| [README.md](./phases/P06-save-honesty/README.md) | Local index |

---

### P07 — Draw / place journey (CP-07 · **W1–W2** browser)

**Folder:** [phases/P07-draw-place-journey/](./phases/P07-draw-place-journey/)  
**Evidence:** `02-browser-open3d-journey/` (not `07-*`)  
**Gate:** Serial Playwright: walls Δ + opening + place ≥2 incl. cabinet-v0.

| File | Role |
|------|------|
| [P07-draw-place-journey.md](./phases/P07-draw-place-journey/P07-draw-place-journey.md) | Execute card — journey steps + false-green rules |
| [P07-appendix.md](./phases/P07-draw-place-journey/P07-appendix.md) | Playwright skeletons / proof JSON shape |
| [P07-suggestions.md](./phases/P07-draw-place-journey/P07-suggestions.md) | Expert suggestions for P07 |
| [01-react-open3d.md](./phases/P07-draw-place-journey/01-react-open3d.md) | Expert: React workspace (copy) |
| [04-playwright-evidence.md](./phases/P07-draw-place-journey/04-playwright-evidence.md) | Expert: Playwright (copy) |
| [README.md](./phases/P07-draw-place-journey/README.md) | Local index |

---

### P08 — Mesh quality (CP-08 · **W7**)

**Folder:** [phases/P08-mesh-quality/](./phases/P08-mesh-quality/)  
**Evidence:** `08-mesh-quality/` (sole primary `08-*`)  
**Gate:** Toe → carcass → door readable; height integrity; not photoreal.

| File | Role |
|------|------|
| [P08-mesh-quality.md](./phases/P08-mesh-quality/P08-mesh-quality.md) | Execute card — bar formulas, blast tests, visual smoke |
| [P08-suggestions.md](./phases/P08-mesh-quality/P08-suggestions.md) | Expert suggestions for P08 |
| [03-r3f-3d.md](./phases/P08-mesh-quality/03-r3f-3d.md) | Expert: 3D mesh path (copy) |
| [README.md](./phases/P08-mesh-quality/README.md) | Local index |

---

### P09 — Shortcuts / chrome (CP-09 · **W8**)

**Folder:** [phases/P09-shortcuts-chrome/](./phases/P09-shortcuts-chrome/)  
**Evidence:** `09-shortcuts-chrome/`  
**Gate:** Map-driven keys (D=door, M=dimension…); hide-tools chrome only.

| File | Role |
|------|------|
| [P09-shortcuts-chrome.md](./phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md) | Execute card — truth table, handler fix, aria |
| [P09-suggestions.md](./phases/P09-shortcuts-chrome/P09-suggestions.md) | Expert suggestions for P09 |
| [06-ui-shortcuts.md](./phases/P09-shortcuts-chrome/06-ui-shortcuts.md) | Expert: UI shortcuts |
| [README.md](./phases/P09-shortcuts-chrome/README.md) | Local index |

---

### P10 — Evidence / handover (CP-10 · pack)

**Folder:** [phases/P10-evidence-handover/](./phases/P10-evidence-handover/)  
**Evidence:** `10-handover/`  
**Gate:** Pack + MASTER-style sync + E: backup. **No product code under P10.**

| File | Role |
|------|------|
| [P10-evidence-handover.md](./phases/P10-evidence-handover/P10-evidence-handover.md) | Execute card — six pack files, backup procedure |
| [P10-suggestions.md](./phases/P10-evidence-handover/P10-suggestions.md) | Expert suggestions for P10 |
| [README.md](./phases/P10-evidence-handover/README.md) | Local index |

---

## Expert essays — unique sources (no duplicate listing)

Cross-cutting essays live **inside phase folders** (copied where multiple phases need them). Canonical **primary** homes:

| Essay | Primary folder | Also in |
|-------|----------------|---------|
| [01-react-open3d.md](./phases/P03-select-delete/01-react-open3d.md) | P03 | P04 · P06 · P07 |
| [02-canvas-2d.md](./phases/P02-engine-lock/02-canvas-2d.md) | P02 | P03 · P05 |
| [03-r3f-3d.md](./phases/P04-orbit-continuity/03-r3f-3d.md) | P04 | P08 |
| [04-playwright-evidence.md](./phases/P03-select-delete/04-playwright-evidence.md) | P03 | P07 |
| [05-packages-stack.md](./phases/P02-engine-lock/05-packages-stack.md) | P02 | — |
| [06-ui-shortcuts.md](./phases/P09-shortcuts-chrome/06-ui-shortcuts.md) | P09 | — |

Merged summary: [phases/EXPERT-PASS.md](./phases/EXPERT-PASS.md).

---

## `Research/` — detailed file catalog

Maps and structure history. **Research is not W-gate proof.** Evidence stays under `results/planner/world-standard-wave/`.

| File | Role |
|------|------|
| [RESEARCH-MAP.md](./Research/RESEARCH-MAP.md) | Inspiration packs under `D:\websites` · phase → research routing · ethics |
| [RESULTS-MAP.md](./Research/RESULTS-MAP.md) | **FINAL** evidence folder lock · gate → folder · run.json contract |
| [STRUCTURE-ADVICE.md](./Research/STRUCTURE-ADVICE.md) | Structure pass #1 (KEEP topology; thin density) |
| [STRUCTURE-ADVICE-2.md](./Research/STRUCTURE-ADVICE-2.md) | Structure pass #2 (HYBRID label; kill order expand) |
| [STRUCTURE-REWRITE-NOTE.md](./Research/STRUCTURE-REWRITE-NOTE.md) | What was applied (folder-wise phases, reviews folded) |

---

## Flat inventory (all 53 files)

### phases/ (48)

```
phases/EXPERT-PASS.md
phases/README.md
phases/P01-product-truth/P01-product-truth.md
phases/P01-product-truth/P01-suggestions.md
phases/P01-product-truth/README.md
phases/P02-engine-lock/02-canvas-2d.md
phases/P02-engine-lock/05-packages-stack.md
phases/P02-engine-lock/P02-engine-lock.md
phases/P02-engine-lock/P02-suggestions.md
phases/P02-engine-lock/README.md
phases/P03-select-delete/01-react-open3d.md
phases/P03-select-delete/02-canvas-2d.md
phases/P03-select-delete/04-playwright-evidence.md
phases/P03-select-delete/P03-appendix.md
phases/P03-select-delete/P03-select-delete.md
phases/P03-select-delete/P03-suggestions.md
phases/P03-select-delete/README.md
phases/P04-orbit-continuity/01-react-open3d.md
phases/P04-orbit-continuity/03-r3f-3d.md
phases/P04-orbit-continuity/P04-orbit-continuity.md
phases/P04-orbit-continuity/P04-suggestions.md
phases/P04-orbit-continuity/README.md
phases/P05-symbols-svg/02-canvas-2d.md
phases/P05-symbols-svg/P05-appendix.md
phases/P05-symbols-svg/P05-suggestions.md
phases/P05-symbols-svg/P05-symbols-svg.md
phases/P05-symbols-svg/README.md
phases/P06-save-honesty/01-react-open3d.md
phases/P06-save-honesty/P06-save-honesty.md
phases/P06-save-honesty/P06-suggestions.md
phases/P06-save-honesty/README.md
phases/P07-draw-place-journey/01-react-open3d.md
phases/P07-draw-place-journey/04-playwright-evidence.md
phases/P07-draw-place-journey/P07-appendix.md
phases/P07-draw-place-journey/P07-draw-place-journey.md
phases/P07-draw-place-journey/P07-suggestions.md
phases/P07-draw-place-journey/README.md
phases/P08-mesh-quality/03-r3f-3d.md
phases/P08-mesh-quality/P08-mesh-quality.md
phases/P08-mesh-quality/P08-suggestions.md
phases/P08-mesh-quality/README.md
phases/P09-shortcuts-chrome/06-ui-shortcuts.md
phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md
phases/P09-shortcuts-chrome/P09-suggestions.md
phases/P09-shortcuts-chrome/README.md
phases/P10-evidence-handover/P10-evidence-handover.md
phases/P10-evidence-handover/P10-suggestions.md
phases/P10-evidence-handover/README.md
```

### Research/ (5)

```
Research/RESEARCH-MAP.md
Research/RESULTS-MAP.md
Research/STRUCTURE-ADVICE.md
Research/STRUCTURE-ADVICE-2.md
Research/STRUCTURE-REWRITE-NOTE.md
```

### Plans root (2)

```
INDEX.md    ← this catalog
README.md   ← short entry
```

---

## Explicitly not in this tree (deleted / elsewhere)

| Path | Status |
|------|--------|
| `Plans/trustdata/` | Removed — do not use |
| `Plans/**/reviews/` | Removed — notes co-located |
| Empty CP theater / process fluff | Owner deleted as rubbish |
| Evidence packs | Live under `results/planner/world-standard-wave/` only |
| Old plan packs | `archive/Plans/` only |

---

## Related outside Plans

| Need | Path |
|------|------|
| Agents constitution | `AGENTS.md` |
| Elon bar | `Agents/Agents-ELON-STANDARD.md` |
| Design W1–W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Scoreboard | `ayushdocs/19-GOALS-SLICES.md` |
| Product why | `ayushdocs/18-PRODUCT-CONTEXT.md` |
| Testing | `testing-handbook.md` |
| Failures | `Failures.md` |

---

*Index rebuilt from live disk after owner cleanup. If a path is missing on disk, this file is wrong — re-run inventory.*
