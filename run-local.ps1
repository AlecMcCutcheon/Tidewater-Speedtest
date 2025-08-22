Write-Host "Starting TWT SpeedTest locally..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "1. nginx installed and in your PATH" -ForegroundColor White
Write-Host "2. SSL certificates in files/nginx.crt and files/nginx.key" -ForegroundColor White
Write-Host "3. Ports 80 and 443 available (may require admin privileges)" -ForegroundColor White
Write-Host ""

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nginxConf = Join-Path $scriptDir "nginx-local.conf"

Write-Host "Starting nginx with local configuration..." -ForegroundColor Cyan
Write-Host "Configuration file: $nginxConf" -ForegroundColor Gray

try {
    # Start nginx
    nginx -c $nginxConf
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "nginx started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access your speed test at:" -ForegroundColor Yellow
        Write-Host "- HTTP:  http://localhost (redirects to HTTPS)" -ForegroundColor White
        Write-Host "- HTTPS: https://localhost" -ForegroundColor White
        Write-Host ""
        Write-Host "Press Ctrl+C to stop nginx..." -ForegroundColor Cyan
        
        # Wait for user to stop
        try {
            while ($true) {
                Start-Sleep -Seconds 1
            }
        }
        catch {
            # User pressed Ctrl+C
        }
    }
    else {
        Write-Host "Failed to start nginx. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error starting nginx: $_" -ForegroundColor Red
}
finally {
    Write-Host ""
    Write-Host "Stopping nginx..." -ForegroundColor Yellow
    nginx -s quit
    Write-Host "Done." -ForegroundColor Green
}
