'use client'
import { useEffect, useRef, useState } from 'react'

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 11l18-7-7 18-3-7-8-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

// There's no chat backend yet (no conversations/messages tables, no
// realtime layer), so this opens the same panel shape Instagram uses
// (title, expand/close, list of threads) but shows an honest empty state
// rather than faking real conversations.
export function MessagesFlyout() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Messages" className="text-ink hover:text-teal transition-colors">
        <SendIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-white border border-ink shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-evidence">
            <p className="font-display font-bold text-sm">Messages</p>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-slate hover:text-ink transition-colors">
              &times;
            </button>
          </div>
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-xs text-slate">No messages yet.</p>
            <p className="font-mono text-[11px] text-slate/60 mt-1">Direct messages are coming soon.</p>
          </div>
        </div>
      )}
    </div>
  )
}
