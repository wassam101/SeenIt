'use client'
import { useState } from 'react'

export function StartEventForm({ postId, onCreated }: { postId: string; onCreated: (eventId: string) => void }) {
  const [type, setType] = useState<'discussion' | 'action'>('discussion')
  const [error, setError] = useState<string | undefined>()

  async function submit(formData: FormData) {
    const payload: Record<string, string> = {
      title: String(formData.get('title')),
      type,
    }
    const description = formData.get('description')
    if (description) payload.description = String(description)
    if (type === 'action') {
      payload.eventDatetime = String(formData.get('eventDatetime'))
      payload.locationLabel = String(formData.get('locationLabel'))
    }

    const res = await fetch(`/api/posts/${postId}/events`, { method: 'POST', body: JSON.stringify(payload) })
    if (!res.ok) {
      const json = await res.json()
      setError(json.error)
      return
    }
    const json = await res.json()
    onCreated(json.id)
  }

  return (
    <form action={submit} className="border-2 border-dashed border-caution bg-caution/10 px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Escalate this report</p>
      <h2 className="font-display font-bold text-lg mb-3">Start an event</h2>
      {error && <p role="alert" className="font-mono text-xs text-signal mb-3">{error}</p>}

      <label className="block mb-3">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Title</span>
        <input name="title" required className="w-full border border-evidence bg-white px-3 py-1.5 text-sm focus-visible:border-ink" />
      </label>

      <label className="block mb-3">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Description</span>
        <textarea name="description" className="w-full border border-evidence bg-white px-3 py-1.5 text-sm focus-visible:border-ink" rows={2} />
      </label>

      <fieldset className="flex gap-4 mb-3 font-mono text-xs uppercase tracking-wider">
        <label className="flex items-center gap-1.5">
          <input type="radio" name="typeChoice" checked={type === 'discussion'} onChange={() => setType('discussion')} />
          Discussion
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" name="typeChoice" checked={type === 'action'} onChange={() => setType('action')} />
          Action
        </label>
      </fieldset>

      {type === 'action' && (
        <>
          <label className="block mb-3">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Date/time</span>
            <input name="eventDatetime" type="datetime-local" required className="w-full border border-evidence bg-white px-3 py-1.5 text-sm focus-visible:border-ink" />
          </label>
          <label className="block mb-3">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Location</span>
            <input name="locationLabel" required className="w-full border border-evidence bg-white px-3 py-1.5 text-sm focus-visible:border-ink" />
          </label>
        </>
      )}

      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-teal text-paper hover:bg-signal active:bg-signal transition-colors"
      >
        Start event
      </button>
    </form>
  )
}
