import type { NextRequest} from "next/server";
import { createSupabaseAuthAdminClient } from '@/platform/supabase/auth-admin';
import { getClientIp } from "@/platform/supabase/adminServer";
import { rateLimit } from "@/lib/rateLimit";
import { success, error, rateLimitedError } from "@/features/shared/api/apiResponse";
import { ApiError, API_ERROR_CODES } from "@/features/shared/api/ApiError";

type PreferredContact = "email" | "whatsapp" | "phone" | "any";

type CustomerQueryPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  preferredContact?: PreferredContact;
  message?: string;
  requirement?: string;
  budget?: string;
  timeline?: string;
  source?: string;
  sourcePath?: string;
  /** Honeypot field — must be empty for legitimate submissions. */
  website?: string;
};

const preferredContactValues: PreferredContact[] = [
  "email",
  "whatsapp",
  "phone",
  "any",
];

function normalizeText(value: unknown, max = 3000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function normalizePreferredContact(value: unknown): PreferredContact {
  if (typeof value !== "string") return "any";
  return preferredContactValues.includes(value as PreferredContact)
    ? (value as PreferredContact)
    : "any";
}

function normalizePhoneForWhatsApp(value: string): string {
  return value.replace(/[^\d]/g, "");
}

async function parsePayload(req: NextRequest): Promise<CustomerQueryPayload> {
  try {
    return (await req.json()) as CustomerQueryPayload;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limitRes = await rateLimit(`customer-queries:${ip}`, 6, 60 * 60 * 1000);
  if (!limitRes.success) {
    return rateLimitedError(
      "Too many submissions. Please try again after some time.",
      limitRes.reset,
    );
  }

  const payload = await parsePayload(req);

  // Honeypot: bots that fill `website` get a fake success with the same
  // envelope shape as a real insert so clients (and scrapers) cannot tell.
  const honeypot = normalizeText(payload.website, 120);
  if (honeypot) {
    return success(
      {
        queryId: "submitted",
        createdAt: new Date().toISOString(),
        followUp: {
          email: null,
          whatsapp: null,
        },
      },
      201,
    );
  }

  const name = normalizeText(payload.name, 180);
  const message = normalizeText(payload.message, 5000);
  const company = normalizeText(payload.company, 180);
  const email = normalizeText(payload.email, 180);
  const phone = normalizeText(payload.phone, 50);
  const requirement = normalizeText(payload.requirement, 300);
  const budget = normalizeText(payload.budget, 120);
  const timeline = normalizeText(payload.timeline, 120);
  const source = normalizeText(payload.source, 60) || "website";
  const sourcePath = normalizeText(payload.sourcePath, 200);
  const preferredContact = normalizePreferredContact(payload.preferredContact);

  if (!name || !message) {
    return error(
      ApiError.fromCode(
        API_ERROR_CODES.MISSING_REQUIRED_FIELD,
        "Name and message are required.",
      ),
    );
  }

  if (!email && !phone) {
    return error(
      ApiError.fromCode(
        API_ERROR_CODES.MISSING_REQUIRED_FIELD,
        "Please provide email or phone.",
      ),
    );
  }

  const supabaseAdmin = createSupabaseAuthAdminClient();
  const { data, error: dbError } = await supabaseAdmin
    .from("customer_queries")
    .insert({
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      preferred_contact: preferredContact,
      message,
      requirement: requirement || null,
      budget: budget || null,
      timeline: timeline || null,
      source,
      source_path: sourcePath || null,
    })
    .select("id, created_at, email, phone")
    .single();

  if (dbError || !data) {
    console.error("customer_queries insert failed:", dbError?.message || "unknown");
    return error(
      ApiError.fromCode(
        API_ERROR_CODES.DATABASE_ERROR,
        "Unable to save query right now.",
      ),
    );
  }

  const whatsappPhone = data.phone ? normalizePhoneForWhatsApp(data.phone) : "";
  const queryId = data.id;
  const queryRefText = encodeURIComponent(
    `Hello, we received your query ${queryId}.`,
  );

  return success(
    {
      queryId,
      createdAt: data.created_at,
      followUp: {
        email: data.email ? `mailto:${data.email}?subject=Query%20${queryId}` : null,
        whatsapp:
          whatsappPhone.length >= 8
            ? `https://wa.me/${whatsappPhone}?text=${queryRefText}`
            : null,
      },
    },
    201,
  );
}