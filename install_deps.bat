@echo off
cd "./backend"
call install_deps.bat
cd "../frontend"
call install_deps.bat
echo.
echo.
echo.
echo.
echo.
echo Done installing dependencies!
pause