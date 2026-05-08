@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set ANDROID_HOME=C:\Android\Sdk
set PATH=%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo Accepting Android SDK licenses...
echo y | sdkmanager --licenses > nul 2>&1

echo Installing SDK packages...
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo Done!
pause
