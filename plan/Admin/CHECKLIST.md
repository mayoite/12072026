# Admin checklist

Status only. Code map: `FEATURES.md`. Phase detail: `PHASES-01-02.md`, `PHASES-03-04.md`.

Open work only (plan purity: no completed ticks here). Done work lives in `FEATURES.md`.

**Editor:** Excalidraw. Disk SVG still live authority until DB cutover.

## Step 0

- [ ] Canonical `inventory/descriptors/` hash gate in CI.

## Phase 1 — authoring proof

- [ ] Fresh browser: Excalidraw draw → dimensions → preview → publish (prior live evidence aged out).
  - Note: production auth smoke done 2026-07-16 — see FEATURES.

## Phase 2 — DB SVG cutover (blocks Planner DB reads)

- [ ] `DB-SVG-01`…`05`: real dual-write payload + one transaction (revision, artifacts, product pointer, audit); DB is publish authority.
- [ ] `DB-SVG-18`: DB vs approved-source parity tooling before removing disk.
  - Note: DB-SVG-17 dry-run inventory exit `0` 2026-07-16 — see FEATURES; not authority.
- [ ] Planner `svg-blocks` serves committed artifact bytes (not disk-only fallback).
- [ ] Fresh publish → Planner browser journey under DB authority.

## Phase 3 — families

- [ ] `ADM-FAM-01`/`02` browser: 2D / 3D / BOQ parity on released family fixture.

## Phase 4 — commercial

- [ ] Full price-book journey: draft → approve → activate → retire/restore → rollback + `ADM-PUB-02` / `ADM-PRICE-*` / `ADM-ROLE-01` / `ADM-AUDIT-01` browser proof.
  - Note: SVG inventory retire/restore canvas is done (see FEATURES + `results/admin/retire-restore-canvas/`).

## Close

- [ ] Failed publish preserves prior public product under DB authority.
- [ ] Only active items remain in `../../Failures.md`.
