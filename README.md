# TWT SpeedTest with HTTP to HTTPS Redirection

This project provides a self-hosted speed test server with automatic HTTP to HTTPS redirection while preserving Let's Encrypt challenge endpoints.

## Features

- **HTTP to HTTPS Redirection**: All HTTP traffic is automatically redirected to HTTPS
- **Let's Encrypt Support**: Preserves the `/.well-known/acme-challenge/` endpoint for certificate validation
- **Docker Support**: Ready-to-use Docker container with host-mounted certificate support
- **Local Development**: Separate configuration for local testing vs Docker deployment

## Configuration Files

### Docker Configuration (`files/OpenSpeedTest-Server.conf`)
- Used when running in Docker container
- Handles host-mounted certificates at `/host-certs/`
- Includes fallback to container certificates
- Supports both IPv4 and IPv6

### Local Development Configuration (`conf.d/OpenSpeedTest-Server.conf`)
- Used for local testing and development
- Uses local certificate files
- Same HTTP to HTTPS redirection logic

## Docker Deployment

### Basic Setup
```bash
sudo docker run -d \
  -e ENABLE_LETSENCRYPT=True \
  -e DOMAIN_NAME=yourdomain.com \
  -e USER_EMAIL=your@email.com \
  -p 80:3000 \
  -p 443:3001 \
  --name speedtest \
  your-image-name
```

### With Host-Mounted Certificates
```bash
sudo docker run -d \
  -e ENABLE_LETSENCRYPT=True \
  -e DOMAIN_NAME=hermes.tidewater.net \
  -e USER_EMAIL=benr@lintelco.net \
  -v /opt/tidewater-certs:/host-certs \
  -v /opt/tidewater-certs/letsencrypt:/var/log/letsencrypt \
  -p 80:3000 \
  -p 443:3001 \
  --name tidewater-speedtest \
  tidewater-speedtest
```

## How HTTP to HTTPS Redirection Works

### HTTP Server Block (Port 3000)
- Listens on port 3000 (HTTP)
- **Preserves** `/.well-known/acme-challenge/` endpoint for Let's Encrypt
- **Redirects** all other traffic to HTTPS with 301 status

### HTTPS Server Block (Port 3001)
- Listens on port 3001 (HTTPS)
- Serves the main application
- Also accessible via `/.well-known/acme-challenge/` for certificate validation

## Let's Encrypt Integration

### Certificate Priority
1. **Host-mounted certificates** (if available)
   - Path: `/host-certs/live/DOMAIN_NAME/`
   - Automatically detected and used
2. **Container certificates** (fallback)
   - Path: `/var/log/letsencrypt/live/DOMAIN_NAME/`
   - Generated if host certificates not available

### Challenge Endpoint
- **HTTP**: `http://yourdomain.com:3000/.well-known/acme-challenge/`
- **HTTPS**: `https://yourdomain.com:3001/.well-known/acme-challenge/`
- Both endpoints serve the same content for certificate validation

## Port Mapping

| Container Port | Host Port | Protocol | Purpose |
|----------------|-----------|----------|---------|
| 3000 | 80 | HTTP | Redirect to HTTPS + Let's Encrypt challenges |
| 3001 | 443 | HTTPS | Main application + SSL |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_LETSENCRYPT` | Enable Let's Encrypt support | `false` |
| `DOMAIN_NAME` | Your domain name | `false` |
| `USER_EMAIL` | Email for Let's Encrypt notifications | `false` |
| `CHANGE_CONTAINER_PORTS` | Allow custom port mapping | `false` |
| `HTTP_PORT` | Custom HTTP port | `3000` |
| `HTTPS_PORT` | Custom HTTPS port | `3001` |

## Certificate Renewal

The container automatically:
- Checks certificate expiration
- Renews certificates when needed (< 30 days)
- Reloads nginx after renewal
- Supports both host-mounted and container certificates

## Security Features

- **TLS 1.2/1.3 only** (removed TLS 1.0/1.1)
- **Strong cipher suites** for production use
- **Automatic redirects** ensure all traffic uses HTTPS
- **Let's Encrypt challenges** remain accessible on HTTP for validation

## Troubleshooting

### Certificate Issues
- Check that host-mounted certificates exist and are readable
- Verify domain name matches certificate
- Check Let's Encrypt challenge endpoint accessibility

### Redirect Issues
- Ensure both ports 80 and 443 are accessible
- Check firewall rules for both ports
- Verify nginx configuration syntax

### Let's Encrypt Challenges
- Test `http://yourdomain.com/.well-known/acme-challenge/`
- Ensure webroot path is correct
- Check container logs for certificate errors

## Local Development

For local testing without Docker:
1. Use `nginx-local.conf` as main nginx config
2. Use `conf.d/OpenSpeedTest-Server.conf` for server config
3. Place certificates in `files/` directory
4. Run nginx from project root

## Building and Running

### Build Docker Image
```bash
docker build -t tidewater-speedtest .
```

### Run Container
```bash
docker run -d \
  -e ENABLE_LETSENCRYPT=True \
  -e DOMAIN_NAME=yourdomain.com \
  -e USER_EMAIL=your@email.com \
  -v /path/to/certs:/host-certs \
  -p 80:3000 \
  -p 443:3001 \
  --name speedtest \
  tidewater-speedtest
```

### View Logs
```bash
docker logs -f speedtest
```

## Notes

- The container automatically detects and uses host-mounted certificates
- Let's Encrypt challenges work on both HTTP and HTTPS
- All other HTTP traffic is permanently redirected to HTTPS
- Certificate renewal happens automatically via cron
- Supports both IPv4 and IPv6 (if available)
