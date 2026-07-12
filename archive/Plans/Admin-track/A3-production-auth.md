# A3 — Production auth

**Status:** DONE — production build and browser re-proven 2026-07-12.

**Goal:** No `DEV_AUTH_BYPASS` (or equivalent) on public / production hosts.

**Owns with:** [Security-track](../Security-track/BOARD.md)

- [x] Production rejects anonymous admin pages and the SVG publish API
- [x] Dev bypass documented as **dev-only**; production ignores it even when the flag is set
- [x] Evidence recorded under `results/admin/production-auth/`

Do not mark complete from A1 spine notes.

## UI execution slice

- [x] Admin UI states that publishing requires admin access.
- [x] Dev bypass language stays development-only.
- [x] Auth evidence links from the Admin board.

**Reason:** UI copy must not normalize unsafe production access.

**Proof:** production runtime reported `nodeEnv: production`, `flagSet: true`, `bypassEnabled: false`; `/admin/svg-editor` redirected to access; anonymous publish returned 403 at the CSRF gate.
