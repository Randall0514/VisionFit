# VisionFit Backend Startup Script
# Run this script to start MongoDB and the backend server

Write-Host "Starting VisionFit Backend..." -ForegroundColor Cyan

# Check if MongoDB is already running
$mongoRunning = netstat -an | Select-String "27017"
if ($mongoRunning) {
    Write-Host "[OK] MongoDB is already running on port 27017" -ForegroundColor Green
} else {
    Write-Host "[...] Starting MongoDB..." -ForegroundColor Yellow
    Start-Process -FilePath "C:\mongodb\bin\mongod.exe" -ArgumentList "--dbpath C:\mongodb\data --logpath C:\mongodb\logs\mongod.log --port 27017" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    $mongoCheck = netstat -an | Select-String "27017"
    if ($mongoCheck) {
        Write-Host "[OK] MongoDB started on port 27017" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] MongoDB failed to start" -ForegroundColor Red
        exit 1
    }
}

# Check if backend is already running
$backendRunning = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "[OK] Backend is already running on port 5000" -ForegroundColor Green
} else {
    Write-Host "[...] Starting backend server..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    
    $backendCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction SilentlyContinue
    if ($backendCheck) {
        Write-Host "[OK] Backend started on port 5000" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Backend failed to start" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "VisionFit Backend is ready!" -ForegroundColor Green
Write-Host "  MongoDB: mongodb://localhost:27017/visionfit" -ForegroundColor Gray
Write-Host "  Backend: http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop both services" -ForegroundColor Gray