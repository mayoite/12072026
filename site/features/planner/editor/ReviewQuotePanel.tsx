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

type ReviewQuotePanelProps = {
  validation: ValidationResult;
  furnitureCount: number;
  workstationSeats: number;
  pricingNote: string;
  guestMode: boolean;
  handoffBusy: boolean;
  lastHandoffReference?: string | null;
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

export function ReviewQuotePanel({
  validation,
  furnitureCount,
  workstationSeats,
  pricingNote,
  guestMode,
  handoffBusy,
  lastHandoffReference,
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
        <dl className={styles.metrics}>
          <div>
            <dt>Furniture</dt>
            <dd>{furnitureCount}</dd>
          </div>
          <div>
            <dt>Workstation seats</dt>
            <dd>{workstationSeats}</dd>
          </div>
          <div>
            <dt>Checks</dt>
            <dd>
              {validation.issues.length === 0
                ? "Clear"
                : `${validation.issues.length} issue${validation.issues.length === 1 ? "" : "s"}`}
            </dd>
          </div>
        </dl>

        <ValidationPanel result={validation} onFocusIssue={onFocusIssue} />

        <p className={styles.pricingNote} role="note">
          {pricingNote}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryAction}
            disabled={!canExportBoq}
            onClick={onDownloadBoqCsv}
          >
            Download BOQ CSV
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            disabled={!canExportBoq}
            onClick={onDownloadBoqPdf}
          >
            Download branded BOQ PDF
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
