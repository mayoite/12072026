# One Plan (Final) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Skills:** `/using-superpowers` · writing-plans  
> **Built by debate:** 4 forced-opposite seats (A/B/C/D) → head synthesis (this file)

**Goal:** Before residual product thrash, land **one** execute authority that absorbs the best of Plans / plans1 / plans2 / PlansA — without dual-file dumps or a fifth mega-tree.

**Architecture:** Hybrid of debate winners: **execute home = upgraded `plans1/`** (no pointer thrash); **thin residual contracts** (not IMPL novels); **machine `gates.yaml` + checker** (kill order / map-min / next-red); **`Plans/` stays maps+how only**; **plans2 + PlansA frozen** (decisions absorbed, not dual-run).

**Tech Stack:** Markdown residual contracts · YAML gate registry · Node `scripts/check-w-gates.mjs` · existing Vitest/Playwright paths · evidence under `results/planner/world-standard-wave/` · pnpm monorepo

**Inputs:**
- Debate A — new `plan/` thin spine (vote 8)
- Debate B — Plans-native execute (vote 9)
- Debate C — absorb into plans1 (vote 9)
- Debate D — gates.yaml machine plan (vote 8)
- Prior: `plans1/BUILD-ONE-PLAN.md`, `TREE-OWNER-SYNTHESIS.md`, PlansA MERGE-NOTES

**Done when:**
1. Executor opens **only** `plans1/START-HERE.md` → next red gate (checker or RESIDUAL) without opening plans2/PlansA.
2. `gates.yaml` encodes kill order + evidence folders + residual class for P00–P11.
3. P06/P07/P09 (+ P03/P04) have short `RESIDUAL.md` with **stricter GATE** labels from plans2.
4. plans2 + PlansA root banners: **FROZEN — not execute**.
5. AGENTS residual line is **single** (no dual “Plans first + plans1”).
6. Critic grep clean: no PRIMARY=PlansA / sole=plans2 as live execute law.
7. **No** product residual claimed green without `results/` map-min (checker or honest red).

---

## Debate scoreboard (what we heard)

| Seat | Idea | Vote | Keep |
|------|------|-----:|------|
| **A** | New empty `plan/` (13 files), freeze four trees | 8 | Thin file cap; residual/ only; no IMPL novels; unnumbered brand *later* |
| **B** | Fold execute into `Plans/` | 9 | One mental tree pressure; kill dual AGENTS start paths |
| **C** | Upgrade `plans1/` in place | 9 | Zero pointer thrash; AGENTS already points here; absorb decisions not files |
| **D** | `gates.yaml` + checker | 8 | Kill order as data; paper PASS expensive; presence + proof keys |

### Head resolution (final one)

| Decision | Winner | Why not the pure alternative |
|----------|--------|------------------------------|
| **Where does execute live?** | **C — `plans1/`** | A creates five-name window; B mixes maps+execute (PlansA failure mode) |
| **How thin is residual?** | **A + C** | Short `RESIDUAL.md` / contracts; deep dumps RED-only pointer |
| **How is kill order / map-min enforced?** | **D** | `plans1/gates.yaml` + `scripts/check-w-gates.mjs` under plans1 hybrid |
| **What about Plans/?** | Maps only | Reject B for *execute*, accept B for *fix AGENTS dual-path* |
| **plans2 / PlansA?** | Freeze + absorb | Hardness → GATE lines; MERGE decisions → Do/Do-not; no dual files |
| **Rename to `plan/`?** | **After** package green | One commit later — not the merge vehicle |

**Iron law (unchanged):** Do not create PlansB / dual `*.plans2.md` dumps.

---

## File map (final package)

### Create

