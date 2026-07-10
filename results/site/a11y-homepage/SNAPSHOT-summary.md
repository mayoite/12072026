# Homepage a11y tree — SNAPSHOT summary

**URL:** `http://localhost:3000/`  
**Source:** Chrome DevTools MCP `take_snapshot` + `evaluate_script` global checks  
**Partnership banner:** not present

## Document

| Field | Value |
|-------|--------|
| `lang` | `en-IN` |
| `title` | One&Only \| Premium Office Solutions \| One&Only |
| viewport | `width=device-width, initial-scale=1` |
| Skip link | “Skip to main content” → `#main-content` |

## Landmarks

| Role / tag | Notes |
|------------|--------|
| `banner` (`header`) | Site chrome |
| `navigation` “Primary navigation” | Desktop nav |
| `main` `#main-content` | Page body |
| `contentinfo` (`footer`) | Footer + locale + legal |
| `region` “Delivered for leading organizations” | Showcase carousel section |

No secondary `aside` / search landmark (search is in header form with labeled searchbox).

## Heading outline

```
h1  Spaces that work as hard as your team
h2  Browse workspace categories
  h3  Seating
  h3  Workstations
  h3  Tables
  h3  Storage
  h3  Soft Seating
  h3  Education
h2  Design your workspace
  h3  Oando Planner
h2  We engineer workspaces
  h3  Performance-graded
  h3  Enterprise durability
  h3  Sustainable build
  h3  Scales with you
h2  Delivered for leading organizations
  h3  DMRC
  h3  Titan
  h3  TVS
h2  Share your requirement
```

- Single **h1**
- No skipped levels (h1→h2→h3 only)
- TrustStrip metrics are text, not headings (OK)

## Key interactive names (sample)

| Area | Accessible name(s) |
|------|---------------------|
| Header | Products (button), Solutions…Login links, Search products with AI, View Quote Cart, Guided Planner |
| Hero | Explore Products, Request a quote, Trusted by…, Show project image 1–6 |
| Collections | Prev/Next slide, BROWSE FULL CATALOG, category cards |
| Tools | Oando Planner card → `/planner/`; floor demo → name includes caption + “open Oando Planner” |
| ContactTeaser | form “Project brief enquiry”; Name*, City*, Phone, Email, Brief*, Send Brief, WhatsApp, Call |
| Footer | locale combobox “SELECT LANGUAGE”, social YouTube/Facebook, nav columns, legal |

## Forms

| Field | Labelled | Notes |
|-------|----------|--------|
| Header search | yes | `aria-label` + `label[for]` |
| contact-teaser-name | yes | required |
| contact-teaser-city | yes | required |
| contact-teaser-phone | yes | |
| contact-teaser-email | yes | |
| contact-teaser-brief | yes | required; live char count |
| locale-switcher | yes | label “Select Language” |

**Orphaned inputs:** none.

## Images

- No `img` missing `alt` attribute
- Hero / categories / showcase use meaningful alts
- Decorative planner demo internals: `aria-hidden="true"` on chrome

## Keyboard tab order (first ~12 focusables, DOM order)

1. Skip to main content  
2. One&Only - home  
3. Products  
4. Solutions  
5. Projects  
6. Planner  
7. Portfolio  
8. Trusted  
9. About  
10. Sustainability  
11. Contact  
12. Portal  

Matches visual header order. Cookie dialog (when shown) is a polite modal and may take first focus until dismissed.

## Full raw tree

Pre-fix dump: `a11y-tree.txt`
