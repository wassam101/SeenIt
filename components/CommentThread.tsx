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
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-2">
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
      </p>
      <ul className="flex flex-col gap-2 mb-3">
        {comments.map((c) => (
          <li key={c.id} className="text-sm leading-snug">
            <strong className="font-semibold">{c.authorName}</strong>{' '}
            <span className="text-ink/90">{c.body}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a comment"
          required
          className="flex-1 border border-evidence px-3 py-1.5 text-sm bg-white focus-visible:border-ink"
        />
        <button
          type="submit"
          className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 bg-ink text-paper hover:bg-signal transition-colors"
        >
          Post
        </button>
      </form>
    </section>
  )
}
