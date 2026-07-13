"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleNotch as Loader2 } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";
import {
  describePriceBookVersion,
  displayPriceForSku,
  type PriceBookContract,
  type PriceBookVersionStatus,
} from "./priceBookContract";
import {
  buildPriceBookConfirmMessage,
  buildPriceBookReleaseImpactSummary,
  describePriceBookActionAvailability,
  formatPriceBookAuditLine,
  priceBookStatusLabel,
  type PriceBookAuditEntry,
  type PriceBookHighRiskAction,
} from "./priceBookGovernance";
import type { PriceBookRole } from "./priceBookService";

const DEFAULT_BOOK = "pb-linear-2026-q3";

type Props = {
  readonly initialBookId?: string;
  readonly initialContract?: PriceBookContract | null;
  readonly initialRole?: PriceBookRole;
  readonly initialHistory?: readonly PriceBookAuditEntry[];
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
  initialRole = "approver",
  initialHistory = [],
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
  const [role, setRole] = useState<PriceBookRole>(initialRole);
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState<readonly PriceBookAuditEntry[]>(
    initialHistory,
  );

  const load = useCallback(async () => {
    try {
      const response = await browserApiFetch(
        apiPath(`/api/admin/price-books/${bookId}`),
      );
      const payload = (await response.json()) as {
        contract?: PriceBookContract;
        history?: PriceBookAuditEntry[];
      };
      const next = payload.contract ?? null;
      setContract(next);
      setSelectedVersionId(
        next?.activeVersionId ?? next?.versions[0]?.versionId ?? null,
      );
      if (payload.history) setHistory(payload.history);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (initialContract === null) {
      void load();
    }
  }, [initialContract, load]);

  const version =
    contract?.versions.find((v) => v.versionId === selectedVersionId) ??
    contract?.versions[0] ??
    null;
  const versionMeta = version ? describePriceBookVersion(version) : null;

  const releaseImpact = useMemo(() => {
    if (!contract || !version) return null;
    return buildPriceBookReleaseImpactSummary({
      bookId: contract.bookId,
      versionId: version.versionId,
      currency: version.currency,
      effectiveFrom: version.effectiveFrom,
      ruleCount: version.rules.length,
      previousActiveVersionId: contract.activeVersionId,
    });
  }, [contract, version]);

  const approveAvail = version
    ? describePriceBookActionAvailability("approve", role, version.status)
    : null;
  const activateAvail = version
    ? describePriceBookActionAvailability("activate", role, version.status)
    : null;
  const rollbackAvail = version
    ? describePriceBookActionAvailability("rollback", role, version.status)
    : null;

  const runAction = useCallback(
    async (action: PriceBookHighRiskAction) => {
      if (!contract || !version) return;
      const confirmText = buildPriceBookConfirmMessage({
        action,
        role,
        bookId: contract.bookId,
        familySlug: contract.familySlug,
        versionId: version.versionId,
        versionStatus: version.status,
        currency: version.currency,
        effectiveFrom: version.effectiveFrom,
        activeVersionId: contract.activeVersionId,
        ruleCount: version.rules.length,
        reason,
      });
      if (!window.confirm(confirmText)) return;

      setBusy(`${action}:${version.versionId}`);
      setMessage(null);
      try {
        const response = await browserApiFetch(
          apiPath(`/api/admin/price-books/${bookId}/action`),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action,
              versionId: version.versionId,
              role,
              reason,
            }),
          },
        );
        const payload = (await response.json()) as {
          success?: boolean;
          contract?: PriceBookContract;
          history?: PriceBookAuditEntry[];
          error?: string;
        };
        if (!response.ok || payload.success === false) {
          setMessage(payload.error ?? `Action failed (${response.status})`);
          if (payload.history) setHistory(payload.history);
          return;
        }
        setContract(payload.contract ?? null);
        if (payload.history) setHistory(payload.history);
        setMessage(`${action} complete for ${version.versionId}`);
      } finally {
        setBusy(null);
      }
    },
    [bookId, contract, reason, role, version],
  );

  return (
    <div className="admin-page" data-testid="admin-price-book-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Catalog governance</p>
          <h1 className="admin-page__title">Price books</h1>
          <p className="admin-page__copy">
            Distinct commercial lifecycle states. High-risk approve, activate,
            and rollback require role, reason, version, impact, and confirmation.
            Server re-enforces roles; history records actor, action, and result.
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
              Active version: <code>{contract.activeVersionId ?? "—"}</code>
            </p>

            {/* ADM-PRICE-02 — all version lifecycle states listed */}
            <ul
              className="admin-page__meta space-y-1"
              data-testid="admin-price-book-lifecycle-list"
            >
              {contract.versions.map((entry) => (
                <li key={entry.versionId}>
                  <code>{entry.versionId}</code>{" "}
                  <span className={statusBadgeClass(entry.status)}>
                    {entry.status}
                  </span>{" "}
                  — {priceBookStatusLabel(entry.status)}
                </li>
              ))}
            </ul>

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

            <label className="admin-field">
              <span className="admin-field__label">Acting role</span>
              <select
                className="admin-field__control"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as PriceBookRole)
                }
                data-testid="admin-price-book-role"
                aria-label="Acting commercial role"
              >
                <option value="viewer">viewer</option>
                <option value="author">author</option>
                <option value="approver">approver</option>
              </select>
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Reason (required for confirm)</span>
              <input
                type="text"
                className="admin-field__control"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Why is this commercial change needed?"
                data-testid="admin-price-book-reason"
                aria-label="Reason for commercial action"
              />
            </label>

            {version && versionMeta && releaseImpact ? (
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
                  </span>{" "}
                  ({priceBookStatusLabel(versionMeta.status)})
                </p>

                {/* ADM-PUB-02 — exact versions + impact before confirm */}
                <p
                  className="admin-page__meta"
                  data-testid="admin-price-book-release-impact"
                  id="admin-price-book-release-impact"
                >
                  {releaseImpact}
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

                <div className="flex flex-wrap gap-2 items-start">
                  <div>
                    <button
                      type="button"
                      className="admin-btn admin-btn--outline"
                      disabled={
                        busy !== null || approveAvail?.allowed !== true
                      }
                      onClick={() => void runAction("approve")}
                      data-testid="admin-price-book-approve"
                      aria-describedby="admin-price-book-release-impact"
                    >
                      Approve draft
                    </button>
                    {approveAvail && !approveAvail.allowed ? (
                      <p
                        className="admin-table__secondary mt-1"
                        data-testid="admin-price-book-approve-unavailable"
                      >
                        {approveAvail.reason}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="admin-btn admin-btn--primary"
                      disabled={
                        busy !== null || activateAvail?.allowed !== true
                      }
                      onClick={() => void runAction("activate")}
                      data-testid="admin-price-book-activate"
                      aria-describedby="admin-price-book-release-impact"
                    >
                      Activate release
                    </button>
                    {activateAvail && !activateAvail.allowed ? (
                      <p
                        className="admin-table__secondary mt-1"
                        data-testid="admin-price-book-activate-unavailable"
                      >
                        {activateAvail.reason}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="admin-btn admin-btn--outline"
                      disabled={
                        busy !== null || rollbackAvail?.allowed !== true
                      }
                      onClick={() => void runAction("rollback")}
                      data-testid="admin-price-book-rollback"
                      aria-describedby="admin-price-book-release-impact"
                    >
                      Rollback
                    </button>
                    {rollbackAvail && !rollbackAvail.allowed ? (
                      <p
                        className="admin-table__secondary mt-1"
                        data-testid="admin-price-book-rollback-unavailable"
                      >
                        {rollbackAvail.reason}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}

            {message ? (
              <p className="admin-page__meta" role="status">
                {message}
              </p>
            ) : null}

            {/* ADM-AUDIT-01 */}
            <div data-testid="admin-price-book-history">
              <p className="admin-panel__header">Commercial history</p>
              {history.length === 0 ? (
                <p className="admin-page__meta">No audit events yet.</p>
              ) : (
                <ul className="admin-page__meta space-y-1">
                  {history.map((entry) => (
                    <li key={entry.id} data-testid={`admin-price-audit-${entry.id}`}>
                      {formatPriceBookAuditLine(entry)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
