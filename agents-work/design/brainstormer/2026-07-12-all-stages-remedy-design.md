# All Stages Remedy — Design Spec

## STATUS (2026-07-12)

| Item | State |
|------|-------|
| Waves 0–5 | **Done** — CP-02…CP-10 PASS, P07 journey PASS, P10 handover PASS |
| Engineering gates | Closed on HEAD `4ddfa36a` |
| Active code work | **P11 only** — public brief → editable room |
| Owner paperwork | **CP-01** — accept when inventory OK; agent cannot auto-PASS |
| Execution checklist | `agents-work/design/2026-07-12-all-stages-remedy-plan.md` |

**Do not:** Re-open closed waves, write evidence packs, or refresh `results/` for CP-02…CP-10. **Do:** Run tests on HEAD if unsure; ship P11 acceptance bullets.

---

**Date:** 2026-07-12  
**Source plans:** `agents-work/design/2026-07-12-all-stages-remedy-plan.md`  
**Law:** `AGENTS.md` · `Plans/Planner-track/BOARD.md` · `Plans/Planner-track/CHECKPOINTS.md` · `Plans/Planner-track/CONSTRAINTS.md` · `site/features/planner/asset-engine/stages.ts`

**Purpose:** Decide how to sequence remedy waves across Planner CP cards (P01–P10), SVG stages (S0–S7), and mesh stages (G0–G8) without violating Fabric-sole engine lock or paper-moon PASS rules.

---

## 1. Problem statement

The Planner track has **one open buyer-facing card** (P07 / CP-07 REPROVE) while several adjacent gates show Plans drift, owner gates, or partial asset-engine stages. Remedy work must:

1. Close **W1–W2** on live `planner-fabric-stage` before claiming buyer draw/place is trustworthy.
2. Reconcile **CHECKPOINTS vs BOARD** (CP-09 today: BOARD PASS, CHECKPOINTS REPROVE).
3. Refresh **P01 product-truth** for owner accept without re-opening closed symbol work (P05 PASS).
4. Raise **S0/S5/G8** asset-engine gaps without wiring catalog SVG into plan paint.
5. Produce **P10 handover pack** only when CP-00…CP-09 statuses are honest.

**Non-negotiable architecture constraints**

| Constraint | Source | Implication |
|------------|--------|-------------|
| **Fabric sole 2D host** | P02 · CONSTRAINTS · BOARD upgrade lock | All W1–W8 proof on `PlannerFabricStage` (`data-testid="planner-fabric-stage"`). No second interactive plan canvas. |
| **No archive host proof** | CONSTRAINTS forbidden downgrade | Never prove W gates on `planner-2d-canvas` or `_archive/fabric`. |
| **SVG catalog = publish only** | P05 · stages.ts S7 | `compileSvgForPublish` → `/svg-catalog/*.svg` is inventory preview only; plan paint stays Block2D multiprim. |
| **One open Planner card** | BOARD · Agents-02-tracks | Only **P07** may be the active CP card until PASS or owner re-sequences. |
| **results/ is dump only** | AGENTS.md §5 | Evidence under `results/planner/world-standard-wave/` supports claims; PASS law = Plans + fresh commands on HEAD. |
| **No commit without owner** | AGENTS.md §3–4 | Design allows work; landing commits require explicit owner ask. |
| **RAC toolbar** | CONSTRAINTS · P09 | `react-aria-components` on `CanvasToolRail`; no Lucide, no competitor toolbar swap. |

---

## 2. Wave inventory (remedy scope)

| Wave | Primary target | Type | Blocks P07? |
|------|----------------|------|-------------|
| **0** | CP-09 CHECKPOINTS ↔ BOARD align | Plans + vitest reproof | No (docs drift only) |
| **1** | P07 / CP-07 W1–W2 journey | **Open card** | — |
| **2** | P01 / CP-01 owner accept pack | Owner gate | Yes (card sequence) |
| **3** | P01a dead-path cleanup | Code hygiene | Yes (touches canvas imports) |
| **4a** | S0 validate unify | Asset engine | Only if parallel fence holds |
| **4b** | S5 PNG on admin publish | Asset engine admin | No canvas overlap |
| **4c** | G8 generated GLB browser smoke | P08 residual | No W1/W2 overlap |
| **5** | P10 handover pack | Evidence aggregation | After Waves 0–1 honest |
| **6+** | P11–P16 buyer outcomes | Product waves | After P10 |
| **Parallel** | Excalidraw MIT leaf packages | Annotation slice (not a CP) | See excalidraw design spec |

