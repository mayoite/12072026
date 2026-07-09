# A11y report — `/planner/open3d`

| Field | Value |
|--------|--------|
| **Status** | **DONE** (live capture; issues found — not a clean pass) |
| **Date** | 2026-07-09 |
| **URL** | http://localhost:3000/planner/open3d/ |
| **Title** | Open3D Planner \| One&Only \| One&Only |
| **Server** | Started via `pnpm run dev` (was down; Ready on :3000) |
| **Browser MCP** | chrome-devtools (Playwright Chromium 1228; no Google Chrome install) |
| **Route note** | `/planner/open3d` loaded successfully (guestMode); `/planner/guest` not required |

## Artifacts

| File | Description |
|------|-------------|
| `a11y-snapshot.txt` | Non-verbose a11y tree |
| `a11y-snapshot-verbose.txt` | Full a11y tree (573 lines) |
| `console-messages.txt` | Console summary |
| `viewport.png` | Viewport screenshot |

## Method

1. Probed `http://localhost:3000` → connection failed.
2. Started `pnpm run dev` → Next.js Ready on :3000.
3. chrome-devtools initially failed: no Chrome at stable channel paths.
4. Junctioned Playwright Chromium to `%LocalAppData%\Google\Chrome\Application` so MCP could launch.
5. `navigate_page` → `/planner/open3d/`
6. `take_snapshot` (verbose + compact), `list_console_messages` (preserved), network sample, screenshot.

---

## Landmarks (from a11y tree)

| Role / landmark | Accessible name | Notes |
|-----------------|-----------------|--------|
| link (skip) | Skip to main content | → `#main-content` |
| **main** (×3 nested) | (unnamed) / **Planner workspace** / (unnamed) | **Issue: nested/duplicate `main`** |
| sectionheader | Planner workspace | Top chrome |
| region | Inventory panel | Nested twice (outer + inner) |
| navigation | Inventory categories | Category accordion |
| region | Catalog browser | Product list |
| navigation | Canvas tools | Tool strip |
| region | Drawing canvas | Contains named Canvas |
| complementary | (unnamed) | Tool help live region (`live=polite`) |
| region | Properties panel | Right rail |
| sectionfooter | (unnamed) | Status strip (counts, tool, zoom, guest) |

### Landmark issues

1. **Three nested `main` roles** (`uid=1_6`, `uid=1_7` "Planner workspace", `uid=1_264`). Assistive tech expects a single primary `main`. Likely layout + workspace shell + canvas column each expose `role="main"` / `<main>`.
2. **Duplicate region name** “Inventory panel” appears as outer and inner region.
3. **No page-level `banner` / `contentinfo` landmarks** (top bar is `sectionheader`; footer is `sectionfooter` — OK if intentional, but not classic document landmarks).
4. **Heading hierarchy**: one `h1` (“Untitled plan”), then multiple `h3` (INVENTORY, PROPERTIES, No Selection) with **no `h2`** — minor structure gap.

---

## Controls — unlabeled buttons?

**No unnamed buttons found in the a11y tree.** All 55 `button` nodes have accessible names, including icon-only chrome:

- Panel chrome: “Undock panel”, “Minimize panel”, “Close panel” (name + description)
- Canvas tools: “Select (V)”, “Pan (H)”, “Room (R)”, “Wall (W)”, etc.
- Catalog: “Add … to canvas”, “Add to favorites”
- Top bar: “Maximize canvas”, “Save draft”, “Export JSON”, “Open preferences menu”, floor/unit menus

Decorative `image` children under named buttons are acceptable if the button name is authoritative.

### Naming nits (not unlabeled)

| Control | Issue |
|---------|--------|
| searchbox | Name doubled: **“Search catalog elements Search catalog elements”** — likely both visible label text and `aria-label`/`aria-labelledby` applied |
| “Add to favorites” | Same name on every product card; better as “Add {product} to favorites” for list context |
| LabelText + searchbox | DevTools issue: label not programmatically associated (see console) |

