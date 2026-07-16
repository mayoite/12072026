# Fix Grok agent shell (Windows OS error 216).
# Root cause: %USERPROFILE%\.grok\bin\pwsh.exe was a handmade PE32 stub
# (not real PowerShell). Agent PATH prefers that file and fails to load it.
#
# Run ONCE from Windows Terminal / PowerShell (outside Grok):
#   pwsh -NoProfile -ExecutionPolicy Bypass -File E:\12072026\scripts\fix-grok-shell.ps1
# or:
#   powershell -NoProfile -ExecutionPolicy Bypass -File E:\12072026\scripts\fix-grok-shell.ps1

$ErrorActionPreference = "Stop"

$binDir = Join-Path $env:USERPROFILE ".grok\bin"
$badPwsh = Join-Path $binDir "pwsh.exe"
$realPs = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$realPwshCandidates = @(
  (Join-Path $env:ProgramFiles "PowerShell\7\pwsh.exe"),
  (Join-Path ${env:ProgramFiles(x86)} "PowerShell\7\pwsh.exe"),
  (Join-Path $env:LocalAppData "Microsoft\WindowsApps\pwsh.exe")
)

Write-Host "=== Grok shell fix ==="
Write-Host "bin:  $binDir"
Write-Host "bad:  $badPwsh"
Write-Host "real: $realPs"

if (-not (Test-Path -LiteralPath $realPs)) {
  throw "Windows PowerShell not found at $realPs"
}

# Prefer real PowerShell 7 pwsh if installed; else Windows PowerShell 5.1.
$source = $realPs
foreach ($c in $realPwshCandidates) {
  if ($c -and (Test-Path -LiteralPath $c)) {
    $source = $c
    break
  }
}
Write-Host "source exe: $source"

if (Test-Path -LiteralPath $badPwsh) {
  $stamp = Get-Date -Format "yyyyMMddHHmmss"
  $backup = "$badPwsh.broken-$stamp"
  Move-Item -LiteralPath $badPwsh -Destination $backup -Force
  Write-Host "Moved broken launcher -> $backup"
} else {
  Write-Host "No existing pwsh.exe in .grok\bin (ok)"
}

Copy-Item -LiteralPath $source -Destination $badPwsh -Force
Write-Host "Installed working shell -> $badPwsh"

# Keep cmd/ps1 shims pointing at system PowerShell for non-exe lookups.
$cmdShim = Join-Path $binDir "pwsh.cmd"
$ps1Shim = Join-Path $binDir "pwsh.ps1"
@"
@echo off
"$realPs" %*
"@ | Set-Content -LiteralPath $cmdShim -Encoding ASCII
@"
& '$realPs' @args
"@ | Set-Content -LiteralPath $ps1Shim -Encoding UTF8
Write-Host "Updated pwsh.cmd and pwsh.ps1 shims"

# Sanity check
Write-Host "=== Probe ==="
& $badPwsh -NoProfile -NonInteractive -Command "Write-Output ('OK arch=' + [Environment]::Is64BitProcess + ' ver=' + `$PSVersionTable.PSVersion)"
if ($LASTEXITCODE -ne 0 -and $null -ne $LASTEXITCODE) {
  throw "Probe failed with exit $LASTEXITCODE"
}

Write-Host ""
Write-Host "SUCCESS. Fully quit Grok Build / TUI, then reopen E:\12072026."
Write-Host "In a new agent turn, shell tools should work again."
