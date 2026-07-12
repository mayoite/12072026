const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const withNextIntl = createNextIntlPlugin(
  // next-intl looks for this file by default; explicit for clarity.
  "./i18n/request.ts"
);

const baseConfig = require("./config/build/next.config.js");

const monorepoRoot = path.join(/* turbopackIgnore: true */ __dirname, "..");

module.exports = withNextIntl({
  ...baseConfig,
  // NFT still monorepo-aware; default dev is webpack (see package.json "dev").
  // turbo (dev:turbo) inherits baseConfig.turbopack — use sparingly (RAM risk).
  outputFileTracingRoot: monorepoRoot,
});
