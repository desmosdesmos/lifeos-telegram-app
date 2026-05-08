# Build APK script for Lumina LifeOS
$projectPath = "C:\Users\Yan\Desktop\apk LUMINA\LIFE OS"
$androidPath = Join-Path $projectPath "android"

Write-Host "=== Lumina LifeOS APK Builder ===" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
Write-Host "JAVA_HOME: $env:JAVA_HOME"

# Build web assets
Write-Host ""
Write-Host "Building web assets..." -ForegroundColor Yellow
Set-Location $projectPath
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Web build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Web build completed!" -ForegroundColor Green

# Sync Capacitor
Write-Host ""
Write-Host "Syncing Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Capacitor sync may have issues" -ForegroundColor Yellow
}

# Build APK
Write-Host ""
Write-Host "Building APK..." -ForegroundColor Cyan
Set-Location $androidPath

# Run gradle build with output
& .\gradlew.bat assembleDebug

Write-Host ""
Write-Host "Gradle build completed!" -ForegroundColor Green

# Check for APK
$apkPath = Join-Path $androidPath "app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    Write-Host ""
    Write-Host "=== APK SUCCESS ===" -ForegroundColor Green
    Write-Host "APK location: $apkPath" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "WARNING: APK not found at expected location" -ForegroundColor Yellow
    Write-Host "Check: $androidPath\app\build\outputs\apk\" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
