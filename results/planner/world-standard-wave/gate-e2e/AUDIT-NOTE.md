# AUDIT-NOTE — gate-skips / hollow vs open3d world e2e pack

**Date:** 2026-07-09  
**Scope:** Explore only — does `audit-gate-skips` or hollow audit need updating for the new open3d world e2e pack?  
**Constraint:** Do **not** expand `release:gate` / `gate:full` to run the 5 long open3d e2e by default (too heavy; not current pattern).

---

## Verdict

**No change required** for landing or operating the new pack.

| Tool | Action |
|------|--------|
| `site/scripts/audit-gate-skips.mjs` | **No change required** |
| `site/config/build/playwright-gate-specs.json` | **No change required** (and must **not** be used to drag open3d into `release:gate` execution) |
| `site/scripts/audit-hollow-tests.mjs` | **No change required** |

Optional hygiene (non-blocking) is listed below — **not** a must-change for this pack.

---

## What the new pack is

| Piece | Path / command |
|-------|----------------|
| Manifest | `site/config/build/playwright-open3d-world-specs.json` (5 specs, `workers: 1`) |
| Runner | `site/scripts/run-open3d-world-e2e.mjs` |
| npm | `test:e2e:open3d-world`, `gate:open3d` (= typecheck + that pack) |
| Evidence | `results/planner/world-standard-wave/gate-e2e/` |
| Contract unit | `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` |

**Specs in pack (not in `release:gate` Playwright set):**

1. `tests/e2e/open3d-world-standard-journey.spec.ts` (W1–W2)
2. `tests/e2e/open3d-w3-select-delete.spec.ts` (W3)
3. `tests/e2e/open3d-w4-orbit-continuity.spec.ts` (W4)
4. `tests/e2e/open3d-save-honesty.spec.ts` (W5–W6)
5. `tests/e2e/open3d-systems-v0-batch-place.spec.ts` (systems-v0)

Other open3d e2e files on disk (configurator, place-delete, mesh shots, workstation) are **outside** this pack manifest — still not on any default gate script.

---

## `audit-gate-skips` — why no change is required

**Behavior today** (`site/scripts/audit-gate-skips.mjs`):

- Loads **only** `site/config/build/playwright-gate-specs.json`
- Fails if any listed file is missing or contains `test.skip(` / `describe.skip(`
- Wired into `release:gate` via `test:audit:gate-skips`

**Current `playwright-gate-specs.json` allowlist** (release-gate Playwright surface for *skip audit*, not a full script dump):

- `tests/accessibility.spec.ts`
- `tests/e2e/site-navigation-smoke.spec.ts`
- `tests/e2e/planner-catalog.spec.ts`
- `tests/e2e/planner-guest-workspace.spec.ts`
- `tests/e2e/planner-custom-tools.spec.ts`
- `tests/e2e/planner-chrome.spec.ts`

**Design alignment:**

- Description of that JSON: specs included in **`release:gate`** skip audit.
- `release:gate` runs `test:a11y` + `test:planner-catalog` — **not** `test:e2e:open3d-world`.
- Open3d world pack is an intentional **separate** gate: `gate:open3d` / `test:e2e:open3d-world`.

So skip-audit scope matching **`release:gate`** remains correct without listing the 5 open3d specs.

**Do not:** add the 5 open3d paths to `playwright-gate-specs.json` as a way to “include” them in release — that file is the skip-audit allowlist for the release Playwright set; bloating it without also changing `release:gate` would only mix concerns. Putting them on `release:gate` itself is **rejected** for this wave (runtime cost).

**Spot-check:** no `test.skip` / `describe.skip` in current `open3d-*.spec.ts` files (grep clean at audit time).

---

## Hollow audit — why no change is required

**Behavior today** (`site/scripts/audit-hollow-tests.mjs`):

- Walks **all** `site/tests/**` matching `*.(test|spec).[cm]?[jt]sx?` — **includes e2e**
- Patterns: `expect(true).toBe(true)`, sole `toBeTruthy()`, empty `catch`, and zero-`expect` only for files that use `it(` blocks
- Wired into `release:gate` / `release:gate:fast` (fast uses `--exclude-marketing`)

Open3d e2e files are already in scope. They use Playwright `test()`, not Vitest `it()`, so the zero-expect rule is effectively Vitest-oriented; the three regex patterns still apply to e2e.

**Spot-check:** no hollow patterns matched in `open3d-*.spec.ts` at audit time. No hollow-script update needed for the new pack.

---

## `release:gate` / `gate:full` — leave heavy open3d out

Confirmed current pattern:

```text
gate          → release:gate:fast   (no Playwright product e2e)
gate:full     → release:gate        (a11y + planner-catalog + audits/coverage; no open3d pack)
gate:open3d   → typecheck + 5-spec open3d pack
```

**No change** to pull the 5 long e2e into `release:gate` / `gate:full` by default.

---

## Optional follow-ups (not required for this pack)

These are **hygiene**, not blockers for the open3d world pack:

1. **Skip-audit multi-manifest (nice-to-have)**  
   Extend `audit-gate-skips.mjs` to union:
   - `playwright-gate-specs.json` (release Playwright)
   - `playwright-open3d-world-specs.json` (open3d pack)  
   Benefit: `test.skip` cannot hide in the open3d pack while still running skip audit on every `release:gate` — **without** executing those 5 e2e.  
   Keep manifests separate so “audited for skips” ≠ “runs inside release:gate”.

2. **Pre-existing catalog vs gate-specs drift (unrelated to open3d pack)**  
   `test:planner-catalog` also runs `admin-smoke`, `sketch-to-plan-pipeline`, `planner-offline-sync`, which are **not** in `playwright-gate-specs.json`. Same class of gap as prior code-audit notes; not introduced by the open3d pack. Fix only if tightening release skip coverage for catalog.

3. **Remaining open3d e2e outside the pack**  
   Configurator / place-delete / mesh-batch / workstation specs stay opt-in until someone extends the manifest deliberately.

---

## Summary one-liner

**No change required** to `audit-gate-skips` or hollow audit for the new open3d world e2e pack; keep open3d on `gate:open3d` only — do not fold the 5 long e2e into `release:gate:full`.
