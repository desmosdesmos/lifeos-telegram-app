@echo off
echo Checking Android folder structure...
dir C:\Android /s /b > C:\Android\check.txt
type C:\Android\check.txt
