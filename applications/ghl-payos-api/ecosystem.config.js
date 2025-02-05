module.exports = {
  apps: [
    {
      name: `prod-payos-api`,
      instances: '1',
      exec_mode: 'fork',
      script: 'dist/main.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
