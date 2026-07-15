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
      <div className="admin-svg-engine-shell__dim-label">Dimensions (mm)</div>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Width</span>
        <input
          type="number"
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.widthMm || ""}
          onChange={updateDimension("widthMm")}
        />
      </label>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Depth</span>
        <input
          type="number"
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.depthMm || ""}
          onChange={updateDimension("depthMm")}
        />
      </label>
      <label className="admin-svg-engine-shell__dim-row">
        <span>Height</span>
        <input
          type="number"
          className="admin-input admin-svg-engine-shell__dim-input"
          value={geometry.heightMm || ""}
          onChange={updateDimension("heightMm")}
        />
      </label>
      <hr className="admin-svg-engine-shell__sidebar-divider" />
      <p className="admin-svg-engine-shell__sidebar-meta">
        {stageMeta.footprint}
        <br />
        {stageMeta.validation}
      </p>
    </div>
  );
}

