@echo off
echo Starting TWT SpeedTest locally...
echo.
echo Make sure you have:
echo 1. nginx installed and in your PATH
echo 2. SSL certificates in files/nginx.crt and files/nginx.key
echo 3. Ports 80 and 443 available (may require admin privileges)
echo.
echo Starting nginx with local configuration...
nginx -c "%~dp0nginx-local.conf"
echo.
echo If successful, nginx is now running:
echo - HTTP:  http://localhost (redirects to HTTPS)
echo - HTTPS: https://localhost
echo.
echo Press any key to stop nginx...
pause >nul
echo Stopping nginx...
nginx -s quit
echo Done.
