'use client'
import { useState } from 'react'

const REASONS = ['Misinformation', 'Spam', 'Other']

export function ReportButton({ targetType, targetId }: { targetType: 'post' | 'comment'; targetId: string }) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-evidence text-slate hover:border-ink hover:text-ink transition-colors"
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
