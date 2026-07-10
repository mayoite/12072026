# Homepage product images — network fails (before fix)

Source: chrome-devtools `list_network_requests` resourceTypes=image|media on http://localhost:3000/

## Failed / broken (400 from next/image optimizer)

| Status | URL path |
|--------|----------|
| 400 | `/images/catalog/oando-seating--fluid-x/image-01.webp` |
| 400 | `/images/products/meeting-table-10pax.webp` |
| 400 | `/images/products/softseating-solace-1.webp` |
| 400 | `/images/products/chair-cafeteria.webp` |

## OK (sample)

| Status | URL path |
|--------|----------|
| 200 | `/images/hero/dmrc-hero.webp` |
| 200 | `/images/catalog/oando-workstations--deskpro/image-1.jpg` |
| 200 | `/images/catalog/oando-storage--metal-storages/image-1.jpg` |
| 200 | `/images/projects/DMRC/hero.webp` |
| 200 | `/images/projects/Titan/hero.webp` |
| 200 | `/images/projects/TVS/hero.webp` |
| 200 | client logos (Titan, L&T, JSW, …) |

## After fix — collection images (all 200/304, naturalWidth > 0)

| Path | Result |
|------|--------|
| `/images/catalog/oando-seating--fluid-x/image-1.webp` | OK |
| `/images/catalog/oando-workstations--deskpro/image-1.jpg` | OK |
| `/images/catalog/oando-tables--curvivo-meet/image-1.jpg` | OK |
| `/images/catalog/oando-storage--metal-storages/image-1.jpg` | OK |
| `/images/catalog/oando-soft-seating--accent/image-1.jpg` | OK |
| `/images/catalog/oando-educational--academia/image-1.jpg` | OK |

No collection image 400s after reload.