---

## 3. Sequencing approaches

### Approach A — Strict P07-first (serial purist)

**Sequence:** Wave 1 only until CP-07 PASS → Wave 0 → Wave 5 → Wave 2 (owner) → Wave 3 → Wave 4 → Wave 6+.

**Rules**

- No file edits outside `02-browser-open3d-journey/` evidence until journey baseline VERDICT exists.
- Excalidraw, S0/S5/G8, P01a **frozen** until P07 Plans row reads PASS.
- Wave 0 deferred until after P07 to avoid “busy work” distraction.

| Pros | Cons |
|------|------|
| Cleanest compliance with “one open card” | CP-09 Plans drift lingers; misleads handover readers |
| Lowest merge conflict risk on `PlannerFabricStage.tsx` | P01a stale imports remain in tree during P07 fixes |
| Clearest accountability: one verdict at a time | Asset-engine partial stages stay red longer |
| Matches BOARD “next open: P07” literally | Owner cannot parallelize safe admin-only work |

**Best when:** P07 baseline run is **red** and wall-draw / place fixes are expected in `PlannerFabricStage.tsx` or journey helpers.

---

### Approach B — P07-first with fenced parallels (recommended)

**Sequence**

```
Immediate (same session, no card conflict):
  Wave 0 — CP-09 vitest 23/23 + CHECKPOINTS edit
  Wave 1 Task 1 — journey baseline VERDICT (no code)

If baseline PASS:
  Wave 1 Task 4 — close P07 Plans
  Wave 5 — start P10 pack (W-GATES table)
  Parallel: Wave 4b S5, Wave 4c G8, Excalidraw Tier A install+units (no Fabric annotation wire)

If baseline FAIL:
  Wave 1 Tasks 2–3 — Fabric wall/place fixes ONLY
  Freeze: P01a, Excalidraw Fabric wire, any import graph wide refactors

After P07 PASS:
  Owner picks: Wave 5 P10 complete OR Wave 2 P01 accept OR Wave 3 P01a (default: P10 per remedy plan Task 4)
  Wave 4a S0 when admin/CLI shape work is isolated from canvas
  Wave 6+ P11 entry
```

**Parallel fences (hard)**

| Parallel track | Allowed when | Forbidden when |
|--------------|--------------|----------------|
| Wave 0 CP-09 | Always | Never change tool behavior to “fix” vitest |
| Excalidraw Tier A deps + pure geometry units | Install does not modify `PlannerFabricStage` | P07 wall pointer handlers in flight |
| P01 inventory pack (read-only audit) | No owner PASS claim | Competing with P07 for same session narrative |
| P01a import cleanup | **After** P07 PASS | Same PR/session as P07 wall-draw edits |
| S0 validate | Admin/CLI paths only | Touching `PlannerFabricStage` rebuild |
| S5 PNG wire | `svgArtifactCompiler.server.ts` admin path | Plan canvas or catalog consume semantics |
| G8 browser smoke | New e2e spec only | Changing place journey helpers during P07 red |

| Pros | Cons |
|------|------|
| Honors one open **card** while clearing non-card drift (CP-09) | Requires discipline to respect fences |
| Shaves calendar time on admin/asset slices when P07 is green | If baseline FAIL, must abort parallels touching canvas |
| Aligns with BOARD “bridge” calibration (parallel when fences don’t collide) | Slightly more coordination than pure serial |
| Excalidraw can pre-position deps without promoting M/T early | Owner must explicitly approve parallel Excalidraw install |

**Best when:** Team has TDD + Chrome seats and wants 5k Fabric bar closed without marathon detours.

---

