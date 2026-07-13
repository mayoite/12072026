# Packages & tech — inspiration only (Planner 5D research)

**Do not copy their code.** Evaluate open packages for *our* implementation.

## Strong candidates (browser floor plan + 3D)

| Need | Packages to evaluate |
|------|----------------------|
| 3D scene | `three`, `@types/three` |
| React 3D (if React) | `@react-three/fiber`, `@react-three/drei` |
| Model import | three loaders: GLTF, OBJ, FBX (where licensed) |
| 2D floor mesh | polygon triangulation (`earcut`), custom wall extrude |
| Realtime collab | `yjs` / `automerge` / Liveblocks-style presence |
| Jobs (renders) | queue + object storage (our infra) |
| Image formats | serve AVIF/WebP like their marketing CDN pattern |

## Hiring-signal stack (unconfirmed)

Firecrawl search found TypeScript + Three.js/WebGL interest for Planner5D-class roles. Use as **hint only**.

## Observed public infra patterns

- Separate marketing CDN: `static.planner5d.com`
- User media: `storage.planner5d.com`
- Asset version query: `?ux=2.1.1`
- SVG sprite icons: `/assets/sprite/*.svg#...`
- Editor route isolated: `/editor`
- 3D capability detection → browser upgrade message

## Monetization packaging (product, not npm)

- Free unlimited projects  
- Gate: catalog %, AI, render quality, CAD export, model import formats  
- Enterprise: white-label + configurator + cart/API
