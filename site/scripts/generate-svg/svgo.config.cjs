/**
 * Frozen SVGO config — used by generate-svg.mjs §03-PERF-03.
 *
 * IMPORTANT: this file is frozen. Any change to svgo plugins must go through
 * an explicit gate review. Drift in this file can cause golden diff > 0.1%.
 *
 * Rules enforced here (per Phase 03 §03-SVG-05):
 *   - cleanupIds: false  — observers may depend on IDs
 *   - removeStyleElement: false — theme tokens use CSS vars in <style>
 *   - inlineStyles: false — keep <style> block for currentColor usage
 */
module.exports = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Do not remove IDs — observers may depend on them
          removeUselessDefsAndStroke: false,
          cleanupIds: false,
          removeUnusedNS: false,
          // Do not swallow <style> — theme tokens depend on CSS vars
          removeStyleElement: false,
          inlineStyles: false,
          // Preserve viewBox
          removeViewBox: false,
          // Keep title/desc for accessibility
          removeTitle: false,
          removeDesc: false,
        },
      },
    },
    // Remove redundant xmlns when not needed
    "removeXMLNS",
    // Do not hard-code dimensions — let viewBox drive sizing
    "removeDimensions",
  ],
  multipass: true,
};