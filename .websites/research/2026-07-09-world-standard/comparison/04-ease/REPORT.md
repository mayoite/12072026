# Ease of use / onboarding / 10-minute result

**Date:** 2026-07-09  
**Slice:** 04 — Ease  
**Rule:** Patterns only — no competitor code, assets, or brand clones.  
**Score scale:** 1 = broken/missing · 3 = acceptable · 5 = class-leading (public product bar)

## Scope

How fast a new user gets a **credible office / room layout** without training.

| Dimension | Meaning |
|-----------|---------|
| **zero_signup** | Can you touch the editor without account creation? |
| **templates** | Ready projects / layouts that skip blank-canvas fear |
| **wizards** | Guided structure / room / style steps that reduce decision load |
| **learn** | Learning curve for a non-designer in first session |
| **recovery** | Undo, restart, support when something goes wrong |
| **empty** | Empty-state UX: clear first actions, not a dead canvas |
| **ten_min** | Realistic “something showable in ~10 minutes” for a simple office/room |

**Products:** Planner5D · RoomSketcher · Floorplanner · Homestyler · IKEA · Foyr Neo · Canva floor plans · O&O (live / planned)

---

## Score table

| Product | zero_signup | templates | wizards | learn | recovery | empty | ten_min | **Avg** |
|---------|:-----------:|:---------:|:-------:|:-----:|:--------:|:-----:|:-------:|:-------:|
| Planner5D | 2 | 5 | 5 | 4 | 3 | 4 | 5 | **4.0** |
| RoomSketcher | 1 | 5 | 4 | 5 | 4 | 4 | 4 | **3.9** |
| Floorplanner | 1 | 3 | 5 | 4 | 3 | 4 | 4 | **3.4** |
| Homestyler | 2 | 5 | 4 | 4 | 3 | 4 | 5 | **3.9** |
| IKEA | 3 | 5 | 5 | 4 | 3 | 5 | 4 | **4.1** |
| Foyr Neo | 1 | 4 | 2 | 3 | 3 | 3 | 3 | **2.7** |
| Canva floor plans | 4 | 5 | 2 | 5 | 5 | 5 | 5 | **4.4** |
| O&O | 3 | 2 | 2 | 2 | 2 | 2 | 2 | **2.1** |

*Full machine-readable: `SCORES.csv`.*

---

## Dimension notes (public product bar)

### zero_signup — account gate before value

| Product | Reality |
|---------|---------|
| **Canva** | Strongest casual path: open template → edit quickly; save/share often prompts login. Closest to “try first.” |
| **IKEA** | Planner can open and start design; Family/login pushed mainly for **save** and store handoff. |
| **Planner5D / Homestyler** | Free tier exists, but FAQs/reviews expect **create free account** early; guests often view-only. |
| **RoomSketcher / Floorplanner / Foyr Neo** | Account (or 14-day trial signup) is the front door — no meaningful zero-signup editor. |
| **O&O** | Guest route planned/partial (`/planner/guest`); not yet a class-leading try-before-account story. |

**Pattern for O&O:** Guest session with local persistence → soft save prompt. Do not gate the first wall/room.

### templates — skip blank canvas

| Product | Reality |
|---------|---------|
| **Canva** | Template-first product DNA; floor/office/house plan galleries. |
| **RoomSketcher** | **500+** complete project templates + gallery start. |
| **Planner5D / Homestyler** | Large ready rooms / style packs / AI generator entry. |
| **IKEA** | “Proposals” + room-shape presets (template-as-wizard). |
| **Foyr Neo** | **500+** design inspirations with models (pro starter library). |
| **Floorplanner** | Weaker classic template grid; leans **Room Wizard + Magic Layout** instead. |
| **O&O** | Template system exists in architecture; public bar not met for office starter packs. |

**Pattern for O&O:** 5–15 **O&O-branded** office / workstation / meeting-room starters (own layouts, own SKUs). Not competitor packs.

### wizards — guided first structure

