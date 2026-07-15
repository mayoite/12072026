import type { SvgAiResponseV1 } from "../ai/svgAiSchemasV1";

export function SvgAiChangePreview({ response, stale, onApply, onDiscard }: {
  readonly response: SvgAiResponseV1;
  readonly stale: boolean;
  readonly onApply: () => void;
  readonly onDiscard: () => void;
}) {
  return (
    <section className="svg-editor-v2__ai-preview" aria-label="AI change preview">
      <h3>{response.summary}</h3>
      <ol>{response.operations.map((operation, index) => <li key={`${operation.type}-${index}`}>{operation.type}</li>)}</ol>
      {response.findings.map((finding, index) => <p key={`${finding.severity}-${index}`}>{finding.message}</p>)}
      {stale ? <p role="alert">The editor changed after this preview. Request a new preview.</p> : null}
      <button type="button" disabled={stale} onClick={onApply}>Apply preview</button>
      <button type="button" onClick={onDiscard}>Discard</button>
    </section>
  );
}
