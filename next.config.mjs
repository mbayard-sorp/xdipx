/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Shopify CDN
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      // Nalpac product images
      {
        protocol: "https",
        hostname: "**.nalpac.com",
        pathname: "/**",
      },
      // Generic CDN for product images from feed
      {
        protocol: "https",
        hostname: "**.wyomind.com",
        pathname: "/**",
      },
      // Google Cloud Storage (Imagen output)
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  // Suppress Framer Motion SSR warnings
  experimental: {
    serverComponentsExternalPackages: ["google-auth-library"],
  },
};

export default nextConfig;
