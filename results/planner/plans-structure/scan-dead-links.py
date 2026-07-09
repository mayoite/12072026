"""Scan live MD for references to dead Plans/ paths."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"D:\OandO07072026")
SKIP_DIRS = {
    "node_modules",
    "archive",
    ".git",
    "results",
    "site",
    ".next",
    "dist",
}
DEAD = re.compile(
    r"Plans/(01-execution|00-governance|02-recovery|02-proposed)[^\s)\]`\"']*"
)

hits: list[tuple[str, str]] = []
for path in ROOT.rglob("*.md"):
    if any(part in SKIP_DIRS for part in path.parts):
        continue
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        continue
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    for m in DEAD.finditer(text):
        hits.append((rel, m.group(0)[:120]))

for rel, h in sorted(set(hits)):
    print(f"{rel} => {h}")
print(f"count={len(set(hits))}")
