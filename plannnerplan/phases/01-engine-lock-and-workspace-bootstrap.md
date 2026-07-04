# Phase 01 — Engine Lock & Workspace Bootstrap

Date: 2026-07-04
Status: Planned

## Objective
Pin the two engines (Fabric 7.4.0 for 2D, Three.js r185 + @react-three/fiber for 3D) and add the locked package set in a single install, then prove dev boot and existing routes keep rendering. No new feature work — only the workspace foundation that every later phase inherits.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — locked engines, package set, status vocabulary
- `D:\new\plannnerplan\QUALITY-GATES.md` — engine-lock gate, source-quality gate, test layers
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0401 ownership
- `D:\new\PACKAGES.md` — Tier-1 locked lines for install
- `D:\new\CONTENTS.md` — repo map: where `site/`, `pnpm-workspace.yaml`, root `package.json` live
- `D:\new\AGENTS.md` — Warp Rule 1 authority link-only reference

## Scope
In scope: pinning engines in `oando-site` `package.json`, single `pnpm add` for the locked Tier-1 packages, dev boot smoke, vitest smoke regression check, content-hash for AGENTS.md authority, doc updates.

Out of scope: Mantine install, Theme wiring, _archive/fabric/ cleanup, route swap, Supabase schema. Mantine is locked-deferred per PACKAGES.md until PostCSS namespace split lands in Step 2.

## Checklist
### Install (01-INST)
- 01-INST-01 `fabric@7.4.0` pinned in `site/package.json` (no `^`, no `~`); resolve succeeds.
- 01-INST-02 `three@^0.185.1` + `@types/three@^0.185.0` already present — verify entry, do not duplicate-edit.
- 01-INST-03 `@react-three/fiber` added with version aligned to three peer (`latest` per PACKAGES.md; pin resolved at install gate).
- 01-INST-04 Single `pnpm add --filter oando-site` runs clean: no peer-dep warnings become errors.
- 01-INST-05 SVG pipeline installed in same lockstep: `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`.
- 01-INST-06 Admin panel set installed in same lockstep: `@puckeditor/core`, `@ark-ui/react`, `react-aria-components`, `zod`, `@phosphor-icons/react`, `@vercel-labs/json-render` (installed, inactive).
- 01-INST-07 `pnpm-lock.yaml` committed-level diff is reviewed; no transitive downgrades to Fabric 7.4.0 or r185.

### Workspace (01-WORK)
- 01-WORK-01 Root `package.json` scripts proxy unchanged; `pnpm --filter oando-site run dev` is the canonical dev command.
- 01-WORK-02 `site/.turbo` and `site/.next` caches permitted to clear on engine bump; rebuild documented in `OPERATIONS_RUNBOOK.md`.
- 01-WORK-03 `/planner/guest` and `/planner/canvas` keep rendering Fabric mount points (smoke screenshot via Playwright after build).
- 01-WORK-04 `/planner/open3d` staff smoke passes (3D bundle lazy-loaded; r3f peer satisfied).
- 01-WORK-05 `_archive/fabric/` mirrors untouched.

### Verification (01-VERI)
- 01-VERI-01 `pnpm install` completes clean; no `ERR_PNPM_PEER_DEP_ISSUES` blocks.
- 01-VERI-02 vitest smoke suite reports same pass count as pre-install baseline (no regression).
- 01-VERI-03 Dev server boot reaches `/planner/guest` returning HTTP 200 with Fabric canvas mount in body.
- 01-VERI-04 `node -e "require('fabric')"` from `site/` returns Package version `7.4.0` (sanity check, no runtime call).

### Governance (01-GOV)
- 01-GOV-01 AGENTS.md cross-link to Warp Rule 1 added; existing content preserved (lock-only edit).
- 01-GOV-02 Locked-file marker unchanged for `AgentsLocked.md` — any AGENTS.md edit must satisfy the lock protocol.

## Exit gate
- `pnpm install` exits 0.
- Engine versions in installed tree equal locked pins (verified via `pnpm list --filter oando-site`).
- `/planner/guest`, `/planner/canvas` boot smoke green.
- Vitest baseline pass count unchanged (no smoke regression).
- Status moves `Planned → Implemented` only after the install clean-run; `Verified in staging` only after the three route smokes succeed; `Accepted` only after risk register cleared.

