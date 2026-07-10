# CODE-REVIEW-REPORT — P04 Orbit Continuity (idiotplanners2)

| Field | Value |
|-------|--------|
| **Phase** | P04 Orbit Continuity (idiotplanners2) |
| **Date** | 2026-07-10 |
| **Reviewer** | Code-review agent (repo-first; no product edits; no plan edits) |
| **Plan under review** | `D:\OandO07072026\idiotplanners2\P04-orbit-continuity\IMPLEMENTATION-PLAN.md` |
| **HEAD (review scan)** | `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` |
| **Branch** | `main...origin/main` (dirty: Plans/Others moves, untracked `idiotplanners2/`, archives) |
| **Scope** | Plan + live product/tests vs disk — **not** an execute pass |

---

## Verdict

**FAIL / NOT PROVEN for CP-04 Done · APPROVE plan posture for verify-first execute**

- **Product code (layers 1–2 + degrees adapter + e2e shape):** largely **landed** and consistent with the plan’s §1 repo table.
- **Unit suites (this review re-ran):** **13/13 PASS** across pose, document continuity, orbit construct/attr, and W4 manifest gate.
- **Evidence / CP-04 Done:** **FAIL** — entire `results/` tree **absent**. Phase card “W4 PASS 2026-07-09” is **paper**. Per plan law and user rule: **`results/` missing = unproven**.

Do **not** mark W4 Done. Do **not** greenfield-rewrite product. Execute Task 00 → capture unit logs → Playwright (or honest owner deferral) → fill THREE-LAYER-AUDIT from code + artifacts.

---

## Executive summary

W4 (orbit default ON + 2D↔3D pose continuity) is **architecturally closed in source**:

1. **Layer 1:** `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; Lazy + Inner default `enableControls` from that constant.  
2. **Layer 2:** `OOPlannerWorkspace` mounts `<Lazy3DViewer projectData={…} {...getOpen3dViewerControlProps()} />`.  
3. **DOM truth:** `data-orbit-enabled` on `three-viewer-container`; `planner-3d-canvas` is a **div** on Lazy.  
4. **Pose law:** document furniture rotation = **degrees**; `buildOpen3dSceneNodes` → radians; mesh `rotation.y = -node.rotation` intentional.  
5. **Tests exist:** `poseContinuityW4`, `documentViewContinuity`, `orbitControlsDefault.test.tsx`, adapter/mesh suites, `open3d-w4-orbit-continuity.spec.ts`, pack `gates.W4`.

The **idiotplanners2 plan is the right job** for this disk: verify-first, paper-PASS ban, degrees honesty, anti-J4, no R3F thrash, evidence only under root `results/…/04-orbit-continuity/`. It already records that product is mostly done and `results/` is gone.

**What blocks Done:** no NOTES, no THREE-LAYER-AUDIT, no vitest/playwright logs, no PNGs, no `browser-run.json`. Layer-3 proof is not closed. Optional layer-2 source unit still missing. Browser contract remains **count proxy** + attr + soft left-drag (plan admits this).

---

## Repo truth table

| Claim (plan / phase) | Live path / check | Status |
|----------------------|-------------------|--------|
| Orbit default constant + helper | `site/features/planner/open3d/3d/orbitDefaults.ts` | **EXISTS** — `true as const`; `{ enableControls: true }` |
| Lazy defaults ON; `data-testid="planner-3d-canvas"` on **div** | `ThreeLazyViewer.tsx` | **EXISTS** |
| Inner OrbitControls + damping 0.08 + polar clamp + min/max 1/40 + `data-orbit-enabled` | `ThreeViewerInner.tsx` | **EXISTS** — no product `autoRotate` |
| Workspace spreads helper + live `projectData` | `OOPlannerWorkspace.tsx` ~L1010–1013 | **EXISTS** — layer 2 closed |
| TopBar 2D \| 3D radios | `TopBar.tsx` `role="radio"` | **EXISTS** |
| Adapter degrees → node radians | `buildOpen3dSceneNodes.ts` | **EXISTS** |
| Mesh sign flip | `createSceneObjectFromNode.ts` (4 sites `rotation.y = -node.rotation`) | **EXISTS** |
| Degrees helpers | `model/units.ts` `normalizeDegrees` / `degreesToRadians` | **EXISTS** |
| Orbit unit (construct + attr + helper) | `orbitControlsDefault.test.tsx` | **EXISTS** (`.tsx` not `.ts`) |
| Pose W4 double rebuild | `poseContinuityW4.test.ts` | **EXISTS** — one `it` (furniture double rebuild + deg immutability) |
| Wall + furniture + pose update | `documentViewContinuity.test.ts` | **EXISTS** — complementary (not double-rebuild pair) |
| Adapter / mesh units | `buildOpen3dSceneNodes.test.ts`, `createSceneObjectFromNode.test.ts` | **EXISTS** (deg→rad + mesh sign cases) |
| Workspace layer-2 source unit | `workspaceOrbitWiring.test.ts` | **MISSING** (plan optional Task 04b) |
| Playwright W4 | `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | **EXISTS** — anti-J4 radios; Place 4 seats; attr; left-drag; count; evidence under `../results/…/04-orbit-continuity/` |
| Manifest `gates.W4` | `playwright-open3d-world-specs.json` + `playwrightOpen3dWorldSpecs.test.ts` | **EXISTS** |
| Evidence folder | `results/planner/world-standard-wave/04-orbit-continuity/` | **ABSENT** — entire `results/` missing; `site/results` also absent (layout OK) |
| Phase header W4 **PASS** 2026-07-09 | `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` L5–10 | **PAPER** vs disk |
| Expert pass “omit enable at workspace” | same phase file L20 | **STALE** vs live spread helper |
| Phase arch “document + nodes = radians” | phase ~L62 (older body) / expert mixed | **FALSE** for furniture doc; live = deg doc / rad nodes (plan §1.7 wins) |
| Brainstormer `Idiots/P04-orbit-continuity/REPORT.md` | live `Idiots/` | **MISSING** — content at `archive/Idiots/…` (and `archive/Idiots2/…`) |
| No product `autoRotate=true` | grep open3d | **CLEAN** |
| No product `enableControls={false}` in editor | grep editor | **CLEAN** (only unit opt-out) |
| Unit re-run this review | vitest 4 files | **13/13 PASS** (session live; **not** a durable `results/` artifact) |

