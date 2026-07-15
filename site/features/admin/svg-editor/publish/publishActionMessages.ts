/**
 * ADM-SVG-15 / 16 / 17 — primary publish naming, failure honesty, success links.
 * Pure strings only.
 */

export type PublishImpactInput = {
  readonly targetSlug: string;
  readonly draftSchemaVersion: string;
  readonly liveArtifactState: string;
  readonly liveRevisionShort: string | null;
};

export function publishImpactSummary(input: PublishImpactInput): string {
  const liveRev = input.liveRevisionShort
    ? `live revision ${input.liveRevisionShort}`
    : "no live revision hash yet";
  return [
    `Publish target: ${input.targetSlug}.`,
    `Draft schema ${input.draftSchemaVersion}.`,
    `Live artifact: ${input.liveArtifactState} (${liveRev}).`,
    "Primary Publish replaces the released SVG; Previous revisions remain available for rollback.",
  ].join(" ");
}

export function publishConfirmMessage(input: PublishImpactInput): string {
  return [
    `Publish “${input.targetSlug}”?`,
    "",
    `Target product: ${input.targetSlug}`,
    `Draft schema version: ${input.draftSchemaVersion}`,
    `Live artifact: ${input.liveArtifactState}${input.liveRevisionShort ? ` · ${input.liveRevisionShort}` : ""}`,
    "",
    "Impact: the current released SVG artifact is replaced. Previous revisions stay available for rollback.",
  ].join("\n");
}

export function publishFailureMessage(
  productSlug: string,
  error: string,
): string {
  return `Publish failed for “${productSlug}”: ${error}. The previous live artifact was not replaced.`;
}

export function publishSuccessMessage(
  productSlug: string,
  whenLabel: string,
): string {
  return `Published “${productSlug}” at ${whenLabel}. Released SVG and Planner verification links are available below.`;
}

export function releasedSvgHref(productSlug: string): string {
  return `/svg-catalog/${productSlug}.svg`;
}

export const PLANNER_VERIFY_HREF = "/planner/guest";
