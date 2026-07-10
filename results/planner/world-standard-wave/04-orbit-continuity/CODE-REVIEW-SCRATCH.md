# CODE-REVIEW-SCRATCH — P04 / W4 orbit continuity

| Field | Value |
|-------|--------|
| **Seat** | Code-review (1 of 8) — product claim vs plan vs deposited evidence |
| **Date** | 2026-07-10 |
| **Checkout** | `.` only (no worktrees) |
| **Tip at write** | `41df56e5fa10424688402c1a396e4eeca4dbf4a2` |
| **Bar** | NO PAPER MOON. Plan rating ≠ product claim. Unit alone ≠ W4. |
| **Inputs** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md`, live product lines, `04-orbit-continuity/*` deposits, this-seat re-run of `workspaceOrbitWiring` only |

---

## 1. Plan rating vs product claim (SEPARATE)

### 1.1 Plan rating (execute brief quality)

| Item | Value |
|------|-------|
| **Document** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` + `IMPLEMENTATION-PLAN.md` |
| **Plan verdict** | **APPROVE-WITH-FIXES** |
| **Plan score** | **7.5 / 10** |
| **Meaning** | Plan is the right **verify + harden + re-prove** brief for mostly-landed W4 product. Not a ship certificate. |

**Plan strengths (still hold):** three-layer orbit rule; degrees document honesty; anti-J4 e2e grammar; paper-PASS ban; no R3F port; kill-order clear.

**Plan residuals still live on disk (report H/B updated for 2026-07-10 tip):**

| Report ID | Was | Now (this scratch) |
|-----------|-----|---------------------|
| **B1** paper PASS / missing `results/` | Blocking | **Partially closed** — folder exists with unit tees + exec audits; **not** full W4 pack |
| **H1** soft console e2e | High | **Still open** — live `open3d-w4-orbit-continuity.spec.ts` still writes `consoleErrorCount` but **does not** `expect(hardAppErrors).toEqual([])` and **does not** write `console-messages.txt` |
| **H2** layer-2 unit missing | High | **Closed in source+test** — `workspaceOrbitWiring.test.ts` landed (`f692ca96`); product spread present |
| **H3** browser count ≠ ids/mm/rotation | High | **Still open** if Done overclaims |
| **M1** thin poseContinuityW4 | Medium | **Still thin** (1 `it`); C5-class owned elsewhere (`documentViewContinuity`) — document ownership, do not thrash |

### 1.2 Product claim (W4 gate — this seat’s hard answer)

| Item | Value |
|------|-------|
| **W4 product claim allowed?** | **NO** |
| **Why** | Hard gate requires **unit + browser green on the same HEAD**. Deposited unit packs are green at older tips; **browser pack is absent** (no PNGs, no `browser-run.json`, no Playwright raw log). Chrome DevTools optional and **not** a substitute; chrome seat only left noisy `dev-server-w4-chrome.log` (port conflict / fail), not orbit proof. |
| **run.json status** | **`open`** (see coherent `run.json` written with this file) |

**Executable-plan W4 row:** “2D↔3D pose + orbit ON | P04 unit pose + browser orbit” — dual hard gate. Unit-only fails that law.

---

## 2. Three-layer table

### 2.1 Product code (live read — tip `41df56e5`, product same as wiring land `f692ca96`)

| Layer | Requirement | Product source | Status |
|-------|-------------|----------------|--------|
| **1 Defaults** | Lazy + Inner default `enableControls` ON via `OPEN3D_ORBIT_DEFAULT_ENABLED` | `orbitDefaults.ts` L7 `= true`; `ThreeLazyViewer.tsx` L145; `ThreeViewerInner.tsx` L68 | **CLOSED** |
| **2 Workspace** | Explicit `{...getOpen3dViewerControlProps()}` on product mount | `OOPlannerWorkspace.tsx` L13–16 import; L1057–1060 spread | **CLOSED** |
| **3 DOM / proof** | `data-orbit-enabled` + construct + browser journey | Inner L340 `data-orbit-enabled`; OrbitControls construct L171–186; unit construct-spy present | **Code CLOSED / browser proof OPEN** |

Supporting architecture (pose — not “orbit layer” but W4 buyer goal):

| Piece | Live fact | Cite |
|-------|-----------|------|
| Adapter degrees→radians | `rotation: degreesToRadians(item.rotation)` | `buildOpen3dSceneNodes.ts` L119 |
| Mesh sign intentional | `rotation.y = -node.rotation` (4 paths) | `createSceneObjectFromNode.ts` |
| View chrome | TopBar `role="radiogroup"` 2D\|3D | `TopBar.tsx` L152 |

### 2.2 Proof layer (deposited evidence only)

| Layer | Unit proof | Browser proof | Verdict |
|-------|------------|---------------|---------|
| **1** | `orbitControlsDefault.test.tsx` in `unit-orbit-pack.log` — 6 tests, pack **9/9** exit 0 | — | Unit **green (stale tip)** |
| **2** | `workspaceOrbitWiring.test.ts` — 2 tests; in orbit pack + this-seat re-run green | — | Unit **green** |
| **3** | Construct + `data-orbit-enabled` in orbit unit | Playwright `open3d-w4-orbit-continuity.spec.ts` **not run / no artifacts** | **OPEN** |

**Exec seat deposits (audit, not dual-gate):**

| File | Claim | This seat |
|------|-------|-----------|
| `exec1-layer1-defaults.md` | layer1 CLOSED | Accept as **source audit** |
| `exec2-layer2-workspace.md` | layer2 CLOSED | Accept — matches live L1059 |
| `exec3-pose-document.md` | pose adapter OK | Accept as **source audit** |
| `SCRATCH-BASELINE.md` | phase PASS invalid / open | Aligns |

---

## 3. Evidence honesty (same-tip law)

| Artifact | Present? | HEAD / note |
|----------|----------|-------------|
| `unit-orbit-pack.log` | YES | **9/9** — NOTES/run historically pinned to `382ab73f` / pack at wiring era `f692ca96` |
| `unit-pose-pack.log` | YES | **26/26** — same unit-seat era |
| `workspaceOrbitWiring` this-seat re-run | YES (console) | **2/2** on tip `41df56e5` |
| Browser PNGs `01-`…`03-` | **NO** | — |
| `browser-run.json` | **NO** | — |
| Playwright raw log for W4 | **NO** | — |
| `console-messages.txt` | **NO** | — |
| `THREE-LAYER-AUDIT.md` | **NO** | Checklist residual |
| Chrome orbit journey | **NO** | `dev-server-w4*.log` = port/process noise only |
| Coherent dual green same SHA | **NO** | Unit tips ≠ browser (browser never landed) |

**Raw log quality caveats (do not inflate):**

- `unit-poseContinuityW4-raw.log` tiny / empty of usable suite output.
- `unit-orbitControlsDefault-raw.log` short (1474 B) — prefer multi-file `unit-orbit-pack.log`.
- `unit-workspaceOrbitWiring-raw.log` large (re-runs concatenated) — last segment green 2/2.

---

## 4. W4 product claim — YES / NO

### **NO**

Required for **YES** (this program’s hard gate):

1. Unit pack green (orbit construct + wiring + pose/adapter) on tip **T**
2. Playwright `open3d-w4-orbit-continuity` green on **same tip T** with PNGs + `browser-run.json` under `04-orbit-continuity/`
3. Chrome optional — note if present; **cannot** replace Playwright for this gate

**Current:** (1) partially satisfied on **older** tips; (2) **missing entirely**; (3) not useful. Therefore **product claim = NO**, `status = open`.

Do **not** inherit:

- Phase-card historical W4 PASS  
- Unit tee “9/9” as browser green  
- `browser-run.json` status field written only if/when Playwright actually runs (spec hardcodes `"browser-green"` on success path — still requires a real run)

---

## 5. Top 5 residuals

1. **Browser hard gate missing** — Run `open3d-w4-orbit-continuity.spec.ts` with Fabric OFF; deposit PNGs + `browser-run.json` + raw log on **one** tip; only then re-evaluate claim.  
2. **Same-tip dual proof** — Re-tee unit orbit+pose packs on the **same** SHA as the browser run; rewrite NOTES/HEAD/`run.json` together. Current unit logs predate tip `41df56e5` trustdata stamps.  
3. **Console honesty (report H1)** — Either hard `expect(hardAppErrors).toEqual([])` + `console-messages.txt`, or **explicit** NOTES deferral. Soft `consoleErrorCount` only is false-green risk.  
4. **THREE-LAYER-AUDIT.md** — Checklist item still absent; fill from this three-layer table after browser lands (or as intermediate honesty, still status open).  
5. **Buyer-goal overclaim risk (report H3)** — Browser asserts furniture **count** + `data-orbit-enabled`, not entity ids/mm/rotation. Pose ids/mm/deg stay **unit** (`poseContinuityW4` + adapter). Optional left-drag skipped if `boundingBox()` null. Done language must not claim browser-proved pose identity.

**Honorable mention (not top-5 for claim flip):** expand `poseContinuityW4` wall matrix **or** document C5 ownership in THREE-LAYER-AUDIT (report M1 — prefer document over thrash).

---

## 6. Live e2e residual detail (for next execute seat)

**File:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`

| Behavior | Present | Hard enough? |
|----------|---------|--------------|
| Anti-J4 radios 2D/3D | YES | OK |
| Place via configurator “Place 4 seats” | YES | OK for count path |
| `data-orbit-enabled="true"` | YES | OK layer-3 attr |
| Left-drag if box | YES if box | Soft (optional) |
| Round-trip count 3D→2D→3D | YES | Count only |
| Fail on hard app console errors | **NO** | Soft |
| Write `console-messages.txt` | **NO** | Missing |

---

## 7. Kill / non-claim list (reaffirm)

- No W4 Done / pass without browser artifacts on same tip.  
- No document rotation → radians thrash.  
- No R3F open3d port for this gate.  
- No J4 / middle-drag / canvas-as-`planner-3d-canvas` proof path.  
- No claim orbit from layer-1 defaults alone (layer-2 unit now guards).  
- No chrome-only green.  
- No silent “console clean.”

---

## 8. Bottom line

| Question | Answer |
|----------|--------|
| Is the **plan** good enough to execute? | **Yes with fixes** — **7.5 / APPROVE-WITH-FIXES** |
| Is **W4 product** claimable now? | **NO** |
| Coherent `run.json` status | **`open`** |
| Highest leverage next step | Browser Playwright pack + same-tip unit re-tee; then re-open this scratch |

**Return code for dispatcher:** **W4 product claim = NO**
