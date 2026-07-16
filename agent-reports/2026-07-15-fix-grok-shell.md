# Fix Grok agent shell (OS error 216)

**Date:** 2026-07-15  
**Status:** Fix script written; user must run once outside Grok (agent shell cannot self-heal).

## Root cause

`%USERPROFILE%\.grok\bin\pwsh.exe` was a **handmade PE32** one-shot (built by `build_pwsh_launcher.py` / `make_pwsh_pe.js` to run a delete helper). It is **not** PowerShell.

Grok puts `~\.grok\bin` early on PATH. The agent then tries to spawn that broken `pwsh.exe` and Windows returns:

> This version of %1 is not compatible with the version of Windows you're running. (os error 216)

## Fix (run in Windows Terminal — not inside Grok)

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File E:\12072026\scripts\fix-grok-shell.ps1
```

That script:

1. Renames the broken `pwsh.exe` to `pwsh.exe.broken-<timestamp>`
2. Copies real PowerShell 7 (if installed) or Windows PowerShell 5.1 over `~\.grok\bin\pwsh.exe`
3. Restores `pwsh.cmd` / `pwsh.ps1` shims to system PowerShell
4. Probes the new binary

Then **fully quit and reopen Grok** on `E:\12072026`.

## Also changed

- `~\.grok\bin\build_pwsh_launcher.py` — only copies real PowerShell; no PE emission
- `~\.grok\bin\make_pwsh_pe.js` / `_emit_pe.py` — disabled PE path; call the safe installer

## Do not

- Re-run old PE builders that hardcode a WinExec one-shot
- Leave a handmade PE named `pwsh.exe` on PATH
