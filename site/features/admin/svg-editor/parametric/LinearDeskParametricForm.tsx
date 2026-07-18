"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
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

type Props = {
  readonly initialUnit?: "mm" | "cm";
};

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

  return (
    <div className="admin-page" data-testid="admin-linear-desk-parametric">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Admin · SVG</p>
          <h1 className="admin-page__title">Linear desk (parametric)</h1>
          <p className="admin-page__meta">
            Client sizes and options → live plan SVG → publish. Exact config only.
            Stored as millimetres. Slug must stay <code>oando-…</code> for guest place.
          </p>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <form
          className="admin-parametric-form"
          onSubmit={(e) => {
            e.preventDefault();
            onPublish();
          }}
          noValidate
        >
          <fieldset style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <legend>Display unit</legend>
            <label style={{ marginRight: "1rem" }}>
              <input
                type="radio"
                name="unit"
                checked={form.displayUnit === "mm"}
                onChange={() => onUnit("mm")}
              />{" "}
              mm
            </label>
            <label>
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

          <label style={{ display: "block", marginBottom: "0.75rem" }}>
            Pedestals
            <select
              value={form.pedestalCount}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  pedestalCount: Number(e.target.value) === 0 ? 0 : 2,
                }))
              }
              style={{ display: "block", width: "100%", marginTop: 4 }}
            >
              <option value={2}>Dual (2)</option>
              <option value={0}>None (0)</option>
            </select>
          </label>

          <label style={{ display: "flex", gap: 8, marginBottom: "0.75rem" }}>
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

          <button
            type="submit"
            disabled={pending || !parsed.ok}
            data-testid="linear-desk-publish"
            style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
          >
            {pending ? "Publishing…" : "Publish to disk"}
          </button>

          {message ? (
            <p role="status" data-testid="linear-desk-message" style={{ marginTop: "0.75rem" }}>
              {message}
            </p>
          ) : null}
        </form>

        <div>
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Preview</h2>
          {previewSvg ? (
            <div
              data-testid="linear-desk-preview"
              className="admin-linear-desk-preview"
              // Preview from same draw* as publish — trusted code path, not user HTML
              // Styles: app/css/core/locked/svg/svg-preview.css
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          ) : (
            <p role="status">Fix fields to preview.</p>
          )}
        </div>
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
    <label style={{ display: "block", marginBottom: "0.75rem" }}>
      {props.label}
      <input
        type={props.text ? "text" : "number"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        data-testid={props.testId}
        style={{ display: "block", width: "100%", marginTop: 4 }}
        step={props.text ? undefined : "any"}
      />
      {props.error ? (
        <span role="alert" style={{ color: "#a30", fontSize: "0.85rem" }}>
          {props.error}
        </span>
      ) : null}
    </label>
  );
}
