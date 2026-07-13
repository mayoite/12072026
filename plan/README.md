# Execution plan

## Product loop

1. Admin publishes trusted inventory.
2. A customer enters the public Planner.
3. The customer designs with available inventory.
4. Planner generates a branded BOQ.
5. The customer sends the BOQ to Oando.

## Tracks

- `Admin/CHECKLIST.md` owns catalog creation, governance, and publication.
- `Planner/CHECKLIST.md` owns the public site, design workflow, BOQ, and handoff.
- `Phase-2/README.md` holds deferred decisions only.

UI, site, SEO, accessibility, performance, and security are acceptance criteria inside both tracks.

They are not separate tracks.

## Execution rules

- Treat every checkbox as not done.
- Verify live code before checking an item.
- Run test and catalog isolation first.
- Admin and Planner may run in parallel after isolation.
- A failed item blocks only its named dependants.
- Continue all unrelated items.
- Record only active blockers in `../Failures.md`.
- Record the fresh command and result beside completed work.
- Raw output may go under `results/<track>/<run-id>/`.
- Raw output never proves completion by itself.

## Current product boundaries

- Catalog authority is public static data and assets.
- Cloud catalog storage is a later migration.
- Planner renders published SVG first.
- `Block2D` is a fallback.
- BOQ contains branded product quantities and identity.
- Demo prices are not commercial truth.
- Customer submission must reach an Oando-controlled destination.
