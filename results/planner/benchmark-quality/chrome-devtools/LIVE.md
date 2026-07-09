# LIVE — Open3d guest console + network (Chrome DevTools)

**Date:** 2026-07-09  
**Method:** Live only — Chrome DevTools MCP (`chrome-devtools-*` / CDP)  
**Checkout:** `D:\OandO07072026`  
**URL:** `http://localhost:3000/planner/guest/`  
**Context:** isolated browser context `benchmark-console-capture`  
**Scope:** Open open3d guest → Place 4 seats → switch **3D** → capture Network 404s + console errors.  
**Evidence dir:** `results/planner/benchmark-quality/chrome-devtools/`

---

## Verdict

| Check | Result |
|-------|--------|
| Guest open + place seats | **PASS** (4→8 seats / 4→8 furniture on final pass; status `Placed 4×…` on earlier pass) |
| 3D mode | **PASS** (`button[role=radio]` 3D `aria-checked=true`; status `· 3D`) |
| Network 404s | **0** on this capture |
| Console errors | **0** |
| Residual product warnings | **YES** — THREE.Color CSS var (below) |

**Overall: PASS for journey + capture.** Residual warn list is non-empty (not zero-console).

---

## Journey facts (final capture)

| Fact | Value |
|------|--------|
| Dev server | HTTP 200 `localhost:3000/planner/guest/` |
| Place control | button **Place 4 seats** (systems configurator; Linear / 900×600 / Pedestal+Panel) |
| Mode | **3D** checked |
| Objects / walls / furniture / seats | **12 / 4 / 8 / 8** |
| Catalog | Live catalog; draft saved locally |
| Canvas count | 1 |

---

## BEFORE (prior evidence)

Sources: `results/planner/elon-standard/chrome-devtools/LIVE.md`, `results/planner/benchmark-quality/console-capture.json`.

| Kind | Detail |
|------|--------|
| ERROR (network 404) | `GET /proof-chair.svg` → **404** |
| ERROR (network 404) | `GET /placeholder-cabinet.svg` → **404** (related placeholders in older noise) |
| Console error | `Failed to load resource: the server responded with a status of 404 (Not Found)` |
| WARN | Next.js `layout.css` preload unused; optional WebGL/THREE noise |

---

## AFTER (this capture)

### Console (CDP `list_console_messages`, preserved)

| Level | Message | Residual? |
|-------|---------|-----------|
| info | React DevTools download tip | no (dev) |
| log | `[HMR] connected` | no (dev) |
| **warn ×4** | **`THREE.Color: Unknown color model var(--text-inverse-body)`** | **YES** |
| error | *(none)* | — |

### Network (CDP `list_network_requests`)

| Kind | Count / detail |
|------|----------------|
| **404** | **0** |
| Failed | **0** |
| Catalog thumbs | `/proof-chair.svg`, `/placeholder-*.svg` → **304** (exists; was 404 before) |
| Catalog API | `GET /api/planner/catalog/svg-blocks` → **308** then `/` → **200** |
| 3D chunk | `three-viewer.js` → **304/200** |

### Before → after delta

| Item | Before | After |
|------|--------|-------|
| `proof-chair.svg` 404 | yes | **cleared** (304/200) |
| `placeholder-cabinet.svg` 404 | yes | **cleared** (304/200) |
| Console 404 resource errors | yes | **cleared** |
| `THREE.Color: var(--text-inverse-body)` | not emphasized in older LIVE | **residual warn ×4** |

**Fixes landed by this agent:** none (capture-only). SVG 404s already green on live tree (likely parallel asset work).

---

## Residual errors / warnings (return list)

1. **WARN (product)** — `THREE.Color: Unknown color model var(--text-inverse-body)` (×4 on 3D path). THREE is receiving a CSS custom property string instead of a resolved color; likely a material/color prop wired to a design-token var without `getComputedStyle` resolution.
2. **Dev-only noise (ignore for product bar)** — React DevTools info; `[HMR] connected`.
3. **Non-error network** — `308` trailing-slash redirect on `/api/planner/catalog/svg-blocks` (not a 404; optional cleanup).

**Network 404 residual: none.**  
**Console error residual: none.**

---

## Evidence files

```
results/planner/benchmark-quality/chrome-devtools/
  01-guest-loaded.png
  02-after-place-4-2d.png
  03-3d-after-place.png
  04-final-3d-capture.png
  console-network-capture.json
  LIVE.md
```

Prior sibling (same parent folder): `console-capture.json` (earlier run with 1× 404-style console error).

---

## Next step (optional, out of this capture)

- Resolve `THREE.Color` + `var(--text-inverse-body)` in open3d 3D materials (pass hex/rgb, not CSS var name).
- Optional: make catalog API path always trailing-slash to drop 308.
