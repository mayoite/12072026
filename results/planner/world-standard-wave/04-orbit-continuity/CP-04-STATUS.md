# CP-04 STATUS — product vs plan rating split

| Field | Value |
|-------|--------|
| **Checkpoint** | CP-04 (W4 Orbit Continuity) |
| **Date** | 2026-07-10 |
| **Seat** | P04 three-layer audit + coherent pack |
| **Tip at write** | `bb0531685e7e714acb6026d0afcb214ba6e68f7a` |
| **Evidence** | `results/planner/world-standard-wave/04-orbit-continuity/` |
| **Bar** | NO PAPER MOON · plan rating ≠ product claim |

---

## Split (do not collapse)

| Axis | Rating / status | Meaning |
|------|-----------------|---------|
| **Plan / execute brief** | **APPROVE-WITH-FIXES · 7.5 / 10** | From `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md`. Plan is a good **verify + harden + re-prove** brief for mostly-landed product. **Not a ship certificate.** |
| **Product / W4 gate** | **open · claim NO** | Hard gate: unit **and** browser green on **same tip**. Not locked at audit write. |
| **Phase-card historical** | **paper PASS** | `Plans/phases/P04-orbit-continuity/P04-orbit-continuity.md` **PASS 2026-07-09** is paper until dual-green pack on tip. |
| **CP-04 ship** | **OPEN** | Do not mark checkpoint PASS. |

---

## Product scoreboard (honest)

| Row | Verdict | Notes |
|-----|---------|-------|
| Layer 1 defaults ON | **CLOSED** (product) | ThreeViewerInner L68 · ThreeLazyViewer L145 · orbitDefaults L7 |
| Layer 2 workspace wiring | **CLOSED** (product) | OOPlannerWorkspace L1057–1060 `{...getOpen3dViewerControlProps()}` |
| Layer 3 unit deposit | **GREEN deposit** | 34/34 @ `b8109733…` — not same-tip locked with browser |
| Layer 3 browser deposit | **GREEN deposit** | Playwright 1 passed + PNGs + `browser-run.json` browser-green — **no HEAD pin** |
| Layer 3 same-tip dual-green | **OPEN** | Blocks overall pass |
| Degrees document honesty | **CLOSED** (product) | degrees doc → rad nodes; do not rewrite document |
| Console hard assert in e2e | **OPEN residual** | soft count only; no `console-messages.txt` fail-closed |
| Buyer ids/mm/rotation in browser | **Unit-only** | Browser proves count + orbit attr (H3) |

---

## Plan scoreboard (not product)

| Plan item | Status vs live |
|-----------|----------------|
| Three-layer rule | Correct — enforced in this pack |
| Evidence under root `results/…/04-` | Folder now populated |
| Paper PASS ban | Applied — overall `open` |
| Layer-2 wiring unit | Landed (`workspaceOrbitWiring.test.ts`) |
| Hard console e2e | Still weaker than plan paste (residual) |
| Full pose matrix in one unit file | Thin `poseContinuityW4`; C5-class in `documentViewContinuity` |

**Plan 7.5 APPROVE-WITH-FIXES does not authorize product PASS.**

---

## Overall

| Claim | Truth |
|-------|--------|
| Plan ready to execute / mostly correct | **YES** (7.5 AWF) |
| Product layers 1–2 landed | **YES** |
| Unit packs deposited green | **YES** (stale tip relative to audit tip) |
| Browser Playwright deposited green | **YES** (unpinned HEAD) |
| **W4 / CP-04 product PASS** | **NO — open** |
| Phase-card PASS 2026-07-09 | **PAPER** |

**Bottom line:** Product architecture for orbit + pose continuity is largely landed and partially re-proved. Coherent pack status is **`open`** until unit+browser are both green on **one** pinned tip. Raise the bar — do not lower it to paper PASS.
