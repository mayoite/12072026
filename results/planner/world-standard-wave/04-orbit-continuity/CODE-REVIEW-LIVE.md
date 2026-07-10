# CODE-REVIEW-LIVE — P04 / W4 Orbit Continuity

| Field | Value |
|-------|--------|
| **Seat** | P04 code-review (live re-prove after other seats) |
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` only (no worktrees) |
| **Tip at final write** | `1dd9ae6346db54e58303c7c5adb89bf1cb48361f` (moving trustdata tip; product W4 files stable) |
| **Browser pack tip (HEAD.txt during green)** | `231b2f03…` era → green Playwright deposit on disk |
| **Bar** | NO PAPER MOON. Plan rating ≠ product claim. Re-prove before claim. |
| **Prior plan review** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` (**APPROVE-WITH-FIXES 7.5 / 10**) |
| **Sibling** | `CODE-REVIEW-SCRATCH.md` (earlier same day; browser still missing → **NO**) |
| **This file** | Live product + deposits **after** browser seat landed green pack |

---

## 1. Plan rating vs product claim (SEPARATE)

### 1.1 Plan rating (execute brief quality)

| Item | Value |
|------|-------|
| **Source** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` + `IMPLEMENTATION-PLAN.md` |
| **Plan verdict** | **APPROVE-WITH-FIXES** |
| **Plan score** | **7.5 / 10** |
| **Meaning** | Plan is the right **verify + harden + re-prove** brief. Not automatically a ship certificate. Plan score is **not** the product claim. |

**Plan strengths (hold):** three-layer orbit rule; degrees document honesty; anti-J4 e2e; paper-PASS ban; no mid-W4 R3F port.

**Plan findings vs live after seats:**

| Report ID | Plan-review state | Live after seats (this file) |
|-----------|-------------------|------------------------------|
| **B1** paper PASS / missing `results/` | Blocking | **Mostly closed for re-prove pack** — folder has unit logs, PNGs, `browser-run.json`, exec audits. Phase card historical PASS still stale prose until flipped honestly. |
| **H1** soft console e2e | High open | **Still open** — run recorded `consoleErrorCount: 0` but spec still **does not** `expect(hardAppErrors).toEqual([])` and **does not** write `console-messages.txt` |
| **H2** layer-2 unit missing | High open | **Closed** — `workspaceOrbitWiring.test.ts` + product spread; this seat **9/9** orbit pack re-run green |
| **H3** browser count ≠ ids/mm/rotation | High if overclaim | **Documented in green `browser-run.json`** (`browserDoesNotProve` entity-ids/mm/rotation) — residual is **Done language**, not missing proof type |
| **M1** thin `poseContinuityW4` | Medium | **Still thin** (1 `it`); C5-class in `documentViewContinuity` — document, don’t thrash |
| **Browser proof** | Absent | **Green deposit** — Playwright 1 passed; 3 PNGs; `browser-run.json` status `browser-green` |

### 1.2 Product claim (W4 gate — hard answer)

| Item | Value |
|------|-------|
| **W4 product claim allowed?** | **YES** |
| **Status** | **open → claimable product YES; residuals remain for harden/docs** |
| **Why YES (after other seats + re-prove)** | Layers 1–2 closed in product source; pose adapter/mesh sign correct; unit pack **9/9** re-proved this seat; Playwright W4 journey **green** with non-trivial PNGs + honest `browser-run.json` (count + orbit attr; **not** overclaiming ids/mm/rotation). |
| **Why not “phase Done / zero residual”** | Soft console assert (H1); no `THREE-LAYER-AUDIT.md`; phase-card PASS prose still historically paper until maintainers rewrite; same-tip packaging of all unit tees still messy across concurrent trustdata commits. |

**Hard gate law applied:** unit green **and** Playwright green with real artifacts. Met for **product claim**. Soft console + audit doc = residual work, not automatic **NO** once browser is real green.

---

## 2. Live product re-verify

| Target | Path | Live fact | Verdict |
|--------|------|-----------|---------|
| **orbitDefaults** | `site/features/planner/open3d/3d/orbitDefaults.ts` | L7 `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; L13–15 typed `getOpen3dViewerControlProps(): { enableControls: true }` | **CLOSED** |
| **ThreeViewerInner `data-orbit-enabled`** | `…/3d/ThreeViewerInner.tsx` | L68 default ON; L171–186 OrbitControls construct; L340 `data-orbit-enabled` on `three-viewer-container` | **CLOSED** |
| **OOPlannerWorkspace spread** | `…/editor/OOPlannerWorkspace.tsx` | L13–16 import; L1057–1060 `{...getOpen3dViewerControlProps()}` | **CLOSED** (layer 2) |
| **poseContinuityW4** | `…/poseContinuityW4.test.ts` | Double rebuild; doc 90°; node rad; document immutable | **GREEN unit / thin matrix** |
| **e2e strength** | `…/open3d-w4-orbit-continuity.spec.ts` | Anti-J4 radios; `placeSeatsFromConfigurator`; orbit attr; count round-trip; optional left-drag; soft console (count only) | **Run GREEN; contract still soft on console hard-fail** |

