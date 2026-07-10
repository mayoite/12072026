# STRUCTURE-ADVICE — Trustdata plan pack topology

**Reviewer:** Planning expert (structure pass)  
**Date:** 2026-07-09  
**Scope:** `Plans\trustdata\` only — spot-check of sizes/structure; **no rewrites** of phase bodies in this pass  
**Mode:** plan-only · no product code  
**Peer note:** Independent second opinion also landed as [51-STRUCTURE-REVIEW-FOLLOW-UP.md](./51-STRUCTURE-REVIEW-FOLLOW-UP.md) (aligned on KEEP topology + thin density; this file is the primary structured answer to the six owner questions)

**Constraints held:**

- Approach **A** product journey first, W1–W8  
- Trust data; max 8–10 agents  
- Agents must not thrash on folder names  
- Plans stay under `Plans/trustdata/` only  
- writing-plans: bite-sized tasks, no TBD  
- Prefer **fewer files** if quality is enough; **split only when files hurt execution**

---

## Executive decision

| Layer | Decision | One line |
|-------|----------|----------|
| **Program topology** (P01–P10 · CP-00–CP-10 · RESULTS-MAP folder lock · Approach A streams) | **KEEP** | Gate ownership is sound; do not re-number, merge phases, or explode into recovery-style micro-phases. |
| **Per-phase multi-file split** (`P0X` + `P0X-tasks` + `P0X-evidence`) | **REJECT** | Would multiply authority fights and folder thrash; quality is already executable in one file per CP. |
| **Content density** (P05 / P07 / P03 monologues with multi-page TS) | **THIN later** (content pass, not topology) | Extract or delete embedded code skeletons after first land; keep one owner file per CP. |
| **INDEX week-1 kill order** | **Light EXPAND** (one INDEX section only) | Serial spine vs parallel fill is underspecified for scarce agent slots; not a new plan tree. |
| **New phases / gates** | **REJECT** | W0–W8 + CP-00–CP-10 already cover the north star; do not invent W9 or P11 mid-wave. |
| **Merge fragmented docs** | **KEEP maps/checklists separate** | INDEX / 00-START / CHECKPOINTS / RESULTS-MAP / MASTER / AGENT-RULES each own a job; merging them would create worse mega-files. |

### Single-label recommendation

**KEEP** (with optional light INDEX EXPAND only).

Not SPLIT. Not SPLIT+EXPAND. Not full EXPAND of phases.

**Rationale:** The pack already has bite-sized tasks, concrete paths, no TBD in task bodies, hard CP stops, and a FINAL folder lock. Agent failure modes will be **skim of fat files** and **folder-name thrash** (already mitigated by RESULTS-MAP), not “missing plan files.” Prefer fewer files.

---

## Spot-check: current tree & line counts

```
Plans/trustdata/
  INDEX.md                 (~184 lines)   program map
  00-START.md              (~240 lines)   unlock · ethics · approach
  RESEARCH-MAP.md          (~215 lines)   inspiration-only index
  RESULTS-MAP.md           (~325 lines)   FINAL evidence folder lock
  checkpoints/
    CHECKPOINTS.md         (~166 lines)   CP-00–CP-10 hard stops
  checklists/
    MASTER-CHECKLIST.md    (~257 lines)   owner 94-box single checklist
    AGENT-RULES.md         (~220 lines)   subagent contract + prompt block
  phases/
    P01-product-truth.md   (~799 lines)   inventory (read-only)
    P02-engine-lock.md     (~551 lines)   engine lock
    P03-select-delete.md   (~660 lines)   W3 unit + browser hard gate
    P04-orbit-continuity.md(~481 lines)   W4
    P05-symbols-svg.md     (~967 lines)   W2 symbols — densest
    P06-save-honesty.md    (~516 lines)   W5–W6
    P07-draw-place-journey.md (~689 lines) W1–W2 browser — Playwright heavy
    P08-mesh-quality.md    (~379 lines)   W7 — healthiest size
    P09-shortcuts-chrome.md(~405 lines)   W8
    P10-evidence-handover.md (~369 lines) pack + E: backup
  reviews/
    *-suggestions.md       expert notes (applied into phases)
    FOLDER-LOCK / GOVERNANCE / MAPS / INDEX-00
    STRUCTURE-ADVICE*.md   this pass
