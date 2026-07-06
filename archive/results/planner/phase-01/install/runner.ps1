$ts = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "START_TS=$ts"
$base = 'D:\oandO04072026'
$stdout = Join-Path $base 'results/planner/phase-01/install/add-stdout.log'
$stderr = Join-Path $base 'results/planner/phase-01/install/add-stderr.log'
# Drop @vercel-labs/json-render per orchestrator unblock message (option A).
# Tier-1 install set in dependency order, single transaction.
Set-Location $base
pnpm --filter oando-site add `
  @flatten-js/core@latest `
  polygon-clipping@latest `
  svgo@latest `
  @resvg/resvg-js@latest `
  @puckeditor/core@latest `
  @ark-ui/react@latest `
  react-aria-components@latest `
  zod@latest `
  @phosphor-icons/react@latest `
  1>$stdout 2>$stderr
$ec = $LASTEXITCODE
$end = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "END_TS=$end"
Write-Output "EXIT=$ec"
