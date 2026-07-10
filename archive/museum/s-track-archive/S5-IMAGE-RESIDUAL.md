# S5 — Catalog image residual

**Track:** S5 · **Status:** DONE (code) · residual SKUs may remain

## Goal

Catalog product images resolve to real files under `/images/catalog/{slug}/` — not broken hash or wrong tree paths.

## Done when

- [ ] `assetPaths` + catalog adapters handle slug-folder fallback
- [ ] Unit tests green (run commands at execute — see museum doc)
- [ ] Probe notes for any remaining missing SKUs

## Code

`site/lib/assetPaths.ts` · `site/lib/catalog/adapters.ts`

## Full residual doc

[`archive/museum/s-track-archive/S5-IMAGE-RESIDUAL-full.md`](../../archive/museum/s-track-archive/S5-IMAGE-RESIDUAL-full.md)
