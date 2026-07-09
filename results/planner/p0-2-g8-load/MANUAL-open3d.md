# P0.2 part B — Manual open3d G8 load check

Unit coverage proves URL resolution + mock GLTF load. Full Chrome load needs
real bytes at a fetchable URL (part A storage/upload). Use this when a GLB is
available under `catalog-assets/generated/` (local public or CDN).

## Preconditions

1. Dev server: from `site/`, `npm run dev` (or existing running app).
2. A real `.glb` reachable at either:
   - same-origin: `{origin}/catalog-assets/generated/<file>.glb`
   - or absolute HTTPS URL whose path contains `/catalog-assets/generated/`
3. Furniture document field `generatedGlbUrl` set to a policy path, e.g.
   `catalog-assets/generated/<file>.glb` (no leading slash is OK — viewer pins to origin root).

## Steps

1. Open `/planner/open3d` (or workspace route that mounts `ThreeViewerInner`).
2. Place modular furniture (procedural mesh appears first).
3. Stamp / set `generatedGlbUrl` to the relative path (after upload/write of bytes).
4. Ensure project rebuilds 3D content (save/reload or same-session project update).
5. DevTools Network: request should be **absolute**  
   `{origin}/catalog-assets/generated/<file>.glb`  
   **not** `{origin}/planner/catalog-assets/...` or page-directory relative.
6. Scene: procedural box replaced by loaded GLB (`userData.meshSource === "generated-glb"`).
7. On 404 / load error: procedural mesh must remain (no crash).

## Failures that are NOT part B

| Symptom | Likely cause |
|---------|----------------|
| Network 404 at correct absolute URL | Path-only stamp without bytes (part A / upload) |
| Policy reject, no network call | Designer static URL |
| Wrong relative path under `/planner/` | Old build without `resolveGeneratedGlbFetchUrl` |

## Why Playwright is optional here

- Full browser E2E needs auth + real GLB bytes + open3d scene harness.
- Part B kill-path is: relative document URL → absolute fetch URL for GLTFLoader.
- Covered by unit tests in `loadGeneratedGlbObject.test.ts` (`resolveGeneratedGlbFetchUrl`).
