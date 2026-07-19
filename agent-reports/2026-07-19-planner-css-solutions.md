# Planner CSS / chrome fix-all — 2026-07-19

## Fixed
1. **Guest census blind spot** — guest chrome hides `N objects` / `N furniture`; helpers fall back to `__plannerLiveProject`.
2. **Chrome place path** — `clickCatalogAddToCanvas` + toast + `placeArmedCatalogOnCanvas`.
3. **Post-place selection race** — ignore Fabric `selection:cleared` during rebuild; brief grace after place so tool-swap pointerup cannot wipe selection.
4. **Stale Split assertion** — product is 2D/3D only; test updated.
5. **Inspector** — Fabric re-select after place; assert Properties shows Furniture.
6. **Dead CSS** — removed `pw-subtopbar*` / `pw-starting-point*` from `planner-shell.css`.

## Verified (fresh)
- `planner-chrome` **7/7** · `planner-catalog` **2/2** · `planner-phone-chrome` **2/2**
- `check:layout` PASS
