# SVG Blunder Recovery Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `subagent-driven-development` or `executing-plans` to implement these plans task-by-task. Checkboxes are the execution record. Do not commit or push unless the owner asks.

**Goal:** Replace the unusable Admin SVG authoring surface with full SVG-Edit, reversible V2 persistence, decimal physical dimensions, and optional typed AI assistance.

**Architecture:** SVG-Edit runs in a same-origin iframe and remains the complete manual editor. The Admin host owns identity, dimensions, validation, revisions, AI review, and publishing. Products DB stores V2 metadata; Supabase Storage stores private drafts and AI snapshots; Cloudflare R2 stores public releases. V1 remains frozen and read-only for recovery.

**Tech stack:** Next.js, React, TypeScript, SVG-Edit 7.4.2, `@svgedit/svgcanvas` 7.4.2, Zod, OpenAI Structured Outputs, Drizzle, Products Supabase, Supabase Storage, Cloudflare R2, Vitest, Playwright.

---

## Owner decisions

- Manual editing is the default. AI is optional and initially collapsed.
- Keep every SVG-Edit authoring feature available.
- Automatically hide the Admin left navigation on editor detail routes; offer an accessible overlay toggle.
- Dimensions display decimal `mm`, `cm`, `m`, `in`, or `ft`. Do not use mixed feet-and-inches.
- Store physical dimensions canonically in millimetres.
- Ask before dimension changes scale artwork. Preserve proportions by default; independent X/Y scaling requires explicit unlocking.
- Use a full sanitized SVG plus a V2 manifest as the new geometry authority.
- Products DB owns metadata and revisions. Supabase Storage owns private drafts and indefinite AI snapshots. R2 owns released public artifacts.
- OpenAI is the quality-first AI provider; only schema-capable providers may fail over.
- AI edits the selection by default, shows a before/after preview, and requires explicit Apply.
- Deterministic validation always runs. AI audit runs only on demand.
- Nothing is permanently removed. V1 code, data, and artifacts remain recoverable and read-only.

## Phase order

1. [V2 foundation](./01-v2-foundation.md) — isolate tests, inventory V1, establish versioned schemas and storage boundaries.
2. [Manual SVG-Edit](./02-manual-svg-edit.md) — install and embed the complete editor, add dimensions, focus mode, drafts, and publishing.
3. [AI integration](./03-ai-integration.md) — typed edit/audit operations, preview, stale-state protection, and permanent audit snapshots.
4. [Reversible cutover](./04-reversible-cutover.md) — full verification, V2 default, V1 read-only fallback, and documented rollback.

## Cross-phase invariants

- Run all `pnpm` commands from `E:\12072026`.
- Tests must use temporary fixtures and must never mutate canonical catalog data.
- No handwritten `any`.
- No inline TSX presentation rules or hard-coded visual values.
- Routes remain thin; Admin domain behavior stays under `site/features/admin/`.
- Planner-owned catalog consumption stays under `site/features/planner/`.
- Every bridge, manifest, and AI payload carries an explicit version.
- Unknown versions fail closed without modifying the document.
- Publishing is transactional: an upload, database write, or validation failure leaves the previous release live.
- No commit, push, migration apply, destructive cleanup, or deployment without explicit owner instruction.

## Completion gate

The work is complete only when all four phase files are checked, the browser journeys pass, V2 is the configured default, V1 recovery is proven, and these commands pass from the repository root:

```powershell
pnpm run lint
pnpm run typecheck
pnpm --filter oando-site run lint:ui:strict
pnpm --filter oando-site run test:a11y
pnpm run check:layout
```

