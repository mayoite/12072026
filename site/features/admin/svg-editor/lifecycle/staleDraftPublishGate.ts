/**
 * DB-SVG-09 (disk path) — reject stale draft versions without data loss.
 * Compares client draft stamp to server baseline before publish.
 */

export type StaleDraftCheckInput = {
  /** Client-held baseline generatedAt (or revision) when draft was opened. */
  readonly clientBaselineGeneratedAt: number;
  /** Current on-disk / server baseline generatedAt. */
  readonly serverBaselineGeneratedAt: number;
  readonly slug: string;
};

export type StaleDraftCheckResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly code: "stale_draft";
      readonly error: string;
    };

/** Read DB-SVG-09 client stamp; returns NaN when absent so publish fails closed. */
export function readOpenedBaselineStamp(
  source: { readonly openedBaselineGeneratedAt?: number },
): number {
  const value = source.openedBaselineGeneratedAt;
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
}

/** Extract client stamp from a publish JSON body before descriptor parse/freeze. */
export function readOpenedBaselineFromPayload(payload: unknown): number {
  if (!payload || typeof payload !== "object") {
    return Number.NaN;
  }
  return readOpenedBaselineStamp(
    payload as { readonly openedBaselineGeneratedAt?: number },
  );
}

/**
 * If the server baseline moved since the client loaded the draft, refuse publish.
 * Does not mutate catalog data.
 */
export function assertDraftNotStale(
  input: StaleDraftCheckInput,
): StaleDraftCheckResult {
  if (
    !Number.isFinite(input.clientBaselineGeneratedAt) ||
    !Number.isFinite(input.serverBaselineGeneratedAt)
  ) {
    return {
      ok: false,
      code: "stale_draft",
      error: `Publish blocked for “${input.slug}”: missing baseline stamps (reload the editor).`,
    };
  }
  if (input.clientBaselineGeneratedAt !== input.serverBaselineGeneratedAt) {
    return {
      ok: false,
      code: "stale_draft",
      error: `Publish blocked for “${input.slug}”: the published baseline changed since you opened this draft. Reload to avoid data loss; your local draft was not written.`,
    };
  }
  return { ok: true };
}
