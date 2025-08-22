module.exports = {
  apps: [{
    name: 'shakaquest',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/user/webapp',
    env: {
      NODE_ENV: 'development'
    },
    watch: false,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork'
  }]
};