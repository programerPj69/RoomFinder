/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for Firebase hosting
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
}

export default nextConfig
