# Repair report — security / API

**Date:** 2026-07-17  
**Agent:** Repair security API blockers  
**Verdict:** **PASS** (focused unit + layout/typecheck pending in index)

## Fixed

1. **Plan IDOR** — update/delete scoped by `user_id`; foreign id → no overwrite (404).
2. **First-create upsert** — free client UUID → INSERT with explicit id.
3. **Guest GLB** — guest keys under `generated/guest/…`, `upsert: false`; members under `generated/u/{userId}/…`.
4. **Handoff idempotency** — lookup error → 502 (no insert); key includes `userId`.
5. **Cloud export MIME** — allowlist only (no `text/html`).

## Evidence

```text
vitest: 7 files, 79 tests PASS
  plannerPersistence, plans API, handoff, generated-glb, export/cloud, catalogAssetStorage
```

## Remaining risk

- Concurrent first-create same UUID → one PK fail (no takeover).
- Handoff key format change may not match old in-flight keys once.
- Full suite / browser handoff not re-run here.

## Files

`plannerPersistence.ts`, `plannerSaves.ts`, plans routes, `generated-glb`, `catalogAssetStorage`, handoff, export/cloud + matching tests.
