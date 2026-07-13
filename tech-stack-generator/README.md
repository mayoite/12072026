# Tech-stack generator

This Vite app renders repository architecture and tooling data.

Generated data is written to `../tech-stack-generated/`.

The static build is written to `../tech-stack-docs/`.

Run commands from the repository root:

```powershell
pnpm run docs:sync:tech-stack
pnpm run docs:check:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:test:tech-stack
pnpm run docs:build:tech-stack
```

Generated output is not hand-edited or used as execution status.
