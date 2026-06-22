export function EyeLogo({ className, blinkDelay = 0 }: { className?: string; blinkDelay?: number }) {
  return (
    <svg viewBox="0 0 120 80" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g className="eye-blink-loop" style={{ animationDelay: `${blinkDelay}s` }}>
        <path
          d="M2 38 Q60 -10 118 38 Q60 86 2 38 Z"
          fill="var(--color-paper)"
          stroke="var(--color-teal)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="38" r="16" fill="var(--color-teal)" />
        <circle cx="53" cy="31" r="4.5" fill="var(--color-paper)" />
      </g>
      <circle cx="100" cy="12" r="4" fill="var(--color-signal)" />
    </svg>
  )
}
