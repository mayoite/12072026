#!/usr/bin/env pwsh
# Forbidden-pattern scanner for planner code (Phase 04/05/06 benchmark).
# Per AGENTS.md Type Safety rule + Phase 00 §00-PRE-02.
# Scans text-bearing files in a worktree and emits JSON + raw log.
#
# Usage: pwsh ./scan-forbidden.ps1 -Root <worktree-path> -OutDir <results-dir> -Tag <label>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$Root,
    [Parameter(Mandatory=$true)][string]$OutDir,
    [Parameter(Mandatory=$true)][string]$Tag
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Section {
    param([string]$msg)
    Write-Host "[$Tag] $msg"
}

# Convert a backslash-or-forward path to forward-slash for case-insensitive match.
function Normalize-RelativePath {
    param([string]$abs, [string]$root)
    $rel = $abs.Substring($root.Length).TrimStart('\','/').Replace('\','/').TrimStart('/')
    return $rel
}

function Test-InStopDir {
    param([string]$rel, [string[]]$stopDirs)
    foreach ($d in $stopDirs) {
        if ($rel -eq $d) { return $true }
        if ($rel.StartsWith("$d/")) { return $true }
    }
    return $false
}

function Scan-Worktree {
    param(
        [string]$root,
        [string]$out,
        [string]$tag
    )
    New-Item -ItemType Directory -Force -Path $out | Out-Null

    $logPath   = Join-Path $out 'forbidden-scan-raw.log'
    $jsonPath  = Join-Path $out 'forbidden-scan-run.json'
    $stdoutLog = New-Object System.IO.StreamWriter($logPath, $false, [System.Text.Encoding]::UTF8)

    # Patterns defined outside the strings to keep parsing predictable.
    $pColonTyped       = ':\s*any\b'
    $pAsAny            = '\bas\s+any\b'
    $pRecordStringAny  = 'Record<string,\s*any>'
    $pTsIgnore         = '@ts-ignore\b'
    $pTsNocheck        = '@ts-nocheck\b'
    $pEslintDisable    = 'eslint-disable'
    $pNoFrozenLF       = '--no-frozen-lockfile'
    $pMantineDouble    = 'from\s+"@?mantine'
    $pMantineSingle    = "from\s+'@?mantine"
    $pMantineBacktick  = 'from\s+`@?mantine'
    $pDonorBrand       = '\bopen3d-floorplan\b'
    $pDonorCopyright   = 'Copyright.*Open3D'

    $patterns = [ordered]@{
        'colon-any-typed'                = $pColonTyped
        'as-any-cast'                    = $pAsAny
        'record-string-any'              = $pRecordStringAny
        'ts-ignore'                      = $pTsIgnore
        'ts-nocheck'                     = $pTsNocheck
        'eslint-disable'                 = $pEslintDisable
        'no-frozen-lockfile'             = $pNoFrozenLF
        'mantine-import'                 = $pMantineDouble
        'mantine-import-q'               = $pMantineSingle
        'mantine-import-b'               = $pMantineBacktick
        'donor-tradedress-open3d-brand'  = $pDonorBrand
        'donor-tradedress-copyright'     = $pDonorCopyright
    }

    $stopDirs = @('node_modules', '.git', '.next', '.turbo', '.vercel', 'dist', 'build', '_archive', '.open3d', 'logs', 'tmp')

    Write-Section "Scanning $root -> $out"
    $stdoutLog.WriteLine("=== forbidden-scan: $tag ===")
    $stdoutLog.WriteLine("Root: $root")
    $stdoutLog.WriteLine("Started: $(Get-Date -Format 'o')")

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $rootFull = (Resolve-Path -LiteralPath $root).ProviderPath
    $rootLen  = $rootFull.Length

    $files = @()
    $stopDirsLen = ($stopDirs | Where-Object { $_.Length -gt 0 } | Sort-Object -Descending)[0].Length
    $relBuf       = New-Object 'System.Text.StringBuilder' 4096
    $relBufClear  = { $relBuf.Clear() }

    # Use a tuned enumeration: walk dirs, prune stop_dirs, then enumerate files under kept dirs.
    $acceptedExts = @('.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.md','.mdx','.css','.scss','.html','.yml','.yaml','.toml','.sh','.ps1')
    $dirQueue = New-Object 'System.Collections.Generic.Queue[string]'
    $dirQueue.Enqueue($rootFull)
    while ($dirQueue.Count -gt 0) {
        $cur = $dirQueue.Dequeue()
        $rel = if ($cur.Length -gt $rootLen) { $cur.Substring($rootLen).TrimStart('\','/').Replace('\','/').TrimStart('/') } else { '' }
        if ([string]::IsNullOrEmpty($rel)) {
            $inStop = $false
        } else {
            $inStop = Test-InStopDir -rel $rel -stopDirs $stopDirs
        }
        if ($inStop) { continue }

        $entries = Get-ChildItem -LiteralPath $cur -ErrorAction SilentlyContinue
        foreach ($entry in $entries) {
            if ($entry.PSIsContainer) {
                $dirQueue.Enqueue($entry.FullName)
            } else {
                $ext = $entry.Extension.ToLower()
                if ($acceptedExts -contains $ext) {
                    $files += $entry
                }
            }
        }
    }
    $sw.Stop()
    $stdoutLog.WriteLine("Files scanned: $($files.Count) (in $($sw.ElapsedMilliseconds) ms)")
    $stdoutLog.Flush()

    $hitsByPattern = @{}
    foreach ($name in $patterns.Keys) { $hitsByPattern[$name] = New-Object System.Collections.Generic.List[object] }

    $totalHits = 0
    $compiled = @{}
    foreach ($name in $patterns.Keys) {
        $compiled[$name] = New-Object System.Text.RegularExpressions.Regex([string]$patterns[$name])
    }

    $fileCount = $files.Count
    $i = 0
    foreach ($file in $files) {
        $i++
        if ($i % 500 -eq 0) {
            $stdoutLog.WriteLine("Progress: $i/$fileCount")
            $stdoutLog.Flush()
        }
        $relpath = Normalize-RelativePath -abs $file.FullName -root $rootFull
        $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
        if ([string]::IsNullOrEmpty($content)) { continue }
        $lines = $content -split "`n"
        for ($j = 0; $j -lt $lines.Count; $j++) {
            $line = $lines[$j]
            foreach ($name in $patterns.Keys) {
                if ($compiled[$name].IsMatch($line)) {
                    $h = [pscustomobject]@{
                        pattern = $name
                        regex   = [string]$patterns[$name]
                        file    = $relpath
                        line    = $j + 1
                        text    = ($line.Trim()).Substring(0, [Math]::Min(220, $line.Trim().Length))
                    }
                    $hitsByPattern[$name].Add($h) | Out-Null
                    $totalHits++
                    Write-Host "  HIT ($name) $relpath($($j+1)): $($h.text)"
                    $stdoutLog.WriteLine("HIT ${name} :: ${relpath}:$($j+1) :: $($h.text)")
                }
            }
        }
    }

    $stdoutLog.WriteLine("Finished: $(Get-Date -Format 'o')")
    $stdoutLog.WriteLine("Total hits: $totalHits")
    foreach ($name in $patterns.Keys) {
        $stdoutLog.WriteLine("  ${name}: $($hitsByPattern[$name].Count)")
    }

    $summary = New-Object System.Collections.Generic.List[object]
    foreach ($name in ($patterns.Keys | Sort-Object)) {
        $summary.Add([pscustomobject]@{ pattern = $name; regex = [string]$patterns[$name]; count = $hitsByPattern[$name].Count }) | Out-Null
    }

    $detailed = New-Object System.Collections.Generic.List[object]
    foreach ($name in $patterns.Keys) {
        foreach ($h in $hitsByPattern[$name]) {
            $detailed.Add([pscustomobject]@{
                pattern = $name
                file = $h.file
                line = $h.line
                text = $h.text
            }) | Out-Null
        }
    }

    $result = [pscustomobject]@{
        tag = $tag
        root = $root
        started_at = (Get-Date).ToUniversalTime().ToString('o')
        ended_at   = (Get-Date).ToUniversalTime().ToString('o')
        files_scanned = $files.Count
        total_hits = $totalHits
        per_pattern = $summary
        hits_detailed = $detailed
    }
    $jsonText = $result | ConvertTo-Json -Depth 6
    Set-Content -LiteralPath $jsonPath -Value $jsonText -Encoding UTF8
    $stdoutLog.WriteLine("JSON emitted: $jsonPath")
    $stdoutLog.Close()

    return [pscustomobject]@{
        tag = $tag
        total_hits = $totalHits
        per_pattern = $summary
        json = $jsonPath
        log = $logPath
    }
}

$result = Scan-Worktree -root $Root -out $OutDir -tag $Tag
Write-Section "Done. Total hits: $($result.total_hits) (see $($result.json))"
