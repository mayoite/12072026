# Domains — where code lives (HOW)

**Execute law:** [`Plans/`](../../Plans/INDEX.md). This file is placement + honesty only.  
**Upgrade lock:** Fabric sole 2D — [`CONSTRAINTS`](../../Plans/Planner-track/CONSTRAINTS.md).

---

## Admin

| | |
|--|--|
| Routes | `site/app/admin/` |
| Views | `site/features/planner/admin/` (svg-editor, catalog) |
| Publish API | `site/app/api/admin/svg-editor/` |
| Compile | `site/features/planner/asset-engine/svg/` |
| Bytes | `site/public/svg-catalog/{slug}.svg` |

SVG catalog = **publish only** — not plan-draw. A1–A3 are the publish foundation; A4–A8 define visual authoring and product operations. Execute: [Admin-track](../../Plans/Admin-track/BOARD.md). UI fence: [`03-MODULE-UI-CONTRACT.md`](03-MODULE-UI-CONTRACT.md).

---

## Site marketing

| | |
|--|--|
| Sections | `site/components/home/`, `products/`, `career/`, … |
| Chrome | `components/site/`, `ui/`, `shared/` |
| Routes | `site/app/(site)/` |

Planner chrome ≠ marketing (P09 vs S2). Execute: [S2](../../Plans/Site-track/S2-site-chrome.md). Dep cuts: [S1](../../Plans/Site-track/S1-deps-cleanup.md).

---

## CRM

| | |
|--|--|
| Routes | `site/app/crm/` |
| Feature | `site/features/crm/` |

No CRM Plans track yet. Do not couple into open3d commands. Auth/CSRF with [Security](../../Plans/Security-track/BOARD.md).

---

## Ops

| | |
|--|--|
| Routes | `site/app/ops/` |
| Feature | `site/features/ops/` |
| Deploy | root `OPERATIONS_RUNBOOK.md` |

Not planner, not admin SVG. Prod bypass = A3 + SEC3.

---

## Auth

| | |
|--|--|
| Feature | `site/features/shared/auth/` |
| Clients | `site/platform/supabase/` · `platform/drizzle/` |
| RLS | [`../database/ADVISORS.md`](../database/ADVISORS.md) |

No `DEV_AUTH_BYPASS` on public hosts — [A3](../../Plans/Admin-track/A3-production-auth.md) · SEC3.

---

## Offline / PWA

| | |
|--|--|
| Route | `site/app/offline/` |
| UI | `site/components/pwa/` |
| Planner local save | [P06](../../Plans/Planner-track/P06-save-honesty.md) |

Offline shell ≠ cloud sync. Prove scope under `results/` before claiming.

---

## AI / assistant

| | |
|--|--|
| Shared | `site/features/ai/` |
| Site bot | `site/features/site-assistant/` |

Not document authority. Mutations → planner commands only. Secrets in `.env.local`.

---

## Catalog (three authorities)

| Kind | Path | Law |
|------|------|-----|
| Site products | `features/catalog/` · shared catalog | Site content |
| Planner place | `open3d/catalog/` | P07 |
| SVG publish | `public/svg-catalog/` | A1/A2 — not plan-draw |
| Plan symbols | Block2D → Fabric stage | P05 |

Never claim catalog SVG is what Fabric draws today.
