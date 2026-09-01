export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 10c-8 9-13.5 15.5-13.5 24.5a13.5 13.5 0 0 0 27 0c0-9-5.5-15.5-13.5-24.5z"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1="32" y1="19" x2="32" y2="50" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark({ light = true }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className="font-display text-[15px] font-semibold tracking-[0.14em]"
        style={{ color: light ? "#ECEAE3" : "#0B0F0D" }}
      >
        OAKLEAF <span style={{ color: "var(--primary)" }}>PARTNERS</span>
      </span>
      <span
        className="text-[8px] tracking-[0.34em] uppercase mt-1"
        style={{ color: "var(--text-4)" }}
      >
        Consulting &amp; Design
      </span>
    </span>
  )
}