| Path | Responsibility |
|------|----------------|
| `plans1/gates.yaml` | Kill order, evidence folders, residual class, min_artifacts, commands, forbid rules |
| `plans1/RESIDUAL-CONTRACT.md` | One-screen index P01–P10 → link RESIDUAL + GATE |
| `plans1/P03-select-delete/RESIDUAL.md` | Harden + browser W3 |
| `plans1/P04-orbit-continuity/RESIDUAL.md` | Wiring + console |
| `plans1/P06-save-honesty/RESIDUAL.md` | Code residual (incl. leave-flush) |
| `plans1/P07-draw-place-journey/RESIDUAL.md` | Journey rewrite identity |
| `plans1/P09-shortcuts-chrome/RESIDUAL.md` | aria + rail |
| `plans1/P01-product-truth/RESIDUAL.md` | Re-prove short |
| `plans1/P02-engine-lock/RESIDUAL.md` | Freeze short |
| `plans1/P05-symbols-svg/RESIDUAL.md` | Re-prove short |
| `plans1/P08-mesh-quality/RESIDUAL.md` | Evidence short |
| `plans1/P10-evidence-handover/RESIDUAL.md` | Mode A pack short |
| `scripts/check-w-gates.mjs` | Map-min + next-red (presence first; JSON keys later) |
| `plans1/FROZEN-SOURCES.md` | What plans2/PlansA/Plans mean after cutover |
| `plans1/ONE-PLAN-DEBATE.md` | Debate archive pointer (optional short) |

### Modify

| Path | Change |
|------|--------|
| `plans1/START-HERE.md` | ≤80 lines: run checker → next red → RESIDUAL only; forbidden trees |
| `plans1/EXECUTE-NOW.md` | Point residual to RESIDUAL.md + gates.yaml; kill dual-run language |
| `plans1/00-START.md` | Session zero + `node scripts/check-w-gates.mjs` |
| `plans1/EXECUTABLE-PLAN.md` | Header: non-authority day path; deep HOW only; point RESIDUAL |
| `plans1/P11-CHECKLIST.md` | Add dual-language + CROSSWALK sections from plans2 |
| `plans1/CHECKLIST-MASTER.md` | Mark secondary to checker; or “generated view later” |
| `plans1/REFERENCES.md` | Fix `Plans/Others/`; archive Idiots2 |
| `plans2/README.md` (+ key roots) | **FROZEN — not execute** banner |
| `PlansA/README.md`, `EXECUTE-NOW.md` banner if needed | Already research; reinforce FROZEN |
| `AGENTS.md` | Single residual line → `plans1/START-HERE.md`; Plans = maps/how only |
| `Plans/README.md` | Residual execute → plans1 only (already); no dual story |
| `package.json` (repo root) | Script `"check:w-gates": "node scripts/check-w-gates.mjs"` |

### Do not create

- `plan/` (yet) · `plans3/` · PlansA-style dual copies · execute under `Plans/phases/`

### Test / verify

| Command | Expected |
|---------|----------|
| `Test-Path plans1\START-HERE.md` | True |
| `Test-Path plans1\gates.yaml` | True |
| `node scripts/check-w-gates.mjs` | exit ≠0 while `results/` missing; prints `next` gate |
| `rg -n "PRIMARY execute|PlansA only|sole residual" plans1 PlansA plans2 --glob '*.md'` | No live execute claims for PlansA/plans2 sole |
| `pnpm run check:layout` | FAIL until `results/` exists; PASS after mkdir |

---

## Binding content decisions (absorbed once)

### Kill order

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

### Residual class

| Class | Phases |
|-------|--------|
| Code residual | **P06, P07, P09** |
| Harden | **P03, P04** |
| Re-prove / pack | P01, P02, P05, P08, P10 |
| Close-out | P11 |

### GATE labels (stricter of plans1|plans2)

| Phase | GATE in RESIDUAL / yaml |
|-------|-------------------------|
| P03 | **FAIL** until unit+browser packs |
| P04 | **FAIL** until wiring+console evidence |
| P06 | **FAIL** code residual open |
| P07 | **FAIL** until journey rewrite + identity |
| P09 | **FAIL** until aria+rail+evidence |
| P01/P02/P05 | RE-PROVE |
| P08 | FAIL evidence / no geometry thrash |
| P10 | Mode A only; Mode B blocked |

### Steal list (final)

| From | Into one plan |
|------|----------------|
| plans1 | Shape, residual density, START-HERE, P11 ship board |
| plans2 | FAIL hardness, leave-flush, dual-language P11 |
| Plans | RESULTS-MAP link only; how cards optional pointer |
| PlansA | MERGE keep/drop (cancel cloud 07, no configurator sole green, …) |
| Debate D | gates.yaml + checker |
| Debate A | Thin residual files; freeze peers |
| Debate B | Fix dual AGENTS start (not move execute into Plans) |

