# A3 — Production auth

**Status:** OPEN — not complete.

**Goal:** No `DEV_AUTH_BYPASS` (or equivalent) on public / production hosts.

**Owns with:** [Security-track](../Security-track/BOARD.md)

- [ ] Public hosts reject admin without real auth
- [ ] Dev bypass documented as **dev-only**; proven absent in prod config
- [ ] Evidence path recorded under `results/` (Admin or Security — one folder, link both)

Do not mark complete from A1 spine notes.

## UI execution slice

- [ ] Admin UI states that publishing requires admin access.
- [ ] Dev bypass language stays development-only.
- [ ] Auth evidence links from the Admin board.

**Reason:** UI copy must not normalize unsafe production access.

**Implementation:** UI wording scope recorded. Auth proof remains OPEN.
