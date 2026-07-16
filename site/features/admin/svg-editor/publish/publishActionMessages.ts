/**
 * ADM-SVG-15 / 16 / 17 — primary publish naming, failure honesty, success links.
 * Pure strings only. Operator language (no schema/pipeline jargon).
 */

export type PublishImpactInput = {
  readonly targetSlug: string;
  readonly draftSchemaVersion: string;
  readonly liveArtifactState: string;
  readonly liveRevisionShort: string | null;
};

function releasedStatePhrase(state: string): string {
  switch (state) {
    case "published":
      return "released";
    case "missing":
      return "not released yet";
    case "invalid":
      return "released but invalid";
    default:
      return state;
  }
}

export function publishImpactSummary(input: PublishImpactInput): string {
  const liveRev = input.liveRevisionShort
    ? `current revision ${input.liveRevisionShort}`
    : "no released revision yet";
  return [
    `Publish target: ${input.targetSlug}.`,
    `Draft version ${input.draftSchemaVersion}.`,
    `Released symbol: ${releasedStatePhrase(input.liveArtifactState)} (${liveRev}).`,
    "Primary Publish replaces the released Planner symbol. Previous revisions remain available for rollback.",
  ].join(" ");
}

export function publishConfirmMessage(input: PublishImpactInput): string {
  return [
    `Publish “${input.targetSlug}”?`,
    "",
    `Target product: ${input.targetSlug}`,
    `Draft version: ${input.draftSchemaVersion}`,
    `Released symbol: ${releasedStatePhrase(input.liveArtifactState)}${input.liveRevisionShort ? ` · ${input.liveRevisionShort}` : ""}`,
    "",
    "Impact: the current released Planner symbol is replaced. Previous revisions stay available for rollback.",
    "If publish fails, the previous released symbol is not replaced.",
  ].join("\n");
}

export function publishFailureMessage(
  productSlug: string,
  error: string,
): string {
  return `Publish failed for “${productSlug}”: ${error}. The previous released symbol was not replaced.`;
}

export function publishSuccessMessage(
  productSlug: string,
  whenLabel: string,
): string {
  return `Published “${productSlug}” at ${whenLabel}. Use the links below to open the released SVG or verify it in Planner.`;
}

export function releasedSvgHref(productSlug: string): string {
  return `/svg-catalog/${productSlug}.svg`;
}

export const PLANNER_VERIFY_HREF = "/planner/guest";
