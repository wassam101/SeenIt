// components/CommentThread.tsx
'use client'
import { useEffect, useState } from 'react'

type Comment = { id: string; authorName: string; body: string; createdAt: string }

export function CommentThread({ postId, eventId }: { postId?: string; eventId?: string }) {
  const base = postId ? `/api/posts/${postId}/comments` : `/api/events/${eventId}/comments`
  const [comments, setComments] = useState<Comment[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    fetch(base).then((res) => res.json()).then((data) => setComments(data.comments))
  }, [base])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(base, { method: 'POST', body: JSON.stringify({ body: draft }) })
    if (res.ok) {
      const comment = await res.json()
      setComments((prev) => [...prev, { ...comment, authorName: 'You' }])
      setDraft('')
    }
  }

  return (
    <section>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.authorName}:</strong> {c.body}
          </li>
        ))}
      </ul>
      <form onSubmit={submit}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment" required />
        <button type="submit">Post</button>
      </form>
    </section>
  )
}
