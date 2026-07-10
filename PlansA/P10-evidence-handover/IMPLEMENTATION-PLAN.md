# P10 — Evidence Pack + Handover + E: Backup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).
>
> **Every subagent brief starts with:** `/using-superpowers` + fit skills (`verification-before-completion`, `Agents/Agents-docs.md`, `Agents/Agents-failure.md`). **No TDD product code** — this phase is **pack / honesty / backup only**.

**Goal:** Produce an honest final evidence pack under `results/planner/world-standard-wave/10-handover/` that binds W0–W8 to **disk-re-read** paths (or FAIL/WAIVE), syncs owner checklist truth without paper PASS, logs E: backup, commits landable doc/evidence slices, and never claims product ship from gate ceremony.

**Architecture:** P10 is a **verification + documentation + backup** phase. Proof file-of-record is only `D:\OandO07072026\results\planner\world-standard-wave\`. Research under `D:\websites` is ideas only. Process maps live under `Plans/` + `Plans/Research/RESULTS-MAP.md`. Missing or red W evidence reopens owning phases (P01–P09) — **never** patches `site/` under the P10 label. GATE PASS ≠ product complete.

**Tech Stack:** PowerShell on Windows; git on main checkout `D:\OandO07072026` only (no worktrees); Markdown pack files; robocopy / Copy-Item for E:; Vitest/Playwright artifacts **consumed** if present (not authored as product code here).

**Inputs consumed:**
- Repo read: 2026-07-10 — live tree: `results/` **ABSENT**; `Plans/trustdata/` **REMOVED**; `CHECKPOINTS.md` / `MASTER-CHECKLIST.md` / `00-START.md` **NOT FOUND** under live `Plans/`; phase execute card still references historical `Plans/trustdata/*` paths — **repo wins** for path truth
- Brainstormer: `Idiots2/P10-evidence-handover/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P10-evidence-handover/P10-evidence-handover.md` + `P10-suggestions.md` + `README.md`
- RESULTS-MAP: `Plans/Research/RESULTS-MAP.md` (FINAL folder lock 2026-07-09)
- Design W1–W8: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
- Program index: `Plans/INDEX.md` · `Plans/README.md` · `Plans/phases/EXPERT-PASS.md`
- Failures: `Failures.md` (root)

**Done when (two honest modes):**

| Mode | When to use | “Done” means |
|------|-------------|----------------|
| **Mode A — FAIL-honest pack** | `results/` still missing or W folders empty; owner wants truth on disk now | Six pack files exist; every W row is FAIL/MISSING or OPEN with path re-read; CP-10 **not** marked PASS; Failures.md notes blockers; local commit of pack |
| **Mode B — CP-10 PASS** | W0–W8 GREEN (or owner WAIVE) on disk; process files for MASTER/CHECKPOINTS exist or owner-restored | Six pack files + MASTER-SYNC tallies match live MASTER; E: BACKUP-LOG PASS; CP-00–CP-09 PASS/WAIVE recorded; CP-10 marked with path; no `site/` edits under P10 |

**Evidence folder (create on execute; re-prove if missing):**  
`results/planner/world-standard-wave/10-handover/`

**Hard scope:** **Plan execution = pack docs + verification probes + backup logs only.** **No site features. No product code. No test authoring under `site/tests/` for this plan.**

---

## 0. Executive truth (read before any task)

### 0.1 What P10 is and is not

| Claim | Truth |
|-------|--------|
| P10 ships W1–W8 by writing code | **FALSE** |
| P10 green means “product works” | **FALSE** — means pack + honest binding + backup criteria |
| Research / SYNTHESIS / MASTER-CHART = W pass | **FALSE** |
| ayushdocs / `Plans/Research/Others/*` P0-DONE = world-standard pass | **FALSE** |
| Gate ≠ product | **TRUE** — gates are proof contracts; product is buyer journey on running app |

### 0.2 Live disk truth (planner re-proved 2026-07-10)

| Check | Result |
|-------|--------|
| `D:\OandO07072026\results\` | **DOES NOT EXIST** |
| `…\results\planner\world-standard-wave\` | **DOES NOT EXIST** |
| Any `10-handover/` six-file pack | **MISSING** |
| `Plans/trustdata/` | **REMOVED** (cleanup 2026-07-10) |
| `Plans/**/CHECKPOINTS.md` | **NOT FOUND** |
| `Plans/**/MASTER-CHECKLIST.md` | **NOT FOUND** |
| Live plan root | `Plans/` (`INDEX.md`, `phases/P01–P10`, `Research/`) |
| Canonical evidence root (when exists) | `results/planner/world-standard-wave/` |

**Brutal implication:** Mode B (CP-10 PASS) is **blocked today**. Default first landable is **Mode A FAIL-honest pack** OR **stop and rebuild evidence via kill order** before any PASS claim.

### 0.3 GATE ≠ product (binding)

| Layer | Lives | Pass means |
|-------|-------|------------|
| **Research** | `D:\websites` | Studied enough to decide — **not** product works |
| **Gate / CP** | `results/planner/world-standard-wave/*` + CP records | Artifacts re-read this session match RESULTS-MAP + phase extras |
| **Product** | Running `site/` buyer journey | Facilities buyer can layout unaided — gates necessary, not sufficient |

**Never write:** “Wave complete” because SYNTHESIS is rich, or because this plan file exists.

---

## 1. Repo reality

### 1.1 What exists (procedure authority)

| Path | Role |
|------|------|
| `Plans/INDEX.md` | Kill order, W one-screen, phase catalog |
| `Plans/README.md` | Entry + authority |
| `Plans/phases/P10-evidence-handover/P10-evidence-handover.md` | Execute card Task 00–06, six files, E: backup, CP-10 criteria |
| `Plans/phases/P10-evidence-handover/P10-suggestions.md` | S1–S8 applied (no product code; folder lock; 94-box MASTER; runbook) |
| `Plans/Research/RESULTS-MAP.md` | **FINAL evidence folder lock** — only legal W folder names |
| `Plans/Research/RESEARCH-MAP.md` | Ideas index; research ≠ evidence |
| `Plans/phases/EXPERT-PASS.md` | Must-fix for P02–P09 — **not implemented by P10** |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W1–W8 definitions; Approach **A** locked |
| `Failures.md` | Gate policy + open honesty notes |
| `scripts/run-evidence-cmd.ps1` | Generic evidence wrapper (module/phase/name under `results/`) |
| `scripts/check-repo-layout.mjs` | `pnpm run check:layout` — evidence only under root `results/` |
| `Idiots2/P10-evidence-handover/REPORT.md` | Brainstormer input (this plan’s bar + failure modes) |
| `plans1/P10-evidence-handover/IMPLEMENTATION-PLAN.md` | **This file** |

### 1.2 What is missing (blocker inventory)

| Missing | Blocks |
|---------|--------|
| Entire `results/` tree | All W0–W8 + pack file-of-record |
| `10-handover/` six files | Pack completeness |
| `CHECKPOINTS.md` | Formal CP-00–CP-10 PASS/WAIVE rows |
| `MASTER-CHECKLIST.md` | Task 02 94-box sync (Mode B) |
| Historical `Plans/trustdata/00-START.md` | Approach checkboxes path as written in old cards |
| Wave root `WAVE.md` / `COMPARISON-CHART.md` | Pre-plan honesty copies on D: (research MASTER-CHART still under `D:\websites`) |

### 1.3 Path drift (repo wins)

| Old path (still in some docs) | Live path |
|-------------------------------|-----------|
| `Plans/trustdata/` | **Gone** — use `Plans/` |
| `Plans/trustdata/RESULTS-MAP.md` | `Plans/Research/RESULTS-MAP.md` |
| `Plans/trustdata/phases/P10-…` | `Plans/phases/P10-evidence-handover/` |
| `Plans/trustdata/checkpoints/CHECKPOINTS.md` | **Missing** — restore from git history **or** owner reinstate |
| `Plans/trustdata/checklists/MASTER-CHECKLIST.md` | **Missing** — same |
| Backup source `Plans\trustdata\` in execute card | Live: copy **`Plans\`** (full live tree) |
| `ayushdocs/08-EVIDENCE-INDEX.md` | Also under `Plans/Research/Others/08-EVIDENCE-INDEX.md` — verify before claim |

**When execute card conflicts with disk:** RESULTS-MAP + INDEX + AGENTS.md + live paths win. Do not invent `Plans/trustdata` to “make the card happy.”

### 1.4 Contradictions to carry into tasks

1. **Execute card preconditions** require CP-00–CP-09 in CHECKPOINTS + MASTER — both files absent → Mode B blocked until restore or owner decision.  
2. **AGENTS.md** allows agent-call push of green landables; **P10 execute card** defaults **no push without owner ask** → for P10 execution follow **execute card** unless owner overrides in current conversation.  
3. **S2 historical confusion** dual `08-*`: FINAL lock is W7=`08-mesh-quality/`, W8=`09-shortcuts-chrome/` only.  
4. **Global-standard modules plan** (`docs/superpowers/plans/2026-07-10-global-standard-modules.md`) uses a different evidence tree (`global-standard-revision/modules/…`) — **do not mix** into W-gate PASS claims for trustdata P10. Dual language: GATE PASS ≠ module product complete.  
5. **Failures.md** still cites historical `results/` paths that are not on disk — pack snip must not re-certify those as live GREEN.

### 1.5 HEAD / tree honesty

Executor must capture live:

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
git rev-parse --show-toplevel
# Expect toplevel: D:/OandO07072026 or D:\OandO07072026 — not a worktree
Test-Path "D:\OandO07072026\results"
# Expect: False (as of 2026-07-10 planner pass) until rebuilt
```

Record outputs into `10-handover/HEAD.txt` during Task 01/06. Do not paste secrets.

### 1.6 Canonical folder map (RESULTS-MAP lock — do not invent names)

| Gate | Canonical primary under `world-standard-wave/` | Owning phase |
|------|-----------------------------------------------|--------------|
| W0 | `00-start/` | CP-00 / unlock notes |
| Baseline | `00-product-truth/` | P01 |
| Engine | `01-engine-lock/` | P02 |
| W1 | `02-browser-open3d-journey/` | P07 |
| W2 place | `02-browser-open3d-journey/` | P07 |
| W2 symbols | `05-symbols-svg/` | P05 |
| W3 | `03-select-delete/` | P03 |
| W4 | `04-orbit-continuity/` | P04 |
| W5 | `06-save-honesty/save-reload/` or `06-save-honesty/` | P06 |
| W6 | `06-save-honesty/` | P06 |
| **W7** | **`08-mesh-quality/`** (sole primary `08-*`) | P08 |
| **W8** | **`09-shortcuts-chrome/`** | P09 |
| Pack | `10-handover/` | P10 |

**Forbidden as canonical:** `02-engine-lock/`, `01-product-truth/`, `08-shortcuts-chrome/`, `07-mesh-quality/`, dumps under `results/tests/`, `site/results/`, `archive/results/`, any `D:\websites\**` path as sole W proof.

### 1.7 Six required pack files (map minimum + phase)

| File | Required contents |
|------|-------------------|
| `README.md` | Date, HEAD short SHA, approach A/B/C, agent count, links to each W folder, push status, backup pointer, handover narrative sections |
| `W-GATES.md` | Table W0–W8 → pass/fail/WAIVE/MISSING → primary path → secondary → re-read date |
| `MASTER-SYNC.md` | Section tallies (historically 9 sections / **94** boxes) **or** honest “MASTER file missing” block for Mode A |
| `HEAD.txt` | `git rev-parse HEAD` + `git status -sb` |
| `FAILURES-SNIP.md` | Open blockers from live `Failures.md` only |
| `BACKUP-LOG.md` | E: dest, times, **per-source** exit codes, B.6 spot-check, PASS/FAIL |

### 1.8 Kill order (rebuild evidence — not P10 work, but stop-if-fail points here)

```
P01 truth → P02 engine
  → P03 W3 (unit+browser)
  → P07 W1–W2 journey
  → P06 W5–W6 save
  → P04 orbit · P05 symbols · P08 mesh · P09 shortcuts
  → P10 handover
```

**P10 is last.** Running Mode B first is ceremony.

---

## 2. Brainstormer synthesis (`Idiots2/P10-evidence-handover/REPORT.md`)

### 2.1 Raised bar (stronger than process PASS)

1. **Disk re-read this session** for every green box — memory and old SESSION-RECAP are not proof.  
2. **Research ≠ evidence** with forbidden-claims matrix (journey, select, 3D, symbols, save, mesh, shortcuts, wave, engine, product truth).  
3. **Gate ≠ product** three-layer model (research / gate / buyer).  
4. **No site/ under P10** — reopen owning phase (S1).  
5. **Folder lock** W7/`08-mesh` · W8/`09-shortcuts` (S2 + FOLDER-LOCK).  
6. **MASTER full sync** historically 94 boxes — never green without paths (S3).  
7. **Ordered Task 00–06** pack → MASTER → commits → push policy → E: → close (S4).  
8. **BACKUP-LOG per-source** codes + B.6 spot-checks (S6).  
9. **FAIL-honest pack** is a valid landable; **CP-10 PASS is not** until evidence exists.

### 2.2 Failure modes / false-green traps (must block in tasks)

| Trap | Block |
|------|-------|
| Mark W PASS from SYNTHESIS / MASTER-CHART scores | W-GATES only accepts wave paths |
| Unit-green alone as W3 | Require browser under `03-select-delete/` for full W3 |
| Guest seed walls absolute counts as W1 | Journey must use deltas + screenshots |
| Orbit defaults alone as W4 | Three-layer orbit proof required in owning phase |
| Bare “Saved” as cloud | W6 NOTES + label proof |
| Mesh place unit as W7 | NOTES + toe/door/carcass visual |
| Keymap file exists unread as W8 | run.json + handler match logs |
| Empty folders created “for show” | Create-only when writing real artifacts; missing = FAIL not GREEN |
| Paper MASTER ticks | Revert; integrity fail |
| Secrets in pack / E: | Scrub; Failures.md |
| Competitor PNG as O&O proof | Screenshots must be O&O app only |
| Self-WAIVE W3 browser | Owner only in CHECKPOINTS when restored |
| Global-standard module GREEN as W pass | Different tree; cite only as non-W context |

### 2.3 Approaches A/B/C (P10 pack strategy — not product engines)

| Approach | Meaning for **this** plan | Choose when |
|----------|---------------------------|-------------|
| **Pack-A FAIL-honest** | Write six files stating MISSING/FAIL; no CP-10 PASS | Default while `results/` absent |
| **Pack-B recover-then-bind** | Recover `results/` from git/E:/archive, re-verify each folder, then bind | Evidence once existed |
| **Pack-C rebuild-then-PASS** | Kill-order re-run P01–P09 (other plans/phases), then Mode B P10 | Unrecoverable tree |

**Decision locked for first execution:** **Pack-A** immediately landable; **Pack-B/C** required before Mode B. Do not re-open product Approach A/B/C (Feasibility vs Fabric) in P10 — already locked Approach A in design spec.

### 2.4 Buyer journey (acceptance of pack, not of product)

**Buyer of the pack** = owner / next agent who must know:

1. What is proven on disk today.  
2. What is research-only.  
3. What to reopen.  
4. Where backup lives.  
5. That green process without buyer journey is still a lie if W folders empty.

### 2.5 Open questions → plan resolutions

| Question | Resolution in this plan |
|----------|-------------------------|
| MASTER missing? | Mode A: `MASTER-SYNC.md` records **FILE MISSING** + cannot tick; Mode B blocked until restore |
| CHECKPOINTS missing? | Same — CP-10 PASS requires restore or owner-written CP record path agreed in conversation |
| Backup source path trustdata vs Plans? | Copy live `Plans\` not missing `Plans\trustdata\` |
| Push? | Default no; record `push: not requested` unless owner asks |
| Can we create empty gate folders? | **No** for GREEN theater; Mode A documents absence without inventing GREEN |

### 2.6 Path index cross-check (report vs repo)

Brainstormer paths for RESULTS-MAP, P10 phase, design spec, Failures, websites — **confirmed present** except evidence tree and CHECKPOINTS/MASTER. Report claim `results/` gone — **re-proved by planner**.

---

## 3. Ethics / non-copy

| Rule | Detail |
|------|--------|
| Research home | `D:\websites` only — inspiration / patterns |
| Never | Competitor code, CSS, SVG blobs, brands, GLB into `site/` or into `results/` as fake O&O proof |
| Firecrawl | **Dead** as routine active work; do not re-scrape during P10 |
| Screenshots in evidence | **O&O app only** |
| Secrets | `.env.local` never in pack or E: backup |
| Licenses | `Plans/Research/Others/17-LICENSES-CLEARED.md` / `ayushdocs/17-LICENSES-CLEARED.md` |
| E: research copy | Optional ideas backup under `websites-research/` — **not** W proof |

Ethics checklist before any PR that touched UI (P10 should touch **none** of product UI):

- [ ] No binary from `D:\websites\**` under `site/public` or `site/features`
- [ ] No competitor class names / path blobs
- [ ] No “Planner5D-like” brand wording
- [ ] Icons Phosphor if UI ever touched (out of P10 scope)
- [ ] No research path as sole W1–W8 proof

---

## 4. File map

### 4.1 Create (on execute)

| Path | When |
|------|------|
| `results/planner/world-standard-wave/10-handover/README.md` | Task 01 / 06 |
| `results/planner/world-standard-wave/10-handover/W-GATES.md` | Task 01 |
| `results/planner/world-standard-wave/10-handover/MASTER-SYNC.md` | Task 02 |
| `results/planner/world-standard-wave/10-handover/HEAD.txt` | Task 01, refresh Task 06 |
| `results/planner/world-standard-wave/10-handover/FAILURES-SNIP.md` | Task 01 |
| `results/planner/world-standard-wave/10-handover/BACKUP-LOG.md` | Task 05 (stub early OK) |
| `results/planner/world-standard-wave/` directory tree | Only when writing real content; Mode A may create **only** `10-handover/` |
| `E:\OandO-backups\trustdata-YYYY-MM-DD\**` | Task 05 if E: mounted |

### 4.2 Modify (docs / process only — never `site/`)

| Path | What |
|------|------|
| `Failures.md` | Append P10 blocker if CP-10 backup or evidence tree missing; no silent skip |
| `Plans/phases/.../CHECKPOINTS.md` or restored CP file | Mode B only — mark CP-10 |
| Restored `MASTER-CHECKLIST.md` | Mode B only — ticks with paths |
| Optional: phase execute card path fixes | **Out of scope for default P10** unless owner asks plan-doc hygiene |

### 4.3 Explicitly never touch under P10

| Path pattern | Why |
|--------------|-----|
| `site/**` | Product code forbidden |
| `site/tests/**` | Product tests forbidden |
| `D:\websites\**` | Research home; no “fix scores to green” |
| Forbidden evidence alias folders as GREEN | Folder lock |

### 4.4 Consume / re-read only

| Path | Role |
|------|------|
| Each `world-standard-wave/<gate>/` when present | W-GATES binding |
| `Plans/Research/RESULTS-MAP.md` | Authority |
| `Failures.md` | FAILURES-SNIP source |
| `D:\websites\research\2026-07-09-world-standard\` | Optional E: ideas backup |

---

## 5. Architecture & data flow

```
[Owner / next agent]
        │
        ▼
[Mode decision: A FAIL-honest | B recover | C rebuild]
        │
        ├─ C: leave P10 → execute P01…P09 plans (other idiotplanners)
        │
        ├─ B: recover results from git/E:/archive → verify map minimum
        │
        └─ A or post-B/C:
                │
                ▼
        Probe disk (PowerShell Test-Path + file lists)
                │
                ▼
        Write 10-handover/* (six files) ──► W-GATES binds paths only
                │
                ▼
        MASTER-SYNC (file present?) ──yes──► tallies ──► Mode B path
                │ no
                ▼
        MASTER MISSING honesty (Mode A)
                │
                ▼
        Local git commits (pack slices)
                │
                ▼
        E: robocopy/Copy-Item + BACKUP-LOG
                │
                ▼
        CP-10 PASS only if all Mode B criteria true
                │
                └─ else: pack OPEN/FAIL-honest; Failures.md updated
```

**Data truth rule:** W-GATES status column is a function of **filesystem**, not of prior narrative.

---

## 6. Task list

### Task 00 — Setup / skills / tree check / mode lock

**Files:**
- Create: none required yet
- Modify: none
- Test: probe commands only (below)

- [ ] **Step 1: Load skills and confirm checkout**

Announce in agent log: using superpowers + verification-before-completion + Agents-docs + Agents-failure.

```powershell
cd D:\OandO07072026
git rev-parse --show-toplevel
git worktree list
# Expect single main checkout at D:\OandO07072026 — no extra worktrees for this work
```

Expected: toplevel is repo root; no second worktree created by this agent.

- [ ] **Step 2: Read authority set (do not skip)**

Open and skim enough to act (already planned; re-open if executor is fresh):

1. `AGENTS.md` (evidence root rule)  
2. `Plans/INDEX.md` kill order  
3. `Plans/Research/RESULTS-MAP.md` folder lock  
4. `Plans/phases/P10-evidence-handover/P10-evidence-handover.md`  
5. `Idiots2/P10-evidence-handover/REPORT.md` §0 + §10  
6. `Failures.md` (active section)  
7. Design W1–W8 table in design spec  

- [ ] **Step 3: Probe evidence + process files**

```powershell
$root = "D:\OandO07072026"
@(
  "results",
  "results\planner",
  "results\planner\world-standard-wave",
  "results\planner\world-standard-wave\10-handover",
  "Plans\INDEX.md",
  "Plans\Research\RESULTS-MAP.md",
  "Plans\phases\P10-evidence-handover\P10-evidence-handover.md",
  "Plans\trustdata",
  "Plans\checkpoints\CHECKPOINTS.md",
  "Plans\checklists\MASTER-CHECKLIST.md"
) | ForEach-Object {
  $p = Join-Path $root $_
  [PSCustomObject]@{ Path = $_; Exists = (Test-Path $p) }
} | Format-Table -AutoSize
```

Expected (2026-07-10 baseline): `results*` false; `Plans\trustdata` false; CHECKPOINTS/MASTER false; INDEX/RESULTS-MAP/P10 true.

- [ ] **Step 4: Lock execution mode**

Write decision into agent notes (and later into `10-handover/README.md`):

| Condition | Mode |
|-----------|------|
| Any W primary missing map minimum | **Mode A** or stop for rebuild — **not** Mode B PASS |
| All W GREEN/WAIVE + MASTER + CHECKPOINTS present | **Mode B** eligible |
| Historical results recoverable | Prefer **Pack-B** then Mode B |

Default if probes match §0.2: **Mode A (FAIL-honest pack)**.

- [ ] **Step 5: Layout gate awareness (optional probe)**

```powershell
cd D:\OandO07072026
pnpm run check:layout
```

Expected: pass or report layout issues; **does not** prove W gates. If tools later write under `site/results/`, redirect to root `results/`.

- [ ] **Step 6: Commit (none yet unless agent only added notes outside scope)**

No commit required for Task 00 alone.

---

### Task 01 — Final evidence pack core files (Mode A or B)

**Files:**
- Create: all six under `results/planner/world-standard-wave/10-handover/` (BACKUP-LOG may be stub)
- Modify: none of `site/`
- Test: existence + content schema probes

- [ ] **Step 1: Create handover directory only**

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
New-Item -ItemType Directory -Force -Path $h | Out-Null
Test-Path $h
```

Expected: `True`. Do **not** mass-create empty `00-start`…`09-*` for show.

- [ ] **Step 2: Write failing “schema probe” checklist (verification before fill)**

Create temporary probe expectations (executor mental or local checklist): after write, each file must exist and contain required headings. Until written:

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
@("README.md","W-GATES.md","MASTER-SYNC.md","HEAD.txt","FAILURES-SNIP.md","BACKUP-LOG.md") | ForEach-Object {
  Test-Path (Join-Path $h $_)
}
```

Expected **before** write: all `False` (or partial if re-run).

- [ ] **Step 3: Capture HEAD.txt**

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
cd D:\OandO07072026
@"
# HEAD.txt — P10 handover
Captured: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')
Checkout: D:\OandO07072026

## git rev-parse HEAD
$(git rev-parse HEAD)

## git status -sb
$(git status -sb)

## git rev-parse --show-toplevel
$(git rev-parse --show-toplevel)
"@ | Set-Content -Path (Join-Path $h "HEAD.txt") -Encoding utf8
Get-Content (Join-Path $h "HEAD.txt")
```

Expected: SHA line + status; no secrets; no `.env` contents.

- [ ] **Step 4: Probe every RESULTS-MAP primary folder (binding input)**

```powershell
$wave = "D:\OandO07072026\results\planner\world-standard-wave"
$folders = @(
  "00-start",
  "00-product-truth",
  "01-engine-lock",
  "02-browser-open3d-journey",
  "03-select-delete",
  "04-orbit-continuity",
  "05-symbols-svg",
  "06-save-honesty",
  "06-save-honesty\save-reload",
  "08-mesh-quality",
  "09-shortcuts-chrome",
  "10-handover"
)
$folders | ForEach-Object {
  $p = Join-Path $wave $_
  $exists = Test-Path $p
  $files = if ($exists) { (Get-ChildItem $p -File -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name) -join ", " } else { "" }
  [PSCustomObject]@{ Folder = $_; Exists = $exists; Files = $files }
} | Format-Table -AutoSize
```

Record table into W-GATES notes. Mode A expected: only `10-handover` exists after Step 1.

- [ ] **Step 5: Write W-GATES.md (full content — Mode A template)**

Write file `results/planner/world-standard-wave/10-handover/W-GATES.md` with **exactly this structure** (update Status column only if disk differs):

```markdown
# W-GATES — binding table (P10)

**Re-read date:** YYYY-MM-DD (executor fills live date)
**Git HEAD:** (from HEAD.txt)
**Rule:** Status is disk truth only. Research paths never PASS.
**RESULTS-MAP:** `Plans/Research/RESULTS-MAP.md`

| Gate | Status | Primary path (under world-standard-wave/) | Secondary | Map minimum check | Notes |
|------|--------|-------------------------------------------|-----------|-------------------|-------|
| W0 | FAIL / MISSING | `00-start/` | `10-handover/W-GATES.md` | NOTES.md approach A/B/C | results/ tree absent or folder empty |
| W1 | FAIL / MISSING | `02-browser-open3d-journey/` | — | run.json or playwright-run.json + wall/door PNGs | |
| W2 place | FAIL / MISSING | `02-browser-open3d-journey/` | — | place ≥2 incl cabinet-v0 screenshots | |
| W2 symbols | FAIL / MISSING | `05-symbols-svg/` | journey PNGs | run/vitest + PNG or prim-JSON + NOTES | |
| W3 | FAIL / MISSING | `03-select-delete/` | — | run.json + vitest raw + **browser** proof | unit alone = FAIL |
| W4 | FAIL / MISSING | `04-orbit-continuity/` | — | run.json + screenshots + console clean | three-layer orbit in owning phase |
| W5 | FAIL / MISSING | `06-save-honesty/save-reload/` | `06-save-honesty/` | hard reload same wall + furniture ids | |
| W6 | FAIL / MISSING | `06-save-honesty/` | — | honest local vs cloud labels + NOTES | |
| W7 | FAIL / MISSING | `08-mesh-quality/` | — | NOTES bar + toe/door/carcass visual | sole primary `08-*` |
| W8 | FAIL / MISSING | `09-shortcuts-chrome/` | — | run.json + keyboard/handler match | not `08-shortcuts-chrome/` |
| Pack | OPEN / FAIL-honest | `10-handover/` | E: backup | six files | not CP-10 PASS while any W FAIL without WAIVE |

## WAIVE log

| Gate | Owner WAIVE? | Date | Residual risk |
|------|--------------|------|---------------|
| (none unless owner wrote WAIVE in CHECKPOINTS) | | | |

## Forbidden claims used?

- [ ] No research path marked PASS
- [ ] No unit-only W3 PASS
- [ ] No empty-folder GREEN
```

If Mode B and folders GREEN, change Status to PASS and fill map minimum check with **actual filenames found** (not “exists”).

- [ ] **Step 6: Write FAILURES-SNIP.md from live Failures.md**

```powershell
# Manual: read D:\OandO07072026\Failures.md Active failures / honesty
# Write snip — do not invent resolved product claims
```

Full starter content:

```markdown
# FAILURES-SNIP — open blockers only (P10)

**Source:** `D:\OandO07072026\Failures.md`  
**Snipped:** YYYY-MM-DD  
**Rule:** Open blockers only. Historical “pass” evidence paths cited in Failures.md that are not on disk are **not** re-certified here.

## P10 / world-standard evidence

| ID | Severity | Summary | Action |
|----|----------|---------|--------|
| P10-RESULTS-TREE-MISSING | High | Entire `results/` absent 2026-07-10 | Rebuild via kill order or recover backup before Mode B |
| P10-CHECKPOINTS-MISSING | High | No live CHECKPOINTS.md under Plans | Restore from git history or owner reinstate before CP PASS |
| P10-MASTER-MISSING | High | No live MASTER-CHECKLIST.md | Same |
| P10-CP10-NOT-PASS | High | Pack may exist FAIL-honest only | Do not mark program complete |

## From Failures.md honesty (not full copy)

- SVG publish authority: pipelineCore+normalize (honesty note — not W-gate)
- G8 viewer GLB: partial (not W7 mesh bar alone)
- Coverage floor / PLAN-FAIL-0408 policy (not auto W fail)

## Agent process

- No worktrees
- No push without owner ask (P10 execute card)
- No `site/` edits under P10
```

- [ ] **Step 7: Write BACKUP-LOG.md stub**

```markdown
# BACKUP-LOG
- Date: (pending Task 05)
- Dest: E:\OandO-backups\trustdata-YYYY-MM-DD\
- Start / End (local time): pending
- Per-source outcomes: pending
- Approx total bytes: pending
- Spot-check B.6: pending
- Secrets excluded: yes (planned)
- Result: NOT RUN
```

- [ ] **Step 8: Write README.md pack index (partial narrative OK; complete in Task 06)**

Minimum required sections:

```markdown
# 10-handover — World-standard wave evidence pack

**Date:** YYYY-MM-DD  
**Git HEAD (short):** (fill)  
**Approach:** A (Product Journey First) — design lock 2026-07-09  
**Agent count this pack:** (fill)  
**Mode:** A FAIL-honest | B CP-10 candidate  
**push:** not requested | requested and done | requested and blocked  
**Backup:** see BACKUP-LOG.md · dest pending  

## What is true now

(One paragraph, data-backed. Example Mode A:)  
On YYYY-MM-DD the checkout has Plans and research maps but **no** `results/planner/world-standard-wave` gate artifacts. Therefore **no W0–W8 gate is green on disk**. This pack indexes honesty, not product completion.

## W0–W8 status

See [W-GATES.md](./W-GATES.md).

## Gate folders (canonical)

| Gate | Folder |
|------|--------|
| W0 | `../00-start/` |
| W1–W2 place | `../02-browser-open3d-journey/` |
| W2 symbols | `../05-symbols-svg/` |
| W3 | `../03-select-delete/` |
| W4 | `../04-orbit-continuity/` |
| W5–W6 | `../06-save-honesty/` |
| W7 | `../08-mesh-quality/` |
| W8 | `../09-shortcuts-chrome/` |
| Pack | `./` |

## Open blockers

See [FAILURES-SNIP.md](./FAILURES-SNIP.md).

## Next phase outside trustdata pack

Rebuild evidence kill order (P01→…→P09) before Fabric full stage / CRM expansion. Fabric remains destination **after** W green (Approach A).

## Git

See [HEAD.txt](./HEAD.txt). Commits this phase: (fill after commits).

## Backup

See [BACKUP-LOG.md](./BACKUP-LOG.md).

## Non-claims

- Research under `D:\websites` is not W proof.
- This pack is not buyer product acceptance.
- MASTER ticks without paths are forbidden.
```

- [ ] **Step 9: MASTER-SYNC placeholder if Task 02 not yet run**

Either run Task 02 immediately or write:

```markdown
# MASTER-SYNC
Status: PENDING Task 02
```

Prefer completing Task 02 same session.

- [ ] **Step 10: Run pack existence verification (expect PASS for files present)**

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
$need = @("README.md","W-GATES.md","MASTER-SYNC.md","HEAD.txt","FAILURES-SNIP.md","BACKUP-LOG.md")
$need | ForEach-Object {
  $ok = Test-Path (Join-Path $h $_)
  if (-not $ok) { throw "Missing $_" }
  "OK $_"
}
Select-String -Path (Join-Path $h "W-GATES.md") -Pattern "FAIL / MISSING|PASS|WAIVE" | Select-Object -First 20
```

Expected: all OK; W-GATES contains status tokens.

- [ ] **Step 11: Commit pack core**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/10-handover/README.md `
  results/planner/world-standard-wave/10-handover/W-GATES.md `
  results/planner/world-standard-wave/10-handover/HEAD.txt `
  results/planner/world-standard-wave/10-handover/FAILURES-SNIP.md `
  results/planner/world-standard-wave/10-handover/BACKUP-LOG.md `
  results/planner/world-standard-wave/10-handover/MASTER-SYNC.md
git commit -m "trustdata(P10): evidence pack 10-handover (FAIL-honest or core)"
```

Expected: commit succeeds; no secrets staged (`git diff --cached` review).

---

### Task 02 — MASTER checklist sync (honest when file missing)

**Files:**
- Create/update: `10-handover/MASTER-SYNC.md`
- Modify: restored `MASTER-CHECKLIST.md` only if present and Mode B
- Test: tally arithmetic + path rule

- [ ] **Step 1: Locate MASTER file**

```powershell
$candidates = @(
  "D:\OandO07072026\Plans\checklists\MASTER-CHECKLIST.md",
  "D:\OandO07072026\Plans\trustdata\checklists\MASTER-CHECKLIST.md",
  "D:\OandO07072026\Plans\MASTER-CHECKLIST.md"
)
$candidates | ForEach-Object { "$_ -> $(Test-Path $_)" }
# Optional recover:
# git log --all --full-history -- "**/MASTER-CHECKLIST.md" | Select-Object -First 20
```

- [ ] **Step 2a: If MASTER missing — write honest MASTER-SYNC (Mode A)**

Write full:

```markdown
# MASTER-SYNC

