/**
 * Pure copy + facts for parametric publish consequence confirm.
 * No React; form unit tests assert this without mounting the dialog.
 */

export type LinearDeskPublishConfirmFacts = {
  readonly name: string;
  readonly sku: string;
  readonly slug: string;
  /** e.g. "1600×800 mm" */
  readonly footprintMm: string;
};

export type LinearDeskPublishConfirmCopy = {
  readonly title: string;
  readonly guestNote: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly name: string;
  readonly sku: string;
  readonly slug: string;
  readonly footprintMm: string;
};

const FALLBACK = "—";

function displayOrDash(value: string): string {
  const t = value.trim();
  return t.length > 0 ? t : FALLBACK;
}

/** Build operator-facing confirm copy from validated form facts. */
export function buildLinearDeskPublishConfirmCopy(
  facts: LinearDeskPublishConfirmFacts,
): LinearDeskPublishConfirmCopy {
  return {
    title: "Publish for guests?",
    guestNote:
      "After publish, guests can place this symbol on the Planner canvas. The prior live symbol is kept if publish fails.",
    confirmLabel: "Publish for guests",
    cancelLabel: "Cancel",
    name: displayOrDash(facts.name),
    sku: displayOrDash(facts.sku),
    slug: displayOrDash(facts.slug),
    footprintMm: displayOrDash(facts.footprintMm),
  };
}

/** Status-band label after a successful publish (not stuck on Draft). */
export function linearDeskPublishedStatusLabel(): string {
  return "Published · live for guests";
}

/** Status-band label while editing / not yet released this session. */
export function linearDeskDraftStatusLabel(): string {
  return "Draft";
}
