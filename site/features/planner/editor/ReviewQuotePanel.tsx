"use client";

import { useId, useState } from "react";

import type { ValidationResult } from "@/features/planner/lib/validation/runValidation";
import type { ValidationIssue } from "@/features/planner/lib/validation/types";
import { ValidationPanel } from "./ValidationPanel";

import styles from "./review-quote-panel.module.css";

export type HandoffContactDraft = {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
};

/** Explicit demo-pricing confirmation from the Review checkbox (required for handoff). */
export type HandoffSendOptions = {
  confirmDemoPricing: true;
};

/** Compact BOQ preview line for the Review panel (no invented prices). */
export type ReviewBoqLinePreview = {
  name: string;
  quantity: number;
  /** Honesty label only — e.g. "demo list" or "unpriced". */
  unitNote: string;
};

const DEFAULT_PRICING_MODE = "demo-list-partial";
const MAX_PREVIEW_LINES = 8;

type ReviewQuotePanelProps = {
  validation: ValidationResult;
  furnitureCount: number;
  workstationSeats: number;
  pricingNote: string;
  guestMode: boolean;
  handoffBusy: boolean;
  lastHandoffReference?: string | null;
  /**
   * Commercial pricing mode label. Defaults to demo-list-partial
   * (current authority until live pricing exists).
   */
  pricingMode?: string;
  /** Count of furniture items without a unit price. Defaults to 0. */
  unpricedItemCount?: number;
  /**
   * Optional BOQ line previews from the host. Empty by default so the panel
   * stays self-contained; host may pass later without required wiring.
   */
  boqLines?: readonly ReviewBoqLinePreview[];
  onDownloadBoqCsv: () => void;
  onDownloadBoqPdf: () => void;
  onAddAllToQuote: () => void;
  onSendToOando: (
    contact: HandoffContactDraft,
    options: HandoffSendOptions,
  ) => void | Promise<void>;
  onFocusIssue?: (issue: ValidationIssue) => void;
};

const emptyContact: HandoffContactDraft = {
  name: "",
  company: "",
  email: "",
  phone: "",
  notes: "",
};

function formatPricingModeLabel(mode: string): string {
  const normalized = mode.trim().toLowerCase();
  if (
    normalized === "demo" ||
    normalized === "demo-list" ||
    normalized === "demo-list-partial" ||
    normalized.startsWith("demo")
  ) {
    return "Demo list";
  }
  return mode.trim() || "Demo list";
}

