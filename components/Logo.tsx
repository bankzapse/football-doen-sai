/** โลโก้ FDS Cup — ไอคอนแอปสี่เหลี่ยมมน เขียว-ทอง (แบบ 5) */
export default function Logo({ size = 38 }: { size?: number }) {
  const id = "fdslogo";
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FDS Cup" role="img">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1fbf5a" />
          <stop offset="1" stopColor="#0a6a2c" />
        </linearGradient>
        <linearGradient id={`${id}-gl`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffe6a0" />
          <stop offset="1" stopColor="#e0a52a" />
        </linearGradient>
      </defs>
      <rect x="16" y="16" width="480" height="480" rx="116" fill={`url(#${id}-bg)`} />
      <rect x="16" y="16" width="480" height="480" rx="116" fill={`url(#${id}-gl)`} />
      <text x="256" y="322" textAnchor="middle" fontFamily="'Arial Black',Helvetica,Arial,sans-serif" fontWeight="900" fontSize="150" letterSpacing="-4" fill="#ffffff">FDS</text>
      <rect x="176" y="352" width="160" height="14" rx="7" fill={`url(#${id}-gold)`} />
    </svg>
  );
}
