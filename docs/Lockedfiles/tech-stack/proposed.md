# Tech-stack — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/03-QUALITY-BAR.md`](../../../Plans/03-QUALITY-BAR.md) — regen when `PACKAGES.md` or major site deps change

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Generator | Separate package; documents production stack (not live app) | `site/tech-stack-generator/` | `Readme_Techstack.md` |
| Output | Do not hand-edit generated files; regenerate via commands | `Documents/tech-stack-docs/` | `Readme.md` |
| Commands | All regeneration documented in `START.md` | root `package.json` | `START.md` |
| CI | `tech-stack-docs.yml` green on main | `.github/workflows/` | gate policy |

## Packages (proposed per plan)

| Package | Policy |
|---------|--------|
| `vite`, `react` | Stay isolated in `tech-stack-generator/` |
| — | Document site pins by reference to `PACKAGES.md` — do not duplicate install in doc package |
| — | CI regen required on `PACKAGES.md` or major site dep changes |

No new runtime deps in tech-stack-generator without docs gate update.
