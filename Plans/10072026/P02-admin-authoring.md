# P02 — Admin authoring and publish safety

## Buyer problem

Public catalog and planner output are only trustworthy if staff can update them safely. A publish button that saves invalid geometry, loses a descriptor, or claims success without producing an asset creates customer-facing debt.

## Outcome

An authorized O&O operator can create or edit the reference system data, validate it, publish original SVG output, and see the published result through the same catalog path used by the product.

## Scope

1. Map the admin catalog, planner catalog, configurator catalog, and SVG editor routes.
2. Define the publish contract: descriptor input → normalize → validate → compile → persist → catalog read-back.
3. Make failure fail closed. Invalid input must preserve the prior published state and show the actual reason.
4. Record who may publish and which server route performs the write.
5. Prove the flow in browser and with focused unit or pipeline tests.

## Evidence

`results/10072026/P02-admin-authoring/` contains:

- valid publish browser recording and screenshots;
- invalid publish proof showing no false success;
- API response and published-file/read-back evidence;
- raw unit, CLI, and browser logs;
- a short authority map for admin data writes.

## Acceptance

- A valid original descriptor produces the expected published asset.
- Invalid or missing geometry cannot silently become a live product asset.
- Browser confirmation and catalog read-back refer to the same published identity.
- The flow does not depend on a development bypass in production behavior.

## Non-goals

- A bulk migration of every legacy asset.
- Competitor asset ingestion.
- Rebuilding the entire admin design system.

## Handoff

P03 can rely on one published, readable catalog item for planner placement proof.
