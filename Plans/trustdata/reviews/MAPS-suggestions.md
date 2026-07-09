# MAPS suggestions — RESEARCH-MAP + RESULTS-MAP (planning expert)

**Date:** 2026-07-09  
**Plans reviewed:**  
- `Plans/trustdata/RESEARCH-MAP.md`  
- `Plans/trustdata/RESULTS-MAP.md`  

**Authority cross-check:** `INDEX.md` · `00-START.md` · `checkpoints/CHECKPOINTS.md` · `checklists/MASTER-CHECKLIST.md` · `checklists/AGENT-RULES.md` · `phases/P01`–`P10` · `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` · live `D:\websites\**` pack roots · live `results/planner/world-standard-wave/` (WAVE.md + COMPARISON-CHART.md only as of review).

**Scope:** Map docs only. **No product code.** Ethics remain **ideas-only**. Evidence folders must stay consistent with P01–P10 / CP-00–CP-10 / AGENT-RULES.

**Method:** Full map read + authority table align + live path spot-check under `D:\websites` and `results/planner/world-standard-wave/`.

---

## Strengths (keep)

### RESEARCH-MAP

- Binding **inspiration-only** banner; MIT/open packages rule; anti-copy PR checklist.
- Pack index paths largely **real** on disk (Planner5D, RoomSketcher, Floorplanner, Homestyler, IKEA public, 3dplanner, world-standard comparison, oando-render-options).
- Pattern library → trustdata phase/gate is the right translation layer for agents.
- Engine decision table matches ENGINE-DECISION / 00-START checkboxes / CP-02.
- Firecrawl policy matches WAVE.md (no default re-scrape; CLI may be off PATH).

### RESULTS-MAP

- Canonical folders already match **CHECKPOINTS**, **AGENT-RULES §6**, **MASTER T.4**, and **P10 RESULTS-MAP lock** for W0–W8 + pack.
- P07 browser gold path correctly reserved as `02-browser-open3d-journey/` (not phase-number `07-`).
- Dual `08-mesh-quality/` + `08-shortcuts-chrome/` already documented; P10 anti-drift (`not 09-shortcuts-chrome`) is the right rule.
- Forbidden-claims matrix and “historical = cite only” prevent W-gate laundry via p0 spines.
- `run.json` minimum fields + zero-suppression browser/unit conventions align with testing-handbook intent.

---

## Consistency findings

