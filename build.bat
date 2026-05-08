@echo off
title Lumina LifeOS - Build APK
chcp 65001 >nul 2>&1

cd /d "%~dp0android"

echo ============================================
echo   Lumina LifeOS - APK Build
echo ============================================
echo.
echo Starting Gradle build...
echo.

set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

gradlew.bat assembleDebug

echo.
echo ============================================
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo SUCCESS! APK created.
    echo.
    echo Location: app\build\outputs\apk\debug\app-debug.apk
    echo.
    explorer "app\build\outputs\apk\debug"
) else (
    echo APK not found. Check errors above.
    echo.
    echo Try building via Android Studio:
    echo   Build - Build Bundle(s)/APK(s) - Build APK(s)
)
echo ============================================
echo.
pause
