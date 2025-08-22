#!/bin/sh

if [ "$ENABLE_LETSENCRYPT" = True ] && [ "$DOMAIN_NAME" ] && [ "$USER_EMAIL" ]; then

# Check if host-mounted certificates exist
host_cert_path="/host-certs/live/${DOMAIN_NAME}/fullchain.pem"
host_key_path="/host-certs/live/${DOMAIN_NAME}/privkey.pem"

if [ -f "$host_cert_path" ] && [ -f "$host_key_path" ]; then
    echo "Host-mounted certificates found. Checking if renewal is needed..."
    
    # Check certificate expiration (if less than 30 days, consider it needs renewal)
    if command -v openssl >/dev/null 2>&1; then
        cert_expiry=$(openssl x509 -enddate -noout -in "$host_cert_path" | cut -d= -f2)
        cert_expiry_epoch=$(date -d "$cert_expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$cert_expiry" +%s 2>/dev/null)
        current_epoch=$(date +%s)
        days_until_expiry=$(( (cert_expiry_epoch - current_epoch) / 86400 ))
        
        if [ $days_until_expiry -lt 30 ]; then
            echo "Certificate expires in $days_until_expiry days. Attempting renewal..."
            # Try to renew using host-mounted webroot
            certbot certonly -n --webroot --webroot-path /usr/share/nginx/html --no-redirect --agree-tos --email "$USER_EMAIL" -d "$DOMAIN_NAME" --config-dir /host-certs/ --work-dir /host-certs/work --logs-dir /host-certs/log
            if [ $? -eq 0 ]; then
                echo "Certificate renewed successfully."
                nginx -s reload
            else
                echo "Certificate renewal failed."
            fi
        else
            echo "Certificate is valid for $days_until_expiry more days. No renewal needed."
        fi
    else
        echo "OpenSSL not available. Skipping certificate expiration check."
    fi
else
    echo "Host-mounted certificates not found. Attempting to renew container certificates..."
    
    # Fallback to container certificate renewal
    fullchain_path="/var/log/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem"
    
    certbot certonly -n --webroot --webroot-path /usr/share/nginx/html --no-redirect --agree-tos --email "$USER_EMAIL" -d "$DOMAIN_NAME" --config-dir /var/log/letsencrypt/ --work-dir /var/log/letsencrypt/work --logs-dir /var/log/letsencrypt/log
    
    if [ $? -eq 0 ]; then
        echo "Container certificate renewal executed successfully."
        if [ -f "$fullchain_path" ]; then
            nginx -s reload
            echo "Nginx reloaded after certificate renewal."
        else
            echo "letsencrypt Certificates Not Found after renewal!"
        fi
    else
        echo "Container certificate renewal failed."
    fi
fi

fi