| Product | Reality |
|---------|---------|
| **Floorplanner** | **Room Wizard** + **Magic Layout** (style → one-click furnish) — class-leading cold-start helpers. |
| **Planner5D** | **Smart Wizard**, AI Design Generator, blueprint upload → editable plan. |
| **IKEA** | Step sequence: appliances preferences → layout type → room shape → products. Commerce wizard. |
| **RoomSketcher** | Multiple starts (scratch / template / AI Convert / FloorCapture / order redraw) + measurement wizards. |
| **Homestyler** | AI layout / “room in minutes” paths; less CAD-wizard, more decorate-wizard. |
| **Canva** | No real floor-plan wizard — templates replace wizards. |
| **Foyr Neo** | Pro editor first; **human onboarding hours** (1–3h training) instead of consumer wizards. |
| **O&O** | OnboardingCoach / ProjectSetup / StartingPoint steps in codebase; not yet competitive guided path. |

**Pattern for O&O:** Three first actions only: **Draw room · Start template · Import plan**. Optional style chip after walls exist.

### learn — first-session learning curve

| Product | Reality |
|---------|---------|
| **Canva** | Lowest curve for non-CAD users (drag symbols on whiteboard). Accuracy is the tradeoff. |
| **RoomSketcher** | Intuitive modes + **webinars, tutorials, live chat, 1:1 training** (Business). Best *supported* learn path. |
| **Planner5D / Homestyler / Floorplanner / IKEA** | Marketed as no design degree needed; dense UI appears after first room. |
| **Foyr Neo** | Markets “easy / zero learning curve” but prices and training hours mark it **pro**. |
| **O&O** | Help/onboarding incomplete vs consumer bar; power-user chrome risk without coach. |

### recovery — when users break the plan

| Product | Reality |
|---------|---------|
| **Canva** | Strong undo + version history culture. |
| **RoomSketcher** | Undo/redo chrome + offline app + human support. |
| **Others** | Standard undo; freemium **paywalls** and **render queues** often feel like failure modes. |
| **IKEA** | Escape hatch: book kitchen specialist / store PDF path. |
| **O&O** | IDB/local save direction exists; polished recover / “reset room” empty-state not at bar. |

**Pattern for O&O:** Undo stack always visible · “Start over room” without losing project · clear validation messages (not silent fail).

### empty — empty-state design

| Product | Reality |
|---------|---------|
| **IKEA / Canva** | Almost never a dead canvas — proposals/templates *are* the start. |
| **Planner5D / Homestyler / RoomSketcher / Floorplanner** | Explicit start chooser (template / scratch / import / wizard). |
| **Foyr Neo** | Inspiration library helps; still pro blank-project feel. |
| **O&O** | Research gaps call out first-run empty state + CTAs as incomplete vs benchmark protocol. |

**Pattern for O&O empty canvas:**

```
[ Start from template ]  [ Draw a room ]  [ Import plan ]
Optional: sample “small office” one-click demo (read-only → duplicate)
```

### ten_min — office / room showable result

| Product | Reality |
|---------|---------|
| **Canva** | Presentation floor plan in minutes — not construction-accurate. Wins “slide for the meeting.” |
| **Planner5D / Homestyler** | Template + furnish + 3D toggle ≈ marketing “10 minutes.” |
| **Floorplanner** | Room Wizard → Magic Layout is a true short path to a furnished room. |
| **IKEA** | Kitchen shell + catalog items fast; full priced kitchen longer. Domain-narrow win. |
| **RoomSketcher** | Template → walls → furniture solid; app/account setup steals first minutes. |
| **Foyr Neo** | Pros can move fast; beginners spend time on trial + UI surface. |
| **O&O** | Not yet a proven 10-minute office story end-to-end in public bar terms. |

---

## Who wins ease (by job-to-be-done)

