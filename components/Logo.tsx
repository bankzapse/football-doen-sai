/** โลโก้ FDS Cup — โล่เขียว + อักษร FDS + ลูกฟุตบอลในเหรียญทอง */
export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FDS Cup"
      role="img"
    >
      <defs>
        <linearGradient id="fds-shield" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#18b64c" />
          <stop offset="1" stopColor="#0b7a2f" />
        </linearGradient>
      </defs>
      {/* โล่ */}
      <path
        d="M32 3.5 56 12v18.5C56 45 46 55.5 32 60.5 18 55.5 8 45 8 30.5V12L32 3.5Z"
        fill="url(#fds-shield)"
      />
      <path
        d="M32 3.5 56 12v18.5C56 45 46 55.5 32 60.5 18 55.5 8 45 8 30.5V12L32 3.5Z"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      {/* FDS */}
      <text
        x="32"
        y="27.5"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="16.5"
        fontWeight="900"
        letterSpacing="0.5"
        fill="#ffffff"
      >
        FDS
      </text>
      {/* เหรียญทอง + ลูกฟุตบอล */}
      <circle cx="32" cy="42.5" r="9.2" fill="#f4c247" />
      <circle cx="32" cy="42.5" r="9.2" stroke="#0b7a2f" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="32" cy="42.5" r="6.2" fill="#ffffff" />
      <path
        d="M32 37.1l2.6 1.9-1 3h-3.2l-1-3L32 37.1Z"
        fill="#12211b"
      />
      <path
        d="M28 44.4l1.2 3.3 2.8.9 2.8-.9 1.2-3.3-2-1.5h-4l-2 1.5Z"
        fill="#12211b"
        fillOpacity="0.85"
      />
    </svg>
  );
}
