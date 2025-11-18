# NT118-Store Auto Start Script
# This script automatically starts both Backend and Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NT118-Store Application Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"
$mobilePath = Join-Path $scriptPath "mobile"

# Check if paths exist
if (-not (Test-Path $backendPath)) {
    Write-Host "Error: Backend path not found: $backendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $mobilePath)) {
    Write-Host "Error: Mobile path not found: $mobilePath" -ForegroundColor Red
    exit 1
}

# Function to check if npm dependencies are installed
function Test-NpmInstalled {
    param($path)
    return Test-Path (Join-Path $path "node_modules")
}

# Check and install backend dependencies
Write-Host "[1/4] Checking Backend dependencies..." -ForegroundColor Yellow
if (-not (Test-NpmInstalled $backendPath)) {
    Write-Host "Installing Backend dependencies..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Backend dependencies already installed" -ForegroundColor Green
}

# Check and install mobile dependencies
Write-Host "[2/4] Checking Mobile dependencies..." -ForegroundColor Yellow
if (-not (Test-NpmInstalled $mobilePath)) {
    Write-Host "Installing Mobile dependencies..." -ForegroundColor Yellow
    Set-Location $mobilePath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install mobile dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Mobile dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Yellow

# Start Backend in new window
$backendWindow = Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$backendPath'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm start"
) -PassThru

Start-Sleep -Seconds 3

Write-Host "Backend Server started in new window" -ForegroundColor Green
Write-Host ""
Write-Host "[4/4] Starting Mobile App (Expo)..." -ForegroundColor Yellow
Write-Host ""

# Start Expo in current window to see the QR code and URL
Set-Location $mobilePath
Write-Host "Starting Expo..." -ForegroundColor Cyan
Write-Host ""
npm start
