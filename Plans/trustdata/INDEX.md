# Trust-Data Plan — Index

> **For agentic workers:** REQUIRED: `/using-superpowers` + skills as fit. Use **subagent-driven-development** or **executing-plans** only after **implementation unlock** (see Unlock gate). Checkboxes (`- [ ]`) track progress.  
> **Folder rule:** All plan files for this program live under `Plans/trustdata/` only (phases · checkpoints · checklists · reviews).  
> **Expert revision:** 2026-07-09 — applied from [reviews/INDEX-00-suggestions.md](./reviews/INDEX-00-suggestions.md).  
> **Structure rewrite 2026-07-09 (hybrid thin):** KEEP topology (P01–P10 · CP-00–CP-10 · folder lock · Approach A · AGENT-RULES); EXPAND week-1 kill order below + [00-START.md](./00-START.md); THIN densest phases → mains + [P03-appendix](./phases/P03-appendix.md) · [P05-appendix](./phases/P05-appendix.md) · [P07-appendix](./phases/P07-appendix.md). Authority: [STRUCTURE-REWRITE-NOTE](./reviews/STRUCTURE-REWRITE-NOTE.md). **No product code.**

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
| **implementation unlock** | Explicit unlock for implementation / execute trustdata / run phases with product work | Phase work per phase file + evidence; product slices; commit as you go; push/mirror per `AGENTS.md` | Exceed phase scope; force-push / destroy remotes; worktrees; skip CP stop-if-fail |
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
| Concurrency | Default **8** agents; hard max **10** — **only inside one owner task** |
| Parallelism | **One task at a time.** Parallel agents = sub-slices of **that** task only. Kill order is **serial priority** of phases — **not** concurrent multi-CP jobs (owner 2026-07-09: multi-task parallel finishes nothing) |
| Tests | Sibling agents OK **for the active task** so critical path is not idle — **never skip** or suppress output |
| Workspace | **No worktrees** — `D:\OandO07072026` only |
| Plan vs product commits | Plan/review commits OK under plan-only; product commits only after implementation unlock |
| Types / tests | No `any` in handwritten TS; zero suppression of test output |
| Ethics / licenses | `AGENTS.md` + `ayushdocs/17-LICENSES-CLEARED.md` |
| Contract | Short: [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) · full: `AGENTS.md` |
| Git | Commit as we go; push origin when right; mirror ~30–60m (`mayoite`) — `AGENTS.md`. No force-push without owner |
| Quality | Global manufacturer-planner standard; quality over speed; no prompt-engineering theater |
| Later / optional | [LATER.md](./LATER.md) — SmartDraw/Foyr/Coohom etc. **not** kill-path |

**Authority order:** Owner message > this folder > world-standard design spec > Plan A core > ayushdocs honesty.

---

## Week-1 kill order (after implementation unlock)

**What this is:** Time-ordered **which single task next** when choosing work (default **8** agents inside that task, hard max **10**).  
**What this is not:** Permission to run several CPs/W-gates at once · second program plan · change to CHECKPOINTS pass criteria.

**Naming rule:** Lead with **W-gate + evidence folder**, then `(P0X / CP-0X)`. Never say “do P07 before P03” without also saying **W3 browser under `03-select-delete/` is still a hard gate**.

**Structure note (HYBRID):** Topology stays one file per CP. Kill order **prioritizes the next single task**; it does **not** mean concurrent multi-stream execution. Does **not** split W3 unit vs browser into two CPs. Skeletons: [P03-appendix](./phases/P03-appendix.md) · [P05-appendix](./phases/P05-appendix.md) · [P07-appendix](./phases/P07-appendix.md).

### Serial spine (do these first)

