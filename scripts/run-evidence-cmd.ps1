# run-evidence-cmd.ps1
#
# Generic wrapper: run any command and capture standardized evidence in repo.
#
# Output per invocation (under D:\OOFPLWeb\results):
#   <results>/<module>/<phase>/<name>/<name>-raw.log   -- all stdout/stderr, no truncation
#   <results>/<module>/<phase>/<name>/<name>-run.json  -- metadata, exit code, times, paths
#
# Repo rules respected:
#   * Module-folder mapping  - module = failing folder.
#   * No hard-coded paths    - only D:\OOFPLWeb\results is the absolute root; everything
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

$repoRoot = "D:\OOFPLWeb"
$resultsRoot = Join-Path $repoRoot (Join-Path "results" (Join-Path $Module (Join-Path $Phase $Name)))
if (-not (Test-Path $resultsRoot)) { New-Item -ItemType Directory -Path $resultsRoot -Force | Out-Null }
$raw = Join-Path $resultsRoot "$Name-raw.log"
$run = Join-Path $resultsRoot "$Name-run.json"

# Run in sub-pwsh to capture exit code reliably and all streams (no ANSI bleed).
$tmp = [System.IO.Path]::GetTempFileName()
$psBlock = "Set-Location -LiteralPath '$Cwd'; `$ErrorActionPreference = 'Continue'; & { $Command } *>&1 | Out-File -FilePath '$tmp' -Encoding utf8; exit `$LASTEXITCODE"

$start = Get-Date
$proc = Start-Process -FilePath "pwsh" -ArgumentList @('-NoProfile', '-Command', $psBlock) -NoNewWindow -Wait -PassThru
$end = Get-Date
$exit = $proc.ExitCode
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
