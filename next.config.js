/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // `beforeFiles` so these resolve even though the request paths contain a
      // dot segment (`.well-known`) that the static file handler may not serve.
      beforeFiles: [
        {
          source: "/.well-known/apple-app-site-association",
          destination: "/api/apple-app-site-association",
        },
        {
          source: "/.well-known/assetlinks.json",
          destination: "/api/assetlinks",
        },
      ],
    };
  },
};

module.exports = nextConfig;