---

## Canvas a11y (positive)

```
Canvas "Floor plan drawing surface"
  description="Tool: wall. Snap: none. Walls: 4."
  keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
```

Plus polite live region for tool/snap/wall counts and complementary tool instructions. Strong baseline for 2D canvas.

---

## Console messages

| # | Level | Summary |
|---|--------|---------|
| 1 | **issue** | **No label associated with a form field** (count: 1) — Chromium a11y issue; nest input in label or use `for`/`id` |
| 2 | info | React DevTools promo (dev noise) |
| 3 | log | `[HMR] connected` (dev noise) |
| 4 | **error** | **React hydration mismatch** on workspace shell: server `data-viewport="desktop"` vs client `data-viewport="tablet"` (Playwright/MCP viewport ≈ tablet). Also shows bare `<input>` under `OOPlannerWorkspace` (likely unlabeled field in #1) |
| 5–9 | log | Fast Refresh rebuild noise (dev) |

### Console severity for product quality

- **Must track:** hydration mismatch (SSR/client viewport branching); unlabeled form field.
- **Ignore in prod gates:** HMR, Fast Refresh, React DevTools prompt, Next.js Dev Tools overlay buttons (“Open issues overlay”, “1 Issue”).

Hydration stack excerpt (from console):

```text
<div className="workspace_shell__…"
+  data-viewport="tablet"
-  data-viewport="desktop"
  ...
>
```

Root: viewport-dependent attribute during SSR vs client measure.

---

## Network (sanity)

Document `GET /planner/open3d/` → **200**. App chunks/CSS 200. Some catalog assets / API still pending at sample time (`proof-chair.svg`, csrf, theme, svg-blocks). Footer still showed “Loading catalog…” in tree — non-blocking for structure a11y.

---

## Findings summary

| ID | Severity | Finding |
|----|----------|---------|
| A1 | Medium | Nested/duplicate **`main`** (3) |
| A2 | Medium | **Form field without associated label** (DevTools issue + bare `<input>` in hydration tree) |
| A3 | Medium | **Hydration mismatch** on `data-viewport` (desktop vs tablet) |
| A4 | Low | Searchbox **duplicate accessible name** |
| A5 | Low | Heading skip **h1 → h3** (no h2) |
| A6 | Low | Nested **Inventory panel** regions; generic “Add to favorites” names |
| A7 | Pass note | **No unlabeled buttons** in snapshot |
| A8 | Pass note | Skip link, named canvas, tool nav, panels generally labeled |

**Overall:** Not an a11y clean pass. Structure and labeling for interactive chrome are largely good; landmark nesting, one unlabeled input, and hydration/viewport mismatch need work.

---

## Manual re-run (if MCP/browser unavailable)

1. From repo root: `pnpm run dev` → confirm http://localhost:3000
2. Open Chrome/Edge → http://localhost:3000/planner/open3d/ (or `/planner/guest/`)
3. DevTools → **Elements** → Accessibility pane / Accessibility Tree: note landmarks, button names
4. DevTools → **Console**: filter Errors / Issues (label + hydration)
5. Optional: axe DevTools or Lighthouse Accessibility on the same URL
6. Save tree/screenshot under `results/planner/a11y-open3d/`

Chrome-devtools MCP note: requires a Chrome-compatible binary. This run used Playwright Chromium via junction:

`%LocalAppData%\Google\Chrome\Application` → `ms-playwright\chromium-1228\chrome-win64`

---

## Next steps (out of scope for this report)

1. Collapse to **one** `main` landmark for planner workspace.
2. Associate catalog search label/`id` (and any hidden file/input under workspace).
3. Align SSR `data-viewport` with first client paint (or omit attribute until client).
4. Deduplicate search accessible name; product-specific favorite labels.

**No commit made.**
