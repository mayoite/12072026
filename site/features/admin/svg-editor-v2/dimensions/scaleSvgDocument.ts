interface DimensionsMm {
  readonly width: number;
  readonly depth: number;
  readonly height: number;
}

export function planDimensionChange(input: {
  readonly current: DimensionsMm;
  readonly next: DimensionsMm;
  readonly decision: "scale-drawing" | "metadata-only" | "cancel";
}) {
  if (input.decision === "cancel") return { action: "cancel" as const, scale: null };
  if (input.decision === "metadata-only") return { action: "metadata-only" as const, scale: null };
  return {
    action: "scale-drawing" as const,
    scale: {
      x: input.next.width / input.current.width,
      y: input.next.depth / input.current.depth,
    },
  };
}

export function scaleSvgDocument(svg: string, input: {
  readonly current: DimensionsMm;
  readonly next: DimensionsMm;
  readonly preserveProportions: boolean;
  readonly unlockIndependentScale: boolean;
}) {
  const widthChanged = input.current.width !== input.next.width;
  const depthChanged = input.current.depth !== input.next.depth;
  if (!widthChanged && !depthChanged) return { svg, scale: { x: 1, y: 1 } };
  const viewBox = svg.match(/\bviewBox=["']\s*([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s*["']/);
  if (!viewBox) throw new Error("SVG viewBox is required for drawing scale");
  const [, xText, yText, widthText, heightText] = viewBox;
  const x = Number(xText);
  const y = Number(yText);
  const width = Number(widthText);
  const height = Number(heightText);
  let scaleX = input.next.width / input.current.width;
  let scaleY = input.next.depth / input.current.depth;
  if (input.preserveProportions || !input.unlockIndependentScale) {
    const uniform = Math.min(scaleX, scaleY);
    scaleX = uniform;
    scaleY = uniform;
  }
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const transform = `translate(${-centerX} ${-centerY}) scale(${scaleX} ${scaleY}) translate(${centerX} ${centerY})`;
  const scaledSvg = svg.replace(/(<svg\b[^>]*>)/, `$1<g data-svg-editor-v2-scale="true" transform="${transform}">`)
    .replace(/<\/svg>\s*$/, "</g></svg>");
  return { svg: scaledSvg, scale: { x: scaleX, y: scaleY } };
}
