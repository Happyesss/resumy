module.exports = {
  apps: [{
    name: 'resumy',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/resumy',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/resumy-error.log',
    out_file: '/var/log/pm2/resumy-out.log',
    log_file: '/var/log/pm2/resumy-combined.log',
    time: true
  }]
}