## Phase governance
### Forbidden actions
- Do NOT install Mantine (`@mantine/*`) in this phase — locked-deferred per PACKAGES.md.
- Do NOT add a second theme/token system; AGENTS.md authority chain forbids parallel themes.
- Do NOT delete or rewrite `_archive/fabric/` mirrors; Phase 10 owns cleanup.
- Do NOT bump Fabric to 7.4.1+ or Three.js past 0.185.x without IMPLEMENTATION-DECISIONS amendment.
- Do NOT enable `@vercel-labs/json-render` runtime paths; install only, activate in later phase.
- Do NOT run `pnpm install --no-frozen-lockfile` — defends 01-INST-04 lockfile fidelity.
- Do NOT pass `--strict-peer-dependencies=false` or suppress peer-warnings filters — defends 01-VERI-01 clean install.
- Do NOT introduce `:any` typings via `@types/fabric` resolution overrides — defends 01-INST-01 exact pin.

### Phase entry checklist
- Warp Rule 1 active (commands may run without per-call permission).
- `pnpm-lock.yaml` clean baseline (no in-flight merge).
- Branch is `D:\oandO04072026` worktree per HANDOVER.md (NOT direct `D:\new` commits).
- All six source-of-truth files read and confirmed unmodified-this-cycle.

### Rollback criteria
- Two or more peer-dep warnings escalated to errors → abort and re-plan install order in Phase 01 revision.
- Fabric version in installed tree ≠ 7.4.0 → abort (lock pin violated).
- Vitest smoke shows new failures not present pre-install → abort and roll back lockfile.

### Risk register
- Risk: peer-dep conflict between `three` 0.185 and a stale `@react-three/fiber` resolved by lock resolution. Mitigation: install r3f in the same transaction; capture resolved versions in HANDOVER.md.
- Risk: install timeouts on large lockfile → retry with `--prefer-offline`; do not switch registries.
- Risk: Fabric 7.4.0 React 19 peer surfacing → confirmed acceptable per PACKAGES; document any new warning explicit, do not silence.

### Success metrics
- Install time: p95 ≤ 90 s on warm cache.
- Engine pins: zero version drift across `site/` and `tech-stack-generator/`.
- Smoke regressions: 0 new failures.
- Dev boot to first Fabric paint: ≤ 4 s on cold cache, ≤ 1.5 s on warm.

### Dependencies
- pnpm workspace (single source of locks).
- npm registry reachable (cache hit preferred).
- No Supabase dependency yet (Phase 08).

### Performance budgets
- Bundle delta: ≤ 1.2 MB raw, ≤ 350 KB gzip on `oando-site` after install.
- Reserved byte budget for `@vercel-labs/json-render`: 0 B runtime until activated.
- 3D renderer absent from default 2D load (r3f must lazy-import).

### Security considerations
- `@vercel-labs/json-render` not exposed to user input yet — Tier-3 reserved.
- `pnpm-lock.yaml` integrity invariants hold (no `--no-frozen-lockfile`); audit advisories opened in `docs/api/` if any CVE surfaces at install.
- No `:any` introduced; install must not pull an `@types/fabric` patch that injects `any`.

### Accessibility considerations
- Install of `@ark-ui/react` does not auto-mount dialogs/comboboxes; Editor (Phase 04) owns first mounting and a11y wiring.
- `react-aria-components` available for later phases; do not duplicate-load Radix fallback.
- No accessibility regression test in this phase — defer to Phase 04 visual benchmark.

### Decision log
- 2026-07-04 — Decision: pin Fabric 7.4.0 strict (no semver) to defeat accidental upgrade. Reason: IMPLEMENTATION-DECISIONS locks rolled engine. Alternatives: `^7.4.0` for minor flexibility — rejected (the lockfile already provides the protection and the pin must be auditable in one line). Owner: Build agent.
- 2026-07-04 — Decision: install `@vercel-labs/json-render` but mark inactive. Reason: Tier-3 reserved per PACKAGES.md (marketing-only, opt-in). Alternatives: defer install to a future phase — rejected because the orchestrator wants one atomic transaction. Owner: Build agent.
- 2026-07-04 — Decision: AGENTS.md link-only edit to point at Warp Rule 1. Reason: authority chain must be visible without re-stating rule content. Alternatives: no edit — rejected because IMPLEMENTATION-DECISIONS mandates the cross-reference. Owner: Build agent.