```

**~25KB heuristic:** dense Markdown with tables/code lands ~20–30KB around 500–700 lines. **P05 / P01 / P07 / P03** sit in the “tax on skim” band; **P08 / P09 / P10** are healthy execute cards.

**Task quality (writing-plans):** Spot-check of P01–P10 shows Task 00…N with files, checkboxes, commands, evidence paths. Grep for real TBD placeholders in phase task bodies: **none** (only “no TBD” discipline statements). Dual gates (P06 W5–W6, P07 W1–W2 place, P03 unit+browser) are intentional product packs, not unfinished stubs.

**Contrast (do not copy):** `archive/Plans/07072026/02-recovery/phases/` exploded open3d into `04` + `04a`–`04f`. That style multiplies authority fights. Trustdata’s **one file per CP** is the deliberate correction.

---

## Q1 — Should phases be broken into more files?

### e.g. `P0X` overview + `P0X-tasks` + `P0X-evidence`

| Option | Advice | Why |
|--------|--------|-----|
| **P0X overview + tasks + evidence** (3× per phase) | **REJECT** | 10 phases → 30 files; agents fight over “which is source of truth”; checkboxes and CP criteria split from tasks; max 8–10 agents already under concurrency pressure — more paths = thrash. |
| **P0X + companion snippet file** (code only) | **OPTIONAL later** | Only for P05/P07 if multi-page TypeScript remains in the plan after first execution. Must state: companion is **not** a second CP. Prefer deleting skeletons once `site/tests/...` exists. |
| **P0X unit vs P0X browser as two CPs** (esp. P03) | **REJECT** | Design W3 + CHECKPOINTS + MASTER W3.4 require unit **+** browser as **one** gate. Two CPs invite unit-PASS + “browser later forever.” |
| **Keep one file per CP; thin presentation** | **RECOMMENDED** | Goal · gate · evidence folder · task list · CP table co-located; inventory/revision essays can move down or to evidence after first run. |

**When a split would be justified:** Only if a **single craft contract** outgrows one screen *and* a second craft must stay green under the same CP (e.g. 200+ lines of Playwright that still must not become a second gate). Even then: companion under `phases/` or link to gold spec — **not** a new CP number.

**Verdict Q1:** **Do not break phases into more ownership files.** Thin density in place if needed.

---

## Q2 — Should content be expanded (new phases/gates missing)?

### What’s already complete enough

| Need | Present? | Where |
|------|----------|--------|
| Approach A default + B/C override | Yes | INDEX, 00-START |
| Unlock modes (locked / plan-only / implementation) | Yes | INDEX, 00-START, CP-00 |
| W1–W8 definitions + proof bars | Yes | INDEX, design spec link, MASTER §4 |
| CP hard stops stop-if-fail | Yes | CHECKPOINTS |
| Evidence folder FINAL lock | Yes | RESULTS-MAP + FOLDER-LOCK |
| Parallel streams after CP-02 (≤8 / max 10) | Yes | INDEX, AGENT-RULES |
| Ethics / inspiration-only | Yes | 00-START, RESEARCH-MAP, AGENT-RULES |
| E: backup + handover | Yes | P10, MASTER §6–7 |
| No TBD task bodies | Yes | phases (spot-check) |

### Gaps that are real but small

| Gap | Expand? | How (minimal) |
|-----|---------|----------------|
| **Week-1 kill order** under scarce agent slots | **Yes — light** | One section in **INDEX** only: serial spine vs parallel fill priority (see Q4 tree). |
| Parallelism vs “full W1–W2 claim needs CP-03+CP-05” | Mostly present | Already in CHECKPOINTS; kill order must **repeat one line**, not invent new rules. |
| P05/P07 code-as-plan stale risk | Content hygiene | Thin later; not new phases. |
| Post-W Fabric cutover | **No** in this pack | Correctly out of scope while any W red (Approach A). Separate program after W green. |
| BOQ/quote deep UX | **No** | Engine metric only; post-W polish. |

### New phases/gates?

**Do not add** P11, W9, or “P03b browser CP.” Every buyer-facing north-star item maps to an existing W/CP. Extra phases would reintroduce recovery-plan fragmentation.

**Verdict Q2:** **No major expansion.** Only optional **INDEX kill-order section**. Content quality of tasks is sufficient to execute after unlock.

---

## Q3 — Should anything be merged (too fragmented)?

| Candidate merge | Advice | Why |
|-----------------|--------|-----|
| INDEX + 00-START | **KEEP separate** | INDEX = map/order/streams; 00-START = unlock/ethics/checkboxes agents must tick. Merge → 400+ line front door. |
| CHECKPOINTS + MASTER | **KEEP separate** | CP = hard stop table for agents; MASTER = owner 94-box tally. Different audiences. |
| RESULTS-MAP + RESEARCH-MAP | **KEEP separate** | Evidence vs inspiration; conflating them caused “research as pass” risk already mitigated by explicit boundary text. |
| AGENT-RULES into INDEX | **KEEP separate** | Prompt block + stream table must stay pasteable; INDEX already links it. |
| reviews/* into phase feet | **KEEP reviews/** | Applied suggestions already folded into phases; reviews are audit trail. Do not delete; agents should prefer phase body over stale review path names (FOLDER-LOCK supersedes older path fights). |
| P06 split W5 vs W6 | **KEEP one phase** | Same autosave surface; dual evidence subfolder already (`save-reload/`). |
| P07 split W1 vs W2 | **KEEP one phase** | One serial Playwright pack / one gold folder; two files race PNG names. |
| P05 symbols + P08 mesh | **KEEP separate** | Different gates (W2 symbol vs W7 mesh), different evidence folders, different touch lists. |

**Duplication note:** Superpowers / no-worktrees / push-on-ask appear in many files. That is **intentional isolation** for subagents that only load one phase. Do not merge away; optionally later shorten phase banners to “see AGENT-RULES §1–3” *only if* agents still open AGENT-RULES reliably.

**Verdict Q3:** **Do not merge.** Fragmentation is **by role**, not accidental. The only “fragmentation smell” is **P-number ≠ folder-number** (documented; fixed by RESULTS-MAP) — merging files does not fix that.

---

## Q4 — Recommended file tree (concrete)

**Do not change the live tree for topology.** Target = current tree + one optional INDEX section content (not a new file).

```text
Plans/trustdata/                          # ONLY plan root for this program
├── INDEX.md                              # Map · W table · streams · kill order (light EXPAND)
├── 00-START.md                           # Unlock · approach · ethics · engine checkboxes
├── RESEARCH-MAP.md                       # Inspiration-only · not evidence
├── RESULTS-MAP.md                        # FINAL folder lock · run.json contract
├── checkpoints/
│   └── CHECKPOINTS.md                    # CP-00–CP-10 · stop-if-fail · waivers
├── checklists/
│   ├── MASTER-CHECKLIST.md               # Owner single checklist (94)
│   └── AGENT-RULES.md                    # Subagent contract · prompt block
├── phases/                               # ONE executable file per CP (KEEP)
│   ├── P01-product-truth.md              # CP-01 · 00-product-truth/
│   ├── P02-engine-lock.md                # CP-02 · 01-engine-lock/
│   ├── P03-select-delete.md              # CP-03 · W3 · 03-select-delete/
│   ├── P04-orbit-continuity.md           # CP-04 · W4 · 04-orbit-continuity/
│   ├── P05-symbols-svg.md                # CP-05 · W2 symbols · 05-symbols-svg/
│   ├── P06-save-honesty.md               # CP-06 · W5–W6 · 06-save-honesty/
│   ├── P07-draw-place-journey.md         # CP-07 · W1–W2 browser · 02-browser-open3d-journey/
│   ├── P08-mesh-quality.md               # CP-08 · W7 · 08-mesh-quality/
│   ├── P09-shortcuts-chrome.md           # CP-09 · W8 · 09-shortcuts-chrome/
│   └── P10-evidence-handover.md          # CP-10 · 10-handover/
└── reviews/                              # Expert notes · structure advice · FOLDER-LOCK
    ├── FOLDER-LOCK-suggestions.md        # Path authority (historical)
    ├── GOVERNANCE-suggestions.md
    ├── INDEX-00-suggestions.md
    ├── MAPS-suggestions.md
    ├── P01-suggestions.md … P10-suggestions.md
    ├── STRUCTURE-ADVICE.md               # this file (primary)
    └── STRUCTURE-ADVICE-2.md             # peer structure pass
