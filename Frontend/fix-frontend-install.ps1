# Fix and run Frontend installation for F:\chase-main\Frontend
# Usage: Open PowerShell in this folder and run: .\fix-frontend-install.ps1

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot
Write-Host "Working folder: $ProjectRoot"

Write-Host 'Cleaning frontend install artifacts...'
Remove-Item -LiteralPath .\node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath .\package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath .\package-lock.json.bak -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath .\node_modules\.typescript-* -Recurse -Force -ErrorAction SilentlyContinue

if (Test-Path .\package-lock.backup) {
    Write-Host 'Restoring package-lock.backup to package-lock.json'
    Copy-Item -Path .\package-lock.backup -Destination .\package-lock.json -Force
}

Write-Host 'Cleaning npm cache...'
npm cache clean --force | Out-Null

Write-Host 'Installing dependencies...'
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm install failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host 'Dependencies installed successfully.'
Write-Host 'Starting dev server...'
npm run dev
