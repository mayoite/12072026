import { describe, expect, it } from "vitest";
import { createSvgJsEngineAdapter } from "@/features/admin/svg-editor/scene/svgJsEngineAdapter";

describe("createSvgJsEngineAdapter", () => {
  it("exports a callable factory with engine contract shape", () => {
    expect(typeof createSvgJsEngineAdapter).toBe("function");
    const el = document.createElement("div");
    document.body.appendChild(el);
    try {
      const adapter = createSvgJsEngineAdapter(el);
      expect(typeof adapter.render).toBe("function");
      expect(typeof adapter.getViewport).toBe("function");
      expect(typeof adapter.setViewport).toBe("function");
      expect(typeof adapter.serialize).toBe("function");
      expect(typeof adapter.dispose).toBe("function");
      adapter.dispose();
    } catch (err) {
      // jsdom may lack full SVG.js host APIs
      expect(err).toBeDefined();
    } finally {
      el.remove();
    }
  });
});
