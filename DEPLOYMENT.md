# DigitalOcean Deployment Guide for Resume Builder

## 1. Create DigitalOcean Droplet

1. **Login to DigitalOcean** and create a new droplet
2. **Choose Configuration:**
   - **Image:** Ubuntu 24.04 (LTS) x64
   - **Plan:** Basic - $12/mo (2 GB RAM, 1 CPU, 50 GB SSD)
   - **Region:** Choose closest to your users
   - **Authentication:** SSH Key (recommended) or Password
   - **Hostname:** resumy-server

3. **Wait for droplet creation** and note the IP address

## 2. Initial Server Setup

### Connect to your droplet:
```bash
ssh root@your-droplet-ip
```

**If you get "Permission denied" with password:**
- Make sure you're using `root` as username, not your local username
- Use the root password you set during droplet creation
- Or use SSH key authentication (recommended)

### Run the setup script:
```bash
# First, download the setup script from your repository
wget https://raw.githubusercontent.com/Happyesss/resumyy/main/setup-droplet.sh

# Make setup script executable
chmod +x setup-droplet.sh

# Run setup
./setup-droplet.sh
```

**Alternative method if wget fails:**
```bash
# Create the setup script manually
nano setup-droplet.sh
# Copy and paste the content from setup-droplet.sh file
# Then make it executable and run
chmod +x setup-droplet.sh
./setup-droplet.sh
```

## 3. Configure Environment Variables

Edit the environment file:
```bash
nano /var/www/resumy/.env.production
```

Replace the placeholder values:
```env
NODE_ENV=production
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# AI API Keys
GEMINI_API_KEY=your_actual_gemini_key
GEMINI_ANALYZE_API_KEY=your_actual_analyze_key

# Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_actual_redis_token

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 4. Configure Domain (Optional)

### Update Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/resumy
```

Replace `your-domain.com` with your actual domain:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

### Reload Nginx:
```bash
sudo systemctl reload nginx
```

## 5. Setup SSL Certificate (Recommended)

Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

Get SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 6. GitHub Actions Setup

### Add these secrets to your GitHub repository:
Go to: Repository → Settings → Secrets and variables → Actions

```
DO_HOST = your-droplet-ip
DO_USERNAME = root
DO_SSH_KEY = your-private-ssh-key
NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
GEMINI_API_KEY = your-gemini-api-key
GEMINI_ANALYZE_API_KEY = your-analyze-api-key
UPSTASH_REDIS_REST_URL = your-redis-url
UPSTASH_REDIS_REST_TOKEN = your-redis-token
```

### Test deployment:
1. Push changes to your main branch
2. Check GitHub Actions tab for deployment status
3. Visit your domain/IP to verify deployment

## 7. Monitoring and Maintenance

### Check application status:
```bash
pm2 status
pm2 logs resumy
```

### Monitor system resources:
```bash
htop          # System monitor
df -h         # Disk usage
free -h       # Memory usage
```

### Restart application:
```bash
pm2 restart resumy
```

### Update application:
```bash
cd /var/www/resumy
git pull origin main
npm ci --only=production
npm run build
pm2 restart resumy
```

## 8. Performance Optimization

### Enable Nginx caching:
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                inactive=60m use_temp_path=off;
```

### Monitor logs:
```bash
# Application logs
pm2 logs resumy

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -f
```

## 9. Backup Strategy

### Automated backup script:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /home/backup/resumy_$DATE.tar.gz /var/www/resumy
# Keep only last 7 backups
find /home/backup -name "resumy_*.tar.gz" -type f -mtime +7 -delete
```

### Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## 10. Troubleshooting

### Common issues:

**Application won't start:**
```bash
pm2 logs resumy
npm run build
```

**High memory usage:**
```bash
pm2 restart resumy
# Consider upgrading to $24/mo plan
```

**SSL certificate issues:**
```bash
sudo certbot renew --dry-run
sudo systemctl reload nginx
```

**Database connection issues:**
- Check Supabase credentials in `.env.production`
- Verify network connectivity
- Check Supabase dashboard for status

### Performance monitoring:
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor in real-time
htop        # CPU/Memory
iotop       # Disk I/O
nethogs     # Network usage
```

## Support

If you encounter issues:
1. Check application logs: `pm2 logs resumy`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables in `.env.production`
4. Ensure all services are running: `sudo systemctl status nginx`
