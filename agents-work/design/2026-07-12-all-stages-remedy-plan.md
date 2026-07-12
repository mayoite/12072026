# All Stages Remedy — Execution Checklist

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox syntax only.

**Goal:** Ship **P11** buyer brief/room on live Fabric. **CP-01** closes on owner accept only.

**Law:** `AGENTS.md` · `Plans/Planner-track/BOARD.md` · `CHECKPOINTS.md` · `CONSTRAINTS.md`  
**HEAD:** `4ddfa36a` (2026-07-12) · Fabric sole · no commit without owner

---

## Done — do not reopen

| Gate | Status |
|------|--------|
| CP-02 … CP-10 | **PASS** (incl. P07 W1–W2, P10 handover pack) |
| P01b | DONE slice |
| Waves 0–5 | Closed — CP-09 aligned, journey green, handover complete |

If unsure on HEAD: run tests below. **Do not** refresh `results/` folders or write VERDICT packs for closed waves.

---

## Open work (only these)

### A. CP-01 — Owner accept (paperwork)

- [ ] Owner reads `Plans/Planner-track/P01-product-truth.md`
- [ ] Confirm `hostWiringP01.test.ts` green on HEAD
- [ ] Owner says **accept** → agent sets CHECKPOINTS CP-01 **PASS**

No agent-authored inventory dumps. No auto-PASS.

---

### B. P11 — Project brief / room (**active code**)

**Card:** `Plans/Planner-track/P11-project-brief-room.md`  
**Gap audit:** `results/planner/product-wave/11-project-brief-room/GAP.md`  
**Host:** `planner-fabric-stage` only

- [ ] **B1 — Public entry e2e** (no `?plannerDevTools=1`)
  - `/planner/` → guest CTA → complete `ProjectSetupGate` → canvas visible
  - Spec: new or extend `planner-onboarding-ws2.spec.ts` / `navigation-smoke.spec.ts` pattern
- [ ] **B2 — Reload ID continuity** — brief-derived shell openings/columns keep IDs after hard reload (browser)
- [ ] **B3 — Honest storage labels** — guest chip + TopBar wording consistent (`workspaceStatusLabels`, `PlannerSessionDialog`)
- [ ] **B4 — Keyboard + 375px** — tab through setup fields; room renders on narrow viewport
- [ ] **B5 — Scope gaps** — client / budget / template path: implement or document intentional omission in P11 card
- [ ] **B6 — Close card** — all five acceptance bullets green → BOARD next-open **P12**

**Parallel (optional, non-blocking):** P01a stale import cleanup · Excalidraw leaf plan · asset-engine S0/S5/G8 — only if fenced from P11 onboarding files.

---

## Proof commands (HEAD)

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
pnpm --filter oando-site exec vitest run tests/unit/features/planner/onboarding/ --reporter=verbose
```

P11 bar: public-entry playwright green + onboarding vitest green + `hostWiringP01` 4/4 after canvas/onboarding edits.

---

## False-green blocks

| Trap | Block |
|------|-------|
| DevTools URL as buyer proof | Start `/planner/` only |
| Guest skips brief wizard | `ProjectSetupGate` must gate guests |
| Archive `planner-2d-canvas` | `hostWiringP01` + fabric stage visible |
| Second plan host | CONSTRAINTS forbidden |
| Re-closing CP-02…CP-10 with evidence theater | Run tests; Plans rows already PASS |

---

**Start:** P11 Task B1 (public entry e2e). CP-01 waits on owner.