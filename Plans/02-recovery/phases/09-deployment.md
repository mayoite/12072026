# 09 Deployment

Goal: prove local deployability.

## Modules

- Deployment.
- Build config.
- Release gate.

## Allowed Scope

1. Build config
2. Vercel config
3. Scripts needed for build correctness

## Hard No-Go Scope

1. Deploying.
2. Secret edits.
3. Ignoring lint or type errors.

## Initial Commands

```powershell
pnpm run lint
pnpm run typecheck
pnpm run build
```

## Release Gate

```powershell
pnpm run release:gate
```

Run release gate only after blockers are credible.

## Exit Evidence

1. Lint result.
2. Typecheck result.
3. Build result.
4. Release gate result, only if run.

## Stop Conditions

1. Lint still has broad failures.
2. Typecheck fails outside current scope.
3. Build depends on missing env.
