# plan — all tracks

**HEAD:** `7807198d` · **Home for planning.** One folder per track; each phase is an independent
file executable in parallel by its own agent.

## How this folder works
- **One folder per track**, each with a `README.md` (phase index) and a `CHECKLIST.md` (the
  single tickable "done" for that track).
- **Phases are independent files** (`PHASE-0N-*.md`). Each states its own `Blocks on:` — the only
  real dependency — so unrelated phases run in parallel, even within one track.
- **One root `FAILURES.md`** ([FAILURES.md](./FAILURES.md)) for the whole effort — real execution
  red only, not backlog.
- **Quality bar** ([QUALITY-BAR.md](./QUALITY-BAR.md)) — honesty rules, locked stack, proof model.
- **UI bar** ([UI-BAR.md](./UI-BAR.md)) — required on every buyer-facing phase close (UI, Planner, Buyer).
- **Hygiene gates** ([HYGIENE.md](./HYGIENE.md)) — owner product-truth, dead-path cleanup, toolbar reproof, frozen orphan slice.
- **Proof = a live run** (browser / bytes / headers). Two outputs from a run:
  **human report → `agents-work/reports/<track>-phase-<nn>.md`** (committed, this is what agents
  write up), and **raw auto-generated artifacts → `results/…`** (gitignored dump, never the
  authority).
- Each phase file is written in plain language first (so a non-expert can follow), then grounded
  in real file paths, with a Planner-5D-class benchmark where it applies.

## Execution order — what can run together, what is blocked
Phases are for parallel work. This is the only place that gates them. Everything not listed as
blocked starts **now**, in parallel, across and within tracks.

**Can start immediately (no blocker):**
Planner P02, P03, P05, P06, P08, P09, P10 · Admin P01, P05, **P07** · UI P01, P02 · Site P02 · SEO P01, P04 ·
Security P01, P02, P03, P06

**Blocked until another phase is green:**
| Phase | Blocked until | Why |
|-------|---------------|-----|
| Planner P01 (render SVG) | Admin P01 *contract* (use a fixture — don't wait for full Admin) | needs a real layered `.svg` to render; fixture unblocks it today |
| Planner P04 (snap/measure) | Planner P02 + UI P01 | snap toggle in P02; dimension tool (M) promoted in UI P01 — P04 inherits, does not re-promote |
| Planner P07 (workflow/a11y) | consumes P01–P06 | integration pass; runs continuously, never freezes them |
| Planner P11 (theme mount) | Planner P02 | toolbar map must stay authoritative |
| Planner P12 (handover) | P01–P11 + UI P01–P02 | layout gate, batch journey, foundation pack |
| Buyer P01 (configurator) | Planner P12 handover · UI P02 · Admin P04 | workstation family contract |
| Buyer P02 (layout at scale) | Buyer P01 | configurator IDs + poses |
| Buyer P03 (validation) | Buyer P02 | layout geometry |
| Buyer P04 (priced BOQ) | Buyer P01 · P03 · Admin P05 | price-book contract |
| Buyer P05 (share/quote) | Buyer P04 · Security P03 | priced export |
| Admin P02 (catalog lifecycle) | Admin P01 | needs a trustworthy publish path |
| Admin P03 (studio tools) | Admin P01 + **P07** | inspector/history only after scene publish authority proven on disk |
| Admin P04 (workstation family) | Admin P01 + P02 | family builds on catalog + authoring |
| Admin P06 (release/audit) | Admin P01 | governs the publish path |
| SEO P02 (metadata) | SEO P01 | need the real route set first |
| SEO P03 (canonicals) | SEO P01 | same |
| SEO P05 (JSON-LD) | SEO P02 + P03 | builds on metadata + canonicals |
| Security P04 (RLS) | DB env available | not a phase blocker — an environment one |
| Security P05 (SVG surface) | couples Admin P01 (same publish path) | do together, not sequentially |
| Site P01 (dep cut) | owner "execute" | a gate, not a phase dependency |

Contracts (below) mean Admin never *hard*-blocks Planner: Planner builds against a fixture of the
contract and integrates at the seam.

## Tracks
| Track | Phases | Focus |
|-------|--------|-------|
| [Planner](./Planner/) | 12 | SVG, toolbar, inspector, snap, docking, onboarding, a11y, select/delete, orbit, mesh, theme, handover |
| [Admin](./Admin/) | 7 | SVG.js authoring quality, catalog lifecycle, studio tools, workstation + pricing contracts, release governance, studio disk proof |
| [UI](./UI/) | 2 | M/T annotation tools live, public buyer entry |
| [Site](./Site/) | 2 | Dependency cleanup, marketing chrome parity |
| [SEO](./SEO/) | 5 | Sitemap↔routes, metadata, canonicals, robots, JSON-LD |
| [Security](./Security/) | 6 | Headers/CSP, CSRF, auth boundaries, RLS, SVG attack surface, dep/secret scan |
| [Buyer](./Buyer/) | 5 | Workstation configurator → layout → validation → BOQ → share/quote |

## Cross-track contracts (why tracks don't block each other)
Admin and Planner meet at **contracts**, not a dependency chain — each side builds against a
fixture and integrates at the seam:
| Contract | Produced by | Consumed by |
|----------|-------------|-------------|
| Symbol SVG (`public/svg-catalog/{slug}.svg` + descriptor) | Admin PHASE-01 | Planner PHASE-01 |
| Workstation family JSON | Admin P04 | Buyer P01 configurator |
| Price-book JSON | Admin P05 | Buyer P04 priced BOQ |

## Owner locks (apply across tracks)

| Area | Rule |
|------|------|
| Document | UUID v7 · millimetres · `lib/newEntityId` |
| 2D host | Fabric `planner-fabric-stage` only — renders SVG, never authors |
| 3D | Three + orbit |
| Routes | `/planner/guest` · `/planner/canvas` |
| Code roots | `editor` · `canvas` · `3d` · `project` · `ui` |
| Toolbar | React Aria Components + Phosphor |
| Themes | Semantic tokens · light/dark · saved preference |
| Catalog SVG | Admin authors in SVG.js; Planner **renders** published bytes; Block2D fallback only |
| Storage | Local until a cloud save succeeds |

No second canvas. No fake cloud, price, save, or share labels. No commit/push without owner
approval. `results/` ≠ proof; reports live in `agents-work/reports/`.

## Chrome / layout proof

Height chain and overflow → **Planner P05** checklist. Console errors, repeatable workspace
check, and chrome notes → **Planner P07** checklist. No separate UI phase.

## Buyer product sequence
| Step | Phase |
|------|-------|
| Project brief + room | [UI P02](./UI/PHASE-02-onboarding-entry.md) |
| Workstation configurator | [Buyer P01](./Buyer/PHASE-01-workstation-configurator.md) |
| Layout at scale | [Buyer P02](./Buyer/PHASE-02-layout-at-scale.md) |
| Validation + clearances | [Buyer P03](./Buyer/PHASE-03-validation-clearances.md) |
| Priced BOQ export | [Buyer P04](./Buyer/PHASE-04-priced-boq-export.md) |
| Share / review / quote | [Buyer P05](./Buyer/PHASE-05-share-review-quote.md) |

Buyer P01 opens only after **Planner P12 handover** is green.
