// ============================================================
//  PM2 Ecosystem — Starts BOTH processes on Hostinger
//  Usage:  pm2 start ecosystem.config.js
//          pm2 save
//          pm2 startup
// ============================================================

module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "run start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: "worker",
      script: "npm",
      args: "run worker",
      cwd: "./",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
