# fix-powershell.ps1
# Run this from a normal Windows Terminal / PowerShell / cmd (NOT inside Grok)
# Right-click → Run with PowerShell, or paste into an admin terminal.

Write-Host "=== Fixing PowerShell hostfxr.dll 0x80070005 (Store version) ===" -ForegroundColor Cyan
Write-Host ""

# 1. Try to uninstall the broken Store version
Write-Host "1. Removing Microsoft Store PowerShell..." -ForegroundColor Yellow
try {
    winget uninstall --id Microsoft.PowerShell -e --accept-source-agreements --disable-interactivity 2>&1 | Out-String
    Write-Host "   Store version uninstall attempted." -ForegroundColor Green
} catch {
    Write-Host "   winget uninstall may have failed or not found. Continuing..." -ForegroundColor DarkYellow
}

Start-Sleep -Seconds 2

# 2. Install the real desktop PowerShell 7
Write-Host "2. Installing proper PowerShell 7 via winget..." -ForegroundColor Yellow
try {
    winget install --id Microsoft.PowerShell --source winget -e --accept-source-agreements --disable-interactivity
    Write-Host "   Installation command sent." -ForegroundColor Green
} catch {
    Write-Host "   winget install failed. Falling back to manual instructions." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== NEXT STEPS (do these manually) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "A. If winget succeeded:" -ForegroundColor White
Write-Host "   - Close this window and ALL Grok sessions completely." -ForegroundColor White
Write-Host "   - Re-open Grok." -ForegroundColor White
Write-Host ""
Write-Host "B. If winget is not available or failed:" -ForegroundColor White
Write-Host "   1. Go to: https://github.com/PowerShell/PowerShell/releases/latest" -ForegroundColor White
Write-Host "   2. Download PowerShell-7.x.x-win-x64.msi" -ForegroundColor White
Write-Host "   3. Run the .msi installer as Administrator" -ForegroundColor White
Write-Host "   4. Make sure 'Add PowerShell to PATH' is checked" -ForegroundColor White
Write-Host "   5. Close everything and restart Grok" -ForegroundColor White
Write-Host ""
Write-Host "After restart, inside Grok you (or the agent) can test with:" -ForegroundColor White
Write-Host "   pnpm --version" -ForegroundColor Green
Write-Host "   node --version" -ForegroundColor Green
Write-Host ""
Write-Host "This fixes the hostfxr.dll load error that was blocking all gates." -ForegroundColor Cyan

pause
