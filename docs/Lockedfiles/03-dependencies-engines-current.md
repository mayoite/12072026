# Dependencies and engines

Live package files and `pnpm-lock.yaml` are authoritative.

This file records architectural limits.

## Engines

- Fabric is the sole interactive 2D canvas engine.
- Three.js is the 3D engine.
- React Three Fiber and Drei are Three.js bindings and helpers.
- SVG.js is used by the Admin SVG authoring surface.
- Server SVG compilation and sanitization remain the publish authority.
- Do not add a second general canvas engine.

## Toolchain

- Use the Node version declared by root `package.json`.
- Use the pnpm version declared by root `package.json`.
- Install only from the repository root.
- Do not maintain nested lockfiles.

## Package decisions

- Verify a package is used before removing it.
- Verify its license before adding it.
- Prefer existing platform libraries when they meet the need.
- Record paid or restricted asset approval before use.
- Do not copy competitor code, assets, models, or trade dress.

## Persistence

- Drizzle and `postgres` are the catalog and SVG database boundary.
- Do not add a new Supabase `.from()` catalog or Planner path.
- The installed AWS S3 client covers immutable R2 artifact storage.
- The server API is the browser boundary.
- No new package is approved for this work.
- This is a target constraint. The SVG database adapter is not live.

## Catalog assets

- Published SVG must be owned, licensed, or created for Oando.
- Provenance belongs beside durable asset metadata.
- External benchmark images are reference only.