**Sync date:** YYYY-MM-DD  
**Git HEAD at sync:** (from HEAD.txt)  
**MASTER file path:** **NOT FOUND on live tree**  
**Mode:** A — FAIL-honest  

## Tally

| Section | Expected boxes (historical) | Ticked this session | Blocked reason |
|---------|----------------------------:|--------------------:|----------------|
| 0 W0 / unlock | (restore file to know) | 0 | MASTER missing |
| 1 W1–W8 | | 0 | No evidence paths green |
| 2 Ethics E.* | | 0 | Cannot tick without MASTER rows |
| 3 Agent-ops A.* | | 0 | |
| 4 Phase P01–P10 | | 0 | |
| 5 Testing T.* | | 0 | |
| 6 Backup B.* | | 0 | Task 05 not PASS |
| 7 Git G.* | | 0 | |
| 8 Non-claims N.* | | 0 | |
| **Sum** | **94 (historical target)** | **0** | **FILE MISSING** |

## Integrity rules applied

- Did **not** invent a green MASTER.
- Did **not** tick boxes from memory.
- CP-10 PASS criterion “MASTER synced” = **FAIL** until file restored and re-ticked with paths.

## Owner decision required

1. Restore `MASTER-CHECKLIST.md` from git history into a live path under `Plans/`, **or**  
2. Explicitly redefine Mode B without 94-box MASTER (owner message) — until then Mode B blocked.

