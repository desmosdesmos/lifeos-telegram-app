@echo off
chcp 65001 >nul
title Lumina LifeOS - Сборка APK

cls
echo ============================================
echo   Lumina LifeOS - Сборка APK
echo ============================================
echo.
echo Нажмите любую клавишу для начала сборки...
pause >nul
echo.

set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"

echo [1/4] Сборка веб-приложения...
call npm run build
if errorlevel 1 goto :error

echo.
echo [2/4] Синхронизация Capacitor...
call npx cap sync android

echo.
echo [3/4] Сборка APK...
cd android
call gradlew.bat assembleDebug

echo.
echo [4/4] Проверка результата...
cd ..
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    goto :success
) else (
    goto :error
)

:success
cls
echo ============================================
echo   APK УСПЕШНО СОБРАН!
echo ============================================
echo.
echo Файл: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo ============================================
echo   Хотите открыть папку с APK?
echo ============================================
echo.
choice /C YN /M "Открыть папку"
if errorlevel 2 goto :end
explorer "%~dp0android\app\build\outputs\apk\debug"
goto :end

:error
cls
echo ============================================
echo   ОШИБКА СБОРКИ
echo ============================================
echo.
echo Проверьте:
echo 1. Установлен ли Java JDK 17
echo 2. Установлен ли Android SDK
echo 3. Открыта ли Android Studio
echo.
echo Попробуйте собрать через Android Studio:
echo   npm run cap:open
echo.
pause

:end
