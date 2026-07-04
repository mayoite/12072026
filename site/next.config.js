const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");

const withNextIntl = createNextIntlPlugin(
  // next-intl looks for this file by default; explicit for clarity.
  "./i18n/request.ts"
);

const baseConfig = require("./config/build/next.config.js");

const monorepoRoot = path.join(__dirname, "..");

module.exports = withNextIntl({
  ...baseConfig,
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
});
