// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_MAP, rewriteFile } from "../../../scripts/migrate-lucide-to-phosphor.mjs";

describe("migrate-lucide-to-phosphor (name-mirror)", () => {
  it("maps core lucide icons to phosphor names", () => {
    expect(ICON_MAP.Loader2).toBe("CircleNotch");
    expect(ICON_MAP.Search).toBe("MagnifyingGlass");
    expect(ICON_MAP.Trash2).toBe("Trash");
    expect(Object.keys(ICON_MAP).length).toBeGreaterThan(40);
  });

  it("rewrites lucide-react import to phosphor with aliases", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lucide-mig-"));
    try {
      const file = path.join(tmp, "Sample.tsx");
      fs.writeFileSync(
        file,
        'import { Loader2, Search } from "lucide-react";\nexport const x = Loader2;\n',
        "utf8",
      );
      expect(rewriteFile(file)).toBe(true);
      const out = fs.readFileSync(file, "utf8");
      expect(out).toContain("@phosphor-icons/react");
      expect(out).not.toContain("lucide-react");
      expect(out).toMatch(/CircleNotch as Loader2/);
      expect(out).toMatch(/MagnifyingGlass as Search/);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("returns false when file has no lucide import", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lucide-mig-"));
    try {
      const file = path.join(tmp, "Clean.tsx");
      fs.writeFileSync(file, "export const ok = true;\n", "utf8");
      expect(rewriteFile(file)).toBe(false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
