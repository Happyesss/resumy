#!/bin/bash
# SSL Setup Script for Private Certificate
# Run this script on your server after deployment to configure SSL

echo "Setting up SSL with private certificate..."

# Configuration variables - UPDATE THESE PATHS
CERT_PATH="/path/to/your/certificate.crt"
KEY_PATH="/path/to/your/private.key"
NGINX_CONFIG="/etc/nginx/sites-available/resumy.live"

echo "Please provide the paths to your certificate files:"
read -p "Certificate file path (.crt or .pem): " CERT_PATH
read -p "Private key file path (.key): " KEY_PATH

# Verify certificate files exist
if [ ! -f "$CERT_PATH" ]; then
    echo "Error: Certificate file not found at $CERT_PATH"
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo "Error: Private key file not found at $KEY_PATH"
    exit 1
fi

# Test certificate and key match
if ! openssl x509 -noout -modulus -in "$CERT_PATH" | openssl md5 | grep -q "$(openssl rsa -noout -modulus -in "$KEY_PATH" | openssl md5)"; then
    echo "Warning: Certificate and private key may not match. Please verify your files."
fi

# Create SSL-enabled Nginx configuration
cat > "$NGINX_CONFIG" << EOF
server {
    listen 80;
    server_name resumy.live www.resumy.live;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name resumy.live www.resumy.live;
    
    # SSL Certificate Configuration
    ssl_certificate $CERT_PATH;
    ssl_certificate_key $KEY_PATH;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/resumy.live /etc/nginx/sites-enabled/

# Test Nginx configuration
if nginx -t; then
    echo "Nginx configuration test passed!"
    
    # Reload Nginx
    systemctl reload nginx
    
    echo "SSL configuration completed successfully!"
    echo "Your site should now be accessible at https://resumy.live"
    
    # Test SSL
    echo "Testing SSL certificate..."
    openssl s_client -connect resumy.live:443 -servername resumy.live < /dev/null 2>/dev/null | openssl x509 -noout -dates
    
else
    echo "Error: Nginx configuration test failed!"
    echo "Please check your certificate files and paths."
    exit 1
fi
