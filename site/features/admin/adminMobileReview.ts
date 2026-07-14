/**
 * ADM-MOB-01..03 — phone Admin review declarations (no new CSS theme tree).
 * Pure copy + breakpoints for existing admin media queries.
 */

/** Matches admin-svg-engine.css max-width: 60rem phone/tablet stack. */
export const ADMIN_PHONE_MAX_WIDTH_REM = 60;

export type AdminPhoneCapability =
  | "list-review"
  | "price-book-review"
  | "svg-authoring"
  | "bulk-import";

export type AdminPhoneCapabilityStatus = {
  readonly capability: AdminPhoneCapability;
  readonly supported: boolean;
  readonly declaration: string;
};

export function adminPhoneCapabilities(): readonly AdminPhoneCapabilityStatus[] {
  return [
    {
      capability: "list-review",
      supported: true,
      declaration:
        "Phone review: inventory uses stacked cards / priority columns (no page-level horizontal scroll).",
    },
    {
      capability: "price-book-review",
      supported: true,
      declaration: "Phone review: price books remain readable in stacked panels.",
    },
    {
      capability: "svg-authoring",
      supported: false,
      declaration:
        "SVG studio authoring is unsupported on phone. Use a desktop or tablet ≥ 60rem width.",
    },
    {
      capability: "bulk-import",
      supported: false,
      declaration:
        "Bulk CSV import is unsupported on phone. Use desktop Admin.",
    },
  ];
}

export function phoneAuthoringBlockedMessage(): string {
  return (
    adminPhoneCapabilities().find((c) => c.capability === "svg-authoring")
      ?.declaration ?? "Authoring unsupported on phone."
  );
}

export function phoneListLayoutMode(): "cards-priority" {
  return "cards-priority";
}
