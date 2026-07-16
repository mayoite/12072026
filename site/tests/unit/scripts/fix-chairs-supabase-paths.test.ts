// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const scriptPath = path.join(siteRoot, "scripts/fix-chairs-supabase-paths.ts");

function remapPathLogic(p: string, destDirExists: boolean, webpFiles: string[]): string | null {
  const match = p.match(/^\/images\/chairs\/([^/]+)\/(.+)\.(jpe?g|png)$/i);
  if (!match) return null;
  const slug = match[1]!;
  const destSlug = `oando-seating--${slug}`;
  if (!destDirExists) return null;
  const files = [...webpFiles].filter((f) => f.endsWith(".webp")).sort();
  const numMatch = match[2]!.match(/(\d+)/);
  if (!numMatch) return `/images/catalog/${destSlug}/${files[0]}`;
  const num = parseInt(numMatch[1]!, 10);
  const webpFile = `image-${num.toString().padStart(2, "0")}.webp`;
  if (files.includes(webpFile)) return `/images/catalog/${destSlug}/${webpFile}`;
  return files[0] ? `/images/catalog/${destSlug}/${files[0]}` : null;
}

describe("fix-chairs-supabase-paths (name-mirror)", () => {
  it("documents chairs→catalog seating remap and webp conversion", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("/images/chairs/");
    expect(src).toContain("oando-seating--");
    expect(src).toContain(".webp");
    expect(src).toContain("flagship_image");
  });

  it("remapPath maps numbered chair jpgs to catalog webp", () => {
    expect(remapPathLogic("/other/x.jpg", true, ["image-01.webp"])).toBeNull();
    expect(
      remapPathLogic("/images/chairs/alpha/photo-2.jpg", true, ["image-01.webp", "image-02.webp"]),
    ).toBe("/images/catalog/oando-seating--alpha/image-02.webp");
    expect(remapPathLogic("/images/chairs/beta/x.png", false, ["image-01.webp"])).toBeNull();
  });
});