## Ethics spot-check (informal, not MASTER ticks)

| Check | Result |
|-------|--------|
| Research inspiration-only | Policy OK in RESEARCH-MAP |
| No competitor assets claimed in this pack | Yes |
| Secrets in pack | No (verify) |
```

- [ ] **Step 2b: If MASTER present — re-read and tick only with paths**

Procedure:

1. Open MASTER-CHECKLIST.md.  
2. For each W0 and W1–W8 row: green **only if** `W-GATES.md` Status is PASS or WAIVE with path that `Test-Path` true this session.  
3. Ethics E.* from live RESEARCH-MAP + AGENT rules if file exists.  
4. Agent-ops A.*: superpowers used, concurrent ≤10, no worktrees, commit cadence, push policy.  
5. Phase P01–P10 + Testing T.* from RESULTS-MAP folder names + zero-suppression honesty.  
6. Backup B.* only after Task 05 PASS.  
7. Git G.* + Non-claims N.* from HEAD + honesty.  
8. Fill header Last sync + Git HEAD.  
9. Write tallies into MASTER-SYNC.md; sum must match MASTER (historical **94** or note structural change).

**Never** set green without paths.

- [ ] **Step 3: Verification**

```powershell
$ms = "D:\OandO07072026\results\planner\world-standard-wave\10-handover\MASTER-SYNC.md"
Test-Path $ms
Select-String -Path $ms -Pattern "NOT FOUND|Sum|94|PASS|FAIL"
```

Expected Mode A: contains NOT FOUND / blocked language. Mode B: numeric tallies and matching sum.

- [ ] **Step 4: Commit**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/10-handover/MASTER-SYNC.md
# if MASTER restored and edited:
# git add Plans/**/MASTER-CHECKLIST.md
git commit -m "trustdata(P10): MASTER checklist sync (honest; W0-W8 paths)"
```

