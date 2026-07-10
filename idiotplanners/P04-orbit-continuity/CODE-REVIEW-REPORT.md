# CODE-REVIEW-REPORT — P04 Orbit Continuity

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first vs plan) |
| **Plan under review** | `idiotplanners/P04-orbit-continuity/IMPLEMENTATION-PLAN.md` |
| **Brainstormer (optional)** | `archive/Idiots2/P04-orbit-continuity/REPORT.md` (not live `Idiots2/`) |
| **Scope** | Plan vs live repo only — **no code implement, no plan edits** |
| **Verdict** | **APPROVE-WITH-FIXES** |
| **Score** | **7.5 / 10** |

---

## Executive summary

W4 product architecture is **largely already landed** on the open3d imperative Three path: orbit defaults ON, workspace spreads `getOpen3dViewerControlProps()`, `data-orbit-enabled` on the inner container, document furniture rotation in **degrees**, scene nodes in **radians**, mesh `rotation.y = -node.rotation` intentional, TopBar 2D|3D radiogroup, Vitest orbit/pose/adapter suites, and Playwright `open3d-w4-orbit-continuity.spec.ts` on the anti-J4 grammar.

The implementation plan correctly frames execute as **verify + harden + re-prove evidence**, not greenfield rewrite. It correctly bans paper PASS, J4 selector thrash, document→radians false-reverse, and mid-W4 R3F port. Repo truth largely matches §1 product table.

**Do not APPROVE as ship-ready without fixes:** (1) entire `results/` tree is **absent** — phase header PASS is paper; (2) live Playwright is **weaker** than the plan’s “full expected” source (no hard `expect(console).toEqual([])`, no `console-messages.txt`); (3) layer-2 workspace source unit **missing**; (4) plan points brainstormer at `Idiots2/…` but disk has **`archive/Idiots2/…`**; (5) browser contract proves **furniture count + orbit attr**, not entity ids/mm/rotation (units carry pose; goal wording can overclaim).

Execute agents should follow the plan’s posture, apply the listed hardenings, and refuse Done until `04-orbit-continuity/` artifacts exist.

---

## Repo truth table

| Claim (plan / phase) | Live path | Status |
|----------------------|-----------|--------|
| `OPEN3D_ORBIT_DEFAULT_ENABLED = true` + helper | `site/features/planner/open3d/3d/orbitDefaults.ts` | **EXISTS** — matches plan |
| Lazy defaults ON; `data-testid="planner-3d-canvas"` on **div** | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | **EXISTS** |
| Inner: OrbitControls construct, damping 0.08, polar clamp, min/max 1/40, `data-orbit-enabled` | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | **EXISTS** |
| Workspace spreads helper into Lazy3DViewer | `OOPlannerWorkspace.tsx` L1010–1013 `{...getOpen3dViewerControlProps()}` | **EXISTS** — layer 2 closed in product |
| TopBar radiogroup 2D / 3D | `TopBar.tsx` `role="radiogroup"` | **EXISTS** |
| Adapter degrees→radians | `buildOpen3dSceneNodes.ts` `degreesToRadians(item.rotation)` | **EXISTS** |
| Mesh sign flip | `createSceneObjectFromNode.ts` `rotation.y = -node.rotation` (4 sites) | **EXISTS** |
| Document rotation degrees | `model/units.ts` `normalizeDegrees` / `degreesToRadians` | **EXISTS** |
| Orbit unit O1–O6 | `orbitControlsDefault.test.tsx` | **EXISTS** (filename **.tsx**, not .ts) |
| Pose W4 unit | `poseContinuityW4.test.ts` | **EXISTS** — **thinner** than plan’s full dual-`it` paste |
| Document continuity wall+furniture | `documentViewContinuity.test.ts` | **EXISTS** — covers wall+pose update matrix |
| Adapter / mesh units | `buildOpen3dSceneNodes.test.ts`, `createSceneObjectFromNode.test.ts` (incl. sign) | **EXISTS** |
| Workspace wiring unit | `workspaceOrbitWiring.test.ts` | **MISSING** (plan Task 03 recommended) |
| Playwright W4 | `open3d-w4-orbit-continuity.spec.ts` | **EXISTS** — weaker console contract than plan paste |
| Pack gate W4 | `playwright-open3d-world-specs.json` + unit | **EXISTS** |
| Evidence `results/planner/world-standard-wave/04-orbit-continuity/` | repo root `results/` | **ABSENT** (entire `results/` missing) |
| Phase header W4 **PASS** 2026-07-09 | `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` | **PAPER** vs disk |
| Expert `03-r3f-3d.md` “no data-orbit / omit enable” | same folder | **STALE** vs live (plan correctly says so) |
| Phase “document + scene nodes = radians” (arch prose) | `P04-orbit-continuity.md` ~L62 | **FALSE** for furniture; live = degrees doc / rad nodes |
| Brainstormer `Idiots2/P04-…/REPORT.md` | `archive/Idiots2/P04-orbit-continuity/REPORT.md` | **PATH DRIFT** — content useful under archive |
| Approach A / no R3F open3d rewrite | product tree | **ALIGNED** |
| Non-goals (walk, camera bookmark, P06/P08, J4) | — | **ALIGNED** |

