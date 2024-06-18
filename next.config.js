/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'localhost']
  },
  env: {
    BASE_URL_API_TOKOTITOH: 'https://api.tokotitoh.co.id'
  }
}

module.exports = nextConfig