| Job | Winner | Why |
|-----|--------|-----|
| **Zero friction try** | **Canva** (then IKEA for real product planner) | Templates / open planner before hard gate |
| **Guided first room** | **Floorplanner** + **IKEA** | Room Wizard / kitchen step flow |
| **Template depth** | **Canva · RoomSketcher · Homestyler · Planner5D** | Large starter libraries |
| **Learn + human help** | **RoomSketcher** | Webinars, chat, 1:1 |
| **True 10-min pretty room** | **Planner5D / Homestyler / Canva** | Different accuracy levels |
| **10-min commerce kitchen** | **IKEA** | Proposal → products → list |
| **Pro onboarding** | **Foyr Neo** | Paid training hours, not self-serve consumer |

**Overall ease leader (this matrix):** **Canva floor plans** (avg 4.4) for *graphic* ease; **IKEA** (4.1) for *real product planner* ease; **Planner5D** (4.0) for *2D/3D home design* ease.  
**O&O (2.1)** is the gap slice — foundation pieces exist; productized onboarding does not yet match public bar.

---

## Patterns O&O should adopt (original UX — not clones)

1. **Guest-first 10 minutes** — draw + place 3 O&O pieces + see 2D/3D without account; account only to save/share/quote.  
2. **Empty-state triad** — Template · Draw room · Import (never blank-only).  
3. **One Room Wizard equivalent** — dimensions → rectangle/L shape → default door → done (own copy/UI).  
4. **Office template pack** — small open office, private cabin, meeting room, reception (O&O SKUs placed).  
5. **Soft coach, not modal spam** — dismissible first-run chips (“Click wall tool · drag to draw”); no 10-step forced tour.  
6. **Visible undo + Start over room** — recovery is part of ease.  
7. **Success metric** — time-to-first-saveable-office under 10 minutes on guest path (instrument in analytics).  
8. **Do not chase** Foyr-style paid onboarding hours or Canva-only symbol accuracy as the product identity — O&O win is **catalog + BOQ**, with Canva-level *start* friction.

---

## Anti-patterns (from public products)

| Anti-pattern | Seen where | O&O response |
|--------------|------------|--------------|
| Account before first wall | RoomSketcher, Floorplanner, Foyr | Guest session |
| Blank canvas + 40 tools | Dense pro editors | Mode rail + empty triad |
| Paywall mid-draw | Freemium consumers | Gate export/quote, not draw |
| Wizard that never ends | Over-long kitchen questionnaires | Max 3 steps then canvas |
| Template without your SKUs | Generic furniture packs | O&O catalog only on starters |
| “Zero learning curve” claim without coach | Pro tools | Measure time-to-result, don’t claim |

---

## Evidence index (public / local)

| Source | Use |
|--------|-----|
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Smart Wizard, templates, 10-min pitch, editor start paths |
| Planner5D FAQ / beginner guides | Account required; template or scratch; 2D then 3D |
| Floorplanner Basic page | Room Wizard, Magic Layout, free account gate |
| RoomSketcher free / get-started / templates blog | Free account, 500+ templates, AI Convert, webinars |
| Homestyler marketing / free how-to | Signup, template library, AI room-in-minutes |
| IKEA Kitchen Planner help / planner pages | Proposals, guided prefs, login for save |
| Foyr Neo pricing | 14-day trial signup; 1–3h onboarding training; 500+ inspirations |
| Canva create floor plans | Template + drag-drop whiteboard ease |
| O&O repo research (`Plans/Research/*`, plan trees) | Guest route, OnboardingCoach, template system, empty-state gaps |

---

## Bottom line

| Question | Answer |
|----------|--------|
| **Who wins ease / onboarding?** | **Canva** (graphic), **IKEA** (product planner), **Planner5D** (2D/3D consumer). |
| **Who wins true guided room build?** | **Floorplanner** Room Wizard + Magic Layout; **IKEA** kitchen steps. |
| **Who wins support-backed learn?** | **RoomSketcher**. |
| **Where is O&O?** | **~2.1 avg** — architecture for guest/onboarding/templates exists; public 10-minute office path does not yet meet bar. |
| **O&O priority for this slice?** | Guest + empty triad + 4–6 office templates with real SKUs + one short room wizard + instrumented 10-min metric. |

**Next for orchestrator:** fold this slice into `MASTER-CHART.md` with engine/toolbar/inventory scores; do not block on re-scrapes.
