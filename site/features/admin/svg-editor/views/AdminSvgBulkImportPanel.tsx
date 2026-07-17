"use client";

import { useCallback, useState } from "react";
import { CircleNotch as Loader2, UploadSimple, Eye } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

const SAMPLE_CSV = `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
import-demo-001,OFL-IMP-001,fixed,600,600,750,draft`;

type BulkError = { row: number; message: string; field?: string };

type PreviewPayload = {
  success?: boolean;
  dryRun?: boolean;
  summary?: string;
  additions?: Array<{ slug: string; sku: string; csvRow?: number }>;
  rejects?: BulkError[];
  conflicts?: BulkError[];
  canApply?: boolean;
  error?: string;
};

type ApplyPayload = {
  success?: boolean;
  imported?: string[];
  provenance?: { source?: string; importedAt?: string; createdBy?: string };
  errors?: BulkError[];
  error?: string;
};

function formatErrors(errors: BulkError[] | undefined): string {
  if (!errors?.length) return "";
  return errors
    .map((row) => {
      const field = row.field ? ` field ${row.field}` : "";
      return `Row ${row.row}${field}: ${row.message}`;
    })
    .join(" · ");
}

export function AdminSvgBulkImportPanel() {
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [canApply, setCanApply] = useState(false);

  const postImport = useCallback(
    async (dryRun: boolean) => {
      setBusy(true);
      setMessage(null);
      setError(null);
      if (dryRun) setPreviewText(null);
      try {
        const response = await browserApiFetch(
          apiPath("/api/admin/svg-editor/bulk-import"),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ csv, dryRun }),
          },
        );
        const payload = (await response.json()) as PreviewPayload & ApplyPayload;

        if (dryRun) {
          if (!response.ok && payload.success === false) {
            const detail =
              formatErrors(payload.rejects ?? payload.errors) ||
              formatErrors(payload.conflicts) ||
              payload.error ||
              `Preview failed (${response.status})`;
            setError(detail);
            setCanApply(false);
            setPreviewText(payload.summary ?? null);
            return;
          }
          const lines: string[] = [];
          if (payload.summary) lines.push(payload.summary);
          if (payload.additions?.length) {
            lines.push(
              `Additions (${payload.additions.length}): ${payload.additions
                .map((a) => a.slug)
                .join(", ")}`,
            );
          }
          if (payload.conflicts?.length) {
            lines.push(`Conflicts: ${formatErrors(payload.conflicts)}`);
          }
          if (payload.rejects?.length) {
            lines.push(`Rejects: ${formatErrors(payload.rejects)}`);
          }
          setPreviewText(lines.join("\n") || "Empty preview.");
          setCanApply(payload.canApply === true);
          if (payload.canApply !== true) {
            setError(
              formatErrors([
                ...(payload.rejects ?? []),
                ...(payload.conflicts ?? []),
                ...(payload.errors ?? []),
              ]) || "Batch blocked — fix errors before apply.",
            );
          }
          return;
        }

        if (!response.ok || payload.success === false) {
          const detail =
            formatErrors(payload.errors) ||
            payload.error ||
            `Import failed (${response.status})`;
          setError(detail);
          setCanApply(false);
          return;
        }
        const prov = payload.provenance;
        const count = payload.imported?.length ?? 0;
        setMessage(
          `Imported ${count} product symbol${count === 1 ? "" : "s"}` +
            (prov?.importedAt
              ? ` · from ${prov.source ?? "bulk CSV"} at ${prov.importedAt}`
              : "") +
            ". Reload to see the list.",
        );
        setCanApply(false);
        setPreviewText(null);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));
        setCanApply(false);
      } finally {
        setBusy(false);
      }
    },
    [csv],
  );

  return (
    <section aria-label="Bulk CSV import" data-testid="admin-svg-bulk-import">
      <div className="admin-stack">
        <p className="admin-table__secondary">
          Paste a spreadsheet export (columns: product id, SKU, family, width,
          depth, height, lifecycle). Preview first. One invalid row blocks the
          whole batch so inventory stays consistent.
        </p>
        <textarea
          className="admin-field__control admin-field__control--multiline admin-field__control--mono"
          value={csv}
          onChange={(event) => {
            setCsv(event.target.value);
            setCanApply(false);
            setPreviewText(null);
          }}
          aria-label="Bulk import spreadsheet text"
          rows={5}
        />
        <div className="admin-actions-row">
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => void postImport(true)}
            disabled={busy}
            data-testid="admin-svg-bulk-import-preview"
          >
            {busy ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <Eye size={14} aria-hidden />
            )}
            Preview changes
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => void postImport(false)}
            disabled={busy || !canApply}
            data-testid="admin-svg-bulk-import-submit"
          >
            {busy ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <UploadSimple size={14} aria-hidden />
            )}
            Apply batch
          </button>
          {message ? (
            <p
              className="admin-table__secondary"
              role="status"
              data-testid="admin-svg-bulk-import-success"
            >
              {message}
            </p>
          ) : null}
          {error ? (
            <p
              className="admin-field__error"
              role="alert"
              data-testid="admin-svg-bulk-import-error"
            >
              {error}
            </p>
          ) : null}
        </div>
        {previewText ? (
          <pre
            className="admin-table__secondary admin-preformatted"
            data-testid="admin-svg-bulk-import-preview-result"
          >
            {previewText}
          </pre>
        ) : null}
      </div>
    </section>
  );
}
