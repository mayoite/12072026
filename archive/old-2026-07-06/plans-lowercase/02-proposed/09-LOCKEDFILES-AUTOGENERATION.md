# 09 — Lockedfiles Autogeneration

Status: Start as pilot after 02, full rollout after 08 stabilizes.
Owner: __________
Exit date: __________
Depends on: 02 for pilot start

## Goal

Stop pretending hand-maintained `current.md` files are stable truth in a fast-moving repo.

## Tasks

1. Pilot on these modules first:
   - planner,
   - dependencies-engines,
   - tests.
2. Generate `current.md` from disk facts:
   - routes,
   - package.json,
   - test locations,
   - module paths.
3. Keep `proposed.md` human-authored.
4. Add CI diff checks so generated `current.md` cannot drift.
5. Expand to the remaining modules only after the pilot proves useful.

## Exit criteria

- Pilot Lockedfiles current docs are generated, not manually curated.
- CI catches drift automatically.
- Lockedfiles become lighter and more trustworthy.
