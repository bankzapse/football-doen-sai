/** @type {import('next').NextConfig} */
const nextConfig = {
  // ปักหมุด root ของโปรเจกต์ ไม่ให้ Turbopack ไปมอง lockfile ในโฟลเดอร์อื่น
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
