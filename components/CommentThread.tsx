// components/CommentThread.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/Avatar'

type Comment = {
  id: string
  authorId?: string | null
  authorName: string
  authorAvatarUrl?: string | null
  body: string
  createdAt: string
}

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
          <li key={c.id} className="flex items-start gap-2 text-sm leading-snug">
            <Avatar name={c.authorName} avatarUrl={c.authorAvatarUrl} size={20} />
            <p>
              {c.authorId ? (
                <Link href={`/u/${c.authorId}`} className="font-semibold hover:text-teal">
                  {c.authorName}
                </Link>
              ) : (
                <strong className="font-semibold">{c.authorName}</strong>
              )}{' '}
              <span className="text-ink/90">{c.body}</span>
            </p>
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
          className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 bg-teal text-paper hover:bg-signal active:bg-signal transition-colors"
        >
          Post
        </button>
      </form>
    </section>
  )
}