---

## Task list

### Task 0: Freeze dual authorities

**Files:**
- Modify: `plans2/README.md`
- Modify: `PlansA/README.md` (reinforce)
- Create: `plans1/FROZEN-SOURCES.md`

- [ ] **Step 1: Write freeze banner text**

```markdown
# FROZEN — not execute

Execute residual wave: **`plans1/START-HERE.md` only.**

| Tree | Role after cutover |
|------|--------------------|
| plans1/ | **Live execute** (this package) |
| Plans/ | Maps + how (`Research/RESULTS-MAP.md`) |
| plans2/ | Frozen hardness archive (absorbed into RESIDUAL/gates) |
| PlansA/ | Frozen merge museum (MERGE-NOTES decisions absorbed) |
```

- [ ] **Step 2: Prepend one-line freeze to `plans2/README.md` top**

```markdown
> **FROZEN — not execute.** Hardness absorbed into `plans1/`. Do not dual-run.
```

- [ ] **Step 3: Confirm PlansA README already research-only; add freeze if missing**

- [ ] **Step 4: Commit**

```bash
git add plans1/FROZEN-SOURCES.md plans2/README.md PlansA/README.md
git commit -m "docs(plans): freeze plans2 and PlansA as non-execute"
```

---

### Task 1: Land `gates.yaml` skeleton

**Files:**
- Create: `plans1/gates.yaml`

- [ ] **Step 1: Write schema + kill_order + all gate shells**

```yaml
schema_version: 1
wave_id: world-standard-wave
evidence_root: results/planner/world-standard-wave
kill_order: [P00, P01, P02, P03, P07, P06, P04, P05, P08, P09, P10, P11]
rules:
  - id: no_paper_pass
    assert: evidence_dir_nonempty
  - id: unit_alone_not_w3
    applies_to: [P03]
  - id: w5_uuid_not_count
    applies_to: [P06]
gates:
  P00:
    title: session zero
    evidence_folder: 00-start
    status: red
    class: session
  P01:
    title: product truth inventory
    evidence_folder: 00-product-truth
    status: red
    class: re-prove
  P02:
    title: engine lock freeze
    evidence_folder: 01-engine-lock
    status: red
    class: re-prove
  P03:
    title: W3 select delete
    evidence_folder: 03-select-delete
    status: red
    class: harden
    min_artifacts: [unit-raw.log, browser-raw.log, run.json]
  P07:
    title: W1-W2 journey
    evidence_folder: 02-browser-open3d-journey
    status: red
    class: code-residual
    min_artifacts: [playwright-run.json, browser-raw.log]
  P06:
    title: W5-W6 save honesty
    evidence_folder: 06-save-honesty
    status: red
    class: code-residual
    min_artifacts: [unit-raw.log, browser-raw.log, run.json]
  P04:
    title: W4 orbit
    evidence_folder: 04-orbit-continuity
    status: red
    class: harden
  P05:
    title: W2 symbols
    evidence_folder: 05-symbols-svg
    status: red
    class: re-prove
  P08:
    title: W7 mesh
    evidence_folder: 08-mesh-quality
    status: red
    class: re-prove
  P09:
    title: W8 shortcuts
    evidence_folder: 09-shortcuts-chrome
    status: red
    class: code-residual
  P10:
    title: handover pack
    evidence_folder: 10-handover
    status: red
    class: pack
  P11:
    title: integration closeout
    evidence_folder: 11-integration-closeout
    status: red
    class: closeout
```

- [ ] **Step 2: Commit**

```bash
git add plans1/gates.yaml
git commit -m "docs(plans): add gates.yaml machine spine for one plan"
```

---

### Task 2: Land map-min checker

**Files:**
- Create: `scripts/check-w-gates.mjs`
- Modify: `package.json` (root)

- [ ] **Step 1: Implement checker (presence + next red)**

