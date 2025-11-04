// next.config.js
const createNextIntlPlugin = require("next-intl/plugin");

// On indique où se trouve la config i18n (src/i18n/request.ts)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
