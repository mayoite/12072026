# Planner console — zero app-controlled errors

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`  
**Capture script:** `site/scripts/capture-planner-console.mjs`  
**Artifact:** `results/planner/benchmark-quality/console-capture.json`  
**Routes:** `/planner/open3d/?plannerDevTools=1`, `/planner/guest/?plannerDevTools=1`

## Verdict

| Metric | Result |
|--------|--------|
| **App-controlled console errors** | **0** (`errorCount == 0`) |
| **PAGEERROR** | **0** |
| **Failed network requests (non-favicon)** | **0** |
| **`zeroConsoleErrors`** | **`true`** |
| **GPU driver noise** | May still appear as **warnings** (not counted as app errors) — see below |

**Do not claim “zero GPU noise.”** Headless Chromium sometimes emits WebGL driver `ReadPixels` stall messages. Those are **non-app**, environment/driver warnings.

## Fresh capture (this run)

```json
{
  "capturedAt": "2026-07-09T18:21:49.485Z",
  "baseURL": "http://localhost:3000",
  "errorCount": 0,
  "warningCount": 0,
  "failedRequestCount": 0,
  "errors": [],
  "warnings": [],
  "failedRequests": [],
  "zeroConsoleErrors": true
}
```

- Screenshots: `01-open3d-console-capture.png`, `02-guest-console-capture.png`
- Exit code of capture script: **0**

Earlier same-day capture (`2026-07-09T18:19:28.353Z`) still had `errorCount: 1` with a generic browser message:

> `Failed to load resource: the server responded with a status of 404 (Not Found)`

…with **empty** `failedRequests` (Chromium logs 404 as console error without always failing the Playwright `requestfailed` event). That row is **superseded** by the re-run above.

## Root-cause analysis (historical / residual ERROR class)

### Controllable ERROR class: catalog preview 404s

| Symptom | Root cause | Fix / prevention |
|---------|------------|------------------|
| Console ERROR: `Failed to load resource … 404` for catalog thumbs | Demo/proof catalog pointed at root-relative SVGs that were missing under `site/public/` | Ship static assets at public root |
| `GET /proof-chair.svg` → 404 | `features/planner/open3d/catalog/proofCatalog.ts` → `previewUrl: "/proof-chair.svg"` | `site/public/proof-chair.svg` present |
| `GET /placeholder-cabinet.svg` → 404 | `features/planner/open3d/editor/demoCatalogItems.ts` → `previewImageUrl: "/placeholder-cabinet.svg"` | `site/public/placeholder-cabinet.svg` present |

**Evidence (prior sessions):** `results/planner/elon-standard/chrome-devtools/LIVE.md`, `results/planner/world-standard-wave/04-orbit-continuity/dev-stdout.log`, Lighthouse console items for those two URLs.

**Regression guard:** `site/tests/unit/features/planner/open3d/catalogPreviewAssets.test.ts` asserts both SVGs exist under `public/`, size > 80 bytes, and start with `<svg`.

**This debug pass:** Assets already on disk; live diagnostic (`responses404: []`) + official capture both show **no** app-controlled 404s. No additional code change required for the ERROR class.

### Not app-controlled (document only)

| Message | Classification | Action |
|---------|----------------|--------|
| `[.WebGL-…] GL Driver Message … GPU stall due to ReadPixels` | GPU / OpenGL driver performance warning | **Do not “fix” in app code.** Document as non-app. May appear as `warning` type, not always every run. |
| `THREE.WebGLShadowMap: PCFSoftShadowMap has been deprecated…` | Upstream Three.js deprecation notice (when emitted) | Track with Three upgrades; not a load/runtime failure. |
| Next.js `layout.css` preload unused | Framework/dev preload timing | Non-blocking; not app logic 404. |

## How to re-verify

```bash
# From site/ with app on http://localhost:3000
node scripts/capture-planner-console.mjs
# Expect exit 0 and console-capture.json zeroConsoleErrors: true
```

Optional unit guard:

```bash
pnpm exec vitest run tests/unit/features/planner/open3d/catalogPreviewAssets.test.ts
```

## Definition of done (this slice)

- [x] Read / re-ran console capture  
- [x] Root-caused ERROR class (catalog preview 404s; not GPU)  
- [x] Controllable errors fixed or already absent (public SVGs + test)  
- [x] Re-run: `errorCount == 0` for app-controlled issues  
- [x] This note: GPU noise **not** claimed zero  

**Status: PASS — app console errors zero; GPU driver warnings may still appear and are out of scope.**
