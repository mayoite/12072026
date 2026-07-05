Param([string]$Label)
$ts = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "[$Label] START_TS=$ts"
$base = 'D:\oandO04072026'
Set-Location $base
& pnpm install 1>"$base/results/planner/phase-01/install/$Label-stdout.log" 2>"$base/results/planner/phase-01/install/$Label-stderr.log"
$ec = $LASTEXITCODE
$end = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "[$Label] END_TS=$end"
Write-Output "[$Label] EXIT=$ec"
