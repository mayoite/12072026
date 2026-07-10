# Planner UI diagnosis (live guest, chrome-devtools)

**Date:** 2026-07-10  
**URL:** /planner/guest/  
**Screenshot:** ui-audit-guest.png  
**Product context:** premium office systems planner (Plans/Others/18-PRODUCT-CONTEXT.md)

## What works (do not thrash)
- Shell layout: inventory | canvas | properties is a real workspace
- Tool rail with shortcuts; 2D/3D toggle
- Local save honesty strings present
- Catalog + systems configurator exist as product spine

## Serious problems (observed)
1. **Catalog not premium:** text-only tiles, no product imagery, dimensions as m while UI unit is cm — looks prototype not O&O
2. **Inventory overload:** home-room chips (Living/Bedroom/Kitchen) + workstation configurator + full furniture taxonomy fight the office-systems story
3. **Proof noise in catalog:** "Missing Geom Fallback", "Proof chair" — buyer-facing fail
4. **Chrome density:** status duplicated (helper strip + footer: tool, zoom, save, live catalog)
5. **Default tool Wall** on empty plan is OK for draw, but first-run path is unclear (no empty-state CTA)
6. **Canvas tooltips/a11y noise** and multiple live regions — heavy, not polished
7. **Systems configurator always expanded** steals inventory height from catalog place flow

## Priority (quality, one slice at a time)
1. **P-UI-1 Catalog truth:** hide proof/fallback SKUs from guest; show image or solid Block2D thumb; unit consistency (cm)
2. **P-UI-2 Inventory IA for office:** default to Systems + office categories; demote residential room chips or hide for guest systems mode
3. **P-UI-3 Status chrome:** single status bar; kill duplicate helper/footer lines
4. **P-UI-4 Empty-state / first action:** one clear primary (Draw walls OR place workstation)
5. **P-UI-5 Properties empty state** polish (secondary)

Do not start a full CSS redesign or Fabric cutover as "UI fix."