| Order | Kill | Why first | CP / phase | Evidence folder |
|------:|------|-----------|------------|-----------------|
| 0 | Unlock + mode recorded | Silent ≠ go | CP-00 · [00-START.md](./00-START.md) | `00-start/` |
| 1 | Product truth inventory | Stop myth-driven edits | CP-01 · [P01](./phases/P01-product-truth.md) | `00-product-truth/` |
| 2 | Engine lock | Stop thrash / hybrid engines | CP-02 · [P02](./phases/P02-engine-lock.md) | `01-engine-lock/` |
| **3** | **Select + delete + undo (unit then browser)** | Buyer cannot edit without W3; **unit alone = FAIL** | CP-03 · [P03](./phases/P03-select-delete.md) · **W3** | **`03-select-delete/`** |
| **4** | **Draw + place browser pack** | Demo path; one serial journey pack | CP-07 · [P07](./phases/P07-draw-place-journey.md) · **W1–W2 browser** | **`02-browser-open3d-journey/`** |
| **5** | **Save honesty + reload** | “Return next day” north star | CP-06 · [P06](./phases/P06-save-honesty.md) · **W5–W6** | `06-save-honesty/` (+ `save-reload/`) |

**Spine one-liner:**

```
CP-00 unlock → CP-01 truth → CP-02 engine
  → CP-03 W3 (unit+browser)     # 03-select-delete/
  → CP-07 journey W1–W2         # 02-browser-open3d-journey/
  → CP-06 save honesty          # 06-save-honesty/
  → next single tasks in order: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
  → CP-10 handover
```

### Later fill (after spine — **one task at a time**, not concurrent multi-CP)

After spine items **3 → 4 → 5** are done (or owner picks one fill item as **the** active task), take **exactly one** row below, finish it, then the next.

| Order | Kill | Gate | CP / phase | Evidence folder |
|------:|------|------|------------|-----------------|
| 6 | Orbit + 2D↔3D | **W4** | CP-04 · [P04](./phases/P04-orbit-continuity.md) | `04-orbit-continuity/` |
| 7 | Block2D symbols | **W2** quality half | CP-05 · [P05](./phases/P05-symbols-svg.md) | `05-symbols-svg/` |
| 8 | Mesh bar toe/carcass/door | **W7** | CP-08 · [P08](./phases/P08-mesh-quality.md) | `08-mesh-quality/` (sole primary `08-*`) |
| 9 | Shortcut/label truth | **W8** (blocking 2A only) | CP-09 · [P09](./phases/P09-shortcuts-chrome.md) | `09-shortcuts-chrome/` |
| 10 | Pack + E: backup | Close only when data supports | CP-10 · [P10](./phases/P10-evidence-handover.md) | `10-handover/` |

**Priority rule:** Do spine **3–5** before fill **6–9**. **Never** spawn mesh + chrome + orbit as separate concurrent tasks.

### Full claim rules (CHECKPOINTS + one-task rule)

- **No self-waive W3 browser** — CP-03 requires unit **+** browser under `03-select-delete/`; unit-green alone is **FAIL**.  
- **Journey honesty** — full W1–W2 product story for CP-07 still needs **CP-03 + CP-05 not red** unless owner **WAIVE**.  
- **One owner task** — parallel agents only as sub-slices of that task; kill order ranks **which task next**, not multi-job fan-out.  
- **Folder map** — [RESULTS-MAP.md](./RESULTS-MAP.md) remains authority; do not invent `02-engine-lock/`, `07-…` journey, or `08-shortcuts-chrome/`.

Condensed copy for unlock agents: [00-START.md](./00-START.md) § Week-1 kill order.

---

## Phase order & dependencies (do not reorder without owner)

Kill order (above) is the **next single task** sequence after unlock. Dependency graph = hard stops + serial priority — **not** concurrent multi-CP:

```
CP-00 (00-START unlock)
  → CP-01 product truth (baseline data)
  → CP-02 engine lock (stop thrash)
       → one task at a time: CP-03 W3 → CP-07 W1–W2 browser → CP-06 W5–W6
       → then one task at a time: CP-04 · CP-05 · CP-08 · CP-09
       → CP-07 full claim needs CP-03 + CP-05 not red unless owner WAIVE
       → CP-10 evidence pack + E: backup (all prior PASS or WAIVE)
```

