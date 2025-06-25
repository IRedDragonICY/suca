@echo off
echo ========================================
echo SUCA - Portable Version Builder
echo ========================================
echo.

echo Cleaning up previous processes...
taskkill /f /im electron.exe 2>nul
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Removing old build files...
if exist release rmdir /s /q release 2>nul
timeout /t 1 >nul

echo [1/2] Building React application...
call npm run build
if %errorlevel% neq 0 goto error

echo.
echo [2/2] Building portable executable...
call npx electron-builder --win portable --x64 --publish=never
if %errorlevel% neq 0 goto error

echo.
echo ========================================
echo PORTABLE BUILD COMPLETED!
echo ========================================
echo.
echo Portable executable created:
echo %cd%\release\SUCA-Portable-0.1.0.exe
echo.
echo This is a single executable file that doesn't require installation.
echo You can copy and run it on any Windows computer.
echo.
pause
goto end

:error
echo.
echo ========================================
echo BUILD FAILED!
echo ========================================
echo Please check the error messages above.
echo.
pause

:end 