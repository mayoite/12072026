# CODE-REVIEW-LIVE — P04 / W4 Orbit Continuity

| Field | Value |
|-------|--------|
| **Seat** | P04 code-review (live re-prove after other seats) |
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` only (no worktrees) |
| **Tip at write** | `180f0e10e1a2d181271a9084198116a0059949d5` |
| **HEAD.txt stamp** | `180f0e10…` (matches tip at write) |
| **Bar** | NO PAPER MOON. Plan rating ≠ product claim. Unit alone ≠ W4. Browser red ≠ green. |
| **Prior plan review** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` (APPROVE-WITH-FIXES **7.5 / 10**) |
| **Sibling scratch** | `CODE-REVIEW-SCRATCH.md` (earlier same-day; browser was still **missing**) |
| **This file** | Live re-verify of product + deposits **including browser RED** |

---

## 1. Plan rating vs product claim (SEPARATE)

### 1.1 Plan rating (execute brief quality)

| Item | Value |
|------|-------|
| **Source** | `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` + `IMPLEMENTATION-PLAN.md` |
| **Plan verdict** | **APPROVE-WITH-FIXES** |
| **Plan score** | **7.5 / 10** |
| **Meaning** | Plan is the right **verify + harden + re-prove** brief for mostly-landed W4 product. **Not** a ship certificate and **not** a W4 product claim. |

**Plan still correct on:** three-layer orbit rule; degrees document honesty; anti-J4 e2e; paper-PASS ban; no mid-W4 R3F port; kill-order.

**Plan findings updated vs live tip (after other seats):**

| Report ID | Prior (plan review) | Live after seats (this file) |
|-----------|---------------------|------------------------------|
| **B1** paper PASS / missing `results/` | Blocking — no tree | **Partially closed** — folder has unit logs, exec audits, scratch/run; **not** dual-green pack |
| **H1** soft console e2e | High open | **Still open** — no `expect(hardAppErrors).toEqual([])`, no `console-messages.txt` |
| **H2** layer-2 unit missing | High open | **Closed** — `workspaceOrbitWiring.test.ts` landed; product spread present; this-seat + packs re-ran green |
| **H3** browser count ≠ ids/mm/rotation | High if overclaim | **Still open** — buyer goal still unit-only for pose identity |
| **M1** thin `poseContinuityW4` | Medium | **Still thin** (1 `it`); C5-class in `documentViewContinuity` — document, don’t thrash |
| **Browser proof** | Absent | **Now RED** (not missing-only) — Playwright failed place step |

### 1.2 Product claim (W4 gate — hard answer)

| Item | Value |
|------|-------|
| **W4 product claim allowed?** | **NO** |
| **Status** | **open** |
| **Why (after other seats)** | (1) Product layers 1–2 + pose architecture are **landed** and re-audited green by exec seats. (2) Unit packs deposited green (orbit/wiring/pose/adapter). (3) **Browser hard gate is RED** on tip — Playwright failed before orbit assert (`Place 4 seats` / configurator click timeout). (4) No PNGs, no success `browser-run.json`. (5) Phase-card historical **PASS** remains paper. |

**Hard gate law (unchanged):** unit green **and** Playwright green on **same HEAD**. Unit-only or browser-red = **NO**.

---

## 2. Live product re-verify (tip `180f0e10`)

Read-only re-open of the five brief targets + supporting pose path.

