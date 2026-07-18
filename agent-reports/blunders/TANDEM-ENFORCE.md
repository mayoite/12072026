# Tandem enforce (owner 2026-07-18)

**Parent + 6 agents. Craft + tests. Not theater.**

## Why tests / coverage were never written

Not because “the agent felt like it” as a joke — because **nobody enforced a hard gate**:

1. **PASS was redefined** as “dock mounts / unit green elsewhere / screenshot load” — not “new form behavior has name-mirror tests.”
2. **Agents were asked for reviews and plans** more often than “write the failing test then the CSS.”
3. **Parent (Grok) did not refuse soft delivery** when tests were missing.
4. **Vitest for form stubbed Dockview and sometimes Maker** — looked green without craft or multipath truth.
5. **No rule in the session loop:** *no UI merge without tests for that slice.*

That is a **discipline failure**, not a mystery.

## Hard rules (listen or FAIL)

| Rule | Exact |
|------|--------|
| CSS chrome | `site/app/css/core/locked/chrome/` only |
| CSS SVG paint | `site/app/css/core/locked/svg/` only |
| **Banned** | New chrome styles in `features/**`, co-located module next to form, thrash `theme.css` |
| **No hardcode** | No new hex/rgb in product UI CSS — tokens `var(--*)` only |
| Graph paper | Freehand stage only. Form stage **solid** — fix in shell if cascade wins |
| Tests | Name-mirror under `site/tests/unit/...` for every behavior you ship |
| Coverage | New/changed form paths must be covered; no “agent felt like skip” |
| Scope | Parametric factory UI + publish identity tests only this tandem |

## Roles

| ID | Role |
|----|------|
| **B** | Brainstormer — structure/copy only, no code |
| **C** | Extreme critic — FAIL anything soft |
| **U** | UI expert — form structure + visual craft (TSX + locked/chrome + locked/svg) |
| **T** | TDD — write tests first / with; multipath live; no Maker grey stub |
| **R** | Code review — CSS path audit, hex grep, boundary |
| **P** | Parent (this session) — merge only if C + R PASS |

## Definition of done

1. Form sections: Units · Size · Pedestals · Identity  
2. No graph paper under form (cascade-proof)  
3. Premium controls (focus, density, preview plate) — tokens only  
4. Tests green for form structure + publish + multipath  
5. Critic + code review written short PASS/FAIL in `agent-reports/blunders/tandem-out/`  