### Supporting

| Piece | Cite | Verdict |
|-------|------|---------|
| Lazy defaults + `planner-3d-canvas` **div** | `ThreeLazyViewer.tsx` | CLOSED |
| Adapter degrees→radians | `buildOpen3dSceneNodes.ts` L119 | CLOSED |
| Mesh sign intentional | `createSceneObjectFromNode.ts` (4× `-node.rotation`) | CLOSED |
| Document degrees | `model/units.ts` | CLOSED |
| TopBar 2D\|3D radiogroup | `TopBar.tsx` L152–172 | CLOSED |
| Layer-2 unit | `workspaceOrbitWiring.test.ts` | CLOSED — this seat green |
| Pack gate W4 | `playwright-open3d-world-specs.json` | CLOSED |

### Three-layer summary

| Layer | Product | Unit | Browser |
|-------|---------|------|---------|
| **1 Defaults** | CLOSED | green | — |
| **2 Workspace** | CLOSED | green | — |
| **3 DOM + journey** | Attr + construct CLOSED | construct/attr unit green | **GREEN** (orbit attr + count path) |

---

## 3. Evidence honesty (re-proved)

### Units (this seat re-run on tip)

Command: `vitest run orbitControlsDefault + poseContinuityW4 + workspaceOrbitWiring`  
Result: **3 files, 9/9 passed** (~4.6s).

Prior deposits also green: `unit-orbit-pack.log`, `unit-pose-pack.log`, exec unit tees.

### Browser (concurrent seat deposit — re-read, not invented)

| Artifact | Fact |
|----------|------|
| `playwright-raw.log` | `1 passed` (~10.6s) — place → 3D orbit → 2D count |
| `browser-w4-playwright-live.log` | Later re-run also **1 passed** (~9.6s) |
| `browser-run.json` | `status: "browser-green"`; furniture 0→4→4; `orbitEnabled: true`; `consoleErrorCount: 0`; **honest** `browserDoesNotProve` ids/mm/rotation |
| `01-2d-after-place.png` | ~115 KB |
| `02-3d-orbit-on.png` | ~162 KB |
| `03-2d-restored.png` | ~112 KB |

**Earlier RED residual (historical, not current claim):** first browser attempts timed out on raw configurator `Place 4 seats` click before helper harden. Spec now uses `placeSeatsFromConfigurator` — green path. Do not cite old RED logs as current tip status.

### Still missing / soft

| Artifact | Status |
|----------|--------|
| `console-messages.txt` | **Absent** |
| Hard `expect(hardAppErrors).toEqual([])` in spec | **Absent** (count only) |
| `THREE-LAYER-AUDIT.md` | **Absent** |
| Phase card rewrite of historical PASS | Stale prose risk remains |

