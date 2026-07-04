#!/usr/bin/env node
/**
 * Phase 4c — machine-translate marketing namespaces from en.json into de/es/fr.
 * Requires OPENROUTER_API_KEY_PRIMARY in repo-root or site .env.local.
 * Output is committed; CI uses check:i18n:parity only (no live API).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvLocal } = require("./loadEnvLocal.cjs");

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptsDir, "..");
const messagesDir = path.join(siteRoot, "i18n", "messages");
const manifest = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "i18n", "marketing-parity-manifest.json"), "utf8"),
);

const LANG = { de: "German", es: "Spanish", fr: "French" };
const REQUEST_TIMEOUT_MS = 300_000;

loadEnvLocal();

function deepMergeStructure(base, overrides) {
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === "object" &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMergeStructure(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function parseJsonResponse(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(payload);
}

function namespaceLooksTranslated(namespace, localeMessages, enMessages) {
  if (!localeMessages || !enMessages) return false;

  if (namespace === "legal") {
    const enPrivacyTitle = enMessages.privacy?.title;
    const localePrivacyTitle = localeMessages.privacy?.title;
    return (
      typeof enPrivacyTitle === "string" &&
      typeof localePrivacyTitle === "string" &&
      localePrivacyTitle !== enPrivacyTitle
    );
  }

  const probes = [
    ["heroTitle", "heroTitle"],
    ["heroTitleLead", "heroTitleLead"],
    ["headlineLead", "headlineLead"],
    ["subtitle", "subtitle"],
    ["metadataTitle", "metadataTitle"],
  ];

  for (const [enKey, localeKey] of probes) {
    const enValue = enMessages[enKey];
    const localeValue = localeMessages[localeKey];
    if (typeof enValue === "string" && typeof localeValue === "string" && localeValue !== enValue) {
      return true;
    }
  }

  const enHeroLine = enMessages.hero?.title?.[0];
  const localeHeroLine = localeMessages.hero?.title?.[0];
  return (
    typeof enHeroLine === "string" &&
    typeof localeHeroLine === "string" &&
    localeHeroLine !== enHeroLine
  );
}

async function callOpenRouter(payload, locale, label) {
  const apiKey = process.env.OPENROUTER_API_KEY_PRIMARY?.trim();
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY_PRIMARY is required for i18n:translate:deferred-locales");
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || "openrouter/free";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://oando.co.in",
        "X-Title": "Oando i18n deferred locale sync",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              `Translate user-visible string values in the JSON object to ${LANG[locale]}. ` +
              "Return ONLY valid JSON with the same keys and identical nesting. " +
              "Do not translate: object keys, href/src paths, URLs, emails, phone numbers, " +
              "brand or company names (Oando, One&Only, Planner, Titan, HDFC, etc.), " +
              "stat values like 14+ or 120+, or image file names.",
          },
          {
            role: "user",
            content: JSON.stringify(payload, null, 2),
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenRouter ${response.status} (${label}): ${body.slice(0, 400)}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`OpenRouter error (${label}): ${JSON.stringify(data.error)}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error(`OpenRouter returned no content for ${label}`);
    }

    return parseJsonResponse(content);
  } finally {
    clearTimeout(timer);
  }
}

async function translateNamespace(namespace, enSubtree, locale) {
  if (namespace === "legal") {
    const translated = {};
    for (const section of ["privacy", "terms", "imprint", "refund"]) {
      process.stdout.write(`  ${locale}/legal.${section}...\n`);
      const sectionResult = await callOpenRouter({ [section]: enSubtree[section] }, locale, `${locale}/legal.${section}`);
      translated[section] = sectionResult[section] ?? sectionResult;
    }
    return translated;
  }

  const parsed = await callOpenRouter({ [namespace]: enSubtree }, locale, `${locale}/${namespace}`);
  return parsed[namespace] ?? parsed;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));
  const namespaces = manifest.allMarketingNamespaces;

  for (const locale of manifest.deferredLocales) {
    const file = path.join(messagesDir, `${locale}.json`);
    const merged = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

    for (const namespace of namespaces) {
      if (namespaceLooksTranslated(namespace, merged[namespace], en[namespace])) {
        process.stdout.write(`Skip ${locale}/${namespace} (already translated)\n`);
        continue;
      }

      process.stdout.write(`Translating ${locale}/${namespace}...\n`);
      const translated = await translateNamespace(namespace, en[namespace], locale);
      merged[namespace] = deepMergeStructure(en[namespace], translated);
      fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
    }

    process.stdout.write(`Finished ${locale}.json\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
