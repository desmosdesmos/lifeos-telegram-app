@echo off
chcp 65001 >nul
echo ============================================
echo  Lumina LifeOS - Сборка APK
echo ============================================
echo.

REM Установка JAVA_HOME
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Переход в директорию проекта
cd /d "%~dp0"

REM Сборка веб-части
echo [1/3] Сборка веб-приложения...
call npm run build
if errorlevel 1 (
    echo.
    echo ОШИБКА: Сборка веб-приложения не удалась!
    pause
    exit /b 1
)
echo Веб-сборка завершена!
echo.

REM Синхронизация Capacitor
echo [2/3] Синхронизация с Capacitor...
call npx cap sync android
echo.

REM Сборка APK через Gradle
echo [3/3] Сборка APK...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo.
    echo ОШИБКА: Сборка APK не удалась!
    echo.
    echo Попробуйте открыть проект в Android Studio:
    echo   npm run cap:open
    pause
    exit /b 1
)

REM Проверка результата
cd ..
set "APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk"
if exist "%APK_PATH%" (
    echo.
    echo ============================================
    echo  APK УСПЕШНО СОБРАН!
    echo ============================================
    echo.
    echo Расположение: %APK_PATH%
    echo.
    echo Для установки на устройство:
    echo   adb install %APK_PATH%
    echo.
) else (
    echo.
    echo ВНИМАНИЕ: APK файл не найден в ожидаемом расположении
    echo Проверьте: android\app\build\outputs\apk\debug\
    echo.
)

pause
