export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.1 10.8l7.7-4.4M8.1 13.2l7.7 4.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
