"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import {
  ArrowLeft,
  CircleNotch as Loader2,
  Eye,
  ListBullets,
  PencilSimple,
  SquaresFour,
} from "@phosphor-icons/react";
import { Toolbar, ToggleButton } from "react-aria-components";

import {
  convertLinearDeskFormUnit,
  defaultLinearDeskForm,
  formToLinearDeskRaw,
  parseLinearDeskForm,
  syncIdentityAfterWidthChange,
  type LinearDeskFormDisplay,
} from "./linearDeskFormModel";
/** K1: Maker-only pen (drawLinearDesk → compileMakerRecipeToPaths). */
import { renderLinearDeskSvg } from "@/features/planner/asset-engine/svg/parametric";
import { publishLinearDeskAction } from "./publishLinearDeskAction";
import { AdminSvgDockHost } from "../views/edit-shell/AdminSvgDockHost";

type Props = {
  readonly initialUnit?: "mm" | "cm";
};

/**
 * Parametric linear-desk authoring.
 * Chrome: same Dockview + Aria + Phosphor package language as freehand studio.
 * Stage engine: field form + Maker compile (not Excalidraw / not Fabric).
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
      setMessage("Fix field errors before publish.");
      return;
    }
    startTransition(async () => {
      const result = await publishLinearDeskAction(formToLinearDeskRaw(form));
      if (result.success) {
        const slug = result.descriptor.slug;
        setMessage(
          `Published ${slug} (live, guest-visible). SVG /svg-catalog/${slug}.svg`,
        );
      } else {
        setMessage(result.error);
      }
    });
  }, [form, parsed]);

  const err = (path: string) => errorsByPath.get(path);
  const canPublish = parsed.ok && !pending;
  const footprintLabel = parsed.ok
    ? `${parsed.fields.widthMm}×${parsed.fields.depthMm} mm`
    : "—";
  const validationLabel = parsed.ok
    ? "Draft ready"
    : `${parsed.errors.length} field issue${parsed.errors.length === 1 ? "" : "s"}`;
  const displaySlug = form.slug.trim() || "oando-…";

  const previewSlot = (
    <aside
      aria-label="Plan symbol preview"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--preview"
      data-testid="admin-svg-preview-rail"
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Plan SVG</div>
        <div className="admin-panel__body">
          <p className="admin-page__meta admin-svg-engine-shell__rail-hint">
            Same Maker draw path as publish.
          </p>
          {previewSvg ? (
            <div
              data-testid="linear-desk-preview"
              className="admin-linear-desk-preview"
              // Preview from same draw* as publish — trusted code path, not user HTML
              // Styles: app/css/core/locked/svg/svg-preview.css
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          ) : (
            <p role="status" data-testid="linear-desk-preview-blocked">
              Fix fields to preview.
            </p>
          )}
        </div>
      </div>
    </aside>
  );

  const stageSlot = (
    <section
      aria-label="Linear desk fields"
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
        <fieldset className="admin-parametric-form__fieldset">
          <legend>Display unit</legend>
          <label className="admin-parametric-form__inline">
            <input
              type="radio"
              name="unit"
              checked={form.displayUnit === "mm"}
              onChange={() => onUnit("mm")}
            />{" "}
            mm
          </label>
          <label className="admin-parametric-form__inline">
            <input
              type="radio"
              name="unit"
              checked={form.displayUnit === "cm"}
              onChange={() => onUnit("cm")}
            />{" "}
            cm
          </label>
        </fieldset>

        <Field
          label={`Width (${form.displayUnit})`}
          value={form.width}
          error={err("width")}
          onChange={(v) => setNumber("width", v)}
          testId="linear-desk-width"
        />
        <Field
          label={`Depth (${form.displayUnit})`}
          value={form.depth}
          error={err("depth")}
          onChange={(v) => setNumber("depth", v)}
          testId="linear-desk-depth"
        />
        <Field
          label={`Height (${form.displayUnit})`}
          value={form.height}
          error={err("height")}
          onChange={(v) => setNumber("height", v)}
          testId="linear-desk-height"
        />
        <Field
          label={`Top thickness (${form.displayUnit})`}
          value={form.topThickness}
          error={err("topThickness")}
          onChange={(v) => setNumber("topThickness", v)}
        />
        <Field
          label={`Pedestal width (${form.displayUnit})`}
          value={form.pedestalWidth}
          error={err("pedestalWidth")}
          onChange={(v) => setNumber("pedestalWidth", v)}
        />
        <Field
          label={`Pedestal inset (${form.displayUnit})`}
          value={form.pedestalInset}
          error={err("pedestalInset")}
          onChange={(v) => setNumber("pedestalInset", v)}
        />
        <Field
          label={`Pedestal top gap (${form.displayUnit})`}
          value={form.pedestalTopGap}
          error={err("pedestalTopGap")}
          onChange={(v) => setNumber("pedestalTopGap", v)}
          testId="linear-desk-pedestal-top-gap"
        />
        <Field
          label={`Pedestal back inset (${form.displayUnit})`}
          value={form.pedestalBackInset}
          error={err("pedestalBackInset")}
          onChange={(v) => setNumber("pedestalBackInset", v)}
          testId="linear-desk-pedestal-back-inset"
        />

        <label className="admin-parametric-form__field">
          Pedestals
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
            <option value={2}>Dual (2)</option>
            <option value={0}>None (0)</option>
          </select>
        </label>

        <label className="admin-parametric-form__check">
          <input
            type="checkbox"
            checked={form.modesty}
            onChange={(e) => setForm((p) => ({ ...p, modesty: e.target.checked }))}
          />
          Modesty panel
        </label>

        <Field
          label="Name"
          value={form.name}
          error={err("name")}
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          text
        />
        <Field
          label="SKU"
          value={form.sku}
          error={err("sku")}
          onChange={(v) => setForm((p) => ({ ...p, sku: v }))}
          text
        />
        <Field
          label="Slug"
          value={form.slug}
          error={err("slug")}
          onChange={(v) => setForm((p) => ({ ...p, slug: v }))}
          text
          testId="linear-desk-slug"
        />
        <Field
          label="Series id"
          value={form.seriesId}
          error={err("seriesId")}
          onChange={(v) => setForm((p) => ({ ...p, seriesId: v }))}
          text
        />
      </form>
    </section>
  );

  const detailsSlot = (
    <aside
      aria-label="Publish and identity"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--details"
      data-testid="admin-svg-details-rail"
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Identity</div>
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
              <dt>Footprint</dt>
              <dd data-testid="linear-desk-details-footprint">{footprintLabel}</dd>
            </div>
          </dl>
          <p className="admin-page__meta">
            Stored as millimetres. Slug must stay <code>oando-…</code> for guest
            place.
          </p>
        </div>
      </div>
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Publish</div>
        <div className="admin-panel__body">
          <p className="admin-page__meta">
            Engine: form fields → Maker pen → multipath plan SVG → disk (live
            guest-visible).
          </p>
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
              "Publish to disk"
            )}
          </button>
          {message ? (
            <p
              role="status"
              data-testid="linear-desk-message"
              className="admin-alert admin-alert--info"
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );

  return (
    <div
      className="admin-page admin-page--svg-engine admin-svg-editor-workspace admin-svg-editor-workspace--dock"
      data-testid="admin-linear-desk-parametric"
      data-admin-shell="parametric"
      data-chrome="dockview-react aria phosphor"
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
            Admin · Parametric
          </p>
          <h1
            className="admin-svg-engine-shell__title"
            data-testid="admin-shell-title"
          >
            Linear desk
            {form.sku.trim() ? (
              <span className="admin-svg-engine-shell__sku">SKU {form.sku.trim()}</span>
            ) : null}
          </h1>
          <p className="admin-svg-engine-shell__source" data-testid="admin-shell-source">
            Field-driven Maker SVG · {displaySlug}
          </p>
        </div>

        <div className="admin-svg-engine-shell__actions" data-testid="admin-shell-actions">
          <button
            type="submit"
            form="linear-desk-parametric-form"
            disabled={!canPublish}
            className="admin-btn admin-btn--primary admin-btn--compact admin-svg-engine-shell__action-publish"
            data-testid="linear-desk-publish-top"
          >
            {pending ? "Publishing…" : "Publish to disk"}
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
            data-testid="linear-desk-message-band"
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
        aria-label="Parametric draft status"
      >
        <Toolbar
          aria-label="Studio chrome"
          className="admin-svg-engine-shell__chrome-toolbar"
          data-testid="admin-svg-chrome-toolbar"
        >
          <ToggleButton
            isSelected
            className="admin-svg-engine-shell__chrome-btn"
            aria-label="Dock layout: preview, form, details"
          >
            <SquaresFour size={16} aria-hidden />
            <span className="admin-svg-engine-shell__chrome-btn-label">Dock</span>
          </ToggleButton>
          <span className="admin-svg-engine-shell__chrome-legend" aria-hidden>
            <Eye size={14} />
            <PencilSimple size={14} />
            <ListBullets size={14} />
          </span>
        </Toolbar>
        <span data-testid="admin-svg-studio-status-draft">Parametric draft</span>
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
          Footprint {footprintLabel}
        </span>
        <span aria-hidden className="admin-svg-engine-shell__status-sep">
          ·
        </span>
        <span
          className="admin-svg-engine-shell__status-detail"
          data-testid="admin-svg-studio-status-engine"
        >
          form + Maker
        </span>
        {canPublish ? (
          <span className="admin-badge admin-badge--active admin-badge--compact admin-svg-engine-shell__status-ready">
            Ready to publish
          </span>
        ) : (
          <span className="admin-badge admin-badge--warn admin-badge--compact admin-svg-engine-shell__status-ready">
            {pending ? "Publishing…" : "Publish blocked"}
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
}) {
  return (
    <label className="admin-parametric-form__field">
      {props.label}
      <input
        type={props.text ? "text" : "number"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        data-testid={props.testId}
        className="admin-parametric-form__control"
        step={props.text ? undefined : "any"}
      />
      {props.error ? (
        <span role="alert" className="admin-parametric-form__error">
          {props.error}
        </span>
      ) : null}
    </label>
  );
}