export function ReviewQuotePanel({
  validation,
  furnitureCount,
  workstationSeats,
  pricingNote,
  guestMode,
  handoffBusy,
  lastHandoffReference,
  pricingMode = DEFAULT_PRICING_MODE,
  unpricedItemCount = 0,
  boqLines = [],
  onDownloadBoqCsv,
  onDownloadBoqPdf,
  onAddAllToQuote,
  onSendToOando,
  onFocusIssue,
}: ReviewQuotePanelProps) {
  const formId = useId();
  const [contact, setContact] = useState<HandoffContactDraft>(emptyContact);
  const [confirmDemoPricing, setConfirmDemoPricing] = useState(false);

  const hasBlockingErrors = validation.errors > 0;
  const hasFurniture = furnitureCount > 0;
  const canExportBoq = hasFurniture && !hasBlockingErrors;
  const canSend =
    canExportBoq &&
    !guestMode &&
    !handoffBusy &&
    confirmDemoPricing &&
    contact.name.trim().length > 0 &&
    (contact.email.trim().length > 0 || contact.phone.trim().length > 0);

  const pricingModeLabel = formatPricingModeLabel(pricingMode);
  const previewLines = boqLines.slice(0, MAX_PREVIEW_LINES);
  const hiddenLineCount = Math.max(0, boqLines.length - previewLines.length);
  const showUnpricedNote = unpricedItemCount > 0;

  return (
    <section className={styles.panel} aria-label="Review and quote">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Step 3 · Commercial handoff</p>
          <h2 className={styles.title}>Review &amp; quote</h2>
          <p className={styles.commercialLead} data-testid="review-quote-lead">
            {guestMode
              ? "Download a branded BOQ for this browser draft. Sign in to send it to Oando."
              : "Validate the plan, download a branded BOQ, or send it to Oando."}
          </p>
        </div>
        <span className={hasBlockingErrors ? styles.blocked : styles.ready}>
          {hasBlockingErrors
            ? `${validation.errors} error${validation.errors === 1 ? "" : "s"}`
            : hasFurniture
              ? "Ready to quote"
              : "Add furniture"}
        </span>
      </header>

      <div className={styles.content}>
        <dl className={styles.metrics} data-testid="review-quote-summary">
          <div>
            <dt>Furniture</dt>
            <dd data-testid="review-furniture-count">{furnitureCount}</dd>
          </div>
          <div>
            <dt>Workstation seats</dt>
            <dd data-testid="review-seat-count">{workstationSeats}</dd>
          </div>
          <div>
            <dt>Pricing mode</dt>
            <dd data-testid="review-pricing-mode">{pricingModeLabel}</dd>
          </div>
        </dl>

        {showUnpricedNote ? (
          <p
            className={styles.unpricedNote}
            role="status"
            data-testid="review-unpriced-note"
          >
            {unpricedItemCount} item{unpricedItemCount === 1 ? "" : "s"} unpriced
            — quantity and footprint only (no fabricated prices).
          </p>
        ) : null}

        {previewLines.length > 0 ? (
          <div className={styles.boqPreview} data-testid="review-boq-lines">
            <h3 className={styles.boqPreviewTitle}>BOQ preview</h3>
            <ul className={styles.boqLineList}>
              {previewLines.map((line, index) => (
                <li
                  key={`${line.name}-${line.quantity}-${line.unitNote}-${index}`}
                  className={styles.boqLine}
                >
                  <span className={styles.boqLineName}>{line.name}</span>
                  <span className={styles.boqLineMeta}>
                    ×{line.quantity}
                    <span className={styles.boqLineNote} aria-label="Unit note">
                      {line.unitNote}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {hiddenLineCount > 0 ? (
              <p className={styles.boqMore} data-testid="review-boq-more">
                +{hiddenLineCount} more line{hiddenLineCount === 1 ? "" : "s"} in
                full BOQ export
              </p>
            ) : null}
          </div>
        ) : null}

        <ValidationPanel result={validation} onFocusIssue={onFocusIssue} />

        <p className={styles.pricingNote} role="note">
          {pricingNote}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryAction}
            disabled={!canExportBoq}
            onClick={onDownloadBoqPdf}
            data-testid="review-download-pdf"
          >
            Download branded BOQ PDF
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            disabled={!canExportBoq}
            onClick={onDownloadBoqCsv}
            data-testid="review-download-csv"
          >
            Download BOQ CSV
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            disabled={!canExportBoq}
            onClick={onAddAllToQuote}
          >
            Add all furniture to quote cart
          </button>
        </div>

        <fieldset className={styles.handoffFieldset} disabled={guestMode || handoffBusy}>
          <legend className={styles.handoffLegend}>Send BOQ to Oando</legend>
          {guestMode ? (
            <p className={styles.hint}>
              Sign in as a member to send this BOQ to Oando. Guests can still download the BOQ.
            </p>
          ) : (
            <>
              <label className={styles.field} htmlFor={`${formId}-name`}>
                <span>Contact name</span>
                <input
                  id={`${formId}-name`}
                  name="handoff-name"
                  autoComplete="name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                />
              </label>
              <label className={styles.field} htmlFor={`${formId}-company`}>
                <span>Company (optional)</span>
                <input
                  id={`${formId}-company`}
                  name="handoff-company"
                  autoComplete="organization"
                  value={contact.company}
                  onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                />
              </label>
              <label className={styles.field} htmlFor={`${formId}-email`}>
                <span>Email</span>
                <input
                  id={`${formId}-email`}
                  name="handoff-email"
                  type="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                />
              </label>
              <label className={styles.field} htmlFor={`${formId}-phone`}>
                <span>Phone</span>
                <input
                  id={`${formId}-phone`}
                  name="handoff-phone"
                  type="tel"
                  autoComplete="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                />
              </label>
              <label className={styles.field} htmlFor={`${formId}-notes`}>
                <span>Notes (optional)</span>
                <textarea
                  id={`${formId}-notes`}
                  name="handoff-notes"
                  rows={2}
                  value={contact.notes}
                  onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                />
              </label>
              <label className={styles.checkLabel} htmlFor={`${formId}-confirm`}>
                <input
                  id={`${formId}-confirm`}
                  type="checkbox"
                  checked={confirmDemoPricing}
                  onChange={(e) => setConfirmDemoPricing(e.target.checked)}
                />
                <span>
                  I understand unit prices are demo list figures, not approved commercial quotes.
                </span>
              </label>
              <button
                type="button"
                className={styles.sendAction}
                disabled={!canSend}
                onClick={() => {
                  // canSend already requires confirmDemoPricing; pass the flag so
                  // the workspace never invents confirmation for the API.
                  if (!confirmDemoPricing) return;
                  void onSendToOando(contact, { confirmDemoPricing: true });
                }}
                aria-busy={handoffBusy}
              >
                {handoffBusy ? "Sending…" : "Send to Oando"}
              </button>
              {lastHandoffReference ? (
                <p className={styles.reference} role="status">
                  Last reference: {lastHandoffReference}
                </p>
              ) : null}
            </>
          )}
        </fieldset>

        {hasBlockingErrors ? (
          <p className={styles.hint}>
            Resolve validation errors before downloading the BOQ or sending to Oando.
          </p>
        ) : !hasFurniture ? (
          <p className={styles.hint}>Place furniture to build a BOQ.</p>
        ) : null}
      </div>
    </section>
  );
}
