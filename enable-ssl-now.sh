#!/bin/bash

# Script to immediately enable SSL on your server
# Run this script on your server: bash enable-ssl-now.sh

echo "Enabling SSL for resumy.live immediately..."

# Backup current config
sudo cp /etc/nginx/sites-available/resumy.live /etc/nginx/sites-available/resumy.live.backup

# Create SSL-enabled Nginx configuration
sudo tee /etc/nginx/sites-available/resumy.live > /dev/null << 'NGINX_EOF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name resumy.live www.resumy.live;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name resumy.live www.resumy.live;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/resumy/resumy.live.fullchain.crt;
    ssl_certificate_key /etc/ssl/resumy/resumy.live.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid. Reloading Nginx..."
    sudo systemctl reload nginx
    echo "SSL has been enabled! Your site should now be available at https://resumy.live"
else
    echo "Nginx configuration has errors. Restoring backup..."
    sudo cp /etc/nginx/sites-available/resumy.live.backup /etc/nginx/sites-available/resumy.live
    echo "Backup restored. Please check the SSL certificate paths."
fi

echo "Current SSL certificate status:"
sudo ls -la /etc/ssl/resumy/
