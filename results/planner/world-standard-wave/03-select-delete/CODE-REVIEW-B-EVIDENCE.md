# CODE-REVIEW B — Evidence pack + false-green audit (P03 / W3)

**Date:** 2026-07-10  
**Seat:** Code-review B (evidence + claims only; no product rewrite)  
**Checkout:** `D:\OandO07072026` only (no worktrees)  
**Skills:** `/using-superpowers` + receiving-code-review rigor (verify claims; no performative agree)  
**Canonical pack:** `results/planner/world-standard-wave/03-select-delete/`  
**Plan review:** `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`  
**Tip at this audit:** `c657a59eba2b739bcfe9d9e5f1e169945ab07cd7`  
**HEAD.txt on disk:** `cd3b7cdcbb244f140ba5c2564fe9af7b5d8c9b3d` (**≠ tip**)  
**run.json HEAD:** `7ef5754da121b8052ccdd0455bf2700f81b7073c` (**≠ tip**, ≠ HEAD.txt)

---

## Verdict: PASS claim allowed?

# **NO**

W3 / CP-03 **PASS may not be sold** for the current tip from this evidence pack as deposited.

Not because unit/browser artifacts are empty — they are not. Because the pack is **internally contradictory**, **HEAD-pin theater** has outrun co-prove, and several “green” claims are **stale, dual-status, or non-proof junk**.

---

## Executive summary

| Surface | On disk | Honest read |
|---------|---------|-------------|
| Unit pack logs | 4 files / **62 passed** (`unit-w3-pack.log`, Start 18:55:22) | **Real green unit half** (at deposit time) |
| Browser raw log | UTF-16 `browser-w3-raw.log` → **1 passed (2.5s)** | **Real green Playwright body** after Mode B helper |
| PNGs 01–04 | Present; eyes: 4 furniture → 3 after delete | **Real planner UI**, not empty stubs |
| `run.json` | `"status": "pass"` | **Optimistic / partial seat** (browser-only; unit not re-run) |
| `NOTES.md` / `PROOF-INDEX.md` | **`status: open`**, browser exit **1** | **Stale RED narrative** frozen pre Mode-B green |
| `CP-03-SCORECARD.md` / `PHASE-SUMMARY.md` / `W3-ACCEPTANCE.md` | Overall **PASS** | **Claim ahead of pack coherence** |
| `HEAD.txt` vs tip | **Drift** + self-pin commit churn | **Pin ≠ re-prove** |
| `chrome/_cdm/` | ~378 files / ~17MB `chrome-devtools-mcp` tree | **Junk — not browser proof** |
| Plan CODE-REVIEW-REPORT | **8/10** APPROVE-WITH-FIXES | **Plan quality only** — not product done |

**Binding law (unchanged):** unit alone ≠ W3. Browser alone ≠ W3. Dual green artifacts without **one coherent status + same HEAD co-prove** ≠ sellable PASS.

---

## 1. Conflicting status (pass vs open) — which is honest for tip?

### What conflicts

| Artifact | Status string | Browser claim | HEAD pin |
|----------|---------------|---------------|----------|
| `run.json` | **`pass`** | exit **0**, 1/1 | `7ef5754d…` |
| `NOTES.md` | **`open`** | live exit **1** | Agent 9 `ded7da28…` era |
| `PROOF-INDEX.md` | **`open`** | browser log exit **1** | “unit alone ≠ W3” |
| `W3-ACCEPTANCE.md` | **PASS** | exit 0 | `7ef5754d…` / note also cites `dada98ee` |
| `CP-03-SCORECARD.md` | **PASS** | Y | browser pin **`aea4e76c…`** |
| `PHASE-SUMMARY.md` | **UNITS DONE · BROWSER W3 PASS** | PASS | mixed |
| `CP-03-LIVE-REVIEW.md` | **PASS** | real dual evidence | tip then `bf212a9a…`; admits meta drift |
| `HEAD.txt` | (pin only) | — | `cd3b7cdc…` |
| **git tip** | — | — | `c657a59e…` |

### History (git, condensed)

