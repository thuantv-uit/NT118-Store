# Quick start script for Backend + Frontend with dynamic IP
# Author: NT118 Team
# Usage: .\start-dev.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   NT118 Store - Development Startup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detect local IP address
Write-Host "[1/5] Detecting local IP address..." -ForegroundColor Yellow
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -eq "Dhcp" } | 
    Select-Object -First 1).IPAddress

if (-not $localIP) {
    # Fallback: try WiFi/Ethernet adapter
    $localIP = (Get-NetIPConfiguration | 
        Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq "Up" } | 
        Select-Object -First 1).IPv4Address.IPAddress
}

if (-not $localIP) {
    Write-Host "[ERROR] Could not detect local IP. Using localhost..." -ForegroundColor Red
    $localIP = "localhost"
} else {
    Write-Host "[OK] Local IP detected: $localIP" -ForegroundColor Green
}

$PORT = 5001
$API_URL = "http://${localIP}:${PORT}/api"

# 2. Update mobile/constants/api.js
Write-Host ""
Write-Host "[2/5] Updating mobile API configuration..." -ForegroundColor Yellow
$apiFilePath = "mobile\constants\api.js"

if (Test-Path $apiFilePath) {
    $content = "export const API_URL = `"$API_URL`";"
    Set-Content -Path $apiFilePath -Value $content -Encoding UTF8
    Write-Host "[OK] Updated: $apiFilePath" -ForegroundColor Green
    Write-Host "   API_URL = $API_URL" -ForegroundColor Gray
} else {
    Write-Host "[WARNING] File not found: $apiFilePath" -ForegroundColor Yellow
}

# 3. Check dependencies
Write-Host ""
Write-Host "[3/5] Checking dependencies..." -ForegroundColor Yellow

$needsInstall = $false

# Check Backend
if (Test-Path "backend\node_modules") {
    Write-Host "   [OK] Backend dependencies found (skip install)" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Backend dependencies missing" -ForegroundColor Yellow
    Write-Host "   [INSTALL] Installing backend dependencies..." -ForegroundColor Cyan
    $needsInstall = $true
    Push-Location backend
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Backend installation failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

# Check Mobile
if (Test-Path "mobile\node_modules") {
    Write-Host "   [OK] Mobile dependencies found (skip install)" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] Mobile dependencies missing" -ForegroundColor Yellow
    Write-Host "   [INSTALL] Installing mobile dependencies..." -ForegroundColor Cyan
    $needsInstall = $true
    Push-Location mobile
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] Mobile dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Mobile installation failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

if (-not $needsInstall) {
    Write-Host ""
    Write-Host "[OK] All dependencies ready (no installation needed)" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[OK] Dependencies installation completed" -ForegroundColor Green
}

# 4. Start Backend
Write-Host ""
Write-Host "[4/5] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   URL: http://${localIP}:${PORT}" -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; `$env:PORT='$PORT'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm start"

# Wait for backend to start
Write-Host "   Waiting for backend to initialize (5 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 5. Start Mobile (Expo)
Write-Host ""
Write-Host "[5/5] Starting Mobile App (Expo)..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\MOBILE-GIT-THUAN\NT118-Store\mobile'; Write-Host 'Mobile App Starting...' -ForegroundColor Green; npx expo start"

# Summary
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Development Environment Ready!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:  http://${localIP}:${PORT}/api" -ForegroundColor White
Write-Host "Mobile App:   Check Expo DevTools in new terminal" -ForegroundColor White
Write-Host ""
Write-Host "Tips:" -ForegroundColor Yellow
Write-Host "   - Scan QR code in Expo Go app" -ForegroundColor Gray
Write-Host "   - Press 'a' for Android emulator" -ForegroundColor Gray
Write-Host "   - Press 'i' for iOS simulator" -ForegroundColor Gray
Write-Host "   - Press 'w' for web browser" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop: Close both PowerShell windows" -ForegroundColor Yellow
Write-Host ""
