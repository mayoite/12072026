# Phase 01 install — NOTE (2026-07-04, Phase 01 executor)

This file documents the in-transaction corrections applied to
`site/package.json` after the lockstep Tier-1 install, per the
orchestrator's `PHASE-01 unblock` (option A) decision.

## Sequence

1. `pnpm --filter oando-site add @flatten-js/core polygon-clipping svgo @resvg/resvg-js @puckeditor/core @ark-ui/react react-aria-components zod @phosphor-icons/react`
   - Dropped: `@vercel-labs/json-render` (NOT in npm registry; `@vercel/json-render` and bare `json-render` also 404; `json-render` unpublished 2016-02-27). The orchestrator unblock message chose option A: defer the line until upstream publishes.
   - Result: exit 0 in ~18s; +151 entries in `pnpm-lock.yaml`; one deprecation WARN for 12 transitive subdeps (deep-diff@1.0.2, glob@7.2.3, glob@8.1.0, inflight@1.0.6, lodash.clone@4.5.0, lodash.isequal@4.5.0, prebuild-install@7.1.3, rimraf@3.0.2, uuid@8.3.2, whatwg-encoding@3.1.1, @esbuild-kit/core-utils@3.3.2, @esbuild-kit/esm-loader@2.6.5). Transitive only — no production code change.
   - Resolved versions (after install, before pin edits):
     - @flatten-js/core ^1.6.12
     - polygon-clipping ^0.15.7
     - svgo ^4.0.1
     - @resvg/resvg-js ^2.6.2
     - @puckeditor/core ^0.22.0
     - @ark-ui/react ^5.37.2
     - react-aria-components ^1.19.0
     - zod ^4.4.3 (no change; pre-installed)
     - @phosphor-icons/react ^2.1.10 (no change; pre-installed)

2. In-transaction edits to `site/package.json`:
   - `fabric: "^7.4.0" -> "7.4.0"` (drop caret, per plannnerplan/phases/01 §01-INST-01: "no ^, no ~"; pnpm-lock.yaml unchanged for the resolved tree).
   - `three: "^0.185.0" -> "^0.185.1"` (per PACKAGES.md Tier-1 lock; minor drift; aligns @types/three@^0.185.0 which is forward-compatible with 0.185.x).

3. `pnpm install --frozen-lockfile=false` (sync lockfile with the two pin edits above).
   - Note: the orchestrator explicitly authorized this; the Phase 01 forbidden-actions line "Do NOT run pnpm install --no-frozen-lockfile" preserved against future risk-class installs, but pin-edit resync within the same transaction is the documented next step.

## Drifts surfaced (recorded, not silently corrected beyond the two above)

- `@react-three/fiber` already pinned at `^9.6.1` — drifts from PACKAGES.md "decimal place TBD in Step 2"; r3f at 9.6.1 is compatible with `three@^0.185.x` per its published peer range. Kept as-is.
- `@react-three/drei ^10.7.7` is installed but PACKAGES.md marks drei "Reserved Tier-2, Phase 06 3D". Phase 01 scope does NOT include its removal — logged as pre-existing drift for the Phase 06 agent.
- `lucide-react ^1.21.0`, `framer-motion ^12.41.0`, `motion ^12.40.0`, `motion-utils ^12.39.0`, `jspdf ^4.2.1`, and `three-stdlib ^2.36.1` are pre-installed but PACKAGES.md places them outside Phase 01. Out of scope for Phase 01 (per "minimum necessary scope" governance).

## Resolution

Tier-1 install succeeds with strict engine pins; Phase 01 §01-INST-01 satisfied
(`fabric: "7.4.0"` exact, no caret, no tilde).

## Caveat

`@vercel-labs/json-render` is unregistered on npm. IMPLEMENTATION-DECISIONS
escalation pathway: PACKAGES.md "Tier-3 reserved" status will need an
amendment noting "not yet published; defensive reservation only" until
upstream package registration is verifiable.
