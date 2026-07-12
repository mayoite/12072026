"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowCounterClockwise, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

type RevisionEntry = {
  version: number;
  checksum: string;
  generatedAt: number | null;
  isCurrent: boolean;
};

type AuditEntry = {
  at: string;
  action: string;
  detail: Record<string, string | number | boolean | null>;
};

type Props = {
  readonly slug: string;
};

export function DescriptorRevisionPanel({ slug }: Props) {
  const [revisions, setRevisions] = useState<RevisionEntry[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyVersion, setBusyVersion] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await browserApiFetch(apiPath(`/api/admin/svg-editor/${slug}/revisions`));
      const payload = (await response.json()) as {
        revisions?: RevisionEntry[];
        audit?: AuditEntry[];
      };
      setRevisions(payload.revisions ?? []);
      setAudit(payload.audit ?? []);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  const rollback = useCallback(
    async (version: number) => {
      if (!window.confirm(`Roll back "${slug}" to revision v${version}?`)) return;
      setBusyVersion(version);
      setFeedback(null);
      try {
        const response = await browserApiFetch(apiPath(`/api/admin/svg-editor/${slug}/rollback`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ version }),
        });
        const payload = (await response.json()) as { success?: boolean; error?: string };
        if (!response.ok || payload.success === false) {
          setFeedback(payload.error ?? `Rollback failed (${response.status})`);
          return;
        }
        setFeedback(`Rolled back to v${version}. Refreshing…`);
        await load();
        window.location.reload();
      } catch (cause) {
        setFeedback(cause instanceof Error ? cause.message : String(cause));
      } finally {
        setBusyVersion(null);
      }
    },
    [load, slug],
  );

  return (
    <section className="admin-panel" aria-label="Revision history">
      <div className="admin-panel__header">Revision history</div>
      <div className="px-4 py-3">
        {loading ? (
          <p className="admin-page__meta" role="status">
            <Loader2 size={14} className="animate-spin" aria-hidden /> Loading revisions…
          </p>
        ) : revisions.length === 0 ? (
          <p className="admin-table__secondary">No versioned revisions on disk yet.</p>
        ) : (
          <ul className="admin-table__secondary space-y-2">
            {revisions.map((revision) => (
              <li key={revision.version} className="flex flex-wrap items-center gap-2">
                <span>
                  v{revision.version}
                  {revision.isCurrent ? " · current" : ""}
                </span>
                <code>{revision.checksum.slice(0, 12)}…</code>
                {!revision.isCurrent ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    onClick={() => void rollback(revision.version)}
                    disabled={busyVersion !== null}
                  >
                    {busyVersion === revision.version ? (
                      <Loader2 size={14} className="animate-spin" aria-hidden />
                    ) : (
                      <ArrowCounterClockwise size={14} aria-hidden />
                    )}
                    Roll back
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {feedback ? (
          <p className="admin-page__meta mt-3" role="status">
            {feedback}
          </p>
        ) : null}
        {audit.length > 0 ? (
          <div className="mt-4">
            <h3 className="admin-table__primary text-sm">Audit trail</h3>
            <ul className="admin-table__secondary space-y-1 mt-2">
              {audit.map((entry) => (
                <li key={`${entry.at}-${entry.action}`}>
                  <code>{entry.at}</code> · {entry.action}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}