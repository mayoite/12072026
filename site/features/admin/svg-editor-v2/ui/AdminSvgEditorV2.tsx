"use client";

import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";
import { SvgEditFrameHost } from "../bridge/SvgEditFrameHost";
import { SvgDimensionBar } from "./SvgDimensionBar";
import { SvgEditorHeaderV2 } from "./SvgEditorHeaderV2";
import { SvgEditorStatusV2 } from "./SvgEditorStatusV2";
import { SvgAiAssistPanel } from "./SvgAiAssistPanel";

export function AdminSvgEditorV2({ manifest }: {
  readonly manifest: SvgAssetManifestV2;
  readonly initialSvg: string;
}) {
  return (
    <main className="svg-editor-v2">
      <SvgEditorHeaderV2 manifest={manifest} />
      <SvgDimensionBar dimensions={manifest.dimensionsMm} />
      <div className="svg-editor-v2__workspace">
        <SvgEditFrameHost />
        <SvgEditorStatusV2 manifest={manifest} />
      </div>
      <SvgAiAssistPanel
        baseChecksum={manifest.sourceChecksum}
        selectionIds={[]}
        onApply={() => undefined}
      />
    </main>
  );
}