---

## 4. W4 product claim — YES / NO

### **YES**

**Meaning of YES here:** W4 product intent is claimable on tip after seats — orbit three-layer in product, unit pack green, browser journey green with real PNGs + honest browser-run (count + `data-orbit-enabled`; pose ids/mm/rotation unit-owned).

**Not claimed:** zero residual, CP-04 ceremony complete, console hard contract, phase MD already rewritten.

---

## 5. Top 5 residual (post-claim hygiene)

1. **Console hard assert (plan H1)** — Add `expect(hardAppErrors).toEqual([])` + write `console-messages.txt`, or explicit NOTES deferral. Soft count alone is false-green risk on future noisy runs.
2. **THREE-LAYER-AUDIT.md + phase prose** — Write audit from three-layer table; rewrite `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` so historical PASS matches live evidence (and kill stale “layer-2 gap / doc=radians” baseline).
3. **Same-tip packaging** — One NOTES/HEAD/`run.json` that pins **unit tee + Playwright** to one SHA (concurrent trustdata commits churned stamps).
4. **Buyer-goal language (H3)** — Keep Done copy aligned with `browser-run.json`: browser = count + orbit attr; **not** entity ids/mm/rotation (units only). Optional left-drag remains best-effort.
5. **poseContinuityW4 thin matrix (M1)** — Expand wall+furniture update **or** document C5 ownership by `documentViewContinuity` in THREE-LAYER-AUDIT (prefer document over thrash).

**Honorable mention:** body-regex furniture count flake risk; port-conflict noise in `dev-server-w4*.log` is not proof.

---

## 6. What not to rebuild

| Asset | Action |
|-------|--------|
| `orbitDefaults` / Lazy+Inner defaults ON | Verify only |
| `data-orbit-enabled` + OrbitControls | Verify only |
| Workspace spread | Verify only |
| `workspaceOrbitWiring.test.ts` | Keep |
| Adapter degrees→radians + mesh sign | Regression only — **never** document→radians thrash |
| Imperative Three | Stay — no R3F port |
| Anti-J4 radio grammar + `placeSeatsFromConfigurator` | Keep |

---

## 7. Kill / non-claim list

- No silent invent of green without PNGs / raw log (this pack has them).
- No claim browser-proved entity ids/mm/rotation.
- No document rotation rewrite to radians.
- No R3F open3d rewrite mid-W4.
- No J4 / middle-drag / canvas-as-`planner-3d-canvas` proof path.
- No orbit claim from layer-1 defaults alone.
- No treat soft console count as hard console contract.

---

## 8. Bottom line

| Question | Answer |
|----------|--------|
| Plan rating | **APPROVE-WITH-FIXES — 7.5 / 10** |
| Product layers 1–2 + pose architecture | **CLOSED** |
| Unit (this seat re-prove) | **9/9 green** |
| Browser pack | **GREEN** (PNGs + `browser-run.json` + pass log) |
| **W4 product claim** | **YES** |
| Residuals | Soft console hard-fail, THREE-LAYER-AUDIT, phase prose, packaging, H3 language |
| Highest leverage next | Harden console assert + write THREE-LAYER-AUDIT + honest phase flip |

**Return for dispatcher: W4 product claim = YES**

---

## Review method (this seat)

1. Read `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md`.
2. Live re-read: orbitDefaults, ThreeViewerInner attr/construct, OOPlannerWorkspace spread, poseContinuityW4, e2e spec, workspaceOrbitWiring, TopBar, adapter/mesh.
3. First pass saw browser RED (pre-helper harden) → draft NO.
4. Concurrent seat deposited green PNGs + `browser-run.json` + pass logs → **re-read artifacts** (non-trivial PNG sizes; `1 passed`; honest browserDoesNotProve).
5. Re-ran orbit/wiring/pose unit pack → **9/9**.
6. Updated this file; no product code edits.
)
