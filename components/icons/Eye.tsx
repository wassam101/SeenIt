export function EyeIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path
            d="M1 10C5 3 12 1 16 1s11 2 15 9c-4 7-11 9-15 9S5 17 1 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="10" r="4.5" fill="currentColor" />
          <circle cx="14.3" cy="8.3" r="1.3" fill="#ffffff" />
        </>
      ) : (
        <>
          <path
            d="M1 11.5C5 6 12 3.5 16 3.5s11 2.5 15 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M3 8.5c3.2 4 8.4 6.3 13 6.3s9.8-2.3 13-6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M9 15.6l-1.3 2.6M16 16.4v2.9M23 15.6l1.3 2.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
