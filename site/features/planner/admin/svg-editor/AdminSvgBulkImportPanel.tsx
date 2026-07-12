"use client";

import { useCallback, useState } from "react";
import { CircleNotch as Loader2, UploadSimple } from "@phosphor-icons/react";
import { apiPath, browserApiFetch } from "@/lib/api/browserApi";

const SAMPLE_CSV = `slug,sku,variant,width_mm,depth_mm,height_mm,lifecycle
import-demo-001,OFL-IMP-001,fixed,600,600,750,draft`;

export function AdminSvgBulkImportPanel() {
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runImport = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const response = await browserApiFetch(apiPath("/api/admin/svg-editor/bulk-import"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const payload = (await response.json()) as {
        success?: boolean;
        imported?: string[];
        errors?: Array<{ row: number; message: string }>;
        error?: string;
      };
      if (!response.ok || payload.success === false) {
        const detail =
          payload.errors?.map((row) => `Row ${row.row}: ${row.message}`).join(" · ") ??
          payload.error ??
          `Import failed (${response.status})`;
        setError(detail);
        return;
      }
      setMessage(`Imported ${payload.imported?.length ?? 0} descriptor(s). Reload to see the list.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }, [csv]);

  return (
    <section className="admin-panel" aria-label="Bulk CSV import">
      <div className="admin-panel__header">Bulk import (atomic)</div>
      <div className="px-4 py-3 flex flex-col gap-3">
        <p className="admin-table__secondary">
          CSV columns: slug, sku, variant, width_mm, depth_mm, height_mm, lifecycle (optional).
          One bad row rolls back the whole batch.
        </p>
        <textarea
          className="admin-input font-mono text-sm min-h-[120px]"
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          aria-label="Bulk import CSV"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={runImport}
            disabled={busy}
          >
            {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <UploadSimple size={14} aria-hidden />}
            Import batch
          </button>
          {message ? (
            <p className="admin-table__secondary" role="status">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="admin-table__secondary text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}