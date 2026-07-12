# Next steps — all tracks

**Updated:** 2026-07-12 · One-glance execution pointer. Detail lives on each track board; this only says *what to do next*.
Boards: [Planner](../Plans/Planner-track/BOARD.md) · [Admin](../Plans/Admin-track/BOARD.md) · [Site](../Plans/Site-track/BOARD.md) · [SEO](../Plans/SEO-track/BOARD.md) · [Security](../Plans/Security-track/BOARD.md) · Bar: [00-QUALITY-BAR](../Plans/00-QUALITY-BAR.md)

> **Honest framing:** most Planner phases are "implementation landed, PASS not re-proven on this checkout" (REPROVE). The next move there is *evidence*, not new code. GATE PASS ≠ product ship.

## The one next action per track

| Track | Next action | Green when | Depends on | Evidence |
|-------|-------------|-----------|------------|----------|
| **Planner** | **P03 / CP-03** — re-run select → delete → undo on the live Fabric stage with **id + pose** browser proof (not count-only) | A browser run selects a furniture item, deletes it, undoes, and asserts the **same id + pose** returns — screenshots + `run.json` on disk | P01/P02 Fabric-sole lock (in place) | `results/planner/world-standard-wave/03-select-delete/` |
| **Admin** | **A4.0.1** — wire the visual canvas into publish (`onDocumentChange` on `SvgStudioCanvas`); make the scene the sole publish authority | A rectangle **drawn on the canvas** appears in the published `svg-catalog/{slug}.svg` on disk — not the form's artifact | A4.0 (done, `a48a8400`) | `results/admin/no-code-svg-studio/` |
| **Site** | **S1** — get owner decision to `execute Plan A`, then cut `@fancyapps/ui` in one slice | `@fancyapps/ui` confirmed unused, removed, then `pnpm install` + typecheck green | **Owner gate** (do not cut before OK) | `results/` (command + log) |
| **SEO** | **SEO1** — reconcile `sitemap.ts` `STATIC_PATHS` against live routes | Sitemap lists every live public route and no dead ones — diff captured | Site pages exist (Site is OPEN — don't assume) | `results/` (sitemap diff) |
| **Security** | **SEC4** — Supabase RLS / `db:advisors:security` to zero ERRORs | `db:advisors:security` returns **0 ERROR** advisories, output captured | — (SEC3 admin slice already proven via A3) | `results/` (advisor run) |

## Critical path to a buyer-shippable product

The tracks above run in parallel, but *shipping* has a spine:

1. **Prod-gate blocker (cross-track):** `next build` + a working `/contact` route — flagged OPEN in `ayushdocs/01-PENDING.md`. Until this is green, no production gate passes regardless of track progress.
2. **Planner trust spine (kill order):** P03 → P07 → P06 → P04 → P05 → P08 → P09 → **P10** (handover pack). These make the *engine* trustworthy; the pack is not ship.
3. **Buyer product (Planner P11–P16):** P11 room → P12 configure → P13 scale → P14 validate → P15 BOQ → P16 share/quote. This is what a buyer actually pays for.
4. **Commercial dependencies:** P12 consumes **Admin A6** (workstation family); P15 consumes **Admin A7** (pricing). So Admin A4→A6→A7 unblocks the Planner buyer roadmap — Admin and Planner are not independent past the foundation.

## What "done" is not

- A green Vitest/Playwright run with no `results/` path, or a passing gate, is **not** product ship.
- A file existing on disk is **not** a wired product path — see `docs/architecture/06-CLAIMS-AND-UNWIRED.md`.
- Re-prove every REPROVE gate on the current checkout before claiming PASS; old evidence packs are clues, not proof.
