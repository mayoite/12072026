# Hygiene — cross-cutting gates (not full phases)

**Law:** `AGENTS.md` · `plan/` phases  
**Purpose:** Cross-cutting items that are **not** buyer-facing phases but must not be lost. Run in
parallel with foundation phases when fenced; never block UI/Planner/Admin work.

---

## A. CP-01 — Owner product-truth accept (paperwork only)

Agent cannot auto-PASS. Owner-only gate.

**Product-truth outcome:** the plan names the real routes, host, code, tests, and known gaps.

**Owner reads and accepts when all are true:**
- [ ] `/planner/guest` and `/planner/canvas` mount the live Fabric host
- [ ] No dead route or removed host (`planner-2d-canvas`) is used as product proof
- [ ] Inventory separates live, legacy redirect, orphan, and missing work
- [ ] Public entry and core UI are browser-checked
- [ ] `hostWiringP01.test.ts` green on current HEAD:
  ```bash
  pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
  ```
- [ ] Owner says **accept** → record date in `agents-work/reports/cp-01-owner-accept.md`

No agent-authored inventory dumps.

---

## B. P01a — Dead-path / stale import cleanup

**Fence:** Do **not** land in the same PR/session as `PlannerFabricStage` wall/place fixes.

**Outcome:** tracked code and tests stop importing removed Planner hosts.

**PASS gates:**
- [ ] No test targets `planner-2d-canvas`
- [ ] No product import reaches `_archive`, `open3d`, or removed Fabric trees
- [ ] Legacy URLs only redirect to `/planner/canvas/`
- [ ] No second host, compatibility shell, or fake adapter is added
- [ ] Layout, import-boundary, and targeted route tests pass

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
```

Do not delete owner data when removing dead paths.

---

## C. Asset-engine optional waves (admin/CLI fenced)

**Rule:** Admin/CLI paths only — never touch `PlannerFabricStage` rebuild or plan-paint semantics.

| Wave | Target | Fence |
|------|--------|-------|
| **S0** | Validate unify in asset-engine | Admin/CLI only |
| **S5** | PNG on admin publish (`svgArtifactCompiler.server.ts`) | Admin publish path only |
| **G8** | Generated GLB browser smoke (P08 residual) | New e2e spec only |

Tick when done; failures → `FAILURES.md`. Not required to close UI/Planner/Admin foundation phases.

---

## D. Catalog SVG in the planner (owner lock + task routing)

**Owner lock:** Planner **renders** published SVG (`svgPlanSymbolCache`); Block2D is fallback only.
Admin **authors** catalog SVG in SVG.js only. Fabric never authors inventory symbols.

| Work item | Home in `plan/` |
|-----------|-----------------|
| Publish multipath + `publishMultipath.test.ts` | Admin PHASE-01 |
| Wire planner to catalog SVG | Planner PHASE-01 |
| `open3d-cp05-symbols-s7.spec.ts` — planner paints published SVG + HTTP multipath | Planner PHASE-01 |
| `open3d-p05-cabinet-multiprim.spec.ts` — Block2D fallback when SVG missing | Planner PHASE-01 |
| `stages.ts` S7 text — catalog publish + planner consume | Admin PHASE-01 |
| Canvas route / `DEV_AUTH_BYPASS` buyer vs dev path | UI PHASE-02 |
| Chrome honesty notes | Planner P07 |

---

## E. Baseline reproof commands (HEAD sanity)

Run before claiming any phase green on a new checkout:

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec vitest run tests/unit/features/planner/onboarding/ --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
```

UI P02 bar: public-entry playwright green + onboarding vitest green + journey spec green +
`hostWiringP01` 4/4. Full brief scope → [UI PHASE-02](./UI/PHASE-02-onboarding-entry.md).

---

## F. CP-09 shortcuts/chrome reproof

**Rule:** Fix docs drift and toolbar honesty tests — **never** change tool behavior just to green vitest.

- [ ] Run honesty suite **23/23** on current HEAD:
  ```bash
  pnpm --filter oando-site exec vitest run \
    tests/unit/features/planner/editor/toolShortcutTruth.test.ts \
    tests/unit/features/planner/editor/canvasToolRail.a11y.test.ts \
    tests/unit/features/planner/canvasToolPaletteAuthority.test.ts \
    --reporter=verbose
  ```
- [ ] Record honest status in `agents-work/reports/cp-09-shortcuts-reproof.md` if checklist drift found
- [ ] Log unit output path in report; raw log may go to `results/planner/cp-09-vitest.log` (dump only)

Failures → `FAILURES.md`. This wave does not block UI/Planner/Admin foundation phases.

---

## G. P01b — Orphan cleanup (PASS slice — do not reopen)

**Status:** Bounded cleanup slice already PASS. **Do not reopen** this card.

**Outcome (already met):** unused Planner modules were classified before removal.

**PASS gates (frozen):**
- Import reachability checked from live routes
- Generated, test-only, legacy, and product modules separated
- Removal did not change live UI or data behavior
- Targeted tests and typecheck passed at slice close

**Rule for new work:** any **new** orphan or stale import → **P01a** (§B), not P01b.
P01b is not product-truth completion and is not a standing hygiene gate.