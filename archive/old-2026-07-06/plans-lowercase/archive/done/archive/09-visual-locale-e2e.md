# Phase 9 — Visual + Locale E2E (`test:site-ui`)

## Purpose

Visual proof after **Phase 10** `check:site-ui` passes.

## Prerequisites

- Phase 4b (hi), Phase 3, Phase 10 dialect checks in `warn` or `error`
- Release-gate Tier 1 env policy

## Stabilization

- `prefers-reduced-motion: reduce`
- `document.fonts.ready`
- Hide marquee / bot FABs during capture
- Fixed locale cookie

## Structural assertions (before screenshot)

Each route must pass DOM checks:

- `home-marketing-layout` or `min-h-screen overflow-x-hidden`
- At least one `home-section--*` or `[class*="home-section"]`
- `home-shell-xl` present

Then `toHaveScreenshot` with `maxDiffPixelRatio` documented in `TESTING.md`.

## Wave 1 (must-ship)

`/`, `/about`, `/contact` — locale switch on `/about` (en + hi)

## Wave 2 (defer ok)

`/solutions`, `/products`, `/quote-cart` — log in `Failures.md` if deferred

## Script

```json
"test:site-ui": "playwright test site-locale-switch site-visual-regression"
```

## Acceptance Checklist

- [x] Wave 1: 0 skipped; structural + screenshot pass (`test:site-ui` **5/5** 2026-06-30).
- [x] Homepage snapshot = golden master (`wave1-homepage.png`; platform-neutral path template).
- [~] Wave 2: spec added (`/solutions`, `/products`, `/quote-cart`); snapshots **not generated** — `test:site-ui` skipped (no gate).
- [~] SU-F9 — wave 1 en+hi E2E; de/es/fr scaffold only (no locale-switch E2E for 4c).
