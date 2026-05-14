/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/product/out-of-madness",
        destination: "/books/out-of-madness",
        permanent: true,
      },
    ];
  },


  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bluone.ink",
      },
      {
        protocol: "https",
        hostname: "bluone-ink.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bluone-ink.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dashboard.bluone.ink",
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:3000 https://dashboard.bluone.ink https://www.bluone.ink http://204.236.201.166:3000;",
          },
        ],
      },
    ];
  },

};

export default nextConfig;