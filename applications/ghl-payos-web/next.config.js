/** @type {import('next').NextConfig} */

const nextConfig = {
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeDetection: false,
  },
  reactStrictMode: true,
  env: {
    IMAGE_DOMAIN_UPLOAD: process.env.IMAGE_DOMAIN_UPLOAD,
  },
  images: {
    domains: [process.env.IMAGE_DOMAIN_UPLOAD, process.env.IMAGE_DOMAIN_CDN],
  },
  async rewrites() {
    return {
      fallback: [],
    };
  },
};

module.exports = nextConfig;