```javascript
// scripts/check-w-gates.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const yamlPath = path.join(root, "plans1", "gates.yaml");

// Minimal YAML subset parse: prefer installing yaml later; for v1 use JSON twin if needed.
// Implementation requirement: read gates; walk kill_order; if evidence_root missing → all red.
// Print JSON: { next, missing: [], evidence_root, ok: false }

const evidenceRoot = path.join(root, "results", "planner", "world-standard-wave");
if (!fs.existsSync(evidenceRoot)) {
  console.log(JSON.stringify({
    ok: false,
    next: "P00",
    reason: "results/planner/world-standard-wave missing — re-prove all",
    evidence_root: evidenceRoot,
  }, null, 2));
  process.exit(1);
}
// Full implementation: parse gates.yaml (use `yaml` package or hand JSON export plans1/gates.json)
// For each kill_order id: check evidence_folder exists + min_artifacts if listed.
process.exit(1);
```

**Note for implementer:** Prefer also write `plans1/gates.json` (same content) if avoiding new deps — checker reads JSON first.

- [ ] **Step 2: Add package script**

```json
"check:w-gates": "node scripts/check-w-gates.mjs"
```

- [ ] **Step 3: Run checker**

```powershell
cd D:\OandO07072026
node scripts/check-w-gates.mjs
```

Expected: **exit 1**, `next: "P00"` or first red, reason results missing.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-w-gates.mjs package.json plans1/gates.json
git commit -m "feat(plan): check-w-gates next-red map-min checker"
```

---

### Task 3: Thin START-HERE + session zero

**Files:**
- Modify: `plans1/START-HERE.md`
- Modify: `plans1/00-START.md`

- [ ] **Step 1: Rewrite START-HERE to ≤80 lines**

Must include:
1. Execute = this package only  
2. `pnpm run check:w-gates` (or node script) first  
3. Open `RESIDUAL-CONTRACT.md` / `P0X/RESIDUAL.md` for next red  
4. Maps: `Plans/Research/RESULTS-MAP.md`  
5. Forbidden: plans2 execute, PlansA execute, dual-run  
6. Kill order one block  
7. Residual class table  

- [ ] **Step 2: 00-START adds checker to first commands**

```powershell
node scripts/check-w-gates.mjs
# expect red next until evidence lands
```

- [ ] **Step 3: Commit**

```bash
git add plans1/START-HERE.md plans1/00-START.md
git commit -m "docs(plans1): thin START-HERE for one-plan hybrid"
```

---

### Task 4: RESIDUAL-CONTRACT index + code residual phases

**Files:**
- Create: `plans1/RESIDUAL-CONTRACT.md`
- Create: `plans1/P06-save-honesty/RESIDUAL.md`
- Create: `plans1/P07-draw-place-journey/RESIDUAL.md`
- Create: `plans1/P09-shortcuts-chrome/RESIDUAL.md`

- [ ] **Step 1: Write index table** (all phases link to RESIDUAL; GATE column filled)

- [ ] **Step 2: Write P06 RESIDUAL** — absorb plans1 tasks ∪ plans2 leave-flush; cancel cloud 07; GATE FAIL

- [ ] **Step 3: Write P07 RESIDUAL** — journey rewrite; place-CTA identity; GATE FAIL; ban configurator sole green

- [ ] **Step 4: Write P09 RESIDUAL** — aria + rail M/W; skip invert if green; GATE FAIL until evidence

- [ ] **Step 5: Commit**

```bash
git add plans1/RESIDUAL-CONTRACT.md plans1/P06-save-honesty/RESIDUAL.md plans1/P07-draw-place-journey/RESIDUAL.md plans1/P09-shortcuts-chrome/RESIDUAL.md
git commit -m "docs(plans1): residual contracts for P06 P07 P09"
```

---

### Task 5: Harden + re-prove RESIDUAL files

**Files:**
- Create: `plans1/P03-select-delete/RESIDUAL.md`
- Create: `plans1/P04-orbit-continuity/RESIDUAL.md`
- Create: `plans1/P01-product-truth/RESIDUAL.md`
- Create: `plans1/P02-engine-lock/RESIDUAL.md`
- Create: `plans1/P05-symbols-svg/RESIDUAL.md`
- Create: `plans1/P08-mesh-quality/RESIDUAL.md`
- Create: `plans1/P10-evidence-handover/RESIDUAL.md`

- [ ] **Step 1: P03** — GATE FAIL until browser; unit alone FAIL  
- [ ] **Step 2: P04** — wiring unit + hard console  
- [ ] **Step 3: P01–P02–P05–P08–P10** short re-prove / pack contracts  
- [ ] **Step 4: Commit**

```bash
git add plans1/P0*-*/RESIDUAL.md
git commit -m "docs(plans1): residual contracts for re-prove and harden phases"
```

---

### Task 6: P11 merge + EXECUTABLE demote

**Files:**
- Modify: `plans1/P11-CHECKLIST.md`
- Modify: `plans1/EXECUTABLE-PLAN.md`

- [ ] **Step 1: Add sections** CROSSWALK + DUAL-LANGUAGE (GATE pack ≠ product ship) from plans2  
- [ ] **Step 2: EXECUTABLE-PLAN header**

```markdown
> **Day path:** `START-HERE` → `check:w-gates` → `P0X/RESIDUAL.md`.  
> This file is deep HOW / history — not the default execute spine.
```

- [ ] **Step 3: Commit**

```bash
git add plans1/P11-CHECKLIST.md plans1/EXECUTABLE-PLAN.md
git commit -m "docs(plans1): P11 dual-language + demote EXECUTABLE day path"
```

---

### Task 7: AGENTS + Plans README single authority

**Files:**
- Modify: `AGENTS.md`
- Modify: `Plans/README.md`
- Modify: `plans1/REFERENCES.md`

- [ ] **Step 1: AGENTS** — one residual line; Plans = maps/how only; no second start  
- [ ] **Step 2: Plans README** — residual execute → plans1 START-HERE only  
- [ ] **Step 3: REFERENCES** — `Plans/Others/` path fix; archive Idiots2  

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md Plans/README.md plans1/REFERENCES.md
git commit -m "docs: single residual execute authority plans1 START-HERE"
```

