import fs from "node:fs";

const f = process.argv[2];
if (!f) {
  console.error("Usage: node read-transcript.mjs <file-path> [n]");
  process.exit(1);
}
const n = Number(process.argv[3] ?? 59);

const lines = fs.readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean);
for (const l of lines.slice(-n)) {
  let o;
  try { o = JSON.parse(l); } catch { continue; }
  const m = o.message;
  if (!m || !m.role) continue;
  const c = m.content;
  if (Array.isArray(c)) {
    for (const p of c) {
      if (p.type === "text") console.log(`[${m.role}] ${p.text.slice(0, 600)}`);
      else if (p.type === "tool_use") console.log(`[${m.role}:tool] ${p.name}`);
    }
  } else if (typeof c === "string") {
    console.log(`[${m.role}] ${c.slice(0, 600)}`);
  }
}
