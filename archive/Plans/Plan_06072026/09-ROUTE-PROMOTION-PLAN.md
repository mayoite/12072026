# 09 — Route Promotion Gate (Phase 2 Entry)

Owner: ______________
Target exit date: ______________
Depends on: 02, 03, 04, 05, 06 all complete on ONE unchanged revision

## Problem

/planner/guest and /planner/canvas must stay frozen until Open3D (1A + 1B) is fully accepted.
Promotion decisions need a hard checklist, not a judgment call.

## Work items (in order)

1. Confirm all of 02, 03, 04, 05, 06 pass their exit criteria on the same git commit SHA
   (no partial credit across different revisions).
2. Run full regression: planner unit+integration suite, SVG security fixtures, a11y, E2E nav,
   planner-catalog E2E, production build — all from that one commit.
3. Compare screenshots, saved documents, and bundle-boundary reports between /planner/open3d
   and the current /planner/guest and /planner/canvas baselines.
4. Get one independent reviewer (not the implementer) to sign off against this checklist.
5. Promote shared shell + command layer to /planner/guest first; re-verify guest-specific
   restrictions (no save persistence beyond guest scope, etc.).
6. Only after guest passes its own regression, promote to /planner/canvas.
7. Keep explicit Fabric fallback routes live through a stabilization window post-promotion.

## Exit criteria

- Single-revision evidence bundle exists covering all of 02-06.
- Independent reviewer sign-off recorded (name + date + checklist reference).
- Guest promotion verified independently before canvas promotion begins.
- Fallback routes remain functional and documented.
