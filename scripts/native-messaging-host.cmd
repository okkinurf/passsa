@echo off
setlocal
set "PASSA_ROOT=%~dp0.."
if exist "%PASSA_ROOT%\node.exe" (
  "%PASSA_ROOT%\node.exe" "%~dp0native-messaging-host.js"
) else if defined PASSA_NODE_EXE (
  "%PASSA_NODE_EXE%" "%~dp0native-messaging-host.js"
) else (
  node "%~dp0native-messaging-host.js"
)
endlocal
