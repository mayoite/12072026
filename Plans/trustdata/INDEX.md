# Trust-Data Plan — Index

> **For agentic workers:** REQUIRED: `/using-superpowers` + skills as fit. Use **subagent-driven-development** or **executing-plans** only after **implementation unlock** (see Unlock gate). Checkboxes (`- [ ]`) track progress.  
> **Folder rule:** All plan files for this program live under `Plans/trustdata/` only (phases · checkpoints · checklists · reviews).  
> **Expert revision:** 2026-07-09 — applied from [reviews/INDEX-00-suggestions.md](./reviews/INDEX-00-suggestions.md).  
> **Structure decision (partner):** **HYBRID** — KEEP program topology (P01–P10 · CP-00–CP-10 · folder lock · Approach A); EXPAND this INDEX + [00-START.md](./00-START.md) with week-1 kill order only; THIN phase density later (other agents). Authority: [reviews/STRUCTURE-ADVICE.md](./reviews/STRUCTURE-ADVICE.md) · [reviews/STRUCTURE-ADVICE-2.md](./reviews/STRUCTURE-ADVICE-2.md) · [reviews/STRUCTURE-REWRITE-NOTE.md](./reviews/STRUCTURE-REWRITE-NOTE.md). **No product code** in this revision.

---

## Approach A (binding default)

**Product Journey First** (recommended; default if owner silent **after** unlock):

- Ship **W1–W8** on current **FeasibilityCanvas + document model**.  
- Fix select/delete, orbit, save honesty, Block2D symbols, cabinet-v0 mesh bar, open3d Playwright pack.  
- **Fabric v7 full stage** remains the 2D **destination** — migrate **after** W1–W8 green (not mid-journey thrash).  
- Pull **2A chrome only when it blocks** a W gate (dead prefs, hidden tools, label lies).  
- Owner may override to **B** (Fabric first) or **C** (chrome first) only via recorded pick in [00-START.md](./00-START.md).

**North star:** A facilities buyer can, without a developer, open the planner, lay out a small office with real O&O-scale furniture, switch 2D↔3D with orbit, select/edit/delete, save and return the next day, and trust dimensions enough to quote later.

**Goal:** Make the open3d planner **actually work** for that buyer (gates W1–W8) using **data as truth**, Approach **A**, no plagiarism, MIT/open packages only.

**Architecture:** Document model (UUID entities, mm) → FeasibilityCanvas interim 2D + Fabric target later → Three/R3F 3D with orbit ON → O&O SKU catalog + Block2D + modular mesh → IDB autosave with honest labels → Playwright proof under `results/planner/world-standard-wave/`.

**Tech stack (locked Plan A):** Next.js site, FeasibilityCanvas (Canvas 2D), Fabric v7 flag path, Three + R3F, Phosphor icons, `crypto.randomUUID` via `newEntityId`, modular cabinet-v0, Vitest + Playwright.

---

## Unlock gate (W0 / CP-00)

| Mode | Owner must say | Agents may | Agents must not |
|------|----------------|------------|-----------------|
| **plan-only** | “plan only” / plan review / revise plans | Read repo; write/revise `Plans/trustdata/**`; write inventory evidence under `results/planner/world-standard-wave/` when a phase is **read-only** (e.g. P01); local **docs** commits | Edit product behavior under `site/features/planner/**` (or any `site/` product path for W gates); claim W1–W8 pass |
| **implementation unlock** | Explicit unlock for implementation / execute trustdata / run phases with product work | Phase work per phase file + evidence; product slices; commit as we go | Exceed phase scope; push without ask; worktrees; skip CP stop-if-fail |
| **locked (default)** | Silence (no unlock yet) | Read plans; expert reviews; no product code | Treat “default Approach A” as unlock; implement features |

**Rules:**

1. **Silent ≠ unlock.** Default Approach **A** applies only once unlock (or plan-only) is recorded and approach is chosen or defaulted.  
2. **CP-00** authoritative criteria live in [00-START.md](./00-START.md) and [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md).  
3. Evidence for W0: `results/planner/world-standard-wave/00-start/NOTES.md` (approach + mode + date + agent).  
4. Failures: `D:\OandO07072026\Failures.md`.

---

## Operating model

