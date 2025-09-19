/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' ${isDev ? "'unsafe-eval'" : ""};
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self' https:;
              font-src 'self';
            `.replace(/\n/g, ""), // remove newlines
          },
        ],
      },
    ];
  },
};

export default nextConfig;
