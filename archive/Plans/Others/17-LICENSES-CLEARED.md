# Licenses & paid (cleared list)

**Hard rules (no exceptions):** `AGENTS.md` → Packages, assets & licenses.  
**Secrets / API keys / license keys:** only in **`.env.local`** (repo root and/or `site/.env.local`). Never in this file, never in git, never in `D:\websites`.

## Hard rules (summary)

| Rule | |
|------|--|
| Open preferred, **not required** | MIT / Apache / BSD after check when they fit |
| Paid OK | When product needs it |
| **Buy flow** | Agent **names need** → **owner buys** → agent **uses**. **Always. No exceptions.** Agent never purchases/subscribes |
| Trial | Only if owner starts or authorizes a trial |
| **No plagiarism** | Ever. Easy ≠ allowed |
| Copy only if **explicitly authorized** | Only when the **product’s website/license** allows that use **for development** (or other stated terms). Research/Firecrawl ≠ copy rights |
| No unauthorized competitor/third-party assets | Code, UI, GLB, WASM, fonts, logos, brands, site content — not into `site/` without that authorization |

## Cleared paid (owner)

| Item | Kind | Since | Notes |
|------|------|-------|--------|
| Helvetica Neue | font | 2026-07-09 | Owner paid; in repo fonts |
| Cisco Sans (family in repo) | font | 2026-07-09 | Owner paid; in repo fonts |
| Firecrawl | SaaS | 2026-07-09 | Research; key in `.env.local` / user env |
| Figma / Supabase / DO / SSR / agents | SaaS | 2026-07-09 | Owner stack; keys in `.env.local` |

Add a row when owner buys something new. **Not on this list** → not cleared: trial or ask.

## To clear before CP-02 (expert pass 2026-07-09)

Trustdata packages expert (`Plans/trustdata/phases/P02-engine-lock/05-packages-stack.md`). **Not cleared yet** — resolve before claiming CP-02 / package SHIP. Prefer remove unused proprietary; **ask before any purchase**.

| Item | In tree | License posture | Action before CP-02 |
|------|---------|-----------------|---------------------|
| `@fancyapps/ui` | `site/package.json` dep; **no app import found** (2026-07-09) | Proprietary (“SEE LICENSE IN LICENSE.md”) | **Clear + license** (trial/buy with owner ask) **or remove** from deps |
| `gsap` / `@gsap/react` | **Used** (`site/lib/hooks/useScrollAnimation.ts` + ScrollTrigger) | GSAP Standard no-charge (not MIT); Club plugins paid | Owner acceptance row below when signed off; **do not add paid Club plugins without ask** |

| Item | Kind | Status | Since | Notes |
|------|------|--------|-------|--------|
| Fancyapps UI (`@fancyapps/ui`) | npm / proprietary | **PENDING clear or remove** | 2026-07-09 | Uncleared; likely unused — remove preferred if still unimported |
| GSAP (`gsap`, `@gsap/react`) | npm / Standard license | **PENDING owner acceptance** | 2026-07-09 | Free-use Standard OK only after owner row; no Club plugins without ask |

## Research home

Competitive scrapes: **`D:\websites` only** — `D:\websites\README.md`.  
Map: `Plans/trustdata/RESEARCH-MAP.md`.
