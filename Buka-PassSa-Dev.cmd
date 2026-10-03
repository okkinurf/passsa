@echo off
cd /d "%~dp0"
start "PassSa" "%~dp0node_modules\electron\dist\electron.exe" --no-sandbox --passsa-preview .
