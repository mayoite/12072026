"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import type { PriceBookContract } from "./priceBookContract";

const DEFAULT_BOOK = "pb-linear-2026-q3";

type Props = {
  readonly initialBookId?: string;
  readonly initialContract?: PriceBookContract | null;
};

export function AdminPriceBookPageView({
  initialBookId = DEFAULT_BOOK,
  initialContract = null,
}: Props) {
  const [bookId] = useState(initialBookId);
  const [contract, setContract] = useState<PriceBookContract | null>(initialContract);
  const [loading, setLoading] = useState(initialContract === null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await browserApiFetch(apiPath(`/api/admin/price-books/${bookId}`));
      const payload = (await response.json()) as { contract?: PriceBookContract };
      setContract(payload.contract ?? null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (initialContract === null) {
      void load();
    }
  }, [initialContract, load]);

  const runAction = useCallback(
    async (action: "approve" | "activate" | "rollback", versionId: string, role: "author" | "approver") => {
      setBusy(`${action}:${versionId}`);
      setMessage(null);
      try {
        const response = await browserApiFetch(apiPath(`/api/admin/price-books/${bookId}/action`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, versionId, role }),
        });
        const payload = (await response.json()) as {
          success?: boolean;
          contract?: PriceBookContract;
          error?: string;
        };
        if (!response.ok || payload.success === false) {
          setMessage(payload.error ?? `Action failed (${response.status})`);
          return;
        }
        setContract(payload.contract ?? null);
        setMessage(`${action} complete for ${versionId}`);
      } finally {
        setBusy(null);
      }
    },
    [bookId],
  );

  const version = contract?.versions[0];

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog governance</p>
          <h1 className="admin-page__title">Price books</h1>
          <p className="admin-page__copy">
            Draft → approve → activate. Rollback leaves prior versions on disk; quotes pin their
            original version.
          </p>
        </div>
      </header>

      {loading ? (
        <p className="admin-page__meta" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden /> Loading…
        </p>
      ) : null}

      {contract && version ? (
        <div className="admin-panel">
          <div className="admin-panel__header">
            <code>{contract.bookId}</code> · {contract.familySlug}
          </div>
          <div className="px-4 py-3 space-y-3">
            <p className="admin-page__meta">
              Active version: <code>{contract.activeVersionId ?? "—"}</code> · current row{" "}
              <span className="admin-badge admin-badge--warn">{version.status}</span>
            </p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Unit (minor)</th>
                  <th>Adj bps</th>
                </tr>
              </thead>
              <tbody>
                {version.rules.map((rule) => (
                  <tr key={rule.sku}>
                    <td><code>{rule.sku}</code></td>
                    <td>{rule.unitPriceMinor}</td>
                    <td>{rule.adjustmentBps ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={busy !== null || version.status !== "draft"}
                onClick={() => void runAction("approve", version.versionId, "author")}
              >
                Approve draft
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={busy !== null || (version.status !== "approved" && version.status !== "draft")}
                onClick={() => void runAction("activate", version.versionId, "approver")}
              >
                Activate
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                disabled={busy !== null || version.status !== "active"}
                onClick={() => void runAction("rollback", version.versionId, "approver")}
              >
                Rollback
              </button>
            </div>
            {message ? (
              <p className="admin-page__meta" role="status">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