```

### Explicitly **not** recommended

```text
# DO NOT create:
phases/P03-overview.md
phases/P03-tasks.md
phases/P03-evidence.md
phases/P03b-browser.md
phases/P07-w1.md + phases/P07-w2.md
phases/snippets/**          # only if a later thin pass truly needs it
Plans/trustdata-v2/         # second root = thrash
```

### Evidence tree (unchanged; agents must not invent names)

```text
results/planner/world-standard-wave/
  00-start/
  00-product-truth/          # P01 (not 01-product-truth)
  01-engine-lock/            # P02 (not 02-engine-lock)
  02-browser-open3d-journey/ # P07 (not 07- as primary)
  03-select-delete/
  04-orbit-continuity/
  05-symbols-svg/
  06-save-honesty/
  06-save-honesty/save-reload/
  08-mesh-quality/           # sole primary 08-*
  09-shortcuts-chrome/       # W8 (not 08-shortcuts-chrome)
  10-handover/
```

### Optional INDEX section (content only — apply on a later revise if owner wants)

```markdown
## Week-1 kill order (after implementation unlock)

Serial spine:
  CP-00 → CP-01 → CP-02
  → W3 unit+browser (03-select-delete/)
  → W1–W2 journey pack (02-browser-open3d-journey/)
  → W5–W6 (06-save-honesty/)

Parallel fill (≤8; lower priority if slots scarce):
  W4 · W2 symbols · W7 mesh · W8 labels

Full claim rules: CHECKPOINTS unchanged
  (no self-waive W3 browser; journey honesty needs CP-03+CP-05 not red unless owner WAIVE).
Lead with W-gate + folder name; P-numbers second.
```

---

## Q5 — Top 5 risks of current structure

| # | Risk | Why it bites | Mitigation already / needed |
|---|------|--------------|------------------------------|
| **1** | **P-number ≠ folder-number thrash** | P01→`00-`, P02→`01-`, P07→`02-`, P09→`09-` while mesh owns sole `08-*`. Agents invent `02-engine-lock/`, `08-shortcuts-chrome/`, `01-product-truth/`. | **Already strong:** RESULTS-MAP forbidden table + FOLDER-LOCK + AGENT-RULES prompt block. **Keep repeating folder first** in kill order and subagent briefs. |
| **2** | **Fat-file skim → false green** | P03/P05/P07 bury hard gates mid-file; classic failure: unit green → tick MASTER W3 without browser. | CHECKPOINTS + MASTER W3.4 hard; **front-load** proof-layer tables (P03 already does). Thin inventories/revision notes later. |
| **3** | **“Parallel after CP-02” read as equal urgency** | Eight streams spawn; scarce slots go to mesh/chrome while W3 browser and journey lag. | **Light INDEX kill order** (serial spine vs parallel fill). |
| **4** | **Code-as-plan staleness** | Multi-page TS in P05/P07 becomes wrong after first land; agents “implement the plan block” instead of the repo file. | After first execute: replace skeletons with path + “open existing file”; do **not** split CP ownership. |
| **5** | **Multi-authority drift** | INDEX / 00-START / CHECKPOINTS / RESULTS-MAP / MASTER / phase feet can disagree (already happened on dual-`08` paths). | **Authority order:** Owner > FOLDER-LOCK/RESULTS-MAP for paths > CHECKPOINTS for pass criteria > phase tasks for how. reviews/* are historical; phase body wins after apply. Avoid new parallel maps. |

**Honorable mention (not top 5):** reviews/ path advice that predated FOLDER-LOCK — agents must not re-apply retired “ban `09-shortcuts-chrome`” text from old reviews.

---

## Q6 — Decision recommendation

### **KEEP**

| Dimension | KEEP means |
|-----------|------------|
| Phase count | Stay at P01–P10 + 00-START |
| CP count | Stay at CP-00–CP-10 |
| File-per-phase | One executable markdown per CP |
| Maps | RESULTS-MAP, RESEARCH-MAP, CHECKPOINTS, MASTER, AGENT-RULES stay distinct |
| Folder lock | Do not reopen dual-`08` or renumber mid-wave |
| Approach A | W1–W8 on Feasibility + document model first |

### Optional micro-add (does not change the KEEP label)

- **INDEX only:** week-1 kill order (~15–25 lines).  
- **Later content pass (not topology):** thin P05/P07/P03 embedded code and long revision essays.

### Rejected alternatives

| Label | Why rejected as primary |
|-------|-------------------------|
| **SPLIT** | Multi-file phases / micro-phases recreate recovery thrash; hurts folder discipline and agent load. |
| **EXPAND** | New phases/gates not needed; W map complete; full expansion would bloat without raising ship odds. |
| **SPLIT+EXPAND** | Worst of both: more files **and** more scope surface while quality of current tasks is already executable. |

### Why KEEP is honest (not defensive)

- Spot-check shows **executable, bite-sized tasks** with concrete paths and commands.  
- **No TBD** placeholders left in task bodies.  
- Governance/FOLDER-LOCK already paid the cost of path fights.  
- Size pain is **presentation density**, fixable without new topology.  
- Owner constraint: *prefer fewer files if quality is enough* — **quality is enough**.

---

## Priority if owner later authorizes edits (not this pass)

| Priority | Edit | Type |
|----------|------|------|
| **P0** | INDEX week-1 kill order section | Light EXPAND content |
| **P1** | Thin P07 / P05: remove multi-page TS skeletons after code lands (or replace with short selectors + path) | Content thin |
| **P2** | Thin P03: move long inventory/inspiration tables below tasks or to evidence after first execute | Content thin |
| **P3** | Optional one-liner in AGENT-RULES: “spawn streams in kill-order priority when slots scarce” | Micro |
| **Never without owner** | New CP, phase renumber, second plan root, recovery-style 04a–f split | Topology |

---

## Alignment with peer pass (STRUCTURE-ADVICE-2)

| Topic | This file | STRUCTURE-ADVICE-2 | Net |
|-------|-----------|--------------------|-----|
| Program topology KEEP | Yes | Yes | **Agree** |
| Reject multi-file phase split | Yes | Yes (KEEP one owner per CP) | **Agree** |
| P03 unit+browser one CP | Yes | Yes | **Agree** |
| P07 density thin not gate split | Yes | Yes | **Agree** |
| P08 KEEP as model size | Yes | Yes | **Agree** |
| INDEX kill order | Light EXPAND | Yes EXPAND INDEX | **Agree** |
| Primary decision label | **KEEP** (+ micro INDEX) | Hybrid language | Same substance; this file picks enum **KEEP** |

---

## Done checklist for this advice pass

1. **Match:** Six owner questions answered; decision KEEP; no phase rewrites.  
2. **Verify:** Live read of INDEX, 00-START, RESULTS-MAP, RESEARCH-MAP, CHECKPOINTS, MASTER, AGENT-RULES, all P01–P10 headers/task maps; line ends spot-checked; TBD grep clean in task bodies.  
3. **Log:** No product blockers; structure-only.  
4. **Report path:** `Plans\trustdata\reviews\STRUCTURE-ADVICE.md`  
5. **Next step (owner):** Accept KEEP; optionally authorize INDEX kill-order paste only; **do not** authorize multi-file phase splits unless a future execute proves skim failures that CHECKPOINTS cannot fix.

---

*End of STRUCTURE-ADVICE — plan-only; no product code; no topology rewrite applied.*
