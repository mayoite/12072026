# Marketing Site — Walkthrough

**Scope:** Marketing routes, copy, chrome, hero/sections. See `site/app/(site)/`, `site/components/site/`, `site/lib/site-data/`, `site/components/home/`.

**References (refer, do not duplicate):** 
- `docs/Lockedfiles/site/current.md` (baseline)
- `docs/architecture/MODULE-LAYOUT.md` (app vs components vs lib)
- `docs/architecture/SITE-MARKETING-UI-CONTRACT.md`
- `site/lib/site-data/CONTENTS.md`
- `Readme.md` (static data)
- `START.md` (commands)
- GS: `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` §6 (anti-copy, evidence)

## Steps

1. Update copy in `site/lib/site-data/` (homepage.ts, nav trees).
2. Edit thin route shells in `site/app/(site)/`.
3. Use presentational components from `site/components/`.
4. Verify semantic tokens only (no hex) per CSS-SOLUTION.
5. Typecheck + relevant site tests.
6. Check i18n if localized copy changed.

## Commands (Windows PowerShell)

```powershell
# from repo root
pnpm --filter oando-site run typecheck
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
cd site
pnpm exec vitest run tests/ --config vitest.site.config.ts -t "marketing|site-data"
pnpm run docs:sync:tech-stack   # after structural change
```

## Workflow Diagram (Mermaid)

```mermaid
flowchart LR
    A[Edit site-data copy] --> B[Thin route/page shell in app/(site)]
    B --> C[Presentational component update]
    C --> D[Token audit: no hex, refer theme.css]
    D --> E[Local dev: pnpm run dev]
    E --> F[Site UI smoke: test:e2e:nav]
    F --> G[Update tech-stack docs via generator]
    G --> H[Evidence in results/site/ + re-gen]
```

## Plan for Images/Screenshots

- Capture hero + key sections on / (desktop + mobile).
- Store in `results/site/marketing-site/screenshots/` (per testing-handbook).
- Include in future tech-stack-generator page render if wired (see MermaidDiagram component).
- Alt text + date-stamp filenames. Update this doc's "Screenshots captured" list on evidence add.
- Visual diff against locked baseline in `docs/Lockedfiles/site/`.

**Anti-copy note:** All references point outward. Revise source docs first when facts drift. No pasted prose from AGENTS.md or Readme.md.
