# run-evidence-cmd.ps1
#
# Generic wrapper: run any command and capture standardized evidence in repo.
#
# Output per invocation (under repo-root/results):
#   <results>/<module>/<phase>/<name>/<name>-raw.log   -- all stdout/stderr, no truncation
#   <results>/<module>/<phase>/<name>/<name>-run.json  -- metadata, exit code, times, paths
#
# Repo rules respected:
#   * Module-folder mapping  - module = failing folder.
#   * No hard-coded paths    - results/ under detected repo root; everything
#                               else is repo-relative downstream.
#   * Evidence integrity     - exit code, start/end, raw log all retained per handbook.
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [string] $Name,
    [Parameter(Mandatory = $true)] [string] $Module,
    [Parameter(Mandatory = $true)] [string] $Phase,
    [Parameter(Mandatory = $true)] [string] $Command,
    [string] $Cwd = $null,
    [string] $Operator = "Oz agent (Warp CLI session)"
)

if (-not $Cwd) { $Cwd = (Get-Location).Path }
$Cwd = (Resolve-Path $Cwd).Path

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$resultsRoot = Join-Path $repoRoot (Join-Path "results" (Join-Path $Module (Join-Path $Phase $Name)))
if (-not (Test-Path $resultsRoot)) { New-Item -ItemType Directory -Path $resultsRoot -Force | Out-Null }
$raw = Join-Path $resultsRoot "$Name-raw.log"
$run = Join-Path $resultsRoot "$Name-run.json"

# Run in sub-pwsh (or fallback) to capture exit code reliably and all streams (no ANSI bleed).
$tmp = [System.IO.Path]::GetTempFileName()
$pwsh7 = "C:\Program Files\PowerShell\7\pwsh.exe"
$usePwsh = (Test-Path $pwsh7)
if ($usePwsh) {
  $psBlock = "Set-Location -LiteralPath '$Cwd'; `$ErrorActionPreference = 'Continue'; & { $Command } *>&1 | Out-File -FilePath '$tmp' -Encoding utf8; exit `$LASTEXITCODE"
  $start = Get-Date
  $proc = Start-Process -FilePath $pwsh7 -ArgumentList @('-NoProfile', '-Command', $psBlock) -NoNewWindow -Wait -PassThru
  $end = Get-Date
  $exit = $proc.ExitCode
} else {
  # Fallback for envs without pwsh7 at standard path (e.g. tool context uses PS5.1); run in-process for capture. Per AGENTS/evidence policy.
  Set-Location -LiteralPath $Cwd
  $ErrorActionPreference = 'Continue'
  $start = Get-Date
  try {
    & { Invoke-Expression $Command } *>&1 | Out-File -FilePath $tmp -Encoding utf8
    $exit = if ($LASTEXITCODE -ne $null) { $LASTEXITCODE } else { 0 }
  } catch {
    $_ | Out-File -FilePath $tmp -Encoding utf8 -Append
    $exit = 1
  }
  $end = Get-Date
}
$duration = ($end - $start).TotalSeconds

try { Move-Item -Path $tmp -Destination $raw -Force }
catch {
    if (Test-Path $tmp) {
        Get-Content -Path $tmp -Raw | Out-File -FilePath $raw -Encoding utf8
        Remove-Item -Path $tmp -Force -ErrorAction SilentlyContinue
    }
}

[ordered]@{
    name       = $Name
    module     = $Module
    phase      = $Phase
    command    = $Command
    cwd        = $Cwd
    operator   = $Operator
    startUtc   = $start.ToString("o")
    endUtc     = $end.ToString("o")
    durationSec = [math]::Round($duration, 3)
    exitCode   = $exit
    rawLog     = $raw
} | ConvertTo-Json -Depth 4 | Out-File -FilePath $run -Encoding utf8

Write-Host ("[{0}] module={1} exit={2} duration={3:N2}s raw={4}" -f $Name, $Module, $exit, $duration, $raw)
