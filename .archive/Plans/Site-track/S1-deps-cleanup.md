# S1 — Dependency cleanup

**Status:** OPEN — not complete. **Plan only** until owner says `execute Plan A`.  
**Product score:** unchanged until cut + typecheck evidence.

**Scope:** `site/package.json` dependencies.  
**Hard rule:** plan → owner OK → one remove slice. No silent cuts. No flattery “cleanup done.”

## Live fact (2026-07-12)

- `@fancyapps/ui` still listed in `site/package.json` (^6.1.14).
- No import inventory re-run in this raise — **re-grep before any cut**.

## Plan A (proposed — unchecked)

- [ ] Confirm `@fancyapps/ui` unused in `site/` (grep imports + CSS)
- [ ] Owner writes `execute Plan A`
- [ ] Remove only that package
- [ ] `pnpm install` (repo root) + `pnpm --filter oando-site typecheck` green
- [ ] Evidence: `results/site/s1-deps/` (commands + log)

**Keep (not Plan A):** `swiper`, embla, Next/React, Fabric, Three, Supabase, etc.

## Plan B (later)

- [ ] Docs-only deps move only after per-package grep

Until owner unlocks execute: **leave `package.json` alone.**
