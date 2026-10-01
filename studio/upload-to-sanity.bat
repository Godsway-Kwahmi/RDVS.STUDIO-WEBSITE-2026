@echo off
echo ========================================================
echo   RDVS Studio - Sanity Automatic Projects Importer
echo ========================================================
echo.
echo Please wait a moment while we fix your Sanity dependencies...
call npm install --legacy-peer-deps
echo.
echo Now we will upload 138 projects and their images to Sanity.
echo It will open a browser window to securely log you in.
echo.
pause
call npx sanity dataset import projects.ndjson production
echo.
echo Import complete! You can safely close this window.
pause
