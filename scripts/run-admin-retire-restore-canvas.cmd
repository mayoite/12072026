@echo off
setlocal
cd /d "%~dp0..\site"
set DEV_AUTH_BYPASS=1
call node scripts\run-admin-retire-restore-canvas.mjs
set EXITCODE=%ERRORLEVEL%
echo Exit code: %EXITCODE%
exit /b %EXITCODE%