1. Agent 9 deposited pack with **`status: open`**, browser exit **1** (Select under Navigation tools; Drawing-tools scope miss). Honest.
2. Mode B helper land (`plannerToolButton` / Navigation tools). Browser re-prove overwrote `run.json` → **`pass`**, `browser-w3-raw.log` → **1 passed (2.5s)**.
3. **NOTES.md + PROOF-INDEX.md never rewritten** after green (timestamps frozen ~6:59 PM; browser log ~7:04 PM).
4. Scorecard / PHASE-SUMMARY / LIVE-REVIEW claim **PASS** on **older pins** (`aea4e76c`, intermediate tips) while concurrent agents keep issuing `trustdata(P03): … HEAD … pin` commits without full unit+browser co-prove.

### Honest status for **current tip**

**`open`** (not pass, not fail).

Reasons:

1. **Pack authority is split.** Half the pack says pass; half still says open/RED. A sellable PASS requires one coherent meta surface.
2. **HEAD pins do not match tip.** `run.json` / `HEAD.txt` / tip are three different SHAs. Self-pin commits ≠ re-run gates.
3. **`run.json.unitPack` is browser-seat only** — does not claim unit re-prove on the browser tip. W3 = unit **and** browser on **same** tip.
4. Fail history was real; green after Mode B is also real on disk — but **tip has advanced past both deposits** via pin theater and other work.

**Do not use residual Agent-9 RED as “browser still red.”** The raw log body is green.  
**Do not use `run.json: pass` as tip authority.** Pin drift + dual-status kill that claim.

---

## 2. `chrome/` folder junk — fake chrome proof?

### Inventory (audit)

| Path | What it is | Proof value |
|------|------------|-------------|
| `chrome/_cdm/node_modules/chrome-devtools-mcp/**` | Vendored MCP package (~17MB, hundreds of files incl. issue-description MD dump) | **ZERO** — tool install accident, not W3 evidence |
| `chrome/_cdm/package.json` + lock | Local npm root for the dump | **ZERO** |
| `chrome/snap-setup.txt` | Accessibility snapshot of guest route | **Anti-proof** — shows **`404` / “This page could not be found.”** |
| `chrome/dev-server.log` | Small local server log | Ops residue only |

### Judgment

**Yes — junk.** If any seat cites `chrome/` as chrome-devtools W3 proof, that is a **false-green**.  

Real browser proof for this wave is:

- `browser-w3-raw.log` (Playwright list; UTF-16 on Windows — still readable as “1 passed”)
- optional `browser-w3-playwright-live.log` (untracked twin, also 1 passed)
- PNGs `01-placed.png` … `04-undone.png`
- e2e: `site/tests/e2e/open3d-w3-select-delete.spec.ts`

**Action for head:** exclude `_cdm/` from any PASS narrative; prefer delete/gitignore of accidental node_modules under `results/` (layout hygiene). Do not count snap 404 as “chrome verified guest.”

---

## 3. Playwright green vs `browser-w3-raw` fail history

### Timeline (honest)

| Stage | Exit | Symptom |
|-------|------|---------|
| Early / residual green pin `aea4e76c` | 0 | Full flow; PNGs 02–04 origin |
| Agent 9 tip re-prove | **1** | `selectPlannerTool("Select")` — Drawing tools scope; place may refresh `01-placed` only |
| Mode B helper | — | Select lives under **Navigation tools** (`Canvas tools`); Drawing = room/wall/… |
| Post-helper re-prove (deposited log) | **0** | `1 passed (2.5s)` in `browser-w3-raw.log` |
| Later live log (untracked) | **0** | `browser-w3-playwright-live.log` ~5.8s |

### Eyes on PNGs (this seat)

- **01-placed:** real open3d guest planner; status bar **4 furniture**; properties furniture panel.
- **03-deleted:** same UI; status bar **3 furniture**; properties **No Selection**.

Count path **4 → 3** is visually real. (Undo PNG not re-eyes in this seat; sizes consistent with deposit.)

### Residual (do not inflate)

