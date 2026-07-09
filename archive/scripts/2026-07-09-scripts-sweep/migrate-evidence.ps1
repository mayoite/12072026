# migrate-evidence.ps1
#
# Purpose: archive run-evidence from `E:\oofpl-test-evidence` into the repo
# under `results/planner/<phase>/`, and rewrite plan-doc references so the
# docs use repo-relative paths (no hard-coded drive letters).
#
# Repo rules respected:
#   * "Make minimum necessary changes" - only this dir/file set is touched.
#   * "Archive over delete"            - E:\ source is kept intact; copies only.
#   * Module-folder mapping            - evidence nested under results/planner/.
#   * No hard-coded absolute paths     - docs use results/planner/<phase>/... .
[CmdletBinding()]
param(
    [string]$SourceRoot = "E:\oofpl-test-evidence",
    [string]$TargetRoot = "D:\OOFPLWeb\results\planner",
    [string[]]$Phases   = @("phase-01", "phase-01a", "phase-01b", "phases-02-03"),
    [string[]]$Docs     = @(
        "D:\OOFPLWeb\plannnerplan\FAILURESPLAN.md",
        "D:\OOFPLWeb\plannnerplan\evidence\01a-baseline.md",
        "D:\OOFPLWeb\plannnerplan\01b-feasibility-slice-native-open3d-spine.md",
        "D:\OOFPLWeb\plannnerplan\HANDOVER.md"
    )
)

$ErrorActionPreference = "Continue"

if (-not (Test-Path $SourceRoot)) {
    Write-Host "Source not present: $SourceRoot -- nothing to copy. Continuing with ref rewrite." -ForegroundColor Yellow
} else {
    if (-not (Test-Path $TargetRoot)) {
        New-Item -ItemType Directory -Path $TargetRoot -Force | Out-Null
    }
    foreach ($phase in $Phases) {
        $src = Join-Path $SourceRoot $phase
        $dst = Join-Path $TargetRoot $phase
        if (Test-Path $src) {
            if (-not (Test-Path $dst)) {
                New-Item -ItemType Directory -Path $dst -Force | Out-Null
            }
            Copy-Item -Path (Join-Path $src "*") -Destination $dst -Recurse -Force
            $copied = (Get-ChildItem $dst -Recurse -File | Measure-Object).Count
            Write-Host "[copy] $phase -> $dst  ($copied files)"
        } else {
            Write-Host "[skip] $phase (no source)"
        }
    }
}

foreach ($doc in $Docs) {
    if (-not (Test-Path $doc)) {
        Write-Host "[skip] $doc (not found)"
        continue
    }
    $before = Get-Content -Path $doc -Raw
    $after  = $before -replace 'E:\\oofpl-test-evidence\\', 'results/planner/'
    if ($after -ne $before) {
        $hits   = ([regex]::Matches($before, 'E:\\oofpl-test-evidence\\')).Count
        Set-Content -Path $doc -Value $after -Encoding utf8
        Write-Host "[edit] $doc  (replaced $hits occurrence(s))"
    } else {
        Write-Host "[noop] $doc  (no occurrences)"
    }
}

Write-Host "--- target tree ---"
Get-ChildItem $TargetRoot -Directory | ForEach-Object { $_.Name }