| Target | Path | Live fact | Verdict |
|--------|------|-----------|---------|
| **orbitDefaults** | `site/features/planner/open3d/3d/orbitDefaults.ts` | L7 `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; L13–15 `getOpen3dViewerControlProps(): { enableControls: true }` | **CLOSED** (layer 1 constant + typed helper) |
| **ThreeViewerInner `data-orbit-enabled`** | `…/3d/ThreeViewerInner.tsx` | L68 default ON; L171–186 OrbitControls construct (damping 0.08, polar clamp, dist 1/40); L340 `data-orbit-enabled={orbitEnabled ? "true" : "false"}` on `three-viewer-container` | **CLOSED** (layer 1 + DOM attr) |
| **OOPlannerWorkspace spread** | `…/editor/OOPlannerWorkspace.tsx` | L13–16 import `Lazy3DViewer` + helper; L1057–1060 `{...getOpen3dViewerControlProps()}` | **CLOSED** (layer 2) |
| **poseContinuityW4 tests** | `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | Single `it`: double rebuild; doc rotation 90°; node rad; document immutable after rebuild | **GREEN unit / thin matrix** |
| **e2e spec strength** | `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | Anti-J4 2D/3D radios; place 4 seats; orbit attr; count round-trip; **soft** console (count only, no hard fail); left-drag best-effort | **Spec exists; run RED; contract still soft** |

### Supporting (pose authority — not thrash)

| Piece | Cite | Verdict |
|-------|------|---------|
| Lazy defaults + `planner-3d-canvas` **div** | `ThreeLazyViewer.tsx` L145, L169 | CLOSED |
| Adapter degrees→radians | `buildOpen3dSceneNodes.ts` L119 | CLOSED |
| Mesh sign flip intentional | `createSceneObjectFromNode.ts` (4× `rotation.y = -node.rotation`) | CLOSED |
| Document degrees helpers | `model/units.ts` `normalizeDegrees` / `degreesToRadians` | CLOSED |
| TopBar 2D\|3D radiogroup | `TopBar.tsx` L152–172 | CLOSED |
| Layer-2 unit lock | `workspaceOrbitWiring.test.ts` (cwd-relative source scan) | CLOSED — this seat re-ran **2/2** green |
| Pack gate W4 | `playwright-open3d-world-specs.json` + unit | CLOSED |

### Three-layer summary

| Layer | Product source | Unit proof | Browser proof |
|-------|----------------|------------|---------------|
| **1 Defaults** | CLOSED | green (`orbitControlsDefault` in packs) | — |
| **2 Workspace** | CLOSED | green (`workspaceOrbitWiring`) | — |
| **3 DOM + journey** | Attr + construct CLOSED in code | construct/attr unit green | **RED** — place path timeout before orbit |

---

## 3. Evidence after other seats (honesty)

### Product / unit deposits (accept as audits + unit green)

| Artifact | Role | Note |
|----------|------|------|
| `SCRATCH-BASELINE.md` | Phase PASS void; product line cites | Aligns with this review |
| `exec1-layer1-defaults.md` | layer1 CLOSED source audit | Accept |
| `exec2-layer2-workspace.md` | layer2 CLOSED source audit | Accept — matches L1059 |
| `exec3-pose-document.md` | pose adapter/mesh OK | Accept |
| `exec9-topbar-viewmode.md` | TopBar view mode audit | Present |
| `unit-orbit-pack.log` | 9/9 orbit+pose+wiring | Green (older tip era; product unchanged for these files) |
| `unit-pose-pack.log` | 26/26 pose+adapter+mesh | Green |
| `unit-p04-pack-raw.log` / `unit-p04-scratch-pack-raw.log` | Later multi-file re-tees | Green deposits |
| `unit-workspaceOrbitWiring-raw.log` | Layer-2 unit | Green 2/2 |
| `CODE-REVIEW-SCRATCH.md` | Prior code-review NO | Superseded on browser status only (missing → **RED**) |

### Browser deposits (do **not** launder)

| Artifact | Status |
|----------|--------|
| `browser-w4-raw.log` | **FAIL** — `Place 4 seats` click timeout (configurator button) |
| `browser-w4-playwright-live.log` | **FAIL** — same journey red (~18–22s) |
| `01-2d-after-place.png` / `02-3d-orbit-on.png` / `03-2d-restored.png` | **Absent** |
| `browser-run.json` (success path) | **Absent** |
| `console-messages.txt` | **Absent** |
| `THREE-LAYER-AUDIT.md` | **Absent** |
| Chrome folder / `dev-server-w4*.log` | Port/noise — **not** orbit proof |

### Failure detail (browser residual root for next seat)

From `browser-w4-playwright-live.log` / `browser-w4-raw.log`:

- Spec: `open3d-w4-orbit-continuity.spec.ts` — place furniture → 3D orbit attr → 2D same count
- Error: `TimeoutError: locator.click` waiting for  
  `getByRole('region', { name: 'Workstation systems configurator' }).getByRole('button', { name: 'Place 4 seats' })`
- Guest topbar path may reach; **place step does not complete** → never reaches `data-orbit-enabled` assert
- Spec still hardcodes `"status": "browser-green"` only on the **success** write path — currently **no** success write (correct non-green). Soft console assert remains a **false-green risk if** place path is fixed without hardening H1.

**Do not** treat phase `P04-orbit-continuity.md` header W4 **PASS** as authority.

---

## 4. W4 product claim — YES / NO

### **NO**

Required for **YES**:

1. Unit pack green (orbit construct + wiring + pose/adapter) on tip **T**
2. Playwright `open3d-w4-orbit-continuity` **green** on **same tip T** with PNGs + honest `browser-run.json` under `04-orbit-continuity/`
3. Chrome optional — cannot replace Playwright

**Current tip `180f0e10`:** product layers 1–2 closed; units green on deposits; **browser RED**.  
→ **W4 product claim = NO**. Status remains **open**.

---

## 5. Top 5 residual

1. **Browser hard gate RED** — Fix guest place path for W4 e2e (configurator “Place 4 seats” timeout / collapsed region / server race). Re-run Playwright on **one** tip; deposit PNGs + `browser-run.json` + raw log. Until green, claim stays **NO**.
2. **Same-tip dual proof** — Re-tee unit orbit+pose+wiring packs on the **same SHA** as the successful browser run; single coherent `HEAD.txt` + `run.json` + NOTES. Current unit logs span multiple trustdata tips while product for these files is stable.
3. **Console honesty (plan H1)** — Add `expect(hardAppErrors).toEqual([])` + write `console-messages.txt`, **or** explicit NOTES deferral. Soft `consoleErrorCount` only is false-green risk once place path works.
4. **Buyer-goal overclaim (plan H3)** — Browser proves furniture **count** + `data-orbit-enabled`, not entity ids/mm/rotation. Pose identity stays unit (`poseContinuityW4` + `documentViewContinuity` + adapter). Done language must not claim browser-proved pose identity. Optional left-drag still best-effort if `boundingBox()` null.
5. **THREE-LAYER-AUDIT.md + phase paper PASS** — Write three-layer audit after dual green; **do not** flip `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` PASS until artifacts prove it. Stale phase prose still wrong on layer-2 gap and “document+nodes=radians.”

**Honorable mention:** expand `poseContinuityW4` wall matrix **or** document C5 ownership (prefer document over thrash). Soft body-regex furniture count remains known flake risk.

---

## 6. What not to rebuild

| Asset | Action |
|-------|--------|
| `orbitDefaults.ts` / Lazy+Inner defaults ON | Verify only |
| `data-orbit-enabled` + OrbitControls construct | Verify only |
| Workspace `{...getOpen3dViewerControlProps()}` | Verify only — **do not** re-add |
| `workspaceOrbitWiring.test.ts` | Keep; re-run on claim tip |
| Adapter degrees→radians + mesh sign | Regression only — **never** document→radians thrash |
| Imperative Three path | Stay — no R3F port for W4 |
| Anti-J4 radio grammar | Keep |

---

## 7. Kill / non-claim list

- No W4 Done / PASS without **green** browser artifacts on same tip as unit.
- No unit-only launder; no chrome-only green; no phase-header inherit.
- No document rotation rewrite to radians.
- No R3F open3d rewrite mid-W4.
- No J4 selectors / middle-drag / canvas-as-`planner-3d-canvas`.
- No orbit claim from layer-1 defaults alone (layer-2 unit now guards).
- No silent “console clean.”
- No invent success `browser-run.json` after a red Playwright log.

---

## 8. Bottom line

| Question | Answer |
|----------|--------|
| Plan rating | **APPROVE-WITH-FIXES — 7.5 / 10** (execute brief OK) |
| Product layers 1–2 + pose architecture on tip | **Landed / closed in source** |
| Unit deposits | **Green** (multiple tips; product stable for W4 files) |
| Browser hard gate | **RED** (place path timeout) |
| **W4 product claim** | **NO** |
| Coherent status | **`open`** |
| Highest leverage next | Fix W4 e2e place path → green Playwright + same-tip unit re-tee → re-open claim |

**Return for dispatcher: W4 product claim = NO**

---

## Review method (this seat)

- Read `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` full.
- Live re-read: `orbitDefaults.ts`, `ThreeViewerInner` (construct + attr), `OOPlannerWorkspace` spread, `poseContinuityW4.test.ts`, `open3d-w4-orbit-continuity.spec.ts`, `workspaceOrbitWiring.test.ts`, TopBar radios, adapter/mesh sign.
- Re-ran `workspaceOrbitWiring.test.ts` → **2/2 green**.
- Read deposits: unit packs, SCRATCH-BASELINE, exec1–3/9, CODE-REVIEW-SCRATCH, `browser-w4-raw.log`, `browser-w4-playwright-live.log`.
- No product code edits. Evidence write: this file only under root `results/…/04-orbit-continuity/`.
)
