'use client'
import { useEffect, useRef, useState } from 'react'

const REASONS = ['Misinformation', 'Spam', 'Other']

export function ReportButton({ targetType, targetId }: { targetType: 'post' | 'comment'; targetId: string }) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

  async function submit(reason: string) {
    const res = await fetch('/api/reports', { method: 'POST', body: JSON.stringify({ targetType, targetId, reason }) })
    if (res.ok) {
      setSubmitted(true)
      setOpen(false)
    }
  }

  if (submitted) {
    return <p className="font-mono text-xs uppercase tracking-wider text-slate px-3 py-1.5">Reported. Thank you.</p>
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 transition-colors ${
          open ? 'text-signal' : 'text-teal hover:text-signal'
        }`}
      >
        ⚑ Report
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-1 z-10 bg-white border border-ink min-w-36 shadow-sm">
          {REASONS.map((reason) => (
            <li key={reason}>
              <button
                onClick={() => submit(reason)}
                className="w-full text-left font-mono text-xs px-3 py-2 hover:bg-paper transition-colors"
              >
                {reason}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
