@echo off
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo Android Studio INSTALLED
    echo Opening project...
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0android"
) else (
    echo Android Studio NOT INSTALLED
    echo.
    echo Please install Android Studio from:
    echo https://developer.android.com/studio
    echo.
    echo Or run: winget install Google.AndroidStudio
)
pause
