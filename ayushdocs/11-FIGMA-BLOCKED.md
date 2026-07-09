# Figma library skill — BLOCKED

**Status:** **BLOCKED**  
**Date recorded:** 2026-07-09  
**Owner item:** OPS.4 in [00-PENDING.md](./00-PENDING.md)  
**Skill:** `figma-generate-library` (Figma plugin skill; needs Figma MCP + companion `figma-use`)

---

## What this is *not*

- This note does **not** invent, draft, or ship any Figma design, tokens, components, or Code Connect mappings.
- No design library work ran in this session.
- Repo design-intake policy still prefers Penpot first; Figma/Code Connect remains optional later (`docs/architecture/DESIGN-SYSTEM-INTAKE.md`).

---

## Current blocker

| Fact | Detail |
|------|--------|
| **Figma MCP** | Auth-required and/or failed in this session |
| **Effect** | `figma-generate-library` cannot call Figma tools (`use_figma`, library search, screenshots, etc.) |
| **Action taken** | Documented only — skill left unused; no speculative design artifacts |

Until Figma MCP is authenticated and tools respond successfully, treat all Figma library / Code Connect automation as **blocked**.

---

## What `figma-generate-library` would do *when auth works*

When Figma MCP is connected and the user explicitly asks for a design-system / library build, the skill orchestrates a multi-phase Figma design-system workflow from the codebase (not a one-shot dump). Typical phases:

### Phase 0 — Discovery (read-only first)

1. Analyze the codebase for tokens, components, and naming.
2. Inspect the target Figma file (pages, variables, components, styles).
3. Search subscribed / available libraries before creating anything.
4. Lock a **v1 scope** (token set + component list) with the user.
5. Map code ↔ Figma conflicts and print a **gap analysis**.

### Phase 1 — Foundations (tokens first)

1. Create variable collections and modes (e.g. light/dark where planned).
2. Create primitive then semantic variables; set scopes and code syntax.
3. Create effect styles (shadows) and text styles (typography).
4. Summarize collections / variables / styles for review.

### Phase 2 — File structure

1. Page skeleton (cover, getting started, foundations, components, utilities).
2. Foundations documentation (swatches, type specimens, spacing).
3. Screenshots / page list for visual confirmation.

### Phase 3 — Components (one at a time)

For each agreed component, in dependency order:

1. Dedicated page, auto-layout, full variable bindings.
2. Variant sets + component properties.
3. Page docs; validate with metadata + screenshot.
4. Optional lightweight Code Connect while context is fresh.

### Phase 4 — Integration + QA

1. Finalize Code Connect mappings (if in scope).
2. Accessibility, naming, and unresolved-binding audits.
3. Final review screenshots.

**Prerequisites when unblocked:** loaded `figma-use` skill, sequential `use_figma` calls (never parallel), real Figma design file access, and user-locked scope after Phase 0. Helper scripts under the skill package support tokens, components, docs, validation, and cleanup.

**This skill does not replace product recovery work.** It only builds or updates a Figma library against an agreed scope once MCP works.

---

## Steps for you: re-auth Figma MCP when ready

Do this on **your** machine / client when you want Figma library automation again. Exact UI labels vary by host (Cursor, Codex, etc.); the server is OAuth-backed Figma MCP.

1. **Open MCP / Connectors / Integrations settings** in the agent host you use for this repo.
2. **Find the Figma MCP / Figma connector**  
   - Config points at: `https://mcp.figma.com/mcp` (OAuth resource same URL).
3. **Disconnect / sign out** if a stale or failed session is shown, then **Connect / Sign in / Re-authenticate**.
4. **Complete the Figma OAuth browser flow** with the Figma account that owns or can edit the target file(s).
5. **Grant the scopes** Figma prompts for (file read/write as required by library tools).
6. **Confirm tools are live** in a new or refreshed agent session:
   - Figma MCP appears connected (not “auth required” / error).
   - A simple read (e.g. list tools or open a known Figma file URL with `node-id`) succeeds.
7. **Only then** re-request library work, e.g.  
   *“Load `figma-generate-library` + `figma-use`, file URL is …, run Phase 0 discovery only.”*  
   Do not skip Phase 0; do not invent scope.

### If re-auth still fails

- Retry sign-in in a private/clean browser profile (cookie / org SSO issues).
- Confirm the Figma plan/org allows MCP / Dev Mode access for that account.
- Confirm the target file is a **Design** file (`figma.com/design/...`), not FigJam/Slides, if the skill will create pages/components.
- Restart the agent host after a successful OAuth so the session picks up tokens.
- Keep this OPS item **blocked** until a live tool call succeeds — do not mark OPS.4 done on config alone.

---

## Resume prompt (after auth works)

Use something like:

> Figma MCP is re-authenticated. Load `figma-generate-library` and `figma-use`. Start **Phase 0 discovery only** against [Figma file URL with node-id if known]. Do not create variables or components until I lock v1 scope. Do not invent design work outside the gap analysis.

---

## Related

| Doc / item | Role |
|------------|------|
| [00-PENDING.md](./00-PENDING.md) OPS.4 | Tracks “Figma Code Connect / library — Blocked” |
| `docs/architecture/DESIGN-SYSTEM-INTAKE.md` | Penpot-first; Figma/Code Connect optional later |
| Figma skill package (host cache) | `figma-generate-library` + `figma-use` implementation |

---

**Bottom line:** `figma-generate-library` is ready as a **workflow definition** only. **Execution is BLOCKED** until you re-auth Figma MCP. No design library was created in this session.
