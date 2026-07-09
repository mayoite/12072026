# INTEGRATION — Elon standard (Coordinator 1)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-09 |
| **Coordinator** | Parallel Coordinator 1 (`/using-superpowers` + `/dispatching-parallel-agents`) |
| **Checkout** | `D:\OandO07072026` (workspace path may be `D:\oando07072026`) |
| **HEAD at integrate** | `79648b4` — `test(open3d): green world e2e pack — flaky place paths + wall retry` |
| **Prior quality tip** | `bda0de6` — pickOpening units (TW1 already on `main`) |
| **Scope** | Inventory + commit authority only — **no product thrash** |
| **Bar** | Evidence over stories. Ship or say why not. No half-claims. Real tests. |

**This file is the single source of truth for what to commit from the quality-wave + elon-standard agent work.**  
Prior pack rollup (still valid detail): `results/planner/quality-wave-agents/INTEGRATION.md` — **superseded for git add/commit scope by this document** when the two disagree (this file includes later dirty TopBar / OOPlannerWorkspace label-in-name edits).

---

## 1. Inventory

### 1.1 `results/planner/elon-standard/**`

| Path | State | Notes |
|------|--------|--------|
| `AGENT-PACK.md` | Present | Standing 10-role pack (TW1/2, chrome, a11y, debug, review, integrate, verify, gate:open3d, scoreboard) |
| `chrome-devtools/` | **Empty dir** | No LIVE-NOTES, no shots — live role not landed here |
| `vitest-targeted.log` | **0 bytes** | No verify run captured under this tree |
| `INTEGRATION.md` | This file | Commit authority |

**Verdict:** Elon-standard tree is **scaffolding + this integration only**. It does **not** hold independent product landings or green gates. Do not claim “elon-standard wave green” from this folder alone.

### 1.2 `results/planner/quality-wave-agents/**`

Full prior parallel wave — **primary evidence home** for unit/live/a11y/debug work.

```
quality-wave-agents/
  AGENT-PACK.md                 # 8-role standing table
  VERIFY.md                     # Coord 2 — tsc 0 + partial vitest 40/40 (3 files)
  CODE-REVIEW.md                # Ready-with-fixes; 50/50 five-file re-run
  code-review-vitest.log        # 50/50
  INTEGRATION.md                # Prior rollup (commit set incomplete vs current dirty tree)
  test-writer-1/NOTES.md + vitest.log   # on main via bda0de6 (tracked)
  test-writer-2/NOTES.md + vitest.log   # uncommitted product tests
  chrome-devtools/LIVE-NOTES.md + PNG/txt (01–19)
  a11y/A11Y-REPORT.md + report.json/html + chrome-overview.png
  debug/ROOT-CAUSE.md           # catalog pointer-intercept
```

| # | Role | Disk | Product touch | Commit state |
|---|------|------|---------------|--------------|
| 1 | Test writer 1 — opening pick | `test-writer-1/` | `canvasPicking.test.ts` +3 | **Committed** `bda0de6` |
| 2 | Test writer 2 — rail/keyboard | `test-writer-2/` | shortcut + keyboard + **new** `canvasToolRail.a11y.test.tsx` | **Dirty / untracked** |
| 3 | Chrome DevTools live | `chrome-devtools/` | none | Evidence only (untracked pack) |
| 4 | A11y audit | `a11y/` | **0 in agent brief**; LH **0.98** | Evidence only |
| 5 | Systematic debug | `debug/` | `inventory.module.css` scroll-padding/margin | **Dirty** |
| 6 | Code review | `CODE-REVIEW.md` + log | none | Untracked |
| 7 | Integration (prior) | `quality-wave-agents/INTEGRATION.md` | none | Untracked |
| 8 | Verify | `VERIFY.md` | none | Partial GREEN (see conflicts) |

Related outside packs: `results/planner/quality-2026-07-09/`, `results/planner/a11y-open3d/`, `results/planner/world-standard-wave/` (spine — do not re-open in these commits).

### 1.3 Worktree product truth (authoritative for commit)

`git status` / `git diff` at integrate (HEAD `79648b4`):

