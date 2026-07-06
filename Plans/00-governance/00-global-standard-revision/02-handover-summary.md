# 2026-07-04_handover-summary

Historical session handover. Reference-only; not a live routing or status authority.

Phase 0 session handover. Full texts: `archive/plans/00-global-standard-revision/`.

Active routing: `00-governance/01-phase1-execution/00-handover-routing.md`.

---

## Routes at handover time

- `/planner/guest` and `/planner/canvas` — live hybrid (`Open3dPlannerWorkspaceRoute`).
- `/planner/open3d` — pilot (`Open3dPlannerHost`).
- `/planner/fabric/*` — legacy fallback drill.

Historical note: this handover still carried a Fabric-backed framing for guest/canvas. Current route files show `/planner/guest` and `/planner/canvas` already route through `Open3dPlannerWorkspaceRoute`; use `00-governance/01-phase1-execution/00-handover-routing.md` plus the live route files as authority.

---

## Phase status at revision (snapshot)

All phases were **Planned** on paper. Phase 02 had resolver unit tests only.

Do not use old "Implemented + Verified-at-unit" claims. Evidence under `results/planner/` and `results/tests/`.

---

## Global Standard revision (2026-07-04)

Design approved provisionally (`design §16` — live site pending).

Bound into `00-governance/01-phase1-execution/`: I-D GS framework, Q-G gate, `review-workflow.md`.

Tracked failures moved to root `Failures.md` / `resolved-failures.md`.

---

## UI / workspace work (idiothandver)

**Root cause:** Mobile panels missing `data-open`. `activePanel` not wired. No TopBar mobile controls.

**Fixed in code (session):** `PanelContainer` `data-open`. `WorkspaceShell` wiring. TopBar mobile actions. Backdrop CSS.

**Still needed:** Mobile panel Vitest. Live small-screen proof.

---

## Open3D test follow-up

**Done:** `workspace.module.css` mobile keys. `importGraphProof.ts` hybrid naming. `cleanupPhase08.test.ts` JSX fix.

**Not done:** `workspaceShell.test.tsx` mobile asserts. No evidence run logged that session.

---

## Open items at handover time

- `pnpm add` locked package set.
- `generate-svg.mjs` — script now exists (0402 resolved).
- BlockDescriptor schema — exists at `svgTypes.ts`.
- R2 bucket — resolved (0407).
- 0411/0412 type debt — largely resolved.
- 0408 coverage — **still open**.

---

## Forbidden without ask

- No commit from wrong worktree path.
- No delete `_archive/fabric/` before Phase 10 manifest.
- No enable json-render before Phase 09.
- No Mantine until PostCSS split.

---

## Revisit (design §16)

After `pnpm run dev`: validate UI panels, catalog search, SVG output, 2D↔3D, package chrome live.

Cross-refs: `00-benchmark-summary.md`, `01-critique-summary.md`, `00-governance/01-phase1-execution/`.
