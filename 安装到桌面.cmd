@echo off
setlocal
title CodeCraft Setup
cd /d "%~dp0"

echo.
echo   CodeCraft - installing to your Desktop
echo   ------------------------------------------------
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
if errorlevel 1 goto fail

echo.
pause
exit /b 0

:fail
echo.
echo   Install failed.
echo   Workaround: copy CodeCraft.html to your Desktop and double-click it.
echo.
pause
exit /b 1
