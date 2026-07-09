# Trust-Data Plan — 00 START

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. **No product code** until owner records **implementation unlock**. Plan-only mode allows plan/review work only. Steps use checkbox syntax.  
> **Expert revision:** 2026-07-09 — applied from [reviews/INDEX-00-suggestions.md](./reviews/INDEX-00-suggestions.md).  
> **Structure decision (partner):** **HYBRID** — KEEP topology; week-1 kill order lives fully in [INDEX.md](./INDEX.md); this file keeps a **condensed** copy only. See [reviews/STRUCTURE-REWRITE-NOTE.md](./reviews/STRUCTURE-REWRITE-NOTE.md).  
> **Program index:** [INDEX.md](./INDEX.md)

**Goal:** Freeze operating rules, approach pick, unlock mode, ethics, and phase order so every agent works from the same truth.

**Architecture:** One checkout `D:\OandO07072026`; one plan root `Plans/trustdata/`; data decides “done.”

**Tech stack:** See [INDEX.md](./INDEX.md).

**North star:** A facilities buyer can, without a developer, open the planner, lay out a small office with real O&O-scale furniture, switch 2D↔3D with orbit, select/edit/delete, save and return the next day, and trust dimensions enough to quote later.

---

## Approach A (binding default)

**Product Journey First** — ship **W1–W8** on **FeasibilityCanvas + document model** first; keep Fabric v7 full stage as 2D **destination** after gates green; pull 2A chrome **only** when it blocks a W gate.

| Pick | Meaning |
|------|---------|
| **A** (default) | Product journey first — **recommended** |
| **B** | Fabric full stage first |
| **C** | Chrome / 2A first |

Owner records pick below. **Default if owner silent after unlock:** **A**.  
**Silent before unlock does not authorize product work.**

---

## Unlock gate (W0) — modes

| Mode | Owner statement (examples) | Allowed | Forbidden |
|------|----------------------------|---------|-----------|
| **locked** (default until stated) | _(none)_ | Read plans; expert review | Product edits; W-gate claims; treat default A as go-code |
| **plan-only** | “plan only”, “revise plans”, “no product code” | `Plans/trustdata/**` edits; read-only inventory evidence (e.g. P01); docs commits | `site/features/planner/**` product behavior changes; claiming W1–W8 |
| **implementation unlock** | “unlock implementation”, “execute trustdata”, “run product phases” | Phase product work per phase files + evidence + local commits | Worktrees; push without ask; skip CP stop-if-fail; scope creep without ask |

### Owner pick (gate W0)

- [ ] Approach **A** — Product journey first (recommended)
- [ ] Approach **B** — Fabric full stage first
- [ ] Approach **C** — Chrome / 2A first

### Owner mode (gate W0)

- [ ] **plan-only** — plans/reviews/inventory evidence only; no product code
- [ ] **implementation unlock** — product phases allowed per phase file
- [ ] Still **locked** — wait for owner

**Record unlock quote / date (when known):**

```text
Date:
Mode: locked | plan-only | implementation unlock
Approach: A | B | C | (default A after unlock if silent)
Owner quote:
Agent:
```

Mirror into `results/planner/world-standard-wave/00-start/NOTES.md` when CP-00 is executed.

---

## Engine decision checkboxes (tick at CP-02 / owner engine sign-off)

Do **not** invent a new engine mid-W. Research → [RESEARCH-MAP.md](./RESEARCH-MAP.md); comparison → `results/planner/world-standard-wave/COMPARISON-CHART.md`.

- [ ] Fabric v7 full stage = 2D **destination**; FeasibilityCanvas = **interim** (Approach A path)
- [ ] Three + R3F + **orbit ON** = 3D
- [ ] No Konva + Fabric hybrid interactive
- [ ] Manufacturer SKU catalog (IKEA-class pattern, O&O products)
- [ ] Success metric: **BOQ/quote path > photoreal**

Evidence when locked: `results/planner/world-standard-wave/01-engine-lock/NOTES.md` (CP-02).

---

## Ethics (non-negotiable)

| Allowed | Forbidden |
|---------|-----------|
| Patterns / jobs-to-be-done from research | Competitor code, JS, CSS, GLB, logos, brands |
| MIT / Apache / BSD packages after license check | Shipping proprietary third-party assets as ours |
| Notes under `D:\websites\…` | Pasting competitor UI into `site/` |

Deep ethics: `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` · [RESEARCH-MAP.md](./RESEARCH-MAP.md).

- [ ] Ethics table acknowledged by executing agent (CP-00)

