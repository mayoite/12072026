# Phase 8 — Planner Marketing + Shared Layout

## Purpose

Planner marketing pages use **homepage tokens and section model** — same `@theme` colors, `home-heading` / `home-section--*` where marketing sections appear.

## Shared layout

Extract `(site)` + `planner` layout shared parts (fonts, `lang`, intl provider) — marketing body still follows homepage outer wrapper when showing landing content.

## Landing

- `features/planner/landing/*` — align section markup to `components/home/*` patterns
- Re-export shims in `components/home/Planner*.tsx` only

## Acceptance Checklist

- [x] Planner marketing visually consistent with `/` (tokens + section classes).
- [x] Shared layout helper; dynamic `lang`.
- [x] No planner-only gray Tailwind palette on marketing landing.
