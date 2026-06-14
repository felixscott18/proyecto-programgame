Set-Location 'F:\chase-main\Frontend'
Write-Host "WORKDIR: $(Get-Location)"
Write-Host 'KILL_NODE...'
Get-Process node,npm -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $PID } | ForEach-Object { Write-Host "KILL $($_.Id) $($_.ProcessName)"; Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
if (Test-Path 'node_modules') {
  cmd /c "attrib -r /s node_modules\*.*"
  Remove-Item 'node_modules' -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host 'REMOVED_NODE_MODULES'
} else { Write-Host 'NO_NODE_MODULES' }
if (Test-Path 'package-lock.backup') {
  Rename-Item 'package-lock.backup' 'package-lock.backup.disabled' -Force
  Write-Host 'RENAMED_LOCK_BACKUP'
} else { Write-Host 'NO_LOCK_BACKUP' }
if (Test-Path 'package-lock.json') { Remove-Item 'package-lock.json' -Force; Write-Host 'REMOVED_LOCK' } else { Write-Host 'NO_LOCK' }
npm cache clean --force | Out-Null
Write-Host 'START_INSTALL'
npm install --no-package-lock --legacy-peer-deps --loglevel verbose
$exit=$LASTEXITCODE
Write-Host 'EXIT=' $exit
if (Test-Path 'node_modules\.bin\tsx') { Write-Host 'TSX_BIN:PRESENT' } else { Write-Host 'TSX_BIN:MISSING' }
exit $exit