- E2E asserts **furniture count only** (status bar regex), not same entity id/pose after undo.
- Id/pose bar is unit-side (`updateOpen3dProject` + poseSnapshot) — documented residual, not browser identity proof.
- Guest 404 intermittency remains real ops risk (`chrome/snap-setup.txt` 404; NOTES history).

### Judgment

Fail history is **not forged**; green after Mode B is **not forged**.  
**Lie mode A:** sell Agent-9 RED forever after green log lands.  
**Lie mode B:** sell green Playwright as tip-PASS while NOTES still says exit 1 and HEAD drifted.

---

## 4. Coverage high — fake or real branch tests?

### Claimed floor (`coverage/COVERAGE-90.md`)

| File | Stmts / Lines | Seat claim |
|------|---------------|------------|
| `workspaceEntityHelpers.ts` | 98.75 / 98.48 | PASS |
| `useWorkspaceKeyboard.ts` | 100 / 100 | PASS |
| `canvasPicking.ts` | 100 / 100 | PASS |
| `history.ts` | 100 / 100 | PASS |
| `FeasibilityCanvas.tsx` | 74.63 / 76.86 | **RESIDUAL** (honest — not forced to 90) |

Overall residual pack summary JSON: **~83% lines** across included set (dragged down by Feasibility shell) — matches “hard files ≥90, canvas residual” story.

### Spot-read (3+ suites)

#### A. `applySelectionDelete.test.ts` — **REAL**

- Product imports: pure `applySelectionDelete`, real `updateOpen3dProject` / undo.
- Asserts: same-ref no-ops (none / empty ids / locked), multi-id one past, **poseSnapshot id+position+rotation+footprint** restore after undo, wall cascade.
- **0** skip / **0** `any` in metrics pass.
- Not empty expects.

#### B. `open3dHistory.w3.test.ts` — **REAL**

- Residual history API: create, update+delete, undo restores id+position, redo, drag/dispatch paths.
- Ties delete to history without domain.test theater for % only.
- Named constants (`POS_A`, `STAMP_NOW`) — quality checklist holds.

#### C. `open3dFeasibilityCanvas.test.tsx` (select residuals) — **REAL product path**

- `select tool pointer on furniture sets furniture selection` → expects `{ type: "furniture", ids: [FURNITURE_ID] }`.
- Empty click → `{ type: "none", ids: [] }`.
- Wall / door / window / room select by id — real `setSelection` outcomes, not coverage paint.

#### D. Weak sibling (called out)

- `canvasPicking.quality.test.ts`: **1** `it`, **1** expect (`pickOpeningAtPoint` empty doors/windows → null). Harmless non-reg stub; **not** the ≥90 story. Do not cite as “coverage pack quality.”

### Judgment

**Hard-path coverage is mostly real branch tests, not empty theater.**  
Feasibility full-file &lt;90 is **honestly residual**.  
**Lie to kill:** “≥90% coverage = W3 closed” or “coverage seat re-proved browser.” Unit alone still ≠ W3.

---

## 5. Plan rating 8/10 ≠ product done

Source: `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`

| Field | Value |
|-------|--------|
| Verdict | **APPROVE-WITH-FIXES** |
| Score | **8 / 10** |
| Scope | **Plan quality** vs live product code (Mode A execute guide) |
| Explicit | CP-03 unproven when report written (`results/` absent then); unit≠W3; appendix PASS = false-green if trusted |

**CP-03-LIVE-REVIEW** correctly restates: plan can score 8/10 **without** product gate green.

### Call-out (hard)

**Plan 8/10 is not:**

- product select/delete UX done at owner bar (~9.5)
- W3/CP-03 PASS
- permission to stop re-prove
- license to ignore dual-status evidence

Any narrative that collapses “plan approved with fixes” → “P03 done” is a **paper moon**.

---

## 6. False-green matrix (this seat)

