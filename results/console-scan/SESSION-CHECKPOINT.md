# Console errors debug — session checkpoint

**Saved:** 2026-07-10  
**Branch:** `cursor/44eb0bce`  
**Worktree:** `C:\Users\ayush\.cursor\worktrees\OandO07072026\qde3`  
**Main checkout (full assets):** `D:\OandO07072026`

## Goal

Fix browser console 400 errors on marketing pages from missing client logo PNGs.

## Reproducible errors

| Route | Error |
|-------|-------|
| `/contact/` | `Failed to load resource: 400` via `/_next/image/?url=%2Fimages%2Fclient-logos%2F*.png` |
| `/products/education/` | Same |

Missing PNGs: Titan, LandT, JSW, MarutiSuzuki, IDBIBankLogo, USHA, SAIL (+ 7 more).

## Root cause

`.gitignore` line 70: `*.png` with exception `!/public/**/*.png` — logos are at **`site/public/images/client-logos/`**, so PNGs are gitignored. Worktree has 20 JPGs, missing 14 PNGs present in main checkout.

## Clean (no fix needed)

- `/` — clean
- `/planner/guest/` + 3D — clean (WebGL warnings only)
- E2E `open3d-console-clean.spec.ts` — PASS

## Fix plan

1. Add `!site/public/images/client-logos/*.png` to `.gitignore` — **DONE** (already in `.gitignore`)
2. Copy 14 PNGs from `D:\OandO07072026\site\public\images\client-logos\` — **DONE**
3. Verify — **DONE** (see post-fix below)

## Post-fix verification (2026-07-10)

**Evidence:** `results/console-scan/post-fix-scan.json`

| Route | Before | After |
|-------|--------|-------|
| `/contact/` | 400 on client-logos | **0 errors**, 12 logos HTTP 200 |
| `/products/education/` | 400 on client-logos | **0 errors**, 12 logos HTTP 200 |
| `/` | clean | 1 unrelated 400 (not client-logos) |

**Still open (intermittent):** React state update before mount on `/planner/open3d/` first cold load — separate from logo fix.

## Next steps

- `git add site/public/images/client-logos/*.png` when owner wants to commit
- Optional: investigate homepage unrelated 400
- Optional: fix intermittent open3d React state-update

## Evidence

- `results/console-scan/route-console-scan.json`
- `results/planner/benchmark-quality/console-capture.json`

## Code refs

- `site/lib/site-data/clientLogos.ts`
- `site/lib/site-data/homepage.ts`
- `site/scripts/capture-planner-console.mjs`
