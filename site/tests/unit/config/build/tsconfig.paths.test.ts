// @vitest-environment node
/**
 * Contract: site/tsconfig.json path aliases used by product imports.
 * @/types/* → config/database/types/* ; @/features/* present.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve(__dirname, "../../../..");
const siteTsconfigPath = path.join(siteRoot, "tsconfig.json");
const buildTsconfigPath = path.join(siteRoot, "config", "build", "tsconfig.json");

type Tsconfig = {
  extends?: string;
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
};

describe("tsconfig paths", () => {
  it("site/tsconfig.json and config/build/tsconfig.json exist and parse as JSON", () => {
    expect(fs.existsSync(siteTsconfigPath), siteTsconfigPath).toBe(true);
    expect(fs.existsSync(buildTsconfigPath), buildTsconfigPath).toBe(true);

    expect(() =>
      JSON.parse(fs.readFileSync(siteTsconfigPath, "utf8")),
    ).not.toThrow();
    expect(() =>
      JSON.parse(fs.readFileSync(buildTsconfigPath, "utf8")),
    ).not.toThrow();
  });

  it("site/tsconfig.json extends config/build/tsconfig.json", () => {
    const tsconfig = JSON.parse(
      fs.readFileSync(siteTsconfigPath, "utf8"),
    ) as Tsconfig;
    expect(tsconfig.extends).toBe("./config/build/tsconfig.json");
  });

  it("maps @/types/* to config/database/types/*", () => {
    const tsconfig = JSON.parse(
      fs.readFileSync(siteTsconfigPath, "utf8"),
    ) as Tsconfig;
    const paths = tsconfig.compilerOptions?.paths;
    expect(paths, "compilerOptions.paths required").toBeDefined();
    const typesMap = paths?.["@/types/*"];
    expect(Array.isArray(typesMap), "@/types/* must be array").toBe(true);
    expect(typesMap).toContain("./config/database/types/*");
  });

  it("maps @/features/* to features/*", () => {
    const tsconfig = JSON.parse(
      fs.readFileSync(siteTsconfigPath, "utf8"),
    ) as Tsconfig;
    const paths = tsconfig.compilerOptions?.paths;
    expect(paths, "compilerOptions.paths required").toBeDefined();
    const featuresMap = paths?.["@/features/*"];
    expect(Array.isArray(featuresMap), "@/features/* must be array").toBe(true);
    expect(featuresMap).toContain("./features/*");
  });

  it("mapped @/types and @/features targets resolve under site/", () => {
    const typesDir = path.join(siteRoot, "config", "database", "types");
    const featuresDir = path.join(siteRoot, "features");
    expect(fs.existsSync(typesDir), typesDir).toBe(true);
    expect(fs.statSync(typesDir).isDirectory()).toBe(true);
    expect(fs.existsSync(featuresDir), featuresDir).toBe(true);
    expect(fs.statSync(featuresDir).isDirectory()).toBe(true);
  });
});
