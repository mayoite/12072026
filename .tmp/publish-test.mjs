import fs from "node:fs";

const base = JSON.parse(fs.readFileSync("E:/12072026/site/inventory/descriptors/side-table-001.json", "utf8"));
const TEST_SLUG = "zzz-e2e-probe-001";
const payload = {
  ...base,
  slug: TEST_SLUG,
  sku: "OFL-E2E-001",
  id: "f81e3a1b-16f4-4000-8000-0000000000e2",
  createdBy: "e2e-probe",
};

const res = await fetch("http://localhost:3200/api/admin/svg-editor/", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});
const text = await res.text();
console.log("PUBLISH status:", res.status);
console.log("PUBLISH body:", text.slice(0, 500));

// check disk
const dir = "E:/12072026/site/inventory/descriptors";
const written = fs.readdirSync(dir).filter((f) => f.startsWith(TEST_SLUG));
console.log("DISK files for test slug:", JSON.stringify(written));

// check planner API surfaces it
const api = await fetch("http://localhost:3200/api/planner/catalog/svg-blocks");
const j = await api.json();
const found = (j.items || []).find((it) => it.slug === TEST_SLUG);
console.log("PLANNER API sees test slug:", found ? `YES (name=${found.name})` : "NO");
console.log("PLANNER total items now:", (j.items || []).length);
