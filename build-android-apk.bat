@echo off
setlocal enabledelayedexpansion

echo ============================================
echo Lumina LifeOS - Android APK Builder
echo ============================================
echo.

REM Check Java
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: Java JDK 17 not found!
    echo Please install from: https://aka.ms/download-jdk
    pause
    exit /b 1
)

echo Java found: %JAVA_HOME%
echo.

REM Check Android Studio
set "ANDROID_STUDIO_FOUND=0"
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    set ANDROID_STUDIO_FOUND=1
    echo Android Studio found!
)
if exist "%LOCALAPPDATA%\Programs\Android\Android Studio\bin\studio64.exe" (
    set ANDROID_STUDIO_FOUND=1
    set ANDROID_STUDIO_HOME=%LOCALAPPDATA%\Programs\Android\Android Studio
    echo Android Studio found!
)

if "%ANDROID_STUDIO_FOUND%"=="0" (
    echo.
    echo Android Studio not found!
    echo.
    echo Please install Android Studio from:
    echo https://developer.android.com/studio
    echo.
    echo After installation, run this script again.
    echo.
    echo OR open the project directly in Android Studio:
    echo   npm run cap:open
    echo.
    pause
    exit /b 1
)

REM Set Android SDK location (usually in user's home directory)
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

echo Using Android SDK: %ANDROID_HOME%
echo.

REM Update local.properties
echo sdk.dir=%ANDROID_HOME:\=\\% > android\local.properties
echo ndk.dir=C:\\Users\\%USERNAME%\\ndk\\android-ndk-r25c >> android\local.properties

echo Updated local.properties
echo.

REM Build web assets
echo Building web assets...
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo.
echo Syncing Capacitor...
call npx cap sync android

echo.
echo ============================================
echo Opening Android project in Android Studio...
echo ============================================
echo.
echo Next steps:
echo 1. Android Studio will open
echo 2. Wait for Gradle sync to complete
echo 3. Go to: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 4. APK will be in: android\app\build\outputs\apk\debug\app-debug.apk
echo.

start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0android"

echo Done!
pause
