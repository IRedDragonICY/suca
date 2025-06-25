@echo off
echo ========================================
echo SUCA - Subnet Calculator Builder
echo ========================================
echo.

echo Cleaning up previous processes...
taskkill /f /im electron.exe 2>nul
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Removing old build files...
if exist release rmdir /s /q release 2>nul
timeout /t 1 >nul

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 goto error

echo.
echo [2/3] Building React application...
call npm run build
if %errorlevel% neq 0 goto error

echo.
echo [3/3] Building Windows executable...
call npx electron-builder --win --x64 --publish=never
if %errorlevel% neq 0 goto error

echo.
echo ========================================
echo BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Files created in 'release' folder:
echo - SUCA Setup.exe (Installer)
echo - SUCA-Portable.exe (Portable version)
echo - win-unpacked/ (Unpacked executable)
echo.
echo You can find the built application in:
echo %cd%\release\
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