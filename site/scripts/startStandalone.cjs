const path = require("node:path");

const { loadEnvLocal } = require("./loadEnvLocal.cjs");

loadEnvLocal();

require(path.join(__dirname, "..", ".next", "standalone", "site", "server.js"));
