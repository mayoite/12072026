# Hygiene — cross-cutting gates (not full phases)

**Law:** `AGENTS.md` · `plan/` phases  
Cross-cutting work that is **not** a buyer-facing phase. Run in parallel when fenced; never block
UI / Planner / Admin foundation closes.

---

## A. Owner product-truth accept (paperwork only)

Agent cannot auto-PASS. Owner-only gate.

**Outcome:** the plan names the real routes, host, code, tests, and known gaps.

**Owner accepts when all are true:**
- [ ] `/planner/guest` and `/planner/canvas` mount the live Fabric host
- [ ] No dead route or removed host (`planner-2d-canvas`) is used as product proof
- [ ] Inventory separates live, redirect, orphan, and missing work
- [ ] Public entry and core UI are browser-checked
- [ ] `hostWiringP01.test.ts` green on current HEAD:
  ```bash
  pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
  ```
- [ ] Owner says **accept** → record date in `agents-work/reports/owner-product-truth-accept.md`

No agent-authored inventory dumps.

---

## B. Dead-path / stale import cleanup

**Fence:** Do **not** land in the same PR/session as `PlannerFabricStage` wall/place fixes.

**Outcome:** tracked code and tests stop importing removed Planner hosts.

**PASS gates:**
- [ ] No test targets `planner-2d-canvas`
- [ ] No product import reaches `_archive`, `open3d`, or removed Fabric trees
- [ ] Removed URLs only redirect to `/planner/canvas/`
- [ ] No second host, compatibility shell, or fake adapter is added
- [ ] Layout, import-boundary, and targeted route tests pass

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
```

Do not delete owner data when removing dead paths. New orphans → this section (§B), not §G.

---

## C. Optional asset-engine work (admin/CLI fenced)

**Rule:** Admin/CLI paths only — never touch `PlannerFabricStage` rebuild or plan-paint semantics.

| Item | Target | Fence |
|------|--------|-------|
| Validate unify | asset-engine | Admin/CLI only |
| PNG on publish | `svgArtifactCompiler.server.ts` | Admin publish path only |
| GLB browser smoke | mesh follow-up | New e2e spec only |

Tick when done; failures → `FAILURES.md`. Not required to close foundation phases.

---

## D. Catalog SVG seam (owner lock)

**Owner lock:** Planner **renders** published SVG (`svgPlanSymbolCache`); Block2D is fallback only.
Admin **authors** catalog SVG in SVG.js only. Fabric never authors inventory symbols.

| Work | Phase |
|------|-------|
| Publish multipath + `publishMultipath.test.ts` | Admin P01 |
| Wire planner to catalog SVG | Planner P01 |
| Planner paints published SVG + HTTP multipath (`open3d-cp05-symbols-s7.spec.ts`) | Planner P01 |
| Block2D fallback when SVG missing (`open3d-p05-cabinet-multiprim.spec.ts`) | Planner P01 |
| `stages.ts` S7 publish + consume text | Admin P01 |
| `DEV_AUTH_BYPASS` buyer vs dev path | UI P02 |
| Chrome honesty notes | Planner P07 |

---

## E. Baseline reproof commands (HEAD sanity)

Run before claiming any phase green on a new checkout:

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec vitest run tests/unit/features/planner/onboarding/ --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
```

UI P02 close bar: public-entry playwright + onboarding vitest + journey spec + `hostWiringP01` 4/4.
Full brief field list lives in `UI/CHECKLIST.md` PHASE-02 and `UI/PHASE-02-onboarding-entry.md`.

---

## F. Toolbar shortcuts reproof

**Rule:** Fix docs drift and toolbar honesty tests — **never** change tool behavior just to green vitest.

- [ ] Run honesty suite **23/23** on current HEAD:
  ```bash
  pnpm --filter oando-site exec vitest run \
    tests/unit/features/planner/editor/toolShortcutTruth.test.ts \
    tests/unit/features/planner/editor/canvasToolRail.a11y.test.ts \
    tests/unit/features/planner/canvasToolPaletteAuthority.test.ts \
    --reporter=verbose
  ```
- [ ] Record status in `agents-work/reports/toolbar-shortcuts-reproof.md` if drift found
- [ ] Raw log may go to `results/planner/toolbar-shortcuts-vitest.log` (dump only)

Failures → `FAILURES.md`. Does not block foundation phase closes.

---

## G. Orphan cleanup — frozen (do not reopen)

**Status:** Bounded slice already PASS. **Do not reopen.**

**Outcome (met):** unused Planner modules were classified before removal from the tree.

**Frozen gates (reference only):**
- Import reachability checked from live routes
- Generated, test-only, removed, and product modules separated
- Removal did not change live UI or data behavior
- Targeted tests and typecheck passed at slice close

Not product-truth completion. Not a standing hygiene gate.