@echo off
chcp 65001 >nul
echo Copying icon...
copy /Y "..\..\..\..\..\..\Desktop\apk LUMINA\photo_2026-03-11_07-15-32.jpg" "app\src\main\res\drawable\launcher_icon.png"
if exist "app\src\main\res\drawable\launcher_icon.png" (
    echo SUCCESS! Icon copied.
) else (
    echo ERROR! Icon not copied.
)
pause
