# AGENT2 — Prove open3d gate scripts are real

**Checkout:** `D:\OandO07072026`  
**When:** 2026-07-09 (local)  
**Role:** TEST AGENT 2 — verification only (no product code changes)

---

## 1. package.json scripts present — PASS

**Root** `package.json`:

| Script | Value |
|--------|--------|
| `test:e2e:open3d-world` | `pnpm --filter oando-site test:e2e:open3d-world` |
| `gate:open3d` | `pnpm --filter oando-site gate:open3d` |

**Site** `site/package.json`:

| Script | Value |
|--------|--------|
| `test:e2e:open3d-world` | `npm run test:clean && node scripts/run-open3d-world-e2e.mjs` |
| `gate:open3d` | `npm run typecheck && npm run test:e2e:open3d-world` |

Gate chain is callable from repo root → site filter → runner that reads the manifest.

---

## 2. Unit contract — PASS (5/5)

```text
pnpm --filter oando-site exec vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts
```

| Result | Detail |
|--------|--------|
| Exit | **0** |
| File | `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` |
| Tests | **5 passed** in ~8ms (file total ~1.78s) |
| Vitest | v4.1.9, cwd `D:/OandO07072026/site` |
| Report | `results/tests/vitest-results.json` |

**Note:** Root `pnpm exec vitest` fails (`vitest` not on root PATH). Correct invocation is via `oando-site` filter (or `site/` package scripts).

Contract asserts: manifest exists, every listed spec path exists under `site/`, W1–W6 / systems gate name map, runner script present, package scripts wire the gate.

---

## 3. Dry validation (manifest readable) — PASS

```text
node -e "require('fs').readFileSync('site/config/build/playwright-open3d-world-specs.json')"
```

| Result | Detail |
|--------|--------|
| Exit | **0** |
| Bytes | 788 |
| Top keys | `version`, `description`, `workers`, `specs`, `gates`, `evidenceRoot` |
| `version` | 1 |
| `workers` | 1 |
| `evidenceRoot` | `results/planner/world-standard-wave/gate-e2e/` |

**Declared specs (5):**

1. `tests/e2e/open3d-world-standard-journey.spec.ts`
2. `tests/e2e/open3d-w3-select-delete.spec.ts`
3. `tests/e2e/open3d-w4-orbit-continuity.spec.ts`
4. `tests/e2e/open3d-save-honesty.spec.ts`
5. `tests/e2e/open3d-systems-v0-batch-place.spec.ts`

**gates map:** `W1-W2` → journey, `W3` → select-delete, `W4` → orbit, `W5-W6` → save-honesty, `systems-v0` → batch-place.

Runner truth: `site/scripts/run-open3d-world-e2e.mjs` loads this JSON, fails if specs missing, runs  
`playwright test -c config/build/playwright.config.ts …specs… --workers=N`, writes `playwright-raw.log` + `run.json` under this evidence dir.

---

## 4. Optional browser smoke (ONE spec) — RAN; FAIL (product UI, not missing gate)

**Dev server:** `http://localhost:3000` and `http://127.0.0.1:3000` both **HTTP 200** → smoke attempted.

### Attempt A — wrong config (control: proves baseURL wiring matters)

```text
pnpm --filter oando-site exec playwright test tests/e2e/open3d-w3-select-delete.spec.ts --workers=1
```

- Exit **1**
- Error: `page.goto: Cannot navigate to invalid URL` for `/planner/guest/?plannerDevTools=1`
- Cause: no `-c config/build/playwright.config.ts` → no `baseURL`

### Attempt B — official config (matches gate runner)

```text
pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w3-select-delete.spec.ts --workers=1 --reporter=list
```

| Result | Detail |
|--------|--------|
| Exit | **1** |
| Spec | `open3d-w3-select-delete.spec.ts` (single) |
| Project | chromium |
| Duration | ~18.6s |
| Failure | `TimeoutError: locator.click` on `getByRole('region', { name: 'Catalog browser' }).getByRole('button', { name: /Add .* to canvas/i }).first()` |
| Detail | Button resolved (`Add Proof chair to canvas`); **pointer intercept** by `footer.workspace_status` / `inventory_resultsInfo` overlays |
| Evidence | `results/test-results/e2e-open3d-w3-select-delet-4e252-ete-removes-Ctrl-Z-restores-chromium/error-context.md` |

**Honest read:** Gate scripts and Playwright config path are **real and wired**. The one-spec smoke **did run in a browser** against a live server. Failure is **UI hit-target / overlay**, not a missing script, missing manifest, or fake gate.

---

## 5. Verdict

| Check | Status |
|-------|--------|
| Root `test:e2e:open3d-world` + `gate:open3d` | **Present** |
| Site scripts + `run-open3d-world-e2e.mjs` | **Present / real** |
| Manifest JSON dry read | **PASS** |
| Vitest gate contract | **PASS 5/5** |
| Browser smoke (1× W3) | **Executed; FAIL** (overlay intercept — product flake/bug, not absent gate) |

**Gate scripts are real.** Unit contract + dry manifest prove CI/script truth is not “folder-only.” Optional e2e proves the configured Playwright path launches; green full pack not claimed here.

---

## Commands log (what actually ran)

```text
# 1 scripts
# package.json grep: test:e2e:open3d-world, gate:open3d (root + site)

# 2 unit
pnpm --filter oando-site exec vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts
# → exit 0, 5 passed

# 3 dry
node -e "… readFileSync('site/config/build/playwright-open3d-world-specs.json') …"
# → exit 0, 788 bytes, keys listed above

# 4 server probe
# Invoke-WebRequest http://localhost:3000 → 200

# 4 smoke (wrong then right config)
pnpm --filter oando-site exec playwright test tests/e2e/open3d-w3-select-delete.spec.ts --workers=1
# → exit 1, invalid URL (no baseURL)

pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w3-select-delete.spec.ts --workers=1 --reporter=list
# → exit 1, click intercept on Add to canvas
```
