# Content Publishing — Walkthrough

**Scope:** Admin content flows to site/portal (SVG catalog, plans publish, portal render). Involves admin/svg-editor, planner/publish, portal views, Puck Render.

**References:** 
- `docs/Lockedfiles/site/proposed.md` (portal svg-catalog)
- `site/features/planner/admin/svg-editor/`
- `site/features/planner/portal/`
- `plann/00-REVISION.md` (1B)
- `START.md` (no direct publish cmd listed; use admin flows)
- GS §8 SVG + §5

## Steps

1. Author/edit in admin SVG editor or plan workspace.
2. Compile/persist block descriptors + artifacts.
3. Publish to portal/public surfaces (R2 + DB).
4. Verify render in guest/portal (≤1 Render).
5. Audit + test portal view.
6. Update workflows docs + generator.

## Commands

```powershell
pnpm run dev   # admin + portal manual
pnpm --filter oando-site run test:planner-catalog
cd site && pnpm exec vitest run tests/ --config vitest.site.config.ts -t "portal|publish|svg"
pnpm run docs:sync:tech-stack
```

## Workflow Diagram

```mermaid
flowchart TB
    Admin[Admin svg-editor / planner] --> Compile[svgArtifactCompiler + persist]
    Compile --> Store[R2 + products/admin DB]
    Store --> Portal[app/(site)/portal/ + guest]
    Portal --> Render[Puck Render (limited)]
    Render --> QA[release-qa + a11y]
    QA --> Docs[site-workflows/content-publishing/]
```

## Plan for Images/Screenshots

- Admin editor canvas, published portal view, before/after publish.
- Path: `results/site/content-publishing/screenshots/`
- Capture render parity (SVG vs preview).
- Add visual evidence plan to this doc.