### Three-layer status (product vs proof)

| Layer | Requirement | Product | Proof under `04-orbit-continuity/` |
|-------|-------------|---------|-------------------------------------|
| 1 Defaults | Lazy + Inner ON | **Closed** | **Missing** logs |
| 2 Workspace | explicit helper spread | **Closed** in source | **No** wiring unit / no AUDIT file |
| 3 Proof | units + Playwright + artifacts | Specs present; units green when run | **Open** — folder absent |

---

## Findings

### Blocking (B)

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **`results/` absent → CP-04 unproven.** No NOTES, THREE-LAYER-AUDIT, HEAD/STATUS, vitest raw logs, Playwright PNGs, or `browser-run.json`. Done criteria in plan §Done when / Task 07 require re-prove. | `Test-Path results` → false; phase points at empty path |
| **B2** | **Phase status table claims W4 PASS + browser green + three-layer audited.** Disk cannot support those rows. Inheriting header PASS is a process false-green. | `P04-orbit-continuity.md` L5–10 |
| **B3** | **Browser gate not re-proven on this tree.** Spec is correct shape; no run artifacts. Without Playwright green **or** owner-written deferral in NOTES, “Done (W4)” is blocked. | Plan Task 06 Done when (a)/(b); no NOTES on disk |

### High (H)

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | **Browser continuity is furniture-count proxy**, not UUID + mm + degrees. Goal language (“same entity ids / mm position / document rotation”) is **unit-proven only**. Acceptable only if NOTES admit; overclaim = false Done. | e2e `furnitureCount` body regex; units own pose equality |
| **H2** | **Left-drag is soft.** If `boundingBox()` is null, drag is skipped; test still passes on attr + remount. Weak for “left-drag without crash.” | e2e L72–81 |
| **H3** | **Console honesty is non-failing.** Spec filters errors into `consoleErrorCount` in JSON but does **not** `expect(hardAppErrors).toHaveLength(0)`. Can write `status: "browser-green"` with non-zero hard errors. | e2e L111–140 |
| **H4** | **Layer-2 regression fence missing.** Silent delete of `{...getOpen3dViewerControlProps()}` still “works” via layer-1 defaults — classic three-layer false-green until workspace unit or AUDIT+code re-read. Plan optional Task 04b is the cheap fence. | no `workspaceOrbitWiring.test.ts`; product L1012 still wired |
| **H5** | **Brainstormer input path broken for execute agents.** Plan cites `Idiots/P04-orbit-continuity/REPORT.md` only; live path is `archive/Idiots/…` (plan inlines decisions — residual open risk). | path check 2026-07-10 |

