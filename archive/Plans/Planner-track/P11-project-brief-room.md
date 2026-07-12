# P11 — Project brief and room setup

**Status:** OPEN — onboarding exists, but the buyer workflow is not proven as a complete project brief.

**Outcome:** A buyer starts a real office project in minutes with room dimensions, constraints, units, and a saved brief.

## Functional scope

- Project name, location, client, target seats, work mode, and budget band.
- Rectangular room first. Add columns, doors, windows, and keep-out zones.
- Metric/imperial display with millimetre document authority.
- Start blank or from an owned template.
- Plain-language validation and correction.
- Local draft for guests. Cloud project for signed-in members.

## Acceptance

- [ ] First-time user reaches an editable room without hidden dev tools.
- [ ] Dimensions and openings survive reload with the same IDs.
- [ ] Guest/member storage labels are honest.
- [ ] Setup completes keyboard-only (tab to every field, no mouse-only control) and the room renders on a 375px-wide viewport.
- [ ] Browser proof starts from the public Planner entry, not a seeded internal route.

**Depends on:** P06 (save/label honesty — the brief must survive reload with honest storage labels) and the Fabric-sole host from P01/P02.

## Evidence

`results/planner/product-wave/11-project-brief-room/`

**Host:** Fabric sole (`planner-fabric-stage`). second plan host is forbidden.  
**Next (sequence):** [P12](./P12-workstation-configurator.md) after P11 acceptance green.
