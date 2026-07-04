/**
 * Copy .next/static and public/ into the Next.js standalone output directory.
 * Required when next.config sets output: "standalone" (DigitalOcean / bare-metal).
 */
const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.join(__dirname, "..");
const standaloneRoot = path.join(siteRoot, ".next", "standalone");
const standaloneSiteRoot = path.join(standaloneRoot, "site");
const staticSrc = path.join(siteRoot, ".next", "static");
const staticDest = path.join(standaloneRoot, ".next", "static");
const staticSiteDest = path.join(standaloneSiteRoot, ".next", "static");
const publicSrc = path.join(siteRoot, "public");
const publicDest = path.join(standaloneRoot, "public");
const publicSiteDest = path.join(standaloneSiteRoot, "public");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(standaloneRoot)) {
  console.log("[prepare-standalone] No .next/standalone output — skipping (not a standalone build).");
  process.exit(0);
}

copyRecursive(staticSrc, staticDest);
copyRecursive(publicSrc, publicDest);
if (fs.existsSync(standaloneSiteRoot)) {
  copyRecursive(staticSrc, staticSiteDest);
  copyRecursive(publicSrc, publicSiteDest);
}
console.log("[prepare-standalone] Copied static assets into .next/standalone");
