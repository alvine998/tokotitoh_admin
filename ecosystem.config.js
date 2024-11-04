// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: 'tokotitohadmin',
        script: 'npm',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 3002, // Adjust port if needed
        },
      },
    ],
  };
  