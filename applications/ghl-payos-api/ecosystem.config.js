module.exports = {
  apps: [
    {
      name: `prod-payos-api`,
      instances: '1',
      exec_mode: 'fork',
      script: 'dist/main.js',
    },
  ],
};
