# Stale scripts archived 2026-07-09

Moved from site/scripts because packages/pages no longer exist:

| Script | Why |
|--------|-----|
| tldraw-coverage-report.mjs | tldraw feature + package gone |
| screenshot_all_pages.py | nova-act not in package.json; hardcoded API key risk |
| scrapeAfcChairs.ts | competitor scrape; not product path |
| tmp-run-features.mjs | one-off temp |

See results/site/scripts-audit/STALE-SCRIPTS.md for full scan (14 scripts still reference legacy names in docs generators — fix or leave as historical labels).

Audit runner: site/scripts/_audit-stale-scripts.mjs
