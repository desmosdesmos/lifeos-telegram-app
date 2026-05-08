# Lumina LifeOS - Android APK Builder
# Этот скрипт проверяет наличие Android Studio и собирает APK

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Lumina LifeOS - Android APK Builder" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
$javaHome = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
if (Test-Path "$javaHome\bin\java.exe") {
    Write-Host "[OK] Java JDK 17 found: $javaHome" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Java JDK 17 not found!" -ForegroundColor Red
    Write-Host "Please install from: https://aka.ms/download-jdk"
    pause
    exit 1
}

# Check Android Studio
$androidStudioPaths = @(
    "C:\Program Files\Android\Android Studio\bin\studio64.exe",
    "$env:LOCALAPPDATA\Programs\Android\Android Studio\bin\studio64.exe"
)

$androidStudioFound = $false
$androidStudioPath = ""

foreach ($path in $androidStudioPaths) {
    if (Test-Path $path) {
        $androidStudioFound = $true
        $androidStudioPath = $path
        break
    }
}

if (-not $androidStudioFound) {
    Write-Host ""
    Write-Host "[WARNING] Android Studio not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Android Studio:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://developer.android.com/studio" -ForegroundColor Yellow
    Write-Host "  2. Or run: winget install Google.AndroidStudio" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OR open project directly with:" -ForegroundColor Cyan
    Write-Host "  npm run cap:open" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "[OK] Android Studio found: $androidStudioPath" -ForegroundColor Green

# Set Android SDK location
$androidHome = "$env:USERPROFILE\AppData\Local\Android\Sdk"
Write-Host "[INFO] Using Android SDK: $androidHome" -ForegroundColor Cyan

# Update local.properties
$localPropertiesPath = "android\local.properties"
$sdkDir = $androidHome -replace '\\', '\\'
"sdk.dir=$sdkDir" | Set-Content -Path $localPropertiesPath
Write-Host "[OK] Updated $localPropertiesPath" -ForegroundColor Green

# Build web assets
Write-Host ""
Write-Host "Building web assets..." -ForegroundColor Cyan
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Web build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "[OK] Web build complete" -ForegroundColor Green

# Sync Capacitor
Write-Host ""
Write-Host "Syncing Capacitor..." -ForegroundColor Cyan
& npx cap sync android
Write-Host "[OK] Capacitor synced" -ForegroundColor Green

# Open Android Studio
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Opening Android project in Android Studio..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Android Studio will open" -ForegroundColor White
Write-Host "  2. Wait for Gradle sync to complete" -ForegroundColor White
Write-Host "  3. Go to: Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
Write-Host "  4. APK will be in: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""

Start-Process $androidStudioPath -ArgumentList (Get-Location).Path + "\android"

Write-Host "[DONE] Project opened in Android Studio" -ForegroundColor Green
Write-Host ""
pause