---

## Trust-data rule

1. Owner sets **intent**.  
2. Agents check **repo / tests / browser**.  
3. Status claims require paths under `results/`.  
4. Never put the owner on trial for character.  
5. If evidence contradicts a cheerful status report, **evidence wins** — update `D:\OandO07072026\Failures.md`.

---

## Standing agent rules

| Rule | Detail |
|------|--------|
| Superpowers | Always; all skills allowed; load any skill with ~1% fit |
| Concurrency | Default **8** concurrent agents; hard max **10** |
| Parallelism | After **CP-02** for W streams; respect CP stop-if-fail |
| Tests | Run in **sibling** agents so the critical path is not idle — **never skip** tests or suppress console output |
| Workspace | **No worktrees.** Main checkout `D:\OandO07072026` only |
| Commit | **As we go** after each landable slice (`trustdata(P0X): …` or `fix(open3d): …`) |
| Push | Only when owner asks in the **current** conversation |
| Plan commits | Allowed under plan-only / plan revision |
| Product commits | Only after **implementation unlock** |
| Types | No `any` in handwritten TS (exceptions need reason, owner, removal condition) |
| Evidence | Write under `results/planner/world-standard-wave/<folder>/`; prefer write-to-disk |
| Failures | `D:\OandO07072026\Failures.md` |
| Contract | [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) — paste required subagent prompt block into every brief |

---

## W1–W8 summary

| Gate | Bar |
|------|-----|
| **W1** | Draw walls + door; Playwright + screenshots |
| **W2** | Place ≥2 incl. cabinet-v0; Block2D readable |
| **W3** | Select + Delete/Backspace + undo |
| **W4** | 2D↔3D pose preserve; orbit ON; console clean |
| **W5** | Save → hard reload → same entity ids |
| **W6** | Honest local vs cloud labels |
| **W7** | Modular mesh bar (readable parts), not apology boxes |
| **W8** | Labels match keyboard/handlers |

Full definitions: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`.

---

## Phase order (do not reorder without owner)

Aligned with [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md). Dependency graph (allowed parallelism) ≠ kill-order priority — see **Week-1 kill order** below and full table in [INDEX.md](./INDEX.md).

```
CP-00 → CP-01 → CP-02
              ↘ parallel (≤8 / max 10): CP-03 W3 · CP-04 W4 · CP-05 symbols · CP-06 W5–W6 · CP-08 W7 · CP-09 W8
              ↘ CP-07 W1–W2 browser (full claim needs CP-03 + CP-05 not red unless owner WAIVE)
              → CP-10 pack + E: backup (all prior PASS or WAIVE)
```

| # | Phase file | CP | Gates | Evidence folder |
|---|------------|----|-------|-----------------|
| P01 | product truth | CP-01 | baseline data | `00-product-truth/` |
| P02 | engine lock | CP-02 | stop thrash | `01-engine-lock/` |
| P03 | select/delete | CP-03 | **W3** | `03-select-delete/` |
| P04 | orbit continuity | CP-04 | **W4** | `04-orbit-continuity/` |
| P05 | symbols/SVG | CP-05 | **W2** symbols | `05-symbols-svg/` |
| P06 | save honesty | CP-06 | **W5–W6** | `06-save-honesty/` |
| P07 | draw/place journey | CP-07 | **W1–W2** browser | `02-browser-open3d-journey/` |
| P08 | mesh quality | CP-08 | **W7** | `08-mesh-quality/` |
| P09 | shortcuts/chrome | CP-09 | **W8** | **`09-shortcuts-chrome/`** |
| P10 | evidence/handover | CP-10 | pack + E: backup | `10-handover/` |

**Note:** FINAL folder lock — P01=`00-product-truth/`, P02=`01-engine-lock/`, P07=`02-browser-open3d-journey/` (not `07-…`), W7=`08-mesh-quality/` (sole `08-*`), W8=**`09-shortcuts-chrome/`** (legacy `08-shortcuts-chrome/` non-canonical). Authority: [RESULTS-MAP.md](./RESULTS-MAP.md) · [FOLDER-LOCK](./reviews/FOLDER-LOCK-suggestions.md).

---

## Week-1 kill order (condensed)

**Full section (tables + claim rules):** [INDEX.md](./INDEX.md) → **Week-1 kill order**.  
**Structure decision:** **HYBRID** — keep one file per CP; prioritize serial spine when agent slots (default **8** / max **10**) are scarce. Not a new phase tree.

**Serial spine (after implementation unlock):**

```
CP-00 → CP-01 → CP-02
  → W3 unit+browser          (03-select-delete/)           # CP-03 / P03 — unit alone = FAIL
  → W1–W2 journey pack       (02-browser-open3d-journey/)  # CP-07 / P07
  → W5–W6 save honesty       (06-save-honesty/)            # CP-06 / P06
