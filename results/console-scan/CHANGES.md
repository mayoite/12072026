# Changes made — console errors debug session

**Date:** 2026-07-10  
**Worktree:** `C:\Users\ayush\.cursor\worktrees\OandO07072026\qde3`  
**Branch:** `cursor/44eb0bce`  
**Not committed** (awaiting owner `git add` / commit)

---

## Summary

Investigated browser console errors across marketing and planner routes. Fixed reproducible **400 Bad Request** errors on `/contact/` and `/products/*` caused by missing client logo PNG files in the worktree. Planner routes were already clean for the product bar.

---

## Files changed

### 1. `.gitignore`

**Change:** Added one un-ignore line so client logo PNGs under `site/public/` can be tracked by git.

```diff
 *.png
 !/public/**/*.png
+!site/public/images/client-logos/*.png
 !site/tests/e2e/**/*-snapshots/*.png
 !results/planner/**/*.png
```

**Why:** Global `*.png` ignore only exempted repo-root `public/`, not `site/public/images/client-logos/`. JPG logos were tracked; PNG logos were silently gitignored, so fresh worktrees got 20 JPGs but 0 PNGs.

---

### 2. `site/public/images/client-logos/*.png` (14 files added on disk)

Copied from main checkout `D:\OandO07072026\site\public\images\client-logos\` into the worktree:

| File |
|------|
| `AmbujaNeotia.png` |
| `FHI360.png` |
| `IDBIBankLogo.png` |
| `IncomeTaxdepartment.png` |
| `JSW.png` |
| `LandT.png` |
| `MarutiSuzuki.png` |
| `SAIL.png` |
| `ShriramTransportFianance.png` |
| `SITICable.png` |
| `SyndicateBank.png` |
| `Titan.png` |
| `UnitedBankofIndia.png` |
| `USHA.png` |

**Why:** Code references these paths in `site/lib/site-data/clientLogos.ts` and `site/lib/site-data/homepage.ts`. Without files on disk, Next.js `/_next/image/` returned **400**.

---

### 3. Evidence / docs added (no product code changes)

| Path | Purpose |
|------|---------|
| `results/console-scan/SESSION-CHECKPOINT.md` | Durable session handoff (survives context compaction) |
| `results/console-scan/route-console-scan.json` | Pre-fix multi-route headless scan |
| `results/console-scan/post-fix-scan.json` | Post-fix verification |
| `results/console-scan/CHANGES.md` | This file |

Existing evidence reused (not modified):

- `results/planner/benchmark-quality/console-capture.json`
- `results/planner/benchmark-quality/tw2/console-clean-report.json`

---

## What was **not** changed

- No TypeScript/React source edits
- No debug instrumentation added to app code
- No git commit or push
- Main checkout `D:\OandO07072026` — sync attempted but interrupted; may still need `.gitignore` line + evidence copy there

---

## Verification results

### Before fix

| Route | Console errors |
|-------|----------------|
| `/contact/` | 400 on `/_next/image/?url=...client-logos/*.png` |
| `/products/education/` | Same |
| `/planner/guest/` | Clean (WebGL warnings only) |
| `/` | Clean |

### After fix (`post-fix-scan.json`, 2026-07-10)

| Route | Console errors | Client logos |
|-------|----------------|--------------|
| `/contact/` | **0** | 12 × HTTP 200 |
| `/products/education/` | **0** | 12 × HTTP 200 |
| `/` | 1 unrelated 400 (not client-logos) | — |

E2E `open3d-console-clean.spec.ts` — **PASS** (no SVG 404s, no THREE.Color bleed).

---

## Open items (not fixed this session)

1. **Intermittent** on `/planner/open3d/`:  
   `Can't perform a React state update on a component that hasn't mounted yet`  
   — only on first cold load in `capture-planner-console.mjs`; not reproduced consistently.

2. **`/`** — one generic 400 unrelated to client-logos (needs separate investigation).

3. **Dev-only hydration noise** on `/products/education/` — Lucide vs Phosphor icon SVG mismatch in filter UI; not seen in settled headless runs.

4. **Git tracking** — PNGs on disk but not yet `git add`’d; future worktrees will miss them until committed.

---

## Suggested commit (when ready)

```powershell
git add .gitignore site/public/images/client-logos/*.png results/console-scan/
git commit -m "fix: track client logo PNGs and stop marketing page image 400s"
```

---

## Commands used to verify

```powershell
pnpm install
pnpm run dev
pnpm --filter oando-site exec playwright install chromium
node site/scripts/capture-planner-console.mjs
pnpm --filter oando-site exec playwright test tests/e2e/open3d-console-clean.spec.ts --config=config/build/playwright.config.ts
```

---

## Related code (read-only reference)

- `site/lib/site-data/clientLogos.ts` — logo path map
- `site/lib/site-data/homepage.ts` — homepage trusted-by roster
- `site/scripts/capture-planner-console.mjs` — planner console capture script
- `site/tests/e2e/open3d-console-clean.spec.ts` — planner console product bar
