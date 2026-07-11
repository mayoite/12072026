# S1 — Dependency cleanup

**Status:** OPEN — not complete. **Plan only** until owner says `execute Plan A`.

**Scope:** `site/package.json` dependencies.  
**Hard rule:** plan → owner OK → one remove slice. No silent cuts.

## Plan A (proposed — unchecked)

- [ ] Confirm `@fancyapps/ui` still unused in `site/` (grep imports/CSS)
- [ ] Remove `@fancyapps/ui` only after owner `execute Plan A`
- [ ] `pnpm install` + `pnpm --filter oando-site typecheck` green
- [ ] Evidence under `results/` (command + log paths)

**Keep (not Plan A):** `swiper`, embla, Next/React, Fabric, Three, Supabase, etc.

## Plan B (later — unchecked)

- [ ] Move docs-only deps (`react-router-dom`, `recharts`) into tech-stack-generator if still docs-only
- [ ] Per-package grep before any further cuts

Until owner unlocks execute: leave `package.json` alone.
