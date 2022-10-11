import withNextBundleAnalyzer from 'next-bundle-analyzer';

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

const shouldAnalyzeBundles = process.env.ANALYZE === 'true';

export default withNextBundleAnalyzer({
  enabled: shouldAnalyzeBundles,
})(nextConfig);