| # | Phase file | CP | Gates | Canonical evidence folder |
|---|------------|----|-------|---------------------------|
| — | [00-START.md](./00-START.md) | **CP-00** | W0 | `00-start/` |
| P01 | [phases/P01-product-truth.md](./phases/P01-product-truth.md) | CP-01 | Baseline | `00-product-truth/` |
| P02 | [phases/P02-engine-lock.md](./phases/P02-engine-lock.md) | CP-02 | Engine lock | `01-engine-lock/` |
| P03 | [phases/P03-select-delete.md](./phases/P03-select-delete.md) (+ [appendix](./phases/P03-appendix.md)) | CP-03 | **W3** | `03-select-delete/` |
| P04 | [phases/P04-orbit-continuity.md](./phases/P04-orbit-continuity.md) | CP-04 | **W4** | `04-orbit-continuity/` |
| P05 | [phases/P05-symbols-svg.md](./phases/P05-symbols-svg.md) (+ [appendix](./phases/P05-appendix.md)) | CP-05 | **W2** symbols | `05-symbols-svg/` |
| P06 | [phases/P06-save-honesty.md](./phases/P06-save-honesty.md) | CP-06 | **W5–W6** | `06-save-honesty/` |
| P07 | [phases/P07-draw-place-journey.md](./phases/P07-draw-place-journey.md) (+ [appendix](./phases/P07-appendix.md)) | CP-07 | **W1–W2** browser | `02-browser-open3d-journey/` (**not** `07-…`) |
| P08 | [phases/P08-mesh-quality.md](./phases/P08-mesh-quality.md) | CP-08 | **W7** | `08-mesh-quality/` |
| P09 | [phases/P09-shortcuts-chrome.md](./phases/P09-shortcuts-chrome.md) | CP-09 | **W8** | **`09-shortcuts-chrome/`** (not mesh `08-mesh-quality/`; legacy `08-shortcuts-chrome/` non-canonical) |
| P10 | [phases/P10-evidence-handover.md](./phases/P10-evidence-handover.md) | CP-10 | Pack + backup | `10-handover/` |

**Folder map authority:** [RESULTS-MAP.md](./RESULTS-MAP.md) · FINAL lock [reviews/FOLDER-LOCK-suggestions.md](./reviews/FOLDER-LOCK-suggestions.md). Do not invent alternate gate folder names. Retired: `01-product-truth/` → `00-product-truth/`; `08-shortcuts-chrome/` → `09-shortcuts-chrome/`.

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

## Superpowers — one active task (Approach A)

Default **8** agents **inside the active task**; hard max **10**. Contract: [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md).  
**Pick one row as the only active product task** (kill-order priority). Parallel agents = sub-slices of that row only — **not** several rows at once.

| When active alone | Owns | Evidence folder | Priority |
|-------------------|------|-----------------|----------|
| 1 | Select + delete + undo (W3) | `03-select-delete/` | **Spine #3** |
| 6 | Playwright journey (W1–W2 pack) | `02-browser-open3d-journey/` | **Spine #4** |
| 5 | Autosave flush + honest save (W5–W6) | `06-save-honesty/` | **Spine #5** |
| 3 | Orbit + 2D↔3D (W4) | `04-orbit-continuity/` | Next #6 |
| 4a | Block2D symbols (W2 symbols) | `05-symbols-svg/` | Next #7 |
| 4b | Mesh bar (W7) | `08-mesh-quality/` | Next #8 |
| 2 | Shortcut/label truth (W8) | `09-shortcuts-chrome/` | Next #9 |
| 7 | 2A **blockers only** | notes under `09-shortcuts-chrome/` or dedicated NOTES | Only if blocks active W |
| 8 | Docs / checklist / handover | `10-handover/` when closing | Close #10 |

Main agent coordinates; write-to-disk; **finish the active task** before starting another.

---

## Out of scope while any W red

- Photoreal / Homestyler arms race  
- Multiplayer / CRDT  
- AR / LiDAR  
- CRM / SSR expansion as substitute for W gates  
- Full Fabric walls cutover **before** W1–W8 green (Approach A)  
- Re-scraping Planner5D without owner order  
- Worktrees; force-push without owner; competitor assets in `site/`

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
