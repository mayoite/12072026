# Phase 6 — Workspace Entry + RouteChrome

## Purpose

`SiteWorkspaceShell` and **RouteChrome** normalization.

## Workspace routes

`/access`, `/choose-product`, `/dashboard` — `SiteWorkspaceShell`, workspace i18n namespace (Phase 4a en first).

## RouteChrome deliverable

Extract pathname groups from `RouteChrome.tsx` to data:

- `site/lib/site-data/routeChromeRules.ts` (or `config/route-chrome.json`)
- Unit tests: given pathname → expected chrome mode (`full`, `no-header`, `minimal`, …)

Refactor `RouteChrome.tsx` to consume rules — no new pathname literals without updating data file.

## `html lang`

Ensure workspace routes use same locale resolution as Phase 3 `(site)` layout (shared helper if needed).

## Acceptance Checklist

- [x] `SiteWorkspaceShell` on access, choose-product, dashboard.
- [x] RouteChrome rules extracted + tested.
- [x] Contract doc updated with chrome matrix.
- [x] Workspace i18n namespace in `en.json` (`workspace`; access wired).