### Medium (M)

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | **Double-rebuild wall+furniture matrix not co-located.** `poseContinuityW4` = furniture double rebuild; `documentViewContinuity` = wall+furniture after pose update (single rebuild after). Plan Task 01b optional if “already covered” — borderline; one combined case still raises bar. | both test files live |
| **M2** | **Stale phase/expert prose still in tree.** “omit at OOPlannerWorkspace”, “no data-orbit”, mixed radians wording. Plan correctly says repo wins; agents who start at phase card can thrash. | phase L20, suggestions, older body |
| **M3** | **Session unit green ≠ evidence.** Review re-ran vitest green; without Tee/logs under `04-orbit-continuity/`, P10 harvest still fails. | AGENTS evidence law |
| **M4** | **Furniture count via `body` innerText** can false-pass/fail if chrome copy changes (“N furniture”). Known proxy. | e2e helper |
| **M5** | **Task 07 commit message** `feat(open3d): W4 orbit continuity…` risks product thrash commit when only evidence/tests change — plan elsewhere says skip if no product diff. | Task 07 Step 5 |

### Low (L)

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | Orbit unit does not assert damping 0.08 / polar / distances on mock instance — only construct + attr. Product has correct values; proof is partial. | `orbitControlsDefault.test.tsx` vs Inner L177–182 |
| **L2** | Filename discipline: always `.tsx` for orbit unit (plan notes correctly). | live path |
| **L3** | Plan is long with full source pastes — good lock file; thrash risk if execute rewrites green product to match paste. Posture “already green → capture” mitigates. | IMPLEMENTATION-PLAN Task 00–06 |
| **L4** | Legacy J4 / R3F paths remain in repo as non-goals — correctly banned. | `planner-j4-3d-parity.spec.ts`, `Planner3DViewer.tsx` |

---

## Already exists (do not rewrite)

| Asset | Path |
|-------|------|
| Orbit defaults + typed helper | `site/features/planner/open3d/3d/orbitDefaults.ts` |
| Lazy viewer + div testid | `ThreeLazyViewer.tsx` |
| Inner OrbitControls + attr | `ThreeViewerInner.tsx` |
| Workspace layer 2 | `OOPlannerWorkspace.tsx` |
| Scene adapter | `buildOpen3dSceneNodes.ts` |
| Mesh factory + sign | `createSceneObjectFromNode.ts` |
| Units | `model/units.ts` |
| Orbit unit | `tests/unit/.../orbitControlsDefault.test.tsx` |
| Pose W4 unit | `poseContinuityW4.test.ts` |
| Document continuity | `documentViewContinuity.test.ts` |
| Adapter / mesh units | `buildOpen3dSceneNodes.test.ts`, `createSceneObjectFromNode.test.ts` |
| Playwright W4 | `tests/e2e/open3d-w4-orbit-continuity.spec.ts` |
| Pack gate | `config/build/playwright-open3d-world-specs.json` |
| Implementation plan (this program) | `idiotplanners2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md` |

**Live unit proof (review session only — not evidence folder):**

```
npx vitest run poseContinuityW4 + documentViewContinuity + orbitControlsDefault + playwrightOpen3dWorldSpecs
→ Test Files 4 passed | Tests 13 passed
```

---

## Residual (execute still must do)

