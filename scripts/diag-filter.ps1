$root = 'D:\worktrees\phase-06'
$f = Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like '*\node_modules\.pnpm\*' } | Select-Object -First 1
Write-Host "Path: $($f.FullName)"
Write-Host "Length: $($f.FullName.Length)"
Write-Host "root length: $($root.Length)"
$rel = $f.FullName.Substring($root.Length).TrimStart('\','/')
Write-Host "rel: '$rel'"
Write-Host "like node_modules/*: $($rel -like 'node_modules/*')"
Write-Host "like node_modules\.pnpm/* (literal): $($rel -like 'node_modules\.pnpm/*')"