---

### Task 03 — Local commit cadence (hygiene)

**Files:** commits only; refresh HEAD.txt when needed

Standing four-slice model (execute card):

| When | Message |
|------|---------|
| After pack core | `trustdata(P10): evidence pack 10-handover` |
| After MASTER-SYNC | `trustdata(P10): MASTER checklist sync W0-W8` |
| After E: backup log | `trustdata(P10): backup log + CP-10 notes` |
| After handover complete | `trustdata(P10): handover complete CP-10` **only if Mode B** |

- [ ] **Step 1: Verify no secrets staged**

```powershell
cd D:\OandO07072026
git status -sb
git diff --cached --stat
# Reject if .env, cookies, keys appear
```

- [ ] **Step 2: Ensure commit messages name phase**

No empty WIP mega-commits spanning days of unrelated work.

- [ ] **Step 3: Confirm no worktree**

```powershell
git worktree list
```

- [ ] **Step 4: Do not push** (see Task 04)

---

### Task 04 — Push policy record

- [ ] **Step 1: Default decision**

`push: not requested` unless owner wrote explicit ask in **current** conversation.

- [ ] **Step 2: If owner asks push**

```powershell
cd D:\OandO07072026
git branch --show-current
git remote -v
# Confirm origin; never force without second explicit ask
# Multi-account note from Failures.md: gh account must match remote owner
git push origin HEAD
```

