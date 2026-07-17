/**
 * POST /api/planner/handoff
 *
 * Member-only commercial handoff: validated BOQ + contact → Oando intake.
 * Delivery path:
 *   1. Persist to `customer_queries` (source=planner-handoff) — durable CRM intake.
 *   2. Optional Resend email to STAFF_NOTIFY_EMAIL when RESEND_API_KEY is set.
 *
 * Idempotency: client `idempotencyKey` stored in `requirement` as
 * `handoff-key:{userId}:{key}`. Lookup also accepts one-time legacy
 * `handoff-key:{key}` when followup_notes.memberUserId matches (or is absent).
 * Lookup errors fail closed (502, no insert). Replay returns the original
 * reference without a second insert.
 *
 * Honest failure: missing admin DB credentials → 501 not_configured.
 */
import type { NextRequest } from "next/server";

import { withAuth, type AuthContext } from "@/features/shared/api/withAuth";
import { createSupabaseAuthAdminClient } from "@/platform/supabase/auth-admin";
import {
  PLANNER_HANDOFF_IDEM_PREFIX,
  PLANNER_HANDOFF_SOURCE,
  type PlannerHandoffBoq,
  type PlannerHandoffContact,
  type PlannerHandoffRequestBody,
} from "@/features/planner/shared/handoff/handoffTypes";
import { notifyHandoffStaff } from "@/features/planner/shared/handoff/notifyHandoffStaff";

function asTrimmedString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** Best-effort owner id from CRM followup_notes JSON (handoff payload). */
function memberIdFromFollowupNotes(notes: unknown): string | null {
  if (typeof notes !== "string" || !notes.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(notes);
    if (!parsed || typeof parsed !== "object") return null;
    const id = (parsed as { memberUserId?: unknown }).memberUserId;
    return typeof id === "string" && id.trim() ? id.trim() : null;
  } catch {
    return null;
  }
}

function parseContact(raw: unknown): PlannerHandoffContact | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const name = asTrimmedString(o.name, 180);
  if (!name) return null;
  return {
    name,
    company: asTrimmedString(o.company, 180) || undefined,
    email: asTrimmedString(o.email, 180) || undefined,
    phone: asTrimmedString(o.phone, 50) || undefined,
    notes: asTrimmedString(o.notes, 2000) || undefined,
  };
}

function parseBoqLine(raw: unknown): PlannerHandoffBoq["lines"][number] | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const catalogId = asTrimmedString(o.catalogId, 200);
  const name = asTrimmedString(o.name, 300);
  const quantity = typeof o.quantity === "number" && Number.isFinite(o.quantity) ? o.quantity : 0;
  if (!catalogId || !name || quantity < 1) return null;
  const priceSource = o.priceSource === "demo-list" ? "demo-list" : "none";
  return {
    catalogId,
    name,
    sku: asTrimmedString(o.sku, 120),
    category: asTrimmedString(o.category, 80) || "furniture",
    quantity: Math.min(10_000, Math.floor(quantity)),
    unitPriceInr: typeof o.unitPriceInr === "number" && Number.isFinite(o.unitPriceInr) ? o.unitPriceInr : 0,
    lineTotalInr: typeof o.lineTotalInr === "number" && Number.isFinite(o.lineTotalInr) ? o.lineTotalInr : 0,
    priced: Boolean(o.priced),
    priceSource,
  };
}

function parseBoq(raw: unknown): PlannerHandoffBoq | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const projectId = asTrimmedString(o.projectId, 120);
  const projectName = asTrimmedString(o.projectName, 200);
  const calculationHash = asTrimmedString(o.calculationHash, 128);
  if (!projectId || !projectName || !calculationHash) return null;
  if (!Array.isArray(o.lines) || o.lines.length === 0) return null;

  const lines: PlannerHandoffBoq["lines"] = [];
  for (const row of o.lines.slice(0, 500)) {
    const line = parseBoqLine(row);
    if (line) lines.push(line);
  }
  if (lines.length === 0) return null;

  return {
    kind: asTrimmedString(o.kind, 80) || "open3d-furniture-boq-v1",
    projectId,
    projectName,
    calculationHash,
    pricingMode: asTrimmedString(o.pricingMode, 80) || "demo-list-partial",
    pricingNote:
      asTrimmedString(o.pricingNote, 500) ||
      "Demo list prices only — not approved commercial pricing.",
    currencyCode: "INR",
    totalItems:
      typeof o.totalItems === "number" && Number.isFinite(o.totalItems)
        ? Math.max(0, Math.floor(o.totalItems))
        : lines.reduce((s, l) => s + l.quantity, 0),
    totalLines: lines.length,
    subtotalInr:
      typeof o.subtotalInr === "number" && Number.isFinite(o.subtotalInr) ? o.subtotalInr : 0,
    gstInr: typeof o.gstInr === "number" && Number.isFinite(o.gstInr) ? o.gstInr : 0,
    totalInr: typeof o.totalInr === "number" && Number.isFinite(o.totalInr) ? o.totalInr : 0,
    pricedItemCount:
      typeof o.pricedItemCount === "number" && Number.isFinite(o.pricedItemCount)
        ? Math.max(0, Math.floor(o.pricedItemCount))
        : 0,
    unpricedItemCount:
      typeof o.unpricedItemCount === "number" && Number.isFinite(o.unpricedItemCount)
        ? Math.max(0, Math.floor(o.unpricedItemCount))
        : 0,
    lines,
  };
}

