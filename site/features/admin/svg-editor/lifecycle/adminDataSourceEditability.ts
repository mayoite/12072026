/**
 * ADM-STATE-02 — data-source editability is explicit before a write.
 * Pure labels for Admin SVG list/edit surfaces.
 */

export type AdminDataSourceKind =
  | "disk-block-descriptor"
  | "disk-published-svg"
  | "bulk-csv-import"
  | "price-book-file";

export type AdminDataSourceMode = "editable" | "read-only";

export type AdminDataSourceDeclaration = {
  readonly kind: AdminDataSourceKind;
  readonly mode: AdminDataSourceMode;
  /** Short operator-facing label. */
  readonly label: string;
  /** Why the mode is editable or read-only. */
  readonly reason: string;
};

export function declareSvgEditSources(input: {
  readonly catalogLifecycle: "live" | "draft" | "retired";
  readonly hasOnPublishAction: boolean;
}): readonly AdminDataSourceDeclaration[] {
  const writeBlocked = input.catalogLifecycle === "retired";
  return [
    {
      kind: "disk-block-descriptor",
      mode: writeBlocked ? "read-only" : "editable",
      label: "Block descriptor draft (disk)",
      reason: writeBlocked
        ? "Product is retired — restore to live before editing."
        : "Admin may edit identity, geometry, and studio draft on disk.",
    },
    {
      kind: "disk-published-svg",
      mode: writeBlocked || !input.hasOnPublishAction ? "read-only" : "editable",
      label: "Published SVG artifact (disk)",
      reason:
        writeBlocked
          ? "Retired products do not accept publish writes."
          : input.hasOnPublishAction
            ? "Publish replaces the released SVG on disk (live authority) only after confirmation."
            : "Publish action is not wired — artifact is view-only.",
    },
  ];
}

export function formatDataSourceBanner(
  sources: readonly AdminDataSourceDeclaration[],
): string {
  return sources
    .map((s) => `${s.label}: ${s.mode === "editable" ? "Editable" : "Read-only"} — ${s.reason}`)
    .join(" · ");
}