| # | Severity | Map | Finding | Source of truth | Suggested fix |
|---|----------|-----|---------|-----------------|---------------|
| M1 | High | Both | Maps lack a single **P01–P10 · CP · W · folder · research pack** matrix; agents must cross-open INDEX + CHECKPOINTS + AGENT-RULES to wire a stream. | INDEX phase table; CHECKPOINTS master; AGENT-RULES §6; design W1–W8 | Add master crosswalk to RESULTS-MAP; RESEARCH-MAP gets phase→pack routing only |
| M2 | High | RESULTS | **Forbidden aliases** (`02-engine-lock/`, `09-shortcuts-chrome/`, `07-mesh-quality/`, inventing `09-*`) appear in phase drafts/reviews but are not listed as a hard ban table in RESULTS-MAP itself. | P02 revision (`01-engine-lock`); P09/P10 anti-drift; P08 reviews | Explicit **forbidden / never invent** table at top of RESULTS-MAP |
| M3 | High | RESEARCH | Ethics is strong but not explicit that **research never clears W gates** and never lands binaries under `site/`. Agents can still treat SYNTHESIS as “done.” | 00-START ethics; AGENT-RULES; design proof column | Add **ideas-only ↔ evidence** boundary: research → intent; RESULTS-MAP folders → pass |
| M4 | Med | RESULTS | P02/P03 phases require richer packs than RESULTS-MAP “minimum when green” (e.g. P02 `NOTES.md` only vs phase `ENGINE-LOCK-RECORD`, `run.json`, `HEAD.txt`). Risk: agents stop at map minimum and fail phase tasks, or invent conflicting minima. | P02/P03/P05/P06 phase artifact lists; CP rows | Clarify **map minimum = CP green floor**; phase may require **additional** files; do not drop phase extras |
| M5 | Med | RESULTS | `run.json` example omits `evidenceRoot` / `gitHead` naming used in revised P02/P03; dual naming `playwright-run.json` vs `run.json` underspecified. | P02 Task 0.3; P03 Task 09; AGENT-RULES minimum | Extend schema example; rule: **one** canonical `run.json` per gate folder + optional task-specific `*-run.json` |
| M6 | Med | RESEARCH | `firecrawl-wave2\agent-*\raw\` are **empty/thin** on disk; map presents them as deep raw without honesty. | Live `D:\websites\research\2026-07-09-world-standard\firecrawl-wave2\` | Mark wave2 raw as optional/thin; prefer SYNTHESIS + comparison slices |
| M7 | Med | RESEARCH | Slice scores are a **2026-07-09 research snapshot**; WAVE still claims “no orbit” while code may default orbit ON (P01/P04 notes). Map can freeze myths as product truth. | WAVE.md; P01-suggestions orbit note; P04-suggestions | Label scores **research-dated, not live product truth**; re-verify in P01 |
| M8 | Med | Both | Missing **Related** footers (INDEX, CHECKPOINTS, MASTER, AGENT-RULES, design spec, each other). Other trustdata docs use Related tables. | INDEX related pattern; P10 Related | Add Related + Expert revision note 2026-07-09 |
| M9 | Med | RESULTS | Create-on-execute script omits `06-save-honesty/save-reload` (optional W5 subfolder) and does not ban pre-creating empty show folders while P10 expects folders present or WAIVE. | CP-06; P06-suggestions; P10 spot-list | Document create-when-phase-runs vs P10 close; optional `save-reload` line |
| M10 | Low | RESEARCH | oando-render-options: `CANVAS_RENDER_OPTIONS.md` lives at pack **root**, not only under `report\`. | Live `D:\websites\oando-render-options\` | Fix pack row paths |
| M11 | Low | RESEARCH | Quick-open order skips RESULTS-MAP and CHECKPOINTS; new agents can research forever without evidence contract. | 00-START; AGENT-RULES | Extend open order: RESEARCH-MAP → RESULTS-MAP → CP → pack report |
| M12 | Low | RESULTS | No status legend (missing / OPEN / green) for folder rows; CP has status language. | CHECKPOINTS legend | Short evidence-folder status convention |
| M13 | Low | RESULTS | Historical sibling list is good but not tied to **P01 inventory duty** explicitly. | CP-01 criterion (3) | One line: P01 must classify spine-only vs world-standard |
| M14 | Low | RESEARCH | No per-phase “open this pack first” for W8 (Homestyler shortcuts), W7 (IKEA/catalog depth), chrome (P5D TOOLBARS) — agents re-open whole tree. | Pattern library rows | Phase→pack routing table |

---

## Path spot-check (2026-07-09)

### Research packs (exist)

| Path | Status |
|------|--------|
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | OK |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`, `TOOLBARS.md`, … | OK |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | OK |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | OK |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | OK |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | OK |
| `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` | OK |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | OK |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | OK |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine` … `07-oando-self` | OK |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | OK |
| `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md` (root) | OK — map path fix needed |
| `D:\OandO07072026\Plans\Research\RESEARCH-2026-07-05-*.md` | OK (5 files) |
| `results/planner/world-standard-wave/WAVE.md`, `COMPARISON-CHART.md` | OK |

### Evidence root (pre-execution)

| Path | Status |
|------|--------|
| `results/planner/world-standard-wave/` | Exists; **only** WAVE + COMPARISON-CHART — gate folders not created yet (expected) |
| `01-product-truth/` … `10-handover/` | **Missing** until phase execute (RESULTS-MAP create-on-execute is correct) |

### Known alias traps (from phase reviews)

| Invented / draft name | Canonical |
|----------------------|-----------|
| `02-engine-lock/` | `01-engine-lock/` (P02 / CP-02) |
| `09-shortcuts-chrome/` | `08-shortcuts-chrome/` (P09 / CP-09 / W8) |
| `07-browser-journey/` alone | Pointer only → `02-browser-open3d-journey/` |
| Phase-number `07-mesh` etc. | `08-mesh-quality/` for W7 |

---

## Apply order (for reviser)

1. **M2 + M1** — RESULTS-MAP: forbidden aliases + full P01–P10 crosswalk.  
2. **M3 + M6 + M7 + M10 + M11 + M14** — RESEARCH-MAP: ideas-only boundary, thin packs, score snapshot honesty, path fixes, phase routing, open order.  
3. **M4 + M5 + M9 + M12 + M13** — RESULTS-MAP: minimum vs phase extras, run.json schema, save-reload, status, P01 historical duty.  
4. **M8** — Related footers + **Expert revision note 2026-07-09** on both maps.  
5. Point both maps at this file: `Plans/trustdata/reviews/MAPS-suggestions.md`.

**Do not:** rename canonical folders mid-wave; invent product code; re-scrape competitors; claim WAVE.md narrative as gate pass.

---

## Already correct (do not thrash)

- Evidence root: `D:\OandO07072026\results\planner\world-standard-wave\`.  
- E: mirror: `E:\OandO-backups\trustdata-YYYY-MM-DD\results\planner\world-standard-wave\`.  
- W1/W2 place → `02-browser-open3d-journey/`; W2 symbols → `05-symbols-svg/`.  
- W5/W6 → `06-save-honesty/` (+ `save-reload/` for hard reload).  
- W7 → `08-mesh-quality/`; W8 → `08-shortcuts-chrome/`.  
- Engine: Fabric dest / Feasibility interim / R3F+orbit / SKU / BOQ>photoreal.  
- Inspiration only; Phosphor; no competitor assets in `site/`.

---

## Status

**Applied** into revised `Plans/trustdata/RESEARCH-MAP.md` and `Plans/trustdata/RESULTS-MAP.md` same day (see Expert revision notes in those files).
