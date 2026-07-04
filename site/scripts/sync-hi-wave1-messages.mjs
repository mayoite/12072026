#!/usr/bin/env node
/**
 * Copy Wave 1 marketing namespaces from en.json into hi.json (Phase 4b scaffold).
 * Applies light Hindi overrides for visible hero/title keys.
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
const hi = JSON.parse(fs.readFileSync(path.join(messagesDir, "hi.json"), "utf8"));

const HI_OVERRIDES = {
  home: {
    title: "ओआंडो प्लेटफॉर्म",
    subtitle: "पेशेवर स्पेस प्लानिंग और डिज़ाइन टूल",
    getStarted: "शुरू करें",
    hero: {
      kicker: "पैन-इंडिया · 2011 से",
      primaryCta: { label: "उत्पाद देखें", href: "/products" },
      secondaryCta: { label: "कोटेशन अनुरोध", href: "/#contact" },
    },
  },
  about: {
    heroTitle: "वन एंड ओनली के बारे में",
    heroSubtitle:
      "हम व्यावहारिक, टिकाऊ और स्केलेबल वर्कस्पेस सिस्टम डिज़ाइन और डिलीवर करते हैं।",
  },
  contact: {
    heroTitle: "संपर्क करें",
    heroSubtitle: "अपनी वर्कस्पेस आवश्यकता साझा करें और हमारी टीम अगले कदम बताएगी।",
  },
  products: {
    headlineLead: "वर्कस्पेस",
    headlineAccent: "उत्पाद",
    heroSubtitle: "लाइव कैटलॉग से श्रेणियां ब्राउज़ करें और अपनी टीम के लिए सही मिक्स चुनें।",
  },
  solutions: {
    heroTitleLead: "वर्कस्पेस",
    heroTitleAccent: "समाधान",
    heroSubtitle: "योजना से डिलीवरी तक — एक टीम, स्पष्ट समयरेखा, मापनीय परिणाम।",
  },
};

function deepMerge(base, overrides) {
  if (!overrides) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    out[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? deepMerge(base?.[key] ?? {}, value)
        : value;
  }
  return out;
}

for (const namespace of manifest.wave1Namespaces) {
  hi[namespace] = deepMerge(structuredClone(en[namespace]), HI_OVERRIDES[namespace]);
}

fs.writeFileSync(path.join(messagesDir, "hi.json"), `${JSON.stringify(hi, null, 2)}\n`, "utf8");
console.log(`Updated hi.json wave1 namespaces: ${manifest.wave1Namespaces.join(", ")}`);
