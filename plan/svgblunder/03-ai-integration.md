# Phase 3: Typed AI Edit and Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `subagent-driven-development` or `executing-plans`. Use TDD. Do not commit or push unless the owner asks.

**Goal:** Add optional, reviewable AI editing and auditing without giving a model direct document, storage, lifecycle, or publish authority.

**Architecture:** The server sends a bounded SVG snapshot and scope to a quality-first OpenAI model using strict Structured Outputs. The model returns typed operations only. The client applies them to a clone, validates the result, shows a preview, and applies the complete result through one iframe `apply` message after explicit approval.

**Tech stack:** OpenAI Responses API, strict function calling/Structured Outputs, Zod, existing provider chain, Supabase Storage, Vitest, Playwright.

---

## Task 1: Define the AI protocol

**Files:**
- Create: `site/features/admin/svg-editor-v2/ai/svgAiSchemasV1.ts`
- Create: `site/features/admin/svg-editor-v2/ai/svgAiOperationsV1.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgAiSchemasV1.test.ts`

- [ ] Define `SvgAiRequestV1` with `mode`, prompt, selection/document scope, SVG, millimetre dimensions, and base checksum.
- [ ] Define `SvgAiResponseV1` with summary, echoed base checksum, operations, findings, provider, and model.
- [ ] Define closed operations for insert, allowlisted attributes, move, resize, rotate, duplicate, remove, group, ungroup, reorder, rename, and dimension proposals.
- [ ] Require stable IDs, finite bounded numbers, allowlisted SVG names, and `additionalProperties: false` semantics.
- [ ] Reject unknown operation versions; future behavior requires a new registry entry.

## Task 2: Add structured provider support

**Files:**
- Modify: `site/lib/ai/providerChain.ts`
- Create: `site/features/admin/svg-editor-v2/ai/requestSvgAiOperations.server.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/requestSvgAiOperations.test.ts`

- [ ] Add a provider capability flag for strict schema output.
- [ ] Use OpenAI as primary with an environment-controlled quality-first model.
- [ ] Permit fallback only to configured providers that satisfy the identical schema.
- [ ] Use low temperature and bounded input/output sizes.
- [ ] Treat refusal, timeout, malformed schema, and exhausted fallback as typed non-destructive errors.
- [ ] Follow official OpenAI function-calling and Structured Outputs contracts.

## Task 3: Replace the unused raw SVG endpoint

**Files:**
- Create: `site/app/api/admin/svg-editor/ai-operations/route.ts`
- Retire from active routing: `site/app/api/admin/svg-editor/ai-generate/route.ts`
- Test: `site/tests/unit/app/api/admin/svg-editor/ai-operations/route.test.ts`

- [ ] Require Admin authentication and a dedicated admin-write rate limit.
- [ ] Validate request size, schema, SVG checksum, scope IDs, and prompt length before any provider call.
- [ ] Return typed success/error envelopes without raw model text.
- [ ] Prohibit storage, publish, lifecycle, and arbitrary URL tools.
- [ ] Keep the old endpoint source recoverable in V1 history but remove it from active use.

## Task 4: Implement deterministic operation preview

**Files:**
- Create: `site/features/admin/svg-editor-v2/ai/applySvgAiOperations.ts`
- Create: `site/features/admin/svg-editor-v2/ai/previewSvgAiOperations.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/applySvgAiOperations.test.ts`

- [ ] Apply operations to a detached parsed SVG clone only.
- [ ] Re-run sanitizer and capability validation after every operation batch.
- [ ] Return before/after SVG, result checksum, human-readable operation list, and diagnostics.
- [ ] Reject missing targets, locked targets, duplicate IDs, invalid references, unsafe attributes, and out-of-bounds dimensions.
- [ ] Never mutate the live iframe during preview.

## Task 5: Build the collapsible AI rail

**Files:**
- Create: `site/features/admin/svg-editor-v2/ui/SvgAiAssistPanel.tsx`
- Create: `site/features/admin/svg-editor-v2/ui/SvgAiChangePreview.tsx`
- Test: `site/tests/unit/features/admin/svg-editor-v2/SvgAiAssistPanel.test.tsx`

- [ ] Keep the panel collapsed on initial load.
- [ ] Default scope to selected element IDs; require an explicit Whole symbol selection otherwise.
- [ ] Provide Edit and Audit actions, prompt, summary, findings, operation list, before/after preview, Apply, and Discard.
- [ ] Reject Apply if the live iframe checksum differs from the response base checksum.
- [ ] Route AI dimension proposals through the manual Scale/Metadata/Cancel dialog.
- [ ] Apply an accepted result through one iframe `apply` message so one Undo reverses the batch.
- [ ] Keep manual SVG-Edit tools usable when the AI rail is closed.

## Task 6: Persist indefinite AI audit snapshots

**Files:**
- Create: `site/features/admin/svg-editor-v2/ai/svgAiAuditRepository.server.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgAiAuditRepository.test.ts`

- [ ] Store full input SVG and output preview SVG in private Supabase Storage.
- [ ] Store actor, prompt, scope, provider/model, operations, findings, latency, checksums, errors, and Apply/Discard outcome in Products DB.
- [ ] Retain snapshots indefinitely; do not add automatic expiry.
- [ ] Restrict reads to authorized Admin audit flows.
- [ ] Verify snapshot checksums on retrieval.

## Phase 3 gate

- [ ] Schema, provider, endpoint, preview, stale-state, and audit tests pass.
- [ ] AI refusals and provider failures cannot modify the editor.
- [ ] Apply requires preview and explicit user action.
- [ ] One Undo reverses an accepted AI batch.
- [ ] `pnpm run check:layout` passes.

