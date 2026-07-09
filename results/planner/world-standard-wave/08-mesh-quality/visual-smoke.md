# Visual smoke — cabinet-v0 (P08 / W7)

**Path:** headless (default) — `site/scripts/p08-cabinet-v0-visual-smoke.mjs`  
**Command:**

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality
```

**Options:** `defaultCabinetV0Options()` → 600×580×720 mm, `doorStyle: slab`, `material: white`.  
**Source:** locked plan formulas (`TOE_*`, `DOOR_THICKNESS_MM`) matching `generateCabinetV0Mesh` / `buildModularCabinetV0PartPlans`.  
**Not used:** designer static GLB, `site/public/**` product dumps, browser place (optional upgrade only).

## PNGs

| File | View | Intent |
|------|------|--------|
| `01-cabinet-v0-three-quarter.png` | three-quarter | toe / carcass / door-slab labeled and layered |
| `02-cabinet-v0-side.png` | side (Z×Y) | toe inset recess + door proud of carcass |

## Checklist vs NOTES pass criteria

| Criterion | Yes/No | Evidence |
|-----------|--------|----------|
| Named parts `toe`, `carcass`, `door-slab` | **yes** | Labels on both PNGs; `visual-smoke-meta.json` partNames |
| Locked order toe → carcass → door | **yes** | Meta + draw order |
| Readable base/toe band | **yes** | Darker toe fill `#9ca3af` under carcass |
| Readable carcass body | **yes** | Mid grey mass above toe |
| Readable door face | **yes** | Lighter slab labeled `door-slab` on front |
| Toe inset / depth (side) | **yes** | `02-…-side.png` shows recessed toe vs full carcass depth |
| Height integrity intent | **yes** | Toe 100 mm band, carcass = H−toe (not stacked full H) |
| No designer GLB | **yes** | Script draws plan boxes only |
| Photoreal | **no** | Residual: flat SVG projection, no handles |

## Pass/fail

**visualSmoke: pass** — multi-part silhouette is readable; not a single apology box.
