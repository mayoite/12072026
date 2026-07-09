# A11y — Open3D planner (`/planner/open3d`)

**Source evidence:** [`results/planner/a11y-open3d/REPORT.md`](../results/planner/a11y-open3d/REPORT.md)  
**Date of live capture:** 2026-07-09  
**URL:** http://localhost:3000/planner/open3d/  
**Status:** **Not a clean pass** — structure/chrome mostly good; landmark nesting, one unlabeled field, and viewport hydration need fixes.

Artifacts under `results/planner/a11y-open3d/`:

| File | Meaning |
|------|---------|
| `REPORT.md` | Full findings + method |
| `a11y-snapshot.txt` | Compact a11y tree |
| `a11y-snapshot-verbose.txt` | Full tree (~573 lines) |
| `console-messages.txt` | Console / DevTools issues |
| `viewport.png` | Screenshot |

---

## Verdict

| Area | Result |
|------|--------|
| Interactive chrome (buttons) | **Pass** — 55 buttons, all named (incl. icon-only) |
| Skip link | **Pass** — “Skip to main content” → `#main-content` |
| Canvas | **Pass** — named surface, description, keyshortcuts, polite live region |
| Landmarks / structure | **Fail / issues** — nested `main`, heading skip, nested regions |
| Forms | **Issue** — unlabeled field + doubled search name |
| Hydration / SSR | **Issue** — `data-viewport` desktop vs tablet mismatch |

---

## Findings (severity + what to fix)

| ID | Severity | Finding | What to fix |
|----|----------|---------|-------------|
| **A1** | **Medium** | **Three nested `main` landmarks** (layout + workspace shell + canvas column). Assistive tech expects a single primary `main`. | Collapse planner workspace to **one** `<main>` / `role="main"`. Outer layout shells should be `div` or other landmarks, not nested mains. |
| **A2** | **Medium** | **Form field without associated label** (Chromium a11y issue + bare `<input>` under `OOPlannerWorkspace` in hydration tree). | Nest the input in a `<label>`, or wire `htmlFor` / `id`. Confirm which field (catalog search or hidden workspace input). |
| **A3** | **Medium** | **React hydration mismatch** on workspace shell: SSR `data-viewport="desktop"` vs client `data-viewport="tablet"` (viewport-dependent attribute during SSR vs client measure). | Align SSR with first client paint: omit `data-viewport` until client measure, use a stable default that matches CSS, or suppress the attribute on SSR so server HTML matches first client render. |
| **A4** | **Low** | Searchbox accessible name doubled: **“Search catalog elements Search catalog elements”** (visible label + `aria-label` / `aria-labelledby` both applied). | Keep one source of name only — either visible label association **or** `aria-label`, not both with the same string. |
| **A5** | **Low** | Heading hierarchy skip: one `h1` (“Untitled plan”), then multiple **`h3`** with **no `h2`**. | Insert proper `h2` section titles (e.g. Inventory, Properties) or demote panel titles to `h2` so order is h1 → h2 → h3. |
| **A6** | **Low** | Nested **“Inventory panel”** regions (outer + inner same name); generic **“Add to favorites”** on every product card. | One region name for inventory; favorite buttons should be **“Add {product} to favorites”** for list context. |
| **A7** | Pass note | No unlabeled buttons in snapshot. | Keep naming pattern for new icon buttons. |
| **A8** | Pass note | Skip link, named canvas, tool nav, panels generally labeled. | Preserve canvas `aria-label` / description / live region when tools change. |

### Severity guide (this doc)

- **Medium** — Blocks clean a11y sign-off; fix before claiming open3d a11y done (maps to P0.3 in [`00-PENDING.md`](./00-PENDING.md)).
- **Low** — Improve quality; does not block sequential hard-path work if honesty remains.
- **Pass note** — Strengths; do not regress.

---

## What is already good (do not regress)

1. **Skip link** present and targets main content.
2. **All toolbar / chrome buttons named**, including undock/minimize/close and canvas tools with shortcuts in the name (e.g. “Wall (W)”).
3. **Canvas a11y baseline is strong:**
   - Name: “Floor plan drawing surface”
   - Description includes tool / snap / wall counts
   - `keyshortcuts` documented
   - Polite live region + complementary tool help
4. Decorative images under named buttons are fine when the button name is authoritative.

---

## Landmarks snapshot (from live tree)

| Role | Accessible name | Notes |
|------|-----------------|--------|
| link (skip) | Skip to main content | OK |
| **main** ×3 | (unnamed) / Planner workspace / (unnamed) | **A1** |
| sectionheader | Planner workspace | Top chrome |
| region | Inventory panel | Nested twice — **A6** |
| navigation | Inventory categories | OK |
| region | Catalog browser | OK |
| navigation | Canvas tools | OK |
| region | Drawing canvas | Contains named Canvas |
| complementary | (unnamed) | Tool help, live=polite |
| region | Properties panel | Right rail |
| sectionfooter | (unnamed) | Status strip |

No classic document `banner` / `contentinfo` — OK if intentional (sectionheader / sectionfooter used instead).

---

## Console (product-relevant only)

| Level | Item | Action |
|-------|------|--------|
| issue | No label associated with a form field | Fix **A2** |
| error | Hydration mismatch `data-viewport` desktop vs tablet | Fix **A3** |
| ignore for prod gates | HMR, Fast Refresh, React DevTools promo, Next.js issues overlay | Dev noise |

---

## Fix order (recommended)

1. **A1** — Single `main` (landmark correctness; high impact for AT).
2. **A2** — Label association on the orphan form field.
3. **A3** — Viewport attribute SSR/client alignment (stops hydration error and related noise).
4. **A4–A6** — Search name, headings, inventory region / favorite labels.

**Done when (matches P0.3):** single main landmark on `/planner/open3d`; no hydration mismatch on `data-viewport`; form field has a programmatic label. Re-capture under `results/planner/a11y-open3d/` after fixes.

---

## Manual re-run (if browser MCP unavailable)

1. `pnpm run dev` from site → http://localhost:3000/planner/open3d/
2. DevTools → Accessibility tree: landmarks + button names
3. Console → Errors / Issues (label + hydration)
4. Optional: axe or Lighthouse Accessibility
5. Save artifacts under `results/planner/a11y-open3d/`

**No commit made for this doc pack.**
