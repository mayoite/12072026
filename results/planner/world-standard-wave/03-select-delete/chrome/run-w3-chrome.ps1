# P03 Chrome DevTools W3 live eyes: place → select → Delete → Ctrl+Z
$ErrorActionPreference = 'Continue'
$cdm = "D:\OandO07072026\results\planner\world-standard-wave\03-select-delete\chrome\_cdm\node_modules\.bin\chrome-devtools.cmd"
$evidence = "D:\OandO07072026\results\planner\world-standard-wave\03-select-delete\chrome"
$log = Join-Path $evidence "run-w3-chrome.log"
function L($m) { $line = "$(Get-Date -Format o) $m"; Add-Content -Path $log -Value $line; Write-Host $line }

if (-not (Test-Path $cdm)) { throw "chrome-devtools.cmd missing: $cdm" }

function Cdm {
  param([Parameter(ValueFromRemainingArguments = $true)]$rest)
  & $cdm @rest 2>$null
}

function Ensure-Planner {
  $pages = (Cdm list_pages) | Out-String
  $m = [regex]::Match($pages, '(?m)^(\d+):\s+[^\n]*planner/guest')
  if (-not $m.Success) {
    Cdm navigate_page --url "http://127.0.0.1:3000/planner/guest/?plannerDevTools=1" --timeout 120000 | Out-Null
    Start-Sleep 3
    $pages = (Cdm list_pages) | Out-String
    $m = [regex]::Match($pages, '(?m)^(\d+):\s+[^\n]*planner/guest')
  }
  if ($m.Success) {
    Cdm select_page $m.Groups[1].Value --bringToFront true | Out-Null
    return $m.Groups[1].Value
  }
  return $null
}

function Body-Text {
  Ensure-Planner | Out-Null
  $raw = (Cdm evaluate_script "() => document.body ? document.body.innerText : ''") | Out-String
  if ($raw -match '(?s)```json\s*"(.*)"\s*```') {
    return ($matches[1] -replace '\\n', "`n" -replace '\\t', "`t")
  }
  return $raw
}

function Furniture-Count {
  $t = Body-Text
  $m = [regex]::Match($t, '(\d+)\s+furniture', 'IgnoreCase')
  if ($m.Success) { return [int]$m.Groups[1].Value }
  return -1
}

function Has-No-Selection {
  $t = Body-Text
  return ($t -match 'No Selection')
}

function Snapshot-Text {
  Ensure-Planner | Out-Null
  return ((Cdm take_snapshot) | Out-String)
}

function Uid-For([string]$snap, [string]$pattern) {
  $m = [regex]::Match($snap, $pattern)
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Shot([string]$name) {
  Ensure-Planner | Out-Null
  $path = Join-Path $evidence $name
  Cdm take_screenshot --filePath $path --format png | Out-Null
  L "screenshot $name furniture=$(Furniture-Count)"
}

# --- start ---
Remove-Item $log -ErrorAction SilentlyContinue
L "START W3 chrome-devtools live eyes"

# Ensure daemon
$st = (Cdm status) | Out-String
if ($st -notmatch 'is running') {
  Cdm start --headless false --isolated true | Out-Null
  Start-Sleep 2
}

$id = Ensure-Planner
L "pageId=$id"
if (-not $id) { throw "No planner page" }

# Wait ready
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  $t = Body-Text
  if ($t -match 'INVENTORY|Select \(V\)|furniture|Systems configurator') {
    $ready = $true
    L "ready i=$i"
    break
  }
  Start-Sleep 1
}
if (-not $ready) { throw "Planner UI not ready" }

$before = Furniture-Count
L "furnitureBefore=$before"

# Expand systems configurator via snapshot uid
$snap = Snapshot-Text
$snap | Out-File (Join-Path $evidence "snap-before-place.txt") -Encoding utf8
$cfgUid = Uid-For $snap 'uid=(\w+)\s+button "SYSTEMS CONFIGURATOR"'
if (-not $cfgUid) { $cfgUid = Uid-For $snap 'uid=(\w+)\s+button "Systems configurator[^"]*"' }
L "cfgUid=$cfgUid"
if ($cfgUid) {
  Cdm click $cfgUid | Out-Null
  Start-Sleep 1
}

$snap2 = Snapshot-Text
$snap2 | Out-File (Join-Path $evidence "snap-config-expanded.txt") -Encoding utf8
$placeUid = Uid-For $snap2 'uid=(\w+)\s+button "Place 4 seats"'
L "placeUid=$placeUid"
if (-not $placeUid) {
  # re-expand once
  $cfgUid2 = Uid-For $snap2 'uid=(\w+)\s+button "SYSTEMS CONFIGURATOR"'
  if (-not $cfgUid2) { $cfgUid2 = Uid-For $snap2 'uid=(\w+)\s+button "Systems configurator[^"]*"' }
  if ($cfgUid2) { Cdm click $cfgUid2 | Out-Null; Start-Sleep 1; $snap2 = Snapshot-Text; $snap2 | Out-File (Join-Path $evidence "snap-config-expanded2.txt") -Encoding utf8 }
  $placeUid = Uid-For $snap2 'uid=(\w+)\s+button "Place 4 seats"'
  L "placeUid retry=$placeUid"
}

