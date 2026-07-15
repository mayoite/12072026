# UI 05 — Shared a11y, auth UX & verification gaps

**Scope:** Cross-surface accessibility, keyboard, focus, auth experience, and how UI claims get proven.  
**Live UI this session:** **Not opened.**  
**One sentence each.**

1. UI and accessibility are acceptance concerns inside product tracks, not a separate optional track.  
2. WCAG 2.2 AA is the quality target; smoke axe runs do not equal AA sign-off.  
3. Keyboard-complete primary journeys with visible focus are required for Admin, Planner, and Site.  
4. Icon-only controls without accessible names fail list and toolbar acceptance across products.  
5. Security and auth states must use plain language without sensitive disclosure.  
6. Recoverable failure must preserve safe work and give one next action.  
7. Authentication and high-risk confirmation must be announced and keyboard-completable.  
8. Status, errors, expiry, and recovery must be programmatically announced where dynamic.  
9. Forced clicks and raised timeouts in tests mask blocked controls and are forbidden as proof.  
10. Browser proof must capture console errors, failed requests, and a11y failures on the changed route.  
11. Desktop and mobile widths both matter; phone is not a flattened desktop table.  
12. `DEV_AUTH_BYPASS` UI sessions cannot prove production access UX.  
13. Chrome DevTools MCP Lighthouse path is blocked without Google Chrome stable on this host.  
14. Playwright Chromium a11y is mitigation, not a substitute for claimed MCP Lighthouse scores.  
15. Admin list and catalog phone layouts previously failed compact review benchmarks.  
16. Planner deferred tools must expose honest disabled or deferred language, not silent no-ops.  
17. Site consent UI must gate analytics before emit or consent is theater.  
18. Save and publish success toasts that lie destroy trust more than missing polish.  
19. Results folders and old screenshots do not prove current UI.  
20. No UI ID in the benchmarks is closed until a fresh command, viewport, and exit code are recorded in the track checklist.

## Minimum verification recipe (when owner asks)

1. Production-like or documented bypass mode stated explicitly.  
2. Routes: Admin list, Admin studio, Planner guest, Site home, one product page.  
3. Viewports: 1440×900 and 390×844.  
4. Keyboard tab through primary actions.  
5. Axe critical/serious = 0 on those routes.  
6. No unexplained console or failed network on happy path.  
7. Write evidence under `results/<track>/…` and status only in checklists / Failures.

## Honest status this session

- **0** of the above verification recipe steps run.
