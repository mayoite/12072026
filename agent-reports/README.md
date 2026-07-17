# Agent reports — one blockers file per module

| Module | File | Primary blocker |
|--------|------|-----------------|
| **Planner** | [PLANNER.md](./PLANNER.md) | Browser commercial-loop acceptance |
| **Admin** | [ADMIN.md](./ADMIN.md) | DB-SVG cutover (disk still live) |
| **Site** | [SITE.md](./SITE.md) | Production SEO re-probe |
| **Tech stack** | [TECH-STACK.md](./TECH-STACK.md) | Full typecheck/lint/test/release:gate not green |

No dated slice dumps. Update these four in place only.  
Repo active cutover detail: `../Failures.md`.

## Active: Site full acceptance (10 agents)

S1 SEO · S2 routes · S3 viewports · S4 a11y · S5 contact · S6 Planner entry · S7 catalog · S8 i18n · S9 analytics · S10 unit gates.  
All write into **SITE.md** only. Parent does not cancel without owner ask.
