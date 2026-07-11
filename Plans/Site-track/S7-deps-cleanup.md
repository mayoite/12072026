# S7 — Dependency cleanup — Plan A (plan only)

**Status:** PLAN ONLY — **do not remove packages** until owner says `execute Plan A`.  
**Scope:** `site/package.json` dependencies.  
**Hard rule:** Plan first → owner OK → then one remove slice. No silent cuts.

---

## Plan A (what we would do)

**One cut only:** remove `@fancyapps/ui` if still unused at execute time.

| Check | Result (2026-07-11) |
|-------|---------------------|
| `from "@fancyapps/ui"` / require / CSS | **0 hits** in `site/` (only listed in package.json) |
| `swiper` | **KEEP** — used by `components/home/Collections.tsx` |
| embla | **KEEP** — Featured/Showcase carousels |

**Pass bar after execute (later):** `pnpm install` → `pnpm --filter oando-site typecheck` → no import errors.

**Not in Plan A:** relocating `react-router-dom` / `recharts` to tech-stack-generator (that is Plan B).

---

## Plan B (later — not now)

| Action | Packages |
|--------|----------|
| Move docs-only deps into `tech-stack-generator/package.json` | `react-router-dom`, `recharts` (if only used there) |
| Per-package grep before any further cuts | `@gsap/react`, `html2canvas`, `jspdf`, `dxf-writer`, `@google/model-viewer`, `@flatten-js/core`, `polygon-clipping` |

---

## Keep (never Plan A)

`next`, `react`, `fabric`, Three stack, Supabase, zustand, AI clients, sharp, puck, embla, swiper, lenis, vaul, sonner, makerjs, pdf-*, etc.

---

## Owner gate

- Now: **plan only** (this file).  
- To cut: reply **`execute Plan A`**.  
- Until then: leave `package.json` alone.
