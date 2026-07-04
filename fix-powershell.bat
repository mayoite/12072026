@echo off
echo === Fixing PowerShell (hostfxr.dll 0x80070005) ===
echo.
echo This will try to remove the broken Microsoft Store PowerShell
echo and install the real desktop version.
echo.
echo IMPORTANT: Run this from a normal Command Prompt or Windows Terminal
echo (not inside Grok).
echo.
pause

echo.
echo [1/2] Attempting to uninstall Store PowerShell via winget...
winget uninstall --id Microsoft.PowerShell -e --accept-source-agreements --disable-interactivity

echo.
echo [2/2] Installing proper PowerShell 7...
winget install --id Microsoft.PowerShell --source winget -e --accept-source-agreements --disable-interactivity

echo.
echo === Done with winget attempt ===
echo.
echo NOW DO THIS:
echo 1. CLOSE this window and COMPLETELY EXIT Grok (all sessions).
echo 2. Re-open Grok.
echo 3. Inside Grok, we will test with: pnpm --version
echo.
echo If winget didn't work, manually download the MSI from:
echo https://github.com/PowerShell/PowerShell/releases/latest
echo (PowerShell-*-win-x64.msi) and install it.
echo.
pause
