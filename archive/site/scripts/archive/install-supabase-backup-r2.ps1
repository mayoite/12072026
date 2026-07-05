# Superseded — use GitHub Actions instead.
# See `.github/workflows/supabase-backup-r2.yml`
#
# Install daily Supabase → R2 backup (pg_dump products + admin).
# Requires: repo-root .env.local with Postgres URLs + R2 keys; PostgreSQL client tools.

param(
  [int]$Hour = 2,
  [int]$Minute = 0
)

$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $siteRoot
$taskName = 'Oando-Supabase-Backup-R2'
$logPath = Join-Path $repoRoot 'site\backups\supabase-r2-backup.log'

$runner = @"
Set-Location -LiteralPath '$repoRoot'
`$ts = Get-Date -Format 'u'
Add-Content -LiteralPath '$logPath' -Value "`$ts  START"
pnpm --filter oando-site run backup:supabase:r2 2>&1 | Add-Content -LiteralPath '$logPath'
Add-Content -LiteralPath '$logPath' -Value "`$ts  END exit=`$LASTEXITCODE"
exit `$LASTEXITCODE
"@

$runnerPath = Join-Path $env:TEMP 'oando-supabase-backup-r2-runner.ps1'
Set-Content -LiteralPath $runnerPath -Value $runner -Encoding UTF8

$action = New-ScheduledTaskAction -Execute 'pwsh.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runnerPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At (Get-Date -Hour $Hour -Minute $Minute -Second 0)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Write-Host "Scheduled task registered: $taskName (daily at $($Hour.ToString('00')):$($Minute.ToString('00')))"
Write-Host "Log: $logPath"
Write-Host "Runner: $runnerPath"
