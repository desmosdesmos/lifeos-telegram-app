@echo off
chcp 65001 >nul
echo Сборка APK...
echo JAVA_HOME=%JAVA_HOME%
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
echo.
call gradlew.bat assembleDebug
echo.
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo APK УСПЕШНО СОБРАН!
    echo Путь: %cd%\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo APK не найден. Проверьте ошибки выше.
)
pause
