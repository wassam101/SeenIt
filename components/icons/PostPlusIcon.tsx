export function PostPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" stroke="var(--color-teal)" strokeWidth="2" />
      <path d="M12 7v10M7 12h10" stroke="var(--color-teal)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