### Layer audit (product only — proof layer open)

| Layer | Meaning | Product | Proof artifacts |
|-------|---------|---------|-----------------|
| 1 | Defaults ON | **Closed** | No vitest logs under `04-` |
| 2 | Explicit workspace prop | **Closed** in source | No wiring unit |
| 3 | Unit + browser + `results/…/04-` | Specs exist | **Not closed** — no evidence folder |

---

## Findings

### Blocking (B)

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **Paper PASS / missing evidence root.** Phase execute card claims W4 PASS with `04-orbit-continuity/` artifacts. Disk: **no** `results/` tree. Plan Task 00 + honesty ban are correct and **mandatory** — Done/CP-04 cannot inherit phase header. | `Test-Path results` → missing; phase `P04-orbit-continuity.md` L5–10 |

*Note:* B1 is a **program honesty** block for “W4 Done,” not a defect in plan architecture. The plan already calls this out; execute must not soft-pass it.

### High (H)

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | **Live Playwright ≠ plan’s hard console contract.** Plan Task 06 “full expected” writes `console-messages.txt` and `expect(hardAppErrors).toEqual([])`. Live spec collects errors, writes `browser-run.json` with `consoleErrorCount`, but **does not fail** on hard app errors and **does not** write `console-messages.txt`. False-green risk: status `browser-green` with noisy console. | Live `open3d-w4-orbit-continuity.spec.ts` L111–141 vs plan L1300–1339 |
| **H2** | **Layer-2 unit not landed.** Product wiring is correct; plan correctly requires `workspaceOrbitWiring.test.ts` so silent removal of `{...getOpen3dViewerControlProps()}` fails unit (three-layer rule). Without it, layer 1 alone still “works.” | File absent; workspace L1010–1013 has wiring |
| **H3** | **Buyer goal overclaims browser proof.** Goal: same entity **ids / mm / rotation** across 2D↔3D. Browser only: status-text furniture **count**, orbit attr, optional left-drag, remount orbit. Pose truth is unit-only. Acceptable if documented; dangerous if Done claims “ids/mm/rotation browser-proved.” | Spec L24–28, L89–91; units do pose |

