/**
 * One-shot: rewrite lucide-react imports → @phosphor-icons/react
 * Run: node scripts/migrate-lucide-to-phosphor.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");

/** @type {Record<string, string>} */
export const ICON_MAP = {
  AlertCircle: "WarningCircle",
  AlertTriangle: "Warning",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  ArrowUpRight: "ArrowUpRight",
  BookOpen: "BookOpen",
  Bot: "Robot",
  Box: "Cube",
  Briefcase: "Briefcase",
  Building2: "Buildings",
  Check: "Check",
  CheckCircle2: "CheckCircle",
  ChevronDown: "CaretDown",
  ChevronLeft: "CaretLeft",
  ChevronRight: "CaretRight",
  CircleAlert: "WarningCircle",
  Clock: "Clock",
  Clock3: "Clock",
  Cloud: "Cloud",
  CloudOff: "CloudSlash",
  Compass: "Compass",
  DoorOpen: "DoorOpen",
  Eraser: "Eraser",
  GraduationCap: "GraduationCap",
  Grid3x3: "GridNine",
  GripHorizontal: "DotsSix",
  GripVertical: "DotsSixVertical",
  Hash: "Hash",
  ImageUp: "Image",
  Info: "Info",
  Keyboard: "Keyboard",
  LayoutDashboard: "SquaresFour",
  LayoutGrid: "SquaresFour",
  LayoutTemplate: "Layout",
  Loader2: "CircleNotch",
  Lock: "Lock",
  LucideIcon: "Icon",
  Mail: "Envelope",
  MapPin: "MapPin",
  Maximize2: "ArrowsOut",
  MessageCircle: "ChatCircle",
  MessageSquare: "Chat",
  Moon: "Moon",
  MoreHorizontal: "DotsThree",
  MousePointer2: "Cursor",
  MousePointerClick: "CursorClick",
  Package: "Package",
  PanelLeftClose: "SidebarSimple",
  PanelLeftOpen: "Sidebar",
  PanelRightClose: "SidebarSimple",
  PanelRightOpen: "Sidebar",
  PencilRuler: "PencilRuler",
  Phone: "Phone",
  Plus: "Plus",
  Redo2: "ArrowClockwise",
  RefreshCw: "ArrowsClockwise",
  RotateCcw: "ArrowCounterClockwise",
  Save: "FloppyDisk",
  Search: "MagnifyingGlass",
  Send: "PaperPlaneTilt",
  Settings: "Gear",
  ShieldAlert: "ShieldWarning",
  ShieldCheck: "ShieldCheck",
  Sparkles: "Sparkle",
  Star: "Star",
  Sun: "Sun",
  Trash2: "Trash",
  Undo2: "ArrowCounterClockwise",
  Unlock: "LockOpen",
  UploadCloud: "CloudArrowUp",
  User: "User",
  UserCircle: "UserCircle",
  Users: "Users",
  Wand2: "MagicWand",
  X: "X",
  Zap: "Lightning",
};

export function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) out.push(p);
  }
  return out;
}

export function rewriteFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  if (!src.includes("lucide-react")) return false;

  // type-only LucideIcon
  src = src.replace(
    /import\s+type\s+\{\s*LucideIcon\s*\}\s+from\s+["']lucide-react["']\s*;?/g,
    'import type { Icon } from "@phosphor-icons/react";',
  );
  src = src.replace(/\bLucideIcon\b/g, "Icon");

  // Combined type + value imports from lucide
  src = src.replace(
    /import\s+(type\s+)?\{([^}]+)\}\s+from\s+["']lucide-react["']\s*;?/g,
    (_m, _type, body) => {
      const parts = body.split(",").map((s) => s.trim()).filter(Boolean);
      const mapped = [];
      for (const part of parts) {
        const typeOnly = part.startsWith("type ");
        const name = part.replace(/^type\s+/, "").trim();
        if (name === "LucideIcon" || name === "Icon") {
          mapped.push(typeOnly || name === "LucideIcon" ? "type Icon" : "type Icon");
          continue;
        }
        const ph = ICON_MAP[name] ?? name;
        if (ph === name && !ICON_MAP[name]) {
          console.warn(`  unmapped icon: ${name} in ${path.relative(siteRoot, filePath)}`);
        }
        if (name === ph) mapped.push(name);
        else mapped.push(`${ph} as ${name}`);
      }
      // Prefer phosphor names without alias when possible for cleanliness —
      // keep `as LucideName` so JSX <Loader2 /> etc. still compiles without JSX edits.
      const unique = [...new Set(mapped)];
      return `import { ${unique.join(", ")} } from "@phosphor-icons/react";`;
    },
  );

  // leftover bare package references
  if (src.includes("lucide-react")) {
    console.warn(`  still contains lucide-react: ${path.relative(siteRoot, filePath)}`);
    return false;
  }

  fs.writeFileSync(filePath, src, "utf8");
  return true;
}

function isMainModule() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  const files = walk(siteRoot);
  let n = 0;
  for (const f of files) {
    if (rewriteFile(f)) {
      n++;
      console.log("rewrote", path.relative(siteRoot, f));
    }
  }
  console.log(`done: ${n} files`);
}
