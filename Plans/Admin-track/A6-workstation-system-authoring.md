# A6 — Workstation system authoring

**Status:** OPEN — the business-critical workstation family is not authorable as a complete system.  
**Kill order (addendum):** [A6a-workstation-system-kills.md](./A6a-workstation-system-kills.md) — slices only; **this card’s acceptance remains the done bar**.

**Outcome:** A product manager defines one workstation family that the Planner can configure as linear or L-shaped runs at meaningful seat counts.

## Functional scope

- Family identity, size grid, allowed seat counts, and linear/L topology.
- Modules: tops, frames, legs, screens, pedestals, returns, cable trays, and end conditions.
- Compatibility rules and required/forbidden combinations.
- Dimension formulas with min/max/step and plain-language labels.
- 2D Block2D recipe, 3D procedural recipe, and fallback assets.
- BOM mapping per option. No geometry-only system definition.
- Preview representative configurations before release.
- Versioned system definition with migration notes for placed instances.

## Acceptance

- [ ] A non-coder authors a valid two-seat linear workstation without touching code, JSON, or the DB.
- [ ] The same family authors a valid L configuration from the released definition.
- [ ] **Green when** an invalid module combination is impossible to save, or is blocked with a plain-language reason naming the offending modules.
- [ ] **Green when** 2D, 3D, dimensions, and BOM for a placed instance all derive from one released version id — verified by changing the version and seeing all four move together.
- [ ] **Green when** the Planner consumes the newly released version without a code deploy (release id bump only).
- [ ] Browser proof covers author → preview → release → Planner placement of the released version.

## Data-loss & failure states

- [ ] **Green when** releasing a new version does not corrupt or silently re-render instances already placed on the old version; each placed instance keeps its version id and a migration note explains any change.
- [ ] **Green when** an in-progress authoring session survives a reload (draft persists) — a half-authored family is never lost on tab-close.
- [ ] A family missing a required module (no BOM mapping, no 2D recipe) cannot be released; the release control states exactly what is missing.

## Evidence

`results/admin/workstation-system-authoring/`

## Dependency

A5 lifecycle and A4 no-code interaction patterns.
