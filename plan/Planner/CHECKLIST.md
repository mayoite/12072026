# Planner workspace refinement

Live code and fresh checks are authoritative.

## Scope

- [ ] Use one controlled Dockview layout.
- [ ] Keep Inventory left, Properties right, and Layers/Validation in a bottom group.
- [ ] Keep the central canvas unobstructed.
- [ ] Disable floating panels in the default customer layout.
- [ ] Preserve panel resize, collapse, keyboard, and saved-layout behavior.
- [ ] Provide a compact mobile panel experience.

## Verification

- [ ] Focused Dockview and workspace unit tests pass.
- [ ] Typecheck passes for changed Planner code.
- [ ] UI lint passes for changed Planner surfaces.
- [ ] Desktop browser check passes without panel overlap.
- [ ] Mobile browser check passes without inaccessible controls.
- [ ] `node scripts/check-repo-layout.mjs` passes.

Blockers: `../../Failures.md`.
