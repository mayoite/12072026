# O&O Product Program — 10 July 2026

## Why this exists

One&Only sells premium custom office and workstation systems. A project can take hours or days of manual recon, layout, revision, and quote work. The product exists to cut that cycle without buying a $40k vendor platform or turning O&O into a generic furniture catalog.

The six-month target is not enterprise parity. It is a serious prototype:

1. A buyer or designer can make a usable office plan.
2. One O&O workstation family can generate valid variants.
3. The plan survives save and reload.
4. The resulting quantities can support an honest quote draft.

## What this program replaces

This folder is a clean execution proposal. It does not delete older plans. Old plans, old `PASS` labels, screenshots, and run files are historical input only. They are not proof for this program.

The current checkout is dirty. It includes planner, SVG, catalog, and evidence changes. Therefore no phase begins green. P00 records the exact state before any product claim is made.

## Current repo context

| Surface | What exists | What is not yet trusted |
|---|---|---|
| Public site | Marketing routes, catalog surfaces, portal, and responsive UI | A clean buyer journey on the current tree |
| Catalog | Server catalog code, product metadata, descriptors, SVG catalog assets | One proven source of truth for every visible item |
| Admin | Catalog, planner catalog, configurator, plans, themes, and SVG editor routes | A buyer-safe authoring and publish flow on the current tree |
| Planner | Fabric stage, Three/R3F 3D, catalog, persistence, asset engine, systems code | End-to-end customer usefulness and current evidence |
| CRM / quote | Clients, projects, plans, quotes, and demo-store code | A real plan-to-BOQ commercial workflow |
| AI | Planner AI advisor and site-assistant surfaces | A narrow, safe workflow with measured value |

The planner is in migration. `site/features/planner/open3d/README.md` currently declares Fabric as the live 2D canvas and archives the old feasibility canvas. Older planning documents describe a different state. P00 must prove the real host chain before later planner work starts.

## Rules

- Run one phase at a time. A later phase may be researched, but not implemented, before its dependency is proved.
- Each phase has one accountable head agent. Reviewers can challenge it. They cannot silently change its verdict.
- Evidence belongs in `results/10072026/<phase>/`. Plans stay here.
- A unit test does not prove a browser journey. A screenshot does not prove persistence. A written status does not prove a feature.
- Existing dirty changes are preserved. They are never silently included in a phase commit.
- Do not copy competitor assets or geometry. Use O&O data and original generation pipelines only.
- No purchase, deletion of owner data, force-push, or new paid service without the owner.

## Phase order

| Phase | Buyer outcome | Dependency |
|---|---|---|
| [P00](./P00-truth-and-contract.md) | Everyone works from one current truth | None |
| [P01](./P01-buyer-entry-and-catalog.md) | A buyer can discover a real O&O system | P00 |
| [P02](./P02-admin-authoring.md) | Staff can safely author and publish catalog data | P01 |
| [P03](./P03-planner-2d.md) | A designer can create and edit a 2D office plan | P02 |
| [P04](./P04-planner-3d-and-save.md) | The same plan works in 3D and survives reload | P03 |
| [P05](./P05-workstation-system.md) | One configurable O&O workstation system is usable | P04 |
| [P06](./P06-boq-and-crm.md) | A plan becomes an honest project and BOQ draft | P05 |
| [P07](./P07-ai-assist.md) | AI removes one verified human bottleneck | P06 |
| [P08](./P08-quality-and-security.md) | Core paths are safe, accessible, and observable | P07 |
| [P09](./P09-release-and-handover.md) | The prototype has an honest release decision | P08 |

## Definition of phase complete

A phase is complete only when all of these are true:

1. The buyer outcome works on the recorded checkout.
2. The phase tests pass without skipped or hidden output.
3. Browser proof exists where a buyer uses the surface.
4. Evidence names the exact commit and working-tree state.
5. Open residuals are written down.
6. The phase has a commit, an origin push when safe, and a mirror attempt when required.

Use [STATUS.md](./STATUS.md) as the only program scoreboard.
