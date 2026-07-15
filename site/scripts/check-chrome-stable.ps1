# Verifies Google Chrome stable is installed for Chrome DevTools MCP / Lighthouse.
# Playwright Chromium is not a substitute for MCP's Chrome channel.

$ErrorActionPreference = "Stop"

$candidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$found = $null
foreach ($path in $candidates) {
  if (Test-Path -LiteralPath $path) {
    $found = $path
    break
  }
}

if ($found) {
  $version = (Get-Item -LiteralPath $found).VersionInfo.ProductVersion
  Write-Host "Chrome stable: $found ($version)"
  exit 0
}

Write-Host "Chrome stable not found at standard Windows install paths."
Write-Host "Install: winget install --id Google.Chrome -e"
Write-Host "Or download: https://www.google.com/chrome/"
exit 1