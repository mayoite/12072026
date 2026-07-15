# Issues 05 — Tech stack & platform

**Source:** Earlier major-issue audit + engines lock + Security checklist.  
**UI verified:** No.  
**One sentence each.**

1. Node 24 plus pnpm 11 with hoisted linker is a hard floor; wrong Node or nested install breaks the monorepo.  
2. Nested install inside `site/` or `tech-docs-generator/` is forbidden and still a common agent failure mode.  
3. Next 16 defaults to Webpack for dev while Turbopack is opt-in, creating two runtime shapes to debug.  
4. Fabric, Three/R3F, and SVG.js are three render stacks that only stay coherent if one project document is perfect.  
5. Catalog and SVG target is Drizzle plus postgres plus R2, but live SVG is still disk files.  
6. Supabase client boundary is restricted while residual Supabase migrations and schema still sit in the tree.  
7. Vitest fork pool is required for Windows V8 coverage safety; coverage tooling is fragile on this OS.  
8. Playwright Chromium is not the Chrome DevTools MCP channel, so browser proof and Lighthouse claims split.  
9. Secrets must live only in repo-root `.env.local`; mis-scoped env files silently break auth and database.  
10. `DEV_AUTH_BYPASS` is easy to leave on in local and CI and voids security claims.  
11. Turbo release gate is heavy while day-to-day unit green creates false confidence.  
12. i18n is Site-only; Planner and Admin are English-only, so partial locale is forbidden yet easy to half-add.  
13. `localePrefix: never` complicates SEO and hreflang correctness across five locales.  
14. Immutable content-addressed R2 artifacts are designed but not the live release authority for SVG.  
15. Sharp and native binary checks make builds environment-sensitive on Windows.  
16. Large monorepo script surface multiplies operational footguns without product completion.  
17. TypeScript forbids handwritten `any`, but parallel legacy modules still grow type surface and duplication.  
18. Results under `results/` are tool output only and must never prove PASS.  
19. Tech-docs-generator is a second package on the root build path but is not shipped product code.  
20. CSP, headers, and canvas engine origins are not production-proven as route-specific least-privilege policy.

## Security checklist reality

- Almost every `SEC-*` and `DB-SVG-14`/`19` item remains open until fresh positive and negative proof.
