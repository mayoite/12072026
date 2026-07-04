"use client";

/**
 * Fabric writes an object's `fill`/`stroke` straight onto the 2D canvas context.
 * The canvas context cannot parse CSS custom properties (`var(--x)`) or
 * `color-mix(...)`, so those values are silently dropped and shapes fall back to
 * default black. Resolve such values against the live cascade so themed tokens
 * (including light/dark) render correctly on the canvas.
 *
 * Plain colors the canvas already understands (`#hex`, `rgb()`, named, and
 * `transparent`) are returned untouched. Results are cached per input string.
 */
const resolvedColorCache = new Map<string, string>();

function needsResolution(value: string): boolean {
  return value.includes("var(") || value.includes("color-mix");
}

export function resolvePlannerColor(
  value: string | null | undefined,
  fallback = "#111111",
): string {
  if (value === null || value === undefined) return fallback;
  const input = value.trim();
  if (input === "") return fallback;
  if (!needsResolution(input)) return input;
  if (typeof document === "undefined") return fallback;

  const cached = resolvedColorCache.get(input);
  if (cached) return cached;

  const probe = document.createElement("span");
  probe.style.color = input;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const result = computed && computed.trim() !== "" ? computed : fallback;
  resolvedColorCache.set(input, result);
  return result;
}
