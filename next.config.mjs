/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        destination: '/.well-known/apple-developer-merchantid-domain-association',
      },
    ];
  },
  images: {
    domains: ['img.icons8.com',"firebasestorage.googleapis.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;