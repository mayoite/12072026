# Full unit suite — fresh run

**Verdict:** FAIL  
**Command:** `pnpm run test` (from repo root)  
**Exit:** 1  
**Duration:** ~1448s

## Counts

| Metric | Value |
|--------|------:|
| Test files failed | **23** |
| Test files passed | 1375 |
| Tests failed | **37** |
| Tests passed | 6876 |
| Total tests | 6919 |
| Unhandled errors | 1 (vitest worker exited unexpectedly) |

## Fail clusters (not exhaustive)

| Area | Examples |
|------|----------|
| Planner host / routes | `hostWiringP01`, `routesCoverage`, `cleanupPhase08` |
| Palette authority | `canvasToolPaletteAuthority` (deferred room / a11y labels) |
| Cloud saves / sync | `plannerCloudSaves` PUT/DELETE; `syncQueueProcessor` CSRF message |
| Catalog policy | `catalog.test` admin write routes; `s7CatalogConsume`; `fabricBlock2D` SVG URL |
| Workspace shell | `workspaceShell` TopBar/panels |
| Site | `navigation-coverage`, `solutions/page`, `download-brochure` |
| Admin | `AdminLayoutShell` multiple mock-logo; dashboard hub; svg-editor route |
| API | `project-sketch` 410; admin svg-editor pipeline thumb |

## Note

Suite ran ~24 min while other repairs landed mid-session. **Re-run required** after freeze of working tree before treating this as the final FAIL list. Some focused suites (security 79, lint/a11y 58) passed earlier and may not match this full log.

## Next

1. Freeze code  
2. `pnpm run test` again  
3. Fix by cluster (host graph → cloud CSRF messages → site/admin UI tests)  
4. No release claim until files failed = 0 and unhandled errors = 0
