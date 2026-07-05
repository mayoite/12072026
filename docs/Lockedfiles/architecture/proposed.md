# Architecture docs — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`plann/REVISION-2026-07-05.md`](../../../plann/REVISION-2026-07-05.md) — update live docs after **1A** / **1B** evidence only

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Doc | Policy | Expert? |
|-----|--------|---------|
| **MODULE-LAYOUT.md** | Proposed module placement map — `open3d/` only for new pilot code | No — disk audit |
| **README.md** | Index + authority stack + expert matrix | No |
| **MODULE-UI-CONTRACT.md** | All new modules; locked copy in Lockedfiles | No |
| **CSS-SOLUTION.md** | Folder ownership; exit = lint:ui pass | No |
| **ADMIN-UI-CONTRACT.md** | Admin page anatomy + svg-editor 1B rules | Optional at UI-2 (Puck UX) |
| **SITE-MARKETING-UI-CONTRACT.md** | UI-3 only; header defers vs 1A/1B | Optional at UI-3 |
| **COMPONENT_ARCHITECTURE.md** | Current § + Proposed §; open3d pilot map | Optional post-1A |
| **DATA_FLOW.md** | §1–4 legacy; §5 open3d save; §6 SVG publish | **Yes for §6** at 1B sign-off |
| **DEPLOYMENT.md** | Update only on infra change | Yes (ops) when topology changes |

## Target structure

```text
docs/architecture/README.md          ← open first
  MODULE-LAYOUT.md                   ← where new modules go
  MODULE-UI-CONTRACT.md              ← any new UI module
  CSS-SOLUTION.md
  ADMIN-UI-CONTRACT.md               ← admin routes
  SITE-MARKETING-UI-CONTRACT.md      ← marketing (deferred)
  COMPONENT_ARCHITECTURE.md          ← code map
  DATA_FLOW.md                       ← runtime sequences
  DEPLOYMENT.md
```

## Enforcement linkage

| Architecture claim | Enforced by |
|--------------------|-------------|
| No palette drift | `lint:ui` → `lint:ui:strict` in `release:gate:fast` |
| Open3d commands | `plannerCommandWiring.test.ts` |
| SVG boundaries | `svgPackageBoundaries.test.ts` |
| Marketing dialect | `check:site-ui:*` (UI-3) |

## Authority

1. `plann/REVISION-2026-07-05.md`
2. `docs/Lockedfiles/architecture/proposed.md` (this file)
3. `docs/architecture/README.md`
4. Individual architecture docs

Update locked baseline only when intentionally freezing a new version after acceptance evidence.
