# Phase 08 — Persistence & Migration

Date: 2026-07-04
Status: Planned

## Objective
Ship JSON-on-disk descriptor persistence for v1 with atomic-rename version rotation and an explicit Supabase-table migration plan that only promotes behind dual-read evidence. The persistence layer is the durable bridge between admin (Phase 04 writes) and planner/portal consumers (Phase 05/06 reads); it must survive concurrent writes, partial-state failures, and silent schema drift without ever overwriting canonical geometry.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — JSON-on-disk v1, R2 bucket per IMPLEMENTATION-DECISIONS.md, migration policy
- `D:\new\plannnerplan\QUALITY-GATES.md` — atomic-rename gate, dual-read gate, snapshot immutability
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0409 ownership (Supabase table deferred)
- `D:\new\plannnerplan\phases\02-catalog-source-of-truth-and-blockdescriptor.md` — Zod source-of-truth and snapshot hash contract
- `D:\new\plannnerplan\phases\04-admin-portal-svg-editor.md` — the writer surface whose API paths trigger saves
- `D:\new\PACKAGES.md` — locked package set
- `D:\new\CONTENTS.md` — repo map

## Scope
In scope: `site/block-descriptors/` gitignored directory, `{slug}.{n}.json` rotation with `{slug}.latest.json` snapshot pointer, 30 s advisory-lock contention guard, idempotent saves, loader snapshot-only reads, R2 PNG thumbs via existing `catalog_snapshot_upload_r2.ts` helper (content-addressed), Supabase `block_descriptors` table mirror plan with dual-read evidence gate, retention of last 5 versions per slug under `_archive/{slug}.{n-5..n-1}.json` (exclusive of the live `n`), recovery procedure for failed renames, schema-version refusal for newer descriptors.

Out of scope: Mantine-based admin chrome, Puck edits (Phase 04 already shipped the writer contract), `_archive/fabric/` cleanup, route swap (Phase 10), `@vercel-labs/json-render` activation (Tier-3 reserved).

## Architecture
```mermaid
flowchart LR
    A[POST /api/admin/svg-editor] --> B[withAuth admin gate]
    B --> C[Zod BlockDescriptor.parse]
    C -->|invalid| D[Open3dDescriptorError.invalid -> 422]
    C -->|valid| E[Acquire site/block-descriptors/{slug}.lock]
    E -->|timeout 30s| F[409 conflict]
    E --> G[Write {slug}.{n+1}.json fsync]
    G --> H[fs.rename to {slug}.latest.json]
    H -->|fail| I[Restore {slug}.{n}.json from buffer]
    H -->|ok| J[Release lock]
    J --> K[catalog_snapshot_upload_r2.ts -> <bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png]
    K --> L[site/block-descriptors/_archive/ rolls {slug}.{n-5..n-1}.json (exclusive of live n)]
```

Loader reads only `{slug}.latest.json` (snapshot semantics). Dual-read stage adds Supabase mirror behind feature flag; JSON-on-disk remains dev-only until dual-read evidence is signed in `results/planner/phase-08/dual-read/`.

## Checklist
### Storage (08-PERS)
- 08-PERS-01 Directory `site/block-descriptors/` gitignored; generated exclusively by `/api/admin/svg-editor` writes.
- 08-PERS-02 File format `{slug}.{n}.json` where `n` is monotonically increasing per slug; index pointer `{slug}.latest.json` contains `{ slug, n, checksum, schemaVersion }`.
- 08-PERS-03 Atomic rename: write `{slug}.{n+1}.json` to temp + `fsync`, then `fs.rename` to `{slug}.{n}.json`, then update `{slug}.latest.json` — never overwrite the live file directly.
- 08-PERS-04 Concurrent write guard: advisory lock file `{slug}.lock` written with `O_EXCL`; 30 s timeout returns `Open3dPersistenceError.lockBusy` mapped to HTTP `409.lock_busy` (sticky code suffix; never collapses to bare 409 — distinguishes from `409.hash_mismatch` in Phase 02 and `409.save_conflict` in Phase 07).
- 08-PERS-05 Idempotency: identical descriptor re-save yields byte-identical `{slug}.{n+1}.json` (schemaVersion + frozen generatedAt + checksum determinism — see Phase 02 §02-CAT-08 for the freeze rule).
- 08-PERS-06 Loader concurrency: `loadBySlug` reads `{slug}.latest.json` only; while a write is in progress readers see the last fully-committed snapshot, never a partial.
- 08-PERS-07 R2 upload: PNG thumbs complete via existing `catalog_snapshot_upload_r2.ts` helper; idempotent on content hash; CDN URL recorded on descriptor response.
- 08-PERS-08 Migration plan: Supabase `block_descriptors` table mirrors JSON structure (`id`, `slug`, `version`, `schema_version`, `payload jsonb`, `checksum`, `created_by`, `created_at`, `promoted_at`); same Zod schema validates writes regardless of source.
- 08-PERS-09 Compatibility rules: a) JSON-on-disk remains active in dev; b) Supabase ships in staging under feature flag; c) production promotion requires dual-read evidence from `results/planner/phase-08/dual-read/`.
- 08-PERS-10 Schema version check: loader refuses descriptors with `schemaVersion` newer than compile-time constant; surfaces `Open3dDescriptorError.versionMismatch` mapped to HTTP 422 (`422.version_mismatch` since it is an input-compatibility failure, not a not-found). On old-shape JSON missing `schemaVersion` entirely, surfaces `422.invalid` (Phase 02).
- 08-PERS-11 Back-up retention: last 5 versions per slug kept under `site/block-descriptors/_archive/{slug}.{n-5..n-1}.json` on each successful save (rolling window, oldest evicted; archive range is exclusive of the live `n`, so 7 successive saves produce exactly 5 archive copies plus the live `{slug}.latest.json`).
- 08-PERS-12 Failure recovery: if `fs.rename` fails after temp-write, restore from `{slug}.{n}.json` byte buffer held in memory; verify rollback matches the last-known-good snapshot before returning 5xx.