| Path | Origin | Status |
|------|--------|--------|
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | TW2 | Modified (+ Opening `O` map/live + Select name contract) |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | TW2 | Modified (+ Opening `O` → `setTool("opening")`) |
| `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx` | TW2 | **Untracked new** (Select/Opening DOM a11y) |
| `site/features/planner/open3d/editor/inventory.module.css` | Debug | Modified (`scroll-padding-block` / `scroll-margin-block` on grid + Add) |
| `site/features/planner/open3d/editor/TopBar.tsx` | Label-in-name (A11Y Important #1) | Modified — Focus/Restore + Prefs `aria-label` include visible words |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Label-in-name (A11Y Important #1) | Modified — Commands trigger `aria-label="Commands (Ctrl+K)"` |

**Not dirty from this wave (already on main):** TW1 `canvasPicking.test.ts` (`bda0de6`), journey flake mitigations (`79648b4`).

**Untracked evidence (land with wave):**  
`results/planner/quality-wave-agents/**` (except already-tracked `test-writer-1/`),  
`results/planner/elon-standard/**` (AGENT-PACK + INTEGRATION; empty chrome/vitest optional but fine).

**Do not bag into these commits without intentional scope expand:**  
`results/audits/`, `results/planner/code-audit-2026-07-09/`, `results/tests/`, `results/_session-trust-readback.txt`, `results/planner/_tsc-wave.txt`, stray `a11y-open3d` PNG, etc.

---

## 2. Conflicts

### 2.1 Same-file product edit conflicts

| Pair | Same file? | Verdict |
|------|------------|---------|
| TW1 × TW2 | No | **None** |
| TW2 × Debug CSS | No | **None** |
| Debug CSS × TopBar / OOPlannerWorkspace | No | **None** |
| Label-in-name × TW2 tests | No overlapping paths | **None** |
| Quality-wave a11y agent × label-in-name edits | Agent wrote **0** product files; later dirty tree **does** edit TopBar/OOPlannerWorkspace | **Not a merge conflict** — chronological supersession: report recommended Important fix; labels now applied in worktree |

**No lasting same-file multi-agent product conflict.** Paths are disjoint.

### 2.2 Process / claim conflicts (must not paper over)

| Conflict | Detail | Resolution for commit |
|----------|--------|------------------------|
| **Dual evidence homes** | `elon-standard/` scaffold empty vs `quality-wave-agents/` full pack | **Authority for evidence content = quality-wave-agents.** Elon-standard holds AGENT-PACK + **this** INTEGRATION only until later agents write here. |
| **VERIFY vs CODE-REVIEW green** | VERIFY: 3 files / **40** tests; review: 5 files / **50** tests | VERIFY is **partial**. Whole-wave unit bar = five-file set. Re-run five files before/after commit if claiming GREEN. |
| **Quality-wave INTEGRATION commit set incomplete** | Prior INTEGRATION omitted TopBar + OOPlannerWorkspace | **This file wins** for `git add` product list. |
| **A11y “0 code edits” vs dirty labels** | A11Y-REPORT: Critical-only brief → none; Important #1 now in worktree | Land labels with **honest message** (label-in-name), not “a11y chrome complete.” Residuals remain: heading order H1→H3, 0×0 mobile toggles, sub-44px taps, catalog height when configurator expanded. |
| **Journey narrative (I1–I2)** | `79648b4` loosened wall assert + catalog→configurator fallback | **Do not thrash journey in these commits.** Residual only. Do not claim W1 exact +1 or catalog mouse place closed. |
| **Inventory CSS claim strength (I3)** | scroll-margin ≠ full hit-test fix | Message: scroll-into-view aid only; force-click remains rejected per ROOT-CAUSE. |
| **Transient VERIFY race (resolved)** | `wall` fixture shadow during TW1 edit → `wall2 is not a function` | Already re-run green; optional rename `baseWall` is hygiene, not blocking. |

### 2.3 Conceptual overlap (complementary — do not pick a winner)

| Topic | Agents | Treat as |
|-------|--------|----------|
| Tool rail a11y | TW2 units + live chrome + LH | Complementary layers |
| Catalog pointer | Chrome LIVE-NOTES + ROOT-CAUSE + CSS | Same root cause; CSS partial |
| Label-in-name | A11Y-REPORT Important + TopBar/OOPlanner edits | Report = diagnosis; worktree = partial Important land |

---

## 3. What to commit (authoritative)

### Already on `main` — do not re-commit

| Commit | Contents |
|--------|----------|
| `bda0de6` | TW1 pickOpening endpoints / diagonal / tolerance |
| `79648b4` | World e2e pack flake mitigations (wall retry, place fallback) — claim-weak for strict W1/catalog |

### Land now — product + tests (Commit 1)

```
site/features/planner/open3d/editor/TopBar.tsx
site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
site/features/planner/open3d/editor/inventory.module.css
site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts
site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx
site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
```

### Land now — evidence packs (Commit 2)

```
results/planner/quality-wave-agents/
results/planner/elon-standard/
```

(Tracked `test-writer-1/` already on main; re-adding folder is fine / no-op for those two files.)

### Explicitly out of these commits (residuals / thrash ban)

| Item | Why |
|------|-----|
| Journey wall `toBe(+1)` tighten (CODE-REVIEW I1) | Separate residual slice |
| Catalog-only place e2e without `el.click` (I2 / ROOT-CAUSE §7) | Follow-up gate |
| Heading order, 0×0 mobile toggles, density redesign | Next a11y/layout slice |
| `force: true` on catalog Add | **Rejected** forever for product truth |
| Engine / Fabric / place-model thrash | Out of scope |
| Unrelated `results/audits/`, code-audit tree, etc. | Different program |

### Pre-push check (main agent)

```text
cd site
pnpm exec tsc --noEmit -p tsconfig.json
pnpm exec vitest run \
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts \
  tests/unit/features/planner/open3d/geometry/canvasPicking.quality.test.ts \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts \
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
```

Expect: typecheck 0; **5 files / ~50 tests** (match code-review log). Optional: refresh `elon-standard/vitest-targeted.log` with that output after run.

---

## 4. Recommended commit messages (max 2)

### Commit 1 — product + units

```
fix(open3d): label-in-name chrome + inventory scroll margins; rail/keyboard units

Align Focus/Prefs/Commands accessible names with visible text (WCAG 2.5.3);
inventory scroll-padding/margin so Add stays in scrollport (partial hit-test
aid, not catalog place closed). Map-driven Opening (O)/Select (V) unit coverage
and CanvasToolRail a11y surface tests.
```

```bash
git add \
  site/features/planner/open3d/editor/TopBar.tsx \
  site/features/planner/open3d/editor/OOPlannerWorkspace.tsx \
  site/features/planner/open3d/editor/inventory.module.css \
  site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts \
  site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
git commit -m "fix(open3d): label-in-name chrome + inventory scroll margins; rail/keyboard units"
```

### Commit 2 — evidence

```
docs(planner): quality-wave + elon-standard evidence packs

Agent notes, live chrome shots, a11y LH, catalog pointer ROOT-CAUSE, review/verify,
and elon-standard INTEGRATION commit authority under results/planner/.
```

```bash
git add \
  results/planner/quality-wave-agents/ \
  results/planner/elon-standard/
git commit -m "docs(planner): quality-wave + elon-standard evidence packs"
```

**If main prefers a single landable slice:** squash the same path sets into one commit using Commit 1’s subject + body and append “Evidence under results/planner/quality-wave-agents/ and elon-standard/.” Prefer **two commits** for cleaner product-vs-docs history.

---

## 5. One-page verdict

| Dimension | Status |
|-----------|--------|
| Elon-standard folder completeness | **Scaffold only** (+ this INTEGRATION) |
| Quality-wave unit quality | **Strong** — real behavior; review 50/50 |
| Label-in-name product land | **Ready** — three controls; residuals remain |
| Inventory CSS | **Scoped partial** — land with limited claim |
| Same-file agent conflicts | **None** |
| Claim conflicts | **Documented** — do not oversell journey / catalog / full a11y |
| Git completeness | **Incomplete until Commits 1–2** |
| Product thrash this integrate | **None** (docs only) |

**Wave close bar:** land Commit 1 + Commit 2; push `origin` when five-file vitest + tsc green; leave I1–I2 journey residual and remaining Important a11y on the scoreboard. Do not re-implement features in integration.

---

**Coordinator 1** · `results/planner/elon-standard/INTEGRATION.md` · 2026-07-09  
**Supersedes commit-scope of:** `results/planner/quality-wave-agents/INTEGRATION.md` (detail retained; add-set updated for TopBar/OOPlannerWorkspace)
