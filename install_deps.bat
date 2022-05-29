@echo off
cd "./frontend"
call install_deps.bat
cd "../backend"
call install_deps.bat
echo.
echo.
echo Done installing dependencies!
pause