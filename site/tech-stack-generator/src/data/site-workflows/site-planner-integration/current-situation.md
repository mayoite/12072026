# Site-Planner Integration — Current Situation

**Evidence-first check:** Reads of MODULE-LAYOUT, Lockedfiles/site, planner landing CONTENTS, app routes performed.

## Honest State

- Integration points: planner landing in features/planner/landing (feeds app/planner marketing), PlannerMarketingChrome, shared auth/dashboard, portal views (SVG catalog read-only).
- Hybrid planner live at /planner/guest + /planner/canvas; open3d pilot at /planner/open3d.
- Site catalog products feed planner via bridges.
- Evidence: `site/tests/e2e/README.md` mentions marketing-site-ui lane; route matrix; planner results under `results/planner/`.
- Current tech-stack Workflows.tsx has high-level dev loop but no dedicated integration module.

## Gaps

- site-workflows/site-planner-integration/ did not exist (list_dir pre-write).
- 1A/1B status: portal svg-catalog ahead of admin compose; not accepted per Locked baseline.
- Blurring of site vs planner catalog ownership noted in Lockedfiles.
- Integration tests scattered; no single "integration walkthrough" source before this.
- Small-screen/continuity patterns evolving (see recent panel work).

## GS Application

- Must apply catalogue-first + 2D↔3D + minimize-UI (superpowers §7).
- Evidence gate: benchmark + UI review before claiming integration complete.
- Refer/revise: `docs/Lockedfiles/planner/current.md`, site/proposed.md, `plann/00-REVISION.md`. Thin doc here.
- Anti-copy attestation required for any visual integration surfaces.
