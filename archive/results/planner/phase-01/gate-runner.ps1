Param([string]$Cmd, [string]$Label)
$ts = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "[$Label] START_TS=$ts"
$base = 'D:\oandO04072026'
$out = "$base/results/planner/phase-01/$Label/$Label-stdout.log"
$err = "$base/results/planner/phase-01/$Label/$Label-stderr.log"
Set-Location $base
if ($Cmd -eq 'typecheck') {
  & pnpm --filter oando-site run typecheck 1>$out 2>$err
} elseif ($Cmd -eq 'lint') {
  & pnpm --filter oando-site run lint --max-warnings=0 1>$out 2>$err
} elseif ($Cmd -eq 'vitest-smoke') {
  & pnpm --filter oando-site run test:planner 1>$out 2>$err
} else {
  Write-Output "[$Label] UNKNOWN_CMD=$Cmd"
  exit 99
}
$ec = $LASTEXITCODE
$end = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')
Write-Output "[$Label] END_TS=$end"
Write-Output "[$Label] EXIT=$ec"
