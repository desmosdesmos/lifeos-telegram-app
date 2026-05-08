@echo off
chcp 65001 >nul
title Lumina LifeOS - Сборка APK

cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        Lumina LifeOS - Сборка APK                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Для сборки APK через Android Studio:
echo.
echo 1. Откройте Android Studio (уже запущена)
echo 2. Дождитесь завершения Gradle Sync
echo 3. Build → Build Bundle(s) / APK(s) → Build APK(s)
echo.
echo ИЛИ нажмите Enter для сборки через командную строку...
pause >nul

cls
echo.
echo Запуск сборки...
echo.

set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0android"

call gradlew.bat assembleDebug --console=plain

echo.
echo ════════════════════════════════════════════════════════
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo APK УСПЕШНО СОБРАН!
    echo.
    echo Расположение: %cd%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Открыть папку с APK?
    choice /C YN /M "Открыть"
    if errorlevel 2 goto :end
    explorer "%cd%\app\build\outputs\apk\debug"
) else (
    echo ВНИМАНИЕ: APK не найден
    echo.
    echo Проверьте ошибки выше или попробуйте сборку через
    echo Android Studio: Build → Build APK(s)
)
echo ════════════════════════════════════════════════════════
echo.

:end
pause