function parseBody(raw: unknown): PlannerHandoffRequestBody | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "Invalid JSON body" };
  const o = raw as Record<string, unknown>;
  const idempotencyKey = asTrimmedString(o.idempotencyKey, 80);
  if (!idempotencyKey || idempotencyKey.length < 8) {
    return { error: "idempotencyKey is required (min 8 characters)" };
  }
  if (o.confirmDemoPricing !== true) {
    return { error: "confirmDemoPricing must be true" };
  }
  const contact = parseContact(o.contact);
  if (!contact) return { error: "Contact name is required" };
  if (!contact.email && !contact.phone) {
    return { error: "Provide contact email or phone" };
  }
  const boq = parseBoq(o.boq);
  if (!boq) return { error: "Valid BOQ with at least one line is required" };
  return {
    idempotencyKey,
    contact,
    boq,
    projectNotes: asTrimmedString(o.projectNotes, 2000) || undefined,
    confirmDemoPricing: true,
  };
}

function buildStaffMessage(
  contact: PlannerHandoffContact,
  boq: PlannerHandoffBoq,
  auth: AuthContext,
  projectNotes?: string,
): string {
  const lineBlock = boq.lines
    .slice(0, 40)
    .map(
      (l) =>
        `- ${l.quantity}× ${l.name} (${l.catalogId}${l.sku ? ` / ${l.sku}` : ""}) · ₹${l.lineTotalInr}${l.priced ? "" : " unpriced"}`,
    )
    .join("\n");
  return [
    `Planner BOQ handoff`,
    `Project: ${boq.projectName} (${boq.projectId})`,
    `Hash: ${boq.calculationHash}`,
    `Member: ${auth.user?.email ?? auth.user?.id ?? "unknown"}`,
    `Contact: ${contact.name}`,
    contact.company ? `Company: ${contact.company}` : null,
    contact.email ? `Email: ${contact.email}` : null,
    contact.phone ? `Phone: ${contact.phone}` : null,
    contact.notes ? `Contact notes: ${contact.notes}` : null,
    projectNotes ? `Project notes: ${projectNotes}` : null,
    `Items: ${boq.totalItems} · Lines: ${boq.totalLines}`,
    `Demo subtotal ₹${boq.subtotalInr} · GST ₹${boq.gstInr} · Total ₹${boq.totalInr}`,
    `Pricing: ${boq.pricingNote}`,
    ``,
    `Lines:`,
    lineBlock,
    boq.lines.length > 40 ? `…and ${boq.lines.length - 40} more lines` : null,
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n");
}

export const POST = withAuth(
  async (req: NextRequest, auth: AuthContext) => {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "invalid_json", message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const parsed = parseBody(raw);
    if ("error" in parsed) {
      return Response.json(
        { success: false, error: "invalid_input", message: parsed.error },
        { status: 400 },
      );
    }

    const { idempotencyKey, contact, boq, projectNotes } = parsed;
    // Scope idempotency by member so keys cannot collide across accounts.
    const memberScope = auth.user?.id?.trim() || "unknown";
    const requirementKey = `${PLANNER_HANDOFF_IDEM_PREFIX}${memberScope}:${idempotencyKey}`;

    let supabase: ReturnType<typeof createSupabaseAuthAdminClient>;
    try {
      supabase = createSupabaseAuthAdminClient();
    } catch (err) {
      console.error("[handoff] admin client unavailable:", err);
      return Response.json(
        {
          success: false,
          error: "not_configured",
          message:
            "Quote handoff to Oando is not configured (CRM database). Your draft was not submitted.",
        },
        { status: 501 },
      );
    }

    // Idempotent replay — fail closed on lookup error (do not insert blindly).
    // Prefer user-scoped key; fall back to pre-cutover `handoff-key:{key}` when
    // the stored memberUserId matches (or notes lack a member id).
    const legacyRequirementKey = `${PLANNER_HANDOFF_IDEM_PREFIX}${idempotencyKey}`;
    const { data: scopedExisting, error: scopedLookupError } = await supabase
      .from("customer_queries")
      .select("id, created_at")
      .eq("source", PLANNER_HANDOFF_SOURCE)
      .eq("requirement", requirementKey)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (scopedLookupError) {
      console.error("[handoff] idempotency lookup failed:", scopedLookupError.message);
      return Response.json(
        {
          success: false,
          error: "idempotency_lookup_failed",
          message:
            "Unable to verify handoff idempotency right now. Your draft was not submitted; retry shortly.",
        },
        { status: 502 },
      );
    }

    let existing = scopedExisting;
    if (!existing?.id) {
      const { data: legacyExisting, error: legacyLookupError } = await supabase
        .from("customer_queries")
        .select("id, created_at, followup_notes")
        .eq("source", PLANNER_HANDOFF_SOURCE)
        .eq("requirement", legacyRequirementKey)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (legacyLookupError) {
        console.error("[handoff] legacy idempotency lookup failed:", legacyLookupError.message);
        return Response.json(
          {
            success: false,
            error: "idempotency_lookup_failed",
            message:
              "Unable to verify handoff idempotency right now. Your draft was not submitted; retry shortly.",
          },
          { status: 502 },
        );
      }

      if (legacyExisting?.id) {
        const notesOwner = memberIdFromFollowupNotes(
          (legacyExisting as { followup_notes?: unknown }).followup_notes,
        );
        // Replay only when owner is unknown (pre-notes) or matches this member.
        if (notesOwner === null || notesOwner === memberScope) {
          existing = {
            id: legacyExisting.id,
            created_at: legacyExisting.created_at,
          };
        }
      }
    }

    if (existing?.id) {
      return Response.json({
        success: true,
        referenceId: existing.id,
        createdAt: existing.created_at,
        idempotentReplay: true,
        staffNotified: false,
        message: "Handoff already received. Using the original reference.",
      });
    }

    const message = buildStaffMessage(contact, boq, auth, projectNotes);
    const { data: inserted, error: insertError } = await supabase
      .from("customer_queries")
      .insert({
        name: contact.name,
        company: contact.company ?? null,
        email: contact.email ?? null,
        phone: contact.phone ?? null,
        preferred_contact: contact.email ? "email" : "phone",
        message,
        requirement: requirementKey,
        source: PLANNER_HANDOFF_SOURCE,
        source_path: `/planner/project/${boq.projectId}`,
        budget: `demo-total-inr:${boq.totalInr}`,
        timeline: `hash:${boq.calculationHash.slice(0, 24)}`,
        status: "new",
        followup_notes: JSON.stringify({
          kind: boq.kind,
          projectId: boq.projectId,
          calculationHash: boq.calculationHash,
          pricingMode: boq.pricingMode,
          totalItems: boq.totalItems,
          totalInr: boq.totalInr,
          memberUserId: auth.user?.id ?? null,
          lineCount: boq.lines.length,
        }).slice(0, 4000),
      })
      .select("id, created_at")
      .single();

    if (insertError || !inserted) {
      console.error("[handoff] insert failed:", insertError?.message ?? "unknown");
      return Response.json(
        {
          success: false,
          error: "persist_failed",
          message: "Unable to save the handoff right now. Your draft is still on the device.",
        },
        { status: 502 },
      );
    }

    const linePreview = boq.lines
      .slice(0, 25)
      .map((l) => `${l.quantity}× ${l.name}`)
      .join("\n");

    const notify = await notifyHandoffStaff({
      referenceId: inserted.id,
      projectName: boq.projectName,
      contactName: contact.name,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      company: contact.company,
      totalItems: boq.totalItems,
      totalInr: boq.totalInr,
      pricingNote: boq.pricingNote,
      linePreview,
    });

    return Response.json({
      success: true,
      referenceId: inserted.id,
      createdAt: inserted.created_at,
      idempotentReplay: false,
      staffNotified: notify.sent,
      message: notify.sent
        ? "BOQ sent to Oando. Staff were notified by email."
        : "BOQ received by Oando intake. Staff email notify is not configured (or failed); the record is still saved.",
    });
  },
  {
    role: "member",
    rateLimitScope: "planner:handoff",
    rateLimit: 10,
    requireCsrf: true,
  },
);
