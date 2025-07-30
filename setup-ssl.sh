#!/bin/bash

# SSL Setup Script for Resume Builder
# Run this after basic setup is complete

set -e

echo "🔒 Setting up SSL certificate..."

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <your-domain.com>"
    echo "Example: $0 resumy.example.com"
    exit 1
fi

DOMAIN=$1

# Install Certbot
echo "📦 Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Update Nginx configuration with domain
echo "🌐 Updating Nginx configuration..."
sudo sed -i "s/your-domain.com www.your-domain.com/$DOMAIN www.$DOMAIN/g" /etc/nginx/sites-available/resumy

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Setup automatic renewal
echo "⏰ Setting up automatic renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
echo "🧪 Testing renewal..."
sudo certbot renew --dry-run

echo "✅ SSL setup complete!"
echo "Your site is now accessible at: https://$DOMAIN"
echo ""
echo "📋 SSL Management commands:"
echo "  sudo certbot certificates           - List certificates"
echo "  sudo certbot renew                 - Manually renew certificates"
echo "  sudo systemctl status certbot.timer - Check auto-renewal status"
