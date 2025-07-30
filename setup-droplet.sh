#!/bin/bash

# DigitalOcean Droplet Setup Script for Resume Builder
# Run this on your Ubuntu 24.04 LTS droplet

set -e

echo "🚀 Setting up Resume Builder on DigitalOcean..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install Git
echo "📦 Installing Git..."
sudo apt install -y git

# Create app directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/resumy
sudo chown -R $USER:$USER /var/www/resumy

# Clone repository (replace with your repo URL)
echo "📥 Cloning repository..."
cd /var/www
git clone https://github.com/Happyesss/resumyy.git resumy
cd resumy

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --only=production

# Create environment file
echo "⚙️ Creating environment file..."
sudo tee /var/www/resumy/.env.production > /dev/null << 'EOF'
NODE_ENV=production
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key
GEMINI_ANALYZE_API_KEY=your_gemini_analyze_api_key

# Redis Configuration
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF

echo "⚠️  Please edit /var/www/resumy/.env.production with your actual values"

# Build the application
echo "🏗️ Building application..."
npm run build

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/resumy > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain

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
        
        # Increase timeout for AI/PDF operations
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Handle static files
    location /_next/static {
        alias /var/www/resumy/.next/static;
        expires 365d;
        access_log off;
    }

    # Handle public assets
    location /static {
        alias /var/www/resumy/public;
        expires 365d;
        access_log off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/resumy /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start and enable services
echo "🔄 Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit /var/www/resumy/.env.production with your actual environment variables"
echo "2. Update the Nginx config with your domain: sudo nano /etc/nginx/sites-available/resumy"
echo "3. Reload Nginx: sudo systemctl reload nginx"
echo "4. Set up SSL with Let's Encrypt (optional but recommended)"
echo "5. Add GitHub secrets for CI/CD deployment"
echo ""
echo "🔧 Useful commands:"
echo "  pm2 status                 - Check application status"
echo "  pm2 logs resumy           - View application logs"
echo "  pm2 restart resumy        - Restart application"
echo "  sudo systemctl status nginx - Check Nginx status"
echo ""
echo "Your app should be accessible at: http://your-server-ip"