### Tests (08-TEST)
- 08-TEST-01 Atomic rename: two concurrent `POST /api/admin/svg-editor` requests with same slug — first wins, second returns 409 within 30 s timeout; no half-written file is exposed.
- 08-TEST-02 Loader snapshot: read while write in progress returns the previous fully-committed `{slug}.latest.json`; never returns the temp `{slug}.{n+1}.json`.
- 08-TEST-03 Schema migration: old-shape JSON without `schemaVersion` rejected with explicit `versionMismatch` message; new-shape accepted; forward-compat refuses newer `schemaVersion`.
- 08-TEST-04 R2 idempotency: identical descriptor yields identical CDN URL across save burst (content-hash key); content change key flips once and only once.
- 08-TEST-05 Recovery: simulate power loss between temp-write and `fs.rename`; after restart, `site/block-descriptors/{slug}.latest.json` still equals the last-good `{slug}.{n}.json`; no orphan temp files remain at exit.
- 08-TEST-06 Archive retention: 7 successive saves on one slug leave exactly 5 archive copies under `_archive/{slug}.{n-5..n-1}.json` (range exclusive of live `n`, per section 08-PERS-11); oldest evicted deterministically; live `{slug}.latest.json` is not part of the archive set.

## Exit gate
- Atomic rename test (08-TEST-01) green; no half-written file discovered in `site/block-descriptors/` during chaos test.
- Loader snapshot test (08-TEST-02) green; mid-write reads return prior version.
- Schema migration test (08-TEST-03) green; forward- and backward-incompat both surface explicit codes.
- R2 round-trip (08-TEST-04) green; second save burst returns identical URL.
- Recovery drill (08-TEST-05) green; eviction test (08-TEST-06) green.
- Dual-read evidence file present in `results/planner/phase-08/dual-read/` even when Supabase is `Deferred/blocked` — evidence gate is file presence, not Supabase promotion.
- Status flow: `Planned → Implemented` after all six 08-PERS + 08-TEST lines green; `Verified in staging` after `/api/admin/svg-editor` saves via the new writer for one full fixture cycle; `Promoted` only after dual-read evidence is signed; `Accepted` after planner consumer (Phase 06) reads via the new loader path with zero `any` regressions.

## Phase governance
### Forbidden actions
- Do NOT bypass `withAuth(['admin'])` on `/api/admin/svg-editor` during migration; the writer route stays admin-only while the dual-read stage is active.
- Do NOT promote Supabase without dual-read evidence in `results/planner/phase-08/dual-read/`.
- Do NOT delete `_archive/{slug}.{n-5..n-1}.json` while the same slug has fewer than 5 previous versions retained; the archive range is exclusive of the live `n` (see section 08-PERS-11 / 08-TEST-06).
- Do NOT migrate migrations that remove the JSON-on-disk layer before production acceptance; the JSON layer is the fallback for staged Supabase failures.
- Do NOT relax the 30 s lock timeout to under 10 s; concurrent admin edits need a sane contention window.

