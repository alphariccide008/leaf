/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // The Desktop folder on this machine is synced/scanned, which makes Next's
  // webpack filesystem cache fail its atomic rename ('*.pack.gz_' -> '*.pack.gz')
  // and intermittently corrupts route manifests (routes 404/500 in dev).
  // Disabling the persistent fs cache keeps dev builds reliable here.
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

export default nextConfig
