# Product domains

## Admin

Admin is an internal role.

It owns:

- catalog identity and product data;
- product availability;
- SVG authoring and publication;
- product families and options;
- revisions, rollback, and audit;
- the released database catalog contract consumed by Planner and Site.

Admin does not own the customer layout journey.

## Planner

Planner serves any external website customer.

It owns:

- public entry and guest access;
- room and layout editing;
- catalog search and placement;
- synchronized 2D and 3D views;
- project persistence;
- branded BOQ generation;
- customer review and submission to Oando.

Planner consumes published inventory.

It does not silently invent catalog data or commercial prices.

## Shared contracts

| Contract | Producer | Consumer |
|---|---|---|
| Released database catalog record | Admin | Planner and public site |
| Immutable database SVG revision | Admin | Planner 2D canvas |
| Product family options | Admin | Planner placement and BOQ |
| Planner document | Planner | 2D, 3D, save, and export |
| Branded BOQ | Planner | Customer and Oando |

Contracts use stable identifiers and explicit versions.

Tests use isolated fixtures for each contract.
