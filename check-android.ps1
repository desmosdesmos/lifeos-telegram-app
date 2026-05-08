$items = Get-ChildItem 'C:\Android' -Force
$items | ForEach-Object { Write-Host $_.FullName }
$items | Out-File 'C:\Users\Yan\Desktop\apk LUMINA\LIFE OS\android-check-result.txt'
Write-Host "Result saved to file"