| Topic | Rule |
|-------|------|
| Truth | Trust **data** (repo, tests, browser evidence) — not blind belief, not character trials |
| Superpowers | Always required on main **and** every subagent; all skills permitted |
| Concurrency | Default **8** concurrent agents; hard max **10** |
| Parallelism | **After CP-02** only for W streams (see phase order); do not parallelize past hard stops |
| Tests | Run in sibling agents so they do **not** idle the critical path — **never skip** or suppress output |
| Workspace | **No worktrees** — `D:\OandO07072026` only |
| Git | **Commit as we go** after each landable slice; **push only on owner ask** |
| Plan vs product commits | Plan/review commits OK under plan-only; product commits only after implementation unlock |
| Types / tests | No `any` in handwritten TS; zero suppression of test output |
| Ethics | Inspiration-only competitor research; MIT/open packages only |
| Contract | Full subagent rules: [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) |

**Authority order:** Owner message > this folder > world-standard design spec > Plan A core > ayushdocs honesty.

---

## Phase order & dependencies (do not reorder without owner)

```
CP-00 (00-START unlock)
  → CP-01 product truth (baseline data)
  → CP-02 engine lock (stop thrash)
       → parallel after CP-02 (max 8 / hard 10 agents):
            CP-03 W3 select/delete
            CP-04 W4 orbit continuity
            CP-05 W2 symbols
            CP-06 W5–W6 save honesty
            CP-08 W7 mesh (with CP-04 feed)
            CP-09 W8 shortcuts (blocking chrome only)
       → CP-07 W1–W2 browser journey
            (needs CP-03 + CP-05 not red for full claim;
             CP-06 feeds save steps; owner may WAIVE partial journey)
       → CP-10 evidence pack + E: backup (all prior PASS or WAIVE)
```

| # | Phase file | CP | Gates | Canonical evidence folder |
|---|------------|----|-------|---------------------------|
| — | [00-START.md](./00-START.md) | **CP-00** | W0 | `00-start/` |
| P01 | [phases/P01-product-truth.md](./phases/P01-product-truth.md) | CP-01 | Baseline | `00-product-truth/` |
| P02 | [phases/P02-engine-lock.md](./phases/P02-engine-lock.md) | CP-02 | Engine lock | `01-engine-lock/` |
| P03 | [phases/P03-select-delete.md](./phases/P03-select-delete.md) | CP-03 | **W3** | `03-select-delete/` |
| P04 | [phases/P04-orbit-continuity.md](./phases/P04-orbit-continuity.md) | CP-04 | **W4** | `04-orbit-continuity/` |
| P05 | [phases/P05-symbols-svg.md](./phases/P05-symbols-svg.md) | CP-05 | **W2** symbols | `05-symbols-svg/` |
| P06 | [phases/P06-save-honesty.md](./phases/P06-save-honesty.md) | CP-06 | **W5–W6** | `06-save-honesty/` |
| P07 | [phases/P07-draw-place-journey.md](./phases/P07-draw-place-journey.md) | CP-07 | **W1–W2** browser | `02-browser-open3d-journey/` (**not** `07-…`) |
| P08 | [phases/P08-mesh-quality.md](./phases/P08-mesh-quality.md) | CP-08 | **W7** | `08-mesh-quality/` |
| P09 | [phases/P09-shortcuts-chrome.md](./phases/P09-shortcuts-chrome.md) | CP-09 | **W8** | **`09-shortcuts-chrome/`** (not mesh `08-mesh-quality/`; legacy `08-shortcuts-chrome/` non-canonical) |
| P10 | [phases/P10-evidence-handover.md](./phases/P10-evidence-handover.md) | CP-10 | Pack + backup | `10-handover/` |

**Folder map authority:** [RESULTS-MAP.md](./RESULTS-MAP.md) · FINAL lock [reviews/FOLDER-LOCK-suggestions.md](./reviews/FOLDER-LOCK-suggestions.md). Do not invent alternate gate folder names. Retired: `01-product-truth/` → `00-product-truth/`; `08-shortcuts-chrome/` → `09-shortcuts-chrome/`.

---

## Week-1 kill order (after implementation unlock)

**What this is:** Time-ordered **operator priority** for scarce agent slots (default **8**, hard max **10**).  
**What this is not:** New phase numbers · ban on post-CP-02 parallelism · second program plan · change to CHECKPOINTS pass criteria.

