# SSL Configuration Fix for resumy.live

## Problem
Your SSL certificates were being removed after each deployment because the GitHub Actions workflow was recreating the Nginx configuration file from scratch, overwriting any SSL settings.

## Solution
I've updated the deployment workflow to automatically detect and use your existing SSL certificates.

## Current Status
Based on the server inspection, you have:
- ✅ SSL certificates already present in `/etc/ssl/resumy/`
- ✅ Private key: `/etc/ssl/resumy/resumy.live.key`
- ✅ Certificate: `/etc/ssl/resumy/resumy.live.crt`
- ✅ CA Bundle: `/etc/ssl/resumy/resumy.live.ca-bundle`
- ✅ Full chain: `/etc/ssl/resumy/resumy.live.fullchain.crt`

## Immediate Fix
To enable SSL right now (before your next deployment):

1. Upload the `enable-ssl-now.sh` script to your server:
   ```bash
   scp enable-ssl-now.sh root@68.183.86.136:/root/
   ```

2. Run the script on your server:
   ```bash
   ssh root@68.183.86.136
   bash enable-ssl-now.sh
   ```

This will immediately enable SSL using your existing certificates.

## Permanent Fix
The GitHub Actions workflow (`.github/workflows/deploy.yml`) has been updated to:

1. **Check for existing SSL certificates** before creating Nginx config
2. **Use SSL configuration** if certificates are found at `/etc/ssl/resumy/resumy.live.key` and `/etc/ssl/resumy/resumy.live.fullchain.crt`
3. **Fall back to HTTP** only if certificates are not found

### Key Changes Made:
- The workflow now checks: `if [ -f /etc/ssl/resumy/resumy.live.key ] && [ -f /etc/ssl/resumy/resumy.live.fullchain.crt ]`
- If certificates exist, it creates an SSL-enabled configuration with HTTPS redirect
- If certificates don't exist, it creates HTTP-only configuration

## Future Deployments
From now on, when you push code:
1. GitHub Actions will detect your existing SSL certificates
2. It will create an SSL-enabled Nginx configuration
3. Your SSL will be preserved across deployments

## Certificate Renewal
When you need to renew your certificates:
1. Replace the files in `/etc/ssl/resumy/`
2. Ensure the fullchain file exists: `/etc/ssl/resumy/resumy.live.fullchain.crt`
3. The next deployment will automatically use the new certificates

## Manual SSL Management Commands
```bash
# Check certificate status
sudo ls -la /etc/ssl/resumy/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx after changes
sudo systemctl reload nginx

# Check certificate expiration
sudo openssl x509 -in /etc/ssl/resumy/resumy.live.crt -text -noout | grep "Not After"
```

## Verification
After running the immediate fix, verify SSL is working:
- Visit: https://resumy.live
- Check that HTTP redirects to HTTPS
- Verify the certificate in your browser

The SSL issue should now be permanently resolved!