### Phase entry checklist
- Phase 02 Zod schema + snapshot immutability stable.
- Phase 04 writer route `/api/admin/svg-editor` returns descriptor + CDN URL on save.
- `catalog_snapshot_upload_r2.ts` helper verified with a 1-byte file.
- `site/.gitignore` updated to include `/block-descriptors/` before any write.
- Pnpm workspace does not treat `site/block-descriptors/` as a script source.

### Rollback criteria
- Half-written descriptor file exposed to loader → abort promotion; restore from `_archive/`; re-run rename test before retry.
- Lock file orphan on crash (`{slug}.lock` present without active writer) → auto-cleanup on next process boot, but reported as `Open3dPersistenceError.lockStale` until cleaned.
- R2 round-trip drift on identical descriptor → freeze writes, do not regress to previous URL strategy, capture CDN error in `results/planner/phase-08/r2/`.
- Dual-read evidence file missing for a phase claimed `Verified in staging` → step back to `Implemented`.

### Risk register
- Risk: lock file leak on process crash between lock-acquire and release. Mitigation: try/catch wrapping the writer with `fs.rmSync` on throw path; boot-time sweep cleans orphans older than 60 s.
- Risk: `_archive/` directory grows unbounded across hundreds of slugs. Mitigation: per-slug retention only; periodic GC of slugs with no activity in 90 days (Phase 10 ops handoff).
- Risk: Supabase `schema_version` drift between JSON field and Postgres column type. Mitigation: both validated by the same Zod schema; Supabase migration includes a CHECK constraint mirroring the regex.
- Risk: `fs.rename` on Windows network shares degrades to copy-and-delete. Mitigation: detect non-atomic rename on `site/block-descriptors/_archive/` volume; fall back to write+rename in two calls with explicit gap window logged.

### Success metrics
- Atomic save round-trip p95 ≤ 220 ms (Zod + write + rename + R2 helper dispatch).
- Loader snapshot read p95 ≤ 30 ms cold, ≤ 5 ms warm on 100 descriptors.
- Lock-contention conflict rate ≤ 0.5% in steady state.
- R2 idempotent URL match rate 100% (no false cache-bust).

### Dependencies
- Phase 02 schema + error taxonomy.
- Phase 04 `/api/admin/svg-editor` writer route contract.
- `catalog_snapshot_upload_r2.ts` helper.
- Supabase project credentials (already provisioned per repo state; only the `block_descriptors` table migration is this phase's scope).

### Performance budgets
- Per-save wall clock ≤ 600 ms p95 end-to-end.
- `_archive/` directory size ≤ 5 × descriptor count × average descriptor bytes.
- Loader memory ceiling ≤ 32 MB at 100 cached descriptors.
- R2 upload concurrency capped at 2 in-flight per slug.

### Security considerations
- `{slug}.lock` is `O_EXCL` with restrictive umask; never readable by anonymous routes.
- Persistence layer never accepts a descriptor without Zod parse — defense-in-depth even though writer is admin-gated.
- Schema-version refusal blocks silent zero-day backward-incompat crashes from prod data leaking into dev.
- Archive directory inherits gitignore; historical versions never accidentally committed.

### Accessibility considerations
- Persistence layer has no UI surface; indirect accessibility impact only via Phase 06 consumer; no direct a11y gate in this phase.
- Error codes surfaced through HTTP bodies include field-path strings that downstream UI can announce via live region (Phase 06 owns wiring).

### Decision log
- 2026-07-04 — Decision: JSON-on-disk is v1; Supabase is staged behind feature flag. Reason: IMPLEMENTATION-DECISIONS migration policy forbids silent promotions and dual-read evidence is the gate. Alternatives: Supabase-only from day one — rejected because write-on-local-disk is faster than round-trip to Postgres during dev iteration. Owner: Persistence agent.
- 2026-07-04 — Decision: 30 s lock timeout. Reason: typical admin save round-trip ≤ 600 ms; 30 s absorbs slow R2 uploads and human re-attempts without flapping. Alternatives: 5 s strict — rejected as too tight for admin-grade edits; 120 s — rejected as inviting stale lock abuse. Owner: Persistence agent.
- 2026-07-04 — Decision: per-slug rolling 5-version retention. Reason: rollback window covers most admin edits without archive explosion. Alternatives: 20-version retention — rejected as overkill for hand edits; zero retention — rejected as unsafe. Owner: Persistence agent.
- 2026-07-04 — Decision: schema-version check refuses newer descriptors, not accepts them. Reason: forward-compat is unsafe without a code change; silent accept masks future drift. Alternatives: best-effort forward load — rejected. Owner: Persistence agent.
