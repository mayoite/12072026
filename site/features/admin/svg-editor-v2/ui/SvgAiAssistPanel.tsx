"use client";

import { useState } from "react";

import type { SvgAiResponseV1 } from "../ai/svgAiSchemasV1";
import { SvgAiChangePreview } from "./SvgAiChangePreview";

export function SvgAiAssistPanel({ baseChecksum, selectionIds, onApply }: {
  readonly baseChecksum: string;
  readonly selectionIds: readonly string[];
  readonly onApply: (response: SvgAiResponseV1) => void;
}) {
  const [open, setOpen] = useState(false);
  const [wholeDocument, setWholeDocument] = useState(false);
  const [preview, setPreview] = useState<SvgAiResponseV1 | null>(null);
  return (
    <aside className="svg-editor-v2__ai-assist">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? "Close AI assist" : "Open AI assist"}
      </button>
      {open ? (
        <div>
          <label>Instructions<textarea name="prompt" maxLength={4_000} /></label>
          <label><input type="checkbox" checked={wholeDocument} onChange={(event) => setWholeDocument(event.target.checked)} />Whole symbol</label>
          <button type="button" disabled={!wholeDocument && selectionIds.length === 0}>Preview edit</button>
          <button type="button" disabled={!wholeDocument && selectionIds.length === 0}>Audit</button>
          {preview ? (
            <SvgAiChangePreview
              response={preview}
              stale={preview.baseChecksum !== baseChecksum}
              onApply={() => onApply(preview)}
              onDiscard={() => setPreview(null)}
            />
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
