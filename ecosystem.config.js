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
      autorestart: true,
      NODE_ENV: "production",
    },
  ],

  deploy: {
    production: {
    },
  },
};
