# Repository agent rules

Read this file before each task.
These rules cover the whole repository.

## Authority

- The owner is the only boss.
- The owner sets and changes the goal.
- Clear goals are executed without ceremony.
- The session parent has standing execution authority.
- Fresh evidence decides PASS, FAIL, ship, and cutover.
- Do not wait for owner rubber-stamps.
- Suggestions must be useful and evidence-backed.

## Multi-agent trigger and gate

- Use a multi-agent workflow only when the user explicitly requests one.
- Default work does not require a team.
- Once triggered, the gate covers all work in scope.
- It is not limited to Admin.
- Use exactly three agents total.
- Use one writer and exactly two peer reviewers.
- The parent is one of the three peers.
- The parent is not a fourth agent or a boss.
- One writer edits at a time.
- Both reviewers return PASS, FAIL, or N/A with evidence.
- N/A requires a specific scope reason.
- A peer FAIL blocks completion of that slice.
- The writer fixes failures.
- The affected reviewer checks the fix again.
- Never soften or overrule a peer FAIL.

## Truth and scope

- Do not lie or fake evidence.
- Keep sentences short.
- Live code and fresh commands are authoritative.
- Plans and old reports do not prove completion.
- `agent-reports/` contains notes only.
- `results/` contains raw tool output only.
- Never use either folder as PASS proof.
- Read relevant code before editing it.
- Make the smallest sound change.
- Preserve unrelated owner changes.
- Block only the exact dependent item.
- Record active blockers in `Failures.md`.
- Remove resolved blockers.

## Execution

- Use the root checkout.
- Do not create worktrees.
- Run `pnpm` from the repository root.
- Do not install inside `site/` or `tech-docs-generator/`.
- Never mutate the canonical catalog in tests.
- Use isolated fixtures and reliable cleanup.
- Do not suppress tests or failures.
- Do not write handwritten `any`.
- Keep secrets in `.env.local` only.
- Never open, edit, or cite `PROTECTED/`.
- Treat `websites/` and `archive/` as references only.
- Save finished, verified slices in clear commits.
- Push verified slices when they should land.
- Never force-push or rewrite shared history.

## Verification

- Start checklist verification from unchecked state.
- Run focused checks during work.
- Run broad gates when their scope changed or shipment is claimed.
- UI claims require a fresh browser check.
- Use only `http://localhost:3000` for local browser checks.
- Never use `127.0.0.1` for the app.
- Use `scripts/lib/forceLocalhostOrigin.mjs`.
- Check console, requests, accessibility, and relevant viewports.
- Do not force clicks or raise timeouts to hide failures.
- Run `pnpm run check:layout` before completion.

## Repository map

- Execute `plan/README.md`.
- Use each track's `CHECKLIST.md` and `FEATURES.md`.
- Admin also uses `IMPLEMENTATION-PLAN.md` and `REALITY-AND-STACK.md`.
- Keep exactly four Markdown files under `plan/Admin/`.
- Product and operating facts live in `docs/`.
- Architecture facts live in `docs/architecture/`.
- Active blockers live in `Failures.md` only.
- Never create `site/results/`.
- Product code lives in `site/`.
- Dependency licenses live in `docs/architecture/12-DEPENDENCIES-ENGINES.md`.

## Product guardrails

- Admin manages exact trusted inventory.
- Site informs visitors and sends customers to Planner.
- Planner places published symbols and creates branded BOQ.
- Security covers data, permissions, integrations, and releases.
- Accessibility and UI quality are acceptance concerns.
- Fabric is the interactive 2D canvas.
- Three.js is the 3D engine.
- One normalized document drives 2D, 3D, save, and BOQ.
- Published SVG is the primary 2D product symbol.
- `Block2D` is a fallback.
- Maker.js owns parametric brand geometry.
- Do not create parallel canvas, catalog, or Planner trees.
- Preserve stable identity and millimetre units.
- Disk remains live SVG authority until verified cutover.
- Products DB plus R2 is the durable target.
- Do not claim DB authority before verified cutover.

## CSS and documentation

- Follow `docs/architecture/04-CSS-SOLUTION.md`.
- Use semantic tokens.
- Keep repeated presentation out of TSX.
- Avoid raw palette values and inline colors.
- Do not create another global styling tree.
- Document verified behavior.
- Keep intent separate from current capability.
- Edit generator sources, not generated output.
- Do not create shadow plans or generated folder manifests.
