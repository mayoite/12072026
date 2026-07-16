"use client";

import type { ChangeEvent } from "react";

import type { SvgEditorFormState } from "../../form/svgEditorFormState";
import type { AdminSvgStageMeta } from "./types";

interface AdminSvgStudioSidebarProps {
  readonly geometry: SvgEditorFormState["geometry"];
  readonly stageMeta: AdminSvgStageMeta;
  readonly onGeometryChange: (next: SvgEditorFormState["geometry"]) => void;
}

export function AdminSvgStudioSidebar({
  geometry,
  stageMeta,
  onGeometryChange,
}: AdminSvgStudioSidebarProps) {
  const updateDimension =
    (field: keyof SvgEditorFormState["geometry"]) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onGeometryChange({
        ...geometry,
        [field]: Number(event.target.value),
      });
    };

  return (
    <div
      className="admin-svg-engine-shell__sidebar"
      data-testid="admin-svg-stage-sidebar"
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    >
      <div className="admin-svg-engine-shell__dim-label" id="admin-svg-dimensions-label">
        Footprint (mm)
      </div>
      <p className="admin-svg-engine-shell__sidebar-hint">
        Physical size for Planner placement. Width and depth must match the symbol.
      </p>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Width</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.widthMm || ""}
          onChange={updateDimension("widthMm")}
          aria-label="Footprint width in millimetres"
        />
      </label>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Depth</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.depthMm || ""}
          onChange={updateDimension("depthMm")}
          aria-label="Footprint depth in millimetres"
        />
      </label>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Height</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.heightMm || ""}
          onChange={updateDimension("heightMm")}
          aria-label="Footprint height in millimetres"
        />
      </label>
      <hr className="admin-svg-engine-shell__sidebar-divider" />
      <dl className="admin-svg-engine-shell__sidebar-meta" data-testid="admin-svg-stage-meta">
        <div>
          <dt className="sr-only">Identity</dt>
          <dd>{stageMeta.identity}</dd>
        </div>
        <div>
          <dt className="sr-only">Footprint</dt>
          <dd>{stageMeta.footprint}</dd>
        </div>
        <div>
          <dt className="sr-only">Draft</dt>
          <dd>{stageMeta.draft}</dd>
        </div>
        <div>
          <dt className="sr-only">Validation</dt>
          <dd>{stageMeta.validation}</dd>
        </div>
        <div>
          <dt className="sr-only">Revision</dt>
          <dd>{stageMeta.revision}</dd>
        </div>
      </dl>
    </div>
  );
}
