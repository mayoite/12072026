#!/usr/bin/env node
/**
 * Scaffold de / es / fr message files from en.json (Phase 4c).
 * Preserves existing translated values; fills structure from en for new keys only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const messagesDir = path.join(siteRoot, "i18n", "messages");
const manifest = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "i18n", "marketing-parity-manifest.json"), "utf8"),
);

const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

function mergePreserveTranslations(existing, enSource) {
  if (enSource === null || typeof enSource !== "object") {
    return existing !== undefined ? existing : enSource;
  }
  if (Array.isArray(enSource)) {
    if (!Array.isArray(existing) || existing.length !== enSource.length) {
      return structuredClone(enSource);
    }
    return enSource.map((item, index) => mergePreserveTranslations(existing[index], item));
  }

  const out = {};
  for (const [key, enValue] of Object.entries(enSource)) {
    const existingValue = existing?.[key];
    if (enValue !== null && typeof enValue === "object") {
      out[key] = mergePreserveTranslations(existingValue, enValue);
      continue;
    }
    out[key] =
      typeof existingValue === "string" && existingValue.length > 0 && existingValue !== enValue
        ? existingValue
        : enValue;
  }
  return out;
}

function marketingSubtree(messages) {
  const out = {};
  for (const namespace of manifest.allMarketingNamespaces) {
    if (messages[namespace]) out[namespace] = structuredClone(messages[namespace]);
  }
  return out;
}

for (const locale of manifest.deferredLocales) {
  const file = path.join(messagesDir, `${locale}.json`);
  const existing = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : {};
  const merged = { ...existing };
  for (const [namespace, enSubtree] of Object.entries(marketingSubtree(en))) {
    merged[namespace] = mergePreserveTranslations(existing[namespace], enSubtree);
  }
  fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`Updated ${locale}.json with ${manifest.allMarketingNamespaces.length} marketing namespaces`);
}