### Medium (M)

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | **poseContinuityW4 matrix incomplete in one file.** Live: one `it` (double rebuild + degrees). Plan paste adds second `it` (wall + furniture + update). C5-class coverage exists in `documentViewContinuity.test.ts` — plan should prefer **extend-if-gap** over wholesale replace to avoid thrash. | Live 64 lines vs plan ~130-line dual suite |
| **M2** | **Brainstormer path wrong for this tree.** Plan inputs: `Idiots2/P04-orbit-continuity/REPORT.md`. Actual: `archive/Idiots2/P04-orbit-continuity/REPORT.md` (and `archive/Idiots/` older twin). Execute may fail open. | Path check |
| **M3** | **Orbit drag is best-effort.** If `boundingBox()` is null, drag skipped; test still green if attr true. Weak for “left-drag without crash.” | Spec L72–81 |
| **M4** | **Source-scan wiring unit is brittle but OK if path is `process.cwd()`=site.** Plan’s first `__dirname` relative path is fragile under vitest; plan later prefers `path.join(process.cwd(), "features/…")` — **must use preferred form only**. | Plan Task 03 |
| **M5** | **Stale phase/expert prose still in tree.** Expert 03 and phase “honest baseline” still describe omit-enable / no data-orbit / radians doc. Plan supersedes for execute; residual risk if agent reads phase first. | `03-r3f-3d.md`, phase L83–104, L62 |
| **M6** | **Furniture-count continuity via `body` regex** (`/(\d+)\s+furniture/i`) can false-pass/fail on chrome copy changes — known, plan acknowledges. Prefer status testid long-term; not W4 rewrite unless red. | Spec helper |

### Low (L)

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | Plan length (~1.4k lines) pastes full green sources (orbit mocks, e2e, orbitDefaults). Useful as lock file; thrash risk if execute rewrites product “because the plan has full source.” Posture “already green → capture evidence” mitigates. | Plan §6 |
| **L2** | Commit message `feat(open3d): W4 orbit default ON…` in Task 02 is wrong if product already green — plan says “test-only if no product diff”; reinforce. | Task 02 Step 5 |
| **L3** | `getOpen3dViewerControlProps` return type forces `enableControls: true` only when helper used; `Lazy3DViewerProps.enableControls?` still allows opt-out — intentional; wiring unit must ban product `enableControls={false}`. | orbitDefaults + Lazy props |
| **L4** | Legacy R3F `Planner3DViewer` / J4 e2e still in repo — correctly non-goal; plan bans as proof path. | Non-goals §1.4 |

---

## Already exists (do not rebuild)

| Area | Live asset | Plan action |
|------|------------|-------------|
| Orbit defaults + helper | `orbitDefaults.ts` | Verify only |
| Lazy + Inner orbit | `ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` | Verify only unless unit red |
| Workspace layer 2 | `OOPlannerWorkspace` spread | Verify + add **unit** lock |
| View mode chrome | `TopBar` radiogroup | Read selectors only |
| Pose adapter | `buildOpen3dSceneNodes` | Regression only |
| Mesh factory + sign | `createSceneObjectFromNode` + tests | Regression only |
| Orbit construct unit | `orbitControlsDefault.test.tsx` | Do **not** create parallel `.ts` |
| Pose units | `poseContinuityW4` + `documentViewContinuity` | Harden gaps only |
| E2E W4 | `open3d-w4-orbit-continuity.spec.ts` | Harden console assert |
| Pack gate | `playwright-open3d-world-specs.json` | Non-regression |
| Scripts | `test:e2e:open3d-world`, `gate:open3d` | Use as plan notes |

---

## Residual (must close for honest W4 Done)

1. Create `results/planner/world-standard-wave/04-orbit-continuity/` + NOTES + THREE-LAYER-AUDIT + HEAD/STATUS.  
2. Capture vitest logs: pose, orbit, adapter (+ wiring once added).  
3. Add `workspaceOrbitWiring.test.ts` (cwd-relative path).  
4. Harden Playwright: `console-messages.txt` + `expect(hardAppErrors).toEqual([])` (or honest deferral, not silent).  
5. Re-run Playwright; PNGs + `browser-run.json` with **real** green status.  
6. Optionally expand `poseContinuityW4` wall matrix **or** document that C5 is owned by `documentViewContinuity` in THREE-LAYER-AUDIT.  
7. Fix agent input path: brainstormer under **`archive/Idiots2/`**.  
8. Do not flip phase PASS until artifacts exist (plan-level honesty; out of this review’s edit scope).

