#!/bin/sh

# Build domain args for certbot from DOMAIN_NAME and ALT_NAMES (comma/space separated)
build_domain_args() {
  DOMAIN_ARGS=""
  PRIMARY=""
  # Prefer ALT_NAMES if provided; else fall back to DOMAIN_NAME only
  NAMES="$ALT_NAMES"
  if [ -z "$NAMES" ] && [ -n "$DOMAIN_NAME" ]; then
    NAMES="$DOMAIN_NAME"
  fi
  # Normalize commas to spaces
  NAMES=$(echo "$NAMES" | tr ',' ' ')
  for n in $NAMES; do
    if [ -z "$PRIMARY" ]; then PRIMARY="$n"; fi
    DOMAIN_ARGS="$DOMAIN_ARGS -d $n"
  done
  echo "$PRIMARY|$DOMAIN_ARGS"
}

if [ "$ENABLE_LETSENCRYPT" = True ] && { [ "$DOMAIN_NAME" ] || [ "$ALT_NAMES" ]; }; then

# Resolve primary domain and domain args
PRIM_AND_ARGS=$(build_domain_args)
PRIMARY_DOMAIN=$(echo "$PRIM_AND_ARGS" | cut -d '|' -f1)
CERTBOT_DOMAIN_ARGS=$(echo "$PRIM_AND_ARGS" | cut -d '|' -f2-)

# Paths for host-mounted certificates
host_cert_dir="/host-certs/live/${PRIMARY_DOMAIN}"
host_cert_path="${host_cert_dir}/fullchain.pem"
host_key_path="${host_cert_dir}/privkey.pem"

# Ensure target dirs exist
mkdir -p /host-certs/log /host-certs/work

if [ -f "$host_cert_path" ] && [ -f "$host_key_path" ]; then
    echo "Host-mounted certificates found for ${PRIMARY_DOMAIN}. Checking if renewal is needed..."
    # Check certificate expiration (if less than 30 days, consider it needs renewal)
    if command -v openssl >/dev/null 2>&1; then
        cert_expiry=$(openssl x509 -enddate -noout -in "$host_cert_path" | cut -d= -f2)
        cert_expiry_epoch=$(date -d "$cert_expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$cert_expiry" +%s 2>/dev/null)
        current_epoch=$(date +%s)
        days_until_expiry=$(( (cert_expiry_epoch - current_epoch) / 86400 ))
        if [ $days_until_expiry -lt 30 ]; then
            echo "Certificate expires in $days_until_expiry days. Attempting renewal..."
            certbot certonly -n --webroot --webroot-path /usr/share/nginx/html --no-redirect --agree-tos --email "$USER_EMAIL" $CERTBOT_DOMAIN_ARGS --config-dir /host-certs/ --work-dir /host-certs/work --logs-dir /host-certs/log
            if [ $? -eq 0 ]; then
                echo "Certificate renewed successfully."
                # Update stable symlink to current primary
                rm -f /host-certs/live/current
                ln -s "/host-certs/live/${PRIMARY_DOMAIN}" /host-certs/live/current
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
    echo "Host-mounted certificates not found. Attempting initial issuance into container or host mounts..."
    # Try to place certs into host mounts (preferred)
    certbot certonly -n --webroot --webroot-path /usr/share/nginx/html --no-redirect --agree-tos --email "$USER_EMAIL" $CERTBOT_DOMAIN_ARGS --config-dir /host-certs/ --work-dir /host-certs/work --logs-dir /host-certs/log
    if [ $? -eq 0 ]; then
        echo "Certificate issuance to /host-certs completed."
        rm -f /host-certs/live/current
        ln -s "/host-certs/live/${PRIMARY_DOMAIN}" /host-certs/live/current
        nginx -s reload
    else
        echo "Issuance to host mounts failed. Attempting container-local issuance..."
        certbot certonly -n --webroot --webroot-path /usr/share/nginx/html --no-redirect --agree-tos --email "$USER_EMAIL" $CERTBOT_DOMAIN_ARGS --config-dir /var/log/letsencrypt/ --work-dir /var/log/letsencrypt/work --logs-dir /var/log/letsencrypt/log
        fullchain_path="/var/log/letsencrypt/live/${PRIMARY_DOMAIN}/fullchain.pem"
        if [ $? -eq 0 ] && [ -f "$fullchain_path" ]; then
            echo "Container certificate issuance executed successfully."
            nginx -s reload
        else
            echo "Container certificate issuance failed or certificate not found!"
        fi
    fi
fi

fi
