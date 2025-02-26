module.exports = {
  reactStrictMode: true,
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
  images: {
    unoptimized: true // Disable image optimization to avoid fetchPriority issues
  },
  webpack: (config, { dev }) => {
    // Disable cache in development mode to avoid permission errors
    if (dev) {
      config.cache = false;
    }
    return config;
  },
}