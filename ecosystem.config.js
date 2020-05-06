module.exports = {
  apps: [
    {
      name: "xiangbai",
      script: "index.js",
      cwd: "./",
      watch: true,
      ignore_watch: [
        // 不用监听的文件
        "node_modules",
        "logs",
      ],
      instances: 2,
      max_memory_restart: 1,
      error_file: "./logs/error.log",
      autorestart: true,
      NODE_ENV: "production",
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
