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
    <form action={submit}>
      <h2>Start an event</h2>
      {error && <p role="alert">{error}</p>}
      <label>
        Title
        <input name="title" required />
      </label>
      <label>
        Description
        <textarea name="description" />
      </label>
      <fieldset>
        <label>
          <input type="radio" name="typeChoice" checked={type === 'discussion'} onChange={() => setType('discussion')} />
          Discussion
        </label>
        <label>
          <input type="radio" name="typeChoice" checked={type === 'action'} onChange={() => setType('action')} />
          Action
        </label>
      </fieldset>
      {type === 'action' && (
        <>
          <label>
            Date/time
            <input name="eventDatetime" type="datetime-local" required />
          </label>
          <label>
            Location
            <input name="locationLabel" required />
          </label>
        </>
      )}
      <button type="submit">Start event</button>
    </form>
  )
}
