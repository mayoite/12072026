# Code Review — Open3d world-standard e2e **gate wire**

**Date:** 2026-07-09  
**Scope (gate wire only — no product feature thrash):**

| Path | Role |
|------|------|
| `site/config/build/playwright-open3d-world-specs.json` | Manifest: specs, workers, gates map, evidenceRoot |
| `site/scripts/run-open3d-world-e2e.mjs` | Callable runner → Playwright + `run.json` / `playwright-raw.log` |
| `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` | Filesystem + script contract (vitest) |
| Root `package.json` + `site/package.json` | `test:e2e:open3d-world`, `gate:open3d` |

**Intent (from NOTES / wave):** W-gate browser proof must be a **named, CI-callable pack**, not folder-only evidence. Keep out of fast `pnpm gate`.

**Contract evidence re-run (this review):**  
`pnpm exec vitest run tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` → **5/5 passed**.

---

## Strengths

1. **Single source of pack truth** — Manifest lists five real specs under `tests/e2e/`, all present on disk (journey, W3, W4, save honesty, systems-v0 batch). Gates map ties W-ids to basenames for agents/CI lookup without inventing a second list of paths.

2. **Runner does real work, not theater** — Validates manifest + every spec path, `mkdir`s repo-root evidence dir, spawns Playwright with explicit config and `workers=1`, captures full stdout/stderr to `playwright-raw.log`, writes structured `run.json` (exitCode, status, specs, timestamps), exits with Playwright status. Matches AGENTS layout: evidence under **repo-root** `results/…`, not `site/results/`.

3. **Layout-correct evidence root** — Hardcoded `repoRoot/results/planner/world-standard-wave/gate-e2e/` aligns with `evidenceRoot` in the JSON and with wave NOTES. No forbidden `site/results/` drift.

4. **Contract tests are real, not hollow** — Asserts: file exists, version/workers, every path on disk under `tests/e2e/*.spec.ts`, required W filenames, **gates map required and every gate basename ∈ specs[]**, runner path + site `package.json` scripts point at the runner. That is purpose-over-percentage for a gate wire.

5. **Package wiring is complete for this repo** — Site: `test:e2e:open3d-world` (clean + runner), `gate:open3d` (typecheck + pack). Root: both scripts `pnpm --filter oando-site …` so `pnpm gate:open3d` / `pnpm test:e2e:open3d-world` work from workspace root as documented in NOTES.

6. **Sensible defaults for open3d** — `workers: 1` (and enforced by contract); `NEXT_PUBLIC_PLANNER_DEV_TOOLS` defaulted true in runner env; not glued into fast `release:gate:fast` / `gate` (NOTES correctly warn the pack is slow).

7. **No product thrash** — No planner/open3d feature code touched. Pure wire: config + script + unit contract + package scripts.

8. **Consistent with existing e2e patterns** — Same Playwright config path as other site e2e scripts; `--reporter=list` matches e.g. `test:e2e:p0-admin-svg` for terminal/log capture.

---

## Issues

### Critical (Must Fix)

None.

### Important (Should Fix)

None that block land of this gate wire.

**Out of scope (not a wire defect):** Whether the five e2e specs are currently green under a full browser run is a **product/evidence** question for `pnpm test:e2e:open3d-world` / `gate:open3d`, not a defect in the wire itself. The wire’s job is callable pack + contract + correct artifact paths — that job is met.

### Minor (Nice to Have)

1. **`evidenceRoot` in manifest is documentation-only**  
   - File: `playwright-open3d-world-specs.json:19` vs `run-open3d-world-e2e.mjs:20–27`  
   - Runner hardcodes the evidence directory; it does not read `manifest.evidenceRoot`.  
   - Today values match. Drift risk if someone edits only the JSON.  
   - Optional fix: resolve `evidenceRoot` from manifest (repo-relative) with the current path as fallback, and assert in unit test that runner path and/or parsed root still starts with `results/`.

2. **Spawn failure detail not logged**  
   - File: `run-open3d-world-e2e.mjs:70–84`  
   - If `npx` fails to spawn, `result.status` is null → exit 1 and empty-ish log; `result.error` is not written.  
   - Optional: append `result.error?.message` / `result.signal` into the combined log and `run.json`.

3. **Root `package.json` scripts not in unit contract**  
   - File: `playwrightOpen3dWorldSpecs.test.ts:84–94`  
   - Contract checks **site** scripts only. Root wrappers exist and are correct; a one-liner reading `path.join(siteRoot, "../package.json")` would lock `pnpm gate:open3d` from repo root against accidental deletion.  
   - Not blocking — dual wiring is already present and greppable.

4. **`--reporter=list` replaces config reporters**  
   - File: `run-open3d-world-e2e.mjs:62`  
   - CLI `--reporter=list` overrides `playwright.config.ts` multi-reporters (html/json). Acceptable for gate evidence (stdout → `playwright-raw.log`). Document in NOTES if agents expect html under `results/playwright-report/` from this pack specifically.

5. **Malformed JSON throws uncaught**  
   - File: `run-open3d-world-e2e.mjs:38`  
   - `JSON.parse` without try/catch → stack trace vs `fail("…")`. Low likelihood; optional wrap.

6. **systems-v0 only via gates map / specs list, not hard filename regex**  
   - Filename test locks journey/W3/W4/save; systems-v0 is still locked because gates map is fully validated against `specs[]` and includes `systems-v0`. No action required unless you want a redundant basename regex for symmetry.

---

## Recommendations

- Land as-is for gate wire; do not expand into product feature work in the same slice.
- When first CI/agent full run lands, keep `run.json` + `playwright-raw.log` under this folder (runner already does this).
- Optional follow-up (same module, tiny): honor `evidenceRoot` from manifest + log `result.error` — only if you touch the runner again.
- Keep open3d pack **out** of fast `gate` unless product explicitly wants multi-minute browser in every PR.

---

## Assessment

| Check | Result |
|-------|--------|
| Manifest lists real e2e specs | Pass (5 files on disk) |
| Runner callable, evidence under repo-root `results/` | Pass |
| Unit contract real (paths + scripts + gates) | Pass (5/5) |
| Root + site package scripts | Pass |
| Not stuffed into fast gate | Pass |
| No `any` / product thrash | Pass |
| Critical / Important blockers | None |

### Verdict

**Approve**

**Reasoning:** Gate wire is tight, layout-correct, and contract-tested. Specs/gates/scripts line up; runner writes honest PASS/FAIL evidence at the documented root path. Minor DRY/logging nits do not justify blocking. Ready to land as the callable open3d W-pack entrypoint; full browser greenness is a separate run of `gate:open3d`, not a wire reject.
)
