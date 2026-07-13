# Start

Run every command from the repository root.

Use pnpm only.

## First setup

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

Keep secrets in `.env.local`.

## Development

```powershell
pnpm run dev
pnpm run dev:tech-stack
```

Main routes:

- Website: `http://localhost:3000/`
- Guest Planner: `http://localhost:3000/planner/guest/`
- Admin: `http://localhost:3000/admin/`

## Focused checks

```powershell
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run check:layout
pnpm run check:failures
pnpm run check:plans-purity
pnpm run check:docs-purity
```

Run browser tests only for affected UI journeys or shipment claims.

## Tech-stack generator

```powershell
pnpm run docs:sync:tech-stack
pnpm run docs:check:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:test:tech-stack
pnpm run docs:build:tech-stack
```

Source: `tech-stack-generator/`.

Generated data: `tech-stack-generated/`.

Static build: `tech-stack-docs/`.

## Route inventory

```powershell
pnpm --filter oando-site run docs:sync:routes
```

## Release

```powershell
pnpm run release:gate
pnpm run vercel:preview
```

Production deployment requires the owner request.