**Naming rule:** Lead with **W-gate + evidence folder**, then `(P0X / CP-0X)`. Never say “do P07 before P03” without also saying **W3 browser under `03-select-delete/` is still a hard gate**.

**Structure note (HYBRID):** Topology stays one file per CP. Kill order **prioritizes** streams; it does **not** split W3 unit vs browser into two CPs, and does **not** split P07 W1 vs W2 into two journey CPs.

### Serial spine (do these first)

| Order | Kill | Why first | CP / phase | Evidence folder |
|------:|------|-----------|------------|-----------------|
| 0 | Unlock + mode recorded | Silent ≠ go | CP-00 · [00-START.md](./00-START.md) | `00-start/` |
| 1 | Product truth inventory | Stop myth-driven edits | CP-01 · P01 | `00-product-truth/` |
| 2 | Engine lock | Stop thrash / hybrid engines | CP-02 · P02 | `01-engine-lock/` |
| **3** | **Select + delete + undo (unit then browser)** | Buyer cannot edit without W3; **unit alone = FAIL** | CP-03 · P03 · **W3** | **`03-select-delete/`** |
| **4** | **Draw + place browser pack** | Demo path; one serial journey pack | CP-07 · P07 · **W1–W2 browser** | **`02-browser-open3d-journey/`** |
| **5** | **Save honesty + reload** | “Return next day” north star | CP-06 · P06 · **W5–W6** | `06-save-honesty/` (+ `save-reload/`) |

**Spine one-liner:**

```
CP-00 → CP-01 → CP-02
  → W3 unit+browser (03-select-delete/)
  → W1–W2 journey (02-browser-open3d-journey/)
  → W5–W6 (06-save-honesty/)
```

### Parallel fill (after CP-02; lower priority if slots scarce)

While the spine works **3 → 4 → 5**, side agents may run the fill list **only if** they do not thrash the same canvas/keyboard contracts without coordination.

| Order | Kill | Gate | CP / phase | Evidence folder |
|------:|------|------|------------|-----------------|
| 6 | Orbit + 2D↔3D | **W4** | CP-04 · P04 | `04-orbit-continuity/` |
| 7 | Block2D symbols | **W2** quality half | CP-05 · P05 | `05-symbols-svg/` |
| 8 | Mesh bar toe/carcass/door | **W7** | CP-08 · P08 | `08-mesh-quality/` (sole primary `08-*`) |
| 9 | Shortcut/label truth | **W8** (blocking 2A only) | CP-09 · P09 | `09-shortcuts-chrome/` |
| 10 | Pack + E: backup | Close only when data supports | CP-10 · P10 | `10-handover/` |

**Priority rule:** If agent slots are scarce, spawn **kill-order 3–5** before **7–9**. Do not burn default-8 slots on mesh/chrome while W3 browser and journey lag.

### Full claim rules (unchanged — CHECKPOINTS wins)

- **No self-waive W3 browser** — CP-03 requires unit **+** browser under `03-select-delete/`; unit-green alone is **FAIL**.  
- **Journey honesty** — full W1–W2 product story for CP-07 still needs **CP-03 + CP-05 not red** unless owner **WAIVE** (already in [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md)).  
- **Parallelism allowed after CP-02** for W streams — kill order only ranks urgency; stop-if-fail still binds.  
- **Folder map** — [RESULTS-MAP.md](./RESULTS-MAP.md) remains authority; do not invent `02-engine-lock/`, `07-…` journey, or `08-shortcuts-chrome/`.

Condensed copy for unlock agents: [00-START.md](./00-START.md) § Week-1 kill order.

---

## W1–W8 (one-screen)

Definitions from `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`. P0 spine ≠ world bar.

| Gate | Meaning | Proof bar |
|------|---------|-----------|
| **W1** | Draw walls + door opening on `/planner/open3d` or guest | Playwright + screenshots |
| **W2** | Place ≥2 catalog items incl. cabinet-v0; Block2D readable | Playwright + PNG; symbols in `05-symbols-svg/` |
| **W3** | Select furniture; Delete/Backspace; undo restores | Unit + browser |
| **W4** | 2D↔3D preserves pose; **orbit ON** | Playwright + console clean |
| **W5** | Save → hard reload → same walls + furniture **ids** | Playwright + flush wait |
| **W6** | Status text truthful (local vs cloud) | Code + UI copy + test |
| **W7** | Modular mesh bar (toe/door/carcass readable) — not apology boxes | Visual smoke + NOTES |
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard |

