# Release QA Site — Goal

**Targets (measurable, best standards):**

- 100% adherence: every release run produces full `<cmd>-run.json` + `<cmd>-raw.log` under results/ (handbook).
- Gate exit 0 + all required artifacts present = complete.
- Site-specific: marketing + catalog + i18n + integration covered in e2e:nav + a11y.
- Coverage floor 90% (target 95%) per quality-gates; no broad any.
- Tech stack docs gate always passes including workflow data.
- Industry: CI green on main (tech-stack-docs.yml etc); conventional process.
- GS: Global Standard Gate + anti-copy before any "ship" claim on site features (superpowers design §6).
- Generator: release-qa workflow docs enable reproducible QA for site modules.

**Verifiable:**
- `pnpm run release:gate` (with evidence review).
- Skipped items declared in Failures.md.
- Cross-ref updated Lockedfiles/tests/proposed.md + START.md.
