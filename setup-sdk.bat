@echo off
setlocal

set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set PROJECT_DIR=%~dp0
set ANDROID_HOME=%PROJECT_DIR%android-sdk
set PATH=%JAVA_HOME%\bin;%PATH%

echo ============================================
echo Android SDK Setup
echo ============================================
echo.

REM Download if not exists
if not exist "%ANDROID_HOME%\cmdline-tools.zip" (
    echo Downloading Android command-line tools...
    powershell -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' -OutFile '%ANDROID_HOME%\cmdline-tools.zip' -UseBasicParsing"
)

REM Extract
if not exist "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" (
    echo Extracting...
    powershell -Command "if (Test-Path '%ANDROID_HOME%\cmdline-tools.zip') { Expand-Archive -Path '%ANDROID_HOME%\cmdline-tools.zip' -DestinationPath '%ANDROID_HOME%\temp' -Force; New-Item -ItemType Directory -Path '%ANDROID_HOME%\cmdline-tools\latest' -Force | Out-Null; Move-Item -Path '%ANDROID_HOME%\temp\cmdline-tools\*' -Destination '%ANDROID_HOME%\cmdline-tools\latest' -Force; Remove-Item -Path '%ANDROID_HOME%\temp' -Recurse -Force }"
)

REM Accept licenses and install
echo Installing SDK packages...
echo y | "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_HOME%" --licenses > nul 2>&1
"%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_HOME%" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo SDK setup complete!
echo ANDROID_HOME=%ANDROID_HOME%
pause
