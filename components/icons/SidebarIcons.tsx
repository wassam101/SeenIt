// Sidebar nav icons. Two-tone teal/signal line icons matching the rest of
// the icon set's style (e.g. icons/Share.tsx, icons/Eye.tsx) rather than a
// dark neon-glow treatment, since this app's surface is paper-white.
export function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2.5" y="6.5" width="19" height="13" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 6.5l1.6-2.2h4.8L16 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.2 8.8l-2 4.4-4.4 2 2-4.4 4.4-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6 10a6 6 0 1 1 12 0c0 2.6 1 4 1.6 4.8H4.4C5 14 6 12.6 6 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 18.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function DiscussionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3 6.5A2 2 0 0 1 5 4.5h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8l-3.4 2.6A.6.6 0 0 1 3.6 15.6L4 13.5H5a2 2 0 0 1-2-2v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 13.5h2.4l3 2.3a.5.5 0 0 0 .8-.5l-.4-1.8h.7a1.8 1.8 0 0 0 1.8-1.8v-4A1.8 1.8 0 0 0 17.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 3.5h12v17l-6-4.2-6 4.2v-17Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function InsightsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 20V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="7" y="13" width="2.6" height="7" stroke="currentColor" strokeWidth="1.4" />
      <rect x="12" y="9" width="2.6" height="11" stroke="currentColor" strokeWidth="1.4" />
      <rect x="17" y="5.5" width="2.6" height="14.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9.5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.8 18.2a6.6 6.6 0 0 1 12.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function SettingsGearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5v9M7.5 12h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
