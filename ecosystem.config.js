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
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
