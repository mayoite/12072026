# Visual screenshots pack — 2026-07-09

**Why:** Owner standing rule — take a couple of PNGs when testing planner or site pages.  
**Server:** `http://localhost:3000` (next dev --turbopack)  
**Viewport:** 1440×900 headless Chromium via Playwright

## Captured

| File | Page | Notes |
|------|------|--------|
| `01-home.png` | `/` | Marketing home (hero + cookie bar) |
| `02-catalog.png` | `/catalog` | Catalog route OK |
| `04-planner-guest-setup.png` | `/planner/guest/` | Guest entry |
| `05-planner-workspace.png` | guest (post-attempt) | Same shell as setup if enter didn't advance |
| `06-planner-open3d.png` | `/planner/open3d/` | Open3d shell |
| `07-planner-open3d-canvas.png` | open3d 2D | Empty plan + “Set up the first room” |
| `08-planner-open3d-3d.png` | open3d 3D | Grey ground plane, inventory 18 items |

## Failed routes (no shot)

| URL | Status |
|-----|--------|
| `/products` | HTTP 500 (turbopack full build still fragile) |
| `/contact` | HTTP 500 |

## Systems v0 journey shots (prior)

Also see `07-systems-v0/`: place/select/delete PNGs from e2e.