### Approach C — Broad parallel waves

**Sequence:** Run Waves 0, 1, 3, 4, and Excalidraw Phase 1–5 concurrently across subagents.

| Pros | Cons |
|------|------|
| Maximum throughput on paper | Violates “one open card” spirit |
| | High risk: P01a import changes break journey spec mid-fix |
| | False-green: PASS P07 while M/T promotion breaks P09 23/23 |
| | `hostWiringP01` regressions from overlapping canvas edits |
| | Owner review load spikes; hard to attribute failures |

**Verdict:** **Reject** for execution. Keep as anti-pattern reference only.

---

## 4. Recommendation

**Adopt Approach B — P07-first with fenced parallels.**

### Rationale

1. **BOARD law:** P07 is the only open Planner ID; Waves 0, 4b, 4c, and Excalidraw Tier A (deps-only) are not competing cards.
2. **Risk profile:** Historical P07 failures are Fabric pointer/wall-commit and catalog place CTAs — same files P01a would touch. Serializing P01a behind P07 PASS avoids collision.
3. **Honesty debt:** CP-09 CHECKPOINTS drift is a 15-minute vitest + markdown fix; leaving it red misstates W8 during P10 handover.
4. **Owner calibration:** “Bridge when fences don’t collide” matches Approach B, not Approach C.
5. **P05 closure:** Symbol quality is PASS; P07 must not re-open P05 or wire `/svg-catalog/` to canvas (regression fence).

### Default post-P07 pointer

Per remedy plan Task 4: **BOARD next-open → P10** (handover pack), not P01a — unless owner explicitly prioritizes dead-path cleanup before handover.

---

## 5. Architecture constraints (execution checklist)

Every wave agent must verify before claiming progress:

- [ ] `pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts` — 4/4 after any `features/planner/canvas/**` change.
- [ ] Grep `planner-2d-canvas` in e2e — only `toHaveCount(0)` guards or zero hits in active specs.
- [ ] `stages.ts` S7 note still says Fabric Block2D plan paint (no catalog drawImage).
- [ ] Journey spec asserts **deltas** (`wallsAfterDraw > wallsBefore`, `furnitureDelta >= 2`), not static counts.
- [ ] No new `features/planner/open3d/` product folder; routes remain `/planner/guest` · `/planner/canvas`.
- [ ] Toolbar still RAC — Excalidraw full embed not on plan routes (see excalidraw spec).

---

## 6. Testing and evidence bar per wave

| Wave | Primary command(s) | PASS bar | Evidence artifacts (under `world-standard-wave/`) |
|------|-------------------|----------|---------------------------------------------------|
| **0** | `vitest run toolShortcutTruth.test.ts canvasToolRail.a11y.test.ts canvasToolPaletteAuthority.test.ts` | **23/23** PASS | `09-shortcuts-chrome/vitest-2026-07-12.log` · CHECKPOINTS CP-09 = PASS matching BOARD |
| **1** | `playwright test open3d-world-standard-journey.spec.ts` | `wallsIncreased: true` · `openingObjectsIncreased: true` · `furnitureDelta >= 2` · **7 PNGs** | `02-browser-open3d-journey/HEAD.txt` · `VERDICT.md` · PNG set |
| **2** | `vitest run hostWiringP01.test.ts` + inventory docs | 4/4 + `INVENTORY.md` + `CONTRADICTIONS.md` complete | `00-product-truth/` — CP-01 stays REPROVE until **owner accept** |
| **3** | `rg` dead imports zero · `pnpm run build` exit 0 | No `@/features/planner/canvas-fabric` · e2e uses `planner-fabric-stage` | `00-product-truth/dead-path-cleanup/` log |
| **4a S0** | `vitest run svgS0Validate.test.ts` | `parseAdminPayload` accepts `chaise-lounge-001.json` fixture | Unit log; `stages.ts` S0 → `implemented` |
| **4b S5** | `vitest run svgPhase1Completion.test.ts` | PNG path returned on admin publish wire | `stages.ts` S5 → `partial` minimum (admin only) |
| **4c G8** | `playwright test open3d-g8-generated-glb.spec.ts` | PASS slice documented; procedural fallback named if GLB fails | `08-mesh-quality/VERDICT.md` update |
| **5** | Folder completeness audit | `README.md` + `W-GATES.md` + `HEAD.txt` + `FAILURES-SNIP.md`; README states **pack ≠ product ship** | `10-handover/` |
| **6+ P11** | Public `/planner` → setup → editable room e2e | Buyer entry not devTools-only URL | `product-wave/11…/` |

