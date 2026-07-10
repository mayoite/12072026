# MASTER checklist — Trust-Data world-standard planner

> **Owner file.** Single source of checkbox truth for the P-track program.  
> **Agents:** REQUIRED `/using-superpowers`. Tick a box only when evidence path exists and was re-read this session.  
> **Do not** tick from memory, chat optimism, or ayushdocs P0-DONE notes alone.  
> **Governance revision:** 2026-07-09 — see [../checkpoints/GOVERNANCE-suggestions.md](../checkpoints/GOVERNANCE-suggestions.md).

**Program root:** `D:\OandO07072026\Plans\P-track\`  
**Evidence root:** `D:\OandO07072026\results\planner\world-standard-wave\`  
**Design authority:** `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md`  
**Checkout:** `D:\OandO07072026` · no worktrees · commit as we go · push/mirror per `AGENTS.md` (force-push needs owner)

**Last sync:** _fill date when P10 MASTER-SYNC runs_  
**Git HEAD at last sync:** _paste short SHA_

---

## How to use

1. Work phases in kill-order priority — **one active task** (`AGENTS.md`).  
2. For each item: evidence path in backticks → then `- [x]`.  
3. At P10: copy tallies into `results/planner/world-standard-wave/10-handover/MASTER-SYNC.md`.  
4. Open blockers go to `D:\OandO07072026\Failures.md`, not silent skips.

### Canonical evidence folders (do not invent)

| Gate / phase | Folder under `world-standard-wave/` |
|--------------|-------------------------------------|
| W0 / CP-00 | `00-start/` |
| P01 / CP-01 | `00-product-truth/` |
| P02 / CP-02 | `01-engine-lock/` |
| W3 / P03 / CP-03 | `03-select-delete/` (**unit + browser**) |
| W4 / P04 / CP-04 | `04-orbit-continuity/` |
| W2 symbols / P05 / CP-05 | `05-symbols-svg/` |
| W5–W6 / P06 / CP-06 | `06-save-honesty/` (+ `save-reload/` for W5) |
| W1–W2 browser / P07 / CP-07 | `02-browser-open3d-journey/` |
| **W7 / P08 / CP-08** | **`08-mesh-quality/`** |
| **W8 / P09 / CP-09** | **`09-shortcuts-chrome/`** |
| Pack / P10 / CP-10 | `10-handover/` |

Legacy aliases (pointer only; rehome before tick): `08-shortcuts-chrome/` → `09-shortcuts-chrome/`; `01-product-truth/` → `00-product-truth/`. See [evidence path lock](.../../archive/museum/trustdata-history/10-EVIDENCE-PATH-LOCK.md).

---

## 0) Program control (W0)

- [x] **W0.1** Approach **A** recorded in `Plans/P-track/START.md` (2026-07-09).
- [x] **W0.2** **Implementation unlock recorded** in 00-START — product work allowed; **do not re-ask owner to unlock**.
- [x] **W0.3** INDEX.md + 00-START.md read by executing agent (CP-00 **PASS**).
- [x] **W0.4** Engine constraints accepted — see [CONSTRAINTS.md](../CONSTRAINTS.md) + `01-engine-lock/`
- [x] **W0.5** North star accepted: facilities buyer unaided → layout with O&O-scale furniture → 2D↔3D+orbit → select/edit/delete → save/return → quote path later.
- [x] **W0.6** Out of scope while any W red: photoreal, multiplayer, AR, CRM/SSR expansion, destination 2D cutover before W gates green

**Evidence:** `Plans/P-track/START.md` · `results/planner/world-standard-wave/00-start/` (optional NOTES) · CP-00 in `checkpoints/CHECKPOINTS.md`

---

## 1) Ethics (non-negotiable)

- [ ] **E.1** Research used for **patterns / jobs-to-be-done only** — no competitor code, JS bundles, CSS, GLB, icons, logos, or brand assets copied into `site/` or product packages.
- [ ] **E.2** Packages shipped are MIT / Apache / BSD / other approved open licenses after license check; no proprietary third-party assets shipped as O&O.
- [ ] **E.3** Competitor screenshots and raw scrapes stay under `D:\websites\…` (or E: research backup); not pasted into marketing site or planner UI.
- [ ] **E.4** Toolbar/chrome layout inspiration is re-implemented with Phosphor + O&O CSS modules/tokens — not cloned markup from Planner5D/Homestyler/etc.
- [ ] **E.5** Firecrawl / scrape waves for RoomSketcher, Floorplanner, IKEA, Homestyler are **ideas only**; re-scrape Planner5D only if owner orders and gaps are real (pack already deep).
- [ ] **E.6** ETHICS docs acknowledged: `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` and trustdata `RESEARCH-MAP.md`.
- [ ] **E.7** No secrets (`.env`, tokens, cookies) in commits, evidence packs, or E: backups.

**Evidence:** code review greps; absence of competitor paths under `site/`; research remains outside product tree.

---

## 2) Agent operating rules

- [ ] **A.1** `/using-superpowers` (and fit skills) used on main agent **and** every subagent for non-trivial work.
- [ ] **A.2** Agent concurrency matches `AGENTS.md` (one task; max 10 inside it).
- [ ] **A.3** **No git worktrees** — only `D:\OandO07072026` main checkout.
- [ ] **A.4** Trust **data** (repo, tests, browser artifacts) — not character trials of the owner; not blind belief in prior agent claims.
- [ ] **A.5** Competitor research in prompts tagged **inspiration only**; no plagiarism instructions.
- [ ] **A.6** Agents write evidence to disk under `results/planner/world-standard-wave/` (prefer write-to-disk; do not idle waiting on chat).
- [ ] **A.7** Local **commit as we go** after each landable slice; messages name phase + slice.
- [ ] **A.8** Push origin when right; mirror on cadence (`AGENTS.md`). **Force-push** / remote branch delete still need explicit owner ask.
- [ ] **A.9** Subagent prompts include: superpowers; no worktrees; trust data; inspiration only; write evidence; commit slices (see AGENT-RULES.md).
- [ ] **A.10** Scope creep beyond the ask → stop and ask owner (AGENTS.md).
- [ ] **A.11** No `any` in handwritten TypeScript; type exceptions need reason, owner, removal condition.
- [ ] **A.12** Zero suppression of test output; missing console or skipped tests = fail for that gate.
- [ ] **A.13** Failures logged in `Failures.md` when blocked; no defended bad output.

**Evidence:** `checklists/AGENT-RULES.md` · commit log · evidence folders · Failures.md

---

## 3) Phase completion (P01–P10) — maps 1:1 to CP-01–CP-10 (+ CP-00 via §0)

- [ ] **P01** Product truth inventory complete — `results/planner/world-standard-wave/00-product-truth/` (CP-01).
- [ ] **P02** Engine lock notes + 00-START engine checkboxes — `01-engine-lock/` or NOTES + ENGINE-DECISION ref (CP-02).
- [ ] **P03** Select/delete/undo — W3 — `03-select-delete/` with **unit + browser** proof (CP-03).
- [ ] **P04** Orbit + 2D↔3D continuity — W4 — `04-orbit-continuity/` (CP-04).
- [ ] **P05** Block2D symbol quality path — W2 symbols — `05-symbols-svg/` (CP-05).
- [ ] **P06** Save reload + honest labels — W5–W6 — `06-save-honesty/` (CP-06).
- [ ] **P07** Browser draw→place journey — W1–W2 — `02-browser-open3d-journey/` (CP-07).
- [ ] **P08** Mesh quality bar — W7 — **`08-mesh-quality/`** (CP-08).
- [ ] **P09** Shortcut/label truth + blocking chrome only — W8 — **`09-shortcuts-chrome/`** (CP-09).
- [ ] **P10** Evidence pack + MASTER sync + E: backup + handover — `10-handover/` (CP-10).

---

## 4) World-standard gates W1–W8

Definitions from design spec; proof standards are mandatory.

### W1 — Draw structure

- [ ] **W1.1** Unaided path can draw walls on `/planner/open3d` or guest planner.
- [ ] **W1.2** Door opening placed on structure.
- [ ] **W1.3** Playwright (or equivalent browser automation) proof with screenshots.
- [ ] **W1.4** Artifacts under `results/planner/world-standard-wave/02-browser-open3d-journey/`.

### W2 — Place catalog + readable symbols

- [ ] **W2.1** Place ≥2 catalog items in one session.
- [ ] **W2.2** One of them is **cabinet-v0** (or current modular cabinet SKU bar item).
- [ ] **W2.3** 2D symbols readable (Block2D), not empty blob.
- [ ] **W2.4** Playwright place proof in `02-browser-open3d-journey/`; symbol unit/PNG bar in `05-symbols-svg/`.

### W3 — Select / delete / undo

- [ ] **W3.1** Furniture selectable on default 2D canvas (hit-test works). Product bar = **furniture** (openings stretch).
- [ ] **W3.2** Delete or Backspace removes selection.
- [ ] **W3.3** Undo restores removed entity (same id + pose).
- [ ] **W3.4** **Unit tests + browser proof** in `03-select-delete/` — browser is **hard**: Playwright **or** chrome-devtools select→delete→undo with `run.json` + raw log + screenshots or trace. **Unit alone = not done.** Agents may not self-waive browser (owner WAIVE in CHECKPOINTS only).

### W4 — Continuity + orbit

- [ ] **W4.1** 2D↔3D toggle preserves poses (ids + transforms).
- [ ] **W4.2** 3D orbit controls enabled.
- [ ] **W4.3** Console free of hard errors on toggle/orbit path.
- [ ] **W4.4** Proof in `04-orbit-continuity/`.

### W5 — Save → reload identity

- [ ] **W5.1** Save (autosave flush or explicit) then hard reload.
- [ ] **W5.2** Walls and furniture **ids** match pre-reload document.
- [ ] **W5.3** Playwright wait strategy documented in run notes.
- [ ] **W5.4** Proof under `06-save-honesty/` (prefer `06-save-honesty/save-reload/`).

### W6 — Save honesty (local vs cloud)

- [ ] **W6.1** UI status text does not claim cloud when only IndexedDB/local.
- [ ] **W6.2** Either cloud member path wired with proof **or** explicit local-only labeling.
- [ ] **W6.3** Code + copy review notes + test in `06-save-honesty/`.

### W7 — Mesh quality bar

- [ ] **W7.1** Bar doc written (toe / door / carcass readable for cabinet-v0).
- [ ] **W7.2** Visual smoke screenshot (or headless mesh PNG) shows modular mesh, not apology box only.
- [ ] **W7.3** Remaining debt listed honestly in NOTES.md.
- [ ] **W7.4** Proof in **`08-mesh-quality/`** only.

### W8 — Shortcuts / labels

- [ ] **W8.1** Every user-visible tool/shortcut label matches the bound handler.
- [ ] **W8.2** Known lie fixed (example class: D labeled/mapped door while keydown arms dimension — must not ship).
- [ ] **W8.3** Unit + keyboard tests in **`09-shortcuts-chrome/`** only.
- [ ] **W8.4** Non-blocking premium chrome **not** required for this checkbox (only blockers).

---

## 5) Testing & evidence discipline

- [ ] **T.1** Every gate that claims browser proof has screenshots on disk (not only “ran fine” in chat). **Includes W3** under `03-select-delete/`.
- [ ] **T.2** Every automated run has `run.json` (or playwright-run.json) plus raw log; no filtered-only success.
- [ ] **T.3** Vitest/Playwright skipped tests counted as fail for the owning gate.
- [ ] **T.4** Evidence folders match CHECKPOINTS lock table / RESULTS-MAP names (W7=`08-mesh-quality/`, W8=`09-shortcuts-chrome/`).
- [ ] **T.5** Non-regression: prior p0/unit scripts re-run when touching spine; logs retained under wave or cited prior paths.
- [ ] **T.6** `testing-handbook.md` zero-suppression rule followed.

---

## 6) Backup (E: drive)

- [ ] **B.1** `E:` mounted and writable.
- [ ] **B.2** Dated folder created: `E:\OandO-backups\trustdata-YYYY-MM-DD\`.
- [ ] **B.3** Copied minimum set: `Plans\P-track\`, `results\planner\world-standard-wave\`, world-standard design spec, `Failures.md`.
- [ ] **B.4** Recommended: `D:\websites\research\2026-07-09-world-standard\` copied under backup `websites-research\`.
- [ ] **B.5** `10-handover/BACKUP-LOG.md` written with dest path, times, outcome codes, size summary.
- [ ] **B.6** Spot-check: backup contains `Plans\P-track\BOARD.md` and `10-handover\README.md`.
- [ ] **B.7** No secrets included in backup.

**Procedure detail:** `phases/P10-evidence-handover/P10-evidence-handover.md`

---

## 7) Git & handover

- [ ] **G.1** All landable slices committed locally with clear messages.
- [ ] **G.2** `10-handover/HEAD.txt` captures `git rev-parse HEAD` and `git status -sb`.
- [ ] **G.3** Push status recorded: not requested / requested and done / blocked.
- [ ] **G.4** No worktrees exist for this program’s work.
- [ ] **G.5** `10-handover/README.md` handover narrative complete (what is true, W table, blockers, next step, git, backup).
- [ ] **G.6** `10-handover/W-GATES.md` matches this checklist’s W rows (W7 path `08-mesh-quality/`; W8 path `09-shortcuts-chrome/`).
- [ ] **G.7** `10-handover/FAILURES-SNIP.md` lists only open blockers.
- [ ] **G.8** CP-10 marked PASS in `checkpoints/CHECKPOINTS.md` only after B.* and G.* and W1–W8 (or owner WAIVE).

---

## 8) Explicit non-claims (keep checked when still true)

- [ ] **N.1** We do **not** claim P0.1–P0.3 ayushdocs DONE equals world-standard ship quality.
- [ ] **N.2** We do **not** claim unit-green spine equals unaided buyer success (includes **unit-only W3**).
- [ ] **N.3** We do **not** claim cloud save without wire proof.
- [ ] **N.4** Destination 2D host not claimed live until interactive path proved ([CONSTRAINTS.md](../CONSTRAINTS.md))
- [ ] **N.5** We do **not** claim photoreal / Homestyler parity as a W1–W8 goal.

---

## Tally (fill at P10)

| Section | Total boxes | Done | Open |
|---------|-------------|------|------|
| 0 W0 | 6 | | |
| 1 Ethics | 7 | | |
| 2 Agents | 13 | | |
| 3 Phases | 10 | | |
| 4 W1–W8 | 32 | | |
| 5 Testing | 6 | | |
| 6 Backup | 7 | | |
| 7 Git/handover | 8 | | |
| 8 Non-claims | 5 | | |
| **Sum** | **94** | | |

Program complete for trustdata wave only when **Sum done = 94** or owner WAIVE rows are recorded in CHECKPOINTS.md and reflected here with waiver references (waived items still listed; note WAIVE id beside them).

---

## Related

| Doc | Path |
|-----|------|
| Agent contract | [AGENT-RULES.md](./AGENT-RULES.md) |
| Checkpoints | [../checkpoints/CHECKPOINTS.md](../checkpoints/CHECKPOINTS.md) |
| Governance review | [../checkpoints/GOVERNANCE-suggestions.md](../checkpoints/GOVERNANCE-suggestions.md) |
| P10 handover | [../phases/P10-evidence-handover/P10-evidence-handover.md](../phases/P10-evidence-handover/P10-evidence-handover.md) |
| Research index | [.../../archive/Plans/Research/RESEARCH-MAP-trustdata.md](.../../archive/Plans/Research/RESEARCH-MAP-trustdata.md) |
| Results map | [.../../archive/Plans/Research/RESULTS-MAP.md](.../../archive/Plans/Research/RESULTS-MAP.md) |

---

## Expert revision note — 2026-07-09

Governance pass (no product code). Applied from GOVERNANCE-suggestions:

1. Canonical folder table at top — CP-00–CP-10 / W1–W8.  
2. **W3.4** browser hard gate spelled out; unit alone = not done.  
3. **W7** → `08-mesh-quality/`; **W8** → `09-shortcuts-chrome/` (P09 row + W8.3 + G.6 + T.4).  
4. N.2 explicitly covers unit-only W3 non-claim.  
5. Box count remains **94**.
