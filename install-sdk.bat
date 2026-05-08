@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot

echo Installing Android SDK packages...
echo Please wait, this may take several minutes...

C:\Android\cmdline-tools\latest\bin\sdkmanager.bat --sdk_root=C:\Android\Sdk "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo Installation complete!
pause
