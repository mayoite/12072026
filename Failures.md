# Active Blockers and Failures

- DB-SVG cutover (authority). Live Admin publish uses **disk** (`inventory/descriptors/`, `public/svg-catalog/`). Products DB + R2 dual-write is injected only when R2 ListObjects succeeds; dead R2 keys no longer roll back disk publish. Full cutover still open: `DB-SVG-01` through `DB-SVG-16` (immutable revision bytes as release authority, product pointer, durable lifecycle). Next action: after a valid bucket-scoped R2 S3 pair is in place, prove one dual-write publish then complete the remaining DB-SVG contract items.
