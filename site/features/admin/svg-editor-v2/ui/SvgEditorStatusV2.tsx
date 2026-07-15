import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";

export function SvgEditorStatusV2({ manifest }: { readonly manifest: SvgAssetManifestV2 }) {
  return (
    <aside className="svg-editor-v2__status" aria-label="Editor status">
      <section>
        <h2>Validation</h2>
        <p>Draft checksum is ready.</p>
      </section>
      <section>
        <h2>Revision {manifest.currentVersion}</h2>
        <p>{manifest.sourceChecksum.slice(0, 12)}</p>
      </section>
    </aside>
  );
}
