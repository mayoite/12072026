# Blunder report — Code review

**Agent:** code-review (explore)  
**Date:** 2026-07-18  
**Scope:** Planner chrome + Admin SVG editor  
**Not PASS proof.**

## Blunders found

### P1 — product correctness

1. **Parametric republish mints new product `id` every time**  
   - Path: `publishLinearDeskAction.ts` / `descriptorFromFields`  
   - Effect: place stamps `catalogId`; republish breaks resolve / BOQ identity; dual-write idempotency thrashes.  
   - Fix: reuse existing `id` + `generatedAt` for same slug.

2. **GLB place overwrites concurrent project**  
   - Path: `OOPlannerWorkspace.tsx` (snapshot → await → replace project)  
   - Effect: walls/furniture drawn during await discarded.  
   - Fix: merge new node onto current project.

3. **Excalidraw sketch treated as if it were release SVG**  
   - Path: freehand edit view + publish pipeline  
   - Effect: operators can ship wrong authority (sketch ≠ compile IR).  
   - Fix: hard copy + block publish when only sketch dirty.

### P2

- Catalog place not consume-once (double place risk)  
- Excalidraw debounce not cleared on unmount  
- Dirty-from pan/zoom/selection  
- Dock layout persistence cleared every mount  
- Guest `svg-blocks` clears loader cache every GET  
- Tools dock panel placeholder content  

## Not a blunder (solid)

- Admin POST: auth + CSRF + rate limit  
- Dual-write fail-closed when DB authority  
- Guest catalog oando filter  
- CSS modules under `locked/chrome` for docks/rail  

## Parent fix-first

1. Parametric id stability  
2. GLB place merge  
3. Freehand authority UX  
4. Catalog place consume-once  
5. Excalidraw lifecycle cleanup  

**Ship call:** no P0 security hole in slice; P1 identity/place races block honest factory.
