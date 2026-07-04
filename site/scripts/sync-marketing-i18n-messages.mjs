#!/usr/bin/env node
/**
 * Merge exported marketing copy into i18n/messages/en.json (Phase 4a scaffold).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const enFile = path.join(siteRoot, "i18n", "messages", "en.json");
const exportScript = path.join(scriptsDir, "lib", "exportMarketingCopy.ts");

const marketingJson = execFileSync(
  process.execPath,
  [path.join(siteRoot, "node_modules", "tsx", "dist", "cli.mjs"), exportScript],
  {
    cwd: siteRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  },
);

const marketing = JSON.parse(marketingJson);
const en = JSON.parse(fs.readFileSync(enFile, "utf8"));

const merged = {
  ...en,
  ...marketing,
  home: {
    ...en.home,
    ...marketing.home,
  },
};

fs.writeFileSync(enFile, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
console.log(`Updated ${path.relative(siteRoot, enFile)} with ${Object.keys(marketing).length} marketing namespaces`);
