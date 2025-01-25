/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**", // This allows any sub-paths under i.postimg.cc
      },
    ],
  },

  experimental: {
    serverActions: true, // Enable server actions (experimental in Next.js 13+)
  },
};

export default nextConfig;
