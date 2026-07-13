/**
 * Fix invalid Phosphor export names left over from lucide migration aliases.
 * Rewrites: import { BadName as Alias } / import { BadName } from "@phosphor-icons/react"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Lucide residual or wrong names → Phosphor export */
const FIX = {
  ChevronUp: "CaretUp",
  ChevronDown: "CaretDown",
  ChevronLeft: "CaretLeft",
  ChevronRight: "CaretRight",
  GitCompareArrows: "GitDiff",
  ShoppingCart: "ShoppingCart",
  Filter: "Funnel",
  SlidersHorizontal: "FadersHorizontal",
  Share2: "ShareNetwork",
  Minus: "Minus",
  FileText: "FileText",
  FolderOpen: "FolderOpen",
  CalendarDays: "CalendarBlank",
  TrendingUp: "TrendUp",
  Eye: "Eye",
  EyeOff: "EyeSlash",
  Archive: "Archive",
  Pencil: "PencilSimple",
  ExternalLink: "ArrowSquareOut",
  Menu: "List",
  BarChart3: "ChartBar",
  Boxes: "Package",
  ClipboardList: "ClipboardText",
  Flag: "Flag",
  FolderKanban: "Kanban",
  Map: "MapTrifold",
  Palette: "Palette",
  PenSquare: "NotePencil",
  Shapes: "Polygon",
  Library: "Books",
  Layers3: "Stack",
  Layers2: "Stack",
  Layers: "Stack",
  Ruler: "Ruler",
  Lightbulb: "Lightbulb",
  Armchair: "Armchair",
  Move: "ArrowsOutCardinal",
  ZoomIn: "MagnifyingGlassPlus",
  PencilLine: "PencilSimpleLine",
  Hand: "Hand",
  Square: "Square",
  BoxSelect: "Selection",
  AppWindow: "AppWindow",
  PenTool: "PenNib",
  BadgeCheck: "SealCheck",
  CopyPlus: "CopySimple",
  Download: "DownloadSimple",
  Import: "DownloadSimple",
  Upload: "UploadSimple",
  Presentation: "Presentation",
  BrickWall: "Wall",
  RectangleHorizontal: "Rectangle",
  PanelTop: "Browser",
  FileUp: "FileArrowUp",
  HelpCircle: "Question",
  MoreVertical: "DotsThreeVertical",
  MessageSquareText: "ChatText",
  ArrowUp: "ArrowUp",
  Home: "House",
  Copy: "Copy",
  Command: "Command",
  GitBranch: "GitBranch",
  Puzzle: "PuzzlePiece",
  Database: "Database",
  Globe: "Globe",
  TestTube: "TestTube",
  Rocket: "Rocket",
  Shield: "Shield",
  GitCommit: "GitCommit",
  Monitor: "Monitor",
  Wrench: "Wrench",
  Folder: "Folder",
  FileCode: "FileCode",
  GitPullRequest: "GitPullRequest",
  Key: "Key",
  Server: "HardDrives",
  ShoppingBag: "ShoppingBag",
  Code: "Code",
  Gauge: "Gauge",
  Award: "Trophy",
  Target: "Target",
  ListChecks: "ListChecks",
  History: "ClockCounterClockwise",
  Image: "Image",
};

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name === "generated-documents") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function fixImportBody(body) {
  return body
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      // "type Icon" | "Foo as Bar" | "Foo"
      if (part.startsWith("type ")) return part;
      const m = part.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) return part;
      const [, name, alias] = m;
      const fixed = FIX[name] ?? name;
      if (alias) {
        // Keep local alias for JSX (e.g. CaretUp as ChevronUp if alias is ChevronUp)
        if (fixed === alias) return fixed;
        return `${fixed} as ${alias}`;
      }
      if (fixed === name) return name;
      // No alias: export under Phosphor name; JSX must use Phosphor name OR we alias to old name
      return `${fixed} as ${name}`;
    })
    .join(", ");
}

let n = 0;
for (const file of walk(siteRoot)) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("@phosphor-icons/react") && !src.includes("lucide-react")) continue;

  // Test mocks: lucide-react → phosphor
  src = src.replace(/["']lucide-react["']/g, '"@phosphor-icons/react"');

  const next = src.replace(
    /import\s+(type\s+)?\{([^}]+)\}\s+from\s+["']@phosphor-icons\/react["']\s*;?/g,
    (_m, typeKw, body) => {
      const fixed = fixImportBody(body);
      return `import ${typeKw || ""}{ ${fixed} } from "@phosphor-icons/react";`;
    },
  );

  if (next !== src) {
    fs.writeFileSync(file, next, "utf8");
    n++;
    console.log("fixed", path.relative(siteRoot, file));
  }
}
console.log(`fixed files: ${n}`);
