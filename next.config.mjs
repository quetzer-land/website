/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config');
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.quetzer.land",
        pathname: "/**",
      },
    ],
  },
  i18n: {
    locales: ["default", "en", "fr"],
    defaultLocale: "default",
    localeDetection: false,
  },
};

export default nextConfig;
