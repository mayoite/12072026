# Admin retire → restore → Planner canvas catalog proof.
# Requires DEV_AUTH_BYPASS=1 (Playwright webServer starts dev:turbo).

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $siteRoot
Set-Location $siteRoot

$evidenceDir = Join-Path $repoRoot "results/admin/retire-restore-canvas"
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

$env:DEV_AUTH_BYPASS = "1"

Write-Host "Ensuring side-table-001 lifecycle precondition (live)..."
node scripts/ensure-retire-restore-precondition.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Running admin-svg-retire-restore.spec.ts (DEV_AUTH_BYPASS=1)..."
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/admin-svg-retire-restore.spec.ts --reporter=list
$exit = $LASTEXITCODE

$runMeta = @{
  command = "pnpm run test:e2e:admin-retire-restore"
  exitCode = $exit
  devAuthBypass = "1"
  spec = "tests/e2e/admin-svg-retire-restore.spec.ts"
  at = (Get-Date).ToString("o")
  status = if ($exit -eq 0) { "pass" } else { "fail" }
} | ConvertTo-Json -Depth 4

Set-Content -Path (Join-Path $evidenceDir "run-meta.json") -Value $runMeta -Encoding utf8

if ($exit -eq 0) {
  Write-Host "Playwright passed — updating Failures.md and checklists..."
  & (Join-Path $siteRoot "scripts/complete-admin-retire-restore-proof.ps1")
}

exit $exit