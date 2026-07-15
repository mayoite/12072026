# Admin unauthenticated gate proof — production standalone server, no DEV_AUTH_BYPASS.
# Evidence: results/admin/production-auth/

$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $siteRoot
Set-Location $siteRoot

$evidenceDir = Join-Path $repoRoot "results/admin/production-auth"
New-Item -ItemType Directory -Force -Path $evidenceDir | Out-Null

Remove-Item Env:DEV_AUTH_BYPASS -ErrorAction SilentlyContinue
$env:NODE_ENV = "production"
$env:PLAYWRIGHT_BASE_URL = ""

Write-Host "Building standalone server (NODE_ENV=production, DEV_AUTH_BYPASS unset)..."
pnpm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Running admin-smoke.spec.ts via Playwright webServer (build && start)..."
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/admin-smoke.spec.ts --reporter=list
$exit = $LASTEXITCODE

$runMeta = @{
  command = "pnpm run build && pnpm exec playwright test tests/e2e/admin-smoke.spec.ts"
  exitCode = $exit
  nodeEnv = $env:NODE_ENV
  devAuthBypass = $null
  at = (Get-Date).ToString("o")
} | ConvertTo-Json -Depth 4

Set-Content -Path (Join-Path $evidenceDir "run-meta.json") -Value $runMeta -Encoding utf8
exit $exit