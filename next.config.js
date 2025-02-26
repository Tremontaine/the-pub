module.exports = {
  reactStrictMode: true,
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
  images: {
    unoptimized: true
  },
  output: 'standalone',  // Add this line for Docker deployment
}
