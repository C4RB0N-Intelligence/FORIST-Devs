/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      // Allows images hosted on any Supabase project bucket
      { protocol: "https", hostname: "*.supabase.co" }, 
    ],
  },
};

export default nextConfig;