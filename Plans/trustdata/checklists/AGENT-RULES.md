# AGENT-RULES — Subagent contract (Trust-Data)

> **Binding for main agent and every subagent** on the trustdata / world-standard planner program.  
> Owner standing instructions (2026-07-09) in `AGENTS.md` win on conflict. Skills never override User Wins or Git rules.  
> **Governance revision:** 2026-07-09 — see [../reviews/GOVERNANCE-suggestions.md](../reviews/GOVERNANCE-suggestions.md).

**Checkout:** `D:\OandO07072026` only  
**Plan root:** `D:\OandO07072026\Plans\trustdata\`  
**Evidence root:** `D:\OandO07072026\results\planner\world-standard-wave\`

---

## 1. Superpowers & skills (always)

| Rule | Detail |
|------|--------|
| **Required** | `/using-superpowers` is always allowed and always required for main **and** subagents. |
| **Load early** | Before non-trivial work, load every skill with even ~1% chance of applying (TDD, systematic-debugging, verification-before-completion, chrome-devtools, a11y, Firecrawl ideas-only, docs, etc.). |
| **All skills permitted** | Owner grants full skill authority; main agent may assign any available skill. |
| **Handbooks** | Route via `AGENTS.md`: Plan → `Agents/Agents-Plan.md`; Failures → `Agents/Agents-failure.md`; Testing → `Agents/Agents-testing.md` + `testing-handbook.md`; Browser → `Agents/Agents-browser.md`; Docs → `Agents/Agents-docs.md`; Architecture → `Agents/Agents-architecture.md`. |
| **Skills do not override** | User message, no-worktree rule, commit cadence, push-on-ask, ethics. |

---

## 2. Concurrency

| Limit | Value |
|-------|-------|
| Default concurrent subagents | **8** |
| Hard maximum | **10** |
| Prefer | Write results to disk; do not idle waiting on chat for multi-stream work |
| Parallel after | CP-02 engine lock (see CHECKPOINTS.md); do not parallelize past hard stops |

When spawning streams for W3/W4/W6/W7/W8/docs, stay ≤8 unless owner authorizes burst to 10.

**W3 note:** Unit stream may run in parallel with other gates after CP-02, but **CP-03 / W3 stays red** until browser proof lands under `03-select-delete/`.

---

## 3. Git & workspace (non-negotiable)

| Rule | Detail |
|------|--------|
| **No worktrees** | Never `git worktree add`. Never switch to a worktree. Never follow skills that default to worktrees. Mainline checkout only: `D:\OandO07072026`. |
| **Commit as we go** | After each landable slice, create a clear **local** commit. Do not batch days of work uncommitted. |
| **Commit message shape** | `trustdata(P0X): <slice>` or `fix(open3d): <slice>` — state phase + what landed. |
| **Push** | **Never** `git push`, force-push, or remote branch delete without explicit owner ask in the **current** conversation. |
| **Destructive** | Archive over delete. No silent mass deletes of evidence. |

---

## 4. Trust data, not character

| Do | Do not |
|----|--------|
| Read repo files, tests, browser artifacts | Put the owner on trial for “character” or tone |
| Treat missing evidence as **not done** | Believe prior agent “DONE” without paths |
| Prefer `results/**` + code over chat memory | Argue that unit-green equals product works |
| Log blockers in `Failures.md` | Hide failures or filter test output |
| Update status when data contradicts plans | Defend bad output |

**Order of truth:** Owner current message → live repo/tests/browser → this trustdata pack → older notes/WAVE claims.

**W3 special case:** Unit-green select/delete without browser select→delete→undo under `03-select-delete/` = **not done**. Do not claim W3 / CP-03 PASS.

---

## 5. Licenses & research (hard — pointer only)

- Rules + cleared paid: `ayushdocs/17-LICENSES-CLEARED.md` · hard bullets in `AGENTS.md`
- Research index: `Plans/trustdata/RESEARCH-MAP.md` · home: `D:\websites`
- Keys: `.env.local` only
- Subagent line when naming a competitor: *Inspiration only — no competitor assets; licenses per 17-LICENSES-CLEARED.*

---

## 6. Write evidence (mandatory)

Every implementation or verification stream must leave disk proof:

| Gate / work | Folder under `results/planner/world-standard-wave/` |
|-------------|-----------------------------------------------------|
| Start / approach notes | `00-start/` |
| Product truth | `00-product-truth/` |
| Engine lock notes | `01-engine-lock/` |
| Browser journey W1–W2 | `02-browser-open3d-journey/` |
| Select/delete **W3** (unit **+ browser**) | `03-select-delete/` |
| Orbit/continuity W4 | `04-orbit-continuity/` |
| Symbols / Block2D (P05, W2 symbol half) | `05-symbols-svg/` |
| Save reload W5 + honesty W6 | `06-save-honesty/` (W5 may use `save-reload/` subfolder) |
| Mesh **W7** | **`08-mesh-quality/`** |
| Shortcuts **W8** | **`09-shortcuts-chrome/`** |
| Handover | `10-handover/` |

**Anti-drift:**

- W7 mesh artifacts → **`08-mesh-quality/`** only.  
- W8 shortcut/chrome artifacts → **`09-shortcuts-chrome/`** only (not `08-shortcuts-chrome/`; legacy name non-canonical).  
- P01 product truth → **`00-product-truth/`** only (not `01-product-truth/`).  
- W3 browser proof → **`03-select-delete/`** (P07 journey may re-assert; does not replace first W3 browser pack).

**Minimum artifact set per automated run:**

- `run.json` (or `playwright-run.json`) with command, exit code, timestamp, HEAD if known  
- Raw log (`*-raw.log` / vitest console) — **unfiltered**  
- Screenshots for browser claims (W3 requires select→delete→undo coverage or equivalent trace)  
- `NOTES.md` when visual/quality judgment is required (W6 copy, W7 mesh bar)

Map ownership: `Plans/trustdata/RESULTS-MAP.md` + [FOLDER-LOCK](../reviews/FOLDER-LOCK-suggestions.md) (FINAL 2026-07-09).

---

## 7. Commit slices (what counts as landable)

Commit when **any** of these lands cleanly:

1. Red→green unit tests for one behavior (select, delete, shortcut map, mesh footprint).  
2. One honest UI copy fix (local vs cloud) with test or screenshot.  
3. Playwright / chrome-devtools step artifacts for a W gate folder (including **W3 browser** under `03-select-delete/`).  
4. Docs/plan checkboxes sync that match evidence (not ahead of evidence).  
5. P10 backup log after E: copy succeeds.

Do **not** wait for all W1–W8 to commit. Do **not** commit secrets.

---

## 8. Required subagent prompt block

Paste into every subagent brief:

```text
REQUIRED: /using-superpowers + skills that fit the task.
Checkout: D:\OandO07072026 only — NO git worktrees.
Trust data (repo, tests, browser evidence), not character narratives.
Competitor research: inspiration only — no plagiarism; MIT/open packages only.
Write evidence under results/planner/world-standard-wave/<gate-folder>/.
  W3 → 03-select-delete/ (unit + browser hard gate)
  W7 mesh → 08-mesh-quality/
  W8 shortcuts → 09-shortcuts-chrome/
Commit each landable slice locally; never git push unless owner asked in this conversation.
Max concurrent agents with siblings: 8 default / 10 hard max.
No any in handwritten TS. Zero suppression of test output.
If scope grows beyond this brief: STOP and ask owner.
Read Plans/trustdata/checklists/AGENT-RULES.md and the phase file you own.
```

---

## 9. Stream ownership (Approach A default)

| Stream | Owns | Skills (typical) | Evidence folder |
|--------|------|------------------|-----------------|
| 1 | Furniture select + delete + undo (**W3**) — unit **and** browser | TDD, systematic-debugging, chrome-devtools / Playwright verification | `03-select-delete/` |
| 2 | Tool/shortcut truth (**W8**) | TDD | **`09-shortcuts-chrome/`** |
| 3 | 3D orbit + continuity (W4) | chrome-devtools, TDD | `04-orbit-continuity/` |
| 4 | Block2D + cabinet mesh bar (W2 symbols / **W7**) | TDD, verification | journey PNGs + **`08-mesh-quality/`** |
| 5 | Autosave flush + honest save copy (W5–W6) | TDD | `06-save-honesty/` (+ `save-reload/` subfolder) |
| 6 | Playwright open3d journey (W1–W2; may re-assert W3) | verification, chrome-devtools | `02-browser-open3d-journey/` |
| 7 | 2A blockers only (dead prefs, inventory a11y noise) | a11y | notes under **`09-shortcuts-chrome/`** or dedicated NOTES |
| 8 | Docs: honesty, evidence index, checklist sync | Agents-docs | `10-handover/` when closing |

Main agent coordinates; does not exceed concurrency caps.

**CP map (streams must not skip hard stops):** see `checkpoints/CHECKPOINTS.md` CP lock table (CP-00 → CP-10 = phases 00 / P01–P10).

---

## 10. Stop conditions (subagent must halt and report)

1. Need files/commands outside the brief (scope creep).  
2. CP stop-if-fail triggered (see CHECKPOINTS.md).  
3. Ethics risk (about to paste competitor asset).  
4. E: backup or secrets handling unclear.  
5. Worktree or push pressure from a skill default — refuse; stay on main checkout.  
6. Test output missing or tools skipped — mark FAIL, do not claim pass.  
7. About to mark **W3 / CP-03** green from unit alone — **stop**; finish browser proof or report blocked.  
8. About to write W8 evidence under `08-mesh-quality/` or legacy `08-shortcuts-chrome/` without rehome plan — **stop**; use `09-shortcuts-chrome/`.

---

## 11. Definition of done for a subagent task

- [ ] Brief fully matched (no extra refactors).  
- [ ] Evidence paths written and non-empty where claimed (correct folder per §6).  
- [ ] Local commit created for the slice (or explicit “docs-only uncommitted” only if owner said plan-only).  
- [ ] Failures.md updated if blocked.  
- [ ] Report: what ran, what failed, exact next step — no vibes.

---

## Related

| Doc | Path |
|-----|------|
| Owner checklist | [MASTER-CHECKLIST.md](./MASTER-CHECKLIST.md) |
| Checkpoints | [../checkpoints/CHECKPOINTS.md](../checkpoints/CHECKPOINTS.md) |
| Governance review | [../reviews/GOVERNANCE-suggestions.md](../reviews/GOVERNANCE-suggestions.md) |
| Start | [../00-START.md](../00-START.md) |
| Repo rules | `D:\OandO07072026\AGENTS.md` |
| Testing | `D:\OandO07072026\testing-handbook.md` |

---

## Expert revision note — 2026-07-09

Governance pass (no product code). Applied from GOVERNANCE-suggestions:

1. Evidence map: **W7 = `08-mesh-quality/`**, **W8 = `09-shortcuts-chrome/`**.  
2. W3 unit+browser hard gate in §§4, 6, 8, 9, 10.  
3. Stream 1 skills include chrome-devtools/Playwright; streams 2/7 → `09-shortcuts-chrome/`.  
4. Subagent prompt block carries folder locks.  
5. Explicit stop if marking W3 unit-only or parking W8 under wrong `08-*` folder.
