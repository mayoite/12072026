const fs = require("node:fs");
const path = require("node:path");
const { config: loadEnv } = require("dotenv");

const siteRoot = path.join(__dirname, "..");
const repoRoot = path.join(siteRoot, "..");

/** Load repo-root then site-local `.env.local` (site overrides). Also `.env`. */
function loadEnvLocal() {
  for (const file of [
    path.join(repoRoot, ".env.local"),
    path.join(siteRoot, ".env.local"),
    path.join(siteRoot, ".env"),
  ]) {
    if (fs.existsSync(file)) {
      loadEnv({ path: file, override: false, quiet: true });
    }
  }
  loadEnv({ override: false, quiet: true });

  if (
    !process.env.OPENROUTER_API_KEY_PRIMARY?.trim() &&
    process.env.OPENROUTER_API_KEY?.trim()
  ) {
    process.env.OPENROUTER_API_KEY_PRIMARY = process.env.OPENROUTER_API_KEY.trim();
  }
}

module.exports = { loadEnvLocal, siteRoot, repoRoot };
