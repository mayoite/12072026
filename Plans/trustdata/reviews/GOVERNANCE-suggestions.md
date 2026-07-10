# GOVERNANCE suggestions — Checkpoints + Master checklist + Agent rules

**Reviewer:** planning expert (trust-data governance)  
**Date:** 2026-07-09  
**Targets (in scope for this pass):**

| File | Role |
|------|------|
| [checkpoints/CHECKPOINTS.md](../checkpoints/CHECKPOINTS.md) | Hard stop ledger CP-00 → CP-10 |
| [checklists/MASTER-CHECKLIST.md](../checklists/MASTER-CHECKLIST.md) | Owner single checkbox truth |
| [checklists/AGENT-RULES.md](../checklists/AGENT-RULES.md) | Subagent contract |

**Mode:** plan-only · **no product code** · no worktrees · superpowers required at execution  
**Owner overrides applied this pass:** CP-00–CP-10 phase match · **W3 browser proof hard** · mesh folder **`08-mesh-quality/`** · shortcuts folder **`09-shortcuts-chrome/`**

---

## Live alignment check (2026-07-09)

### CP ↔ phase ↔ gate (structure already sound)

| CP | Phase file | Gate(s) | Structural match |
|----|------------|---------|------------------|
| CP-00 | `00-START.md` | W0 | OK |
| CP-01 | `phases/P01-product-truth/P01-product-truth.md` | Baseline | OK |
| CP-02 | `phases/P02-engine-lock/P02-engine-lock.md` | Engine | OK |
| CP-03 | `phases/P03-select-delete/P03-select-delete.md` | **W3** | OK (tighten browser wording) |
| CP-04 | `phases/P04-orbit-continuity/P04-orbit-continuity.md` | **W4** | OK |
| CP-05 | `phases/P05-symbols-svg/P05-symbols-svg.md` | **W2** symbols | OK |
| CP-06 | `phases/P06-save-honesty/P06-save-honesty.md` | **W5–W6** | OK |
| CP-07 | `phases/P07-draw-place-journey/P07-draw-place-journey.md` | **W1–W2** browser | OK |
| CP-08 | `phases/P08-mesh-quality/P08-mesh-quality.md` | **W7** | OK · folder `08-mesh-quality/` |
| CP-09 | `phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` | **W8** | **Folder wrong in governance** (see S1) |
| CP-10 | `phases/P10-evidence-handover/P10-evidence-handover.md` | Pack + E: | OK |

Phase order in `00-START.md` / `INDEX.md` matches CP-00–CP-10. Dependency graph (parallel after CP-02; CP-07 waits CP-03+CP-05) matches Approach A.

### Evidence folder drift (must fix in the three governance files)

| Work | Prior governance path | Owner-correct path (this pass) |
|------|----------------------|--------------------------------|
| W7 mesh (P08 / CP-08) | `08-mesh-quality/` | **`08-mesh-quality/`** (keep) |
| W8 shortcuts (P09 / CP-09) | `08-shortcuts-chrome/` | **`09-shortcuts-chrome/`** (change) |

**Why change:** Dual `08-*` folders caused repeated agent confusion (P08 vs P09, P10 anti-drift bans, RESULTS-MAP collision notes). Owner direction 2026-07-09: **phase-number the shortcuts folder** → `09-shortcuts-chrome/`. Mesh stays `08-mesh-quality/`.

**Prior wrong authority (superseded by User Wins this message):**

- `P09-suggestions.md` S1 locked `08-shortcuts-chrome/`
- `P09-shortcuts-chrome.md` + `P10-evidence-handover.md` banned `09-shortcuts-chrome/`
- `RESULTS-MAP.md` mapped W8 → `08-shortcuts-chrome/`

Those files are **out of scope** for this edit pass but **must be synced** in a follow-up (see § Follow-ups).

### W3 browser proof (must stay hard)

| Source | Rule |
|--------|------|
| Design W3 | Unit **+** Playwright (browser) |
| P03 (revised) | Unit alone ≠ CP-03 green; minimal browser under `03-select-delete/` |
| CHECKPOINTS CP-03 (prior) | Criterion (5) Playwright **or** chrome-devtools — good |
| MASTER W3.4 (prior) | Unit + browser proof — good |

**Gap:** CP-03 pass criteria list browser as item (5) but evidence list and stop rule are easy to skim past. Product bar still says “openings where in scope” while **P03 locks furniture-only** for CP-03. Governance must:

1. Call browser proof **hard / non-waive-by-agent** (owner WAIVE only).  
2. List **minimum browser artifacts** (screenshots or trace + `run.json` + raw log).  
3. Align product bar: **furniture** select/delete/undo for CP-03; openings stretch not required.

