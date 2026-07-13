"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import {
  describePriceBookVersion,
  displayPriceForSku,
  type PriceBookContract,
  type PriceBookVersionStatus,
} from "./priceBookContract";

const DEFAULT_BOOK = "pb-linear-2026-q3";

type Props = {
  readonly initialBookId?: string;
  readonly initialContract?: PriceBookContract | null;
};

function statusBadgeClass(status: PriceBookVersionStatus): string {
  switch (status) {
    case "active":
      return "admin-badge admin-badge--active";
    case "approved":
      return "admin-badge admin-badge--active";
    case "draft":
      return "admin-badge admin-badge--warn";
    case "retired":
    case "rolled_back":
      return "admin-badge admin-badge--hidden";
  }
}

export function AdminPriceBookPageView({
  initialBookId = DEFAULT_BOOK,
  initialContract = null,
}: Props) {
  const [bookId] = useState(initialBookId);
  const [contract, setContract] = useState<PriceBookContract | null>(
    initialContract,
  );
  const [loading, setLoading] = useState(initialContract === null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    initialContract?.versions[0]?.versionId ?? null,
  );

  const load = useCallback(async () => {
    try {
      const response = await browserApiFetch(
        apiPath(`/api/admin/price-books/${bookId}`),
      );
      const payload = (await response.json()) as {
        contract?: PriceBookContract;
      };
      const next = payload.contract ?? null;
      setContract(next);
      setSelectedVersionId(
        next?.activeVersionId ?? next?.versions[0]?.versionId ?? null,
      );
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
    async (
      action: "approve" | "activate" | "rollback",
      versionId: string,
      role: "author" | "approver",
    ) => {
      setBusy(`${action}:${versionId}`);
      setMessage(null);
      try {
        const response = await browserApiFetch(
          apiPath(`/api/admin/price-books/${bookId}/action`),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, versionId, role }),
          },
        );
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

  const version =
    contract?.versions.find((v) => v.versionId === selectedVersionId) ??
    contract?.versions[0] ??
    null;
  const versionMeta = version ? describePriceBookVersion(version) : null;

  return (
    <div className="admin-page" data-testid="admin-price-book-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog governance</p>
          <h1 className="admin-page__title">Price books</h1>
          <p className="admin-page__copy">
            Versioned commercial rates. Each version keeps an immutable ID,
            currency, and effective dates. Operator prices show as currency;
            missing rules show as unavailable — never zero.
          </p>
        </div>
      </header>

      {loading ? (
        <p className="admin-page__meta" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden /> Loading…
        </p>
      ) : null}

      {contract ? (
        <div className="admin-panel" data-testid="admin-price-book-panel">
          <div className="admin-panel__header">
            <code data-testid="admin-price-book-id">{contract.bookId}</code> ·{" "}
            {contract.familySlug}
          </div>
          <div className="px-4 py-3 space-y-3">
            <p className="admin-page__meta" data-testid="admin-price-book-active">
              Active version:{" "}
              <code>{contract.activeVersionId ?? "—"}</code>
            </p>

            <label className="admin-field">
              <span className="admin-field__label">Version</span>
              <select
                className="admin-field__control"
                value={version?.versionId ?? ""}
                onChange={(event) => setSelectedVersionId(event.target.value)}
                data-testid="admin-price-book-version-select"
                aria-label="Select price book version"
              >
                {contract.versions.map((entry) => (
                  <option key={entry.versionId} value={entry.versionId}>
                    {entry.versionId} · {entry.status} · {entry.currency}
                  </option>
                ))}
              </select>
            </label>

            {version && versionMeta ? (
              <>
                <p
                  className="admin-page__meta"
                  data-testid="admin-price-book-version-meta"
                >
                  Version ID: <code>{versionMeta.versionId}</code>
                  {" · "}
                  Currency: <strong>{versionMeta.currency}</strong>
                  {" · "}
                  Effective from: <code>{versionMeta.effectiveFrom}</code>
                  {versionMeta.effectiveTo ? (
                    <>
                      {" · "}
                      Effective to: <code>{versionMeta.effectiveTo}</code>
                    </>
                  ) : (
                    <> · Effective to: open</>
                  )}
                  {" · "}
                  Status:{" "}
                  <span className={statusBadgeClass(versionMeta.status)}>
                    {versionMeta.status}
                  </span>
                </p>

                <table
                  className="admin-table"
                  data-testid="admin-price-book-rules"
                >
                  <caption className="sr-only">
                    Price rules with currency amounts and technical minor units
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">SKU</th>
                      <th scope="col">Price</th>
                      <th scope="col">Technical (minor)</th>
                      <th scope="col">Adj bps</th>
                      <th scope="col">UoM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {version.rules.map((rule) => {
                      const display = displayPriceForSku(
                        contract,
                        version.versionId,
                        rule.sku,
                      );
                      return (
                        <tr key={rule.sku} data-sku={rule.sku}>
                          <td>
                            <code>{rule.sku}</code>
                          </td>
                          <td>
                            <span
                              className="admin-table__primary"
                              data-testid={`admin-price-primary-${rule.sku}`}
                            >
                              {display.primary}
                            </span>
                          </td>
                          <td>
                            <span
                              className="admin-table__secondary"
                              data-testid={`admin-price-secondary-${rule.sku}`}
                            >
                              {display.secondary ?? "—"}
                            </span>
                          </td>
                          <td>{rule.adjustmentBps ?? 0}</td>
                          <td>{rule.uom}</td>
                        </tr>
                      );
                    })}
                    {/* Demonstrate missing-SKU display contract for operators */}
                    <tr data-sku="__missing_demo__">
                      <td>
                        <code className="text-muted">UNKNOWN-SKU</code>
                      </td>
                      <td>
                        <span
                          className="admin-table__primary"
                          data-testid="admin-price-primary-missing"
                        >
                          {
                            displayPriceForSku(
                              contract,
                              version.versionId,
                              "UNKNOWN-SKU",
                            ).primary
                          }
                        </span>
                      </td>
                      <td>
                        <span className="admin-table__secondary">—</span>
                      </td>
                      <td>—</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    disabled={busy !== null || version.status !== "draft"}
                    onClick={() =>
                      void runAction("approve", version.versionId, "author")
                    }
                  >
                    Approve draft
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    disabled={
                      busy !== null ||
                      (version.status !== "approved" &&
                        version.status !== "draft")
                    }
                    onClick={() =>
                      void runAction("activate", version.versionId, "approver")
                    }
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    disabled={busy !== null || version.status !== "active"}
                    onClick={() =>
                      void runAction("rollback", version.versionId, "approver")
                    }
                  >
                    Rollback
                  </button>
                </div>
              </>
            ) : null}

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
