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
        pathname: "/**", 
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // This should be valid if using Next.js experimental features
    },
  },
};

export default nextConfig;
