"use client";

/**
 * Basic parametric desk editor.
 *
 * FINAL layout lock: docs/ui-benchmarks/parametric-lock/32.jpg only.
 * Simple CSS grid — not WorkspaceShell, not Dockview:
 *   topbar | status | TOOL RAIL | DESK PROPERTIES | PLAN CANVAS
 *
 * Domain: fields → Maker multipath SVG → publish confirm → action.
 * Rail: planner CanvasToolRail only. Freehand left alone.
 */

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
import { renderLinearDeskSvg } from "@/features/planner/asset-engine/svg/parametric";
import { publishLinearDeskAction } from "./publishLinearDeskAction";
import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import type { PlannerTool } from "@/features/planner/editor/canvasTool";

type Props = {
  readonly initialUnit?: "mm" | "cm";
};

type PublishRelease = {
  readonly slug: string;
  readonly sku: string;
};

export function LinearDeskParametricForm({ initialUnit = "cm" }: Props) {
  const [form, setForm] = useState<LinearDeskFormDisplay>(() =>
    defaultLinearDeskForm(initialUnit),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"ok" | "err" | "info">("info");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [published, setPublished] = useState<PublishRelease | null>(null);
  const [pending, startTransition] = useTransition();
  const [tool, setTool] = useState<PlannerTool>("select");
  const [gridOn, setGridOn] = useState(true);
  const [snapOn, setSnapOn] = useState(true);

  const clearLive = useCallback(() => setPublished(null), []);

  const parsed = useMemo(() => parseLinearDeskForm(form), [form]);
  const errMap = useMemo(() => {
    const m = new Map<string, string>();
    if (!parsed.ok) for (const e of parsed.errors) m.set(e.path, e.message);
    return m;
  }, [parsed]);

  const previewSvg = useMemo(() => {
    if (!parsed.ok) return null;
    return renderLinearDeskSvg(parsed.fields);
  }, [parsed]);

  const setNumber = useCallback(
    (key: keyof LinearDeskFormDisplay, value: string) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return;
      clearLive();
      setForm((prev) => {
        const next = { ...prev, [key]: n };
        return key === "width" ? syncIdentityAfterWidthChange(next) : next;
      });
    },
    [clearLive],
  );

  const onUnit = useCallback(
    (unit: "mm" | "cm") => {
      clearLive();
      setForm((prev) => convertLinearDeskFormUnit(prev, unit));
    },
    [clearLive],
  );

  const footprint = parsed.ok
    ? `${parsed.fields.widthMm}×${parsed.fields.depthMm} mm`
    : "—";
  const slug = form.slug.trim() || "oando-…";
  const unit = form.displayUnit;
  const hasPedestals = form.pedestalCount === 2;
  const live = published !== null;
  const canPublish = parsed.ok && !pending;

  const confirmCopy = useMemo(() => {
    if (!parsed.ok) return null;
    return buildLinearDeskPublishConfirmCopy({
      name: form.name,
      sku: form.sku,
      slug: form.slug,
      footprintMm: footprint,
    });
  }, [parsed, form.name, form.sku, form.slug, footprint]);

  const requestPublish = useCallback(() => {
    setMessage(null);
    if (!parsed.ok) {
      setMessage("Fix the highlighted fields, then publish.");
      setMessageKind("err");
      return;
    }
    setConfirmOpen(true);
  }, [parsed]);

  const confirmPublish = useCallback(() => {
    if (!parsed.ok) return;
    startTransition(async () => {
      const result = await publishLinearDeskAction(formToLinearDeskRaw(form));
      if (result.success) {
        const nextSlug = result.descriptor.slug;
        const nextSku =
          typeof result.descriptor.sku === "string"
            ? result.descriptor.sku
            : form.sku.trim();
        setPublished({ slug: nextSlug, sku: nextSku });
        setMessage(formatLinearDeskPublishSuccess({ slug: nextSlug, sku: nextSku }));
        setMessageKind("ok");
        setConfirmOpen(false);
      } else {
        setPublished(null);
        setMessage(result.error);
        setMessageKind("err");
        setConfirmOpen(false);
      }
    });
  }, [form, parsed]);

  const err = (path: string) => errMap.get(path);

  return (
    <div
      className="admin-page admin-page--svg-engine admin-cad"
      data-testid="admin-linear-desk-parametric"
      data-admin-shell="parametric"
      data-chrome="lock-32"
      data-lock-image="32"
      data-cad-studio="cool"
      data-publish-state={live ? "published" : "draft"}
    >
      {/* Final lock: docs/ui-benchmarks/parametric-lock/32.jpg only */}
      <header className="admin-cad__top" data-testid="admin-shell-header">
        <nav className="admin-cad__crumb" aria-label="Breadcrumb">
          <Link
            href="/admin/svg-editor"
            className="admin-cad__crumb-link"
            data-testid="admin-shell-secondary-back"
          >
            <ArrowLeft size={14} aria-hidden />
            Inventory
          </Link>
          <span className="admin-cad__crumb-sep" aria-hidden>
            ·
          </span>
          <span className="admin-cad__crumb-current" data-testid="admin-shell-title">
            Linear desk
          </span>
          <span className="admin-cad__sku" data-testid="admin-shell-source">
            {form.sku.trim() || slug}
          </span>
        </nav>
        <p className="admin-cad__eyebrow admin-cad__sr" data-testid="admin-shell-scope">
          Configure desk
        </p>
        <div className="admin-cad__actions" data-testid="admin-shell-actions">
          <button
            type="submit"
            form="linear-desk-parametric-form"
            className="admin-cad__publish"
            data-testid="linear-desk-publish"
            disabled={!canPublish}
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

      {/* Compact status line under topbar (32.jpg) */}
      <div
        className="admin-cad__status"
        data-testid="admin-svg-studio-status"
        aria-label="Desk status"
      >
        <span
          className={
            live ? "admin-cad__pill admin-cad__pill--ok" : "admin-cad__pill admin-cad__pill--strong"
          }
          data-testid="admin-svg-studio-status-draft"
          data-lifecycle={live ? "published" : "draft"}
        >
          <span className="admin-cad__pill-key">Status</span>
          <span className="admin-cad__pill-val">
            {live ? linearDeskPublishedStatusLabel() : linearDeskDraftStatusLabel()}
          </span>
        </span>
        <span className="admin-cad__pill" data-testid="admin-svg-studio-status-validation">
          <span className="admin-cad__pill-key">Check</span>
          <span className="admin-cad__pill-val">
            {live
              ? "Live for guests"
              : parsed.ok
                ? "Draft ready"
                : `${parsed.errors.length} issue(s)`}
          </span>
        </span>
        <span className="admin-cad__pill" data-testid="admin-svg-studio-status-footprint">
          <span className="admin-cad__pill-key">Size</span>
          <span className="admin-cad__pill-val">{footprint}</span>
        </span>
        {canPublish && !live ? (
          <span className="admin-cad__pill admin-cad__pill--ok">
            <span className="admin-cad__pill-key">Publish</span>
            <span className="admin-cad__pill-val">Ready</span>
          </span>
        ) : null}
      </div>

      {message ? (
        <div
          className={
            messageKind === "ok"
              ? "admin-alert admin-alert--success"
              : messageKind === "err"
                ? "admin-alert admin-alert--error"
                : "admin-alert admin-alert--info"
          }
          role="status"
          data-testid="linear-desk-message"
        >
          <p>{message}</p>
          {live && published ? (
            <div className="admin-actions-row" data-testid="linear-desk-publish-success-actions">
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
      ) : null}

      {/* 32.jpg: TOOL RAIL | DESK PROPERTIES | PLAN CANVAS */}
      <div
        className="admin-cad__body"
        data-testid="admin-svg-engine-shell"
        data-stage-layout="lock-32"
        data-stage-engine="form-maker"
      >
        <div className="admin-cad__rail" aria-label="Tool rail">
          <CanvasToolRail
            activeTool={tool}
            onToolChange={setTool}
            gridEnabled={gridOn}
            snapEnabled={snapOn}
            onToggleGrid={() => setGridOn((v) => !v)}
            onToggleSnap={() => setSnapOn((v) => !v)}
            pinned
          />
        </div>

        <section
          className="admin-cad__form"
          aria-label="Desk configuration"
          data-testid="admin-svg-engine-stage"
          data-stage-engine="form-maker"
        >
          <header className="admin-cad__form-head">
            <h2 className="admin-cad__form-title">Desk properties</h2>
            <p className="admin-cad__form-selected">
              <span className="admin-cad__form-selected-name">
                {form.name.trim() || "Linear desk"}
              </span>
              <span className="admin-cad__form-selected-sku">
                {form.sku.trim() || slug}
              </span>
            </p>
          </header>
          <form
            id="linear-desk-parametric-form"
            className="admin-parametric-form admin-cad__form-scroll"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              requestPublish();
            }}
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
                    checked={unit === "mm"}
                    onChange={() => onUnit("mm")}
                  />
                  mm
                </label>
                <label className="admin-parametric-form__unit">
                  <input
                    type="radio"
                    name="unit"
                    checked={unit === "cm"}
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
                    className="admin-parametric-form__control"
                    value={form.pedestalCount}
                    onChange={(e) => {
                      clearLive();
                      setForm((p) => ({
                        ...p,
                        pedestalCount: Number(e.target.value) === 0 ? 0 : 2,
                      }));
                    }}
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
                    clearLive();
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
                    clearLive();
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
                    clearLive();
                    setForm((p) => ({ ...p, sku: v }));
                  }}
                  text
                />
                <Field
                  label="Series"
                  value={form.seriesId}
                  error={err("seriesId")}
                  onChange={(v) => {
                    clearLive();
                    setForm((p) => ({ ...p, seriesId: v }));
                  }}
                  text
                />
                <Field
                  label="Slug"
                  value={form.slug}
                  error={err("slug")}
                  onChange={(v) => {
                    clearLive();
                    setForm((p) => ({ ...p, slug: v }));
                  }}
                  text
                  testId="linear-desk-slug"
                  className="admin-parametric-form__field--span2"
                />
              </div>
            </fieldset>

          </form>
          <div
            className="admin-cad__form-footer"
            data-testid="linear-desk-summary-chips"
            aria-label="Summary"
          >
            <span
              className="admin-cad__footer-chip"
              data-testid="linear-desk-details-slug"
            >
              {slug}
            </span>
            <span
              className="admin-cad__footer-chip"
              data-testid="linear-desk-details-footprint"
            >
              {footprint}
            </span>
            <span className="admin-cad__footer-chip">
              {hasPedestals ? "2 pedestals" : "No pedestals"}
            </span>
            <span className="admin-cad__footer-chip">
              {parsed.ok ? "Valid" : "Blocked"}
            </span>
          </div>
        </section>

        {/* 32 — PLAN CANVAS dominant right */}
        <section
          className="admin-cad__plan"
          aria-label="Desk plan"
          data-testid="admin-svg-preview-rail"
          data-grid={gridOn ? "on" : "off"}
        >
          <div className="admin-cad__plan-stage">
            <div className="admin-cad__plan-chrome">
              <span className="admin-cad__plan-label">Plan canvas</span>
              <span className="admin-cad__plan-meta">{footprint}</span>
            </div>
            <div className="admin-cad__plan-board">
              {previewSvg ? (
                <div
                  data-testid="linear-desk-preview"
                  className="admin-linear-desk-preview admin-linear-desk-preview--stage admin-cad__preview"
                  role="img"
                  aria-label={`Linear desk plan ${footprint}`}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              ) : (
                <p role="status" data-testid="linear-desk-preview-blocked">
                  Fix highlighted fields to show the plan.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {confirmCopy ? (
        <LinearDeskPublishConfirmDialog
          open={confirmOpen}
          copy={confirmCopy}
          pending={pending}
          onCancel={() => {
            if (!pending) setConfirmOpen(false);
          }}
          onConfirm={confirmPublish}
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
