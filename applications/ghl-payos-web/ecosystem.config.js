module.exports = {
  apps: [
    {
      name: 'prod-payos-web',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3302',
      watch: false, // optional, adjust as needed
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