---

## Superpowers streams (Approach A; after CP-02)

Default **8** concurrent; hard max **10**. Full contract + required prompt block: [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md).  
**Spawn in week-1 kill-order priority when slots are scarce** (serial spine 3–5 before parallel fill 6–9). Streams may run in parallel after CP-02; they are **not** equal urgency.

| Stream | Owns | Evidence folder | Kill priority |
|--------|------|-----------------|---------------|
| 1 | Select + delete + undo (W3) | `03-select-delete/` | **Spine #3** |
| 6 | Playwright journey (W1–W2 pack) | `02-browser-open3d-journey/` | **Spine #4** |
| 5 | Autosave flush + honest save (W5–W6) | `06-save-honesty/` | **Spine #5** |
| 3 | Orbit + 2D↔3D (W4) | `04-orbit-continuity/` | Fill #6 |
| 4a | Block2D symbols (W2 symbols) | `05-symbols-svg/` | Fill #7 |
| 4b | Mesh bar (W7) | `08-mesh-quality/` | Fill #8 |
| 2 | Shortcut/label truth (W8) | `09-shortcuts-chrome/` | Fill #9 |
| 7 | 2A **blockers only** | notes under `09-shortcuts-chrome/` or dedicated NOTES | Only if blocks a W gate |
| 8 | Docs / checklist / handover | `10-handover/` when closing | Close #10 |

Main agent coordinates; prefers write-to-disk; does not idle waiting on chat.

---

## Out of scope while any W red

- Photoreal / Homestyler arms race  
- Multiplayer / CRDT  
- AR / LiDAR  
- CRM / SSR expansion as substitute for W gates  
- Full Fabric walls cutover **before** W1–W8 green (Approach A)  
- Re-scraping Planner5D without owner order  
- Worktrees; push without ask; competitor assets in `site/`

---

## Program docs

| Doc | Role |
|-----|------|
| [00-START.md](./00-START.md) | Ground truth, unlock, ethics, approach pick, engine checkboxes, CP-00 |
| [phases/P01-product-truth.md](./phases/P01-product-truth.md) … [P10-evidence-handover.md](./phases/P10-evidence-handover.md) | Executable phases |
| [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md) | Hard stop gates CP-00–CP-10 |
| [checklists/MASTER-CHECKLIST.md](./checklists/MASTER-CHECKLIST.md) | Single owner checklist |
| [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) | Subagent contract + prompt block |
| [RESEARCH-MAP.md](./RESEARCH-MAP.md) | Inspiration-only research index |
| [RESULTS-MAP.md](./RESULTS-MAP.md) | Evidence folder → phase map (**FINAL folder lock**) |
| [reviews/FOLDER-LOCK-suggestions.md](./reviews/FOLDER-LOCK-suggestions.md) | Evidence path reconciliation (P01=`00-product-truth/`, P09=`09-shortcuts-chrome/`) |
| [reviews/](./reviews/) | Expert plan reviews (INDEX-00, P01–P10; path names superseded by FOLDER-LOCK where they conflict) |

**Evidence root:** `D:\OandO07072026\results\planner\world-standard-wave\`  
**Failures:** `D:\OandO07072026\Failures.md`  
**Testing:** `testing-handbook.md` + `Agents/Agents-testing.md`

**Related (outside this folder — reference only):**  
`docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` · `Plans/01-execution/core/` · `D:\websites\research\2026-07-09-world-standard\` · `ayushdocs/` (honesty; not gate pass)

---

## First agent session (read order)

1. This INDEX + [00-START.md](./00-START.md)  
2. Unlock mode: if locked → stop product work; if plan-only → plans/evidence only; if implementation unlock → continue  
3. **Week-1 kill order** (this file) — serial spine vs parallel fill before spawning streams  
4. [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md) + [RESULTS-MAP.md](./RESULTS-MAP.md)  
5. [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md)  
6. Owning phase file + its `reviews/P0X-suggestions.md`  
7. Design spec W gates (link above)

**Do not implement product code until owner records implementation unlock in 00-START / chat.**
