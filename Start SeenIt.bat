@echo off
setlocal
cd /d "%~dp0"

echo Checking Docker...
docker info >nul 2>nul
if not errorlevel 1 goto dockerready

echo Starting Docker Desktop, this can take a minute...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
set dockertries=0

:waitdocker
set /a dockertries+=1
if %dockertries% gtr 40 goto dockertimeout
<nul set /p "=."
timeout /t 3 >nul
docker info >nul 2>nul
if errorlevel 1 goto waitdocker
echo.
goto dockerready

:dockertimeout
echo.
echo Docker did not start after two minutes. Please start Docker Desktop manually and try again.
pause
exit /b 1

:dockerready
echo Starting local database...
call npx supabase start
echo.

echo Checking if SeenIt server is already running...
powershell -NoProfile -Command "(Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue).TcpTestSucceeded" | findstr /i "True" >nul
if not errorlevel 1 goto openbrowser

echo Starting SeenIt server in a new window...
start "SeenIt server" cmd /k npm run dev

echo Waiting for SeenIt to come online...
set servertries=0

:waitserver
set /a servertries+=1
if %servertries% gtr 60 goto servertimeout
<nul set /p "=."
timeout /t 2 >nul
powershell -NoProfile -Command "(Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue).TcpTestSucceeded" | findstr /i "True" >nul
if errorlevel 1 goto waitserver
echo.
goto openbrowser

:servertimeout
echo.
echo SeenIt did not come online after two minutes.
echo Check the "SeenIt server" window for errors, then try again.
pause
exit /b 1

:openbrowser
start "" "http://localhost:3000"
echo SeenIt is running at http://localhost:3000
echo Close the "SeenIt server" window to stop it.
pause
