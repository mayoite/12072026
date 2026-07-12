# Domains — where code lives (HOW)

**Execute law:** [`plan/README.md`](../../plan/README.md). This file is placement + honesty only.  
**Upgrade lock:** Fabric sole 2D — [`QUALITY-BAR`](../../plan/QUALITY-BAR.md).

---

## Admin

| | |
|--|--|
| Routes | `site/app/admin/` |
| Views | `site/features/planner/admin/` (svg-editor, catalog) |
| Publish API | `site/app/api/admin/svg-editor/` |
| Compile | `site/features/planner/asset-engine/svg/` |
| Bytes | `site/public/svg-catalog/{slug}.svg` |

SVG catalog = **publish only** — not plan-draw. Execute: [Admin](../../plan/Admin/CHECKLIST.md). UI fence: [`03-MODULE-UI-CONTRACT.md`](03-MODULE-UI-CONTRACT.md).

---

## Site marketing

| | |
|--|--|
| Sections | `site/components/home/`, `products/`, `career/`, … |
| Chrome | `components/site/`, `ui/`, `shared/` |
| Routes | `site/app/(site)/` |

Planner chrome ≠ marketing. Execute: [Site P02](../../plan/Site/PHASE-02-site-chrome.md). Dep cuts: [Site P01](../../plan/Site/PHASE-01-deps-cleanup.md).

---

## CRM

| | |
|--|--|
| Routes | `site/app/crm/` |
| Feature | `site/features/crm/` |

No CRM plan track yet. Do not couple into open3d commands. Auth/CSRF with [Security](../../plan/Security/CHECKLIST.md).

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

No `DEV_AUTH_BYPASS` on public hosts — [Security P03](../../plan/Security/PHASE-03-auth-boundaries.md).

---

## Offline / PWA

| | |
|--|--|
| Route | `site/app/offline/` |
| UI | `site/components/pwa/` |
| Planner local save | [PHASE-06](../../plan/Planner/PHASE-06-onboarding-feedback.md) |

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
| Planner place | `project/catalog/` (live host) | P07 |
| SVG publish | `public/svg-catalog/` | A1/A2 — not plan-draw |
| Plan symbols | Block2D → Fabric stage | P05 |

Never claim catalog SVG is what Fabric draws today.
