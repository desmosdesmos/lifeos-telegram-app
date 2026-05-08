@echo off
chcp 65001 >nul
echo === Проверка Android SDK и сборка APK ===
echo.

set SDK_PATH=%LOCALAPPDATA%\Android\Sdk
set PROJECT_PATH=%~dp0

echo Проверка пути к SDK: %SDK_PATH%
echo.

if exist "%SDK_PATH%\platform-tools\adb.exe" (
    echo ✓ platform-tools найдены
) else (
    echo ✗ platform-tools не найдены
    echo.
    echo Android Studio должна автоматически загрузить SDK при первом запуске.
    echo Пожалуйста, дождитесь завершения настройки в Android Studio.
)

if exist "%SDK_PATH%\platforms\android-34\android.jar" (
    echo ✓ Android 34 платформа найдена
) else (
    echo ✗ Android 34 платформа не найдена
)

echo.
echo === Попытка сборки APK ===
echo.

cd "%PROJECT_PATH%android"
if exist "gradlew.bat" (
    echo Запуск Gradle сборки...
    call gradlew.bat assembleDebug --stacktrace
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ===========================================
        echo ✓ APK успешно собран!
        echo ===========================================
        echo.
        echo Путь к APK:
        echo %PROJECT_PATH%android\app\build\outputs\apk\debug\app-debug.apk
        echo.
    ) else (
        echo.
        echo ===========================================
        echo ✗ Ошибка сборки
        echo ===========================================
        echo.
        echo Возможные решения:
        echo 1. Откройте Android Studio и дождитесь завершения настройки SDK
        echo 2. В Android Studio: File ^> Project Structure ^> SDK Location
        echo 3. Убедитесь, что путь к SDK указан верно
        echo.
        echo Или откройте проект в Android Studio вручную:
        echo    - Файл ^> Открыть ^> выберите папку android
        echo    - Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
    )
) else (
    echo ✗ gradlew.bat не найден
)

echo.
pause
