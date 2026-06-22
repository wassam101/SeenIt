@echo off
cd /d "%~dp0"

echo Checking Docker...
docker info >nul 2>nul
if errorlevel 1 (
    echo Starting Docker Desktop, this can take a minute...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    :waitdocker
    timeout /t 3 >nul
    docker info >nul 2>nul
    if errorlevel 1 goto waitdocker
)

echo Starting local database...
call npx supabase start

echo Starting SeenIt server...
start "SeenIt server" cmd /k "npm run dev"

echo Waiting for SeenIt to come online...
:waitserver
timeout /t 2 >nul
curl -s -o nul http://localhost:3000
if errorlevel 1 goto waitserver

start "" "http://localhost:3000"
echo SeenIt is running. Close the "SeenIt server" window to stop it.