---

## False-green catalog (plan vs live)

| Trap | Plan handles? | Live residual? |
|------|---------------|----------------|
| Defaults alone = orbit works | Yes (Task 03) | Wiring unit still missing |
| Phase PASS without results | Yes (Task 00) | **Active** — no `results/` |
| Mesh `-rotation.y` as drift | Yes | Units assert intentional sign |
| Document→radians rewrite | Yes | Adapter tests lock degrees |
| J4 e2e | Yes | Live open3d radio grammar OK |
| Unit-only browser-green | Yes | No PNGs yet |
| Evidence under `site/results` | Yes | N/A until run |
| R3F port thrash | Yes | Stay imperative |
| Console “clean” without assert | Plan paste yes; **live no** | **Active** |
| Browser count ≠ pose ids | Under-called in plan goal | **Active** if Done overclaims |
| Left-drag optional on null box | Weak | **Active** mild |
| WAVE “no orbit” as truth | Plan: ignore as pass | OK |

---

## Score (1–10)

| Dimension | Score | Note |
|-----------|------:|------|
| Repo fidelity (product paths) | 9 | §1.1 accurate |
| Rotation / architecture lock | 9 | Degrees doc correct; beats stale phase prose |
| Three-layer orbit discipline | 8 | Product closed; proof + wiring unit open |
| Test map completeness | 8 | Right files; thin pose file; missing wiring |
| Browser honesty | 6 | Anti-J4 good; console/pose gaps |
| Evidence / anti-paper-PASS | 9 | Plan strong; disk empty validates |
| Execute thrash risk | 6 | Full-source pastes + path drift |
| Brainstormer integration | 7 | Content good; path under archive |
| **Overall** | **7.5** | Ship plan with listed fixes |

---

## Kill-order (if execute must cut)

1. **Never** mark W4 Done without `results/…/04-orbit-continuity/` real artifacts.  
2. **Never** rewrite document rotation to radians to “match” old phase prose.  
3. **Never** port open3d 3D to R3F for this gate.  
4. **Never** use J4 selectors / middle-drag / canvas-as-planner-3d-canvas.  
5. **Never** claim orbit from layer-1 defaults alone.  
6. Prefer capture evidence on **already-green** product over re-pasting product from plan.  
7. If browser blocked: honest NOTES deferral — **not** fabricated `browser-green`.  
8. Kill scope: mesh photoreal, save honesty, Fabric cutover, walk camera, competitor clone.

---

## Bottom line

**Verdict: APPROVE-WITH-FIXES.**

The plan is the right execute brief for a **mostly-landed** W4: architecture matches live open3d (document authority, imperative OrbitControls, three-layer contract, anti-J4 e2e). Highest value is **re-prove + harden**, not rewrite.

Before treating the plan as frictionless green-light for Done:

1. Treat missing `results/` and live e2e console softness as first-class work (H1 + B1).  
2. Land workspace wiring unit (H2).  
3. Point agents at `archive/Idiots2/…` and avoid thrashing thin-but-green pose units (M1–M2).  
4. Do not overclaim browser proof for entity ids/mm/rotation (H3).

Product code is in good shape for W4 intent; **proof and residual contracts** are the gate.

---

## Review method (honesty)

- Repo-first: open3d `3d/` + workspace + TopBar + unit/e2e + pack config.  
- Plan full read: `idiotplanners/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`.  
- Brainstormer: `archive/Idiots2/P04-orbit-continuity/REPORT.md` (sampled + path verified).  
- Phase/expert skim for stale vs plan conflict.  
- No product edits; no plan edits; no tests run this pass (disk structure + source truth only).