- [ ] **Step 3: Record in README.md**

Update line:

```markdown
**push:** not requested
```

or `requested and done` / `requested and blocked` with reason.

- [ ] **Step 4: Mayoite mirror**

P10 execute card defaults no push; AGENTS.md mirror ~45m is **owner/execute-card subordinate**. If owner asks mirror:

```powershell
# Only with correct gh account for mayoite remote
git push mayoite HEAD
```

Log fail in Failures.md if blocked (do not invent success).

---

### Task 05 — E: drive backup

**Files:**
- Create/update: `10-handover/BACKUP-LOG.md`
- Create: `E:\OandO-backups\trustdata-YYYY-MM-DD\**`
- Modify: none product

- [ ] **Step 1: Mount / writable check (stop if fail)**

```powershell
Test-Path "E:\"
# Try write probe
$probe = "E:\OandO-backups\_write_probe.txt"
New-Item -ItemType Directory -Force -Path "E:\OandO-backups" | Out-Null
"probe" | Set-Content $probe -ErrorAction Stop
Remove-Item $probe -Force
"E: writable OK"
```

If fail: log Failures.md; BACKUP-LOG Result=FAIL; **do not claim CP-10 backup criterion**; keep D: pack.

- [ ] **Step 2: Create dated destination**

```powershell
$date = Get-Date -Format 'yyyy-MM-dd'
$dest = "E:\OandO-backups\trustdata-$date"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$dest
```

- [ ] **Step 3: Copy minimum set (live paths)**

**Note:** Execute card historically listed `Plans\trustdata`. **Live copy `Plans\`.**

```powershell
$date = Get-Date -Format 'yyyy-MM-dd'
$dest = "E:\OandO-backups\trustdata-$date"
$start = Get-Date

# 1 Plans (live tree)
robocopy "D:\OandO07072026\Plans" "$dest\Plans" /E /NFL /NDL /NJH /NJS /nc /ns /np
$rcPlans = $LASTEXITCODE

# 2 Evidence wave (may be only 10-handover)
robocopy "D:\OandO07072026\results\planner\world-standard-wave" "$dest\results\planner\world-standard-wave" /E /NFL /NDL /NJH /NJS /nc /ns /np
$rcWave = $LASTEXITCODE

# 3 Design spec
New-Item -ItemType Directory -Force -Path "$dest\docs\superpowers\specs" | Out-Null
Copy-Item "D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md" "$dest\docs\superpowers\specs\" -Force
$copySpec = $?

# 4 Failures
Copy-Item "D:\OandO07072026\Failures.md" "$dest\Failures.md" -Force
$copyFail = $?

