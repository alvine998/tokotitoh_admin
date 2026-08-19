/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    BASE_URL_API_TOKOTITOH: 'https://api.tokonyang.com'
  }
}

module.exports = nextConfig
