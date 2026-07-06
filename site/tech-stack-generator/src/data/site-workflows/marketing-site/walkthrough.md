# Marketing Site Walkthrough

End-to-end flow from content authoring to production deploy for oando.co.in marketing.

1. Author content: Edit copy in site/i18n/messages/*.json or lib/site-data/. Use semantic keys.
2. Preview locally: Run dev server. Check responsive, a11y, and locale switch. (pnpm run dev)
3. Diagram review: Validate route + data flow with Mermaid.
4. Screenshot capture: Use chrome-devtools MCP or Playwright for visual regression. Ensure matches Figma/global-standard. (screenshotDesc: Marketing hero + nav on desktop + mobile locale switch)

Current: Content is partially hand-curated; some sections use static data. Visual regression and full a11y gates run in CI via site-ui workflow.

Goal: 100% data-driven where possible, zero-drift from Figma via tokens only, sub-2s LCP on all marketing routes, full evidence-backed screenshots in every gate.

InstructionsNote: Always start edits with /using-superpowers. Run docs:gate:tech-stack after structural changes.