# 5 Evidence index if present
$copyIdx = $false
$idx1 = "D:\OandO07072026\ayushdocs\08-EVIDENCE-INDEX.md"
$idx2 = "D:\OandO07072026\Plans\Research\Others\08-EVIDENCE-INDEX.md"
if (Test-Path $idx1) {
  New-Item -ItemType Directory -Force -Path "$dest\ayushdocs" | Out-Null
  Copy-Item $idx1 "$dest\ayushdocs\" -Force
  $copyIdx = $?
} elseif (Test-Path $idx2) {
  New-Item -ItemType Directory -Force -Path "$dest\Plans\Research\Others" | Out-Null
  Copy-Item $idx2 "$dest\Plans\Research\Others\" -Force
  $copyIdx = $?
}

# 6 Recommended research copy (ideas only)
$rcResearch = "skipped"
if (Test-Path "D:\websites\research\2026-07-09-world-standard") {
  robocopy "D:\websites\research\2026-07-09-world-standard" "$dest\websites-research\2026-07-09-world-standard" /E /NFL /NDL /NJH /NJS /nc /ns /np
  $rcResearch = $LASTEXITCODE
}

$end = Get-Date
# Robocopy: 0–7 success-ish; ≥8 fail
```

- [ ] **Step 4: Size + spot-check B.6**

```powershell
$dest = "E:\OandO-backups\trustdata-$(Get-Date -Format 'yyyy-MM-dd')"
$bytes = (Get-ChildItem $dest -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
"bytes=$bytes"
Test-Path "$dest\Plans\INDEX.md"
Test-Path "$dest\results\planner\world-standard-wave\10-handover\README.md"
```

Expected Mode A: INDEX true; handover README true; other gate folders may be absent on E: too.

- [ ] **Step 5: Write BACKUP-LOG.md final**

```markdown
# BACKUP-LOG
- Date: YYYY-MM-dd
- Dest: E:\OandO-backups\trustdata-YYYY-MM-DD\
- Start / End (local time): …
- Per-source outcomes:
  - Plans\ → robocopy exit: N (0–7 OK)
  - results\planner\world-standard-wave → robocopy exit: N
  - design spec → Copy-Item: OK|FAIL
  - Failures.md → Copy-Item: OK|FAIL
  - evidence index → OK|FAIL|skipped
  - websites-research → robocopy exit: N|skipped
- Approx total bytes: …
- Spot-check B.6:
  - [x] dest\Plans\INDEX.md exists
  - [x] dest\results\planner\world-standard-wave\10-handover\README.md exists
- Secrets excluded: yes
- Result: PASS | FAIL
- Note: Research copy is ideas backup only — not W-gate proof.
```

- [ ] **Step 6: Commit backup log**

```powershell
cd D:\OandO07072026
git add results/planner/world-standard-wave/10-handover/BACKUP-LOG.md
git commit -m "trustdata(P10): backup log + CP-10 notes"
```

- [ ] **Step 7: Stop-if-fail**

If E: fail → Failures.md entry; Result FAIL; Mode B CP-10 blocked on backup criterion.

---

### Task 06 — Handover narrative + CP-10 close decision

**Files:**
- Update: `10-handover/README.md`, `HEAD.txt`
- Modify: CHECKPOINTS only if Mode B eligible
- Modify: `Failures.md` if blockers remain

- [ ] **Step 1: Honesty anti-claims checklist**

Confirm each:

- [ ] Do not claim product works from unit-green alone  
- [ ] Do not claim W green without map minimum artifacts  
- [ ] Do not treat P0-DONE / Others/* as world-standard pass  
- [ ] Trust data only — no owner character judgment  
- [ ] Non-claims still true  

- [ ] **Step 2: Complete README narrative sections**

Required sections (execute card):

1. What is true now  
2. W0–W8 status table (or pointer to W-GATES)  
3. Open blockers  
4. Next phase outside trustdata  
5. Git HEAD + commits + push status  
6. Backup path + log pointer  

- [ ] **Step 3: CP-10 decision matrix**

| Criterion | Mode A FAIL-honest | Mode B PASS |
|-----------|--------------------|-------------|
| Six files present | Required | Required |
| W0–W8 all PASS or WAIVE | **False** | Required |
| MASTER synced 94/paths | **False** (file missing or 0) | Required |
| E: BACKUP-LOG PASS | Optional for honesty pack; still good | Required |
| Local commits | Required for landable | Required |
| Push policy recorded | Required | Required |
| CP-00–CP-09 PASS/WAIVE | Unknown / missing file | Required |
| No site/ under P10 | Required | Required |
| **Mark CP-10 PASS?** | **NO** | **YES only if all true** |

- [ ] **Step 4: If Mode B — mark CP record**

Only if CHECKPOINTS restored:

```markdown
| CP-10 | PASS | YYYY-MM-DD | results/planner/world-standard-wave/10-handover/ | notes |
```

If CHECKPOINTS still missing: **cannot** mark; document in README and Failures.md.

- [ ] **Step 5: Refresh HEAD.txt after final commit**

```powershell
# after final commit commands
cd D:\OandO07072026
# re-run Task 01 HEAD.txt capture
```

- [ ] **Step 6: Final commit (Mode B only for “handover complete”)**

Mode A:

```powershell
git add results/planner/world-standard-wave/10-handover/
git commit -m "trustdata(P10): FAIL-honest handover pack (not CP-10 PASS)"
```

Mode B:

```powershell
git add results/planner/world-standard-wave/10-handover/ Plans/
git commit -m "trustdata(P10): handover complete CP-10"
```

- [ ] **Step 7: verification-before-completion gate**

Re-run:

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
Get-ChildItem $h | Format-Table Name, Length
Select-String -Path "$h\W-GATES.md" -Pattern "PASS" 
# Mode A: should not claim all PASS
Select-String -Path "$h\README.md" -Pattern "CP-10 PASS|not CP-10|FAIL-honest"
```

---

### Task 07 — Optional recovery of missing process files (owner-gated)

**Only if owner asks to restore MASTER/CHECKPOINTS for Mode B.**

- [ ] **Step 1: Search git history**

```powershell
cd D:\OandO07072026
git log --all --diff-filter=A --summary -- "**/MASTER-CHECKLIST.md" "**/CHECKPOINTS.md" "**/00-START.md" | Select-Object -First 40
git log --all --full-history -- "**/MASTER-CHECKLIST.md" -n 5 --oneline
```

- [ ] **Step 2: Restore to live `Plans/` layout (not resurrect trustdata root unless owner wants)**

```powershell
# Example pattern — use actual blob path from git log
# git show <commit>:Plans/trustdata/checklists/MASTER-CHECKLIST.md > Plans/checklists/MASTER-CHECKLIST.md
```

- [ ] **Step 3: Path-fix inside restored files**

Replace `Plans/trustdata/` → `Plans/` and `RESULTS-MAP` path to `Plans/Research/RESULTS-MAP.md` where needed. Commit as docs hygiene:

```powershell
git add Plans/checklists Plans/checkpoints
git commit -m "docs(Plans): restore MASTER/CHECKPOINTS for P10 Mode B"
```

- [ ] **Step 4: Re-enter Task 02 + Task 06 Mode B path**

---

### Task 08 — Optional recover historical `results/` (Pack-B)

**Only if owner wants recovery before rebuild.**

- [ ] **Step 1: Search sources**

```powershell
# Git
cd D:\OandO07072026
git log --all --oneline -- results/planner/world-standard-wave 2>$null | Select-Object -First 20

# E: backups
Get-ChildItem "E:\OandO-backups" -ErrorAction SilentlyContinue | Sort-Object Name -Descending

# Archive
Test-Path "D:\OandO07072026\archive\results"
```

- [ ] **Step 2: Copy recover to live wave root**

```powershell
# Example if E: has prior wave:
# robocopy "E:\OandO-backups\trustdata-PREV\results\planner\world-standard-wave" `
#   "D:\OandO07072026\results\planner\world-standard-wave" /E
```

- [ ] **Step 3: Re-verify each folder against RESULTS-MAP minimum**

Use Task 01 Step 4 probe + per-folder artifact checks from §7 Test matrix. **Do not** accept recovered empty shells as GREEN.

- [ ] **Step 4: Re-bind W-GATES and proceed Task 02–06**

If recovery incomplete → stay Mode A or escalate Pack-C rebuild via P01–P09.

---

### Task 09 — Failures.md update (when pack proves missing evidence)

**Files:**
- Modify: `Failures.md`

- [ ] **Step 1: Append active failure if not already present**

```markdown
### P10-RESULTS-TREE-MISSING (opened YYYY-MM-DD)

| Field | Detail |
|-------|--------|
| **ID** | `P10-RESULTS-TREE-MISSING` |
| **Opened** | YYYY-MM-DD |
| **Status** | OPEN |
| **Was** | Entire `results/` absent; cannot green W0–W8 or CP-10 |
| **Action** | Kill-order rebuild P01–P09 or recover from E:/git; then re-run P10 Mode B |
| **Proof of problem** | `Test-Path D:\OandO07072026\results` → False; `10-handover` FAIL-honest pack |
```

- [ ] **Step 2: Commit**

```powershell
git add Failures.md
git commit -m "docs(failures): P10 evidence tree missing blocker"
```

---

### Task 10 — Self-audit against RESULTS-MAP forbidden claims

- [ ] **Step 1: Run claim matrix self-check**

For each row, confirm pack does **not** assert PASS without folder:

| Claim | Required folder |
|-------|-----------------|
| Journey works | `02-browser-open3d-journey/` |
| Select/delete works | `03-select-delete/` |
| 3D works | `04-orbit-continuity/` |
| Symbols OK | `05-symbols-svg/` |
| Save works | `06-save-honesty/` |
| Mesh OK | `08-mesh-quality/` |
| Shortcuts OK | `09-shortcuts-chrome/` |
| Wave complete | `10-handover/` + MASTER + E: + all W |
| Engine locked | `01-engine-lock/` |
| Product truth inventoried | `00-product-truth/` |

- [ ] **Step 2: Grep pack for research false greens**

```powershell
$h = "D:\OandO07072026\results\planner\world-standard-wave\10-handover"
Select-String -Path "$h\*.md" -Pattern "D:\\\\websites|SYNTHESIS|MASTER-CHART|Planner5D" 
# Allowed as context; illegal if adjacent to Status PASS for a W gate
```

- [ ] **Step 3: Confirm no site/ in P10 commits**

```powershell
git log -5 --name-only --oneline
# P10 commits must not list site/features or site/tests product paths
```

---

## 7. Test matrix (verification probes — not product TDD)

| ID | Layer | Command / action | Expected Mode A | Expected Mode B |
|----|-------|------------------|-----------------|-----------------|
| V0 | Tree | `Test-Path results` | May be True after pack dir create only | True with all gate folders |
| V1 | Pack | six files exist | True | True |
| V2 | HEAD | `HEAD.txt` has SHA | True | True |
| V3 | W-GATES | statuses re-read | All FAIL/MISSING or OPEN | All PASS/WAIVE |
| V4 | MASTER | MASTER-SYNC honesty | FILE MISSING or 0 ticks | Tallies match live MASTER |
| V5 | Failures | snip has open blockers | True | Open only residual |
| V6 | Backup | BACKUP-LOG Result | PASS or FAIL logged | PASS |
| V7 | B.6 | E: INDEX + README | True if backup run | True |
| V8 | Layout | `pnpm run check:layout` | Pass (layout) | Pass |
| V9 | Secrets | pack grep `.env` values | None | None |
| V10 | Scope | no site/ in P10 commits | True | True |
| V11 | Robocopy | codes | 0–7 or FAIL logged | 0–7 |
| V12 | CP-10 | marked PASS? | **No** | **Yes** only if matrix green |

### Per-gate map minimum (Mode B re-prove checklist)

| Gate | Minimum artifacts (RESULTS-MAP + phase spirit) |
|------|-----------------------------------------------|
| W0 | `00-start/NOTES.md` with approach A/B/C + date + agent |
| P01 baseline | `00-product-truth/INVENTORY.md` + `CONTRADICTIONS.md` |
| P02 engine | `01-engine-lock/NOTES.md` (+ ENGINE-DECISION link / owner checkboxes recorded) |
| W1–W2 browser | `02-browser-open3d-journey/` run.json or playwright-run.json + raw log + PNGs 01–N, no skip |
| W3 | `03-select-delete/` run.json + vitest raw + **browser** proof |
| W4 | `04-orbit-continuity/` run.json + screenshots + console excerpt |
| W2 symbols | `05-symbols-svg/` logs + PNG/prim-JSON + NOTES canvas vs publish |
| W5 | `06-save-honesty/save-reload/` or parent with hard-reload ids |
| W6 | `06-save-honesty/` label NOTES + tests/logs |
| W7 | `08-mesh-quality/` NOTES + screenshots toe/door/carcass |
| W8 | `09-shortcuts-chrome/` run.json + keyboard logs |
| Pack | six files under `10-handover/` |

### Canonical run.json fields (for phases that produce them — P10 consumes)

```json
{
  "phase": "P0X",
  "gate": ["W3"],
  "evidenceRoot": "results/planner/world-standard-wave/03-select-delete",
  "cwd": "D:\\OandO07072026\\site",
  "command": "exact command line",
  "exitCode": 0,
  "startedAt": "ISO-8601",
  "endedAt": "ISO-8601",
  "gitHead": "sha",
  "notes": "wait strategy / selectors / flakes"
}
```

P10 does **not** invent run.json for missing gates.

---

## 8. False-green catalog

| # | Trap | How this plan blocks it |
|---|------|-------------------------|
| FG1 | SYNTHESIS → W PASS | W-GATES only wave paths; Task 10 grep |
| FG2 | Empty folder GREEN | Probe lists files; empty = FAIL |
| FG3 | Unit-only W3 | Map minimum requires browser proof |
| FG4 | Seed absolute furniture counts as W1 | Owning phase rule; pack notes if only seed |
| FG5 | Orbit default prop only | Expert three-layer; pack requires screenshots + notes |
| FG6 | “Saved” = cloud | W6 NOTES required |
| FG7 | Modular place unit = mesh bar | W7 NOTES + visual parts |
| FG8 | Keymap file exists | W8 run.json + handler match |
| FG9 | MASTER ticks without paths | Task 02 integrity fail |
| FG10 | CP-10 while results gone | Mode A forbids PASS |
| FG11 | Competitor PNG as proof | Ethics section |
| FG12 | Research E: copy as W proof | BACKUP-LOG note |
| FG13 | Global-standard module GREEN = W | Architecture § dual language |
| FG14 | Failures historical paths re-certified | FAILURES-SNIP rule |
| FG15 | Creating all wave folders empty “to look ready” | Task 01 forbids |
| FG16 | Self-WAIVE | Owner only |
| FG17 | P10 edits site to green pack | Hard out of scope |
| FG18 | Firecrawl re-scrape as substitute | Dead; forbidden |
| FG19 | trustdata path theater | Live Plans/ paths |
| FG20 | push claimed without ask | Task 04 record |

---

## 9. Stop-if-fail / CP criteria

### 9.1 Stop-if-fail

| Failure | Action |
|---------|--------|
| W1–W8 primary missing/red | Reopen owning phase; CP-10 fail; **no site/** |
| MASTER green without paths | Revert ticks; integrity fail |
| E: unavailable | Failures.md; backup criterion fail; keep D: pack |
| Worktree used | Stop; Failures.md |
| Push without ask | Stop; record |
| Secrets in pack | Scrub; re-commit; exclude from E: |
| Artifacts only under retired names | Rehome or NOTES pointer; else fail |
| Agent invents WAIVE | Reject |

### 9.2 Mode B CP-10 pass criteria (all required)

1. `10-handover/` six files complete  
2. MASTER-SYNC tallies match live MASTER (94 or documented structure)  
3. Every W0–W8 primary has map minimum **or** owner WAIVE  
4. E: backup logged PASS with B.6  
5. Local commits for landable slices  
6. Push status recorded  
7. CP-00–CP-09 PASS/WAIVE before CP-10  
8. CP-10 marked with date + path  
9. No product code attributed to P10  

### 9.3 Mode A landable criteria (honest partial)

1. Six files exist  
2. W-GATES all non-PASS (or honest OPEN for pack only)  
3. MASTER-SYNC explains missing MASTER / zero ticks  
4. FAILURES-SNIP lists evidence tree missing  
5. README states **not CP-10 PASS**  
6. Commit landable  
7. Optional backup of Plans + thin wave  

---

## 10. Commit sequence

| Order | Message | Paths |
|------:|---------|-------|
| 1 | `trustdata(P10): evidence pack 10-handover` | six pack files (BACKUP may stub) |
| 2 | `trustdata(P10): MASTER checklist sync W0-W8` | MASTER-SYNC (+ MASTER if restored) |
| 3 | `docs(failures): P10 evidence tree missing blocker` | Failures.md if needed |
| 4 | `trustdata(P10): backup log + CP-10 notes` | BACKUP-LOG |
| 5 | `trustdata(P10): FAIL-honest handover pack (not CP-10 PASS)` **or** `… handover complete CP-10` | README final + HEAD refresh |
| 6 optional | `docs(Plans): restore MASTER/CHECKPOINTS for P10 Mode B` | restored process files |

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation | Owner decision? |
|------|----------|------------|-----------------|
| Permanent loss of historical results | High | E:/git recover; else rebuild P01–P09 | Prefer recover vs rebuild |
| MASTER/CHECKPOINTS never restored | High | Mode A forever; no theatrical PASS | Reinstate process files? |
| E: full / unmounted | Med | Fail backup criterion only | Alternate backup path? |
| Path drift confuses agents | Med | This plan live-path table | Optional execute-card path fix PR |
| Pressure to “just mark CP-10” | High | Gate≠product; stop-if-fail | Refuse paper PASS |
| Mixing global-standard-revision tree | Med | Dual language in §0 | Keep trees separate |
| Multi-account git push 404 | Med | Failures.md mirror note | Account switch |
| Scope creep into site/ | High | S1 hard stop | None — refuse |

---

## 12. Self-review vs brainstormer + repo

| Check | Result |
|-------|--------|
| Repo coverage: RESULTS-MAP folders | §1.6 + Task 01 probes |
| Repo coverage: P10 six files | Task 01 |
| Repo coverage: results missing | §0.2 + Mode A |
| Repo coverage: trustdata removed | §1.3 |
| Brainstormer: research ≠ evidence | §3 + FG1 |
| Brainstormer: gate ≠ product | §0.3 + README non-claims |
| Brainstormer: no site/ | §4.3 + FG17 |
| Brainstormer: FAIL-honest allowed | Mode A |
| Brainstormer: recovery playbook | Task 07–08 |
| Brainstormer: kill order | §1.8 |
| Placeholder scan | Full file bodies; no TBD steps |
| Length honesty | Extensive pack plan; product TDD N/A by design |

**WAIVE from brainstormer:** none material — all major bars mapped to tasks.

**Repo wins conflicts:** execute card `Plans/trustdata` paths → live `Plans/`; missing MASTER → cannot Task 02 tick.

---

## 13. Execution handoff

**Plan complete and saved to `plans1/P10-evidence-handover/IMPLEMENTATION-PLAN.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
   - Brief starts with `/using-superpowers` + verification-before-completion  
   - Default first landable: **Mode A FAIL-honest pack** (Tasks 00–06 A path + Task 09)  
   - Do not open P03–P09 product work under this plan  

2. **Inline Execution** — superpowers:executing-plans  

**Which approach?** Owner/head chooses.  

**If goal is CP-10 PASS:** reject until Pack-B or Pack-C evidence exists; then Mode B tasks.

---

## Appendix A — Full RESULTS-MAP create script (do not use for empty theater)

Only when **executing owning phases** that will immediately write artifacts:

```powershell
$root = "D:\OandO07072026\results\planner\world-standard-wave"
@(
  "00-start",
  "00-product-truth",
  "01-engine-lock",
  "02-browser-open3d-journey",
  "03-select-delete",
  "04-orbit-continuity",
  "05-symbols-svg",
  "06-save-honesty",
  "06-save-honesty\save-reload",
  "08-mesh-quality",
  "09-shortcuts-chrome",
  "10-handover"
) | ForEach-Object { New-Item -ItemType Directory -Force -Path (Join-Path $root $_) | Out-Null }
```

P10 alone: create **`10-handover` only** unless recovering full tree.

---

## Appendix B — W1–W8 product definitions (design authority — not P10 implement)

| ID | Gate | Proof type |
|----|------|------------|
| W1 | Draw walls + door/opening | Playwright + screenshots |
| W2 | Place ≥2 incl cabinet-v0; Block2D readable | Playwright + PNG |
| W3 | Select + Delete/Backspace + undo | Unit + Playwright |
| W4 | 2D↔3D pose; orbit ON | Playwright + console clean |
| W5 | Save → hard reload → same ids | Playwright + flush wait |
| W6 | Local vs cloud labels honest | Code + UI copy + test |
| W7 | Mesh toe/door/carcass readable | Visual + NOTES |
| W8 | Tool labels match handlers | Unit + keyboard |

North star: facilities buyer layouts office with real O&O-scale furniture, 2D↔3D orbit, select/edit/delete, save and return, dimensions trustable enough to quote later.

---

## Appendix C — Expert must-fix P10 does **not** implement

From `Plans/phases/EXPERT-PASS.md` — missing evidence reopens **P02–P09**:

1. W3 pure delete + single history + browser under `03-*`  
2. Fabric furniture flag OFF for W3/W2 proof  
3. W4 orbit three-layer  
4. Furniture rotation stays **degrees** in document  
5. Stay imperative Three mid-gate  
6. W5–W6 flush + honest labels  
7. Serial journey deltas (never seed absolute counts as pass)  
8. Canonical folders only; no silent skip  
9. P05 Block2D canvas authority  
10. P08 mesh toe→carcass→door  
11. P09 map = handlers; no Dimension→D rebind  
12. P02 package pin / Fancyapps / GSAP license row  

---

## Appendix D — Research translation (ideas only → never pack PASS)

| Industry pattern | O&O translation | Evidence when proven |
|------------------|-----------------|----------------------|
| Structure then decorate | Walls first, inventory second | P07 W1 then W2 |
| Instant 2D↔3D | Same UUIDs + orbit | P04 W4 |
| Select + delete grammar | Hit-test + Del + undo | P03 W3 |
| Save that returns | IDB flush + honest labels | P06 W5–W6 |
| Manufacturer SKU depth | O&O SKUs + mesh bar | P05/P08 |
| Keyboard discoverability | **Our** map = handlers | P09 W8 |

O&O research self-score ~1.9–2.0 (2026-07-09) = spine not ship — re-inventory in P01.

---

## Appendix E — Historical sibling evidence (may be gone; P01 cite only)

Under parent `results/planner/` when present: `p0-1-admin-svg-publish/`, `p0-2-*`, `svg-authority*`, `save-reload-continuity/`, `fabric-stage-slice/`, `document-view-continuity/`, `modular-*`, `a11y-open3d/`, `hard-path/`, `harden-wave/`, `verify-wave/`, `wave-superpowers/`, etc.

**Do not** treat as W1–W8 alone. Index: `Plans/Research/Others/08-EVIDENCE-INDEX.md`.

---

## Appendix F — Skills / handbooks

| Skill / handbook | Use |
|------------------|-----|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before any done claim |
| `Agents/Agents-docs.md` | Doc honesty |
| `Agents/Agents-failure.md` | Failures.md |
| `testing-handbook.md` | Zero suppression of captured logs |
| `Agents/Agents-ELON-STANDARD.md` | Bar floor; evidence root |
| writing-plans-repo-brainstorm | This plan’s production skill |

---

## Appendix G — Absolute path cheat sheet

| Role | Path |
|------|------|
| This plan | `D:\OandO07072026\plans1/P10-evidence-handover\IMPLEMENTATION-PLAN.md` |
| Brainstormer | `D:\OandO07072026\Idiots2\P10-evidence-handover\REPORT.md` |
| Execute card | `D:\OandO07072026\Plans\phases\P10-evidence-handover\P10-evidence-handover.md` |
| RESULTS-MAP | `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` |
| RESEARCH-MAP | `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` |
| Design | `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` |
| Wave root | `D:\OandO07072026\results\planner\world-standard-wave\` |
| Pack | `D:\OandO07072026\results\planner\world-standard-wave\10-handover\` |
| E: pattern | `E:\OandO-backups\trustdata-YYYY-MM-DD\` |
| Research home | `D:\websites\` |
| SYNTHESIS | `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` |

---

## Appendix H — One-page operator card

1. Research first for orientation — **never** green.  
2. RESULTS-MAP = only legal evidence folder names.  
3. P10 = pack + MASTER honesty + E: backup. **No `site/`.**  
4. Live truth at plan write: `results/` **gone** → Mode A or rebuild.  
5. `Plans/trustdata` removed; CHECKPOINTS/MASTER missing — restore before Mode B.  
6. Kill order rebuild before theatrical CP-10.  
7. Approach A product journey first; Fabric after W green.  
8. Gate ≠ product.  
9. Default landable: FAIL-honest six-file pack + Failures.md.  
10. Done for **this planner task** = this IMPLEMENTATION-PLAN exists — **not** CP-10 PASS.

---

*End of idiotplanners P10 IMPLEMENTATION-PLAN. Pack-only. No site features. No length cap exercised via full probes, templates, matrices, recovery, and false-green catalog.*
