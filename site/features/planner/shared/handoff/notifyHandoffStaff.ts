/**
 * Optional staff email for planner handoff via Resend.
 * Missing keys = skip notify (persist still succeeds).
 */

export type HandoffStaffNotifyInput = {
  referenceId: string;
  projectName: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  company?: string;
  totalItems: number;
  totalInr: number;
  pricingNote: string;
  linePreview: string;
};

export type HandoffStaffNotifyResult = {
  attempted: boolean;
  sent: boolean;
  reason?: string;
};

export async function notifyHandoffStaff(
  input: HandoffStaffNotifyInput,
): Promise<HandoffStaffNotifyResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const to = process.env.STAFF_NOTIFY_EMAIL?.trim() ?? "";
  const from = process.env.EMAIL_FROM?.trim() || "Oando Planner <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return {
      attempted: false,
      sent: false,
      reason: "email_not_configured",
    };
  }

  const subject = `[Planner BOQ] ${input.projectName} · ref ${input.referenceId}`;
  const text = [
    `New planner BOQ handoff.`,
    `Reference: ${input.referenceId}`,
    `Project: ${input.projectName}`,
    `Contact: ${input.contactName}`,
    input.company ? `Company: ${input.company}` : null,
    input.contactEmail ? `Email: ${input.contactEmail}` : null,
    input.contactPhone ? `Phone: ${input.contactPhone}` : null,
    `Items: ${input.totalItems}`,
    `Demo total (INR incl. GST): ${input.totalInr}`,
    `Pricing: ${input.pricingNote}`,
    "",
    "Lines:",
    input.linePreview,
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[handoff] Resend failed:", res.status, body.slice(0, 200));
      return { attempted: true, sent: false, reason: `resend_${res.status}` };
    }
    return { attempted: true, sent: true };
  } catch (err) {
    console.error("[handoff] Resend error:", err);
    return { attempted: true, sent: false, reason: "resend_error" };
  }
}
