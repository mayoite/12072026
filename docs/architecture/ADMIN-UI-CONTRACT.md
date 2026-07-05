# Admin UI contract (proposed)

**Status:** Proposed — enforce in **UI-2** (1B)  
**Authority:** `plann/REVISION-2026-07-05.md` → `plann/UI-PLAN-REVISED-2026-07-05.md` → [`MODULE-UI-CONTRACT.md`](MODULE-UI-CONTRACT.md) → **this file** → `admin-pages.css`  
**Index:** [`README.md`](README.md) · [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md)  
**Placement:** [`MODULE-LAYOUT.md`](MODULE-LAYOUT.md) — routes in `app/admin/`, views in `features/planner/admin/`  
**Locked baseline:** [`docs/Lockedfiles/architecture/current.md`](../Lockedfiles/architecture/current.md) · [`proposed.md`](../Lockedfiles/architecture/proposed.md)

---

## Scope

All routes under:

- `site/app/admin/**`
- `site/features/planner/admin/**`

**Phase 1B in scope:** `/admin/svg-editor`, `/portal/svg-catalog` (read path). CRM/list pages follow same shell rules.

---

## On disk today (honest)

| Area | Current | 1B target |
|------|---------|-----------|
| `/admin/svg-editor/[id]` | JSON editor + read-only field rows + **`<Render>` preview** in `page.tsx` | Full **`<Puck onPublish=…>`** mount |
| Publish | Save POST persists descriptor; pipeline via `svgPipelineRunner` (exec script) | Publish ≠ save; compile failure → 422; unified in-process compile |
| Puck registry | `puckBlockRegistry.tsx` ready for `<Puck>` / `<Render>` | Wire `onPublish` → API |

No SVG.js in Phase 1 production path (Option A).

---

## Page anatomy (required)

```tsx
<div className="admin-page">
  <header className="admin-page__header">
    <div>
      <p className="admin-page__eyebrow">Domain</p>
      <h1 className="admin-page__title">Title</h1>
      <p className="admin-page__copy">Lead copy.</p>
    </div>
    <div className="admin-page__actions">{/* optional */}</div>
  </header>
  {/* content */}
</div>
```

Reference: `app/admin/crm/clients/page.tsx`, `app/admin/themes/page.tsx`.

---

## Primitives (use before inventing classes)

| Primitive | Class | Use |
|-----------|-------|-----|
| Panel | `admin-panel`, `admin-panel__header` | Cards, tables wrapper |
| Button | `admin-btn`, `admin-btn--primary` / `--outline` / `--success` | Actions |
| Tabs | `admin-tabs`, `admin-tabs__tab`, `admin-tabs__tab--active` | Section switchers |
| Alert | `admin-alert`, `admin-alert--info` / `--warn` / `--error` | Callouts |
| Badge | `admin-badge`, `admin-badge--active` | Status chips |
| Toolbar | `admin-toolbar`, `admin-field` | Filters / forms |
| Table | `admin-table-wrap`, `admin-table` | Data grids |

Defined in `site/app/css/core/chrome/shell/admin-pages.css`.

---

## Semantic utilities (allowed)

`text-strong`, `text-muted`, `text-soft`, `bg-panel`, `bg-subtle`, `border-soft`, `text-primary` — from `app/css/core/utilities/`.

---

## Forbidden

- Raw Tailwind palette: `slate-*`, `blue-*`, `zinc-*`, `gray-*`, `emerald-*`
- Copying open3d CSS modules or planner tokens into admin TSX
- Importing `features/planner/open3d/**` into admin views
- Inline hex / `style={{ color: '#...' }}` for chrome (allowlisted product previews only)

Enforced by `pnpm run lint:ui` / `lint:ui:strict`.

---

## Icons

**Lucide** (`lucide-react`) for admin chrome. Do not use Phosphor in admin (planner exclusive per `REVISION-2026-07-05.md` Decision 3).

---

## SVG editor (`/admin/svg-editor`) — 1B proposed

**Authority:** Option A — no SVG.js in production path.

| Area | Policy |
|------|--------|
| Editor mount | Full `<Puck>` on `[id]` — **not `<Render>` only** |
| Layout | Split: fields / preview; resizable when UI-2 ships |
| Publish | `onPublish` → API; compile failure blocks publish (422) |
| Save | Publish ≠ save; draft may persist without publish |
| Compile | Unify `svgCompiler.server.ts` — retire exec-only path as sole authority |
| Styles | Puck override CSS in admin bundle; match `admin-panel` chrome |
| Ark UI | Headless only for field widgets if native + CSS insufficient |

Data flow: see [`DATA_FLOW.md`](DATA_FLOW.md) §6.

---

## Bundle

Admin layout must set `data-admin-layout` and load `admin-pages.css` via site admin shell — no per-page palette imports.

---

## Checklist (new admin route)

- [ ] Route in `app/admin/`; view in `features/planner/admin/` or `features/crm/`
- [ ] `admin-page` shell
- [ ] Primitives from table above
- [ ] `lint:ui` pass
- [ ] Lucide icons only
- [ ] No open3d imports

---

## Expert review

**Optional at UI-2** when Puck mounts — UX for publish vs save, field density, preview split. Not required for CRM/list pages.

---

## References

- [`CSS-SOLUTION.md`](CSS-SOLUTION.md) — admin bundle ownership
- [`DATA_FLOW.md`](DATA_FLOW.md) §6 — SVG publish sequence
- `plann/TEST-PLAN-REVISED-2026-07-05.md` — TEST-2 admin gates
