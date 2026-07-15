# UI 04 — Site public UI

**Scope:** Homepage, global nav, commercial pages, product discovery, forms, mobile public.  
**Live UI this session:** **Not opened.** Claims from code + `docs/architecture/09-SITE-UI-BENCHMARK.md` + Site FEATURES.  
**One sentence each.**

1. Homepage audience, value, proof, and CTA structure exist in data but lack fresh CWV and mobile proof.  
2. Hero fallback behavior is inconsistent across homepage versus generic hero components.  
3. Global nav quote-cart naming is partially fixed; full nav benchmarks (`SITE-NAV-*`) remain open.  
4. Most page CTAs do not fire planner entry tracking, so conversion UI is incomplete.  
5. Customer segments, pages, and nav are not mapped to one intent and one next action.  
6. Contact and customer query forms lack full consent and form acceptance (`SITE-FORM-*`).  
7. Mobile commercial layout benchmarks (`SITE-MOB-*`) are open.  
8. A11y smoke on a subset of routes is not AA sign-off for primary public journeys.  
9. Product category grid has loading, error, and empty states but not full stale and recovery UI.  
10. Product detail can present always-in-stock style signals that are not commercially honest.  
11. Choose-product and design CTAs do not complete product identity handoff UI into Planner.  
12. Compare dock and quote cart lack full Site-to-Planner planning UI contracts.  
13. Phone product filters and comparison UI are incomplete.  
14. Search-led content pages lack ownership, review dates, and evidence chrome.  
15. Metadata, title, and hreflang coverage is partial across public routes.  
16. Sitemap and robots can list or omit routes that disagree with indexability classification.  
17. Structured data may not match what the visitor actually sees.  
18. Field Core Web Vitals budgets are not recorded against real homepage and product LCP elements.  
19. Critical console, request, and hydration issues need a production-like public run.  
20. Full public journey from discovery to Planner entry is not UI-proven as one continuous path.

## Routes to verify live

- `/` · primary commercial pages · `/products/*` · contact · quote-cart · 1440 and 390