if (-not $placeUid) {
  throw "Place 4 seats button not found after expand"
}

Cdm click $placeUid | Out-Null
L "clicked Place 4 seats"

$afterPlace = $before
for ($i = 0; $i -lt 30; $i++) {
  $c = Furniture-Count
  L "place-poll i=$i count=$c"
  if ($c -ge ($before + 1)) { $afterPlace = $c; break }
  Start-Sleep 1
}
if ($afterPlace -le $before) { throw "Furniture count did not increase after place (before=$before after=$afterPlace)" }
Shot "01-placed.png"

# Select tool
$snap3 = Snapshot-Text
$selectUid = Uid-For $snap3 'uid=(\w+)\s+button "Select \(V\)"'
if (-not $selectUid) { $selectUid = Uid-For $snap3 'uid=(\w+)\s+button "Select"' }
L "selectUid=$selectUid"
if ($selectUid) { Cdm click $selectUid | Out-Null; Start-Sleep 0.5 }

# Click canvas center
$clickRes = (Cdm evaluate_script "() => { const c = document.querySelector('canvas'); if (!c) return {ok:false, reason:'no-canvas'}; const r = c.getBoundingClientRect(); const x = r.left + r.width * 0.5; const y = r.top + r.height * 0.5; c.focus(); const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true }; c.dispatchEvent(new PointerEvent('pointerdown', opts)); c.dispatchEvent(new PointerEvent('pointerup', opts)); c.dispatchEvent(new MouseEvent('mousedown', opts)); c.dispatchEvent(new MouseEvent('mouseup', opts)); c.dispatchEvent(new MouseEvent('click', opts)); return {ok:true, x, y, w:r.width, h:r.height}; }") | Out-String
L "canvasClick=$clickRes"
Start-Sleep 1

# If still No Selection, try slight offset clicks
if (Has-No-Selection) {
  L "still No Selection — offset taps"
  Cdm evaluate_script "() => { const c=document.querySelector('canvas'); if(!c) return false; const r=c.getBoundingClientRect(); const pts=[[0.45,0.45],[0.55,0.5],[0.4,0.55],[0.5,0.4]]; for (const [fx,fy] of pts){ const x=r.left+r.width*fx, y=r.top+r.height*fy; const o={bubbles:true,cancelable:true,clientX:x,clientY:y,button:0,pointerId:1,pointerType:'mouse',isPrimary:true}; c.dispatchEvent(new PointerEvent('pointerdown',o)); c.dispatchEvent(new PointerEvent('pointerup',o)); c.dispatchEvent(new MouseEvent('click',o)); } return true; }" | Out-Null
  Start-Sleep 1
}

$selected = -not (Has-No-Selection)
L "selected=$selected noSelection=$(Has-No-Selection)"
if (-not $selected) { throw "Select failed — still No Selection" }
Shot "02-selected.png"

# Delete
Cdm press_key "Delete" | Out-Null
L "pressed Delete"
$afterDelete = $afterPlace
for ($i = 0; $i -lt 20; $i++) {
  $c = Furniture-Count
  L "delete-poll i=$i count=$c"
  if ($c -lt $afterPlace -and $c -ge 0) { $afterDelete = $c; break }
  Start-Sleep 1
}
if ($afterDelete -ge $afterPlace) { throw "Delete did not reduce furniture ($afterPlace -> $afterDelete)" }
Shot "03-deleted.png"

# Undo
Cdm press_key "Control+z" | Out-Null
L "pressed Ctrl+Z"
$afterUndo = $afterDelete
for ($i = 0; $i -lt 20; $i++) {
  $c = Furniture-Count
  L "undo-poll i=$i count=$c"
  if ($c -gt $afterDelete) { $afterUndo = $c; break }
  Start-Sleep 1
}
if ($afterUndo -le $afterDelete) { throw "Undo did not restore furniture ($afterDelete -> $afterUndo)" }
Shot "04-undone.png"

# Verdict
$pass = ($afterPlace -gt $before) -and ($afterDelete -lt $afterPlace) -and ($afterUndo -gt $afterDelete)
L "COUNTS before=$before afterPlace=$afterPlace afterDelete=$afterDelete afterUndo=$afterUndo"
L "VERDICT=$(if($pass){'PASS'}else{'FAIL'})"

$result = @{
  verdict = if ($pass) { 'PASS' } else { 'FAIL' }
  fabric = 'OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE unset)'
  url = 'http://127.0.0.1:3000/planner/guest/?plannerDevTools=1'
  tool = 'chrome-devtools CLI (MCP daemon)'
  furnitureBefore = $before
  furnitureAfterPlace = $afterPlace
  furnitureAfterDelete = $afterDelete
  furnitureAfterUndo = $afterUndo
  screenshots = @('01-placed.png','02-selected.png','03-deleted.png','04-undone.png')
  timestamp = (Get-Date).ToString('o')
}
$result | ConvertTo-Json | Out-File (Join-Path $evidence "run.json") -Encoding utf8
if (-not $pass) { exit 1 }
exit 0
