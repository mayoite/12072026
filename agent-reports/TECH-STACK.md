# Tech stack — status

**Date:** 2026-07-17  
**Deploy stack healthy:** **PARTIAL**  
**Plans:** `plan/TechStack/COMPLETION-CONTRACT.md` · `docs/Lockedfiles/03-dependencies-engines-current.md`

## Runtime
| Item | Truth |
|------|--------|
| Package manager | pnpm@11 from repo root only |
| Node | ≥24 |
| Packages | `site` (Next), `tech-docs-generator` |
| 2D | Fabric only |
| 3D | Three + R3F + Drei |
| Admin SVG UI | Excalidraw embed |
| Site AI chain | **Gemini → OpenRouter primary → backup** (no OpenAI required) |
| Site i18n | next-intl; Planner/Admin English |

## Env (last recheck — names only)
| Area | Status |
|------|--------|
| Supabase public + service | SET |
| Admin Supabase (CRM handoff) | SET |
| Products + auth DB URLs | SET |
| OpenRouter + Gemini | SET |
| R2 access pair + bucket | SET |
| **RESEND_API_KEY** | **MISSING** (staff email off) |
| OPENAI_API_KEY | MISSING — OK if using OpenRouter/Gemini |
| DEV_AUTH_BYPASS | SET (local; not prod proof) |

## Gates
| Gate | Result |
|------|--------|
| layout / lint / typecheck | PASS (session re-verifies) |
| Full test / build / release:gate | OPEN |

## Open
1. Add `RESEND_API_KEY` if staff mail required  
2. Full suite + release:gate  
3. Typecheck stability without `.next` race  
4. DB-SVG cutover honesty (disk live)  

## Bar
Lockfile wins versions. Code wins engines. Exit 0 required for PASS.
