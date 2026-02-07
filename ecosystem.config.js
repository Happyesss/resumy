module.exports = {
  apps: [{
    name: 'resumy',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/resumy',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '900M',
    
    // Graceful shutdown - give the server time to finish ongoing requests
    kill_timeout: 10000,
    listen_timeout: 15000,
    shutdown_with_message: true,
    
    // Restart strategies to prevent infinite restart loops
    max_restarts: 15,
    min_uptime: '10s',
    restart_delay: 5000,
    exp_backoff_restart_delay: 1000,
    
    // Scheduled restart every day at 4 AM UTC to prevent memory leaks & stale state
    cron_restart: '0 4 * * *',
    
    // Logging
    error_file: '/var/www/resumy/logs/pm2-error.log',
    out_file: '/var/www/resumy/logs/pm2-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
