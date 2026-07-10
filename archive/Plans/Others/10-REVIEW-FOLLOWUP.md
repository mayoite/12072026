# Code review follow-up + suggestions

## Confirmed still good (re-check)

| Control | Status |
|---------|--------|
| `skipCompile` + precompiled SVG on Puck publish | Present |
| GLB policy path-only (no query spoof) | Present |
| pipelineCore polygon types | Fixed in harden wave |

## Suggestions (priority)

| # | Suggestion | Why | When |
|---|------------|-----|------|
| 1 | **P0.2: write G5 buffer to disk or Supabase under `catalog-assets/generated/` then stamp** | Path-only stamp can 404 G8 | Next kill-path |
| 2 | **G8: if load fails, keep procedural and surface one console/toast once** | Avoid silent thrash | With P0.2 |
| 3 | **Fix `next build` `/contact` createContext** | Blocks Playwright default webServer | Before CI e2e on build |
| 4 | **P0.3 nested main + hydration** | Real a11y debt | After P0.2 |
| 5 | **Do not turn on DEV_AUTH_BYPASS on public SSR** | Security | OPS always |
| 6 | **Optional: cookie inject for e2e without dual production flags** | Cleaner than ALLOW_PRODUCTION | Later polish |
| 7 | **Figma library** | Only if you want design tokens in Figma — **not needed for P0** | After P0 |

## Not suggested now

- Full Fabric cutover before G8 works  
- 4c/64G SSR  
- Deleting V1 compiler (keep reference-only)

---

See also: [05-CODE-REVIEW.md](./05-CODE-REVIEW.md) · [12-WORKFLOW.md](./12-WORKFLOW.md)
