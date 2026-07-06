# Site ↔ Planner Integration Walkthrough

How marketing site links, embeds, and shares design system with the interactive planner workspace.

1. Entry points: Marketing CTAs link to /planner/guest/. Shared CSS tokens ensure visual continuity.
2. Catalog bridge: Use lib/catalog + platform data. Never duplicate product facts in site-data. (pnpm run catalog:ingest)
3. Theme sync: site/tech-stack-generator syncs css from site/app/css. Verify in generated-css/.
4. Visual QA screenshot: Capture hero CTA + planner embed side-by-side for anti-copy validation. (screenshotDesc: Side-by-side: marketing card leading into planner canvas with matching bronze/ocean accents)

Current: Guest planner available. Token aliases in tech-stack-generator/src/index.css. Some planner chrome still uses legacy palette classes (tracked in Failures).

Goal: Pure token-driven UI across marketing + planner. Every surface change audited with chrome-devtools screenshots + lighthouse in results/site/...

InstructionsNote: Follow MODULE-UI-CONTRACT. Min necessary edits only.