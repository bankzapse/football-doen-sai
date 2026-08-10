/** @type {import('next').NextConfig} */
const nextConfig = {
  // ปักหมุด root ของโปรเจกต์ ไม่ให้ Turbopack ไปมอง lockfile ในโฟลเดอร์อื่น
  turbopack: {
    root: import.meta.dirname,
  },
  // เพิ่มลิมิตอัปโหลดผ่าน Server Actions (ดีฟอลต์ 1MB) รองรับรูปจากมือถือ
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
