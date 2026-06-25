'use client'
import { useEffect, useRef, useState } from 'react'

type Message = { id: string; body: string; createdAt: string; fromMe: boolean }

export function ChatThread({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    const res = await fetch('/api/messages', { method: 'POST', body: JSON.stringify({ recipientId: userId, body: draft }) })
    if (res.ok) {
      const sent = await res.json()
      setMessages((prev) => [...prev, { id: sent.id, body: sent.body, createdAt: sent.created_at, fromMe: true }])
      setDraft('')
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-4">
        {messages.length === 0 ? (
          <p className="font-sans text-sm text-slate text-center py-6">No messages yet. Say hello.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
              <span
                className={`max-w-[75%] rounded-2xl px-4 py-2 font-sans text-sm ${
                  m.fromMe ? 'bg-teal text-white' : 'bg-evidence/10 text-ink'
                }`}
              >
                {m.body}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-evidence pt-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a private message"
          className="flex-1 border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
        />
        <button
          type="submit"
          className="font-sans text-sm font-semibold rounded-full px-4 py-2 bg-teal text-white hover:bg-signal transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}
