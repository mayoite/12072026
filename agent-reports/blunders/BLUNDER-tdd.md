# Blunder report — TDD / test discipline

**Agent:** tdd-review (general-purpose)  
**Date:** 2026-07-18  
**Scope:** Planner editor + Admin SVG parametric/shell  
**Not PASS proof.** Fresh vitest: 15 files / 73 tests PASS in session — **≠ C3/C4**.

## Blunders found

### P0 — false confidence

1. **Form tests mock Maker to a grey rect**  
   - Path: `LinearDeskParametricForm.test.tsx`  
   - Blunder: “preview multipath” cannot fail; STUB-MAKER.

2. **No form → publish payload unit chain**  
   - Blunder: width 1600 / guest slug / SKU not asserted from Publish click.

3. **No place → BOQ identity unit for parametric desk**  
   - Path: `placementAction.test.ts` places chair only.  
   - Blunder: C4 identity first fails in browser only.

4. **proof* tests env-coupled to disk catalog**  
   - Paths: `proofSlugLoad`, `proofGuestFilter`  
   - Blunder: `> 0` + console dumps; soft pass on polluted disk; isolation spirit violated.

### P1

5. **AdminSvgDockHost never tested** — always `vi.mock` stub.  
6. **PlannerDockHost never tested** — presets covered, host not.  
7. **Catalog status pure ≠ inventory status-bar E2E unit.**

## Hollow risks

| Risk | Where |
|------|--------|
| STUB-MAKER | Form preview |
| STUB-DOCK | Shell + form |
| ENV-CATALOG | proof* |
| Thin place | placementAction |

## Recommended next 5 units (TDD order)

1. Form live Maker preview 1600 mm multipath  
2. Form Publish → action args  
3. Place fixture desk → BOQ name/SKU  
4. Guest filter + plan SVG pure fixture (kill disk proof*)  
5. Dock host or seed layout contract  

## Parent rule

**73 green units do not equal C3 or C4 PASS.** Browser gates remain OPEN by plan.
