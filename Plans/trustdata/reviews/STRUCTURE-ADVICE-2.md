# STRUCTURE-ADVICE-2 — Independent plan structure review

**Reviewer:** Planning expert #2 (independent structure pass)  
**Date:** 2026-07-09  
**Scope:** Structure of `D:\OandO07072026\Plans\trustdata\` only  
**Mode:** plan-only · **no product code** · **no phase rewrites** in this pass  
**Output:** Recommendations only — KEEP / SPLIT / EXPAND / hybrid  

**Focus questions (owner):**

1. Do ~25KB phase files help or hurt agents?  
2. Are **W3 browser proof** (P03), **W7 mesh** (P08), and **journey** (P07) too dense in one file each?  
3. Should **INDEX** absorb a **week-1 kill order**?

**Inputs read (live, this session):**  
`INDEX.md`, `00-START.md`, `checkpoints/CHECKPOINTS.md`, `RESULTS-MAP.md`, `checklists/MASTER-CHECKLIST.md`, `checklists/AGENT-RULES.md`, all `phases/P01–P10`, sample reviews (INDEX-00, GOVERNANCE, P03/P07/P08 suggestions), recovery-plan phase shape (contrast only).

---

## Executive verdict

| Layer | Recommendation | One line |
|-------|----------------|----------|
| **Program topology** (P01–P10 · CP-00–CP-10 · folder lock · Approach A streams) | **KEEP** | Gate ownership is sound; do not re-number or re-merge phases. |
| **~25KB phase monologues** (esp. P03 / P05 / P07) | **HYBRID** | Keep **one owner file per CP**; thin **embedded code + revision essays**; optional **companion** only when a second craft (e.g. Playwright pack) has its own long contract. |
| **P03 W3 (unit + browser hard gate)** | **KEEP** ownership · **THIN** presentation | Do **not** split W3 unit vs browser into two CPs; browser is the hard half of the same gate. |
| **P07 journey (W1–W2 browser)** | **KEEP** ownership · **SPLIT density** (code out) | W1+W2 must stay one serial evidence pack; skeletons bloat the plan. |
| **P08 mesh (W7)** | **KEEP** as-is | Not the density problem; bar + formulas + blast list belong together. |
| **INDEX week-1 kill order** | **EXPAND** INDEX (small) | Yes — short ordered kill list after unlock; do **not** invent a second program plan. |

**Do not:** rewrite phase bodies in this advice pass · re-split the recovery-style 04a–04f explosion · absorb MASTER into INDEX · reopen FOLDER-LOCK path fights.

---

## Snapshot of current structure (facts)

```
Plans/trustdata/
  INDEX.md, 00-START.md, RESEARCH-MAP.md, RESULTS-MAP.md
  phases/P01…P10          ← executable gate owners
  checkpoints/CHECKPOINTS.md
  checklists/MASTER-CHECKLIST.md, AGENT-RULES.md
  reviews/*-suggestions.md
```

| Phase | Gate(s) | Evidence folder | Approx. length (lines) | Density character |
|-------|---------|-----------------|------------------------|-------------------|
| P01 | Baseline | `00-product-truth/` | ~800 | Inventory matrix heavy — OK for read-only |
| P02 | Engine | `01-engine-lock/` | ~550 | Decision + greps — OK |
| **P03** | **W3** | `03-select-delete/` | **~660** | Unit TDD **+** browser hard gate + inventory + design notes |
| P04 | W4 | `04-orbit-continuity/` | ~480 | Moderate |
| **P05** | W2 symbols | `05-symbols-svg/` | **~950** | **Densest** (long inline test code) |
| P06 | W5–W6 | `06-save-honesty/` | ~515 | Dual gate but clear tasks |
| **P07** | **W1–W2 browser** | `02-browser-open3d-journey/` | **~690** | Full Playwright skeletons + path tables |
| **P08** | **W7** | `08-mesh-quality/` | **~380** | Bar + formulas + tasks — **tight** |
| P09 | W8 | `09-shortcuts-chrome/` | ~405 | Moderate |
| P10 | Pack | `10-handover/` | ~330 | Procedure — OK |

**~25KB rule of thumb:** ~500–700 lines of dense Markdown (with tables/code) lands near 20–30KB. Several phase files sit in that band; **P05/P07/P03** are the ones that matter for agent load, not P08.

**Contrast:** `archive/Plans/07072026/02-recovery/phases/` already showed that **over-splitting** planner work (04 / 04a–04f) multiplies authority fights. Trustdata’s one-file-per-CP is a deliberate correction. Structure advice must not reverse that without cause.

---

## Q1 — Do ~25KB phase files help or hurt agents?

### They help when…

| Benefit | Why it matters here |
|---------|---------------------|
| **Single gate authority** | One agent brief = one path (`phases/P0X-…md`) + one evidence folder. Reduces “which file wins?” thrash already paid for in FOLDER-LOCK. |
| **Stop-if-fail co-located** | CP criteria, out-of-scope, and touch list live with tasks — less false green from partial reads of INDEX only. |
| **Repo inventory frozen in plan** | Honest “what exists” tables (P03/P08/P02) prevent myth-driven rewrites when memory is empty. |
| **Parallel streams** | After CP-02, eight streams each own a file; fat files are acceptable if they do not overlap write surfaces. |

### They hurt when…

| Cost | Failure mode |
|------|----------------|
| **Skim blindness** | Hard gates buried at Task 08 / mid-file (classic W3 risk: unit-green → tick MASTER). CHECKPOINTS already hardens this; fat files amplify skim. |
| **Context tax** | Subagent loaded with “implement Task 03” still pays full-file read; 25–40KB × many agents burns budget and invites mid-file contradiction. |
| **Code-as-plan bloat** | Large TypeScript blocks in P05/P07 are **not** executable authority once the real file exists — they go stale and mislead. |
| **Revision essays at EOF** | Expert revision notes (~30–50 lines) are useful once; for executors they are noise after “applied.” |
| **Duplicate operating rules** | Superpowers / no worktrees / push-on-ask repeated in every phase + INDEX + 00-START + AGENT-RULES — correct for isolation, expensive for structure. |

### Size guidance (for future thins — not a rewrite now)

| Zone | Approx. size | Agent fit |
|------|--------------|-----------|
| **Card (ideal execute front)** | 4–8KB / ~80–150 lines | Goal · gate · evidence path · preconditions · task index · CP table |
| **Body (tasks)** | 10–18KB | Numbered tasks with files + checkboxes; **no** full test source |
| **Appendix (optional)** | Separate file or collapsed section | Full code skeletons, long inventory dumps, revision history |
| **Danger** | \>30KB or \>800 lines with multi-page TS | Split **content density**, not CP ownership |

**Verdict on size:** ~25KB **helps gate ownership** and **hurts task focus**. Default fix is **HYBRID thin-in-place**, not a new phase tree.

---

## Q2 — Density of the three named files

### P03 — W3 select/delete + browser hard gate

**What’s inside one file:** product intent · architecture · inventory · pure design · Tasks 00–07 unit/TDD · **Task 08 minimal browser** · Task 09 sign-off · CP-03 · commit sequence · revision note.

**Is it “too dense”?** Yes for **scanning**; no for **ownership**.

| Option | Advice | Why |
|--------|--------|-----|
| Split unit vs browser into **two phases / two CPs** | **REJECT** | Design W3, CHECKPOINTS, MASTER W3.4, and GOVERNANCE all require unit **+** browser as **one gate**. Two CPs invite unit-PASS + “browser later forever.” |
| Companion `P03b-browser-proof.md` | **OPTIONAL hybrid** | Only if browser steps grow Playwright-skeleton-heavy like P07. Must say: “not a second CP; CP-03 still fails without it.” Prefer **not** until Task 08 outgrows a one-screen table. |
| Keep one file; front-load layers | **RECOMMENDED** | Already has “Proof layers” table at top — good. Future thin: move long inventory / inspiration tables after tasks or to evidence NOTES after first execute. |

**Browser vs P07 journey:** Correctly separated today:

- P03 Task 08 = **narrow** select→delete→undo under `03-select-delete/`  
- P07 = draw/place pack under `02-browser-open3d-journey/`  

That split is **KEEP**. Density pain is **unit volume + browser in the same long scroll**, not wrong co-location of two product features.

**Verdict P03:** **KEEP** single file / single CP · **THIN later** (inventory + revision note) · **do not** split browser to a second gate.

---

### P07 — Draw/place journey (W1–W2 browser)

**What’s inside:** gate defs · huge locked-paths table · preconditions · Tasks 1–5 with **multi-page TypeScript skeletons** · failure handling · deps · revision note.

**Is it too dense?** **Yes — highest “hurt” of the three named files** (with P05 worse overall but out of the named trio’s spirit).

| Option | Advice | Why |
|--------|--------|-----|
| Split W1 and W2 into two phase files | **REJECT (mostly)** | One serial Playwright journey / one evidence folder is the gold pattern; two files race PNG names and dual `playwright-run.json`. CHECKPOINTS already couples full story to CP-03+CP-05 honesty, not two journey CPs. |
| Split “spec authoring” vs “product fix if red” | **WEAK optional** | Product fixes should stay **in the failing product’s phase** or a short “if red, touch list” in P07 — not a second plan. |
| Keep CP-07 file; **extract code skeletons** | **RECOMMENDED hybrid** | Plan keeps: steps, selectors, deltas, evidence names, false-green rules. Code lives in the real `open3d-world-standard-journey.spec.ts` after first land, or a **short** `phases/snippets/` / link to gold `admin-svg-publish-p01` only. |
| Alias folder confusion (`02-` vs `07-`) | **KEEP current map** | RESULTS-MAP + INDEX already document it; do not rename mid-wave. Kill-order text should say **folder first**, phase number second. |

**Verdict P07:** **KEEP** one journey CP · **SPLIT density** (code out of plan on next revise) · **not** too many product concerns in one gate (W1+W2 place is correct serial pack).

---

### P08 — Mesh quality (W7)

**What’s inside:** honesty baseline · normative quality bar + formulas · touch/blast list · Tasks 00–06 · CP-08 · agent split (max 2) · non-goals.

**Is it too dense?** **No.** ~380 lines is a **healthy** execute card + body. Formulas and part-count matrix **must** stay with the gate or agents invent `toe-kick` aliases again (already fixed once in suggestions).

| Option | Advice |
|--------|--------|
| Split “bar doc” vs “implement mesh” | **REJECT** — NOTES bar is Task 01 of the same CP; separate file invites bar-PASS without mesh. |
| Split headless visual vs unit | **REJECT** — CP-08 requires both; file already defaults headless and optional P07 place. |
| Expand with more SKUs | **REJECT** — non-goals correctly freeze cabinet-v0 only. |

**Verdict P08:** **KEEP** · model for other phases · density not a problem.

---

### Cross-check: denser file not in the question (P05)

**P05 (~950 lines)** is the real size outlier (inline unit test source + SVG honesty). Same rule as P07: **KEEP CP-05 ownership**, **SPLIT density** on next content pass. Do not let mesh/journey advice distract from symbols bloat.

---

## Q3 — Should INDEX absorb a “week-1 kill order”?

### Answer: **YES — EXPAND INDEX (small section)**

**Not** a new top-level plan. **Not** a rewrite of CHECKPOINTS dependency graph. A **time-ordered operator sequence** for the first calendar week after **implementation unlock**, so agents and owner stop treating “parallel after CP-02” as “all streams equally urgent.”

### Why INDEX (not only 00-START / MASTER)

| Doc | Role today | Kill-order fit |
|-----|------------|----------------|
| **INDEX** | Program map agents open first | **Best home** — one screen with W table + streams + order |
| 00-START | Unlock + ethics + engine checkboxes | Link to INDEX kill order; do not duplicate full list |
| CHECKPOINTS | Hard stop truth | Keep dependency graph; kill order **prioritizes** within allowed parallelism |
| MASTER-CHECKLIST | Owner ticks | Optional one-line pointer; not a schedule |
| AGENT-RULES | Subagent contract | Optional “spawn in kill-order priority” one-liner later |

### What a week-1 kill order is (and is not)

| Is | Is not |
|----|--------|
| Ordered **what dies first** (buyer-facing lies / blockers) | New phase numbering |
| Explicit **serial spine** vs **parallel fill** | Ban on post-CP-02 parallelism |
| Named in **W-gates + evidence folders** first | Only P-numbers (P/W/folder triple already confuses) |
| ~15–25 lines in INDEX | Multi-page Gantt |

### Recommended week-1 kill order (content draft — apply later)

Binding constraints already in INDEX/CHECKPOINTS: CP-00 → CP-01 → CP-02 before feature streams; no product code while locked; CP-03 browser not self-waived.

**Proposed kill order (Approach A, after unlock):**

| Order | Kill | Why first | CP / phase | Evidence |
|------:|------|-----------|------------|----------|
| 0 | Unlock + mode recorded | Silent ≠ go | CP-00 | `00-start/` |
| 1 | Product truth inventory | Stop myth-driven edits | CP-01 | `00-product-truth/` |
| 2 | Engine lock | Stop thrash / hybrid engines | CP-02 | `01-engine-lock/` |
| **3** | **Select + delete + undo (unit then browser)** | Buyer cannot edit without W3; unit alone = FAIL | **CP-03 / W3** | **`03-select-delete/`** |
| **4** | **Draw + place browser pack** | Demo path; serial journey | **CP-07 / W1–W2 browser** (place half honest if CP-05 red) | **`02-browser-open3d-journey/`** |
| 5 | Save honesty + reload | “Return next day” north star | CP-06 / W5–W6 | `06-save-honesty/` (+ `save-reload/`) |
| 6 | Orbit + 2D↔3D | Inspect layout in 3D | CP-04 / W4 | `04-orbit-continuity/` |
| 7 | Block2D symbols | W2 quality half | CP-05 | `05-symbols-svg/` |
| 8 | Mesh bar toe/carcass/door | W7 readable modular | CP-08 / W7 | `08-mesh-quality/` |
| 9 | Shortcut/label truth | Trust chrome; **blocking 2A only** | CP-09 / W8 | `09-shortcuts-chrome/` |
| 10 | Pack + E: backup | Close only when data supports | CP-10 | `10-handover/` |

**Parallel fill (after CP-02, does not reorder kill priority):**

- While main line works **3 → 4 → 5**, side agents may run **6–9** only if they do not thrash the same canvas/keyboard contracts without coordination.  
- **Priority rule:** if agent slots are scarce, spawn kill-order 3–5 before 7–9.  
- **CP-07 full product story** still waits CP-03 + CP-05 not red unless owner WAIVE (already in CHECKPOINTS) — kill order must repeat that one line.

**Naming rule for the INDEX section:** lead with **W-gate + folder**, then `(P0X / CP-0X)` — never “do P07 before P03” without saying **W3 browser folder is still a hard gate**.

### INDEX section shape (for a later edit — not applied here)

```markdown
## Week-1 kill order (after implementation unlock)

Serial spine: CP-00 → CP-01 → CP-02 → W3 (unit+browser) → W1–W2 journey pack → W5–W6.
Parallel fill (≤8): W4, W2 symbols, W7 mesh, W8 labels — lower priority if slots scarce.
Full claim rules: unchanged from CHECKPOINTS (no self-waive W3 browser; journey honesty).
```

Plus the table above condensed to ~8 rows.

**Verdict:** **EXPAND INDEX** with week-1 kill order · **do not** expand every phase banner with the full schedule.

---

## KEEP / SPLIT / EXPAND / hybrid — matrix

| Artifact | KEEP | SPLIT | EXPAND | Hybrid notes |
|----------|:----:|:-----:|:------:|--------------|
| P01–P10 topology | ✓ | | | One file per CP stays |
| CP graph + folder lock | ✓ | | | Already corrected dual-`08` |
| INDEX role as map | ✓ | | ✓ kill order | Small section only |
| 00-START unlock/ethics | ✓ | | | Link kill order; no second program |
| CHECKPOINTS hard stops | ✓ | | | Not a schedule doc |
| MASTER / AGENT-RULES | ✓ | | | Optional one-liner later |
| RESULTS-MAP | ✓ | | | Authority for folders |
| P03 content | ✓ owner | density later | | Optional companion only if browser pack balloons |
| P07 content | ✓ owner | **code density** | | W1+W2 stay one pack |
| P08 content | ✓ | | | Model phase |
| P05 content | ✓ owner | **code density** | | Worst bloat; next thin target |
| reviews/ | ✓ | | | Do not merge into phases |
| Recovery-style micro-phases | | reject | | Avoid 04a–f explosion |

---

## What not to do (structure anti-patterns)

1. **Do not** create `P03a` / `P07a` CPs for browser halves — multiplies green lies.  
2. **Do not** flatten all phases into INDEX — INDEX becomes unreadably fat and loses execute checkboxes.  
3. **Do not** renumber evidence folders to match P-numbers mid-wave (`02-browser` stays gold).  
4. **Do not** treat “week-1 kill order” as forbidding parallel streams — it **prioritizes** them.  
5. **Do not** move quality-bar formulas out of P08 into RESEARCH-MAP — research is ideas-only.  
6. **Do not** rewrite phases in the same commit as this advice unless owner asks for a thin pass.

---

## Priority if owner authorizes a structure-only edit later

| Priority | Action | Effort |
|----------|--------|--------|
| **P0** | Add **Week-1 kill order** section to `INDEX.md` (+ one link from `00-START.md`) | Small |
| **P1** | Thin **P07** (and **P05**): replace multi-page TS with step contracts + “implement in `site/tests/e2e/…`” | Medium |
| **P2** | Thin **P03**: keep proof-layers + Task 08 hard gate at top of mind; move long inventory to end or post-execute NOTES | Small–medium |
| **P3** | Optional `phases/README.md` one-pager: “open INDEX kill order → open one phase → open RESULTS-MAP” | Tiny |
| **Defer** | Companion browser files; any CP renumber; merging MASTER into INDEX | — |

**Still out of scope for structure work:** product code, evidence fabrication, push, worktrees.

---

## Direct answers (owner checklist)

| Question | Answer |
|----------|--------|
| Do 25KB phase files help or hurt? | **Both.** Help **ownership / stop rules**; hurt **task focus / skim / stale code**. Prefer **hybrid thin**, not topology split. |
| W3 browser + unit in one file too dense? | **Dense but correct.** **KEEP** one CP. Thin presentation; never split the hard browser half into a second gate. |
| W7 mesh one file too dense? | **No. KEEP.** |
| Journey one file too dense? | **Content yes, gate no.** **KEEP** CP-07; **SPLIT** embedded Playwright code out on next revise. |
| INDEX absorb week-1 kill order? | **Yes. EXPAND** INDEX with a short serial spine + parallel fill table. |

---

## Status

- **This file:** advice only under `Plans/trustdata/reviews/STRUCTURE-ADVICE-2.md`.  
- **Phases:** not rewritten.  
- **INDEX kill order:** recommended, not applied.  
- **Next step for owner:** accept/reject matrix → if accept P0, authorize INDEX-only patch; if accept P1, authorize P07/P05 thin pass without CP changes.