```

**Parallel fill (after CP-02; lower priority if slots scarce):**

```
W4 orbit (04-orbit-continuity/) · W2 symbols (05-symbols-svg/)
W7 mesh (08-mesh-quality/) · W8 labels (09-shortcuts-chrome/)
→ CP-10 pack (10-handover/) when data supports
```

**Rules (CHECKPOINTS unchanged):**

- No self-waive W3 browser.  
- Full journey claim needs CP-03 + CP-05 not red unless owner WAIVE.  
- Lead with **W-gate + folder**; P-numbers second.  
- Parallelism after CP-02 is allowed — kill order only ranks urgency.

---

## Superpowers streams (after CP-02; Approach A)

| # | Stream | Evidence | Kill priority |
|---|--------|----------|---------------|
| 1 | Select + delete + undo (W3) | `03-select-delete/` | **Spine** |
| 6 | Playwright journey | `02-browser-open3d-journey/` | **Spine** |
| 5 | Save flush + honesty | `06-save-honesty/` | **Spine** |
| 3 | Orbit + continuity (W4) | `04-orbit-continuity/` | Fill |
| 4 | Block2D + mesh bar | `05-symbols-svg/` + `08-mesh-quality/` | Fill |
| 2 | Shortcuts / labels (W8) | `09-shortcuts-chrome/` | Fill |
| 7 | 2A blockers only | notes under `09-shortcuts-chrome/` or dedicated NOTES | Only if blocks W |
| 8 | Docs / handover | `10-handover/` | Close |

Spawn ≤8 by default; burst to 10 only with owner authorization. **Prefer spine streams when slots are scarce.** Required prompt block: [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) §8.

---

## Out of scope while any W red

Photoreal race · multiplayer · AR · CRM/SSR expansion as W substitute · full Fabric cutover before W1–W8 (Approach A) · worktrees · push without ask · competitor assets in `site/`.

---

## Evidence root

`D:\OandO07072026\results\planner\world-standard-wave\`  

| When | Folder |
|------|--------|
| This file / CP-00 | `00-start/` (`NOTES.md` minimum) |
| Browser journey template | `02-browser-open3d-journey/` (create when executing P07) |
| Full map | [RESULTS-MAP.md](./RESULTS-MAP.md) |

---

## Research (ideas only)

See [RESEARCH-MAP.md](./RESEARCH-MAP.md). Do not re-scrape Planner5D blindly. Inspiration only — no plagiarism; MIT/open packages only.

---

## CP-00 checkpoint (authoritative closeout)

See [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md) → **CP-00**.

Pass only when **all** are true:

- [ ] INDEX + 00-START read by executing agent  
- [ ] Approach A/B/C recorded (or default **A** documented after unlock if owner silent)  
- [ ] Owner mode recorded: **plan-only** **or** **implementation unlock** (not left ambiguous)  
- [ ] Ethics table acknowledged  
- [ ] No worktree created (`D:\OandO07072026` only)  
- [ ] Optional/required evidence: `results/planner/world-standard-wave/00-start/NOTES.md` with approach + mode + date + agent  
- [ ] CHECKPOINTS.md CP-00 status updated when owner/reviewer closes (PASS / FAIL / WAIVE)

**Stop-if-fail:** If approach unset **and** owner has not unlocked (still locked): **do not implement product code**. If ethics violated (competitor assets in `site/`): stop all streams; purge; log `D:\OandO07072026\Failures.md`.

---

## Related

| Doc | Role |
|-----|------|
| [INDEX.md](./INDEX.md) | Program index |
| [checkpoints/CHECKPOINTS.md](./checkpoints/CHECKPOINTS.md) | All CP hard stops |
| [checklists/MASTER-CHECKLIST.md](./checklists/MASTER-CHECKLIST.md) | Owner checklist (W0…) |
| [checklists/AGENT-RULES.md](./checklists/AGENT-RULES.md) | Subagent contract |
| [RESULTS-MAP.md](./RESULTS-MAP.md) | Evidence folders |
| [reviews/INDEX-00-suggestions.md](./reviews/INDEX-00-suggestions.md) | This revision’s expert notes |
| Design spec | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Testing | `testing-handbook.md` |
