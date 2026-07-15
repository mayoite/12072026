# Post-success: remove Failures.md entry and tick Admin/Planner checklists.
# Invoked only when admin-svg-retire-restore.spec.ts exits 0.

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $siteRoot

$failuresPath = Join-Path $repoRoot "Failures.md"
$adminChecklist = Join-Path $repoRoot "plan\Admin\CHECKLIST.md"
$plannerChecklist = Join-Path $repoRoot "plan\Planner\CHECKLIST.md"

$failures = Get-Content -Path $failuresPath -Raw -Encoding utf8
$sectionPattern = '(?s)\r?\n---\r?\n\r?\n## OPEN: Planner retire/restore canvas[^\r\n]*\r?\n(?:.*?\r?\n)*?(?=\r?\n---\r?\n|$)'
$updatedFailures = [regex]::Replace($failures, $sectionPattern, '', 1)
if ($updatedFailures -eq $failures) {
  Write-Warning "Failures.md section not found — skipped removal"
} else {
  Set-Content -Path $failuresPath -Value $updatedFailures.TrimEnd() + "`n" -Encoding utf8 -NoNewline
  Write-Host "Removed Planner retire/restore canvas from Failures.md"
}

function Set-Checked($path, $needle) {
  $text = Get-Content -Path $path -Raw -Encoding utf8
  $escaped = [regex]::Escape($needle)
  $pattern = "- \[ \] ($escaped)"
  if ($text -notmatch $pattern) {
    Write-Warning "Checklist line not found in ${path}: $needle"
    return
  }
  $text = [regex]::Replace($text, $pattern, "- [x] `$1", 1)
  Set-Content -Path $path -Value $text -Encoding utf8 -NoNewline
  Write-Host "Checked: $needle"
}

Set-Checked $adminChecklist "Retired product blocked on live Planner canvas"
Set-Checked $plannerChecklist "Retired admin SVG hidden from guest Planner inventory"