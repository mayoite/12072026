# Admin retire → restore → Planner canvas catalog proof.
# Requires DEV_AUTH_BYPASS=1 (Playwright webServer starts dev:turbo).

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $siteRoot
Set-Location $siteRoot

$evidenceDir = Join-Path $repoRoot "results/admin/retire-restore-canvas"
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

$env:DEV_AUTH_BYPASS = "1"

Write-Host "Running admin-svg-retire-restore.spec.ts (DEV_AUTH_BYPASS=1)..."
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/admin-svg-retire-restore.spec.ts --reporter=list
$exit = $LASTEXITCODE

$runMeta = @{
  command = "pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/admin-svg-retire-restore.spec.ts"
  exitCode = $exit
  devAuthBypass = "1"
  spec = "tests/e2e/admin-svg-retire-restore.spec.ts"
  at = (Get-Date).ToString("o")
} | ConvertTo-Json -Depth 4

Set-Content -Path (Join-Path $evidenceDir "run-meta.json") -Value $runMeta -Encoding utf8
exit $exit