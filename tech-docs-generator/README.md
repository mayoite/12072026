# Tech docs generator

This Vite app renders repository architecture and tooling data.

Generated data is written to `../generated-documents/data/`.

The static build is staged under `../.tmp/generated-documents/site/` until transactional publication.

Run commands from the repository root:

```powershell
pnpm run tech-docs:generate
pnpm run tech-docs:check
pnpm run tech-docs:typecheck
pnpm run tech-docs:test
pnpm run tech-docs:build
```

Generated output is not hand-edited or used as execution status.
