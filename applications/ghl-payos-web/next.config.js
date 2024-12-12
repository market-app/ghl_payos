const nextConfig = {
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeDetection: false,
  },
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [],
    };
  },
};

module.exports = nextConfig;