| Failure mode | Present? | Severity |
|--------------|----------|----------|
| Dual status pass **and** open in same pack | **YES** | **Blocking** for sellable PASS |
| HEAD self-pin without unit+browser co-prove | **YES** | **Blocking** for tip PASS |
| Unit alone = W3 | Rejected in most docs; still a risk if unit logs waved alone | High if claimed |
| `chrome/_cdm` as chrome proof | **YES if cited** | High |
| Stale RED NOTES after green log | **YES** | Med–High (confuses head) |
| Scorecard PASS on old pin sold as tip | **YES** | High |
| Count-only browser sold as id/pose proof | Residual risk | Med |
| Coverage % without behavior asserts | Mostly avoided; quality stub exists | Low–Med |
| Plan 8/10 → product done | Risk | High if spoken |
| Journey folder substitute | Not observed | — |
| Fabric ON proof | Not claimed; fabric OFF noted | OK |

---

## 7. What is *not* a lie (credit where real)

1. Unit pack log **62/62** is a real vitest deposit.
2. Playwright log body **1 passed** after Mode B is real.
3. PNGs show real planner chrome and furniture count delta.
4. Mode A product wire (one `updateProject(applySelectionDelete)`, keyboard preventDefault, Fabric `=== "1"`) has been re-read by multiple seats — not rewritten this seat.
5. Coverage hard files largely backed by behavioral tests (spot-read).
6. Agent 9 open deposit was honest at the time of RED browser re-prove.

---

## 8. PASS claim allowed? — full reasons

### **NO**, because:

1. **Incoherent pack status** (`pass` vs `open`) — cannot be an authority for tip PASS.
2. **HEAD.txt / run.json HEAD / tip mismatch** — pin theater without co-prove.
3. **Unit + browser not proven as one tip pair** in current `run.json` (browser seat only on unitPack).
4. **chrome/_cdm junk** pollutes evidence tree; snap shows guest **404**.
5. **Scorecard/LIVE-REVIEW PASS** attach to older pins while tip moved.
6. **Plan 8/10** must not be laundered into product/W3 done.
7. **Count-only + residual Feasibility coverage** remain honest residuals — fine if labeled; fatal if sold as full product bar.

### What would allow PASS later (not this seat’s job to forge)

1. Rewrite **one** meta set: `run.json` + `NOTES.md` + `PROOF-INDEX.md` + `HEAD.txt` to the **same** SHA.
2. Re-run **unit pack + Playwright W3** on that SHA, Fabric OFF, deposit fresh logs/PNGs (UTF-8 preferred).
3. Strip or quarantine `chrome/_cdm`.
4. Keep count-only residual explicit; unit id/pose remains the identity bar.
5. Only then set `status: pass` — or leave **open** if either half red.

---

## 9. Top 3 lies to kill

1. **“W3/CP-03 is PASS on tip”** while `NOTES`/`PROOF-INDEX` still say **open**, HEAD pins disagree, and unit was not co-proved with browser on tip — **dual-status + pin theater paper moon**.
2. **`chrome/_cdm` (or any chrome-devtools node_modules dump) is browser proof** — it is install junk; guest snap is even **404**.
3. **“Plan 8/10” or “≥90% unit coverage” means product/W3 done** — plan score is plan quality; coverage is unit half; owner bar and browser hard gate are separate.

(Honorable mention: selling Agent-9 RED forever after `browser-w3-raw.log` shows 1 passed — inverse paper moon.)

---

## 10. Return surface (for head)

| Question | Answer |
|----------|--------|
| **PASS claim allowed?** | **NO** |
| Honest tip status | **`open`** |
| Unit half | Real green deposit (stale vs tip) |
| Browser half | Real green log after Mode B (stale vs tip; NOTES unreconciled) |
| chrome/ | **Junk / not proof** |
| Coverage | Mostly real; not a W3 close |
| Plan 8/10 | **≠ product done** |

**Product thrash this seat:** none.  
**Evidence written:** this file only.

---

## Metadata

| Field | Value |
|-------|--------|
| Report path | `results/planner/world-standard-wave/03-select-delete/CODE-REVIEW-B-EVIDENCE.md` |
| Commit intent | `trustdata(P03): code-review B evidence false-green audit` |
| Product code changed | **None** |
| Plan file edited | **None** |
