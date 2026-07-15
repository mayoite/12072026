import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";

export function SvgEditorHeaderV2({ manifest }: { readonly manifest: SvgAssetManifestV2 }) {
  return (
    <header className="svg-editor-v2__header">
      <div>
        <p className="svg-editor-v2__eyebrow">SVG asset / {manifest.lifecycle}</p>
        <h1>{manifest.name}</h1>
      </div>
      <div className="svg-editor-v2__actions">
        <button type="button">Save draft</button>
        <button type="button">Publish v{manifest.currentVersion}</button>
      </div>
    </header>
  );
}
