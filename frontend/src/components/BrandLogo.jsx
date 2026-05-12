export default function BrandLogo({ className = "h-11 w-11" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="PL Analytics logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="18" fill="url(#brand-bg)" />
      <path
        d="M32 12L48 18.2V31.8C48 42.4 41.7 50.4 32 54C22.3 50.4 16 42.4 16 31.8V18.2L32 12Z"
        fill="#0F172A"
        stroke="rgba(255,255,255,0.62)"
        strokeWidth="2"
      />
      <path
        d="M23 22.5H41M23 41.5H41M32 18V46"
        stroke="#34D399"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="32" cy="32" r="7.5" stroke="#34D399" strokeWidth="2" opacity="0.9" />
      <path
        d="M23.5 38V32.5M28.8 38V29M34.2 38V25.5M39.5 38V21.5"
        stroke="#22D3EE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22.5 44.5C25.4 47.2 28.5 49.1 32 50.4C35.5 49.1 38.6 47.2 41.5 44.5"
        stroke="#FBBF24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="brand-bg" x1="8" y1="6" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="0.58" stopColor="#0F766E" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
