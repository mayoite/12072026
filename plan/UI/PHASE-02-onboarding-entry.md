# PHASE-02 — Public buyer entry + brief/room

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser (public entry, no dev flags)

---

## In plain words
A first-time buyer should be able to go to the public planner URL, complete a short project
brief and room setup, and land in a working Fabric canvas — **without any developer flags or
hidden URLs**. The brief captures project context (client, location, seats, work mode, budget);
the room captures dimensions, openings, columns, and keep-out zones. They may start blank or
from an owned template. Millimetres stay the document authority even when the UI shows imperial.
Today the real workspace is often reached via a dev-tools URL or a member wizard, which isn't a
real buyer path.

## Why this matters
This is the front door. If a buyer can't start from `/planner/` and reach a room, nothing else
matters. Dev-tools URLs are **not** valid buyer proof.

## Outcome
A first-time buyer creates and reloads an editable room from the public Planner entry.

## What exists today (grounded in code)
- `app/planner/(workspace)/canvas/page.tsx` — `guestMode = !user`; `DEV_AUTH_BYPASS` currently
  forces a member setup wizard, which confuses the buyer path.
- `ProjectSetupGate` — the brief/room wizard that should gate guests.
- `workspaceStatusLabels.ts`, `PlannerSessionDialog.tsx` — storage label honesty.
- Specs to extend: `planner-onboarding-ws2.spec.ts`, `navigation-smoke.spec.ts`.
- Brief scope gaps still open: client, location, seats, work mode, budget, columns, keep-out
  zones, template vs blank, mm-under-imperial display.

## Brief + room scope

| Area | Fields | PASS bar |
|------|--------|----------|
| **Brief** | project name, client, location, seats, work mode, budget, units | captured in wizard or documented omission |
| **Room** | width, depth, doors, windows, columns, keep-out zones | survive hard reload with stable IDs |
| **Start** | blank canvas or owned template | path honest — no fake template picker |
| **Units** | mm document authority | metric or imperial **display** does not corrupt stored mm |
| **UI gates** | one short wizard, plain defaults, inline correction | full keyboard path, visible focus, no mouse-only control |
| **Layout** | 375×812 + desktop | main action visible without scroll hunt |

## PASS gates
- Public `/planner` → setup → live Fabric room. No dev flags.
- Brief, dimensions, openings, constraints, and IDs survive hard reload.
- Millimetres remain document authority under metric or imperial display.
- Browser proof covers keyboard setup, mobile, reload, and screenshots.

## Steps
1. **Public entry e2e:** `/planner/` → guest CTA → `ProjectSetupGate` → canvas, no dev flags.
2. **Reload ID continuity:** brief-derived openings, columns, and keep-out zones keep IDs after hard reload.
3. **Honest storage labels:** guest chip + TopBar + `PlannerSessionDialog` consistent.
4. **Keyboard + 375px:** tab through setup fields; room renders on narrow viewport.
5. **Brief field gaps:** client, location, seats, work mode, budget, columns, keep-out zones,
   template vs blank — implement or document intentional omission in report.
6. **Dev route docs:** document `DEV_AUTH_BYPASS` vs buyer path on the canvas route.
7. **Units honesty:** confirm mm values unchanged when toggling imperial display (reload proof).

## False-green traps

| Trap | Block |
|------|-------|
| DevTools URL as buyer proof | Start `/planner/` only |
| Guest skips brief wizard | `ProjectSetupGate` must gate guests |
| Removed `planner-2d-canvas` host | `hostWiringP01` + fabric stage visible |
| Second plan host | Owner lock — forbidden |

## Done when
Boxes in `plan/UI/CHECKLIST.md` → PHASE-02.

## How to prove
Start at `/planner/` (no flags), complete setup, confirm canvas + hard-reload ID continuity.

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/onboarding/ --reporter=verbose
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
pnpm --filter oando-site exec playwright test tests/e2e/planner-onboarding-ws2.spec.ts tests/e2e/navigation-smoke.spec.ts -c config/build/playwright.config.ts
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
```

Journey bar: `wallsIncreased` · `openingObjectsIncreased` · `furnitureDelta >= 2` · PNG set.

Live run is the proof. Raw artifacts → `results/ui/phase-02/`. Report → `agents-work/reports/ui-phase-02.md`.

**Owner paperwork (parallel, not blocking):** CP-01 accept — see [HYGIENE.md §A](../HYGIENE.md).

## Guardrails
- Start from `/planner/` only — a dev-tools URL is never buyer proof.
- Guests must pass the `ProjectSetupGate`; no second plan host.

## Out of scope
Member cloud sync and templates marketplace (later); this is the first-run local path.
Third-party template catalog — only **owned** templates count for the brief start path.