# run-site-tests.ps1
#
# Batch driver: runs the canonical site test commands from START.md and emits
# per-command evidence via run-evidence-cmd.ps1. Repeats each command via
# sub-pwsh so that exit codes are captured reliably (no pipe-induced 0 leak).
#
# Default phase names the run with a UTC stamp so multiple invocations don't
# overwrite each other. Override with -Phase <string>.
[CmdletBinding()]
param(
    [string] $Phase = ("site-canonical-" + (Get-Date -Format 'yyyyMMdd-HHmmss')),
    [string[]]$Only = @(),          # subset of names; empty = run all.
    [switch] $NoInstall             # skip site-test (which needs full install)
)

$repoRoot = "D:\OOFPLWeb"
$siteRoot = Join-Path $repoRoot "site"
$wrapper  = Join-Path $PSScriptRoot "run-evidence-cmd.ps1"

$commands = @(
    @{ name = "site-typecheck";      module = "site";   cmd = "pnpm --filter oando-site run typecheck";                  cwd = $repoRoot }
    @{ name = "site-lint";           module = "site";   cmd = "pnpm --filter oando-site run lint";                       cwd = $repoRoot }
    @{ name = "site-lint-secrets";   module = "site";   cmd = "pnpm --filter oando-site run lint:secrets";               cwd = $repoRoot }
    @{ name = "site-test:clean";     module = "site";   cmd = "pnpm --filter oando-site run test:clean";                 cwd = $repoRoot }
    @{ name = "site-planner-units";  module = "site";   cmd = "pnpm exec vitest run planner";                            cwd = $siteRoot }
    @{ name = "site-test";           module = "site";   cmd = "pnpm --filter oando-site run test";                       cwd = $repoRoot }
    @{ name = "site-coverage";       module = "site";   cmd = "pnpm --filter oando-site run test:coverage";              cwd = $repoRoot }
    @{ name = "site-e2e-nav";        module = "site";   cmd = "pnpm --filter oando-site run test:e2e:nav";               cwd = $repoRoot }
)

if ($Only.Count -gt 0) { $commands = $commands | Where-Object { $Only -contains $_.name } }
if ($NoInstall)        { $commands = $commands | Where-Object { $_.name -ne "site-test" -and $_.name -ne "site-coverage" -and $_.name -ne "site-e2e-nav" } }

Write-Host "Phase: $Phase"
Write-Host ("Running {0} command(s)" -f $commands.Count)

$fails = @()
foreach ($c in $commands) {
    Write-Host ""
    Write-Host ("--- {0} ---" -f $c.name)
    & pwsh -NoProfile -File $wrapper -Name $c.name -Module $c.module -Phase $Phase -Command $c.cmd -Cwd $c.cwd
    if ($LASTEXITCODE -ne 0) {
        Write-Warning ("[{0}] wrapper exit={1}" -f $c.name, $LASTEXITCODE)
        $fails += $c.name
    }
}

Write-Host ""
Write-Host "Phase summary:"
Write-Host "  Phase: $Phase"
Write-Host "  Fails: $($fails -join ', ' | ForEach-Object { $_ })"
Write-Host "  Output: D:\OOFPLWeb\results\$($c.module)\$Phase\"