1. **Task 00** — create `results/planner/world-standard-wave/04-orbit-continuity/` + NOTES + THREE-LAYER-AUDIT + HEAD/STATUS.  
2. **Task 01–02–05** — capture pose / orbit / adapter vitest logs (and run.json) under that folder.  
3. **Task 03–04** — fill audit rows from live code; optional `workspaceOrbitWiring.test.ts`.  
4. **Task 06** — Playwright W4 → PNGs + `browser-run.json` + raw log **or** owner deferral language in NOTES.  
5. **Task 07–08** — honest CP-04 vocabulary; layout check; no paper PASS.  
6. **Optional 01b / 06b** — wall+furniture double-rebuild co-test; pose browser harness — raise bar, not rewrite.

---

## False-green catalog (active on this disk)

| Trap | Active? | Notes |
|------|---------|-------|
| Phase header **PASS** without `results/` | **YES — active** | B1/B2 |
| Defaults alone = orbit product | Mitigated in source; **proof open** | Layer 2 present; layer 3 missing |
| Unit-green session = Done | **Risk if claimed** | Review ran units; no durable logs |
| `browser-green` JSON with console errors | **Spec-capable** | H3 non-assert |
| Count proxy sold as id/mm/deg browser proof | **Risk** | H1 |
| Soft left-drag skip | **Spec-capable** | H2 |
| THREE-LAYER-AUDIT prose-only | **N/A yet** | file missing |
| Document rotation === node.rotation raw | Guarded by units | degreesToRadians |
| Mesh `-rotation.y` as drift | Guarded by mesh unit + plan NOTES template | intentional |
| J4 selector reuse | Spec clean | radios not buttons |
| Expert “omit enableControls” | **Stale doc risk** | product already wires |
| Evidence under `site/results` | **Not present** | good |

---

## Score

| Dimension | Score (0–10) | Note |
|-----------|--------------|------|
| Plan honesty / posture (idiotplanners2) | **9** | Repo-first; paper PASS ban; verify not rewrite |
| Product three-layer code | **9** | Layers 1–2 closed; orbit params sensible |
| Pose / units architecture | **9** | Degrees doc / rad nodes locked |
| Unit test coverage (code) | **8** | Green; matrix slightly split; no layer-2 source unit |
| Browser contract quality | **6.5** | Right selectors; count proxy + soft drag + soft console |
| Evidence / Done readiness | **0** | `results/` absent |
| Phase card honesty | **2** | PASS rows contradict disk |
| **Overall CP-04 ship / Done** | **2.5** | Code ready; proof not |

**Plan-as-execute-guide: ~8.5/10.**  
**W4 product-proven Done: 0 until `04-orbit-continuity/` re-proved.**

---

## Kill-order (executor — this review does not implement)

1. **Task 00** evidence scaffold + NOTES honesty (record paper phase PASS; re-prove).  
2. Capture **pose + orbit + adapter** vitest logs into `04-orbit-continuity/`.  
3. Run **Playwright** W4; keep PNGs + `browser-run.json`; if blocked, owner-written deferral only.  
4. Fill **THREE-LAYER-AUDIT** from code paths + log paths (regeneratable).  
5. Optional cheap: **workspaceOrbitWiring** source contract; assert `hardAppErrors.length === 0` or write `console-messages.txt` on fail.  
6. Optional raise: Task 01b combined wall+furniture double rebuild; Task 06b pose fields in browser.  
7. **Do not:** document→radians rewrite; R3F port; J4 thrash; claim Done from phase header; invent RED by breaking green product.

---

## Bottom line

**Path:** `D:\OandO07072026\idiotplanners2\P04-orbit-continuity\CODE-REVIEW-REPORT.md`

**Verdict:** **FAIL / NOT PROVEN for CP-04 Done** — product three-layer + degrees adapter + unit/e2e **shape** are real; **`results/` missing = unproven**. Plan posture is **APPROVE for verify-first execute**.

### Top 3

1. **Re-create and re-prove** `results/planner/world-standard-wave/04-orbit-continuity/` (units + Playwright or written deferral) — refuse any PASS without it.  
2. **Do not thrash product** — layers 1–2 and adapter are already green; execute is capture + harden gaps.  
3. **Honesty gaps to close while proving:** count-proxy / soft console / soft left-drag / missing layer-2 unit — document or cheap-fix so Done cannot overclaim browser pose or silent workspace opt-out.
