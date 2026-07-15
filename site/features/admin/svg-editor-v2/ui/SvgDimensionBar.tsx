"use client";

import { useState } from "react";

import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";
import { convertMmToDisplay, type SvgDimensionUnit } from "../dimensions/svgDimensionUnits";

export function SvgDimensionBar({ dimensions }: { readonly dimensions: SvgAssetManifestV2["dimensionsMm"] }) {
  const [unit, setUnit] = useState<SvgDimensionUnit>("mm");
  return (
    <fieldset className="svg-editor-v2__dimensions">
      <legend>Physical dimensions</legend>
      {(["width", "depth", "height"] as const).map((dimension) => (
        <label key={dimension}>
          <span>{dimension}</span>
          <input type="number" min="0" step="any" defaultValue={convertMmToDisplay(dimensions[dimension], unit)} />
        </label>
      ))}
      <label>
        <span>Unit</span>
        <select value={unit} onChange={(event) => setUnit(event.target.value as SvgDimensionUnit)}>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="in">in</option>
          <option value="ft">ft</option>
        </select>
      </label>
    </fieldset>
  );
}
