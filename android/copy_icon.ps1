$src = "..\..\..\..\..\..\Desktop\apk LUMINA\photo_2026-03-11_07-15-32.jpg"
$dst = "app\src\main\res\drawable\launcher_icon.png"

Write-Host "Copying icon..."
Write-Host "Source: $src"
Write-Host "Dest: $dst"

if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "SUCCESS: File copied"
    Get-ChildItem "app\src\main\res\drawable" | Select-Object Name
} else {
    Write-Host "ERROR: Source file not found"
}

Read-Host "Press Enter"
