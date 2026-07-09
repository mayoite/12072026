$tokens = $null
$errors = $null
[System.Management.Automation.Language.Parser]::ParseFile(
    'D:\worktrees\bench-456\scripts\scan-forbidden.ps1',
    [ref]$tokens, [ref]$errors) | Out-Null
if ($errors) {
    Write-Host "PARSE_FAIL"
    $errors | ForEach-Object { Write-Host $_.Message }
    exit 1
} else {
    Write-Host "PARSE_OK"
    exit 0
}
