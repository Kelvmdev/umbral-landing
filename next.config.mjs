/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ponytail: picsum para mock; en Fase 2 se añade res.cloudinary.com
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
