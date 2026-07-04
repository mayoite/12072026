#!/usr/bin/env node
/**
 * Merge committed deferred locale overrides into de/es/fr message files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const messagesDir = path.join(siteRoot, "i18n", "messages");
const overridesRoot = path.join(siteRoot, "i18n", "deferred-overrides");
const manifest = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "i18n", "marketing-parity-manifest.json"), "utf8"),
);

function deepMerge(base, overrides) {
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && out[key] && typeof out[key] === "object" && !Array.isArray(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

for (const locale of manifest.deferredLocales) {
  const localeDir = path.join(overridesRoot, locale);
  if (!fs.existsSync(localeDir)) {
    console.warn(`No overrides for ${locale} at ${localeDir}`);
    continue;
  }

  const file = path.join(messagesDir, `${locale}.json`);
  const merged = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

  for (const entry of fs.readdirSync(localeDir).filter((name) => name.endsWith(".json"))) {
    const namespace = entry.replace(/\.json$/, "");
    const overrides = JSON.parse(fs.readFileSync(path.join(localeDir, entry), "utf8"));
    merged[namespace] = deepMerge(merged[namespace] ?? {}, overrides);
  }

  fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`Applied overrides → ${locale}.json`);
}
