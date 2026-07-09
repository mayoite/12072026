# Trust-Data Expert Pass — Consolidated

**Date:** 2026-07-09  
**Research status:** DONE (maps only — no re-scrape)  
**Mode:** plan-only · no product code  
**Sources:** `reviews/expert-pass/01`–`06` · kill order [INDEX.md](../INDEX.md)

---

## Overall: **YES WITH FIXES**

Plans + kill order match live architecture. **Not SHIP** until must-fixes land at execute (and a few plan truths: furniture **degrees**, packages hygiene). **Not BLOCK** — no engine re-open; Approach A spine is sound.

**Execute-ready spine (Approach A week-1):** **YES**  
`CP-00 → CP-01 → CP-02 → CP-03 W3 (unit+browser) → CP-07 journey → CP-06 save` then parallel fill (orbit · symbols · mesh · shortcuts).

---

## Expert table

| Expert | File | Verdict | Top P0 |
|--------|------|---------|--------|
| React / open3d workspace | `01-react-open3d.md` | **FIX** | W3 pure delete + single history; orbit explicit; save flush; **furniture degrees** |
| Canvas 2D / Fabric | `02-canvas-2d.md` | **SHIP** | Prove W3/W2 with Fabric flag **OFF**; Block2D authority; centered-path lie |
| 3D / R3F | `03-r3f-3d.md` | **FIX** | Orbit three-layer; document pose; mesh toe→carcass→door; **stay imperative Three** |
| Playwright / evidence | `04-playwright-evidence.md` | **FIX** | W3 browser in `03-*`; serial journey; seed **deltas**; no silent skip |
| Packages / stack | `05-packages-stack.md` | **FIX** | Owner sign-off + `PACKAGE-PIN`; Fancyapps clear/remove; GSAP row |
| UI / shortcuts | `06-ui-shortcuts.md` | **FIX** | Handler = map (D/M/N/T); forbid Dimension→D rebind |

---

## Merged Must-fix (P0) — de-duped

1. **W3 select→delete→undo (spine #3):** `applySelectionDelete` (or pure helper) → **one** `updateProject`; Del/Bksp `preventDefault`; Esc clears selection; unit then browser under `03-select-delete/`. Unit alone = **FAIL**.
2. **Fabric furniture flag OFF** for W3/W2 proof; document selection only (`pickFurnitureAtPoint`) — no second selection store / Fabric-stage e2e as W3.
3. **W4 orbit three-layer:** defaults ON **and** workspace passes `enableControls={true}` **and** `data-orbit-enabled` + unit construct-spy. Defaults alone ≠ W4 green.
4. **Rotation lock:** furniture **document/nodes = degrees** (live). Do **not** convert to radians mid-spine. Mesh `-rotation.y` is intentional, not pose drift. (P04 “all radians” plan line is false for furniture.)
5. **Stay imperative Three** for open3d (`ThreeViewerInner` + OrbitControls) — **no** R3F `<Canvas>` rewrite mid-W4/W7.
6. **W5–W6 save honesty:** `createAutoSaver.flush` + projectRef; unmount/leave must not `cancel()` pending without flush; dual-surface labels local vs cloud (TopBar + status); Shell JSDoc not “server”.
7. **Serial journey pack (CP-07):** one ordered path `mode: "serial"` + 120s; walls/objects/furniture **Δ** (never seed absolute ≥1/≥4); place ≥2 incl. `cabinet-v0`; non-blank PNG ≠ P05 quality.
8. **`getFurnitureCount`** helper + evidence only under canonical folders (`02-browser-open3d-journey/`, `03-select-delete/`, …). No silent skip / filtered logs.
9. **P05 symbols:** Block2D = canvas authority; `furnitureBlockUsesCenteredPath` always `false`; keep `canvas-fabric-stage/` (destination, not delete).
10. **P08 mesh bar:** default slab children `toe` → `carcass` → `door-slab` (+ pair doors); height integrity (toe replaces bottom of carcass); GlbExport **imports** shared constants (no duplicates).
11. **P09 shortcuts:** invert `CANVAS_TOOL_SHORTCUTS` once in keyboard handler (D=door, M=dimension, N/T bound); live keydown matrix tests; honest `aria-keyshortcuts`. Forbidden: rebind Dimension → D.
12. **P02 packages:** owner engine sign-off / `PACKAGE-PIN.md` under `01-engine-lock/`; clear or remove `@fancyapps/ui`; GSAP acceptance row in `17-LICENSES-CLEARED.md`; no competitor assets into `site/`.

---

## Should-fix (P1) — short

- Host path truth: features host → native → `OOPlannerWorkspace`; guest `?plannerDevTools=1` for clean IDB.  
- Restore-complete wait before W5 seed/flush; opening via objects Δ (label **Opening**).  
- Headless cabinet mesh PNG for CP-08; slightly darker toe.  
- Pin root `turbo` version; AI SDK keys `.env.local` only; no paid plugins without ask.  
- Rail/palette already map-sourced — regression only; hide-tools inventory proof-first.  
- Parallel fill only after CP-02; scarce slots → spine 3–5 before mesh/chrome.

---

## False-reverse risks (top 5)

1. **Furniture rotation → radians** for P04 wording — rewrites pick, pureActions, fixtures.  
2. **Fabric full-stage cutover / flag-ON for W3** — dual engines mid-gate; Approach A break.  
3. **Port open3d 3D to R3F mid-gate** — live path is imperative Three.  
4. **Unit-only W3 or guest seed walls ≥N as W1** — false-green; need browser in `03-*` + deltas.  
5. **Orbit green from default prop only / bare “Saved” as cloud / multi-history delete / Dimension→D** — silent lies buyers trust.

---

## What NOT to reverse (locked)

| Lock | Rule |
|------|------|
| **Stack** | Feasibility interim 2D · Fabric v7 full stage **destination after W** · Three+R3F family · no Konva hybrid · MIT/open first |
| **Furniture rotation** | **Degrees** in document (+ pick converts for hit math) |
| **3D implementation** | **Imperative Three** + OrbitControls for open3d — not R3F rewrite mid-gate |
| **Kill order** | Spine W3 → journey → save before scarce-slot mesh/chrome polish |
| **Ethics** | No competitor assets; research stays under `D:\websites` |

---

## Phase callouts

Expert pass P0 callouts applied into **P02–P09** (short, top of each phase). Full essays remain in `reviews/expert-pass/`.

**Handover:** After unlock, execute spine with P0 discipline; do not re-scrape research; do not thrash locked stack.
