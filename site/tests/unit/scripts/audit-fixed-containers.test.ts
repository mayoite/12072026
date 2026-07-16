// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-fixed-containers.mjs");

function loadClassify(): (
  variant: string | undefined,
  prop: string,
  val: string,
) => string {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/function classify\(variant, prop, val\) \{[\s\S]*?\n\}/);
  if (!match) throw new Error("classify not found");
  const sandbox: {
    Boolean: typeof Boolean;
    classify?: (variant: string | undefined, prop: string, val: string) => string;
  } = { Boolean };
  vm.runInNewContext(`${match[0]}; this.classify = classify;`, sandbox);
  if (!sandbox.classify) throw new Error("classify failed to load");
  return sandbox.classify;
}

function loadContainerRe(): RegExp {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(
    /const CONTAINER_RE =\s*(\/[\s\S]*?\/g);/,
  );
  if (!match) throw new Error("CONTAINER_RE not found");
  return new Function(`return ${match[1]}`)() as RegExp;
}

describe("audit-fixed-containers", () => {
  it("writes fixed-containers audit CSV and classifies w/h arbitrary sizes", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("fixed-containers-audit.csv");
    expect(source).toContain("function classify");
    expect(source).toContain("CONTAINER_RE");
    expect(source).toContain("FIXED");
  });

  it("classifies fixed, responsive, min, max, and viewport dimensions", () => {
    const classify = loadClassify();
    expect(classify(undefined, "w", "320px")).toBe("fixed");
    expect(classify(undefined, "h", "2rem")).toBe("fixed");
    expect(classify("md", "w", "320px")).toBe("responsive");
    expect(classify("lg", "h", "10em")).toBe("responsive");
    expect(classify(undefined, "min-w", "44px")).toBe("min");
    expect(classify(undefined, "max-w", "1200px")).toBe("max");
    expect(classify(undefined, "w", "100vw")).toBe("viewport");
    expect(classify(undefined, "h", "50vh")).toBe("viewport");
    expect(classify(undefined, "w", "calc(100% - 1rem)")).toBe("viewport");
    expect(classify(undefined, "w", "1/2")).toBe("viewport");
  });

  it("matches Tailwind arbitrary width/height classes including variants", () => {
    const re = loadContainerRe();
    const line = `className="w-[320px] md:h-[40rem] min-w-[44px] max-h-[80vh] sm:w-[12em]"`;
    const hits: Array<{ variant?: string; prop: string; val: string }> = [];
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      hits.push({ variant: m[1], prop: m[2], val: m[3] });
    }
    expect(hits).toEqual(
      expect.arrayContaining([
        { variant: undefined, prop: "w", val: "320px" },
        { variant: "md", prop: "h", val: "40rem" },
        { variant: undefined, prop: "min-w", val: "44px" },
        { variant: undefined, prop: "max-h", val: "80vh" },
        { variant: "sm", prop: "w", val: "12em" },
      ]),
    );
  });
});
