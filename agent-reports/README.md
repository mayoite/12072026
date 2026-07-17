# Agent reports — one file per track

| Track | File |
|-------|------|
| **Planner** | [PLANNER.md](./PLANNER.md) |
| **Admin** | [ADMIN.md](./ADMIN.md) |
| **Site** | [SITE.md](./SITE.md) |
| **Tech stack** | [TECH-STACK.md](./TECH-STACK.md) |

Update track files in place. Short slice reports: `YYYY-MM-DD-*.md`.

**Rule:** parent does **not** cancel agents without owner ask.

## Wave 2026-07-17 — 15 agents

| ID | Track | Scope | Slice |
|----|--------|--------|--------|
| P-W1 | Planner | Underlay calibrate + import residual (P5) | `2026-07-17-pw1-underlay.md` |
| P-W2 | Planner | Mobile shell / a11y nudge (P3/P14) | `2026-07-17-pw2-shell-a11y.md` |
| P-W3 | Planner | Sync conflict UI (P13) | `2026-07-17-pw3-conflict.md` |
| A-W1 | Admin | SVG publish isolation residual (A2) | `2026-07-17-aw1-svg-publish.md` |
| A-W2 | Admin | AF-06 phone catalog UX | `2026-07-17-aw2-phone-catalog.md` |
| A-W3 | Admin | AF-07 price book UX | `2026-07-17-aw3-price-book.md` |
| S-W1 | Site | SF-01 heading a11y | `2026-07-17-sw1-heading-a11y.md` |
| S-W2 | Site | SF-02 titles + host SEO honesty | `2026-07-17-sw2-titles-seo.md` |
| S-W3 | Site | Contact + consent residual (S3) | `2026-07-17-sw3-contact.md` |
| T-W1 | TechStack | CI pnpm pin → 11.13.0 (TF-02) | `2026-07-17-tw1-ci-pnpm.md` |
| T-W2 | TechStack | Typecheck race / TF-07 honesty | `2026-07-17-tw2-typecheck.md` |
| T-W3 | TechStack | T3 dep audit / dead-dep | `2026-07-17-tw3-deps.md` |
| X-W1 | Cross | CSRF mutation matrix sample | `2026-07-17-xw1-csrf.md` |
| X-W2 | Cross | Failures.md + DB-SVG honesty only | `2026-07-17-xw2-failures.md` |
| X-W3 | Cross | Gate commands real exits (layout/purity/health) | `2026-07-17-xw3-gates.md` |

Status: **RUNNING**.

## Owner rule (2026-07-17)

**When implementation is done, agents must TEST** — focused vitest (and layout if they touched plans/layout). Report command + exit 0/FAIL. No PASS claim without exits.
