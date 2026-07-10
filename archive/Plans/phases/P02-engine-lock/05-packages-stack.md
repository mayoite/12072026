# Expert pass — Packages / stack / licenses

**Date:** 2026-07-09  
**Role:** packages / stack / license expert  
**Scope:** Plan + pin truth only. **No product code.** No competitor pack expansion (SmartDraw / Foyr / Coohom stay `Plans/trustdata/LATER.md`).  
**Inputs:** `Plans/trustdata/phases/P02-engine-lock/P02-engine-lock.md`, `site/package.json`, root `package.json`, `ayushdocs/17-LICENSES-CLEARED.md`, `AGENTS.md` license bullets, `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`.

---

## Verdict: **FIX**

Engine lock path is **sound and MIT-aligned** (Fabric v7 destination · Feasibility interim · Three+R3F · no Konva). Not **SHIP** until commercial-dep hygiene + owner engine sign-off + PACKAGE-PIN evidence exist. Not **BLOCK** for planning W1–W8 / Approach A.

---

## Must-fix P0

1. **Owner engine sign-off still open** — `ENGINE-DECISION.md` status PROPOSED; P02 Task 6 / `OWNER-SIGNOFF.md` not yet evidence. Do not claim CP-02 green or thrash packages until boxes land (or written deferral).
2. **Write `PACKAGE-PIN.md` under evidence root** — `results/planner/world-standard-wave/01-engine-lock/` (missing today). Pin exact strings from `site/package.json` (no upgrades in P02).
3. **Commercial / non-OSI deps not on cleared table**  
   - `@fancyapps/ui` — proprietary (“SEE LICENSE IN LICENSE.md”); **present in deps, no app import found** → either clear+license or remove from `site/package.json`.  
   - `gsap` / `@gsap/react` — Standard no-charge license (not MIT); **used** (`lib/hooks/useScrollAnimation.ts` + ScrollTrigger). Confirm owner acceptance + row in `17-LICENSES-CLEARED.md` (or replace with open scroll lib later).  
4. **No competitor assets in product** — keep research under `D:\websites` only; never ship competitor GLB/UI/WASM/fonts into `site/`. Archive research refs stay archive.

---

## Should-fix P1

1. **Do not re-open engines in P03+** — fail-forward only: Konva *full* after failed Fabric spike with `results/` proof; never hybrid.
2. **Root `turbo: "latest"`** — pin a real version; avoid silent major drift on gates.
3. **AI SDK cost surface** — `openai`, `@google/generative-ai` are open SDKs; **metered APIs** need keys only in `.env.local`; treat spend like paid SaaS (ask before new seats/providers).
4. **Exact Fabric pin is good** — keep `fabric: "7.4.0"` (no caret) until intentional cutover; Three/R3F/drei caret OK if lockfile freezes minors.
5. **Dead / dual-purpose deps** — `react-router-dom` lives for tech-stack-generator (workspace package), not Next app router; document so agents do not “migrate planner to RR.”
6. **model-viewer boundary** — `@google/model-viewer` Apache-2.0, admin single-asset only; not planner workspace 3D.

---

## Paid / trial risks

| Item | Risk | Rule |
|------|------|------|
| Helvetica Neue, Cisco Sans | Cleared fonts | Already in `17-LICENSES-CLEARED.md` |
| Firecrawl / Figma / Supabase / DO / SSR / agents | Cleared SaaS | Keys → `.env.local` only |
| Fancyapps UI | Proprietary, uncleared, likely unused | Trial/buy **or remove** — **ask before purchase** |
| GSAP Standard | Free-use proprietary; Club plugins paid | Clear in table; do not add paid plugins without ask |
| OpenAI / Google AI / OpenRouter usage | Variable $ | No new paid seat without owner |
| Vercel Analytics / Speed Insights | Hosted SaaS | Already stack-adjacent; watch plan limits |
| Competitor scrapes (P5D etc.) | Asset contamination | Patterns only; SmartDraw/Foyr/Coohom **LATER** |

**AGENTS hard:** Prefer MIT/Apache/BSD · paid OK with trial · **ask before purchase** · no competitor assets · secrets never committed.

---

## Path truth (live 2026-07-09)

| Claim | Truth |
|-------|--------|
| 2D destination | Fabric.js v7 full stage · flag path `site/features/planner/open3d/canvas-fabric-stage/` · default OFF |
| 2D live interim | `FeasibilityCanvas.tsx` (Canvas 2D API) |
| 3D | `three@^0.185.1`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7` · orbit ON default |
| Fabric pin | `fabric: "7.4.0"` **exact** in `site/package.json` · MIT |
| Konva | **Absent** from `site/package.json` (correct for hybrid ban) |
| Admin 3D | `@google/model-viewer@^4.3.1` · Apache-2.0 · not workspace engine |
| Workspace package root | `oando-workspace` · `pnpm@11.9.0` · packages: `site`, `site/tech-stack-generator` |
| Evidence root P02 | **`01-engine-lock/`** only (not `02-engine-lock/`) — folder not created yet |
| ENGINE-DECISION | Aligns with P02: Fabric 2D dest · Feasibility bridge · Three+R3F · no Unity · hybrid ban |
| Research non-goals | Photoreal race / multiplayer / LiDAR later — matches LATER + success metric BOQ > photoreal |

**Locked engine licenses (npm):** fabric MIT · three MIT · R3F MIT · drei MIT · model-viewer Apache-2.0 · zustand MIT.

---

## Disposition

- **Proceed** Approach A planning / P02 evidence collection **without** package upgrades or new engines.  
- **Before SHIP on packages:** clear or drop Fancyapps; GSAP row in cleared table; owner Fabric/Three checkboxes; `PACKAGE-PIN.md` + CP-02 pack under `01-engine-lock/`.  
- **Never** expand competitor asset ingest; LATER targets stay ideas-only.
