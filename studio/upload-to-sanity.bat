@echo off
rem Imports studio/projects.ndjson into the Sanity dataset.
rem
rem The ndjson is GENERATED - rebuild it first so the CMS cannot import a stale catalogue:
rem     py -3.10 ..\scriptsuild_sanity_seed.py --write
rem
rem Run this from inside studio\. It imports project documents only; the seed carries no image
rem fields on purpose, so heroImage / cardImage / gallery are attached in the Studio afterwards.
rem Full walkthrough: SANITY-SETUP.md
rem
cd /d "%~dp0"
echo ========================================================
echo   RDVS Studio - import the project catalogue into Sanity
echo ========================================================
echo.
if not exist projects.ndjson (
  echo projects.ndjson is missing. Run:  py -3.10 ..\scriptsuild_sanity_seed.py --write
  exit /b 1
)
if not exist node_modules\sanity (
  echo Installing Studio dependencies. If this hangs, the folder is on a synced drive -
  echo copy studio\ somewhere local and install there instead. See SANITY-SETUP.md.
  call npm install
)
echo.
echo Importing every project document into dataset "production" (re-imports by _id).
echo A browser window opens to log you in unless SANITY_IMPORT_TOKEN is already set.
echo.
pause
call npx sanity datasets import -d production projects.ndjson --replace
if errorlevel 1 (
  echo.
  echo Import failed. Check the message above - most often it is a missing or read-only token.
  pause
  exit /b 1
)
echo.
echo Import complete. Verify it in the Studio, then attach the images.
pause
