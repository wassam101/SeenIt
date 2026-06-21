'use client'
import { useState } from 'react'

const REASONS = ['Misinformation', 'Harassment', 'Spam', 'Other']

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

  if (submitted) return <p>Reported. Thank you.</p>

  return (
    <div>
      <button onClick={() => setOpen((v) => !v)}>Report</button>
      {open && (
        <ul>
          {REASONS.map((reason) => (
            <li key={reason}>
              <button onClick={() => submit(reason)}>{reason}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
