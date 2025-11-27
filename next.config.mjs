/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static export to allow dynamic pages
  output: undefined,
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
};

export default nextConfig;
