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
/** K1: Maker-only pen (drawLinearDesk → compileMakerRecipeToPaths). */
import { renderLinearDeskSvg } from "@/features/planner/asset-engine/svg/parametric";
import { publishLinearDeskAction } from "./publishLinearDeskAction";
import { AdminSvgDockHost } from "../views/edit-shell/AdminSvgDockHost";

type Props = {
  readonly initialUnit?: "mm" | "cm";
};

/**
 * Parametric linear-desk authoring.
 * Product UI: configure desk → publish. Preview | Form | Details.
 */
export function LinearDeskParametricForm({ initialUnit = "cm" }: Props) {
  const [form, setForm] = useState<LinearDeskFormDisplay>(() =>
    defaultLinearDeskForm(initialUnit),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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

  const setNumber = useCallback((key: keyof LinearDeskFormDisplay, value: string) => {
    const n = Number(value);
    setForm((prev) => {
      if (!Number.isFinite(n)) return prev;
      const next = { ...prev, [key]: n };
      return key === "width" ? syncIdentityAfterWidthChange(next) : next;
    });
  }, []);

  const onUnit = useCallback((unit: "mm" | "cm") => {
    setForm((prev) => convertLinearDeskFormUnit(prev, unit));
  }, []);

  const onPublish = useCallback(() => {
    setMessage(null);
    if (!parsed.ok) {
      setMessage("Fix the highlighted fields, then publish.");
      return;
    }
    startTransition(async () => {
      const result = await publishLinearDeskAction(formToLinearDeskRaw(form));
      if (result.success) {
        setMessage(
          formatLinearDeskPublishSuccess({
            slug: result.descriptor.slug,
            sku: result.descriptor.sku,
          }),
        );
      } else {
        setMessage(result.error);
      }
    });
  }, [form, parsed]);

  const err = (path: string) => errorsByPath.get(path);
  const canPublish = parsed.ok && !pending;
  const hasPedestals = form.pedestalCount === 2;
  const footprintLabel = parsed.ok
    ? `${parsed.fields.widthMm}×${parsed.fields.depthMm} mm`
    : "—";
  const validationLabel = parsed.ok
    ? "Draft ready"
    : `${parsed.errors.length} issue${parsed.errors.length === 1 ? "" : "s"}`;
  const displaySlug = form.slug.trim() || "oando-…";
  const unit = form.displayUnit;

  const previewSlot = (
    <aside
      aria-label="Desk plan preview"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--preview admin-parametric-preview-plate"
      data-testid="admin-svg-preview-rail"
    >
      <p className="admin-parametric-preview-plate__label">Plan preview</p>
      {previewSvg ? (
        <div
          data-testid="linear-desk-preview"
          className="admin-linear-desk-preview"
          role="img"
          aria-label={`Linear desk plan ${footprintLabel}`}
          // Same Maker path as publish — trusted compile, not user HTML
          dangerouslySetInnerHTML={{ __html: previewSvg }}
        />
      ) : (
        <p role="status" data-testid="linear-desk-preview-blocked">
          Fix highlighted fields to show the plan.
        </p>
      )}
    </aside>
  );

  const stageSlot = (
    <section
      aria-label="Desk configuration"
      className="admin-svg-engine-shell__stage admin-svg-engine-shell__stage--dock admin-parametric-stage"
      data-testid="admin-svg-engine-stage"
      data-region="stage-column"
      data-stage-engine="form-maker"
    >
      <form
        id="linear-desk-parametric-form"
        className="admin-parametric-form"
        onSubmit={(e) => {
          e.preventDefault();
          onPublish();
        }}
        noValidate
      >
        <fieldset className="admin-parametric-form__section">
          <legend className="admin-parametric-form__section-title">Units</legend>
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
          <legend className="admin-parametric-form__section-title">Size</legend>
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
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    pedestalCount: Number(e.target.value) === 0 ? 0 : 2,
                  }))
                }
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
              onChange={(e) =>
                setForm((p) => ({ ...p, modesty: e.target.checked }))
              }
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
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              text
              className="admin-parametric-form__field--span2"
            />
            <Field
              label="SKU"
              value={form.sku}
              error={err("sku")}
              onChange={(v) => setForm((p) => ({ ...p, sku: v }))}
              text
            />
            <Field
              label="Series"
              value={form.seriesId}
              error={err("seriesId")}
              onChange={(v) => setForm((p) => ({ ...p, seriesId: v }))}
              text
            />
            <Field
              label="Slug"
              value={form.slug}
              error={err("slug")}
              onChange={(v) => setForm((p) => ({ ...p, slug: v }))}
              text
              testId="linear-desk-slug"
              className="admin-parametric-form__field--span2"
            />
          </div>
        </fieldset>
      </form>
    </section>
  );

  const detailsSlot = (
    <aside
      aria-label="Details"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--details"
      data-testid="admin-svg-details-rail"
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Summary</div>
        <div className="admin-panel__body">
          <dl className="admin-parametric-details__dl">
            <div>
              <dt>Name</dt>
              <dd>{form.name.trim() || "—"}</dd>
            </div>
            <div>
              <dt>SKU</dt>
              <dd>{form.sku.trim() || "—"}</dd>
            </div>
            <div>
              <dt>Slug</dt>
              <dd data-testid="linear-desk-details-slug">{displaySlug}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd data-testid="linear-desk-details-footprint">
                {footprintLabel}
              </dd>
            </div>
          </dl>
          <p className="admin-parametric-details__note">
            Change sizes and name in Form. Publish puts the desk in inventory
            for guests.
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <div
      className="admin-page admin-page--svg-engine admin-svg-editor-workspace admin-svg-editor-workspace--dock"
      data-testid="admin-linear-desk-parametric"
      data-admin-shell="parametric"
      data-chrome="dockview-react phosphor"
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
              <span className="admin-svg-engine-shell__sku">{form.sku.trim()}</span>
            ) : null}
          </h1>
          <p className="admin-svg-engine-shell__source" data-testid="admin-shell-source">
            {displaySlug}
          </p>
        </div>

        <div className="admin-svg-engine-shell__actions" data-testid="admin-shell-actions">
          <button
            type="submit"
            form="linear-desk-parametric-form"
            disabled={!canPublish}
            className="admin-btn admin-btn--primary admin-btn--compact admin-svg-engine-shell__action-publish"
            data-testid="linear-desk-publish"
          >
            {pending ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden />{" "}
                Publishing…
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </header>

      {message ? (
        <div
          className="admin-svg-engine-feedback"
          data-testid="admin-svg-a11y-live-feedback"
        >
          <p
            role="status"
            className="admin-alert admin-alert--info admin-svg-engine-feedback__item"
            data-testid="linear-desk-message"
          >
            {message}
          </p>
        </div>
      ) : (
        <div className="admin-svg-engine-feedback" aria-hidden />
      )}

      <div
        className="admin-svg-engine-shell__status-band"
        data-testid="admin-svg-studio-status"
        aria-label="Desk status"
      >
        <span data-testid="admin-svg-studio-status-draft">Draft</span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span data-testid="admin-svg-studio-status-validation">{validationLabel}</span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span
          className="admin-svg-engine-shell__status-detail"
          data-testid="admin-svg-studio-status-footprint"
        >
          {footprintLabel}
        </span>
        {canPublish ? (
          <span className="admin-badge admin-badge--active admin-badge--compact admin-svg-engine-shell__status-ready">
            Ready to publish
          </span>
        ) : (
          <span className="admin-badge admin-badge--warn admin-badge--compact admin-svg-engine-shell__status-ready">
            {pending ? "Publishing…" : "Blocked"}
          </span>
        )}
      </div>

      <div
        className="admin-svg-engine-shell admin-svg-engine-shell--dock"
        data-testid="admin-svg-engine-shell"
        data-stage-layout="dockview"
        data-stage-engine="form-maker"
      >
        <AdminSvgDockHost
          stageScrollable
          titles={{ stage: "Form", preview: "Preview", details: "Details" }}
          slots={{
            preview: previewSlot,
            stage: stageSlot,
            details: detailsSlot,
          }}
        />
      </div>
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
