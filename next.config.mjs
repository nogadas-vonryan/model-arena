/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "lucide-react",
    ],
  },
};

export default nextConfig;