### False-green catalog (design-level blocks)

| Trap | Wave | Block |
|------|------|-------|
| Seed walls satisfy W1 | 1 | Require post-draw wall count delta |
| Furniture count without cabinet-v0 | 1 | Require named CTAs + second SKU |
| CP-07 PASS without journey spec | 1 | Task 1 baseline mandatory |
| CP-10 PASS while CP-07 REPROVE | 5 | W-GATES must copy honest CHECKPOINTS |
| S7 catalog wired to Fabric | 4 | Admin publish only; P05 regression test |
| Second plan host | all | `hostWiringP01` gate |

---

## 7. Owner decisions needed

| # | Decision | Options | Default if silent | Impact |
|---|----------|---------|-------------------|--------|
| **OD-1** | Post-P07 next card | **A)** P10 handover · **B)** P01 owner accept · **C)** P01a dead-path | **A — P10** per remedy plan | BOARD next-open pointer · handover timing |
| **OD-2** | Parallel tracks during P07 | **A)** Wave 0 only · **B)** Wave 0 + Excalidraw Tier A deps · **C)** strict serial (Approach A) | **B** with fences | Calendar time vs collision risk |
| **OD-3** | CP-01 PASS authority | Owner explicit “accept inventory pack” vs agent REPROVE with pack ready | REPROVE until owner says accept | CP-01 cannot auto-PASS |
| **OD-4** | Commit batches | Per-wave commits (plan §11) vs single squash vs no commit | No commit | Git history |
| **OD-5** | P11 entry timing | Start after P10 PASS vs waive P10 for buyer sprint | After P10 complete | Buyer-visible milestones |

---

## 8. Success criteria (design complete when)

1. **Sequencing:** Executing agent can start Wave 1 Task 1 without ambiguity; parallel fences are explicit.
2. **Architecture:** No design step proposes second plan host, archive proof, or catalog plan-draw.
3. **Evidence:** Each wave has named command, numeric bar, and folder path.
4. **Drift:** Wave 0 explicitly closes CP-09 CHECKPOINTS vs BOARD mismatch.
5. **Handover:** Wave 5 cannot complete until CP-07 status is honest (PASS or named REPROVE with VERDICT).
6. **Regression:** P05 PASS is treated as closed; P07 does not re-open symbol quality.

---

## 9. Self-review

| Check | Result |
|-------|--------|
| Three approaches documented (P07-first serial, fenced parallel, broad parallel) | ✅ |
| Recommendation stated with trade-offs | ✅ Approach B |
| Fabric sole + no second host explicit | ✅ §1, §5 |
| Owner decisions listed (no TBD) | ✅ §7 OD-1…OD-5 |
| Per-wave test/evidence bars | ✅ §6 |
| False-green catalog | ✅ |
| Aligns with stages.ts honest status | ✅ S0 partial, S5 stub, G8 partial |
| Sibling plans referenced (P05, Excalidraw) | ✅ |
| No TBD placeholders | ✅ |
| No code implementation in this doc | ✅ design only |

---

## 10. Handoff to execution

**Start command (Wave 1 baseline, no code):**

```bash
git rev-parse HEAD > results/planner/world-standard-wave/02-browser-open3d-journey/HEAD.txt
pnpm --filter oando-site exec playwright test \
  tests/e2e/open3d-world-standard-journey.spec.ts \
  -c config/build/playwright.config.ts \
  --reporter=list
```

**Parallel safe immediately:** Wave 0 vitest + CHECKPOINTS CP-09 row edit.

**Execution plan:** `agents-work/design/2026-07-12-all-stages-remedy-plan.md`