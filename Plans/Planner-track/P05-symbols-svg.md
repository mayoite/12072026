# P05 — W2 symbol quality + SVG path honesty

**Status:** OPEN / REPROVE — Block2D library raised; **live Fabric stage still draws plain Rects** (symbol port incomplete).

**Gate:** **W2 symbol half** / CP-05 — readable **cabinet-v0** on the **live** plan canvas; honest Block2D vs SVG-publish.  
**Evidence:** `results/planner/world-standard-wave/05-symbols-svg/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Cabinet-v0 readable on Fabric stage. Never claim `/svg-catalog/*.svg` as plan-draw path.  
**Upgrade rule:** Port Block2D (or Fabric multiprim equivalent) **onto** `Open3dFabricStage`. Do **not** restore Feasibility to show symbols.

**Place journey** = [P07](./P07-draw-place-journey.md). **Mesh** = [P08](./P08-mesh-quality.md).

**Out of scope:** Mesh redesign · Feasibility restore · SVGR · CDN SVG · confusing footprint helpers with Block2D.

**Depends:** P01 + P02 (Fabric-sole lock).

---

## Authority (honest)

```
Library: furnitureBlock2DFromItem → Block2D prims  (raised; unit-proven)
Live canvas TODAY: Open3dFabricStage → plain Rect furniture  (symbol gap)
Target: Fabric stage paints Block2D (or equivalent multiprim) — upgrade
Publish: compileSvgForPublish → public/svg-catalog/{slug}.svg  (not plan-draw)
```

Archive Feasibility still calls `renderBlock2DCentered` — **not** a product proof path.

---

## Live truth (re-verify 2026-07-11)

| Piece | Status |
|-------|--------|
| `furnitureBlockUsesCenteredPath` | Always **`false`** in library |
| `modularCabinetBlock` | Multiprim in library — not empty box |
| Units | `furnitureBlock2D.cabinet-v0.test.ts` exists |
| **Live Fabric paint** | Simple `Rect` — **below** library quality until ported |
| Evidence pack | Untrusted until re-run **and** live canvas shows multiprim |

---

## Touch list

| Path | Role |
|------|------|
| `…/catalog/furnitureBlock2D.ts` | Keep multiprim + centeredPath false |
| `canvas-fabric-stage/Open3dFabricStage.tsx` | **Raise** paint beyond plain Rect |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Paint helper (adapt or Fabric port) |
| Units | cabinet-v0 · stage paint regression when wired |
| Honesty | Block2D = plan; SVG = publish |

---

## Kill order (unchecked)

- [ ] Re-run cabinet-v0 vitest → `05-symbols-svg/`
- [ ] Port multiprim paint to Fabric stage (or prove equivalent)
- [ ] Visual on **live** canvas (not archive Feasibility)
- [ ] SVG honesty NOTES
- [ ] No competitor art · no Feasibility un-archive

**W2 symbol half red until** live Fabric shows readable cabinet-v0 (library-only PASS = incomplete).  
**Next:** [P06](./P06-save-honesty.md) / BOARD kill order.