---

## Suggestions (prioritized)

### S1 — Canonical W8 folder = `09-shortcuts-chrome/` (must)

Replace every `08-shortcuts-chrome` in the three governance files with **`09-shortcuts-chrome`**.  
Keep W7 as **`08-mesh-quality/`** only.  
Add anti-drift one-liner: do not dump W8 under mesh folder; if legacy `08-shortcuts-chrome/` exists, pointer `NOTES.md` only — rehome artifacts to `09-shortcuts-chrome/`.

### S2 — Explicit CP lock table (must)

Add a compact **CP | Phase | Gate | Evidence folder** table near the top of CHECKPOINTS (and mirror key rows in MASTER §3 / AGENT-RULES §6) so agents cannot invent alternate mappings mid-wave.

### S3 — W3 browser proof non-optional (must)

In CP-03 + MASTER W3 + AGENT-RULES evidence for W3:

- Unit green **without** browser select→delete→undo under `03-select-delete/` = **W3 FAIL**.  
- Allowed tools: Playwright **or** chrome-devtools (scripted).  
- Minimum: `run.json` + raw log + screenshots **or** Playwright/devtools trace covering select → Delete/Backspace → undo.  
- Agents may not self-waive browser; owner WAIVE template only.  
- P07 journey may re-assert W3; it does **not** replace first W3 browser proof.

### S4 — CP-03 product bar = furniture (must)

Match revised P03: CP-03 bar is **furniture** only. Drop “openings where in scope” as if required. Wall/room side paths exist; door/window first-class select = stretch.

### S5 — Folder exceptions documented once (should)

Document intentional non-phase folder numbers:

| Folder | Why not `0N-` |
|--------|----------------|
| `02-browser-open3d-journey/` | Design gold path for P07 (optional alias `07-browser-journey/` with pointer) |
| `01-engine-lock/` | Shares `01-` with product-truth (engine lock notes; not journey) |
| `08-mesh-quality/` | P08 / W7 |
| `09-shortcuts-chrome/` | P09 / W8 (**phase-aligned**) |

### S6 — Stream table + concurrency (should)

AGENT-RULES stream 2 + stream 7 evidence paths → `09-shortcuts-chrome/`.  
Mention W3 browser skills (chrome-devtools / Playwright verification) on stream 1.

### S7 — MASTER W8 + phase rows + tally honesty (should)

Update P09 / W8.3 paths. Keep total box count **94** unless boxes added. Add short “canonical folders” note under §3 or §4 so P10 MASTER-SYNC cites correct paths.

### S8 — Migration note for legacy `08-shortcuts-chrome/` (should)

In CHECKPOINTS global notes or Related: if any pre-revision notes pointed at `08-shortcuts-chrome/`, treat as **non-canonical**; rehome or pointer before CP-09 PASS.

### S9 — Out-of-scope follow-ups (do not expand this pass)

| File | Needed change |
|------|----------------|
| `RESULTS-MAP.md` | W8 / P09 rows + create script + forbidden matrix → `09-shortcuts-chrome/` |
| `phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` | Canonical evidence root → `09-…`; reverse “do not use 09” lines |
| `phases/P10-evidence-handover/P10-evidence-handover.md` | W-gate table + anti-drift (delete ban on 09; require 09) |
| `phases/P08-mesh-quality/P08-mesh-quality.md` | Next-phase pointer: P09 evidence is `09-shortcuts-chrome/` |
| `phases/P09-shortcuts-chrome/P09-suggestions.md` | Historical; leave as archive or add supersession banner later |

**User Wins:** owner asked only the three governance files + this suggestions doc this pass.

---

## Top actions applied into governance (this revision)

1. **S1** — W8 → `09-shortcuts-chrome/`; W7 stays `08-mesh-quality/`  
2. **S2** — CP lock table in CHECKPOINTS  
3. **S3** — W3 browser hard gate + minimum artifacts  
4. **S4** — CP-03 furniture-only product bar  
5. **S5–S8** — exceptions, agent streams, MASTER paths, legacy pointer note  

---

## Out of scope for this review pass

- Product / site code  
- Creating evidence folders or running tests  
- Editing RESULTS-MAP / phase files (follow-up)  
- Marking any CP PASS  
- git push  

---

## Expert revision note — 2026-07-09

Planning governance pass only. Applied S1–S8 into:

- `Plans/trustdata/checkpoints/CHECKPOINTS.md`  
- `Plans/trustdata/checklists/MASTER-CHECKLIST.md`  
- `Plans/trustdata/checklists/AGENT-RULES.md`  

Status after apply: all CPs remain **OPEN** (no false green). Follow-ups S9 still required for RESULTS-MAP + P09 + P10 path lock.
