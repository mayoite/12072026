#!/usr/bin/env node

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

const REQUIRED_PUBLIC_ENVS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const REQUIRED_SERVER_ENVS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const PRODUCTION_REQUIRED_ENVS = [
  "PRODUCTS_DATABASE_URL",
  "SUPABASE_AUTH_DATABASE_URL",
];

const FORBIDDEN_PUBLIC_SECRET_PATTERNS = [
  /^NEXT_PUBLIC_.*SECRET/i,
  /^NEXT_PUBLIC_.*SERVICE_ROLE/i,
  /^NEXT_PUBLIC_.*PRIVATE/i,
  /^NEXT_PUBLIC_.*TOKEN/i,
];

function hasValue(name) {
  return Boolean(process.env[name]?.trim());
}

const missingPublic = REQUIRED_PUBLIC_ENVS.filter((name) => !hasValue(name));
const missingServer = REQUIRED_SERVER_ENVS.filter((name) => !hasValue(name));
const missingProduction =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_REQUIRED_ENVS.filter((name) => !hasValue(name))
    : [];
const forbiddenPublic = Object.keys(process.env).filter((name) =>
  FORBIDDEN_PUBLIC_SECRET_PATTERNS.some((pattern) => pattern.test(name)),
);

const result = {
  ok:
    missingPublic.length === 0 &&
    missingServer.length === 0 &&
    missingProduction.length === 0 &&
    forbiddenPublic.length === 0,
  checkedAt: new Date().toISOString(),
  requiredPublic: REQUIRED_PUBLIC_ENVS,
  requiredServer: REQUIRED_SERVER_ENVS,
  productionRequired: PRODUCTION_REQUIRED_ENVS,
  missingPublic,
  missingServer,
  missingProduction,
  forbiddenPublic,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

if (!result.ok) {
  process.exitCode = 1;
}