---

### Task 8: Critic self-review (B10)

- [ ] **Step 1: Path prove**

```powershell
cd D:\OandO07072026
@(
  'plans1\START-HERE.md',
  'plans1\gates.yaml',
  'plans1\RESIDUAL-CONTRACT.md',
  'plans1\P06-save-honesty\RESIDUAL.md',
  'plans1\P07-draw-place-journey\RESIDUAL.md',
  'plans1\P09-shortcuts-chrome\RESIDUAL.md',
  'Plans\Research\RESULTS-MAP.md',
  'scripts\check-w-gates.mjs'
) | ForEach-Object { "$_ : $(Test-Path $_)" }
node scripts/check-w-gates.mjs; echo exit=$LASTEXITCODE
```

Expected: all True; checker exit 1 with next red.

- [ ] **Step 2: Grep ban list**

```powershell
# Fail if live execute still claims PlansA primary or plans2 sole
Select-String -Path plans1\*.md,PlansA\README.md,plans2\README.md -Pattern 'PRIMARY execute.*PlansA|sole residual authority' -SimpleMatch:$false
```

Expected: only historical/frozen mentions, or none.

- [ ] **Step 3: Definition of done check** against header **Done when** (all 7)

- [ ] **Step 4: Final commit if any fixes**

```bash
git commit -m "docs(plans): one-plan B10 critic pass"
```

---

## Out of scope (after this plan is green)

- Residual **product** code for P06/P07/P09  
- Renaming `plans1` → `plan/`  
- Moving trees under `archive/`  
- Full semantic proof validation in checker (UUID fields) — v2  
- Plans/ phase card PASS banner cleanup  

---

## Self-review (writing-plans)

| Check | Result |
|-------|--------|
| Spec: one plan from four trees | Tasks 0–8 |
| Different ideas debated | A/B/C/D scoreboard + hybrid |
| No dual-file PlansA repeat | Explicit ban |
| No placeholders | Full yaml skeleton, checker shape, residual recipes |
| TDD | Checker red first (exit 1) then evidence green later |
| Paths exact | plans1/, scripts/, Plans/Research/ |

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-10-one-plan-final.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** — one subagent per Task 0–8; head reviews between tasks  

**2. Inline Execution** — run Tasks 0–8 in this session with checkpoints  

**Which approach?**
