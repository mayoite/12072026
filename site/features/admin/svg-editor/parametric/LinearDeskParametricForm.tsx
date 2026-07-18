"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState, useTransition } from "react";
import { ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";

import {
  convertLinearDeskFormUnit,
  defaultLinearDeskForm,
  formToLinearDeskRaw,
  parseLinearDeskForm,
  syncIdentityAfterWidthChange,
  type LinearDeskFormDisplay,
} from "./linearDeskFormModel";
import { formatLinearDeskPublishSuccess } from "./linearDeskGuestIdentity";
import {
  buildLinearDeskPublishConfirmCopy,
  linearDeskDraftStatusLabel,
  linearDeskPublishedStatusLabel,
} from "./linearDeskPublishConfirm";
import { LinearDeskPublishConfirmDialog } from "./LinearDeskPublishConfirmDialog";
/** K1: Maker-only pen (drawLinearDesk → compileMakerRecipeToPaths). */
import { renderLinearDeskSvg } from "@/features/planner/asset-engine/svg/parametric";
import { publishLinearDeskAction } from "./publishLinearDeskAction";
/** Tool rail = planner only — same component + locked chrome CSS. */
import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import type { PlannerTool } from "@/features/planner/editor/canvasTool";

type Props = {
  readonly initialUnit?: "mm" | "cm";
};

type PublishRelease = {
  readonly slug: string;
  readonly sku: string;
};

type FeedbackKind = "info" | "success" | "error";

/**
 * Parametric linear-desk authoring — LOCKED mix 32 + 35 + 37.
 * 32: CAD dual-pane craft + planner tool rail on plan
 * 35: plan left (dominant) + form right
 * 37: status strip under top bar + summary chips (no third dock)
 * Tool rail = planner CanvasToolRail only.
 * Spec: docs/superpowers/specs/2026-07-18-parametric-cad-dual-pane-design.md
 */
export function LinearDeskParametricForm({ initialUnit = "cm" }: Props) {
  const [form, setForm] = useState<LinearDeskFormDisplay>(() =>
    defaultLinearDeskForm(initialUnit),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("info");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishedRelease, setPublishedRelease] =
    useState<PublishRelease | null>(null);
  const [pending, startTransition] = useTransition();
  /** Same rail state surface as planner; plan preview is read-only. */
  const [activeTool, setActiveTool] = useState<PlannerTool>("select");
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [orthogonalLock, setOrthogonalLock] = useState(false);

  const clearPublishedOnEdit = useCallback(() => {
    setPublishedRelease(null);
  }, []);

  const parsed = useMemo(() => parseLinearDeskForm(form), [form]);
  const errorsByPath = useMemo(() => {
    const map = new Map<string, string>();
    if (!parsed.ok) {
      for (const e of parsed.errors) map.set(e.path, e.message);
    }
    return map;
  }, [parsed]);

  const previewSvg = useMemo(() => {
    if (!parsed.ok) return null;
    return renderLinearDeskSvg(parsed.fields);
  }, [parsed]);

  const setNumber = useCallback(
    (key: keyof LinearDeskFormDisplay, value: string) => {
      const n = Number(value);
      clearPublishedOnEdit();
      setForm((prev) => {
        if (!Number.isFinite(n)) return prev;
        const next = { ...prev, [key]: n };
        return key === "width" ? syncIdentityAfterWidthChange(next) : next;
      });
    },
    [clearPublishedOnEdit],
  );

  const onUnit = useCallback(
    (unit: "mm" | "cm") => {
      clearPublishedOnEdit();
      setForm((prev) => convertLinearDeskFormUnit(prev, unit));
    },
    [clearPublishedOnEdit],
  );

  const footprintLabel = parsed.ok
    ? `${parsed.fields.widthMm}×${parsed.fields.depthMm} mm`
    : "—";
  const displaySlug = form.slug.trim() || "oando-…";
  const unit = form.displayUnit;

  const confirmCopy = useMemo(() => {
    if (!parsed.ok) return null;
    return buildLinearDeskPublishConfirmCopy({
      name: form.name,
      sku: form.sku,
      slug: form.slug,
      footprintMm: footprintLabel,
    });
  }, [parsed, form.name, form.sku, form.slug, footprintLabel]);

  const onRequestPublish = useCallback(() => {
    setMessage(null);
    setFeedbackKind("info");
    if (!parsed.ok) {
      setMessage("Fix the highlighted fields, then publish.");
      setFeedbackKind("error");
      return;
    }
    setConfirmOpen(true);
  }, [parsed]);

  const onCancelConfirm = useCallback(() => {
    if (pending) return;
    setConfirmOpen(false);
  }, [pending]);

  const onConfirmPublish = useCallback(() => {
    if (!parsed.ok) {
      setConfirmOpen(false);
      setMessage("Fix the highlighted fields, then publish.");
      setFeedbackKind("error");
      return;
    }
    startTransition(async () => {
      const result = await publishLinearDeskAction(formToLinearDeskRaw(form));
      if (result.success) {
        const slug = result.descriptor.slug;
        const sku =
          typeof result.descriptor.sku === "string"
            ? result.descriptor.sku
            : form.sku.trim();
        setPublishedRelease({ slug, sku });
        setMessage(
          formatLinearDeskPublishSuccess({
            slug,
            sku,
          }),
        );
        setFeedbackKind("success");
        setConfirmOpen(false);
      } else {
        setPublishedRelease(null);
        setMessage(result.error);
        setFeedbackKind("error");
        setConfirmOpen(false);
      }
    });
  }, [form, parsed]);

  const err = (path: string) => errorsByPath.get(path);
  const isPublished = publishedRelease !== null;
  const canOpenConfirm = parsed.ok && !pending;
  const hasPedestals = form.pedestalCount === 2;
  const validationLabel = isPublished
    ? "Live for guests"
    : parsed.ok
      ? "Draft ready"
      : `${parsed.errors.length} issue${parsed.errors.length === 1 ? "" : "s"}`;
  const lifecycleLabel = isPublished
    ? linearDeskPublishedStatusLabel()
    : linearDeskDraftStatusLabel();

  const alertClass =
    feedbackKind === "success"
      ? "admin-alert admin-alert--success"
      : feedbackKind === "error"
        ? "admin-alert admin-alert--error"
        : "admin-alert admin-alert--info";

  return (
    <div
      className="admin-page admin-page--svg-engine admin-svg-editor-workspace admin-svg-editor-workspace--dual-pane"
      data-testid="admin-linear-desk-parametric"
      data-admin-shell="parametric"
      data-chrome="planner-canvas-tool-rail"
      data-layout="plan-left-form-right"
      data-layout-mix="32-35-37"
      data-publish-state={isPublished ? "published" : "draft"}
    >
      <header
        className="admin-svg-engine-shell__topbar"
        data-testid="admin-shell-header"
      >
        <Link
          href="/admin/svg-editor"
          className="admin-btn admin-btn--outline admin-btn--compact admin-svg-engine-shell__back"
          data-testid="admin-shell-secondary-back"
          aria-label="Back to SVG inventory"
        >
          <ArrowLeft size={14} aria-hidden />
          <span>Inventory</span>
        </Link>

        <div className="admin-svg-engine-shell__divider" aria-hidden />

        <div className="admin-svg-engine-shell__identity">
          <p
            className="admin-svg-engine-shell__eyebrow"
            data-testid="admin-shell-scope"
          >
            Configure desk
          </p>
          <h1
            className="admin-svg-engine-shell__title"
            data-testid="admin-shell-title"
          >
            Linear desk
            {form.sku.trim() ? (
              <span className="admin-svg-engine-shell__sku">
                {form.sku.trim()}
              </span>
            ) : null}
          </h1>
          <p
            className="admin-svg-engine-shell__source"
            data-testid="admin-shell-source"
          >
            {displaySlug}
          </p>
        </div>

        <div
          className="admin-svg-engine-shell__actions"
          data-testid="admin-shell-actions"
        >
          <button
            type="submit"
            form="linear-desk-parametric-form"
            disabled={!canOpenConfirm}
            className="admin-btn admin-btn--primary admin-btn--compact admin-svg-engine-shell__action-publish"
            data-testid="linear-desk-publish"
          >
            {pending ? (
              <>
                <Loader2 size={14} className="admin-icon-spin" aria-hidden />{" "}
                Publishing…
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </header>

      {/* Scenario 37: status strip under top bar */}
      <div
        className="admin-svg-engine-shell__status-band"
        data-testid="admin-svg-studio-status"
        aria-label="Desk status"
      >
        <span
          data-testid="admin-svg-studio-status-draft"
          data-lifecycle={isPublished ? "published" : "draft"}
        >
          {lifecycleLabel}
        </span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span data-testid="admin-svg-studio-status-validation">
          {validationLabel}
        </span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span
          className="admin-svg-engine-shell__status-detail"
          data-testid="admin-svg-studio-status-footprint"
        >
          {footprintLabel}
        </span>
        {isPublished ? (
          <span className="admin-badge admin-badge--active admin-badge--compact admin-svg-engine-shell__status-ready">
            Live for guests
          </span>
        ) : canOpenConfirm ? (
          <span className="admin-badge admin-badge--active admin-badge--compact admin-svg-engine-shell__status-ready">
            Ready to publish
          </span>
        ) : (
          <span className="admin-badge admin-badge--warn admin-badge--compact admin-svg-engine-shell__status-ready">
            {pending ? "Publishing…" : "Blocked"}
          </span>
        )}
      </div>

      {message ? (
        <div
          className="admin-svg-engine-feedback"
          data-testid="admin-svg-a11y-live-feedback"
        >
          <div
            role="status"
            className={`${alertClass} admin-svg-engine-feedback__item`}
            data-testid="linear-desk-message"
          >
            <p>{message}</p>
            {isPublished && publishedRelease ? (
              <div
                className="admin-actions-row admin-section-top"
                data-testid="linear-desk-publish-success-actions"
              >
                <Link
                  href="/admin/svg-editor"
                  className="admin-btn admin-btn--outline admin-btn--compact"
                  data-testid="linear-desk-open-inventory"
                >
                  Open in inventory
                </Link>
                <Link
                  href="/planner/guest/"
                  className="admin-btn admin-btn--outline admin-btn--compact"
                  data-testid="linear-desk-verify-planner"
                >
                  Verify in Planner
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="admin-svg-engine-feedback" aria-hidden />
      )}

      {/* Scenario 35 mix: plan LEFT + form RIGHT. No dock, no third column. */}
      <div
        className="admin-svg-engine-shell admin-svg-engine-shell--dual-pane"
        data-testid="admin-svg-engine-shell"
        data-stage-layout="dual-pane-plan-left"
        data-stage-engine="form-maker"
      >
        <div
          className="admin-parametric-dual"
          data-testid="admin-parametric-dual"
        >
          <section
            aria-label="Desk plan"
            className="admin-parametric-dual__plan"
            data-testid="admin-svg-preview-rail"
            data-grid={gridEnabled ? "on" : "off"}
          >
            <CanvasToolRail
              activeTool={activeTool}
              onToolChange={setActiveTool}
              gridEnabled={gridEnabled}
              snapEnabled={snapEnabled}
              orthogonalLock={orthogonalLock}
              onToggleGrid={() => setGridEnabled((v) => !v)}
              onToggleSnap={() => setSnapEnabled((v) => !v)}
              onToggleOrthogonal={() => setOrthogonalLock((v) => !v)}
              pinned
            />
            <div className="admin-parametric-dual__plan-stage">
              <p className="admin-parametric-preview-plate__label">Plan</p>
              {previewSvg ? (
                <div
                  data-testid="linear-desk-preview"
                  className="admin-linear-desk-preview"
                  role="img"
                  aria-label={`Linear desk plan ${footprintLabel}`}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              ) : (
                <p role="status" data-testid="linear-desk-preview-blocked">
                  Fix highlighted fields to show the plan.
                </p>
              )}
            </div>
          </section>

          <section
            aria-label="Desk configuration"
            className="admin-parametric-dual__form admin-parametric-stage"
            data-testid="admin-svg-engine-stage"
            data-region="form-column"
            data-stage-engine="form-maker"
          >
            <form
              id="linear-desk-parametric-form"
              className="admin-parametric-form"
              onSubmit={(e) => {
                e.preventDefault();
                onRequestPublish();
              }}
              noValidate
            >
              {/* Scenario 37: summary chips in form (not a third dock panel) */}
              <div
                className="admin-parametric-form__summary-chips"
                data-testid="admin-svg-details-rail"
                aria-label="Summary"
              >
                <span
                  className="admin-parametric-form__chip"
                  data-testid="linear-desk-details-slug"
                >
                  {displaySlug}
                </span>
                <span
                  className="admin-parametric-form__chip"
                  data-testid="linear-desk-details-footprint"
                >
                  {footprintLabel}
                </span>
                {form.sku.trim() ? (
                  <span className="admin-parametric-form__chip">
                    {form.sku.trim()}
                  </span>
                ) : null}
              </div>

              <fieldset className="admin-parametric-form__section">
                <legend className="admin-parametric-form__section-title">
                  Units
                </legend>
                <div
                  className="admin-parametric-form__unit-row"
                  role="radiogroup"
                  aria-label="Display unit"
                >
                  <label className="admin-parametric-form__unit">
                    <input
                      type="radio"
                      name="unit"
                      checked={form.displayUnit === "mm"}
                      onChange={() => onUnit("mm")}
                    />
                    mm
                  </label>
                  <label className="admin-parametric-form__unit">
                    <input
                      type="radio"
                      name="unit"
                      checked={form.displayUnit === "cm"}
                      onChange={() => onUnit("cm")}
                    />
                    cm
                  </label>
                </div>
              </fieldset>

              <fieldset className="admin-parametric-form__section">
                <legend className="admin-parametric-form__section-title">
                  Size
                </legend>
                <div className="admin-parametric-form__grid">
                  <Field
                    label={`Width (${unit})`}
                    value={form.width}
                    error={err("width")}
                    onChange={(v) => setNumber("width", v)}
                    testId="linear-desk-width"
                  />
                  <Field
                    label={`Depth (${unit})`}
                    value={form.depth}
                    error={err("depth")}
                    onChange={(v) => setNumber("depth", v)}
                    testId="linear-desk-depth"
                  />
                  <Field
                    label={`Height (${unit})`}
                    value={form.height}
                    error={err("height")}
                    onChange={(v) => setNumber("height", v)}
                    testId="linear-desk-height"
                  />
                  <Field
                    label={`Top thickness (${unit})`}
                    value={form.topThickness}
                    error={err("topThickness")}
                    onChange={(v) => setNumber("topThickness", v)}
                  />
                </div>
              </fieldset>

              <fieldset className="admin-parametric-form__section">
                <legend className="admin-parametric-form__section-title">
                  Pedestals
                </legend>
                <div className="admin-parametric-form__grid">
                  <label className="admin-parametric-form__field admin-parametric-form__field--span2">
                    Pedestal layout
                    <select
                      value={form.pedestalCount}
                      onChange={(e) => {
                        clearPublishedOnEdit();
                        setForm((p) => ({
                          ...p,
                          pedestalCount: Number(e.target.value) === 0 ? 0 : 2,
                        }));
                      }}
                      className="admin-parametric-form__control"
                    >
                      <option value={2}>Two pedestals</option>
                      <option value={0}>No pedestals</option>
                    </select>
                  </label>
                  {hasPedestals ? (
                    <>
                      <Field
                        label={`Pedestal width (${unit})`}
                        value={form.pedestalWidth}
                        error={err("pedestalWidth")}
                        onChange={(v) => setNumber("pedestalWidth", v)}
                      />
                      <Field
                        label={`Side inset (${unit})`}
                        value={form.pedestalInset}
                        error={err("pedestalInset")}
                        onChange={(v) => setNumber("pedestalInset", v)}
                      />
                      <Field
                        label={`Gap under top (${unit})`}
                        value={form.pedestalTopGap}
                        error={err("pedestalTopGap")}
                        onChange={(v) => setNumber("pedestalTopGap", v)}
                        testId="linear-desk-pedestal-top-gap"
                      />
                      <Field
                        label={`Back inset (${unit})`}
                        value={form.pedestalBackInset}
                        error={err("pedestalBackInset")}
                        onChange={(v) => setNumber("pedestalBackInset", v)}
                        testId="linear-desk-pedestal-back-inset"
                      />
                    </>
                  ) : null}
                </div>
                <label className="admin-parametric-form__check">
                  <input
                    type="checkbox"
                    checked={form.modesty}
                    onChange={(e) => {
                      clearPublishedOnEdit();
                      setForm((p) => ({ ...p, modesty: e.target.checked }));
                    }}
                  />
                  Modesty panel
                </label>
              </fieldset>

              <fieldset className="admin-parametric-form__section">
                <legend className="admin-parametric-form__section-title">
                  Identity
                </legend>
                <div className="admin-parametric-form__grid">
                  <Field
                    label="Name"
                    value={form.name}
                    error={err("name")}
                    onChange={(v) => {
                      clearPublishedOnEdit();
                      setForm((p) => ({ ...p, name: v }));
                    }}
                    text
                    className="admin-parametric-form__field--span2"
                  />
                  <Field
                    label="SKU"
                    value={form.sku}
                    error={err("sku")}
                    onChange={(v) => {
                      clearPublishedOnEdit();
                      setForm((p) => ({ ...p, sku: v }));
                    }}
                    text
                  />
                  <Field
                    label="Series"
                    value={form.seriesId}
                    error={err("seriesId")}
                    onChange={(v) => {
                      clearPublishedOnEdit();
                      setForm((p) => ({ ...p, seriesId: v }));
                    }}
                    text
                  />
                  <Field
                    label="Slug"
                    value={form.slug}
                    error={err("slug")}
                    onChange={(v) => {
                      clearPublishedOnEdit();
                      setForm((p) => ({ ...p, slug: v }));
                    }}
                    text
                    testId="linear-desk-slug"
                    className="admin-parametric-form__field--span2"
                  />
                </div>
              </fieldset>
            </form>
          </section>
        </div>
      </div>

      {confirmCopy ? (
        <LinearDeskPublishConfirmDialog
          open={confirmOpen}
          copy={confirmCopy}
          pending={pending}
          onCancel={onCancelConfirm}
          onConfirm={onConfirmPublish}
        />
      ) : null}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string | number;
  error?: string;
  onChange: (v: string) => void;
  text?: boolean;
  testId?: string;
  className?: string;
}) {
  const uid = useId();
  const errorId = `${uid}-err`;
  const invalid = Boolean(props.error);
  return (
    <label
      className={
        props.className
          ? `admin-parametric-form__field ${props.className}`
          : "admin-parametric-form__field"
      }
    >
      {props.label}
      <input
        type={props.text ? "text" : "number"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        data-testid={props.testId}
        className="admin-parametric-form__control"
        step={props.text ? undefined : "any"}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      />
      {props.error ? (
        <span id={errorId} role="alert" className="admin-parametric-form__error">
          {props.error}
        </span>
      ) : null}
    </label>
  );
}
