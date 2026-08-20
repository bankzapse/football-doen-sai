/** โลโก้ FDS CUP — โล่ Crest เขียว-ทอง (ตรงกับเพจ Facebook) */
export default function Logo({ size = 38 }: { size?: number }) {
  const id = "fdscrest";
  const shield = "M256,270 H768 V520 C768,662 662,762 512,860 C362,762 256,662 256,520 Z";
  const gloss = "M256,270 H768 V432 C700,472 560,488 512,488 C420,488 320,472 256,432 Z";
  const starD =
    "M0,-52 L12.9,-17.8 L49.5,-16.1 L20.9,6.8 L30.6,42.1 L0,22 L-30.6,42.1 L-20.9,6.8 L-49.5,-16.1 L-12.9,-17.8 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="FDS CUP" role="img">
      <defs>
        <linearGradient id={`${id}-green`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#2ecb64" />
          <stop offset="0.5" stopColor="#0e7a34" />
          <stop offset="1" stopColor="#064e21" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff1c2" />
          <stop offset="0.45" stopColor="#f0c04e" />
          <stop offset="1" stopColor="#b8791a" />
        </linearGradient>
        <linearGradient id={`${id}-goldband`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#d99a26" />
        </linearGradient>
      </defs>
      <path d={shield} fill={`url(#${id}-gold)`} />
      <path d={shield} fill={`url(#${id}-green)`} transform="translate(512,565) scale(0.93) translate(-512,-565)" />
      <path d={shield} fill="none" stroke={`url(#${id}-goldband)`} strokeWidth="6" opacity="0.9" transform="translate(512,565) scale(0.86) translate(-512,-565)" />
      <path d={gloss} fill="#ffffff" opacity="0.12" transform="translate(512,565) scale(0.93) translate(-512,-565)" />
      <path d={starD} transform="translate(432,214)" fill={`url(#${id}-gold)`} stroke="#9a6410" strokeWidth="4" />
      <path d={starD} transform="translate(592,214)" fill={`url(#${id}-gold)`} stroke="#9a6410" strokeWidth="4" />
      <text x="512" y="556" textAnchor="middle" fontFamily="'Arial Black',Helvetica,Arial,sans-serif" fontWeight="900" fontSize="205" letterSpacing="-8" fill="#053a1a">FDS</text>
      <text x="512" y="548" textAnchor="middle" fontFamily="'Arial Black',Helvetica,Arial,sans-serif" fontWeight="900" fontSize="205" letterSpacing="-8" fill="#ffffff">FDS</text>
      <rect x="398" y="576" width="228" height="16" rx="8" fill={`url(#${id}-goldband)`} />
      <polygon points="150,838 250,822 250,904 150,922" fill="#a6720f" />
      <polygon points="874,838 774,822 774,904 874,922" fill="#a6720f" />
      <rect x="236" y="812" width="552" height="96" rx="16" fill={`url(#${id}-goldband)`} stroke="#a6720f" strokeWidth="4" />
      <text x="512" y="888" textAnchor="middle" fontFamily="'Arial Black',Helvetica,Arial,sans-serif" fontWeight="900" fontSize="70" letterSpacing="14" fill="#0a5a2a">CUP</text>
    </svg>
  );
}
