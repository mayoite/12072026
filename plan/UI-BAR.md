# UI bar — required on every buyer-facing phase close

**Host:** Fabric `planner-fabric-stage` only. No second canvas. No dev-flag or seeded internal route as buyer proof.

A phase is **not** done until **every** box below is ticked for that phase run **and** the phase's own checklist in its track.

Proof = live browser run + screenshots + targeted trace. Units alone never close a phase.

## Required boxes

- [ ] Public entry path used where applicable — no `?plannerDevTools=1` as buyer proof
- [ ] Desktop and 375×812 mobile layouts exercised
- [ ] Full keyboard path with visible focus and correct control names
- [ ] Empty, loading, error, and success states shown (not skipped)
- [ ] Canvas not clipped; primary action reachable at every target size
- [ ] Toolbar and theme controls reachable at every target size
- [ ] Light and dark themes cover chrome, Fabric, Three, native controls, and focus states
- [ ] Guest/member/save labels honest — no cloud before cloud save succeeds
- [ ] No unexpected console, request, hydration, or accessibility errors on the journey
- [ ] Screenshots captured (desktop + 375×812) and trace attached to `agents-work/reports/`

## Tracks that must tick this file

| Track | Phases |
|-------|--------|
| [UI](./UI/) | P01, P02 |
| [Planner](./Planner/) | P01–P12 |
| [Buyer](./Buyer/) | P01–P05 |

Site, Admin, SEO, Security phases tick UI bar only when the work ships buyer-visible planner UI.