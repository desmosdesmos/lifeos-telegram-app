@echo off
chcp 65001 >nul
title Gradle Build - Lumina LifeOS

cd /d "%~dp0"

echo ============================================
echo   Lumina LifeOS - Сборка APK
echo ============================================
echo.
echo JAVA_HOME: C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
echo.

set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

echo Запуск Gradle...
echo.

call gradlew.bat assembleDebug --console=plain

echo.
if errorlevel 1 (
    echo ОШИБКА СБОРКИ!
) else (
    echo СБОРКА ЗАВЕРШЕНА!
)
echo.
echo Нажмите любую клавишу...
pause >nul
