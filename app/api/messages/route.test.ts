import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'me', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      select: () => ({
        or: () => ({
          order: async () => ({
            data: [
              {
                id: 'm2',
                sender_id: 'me',
                recipient_id: 'alice',
                body: 'see you then',
                created_at: '2026-01-02T00:00:00Z',
                read_at: null,
                sender: { display_name: 'Me', avatar_url: null },
                recipient: { display_name: 'Alice', avatar_url: null },
              },
              {
                id: 'm1',
                sender_id: 'alice',
                recipient_id: 'me',
                body: 'hi there',
                created_at: '2026-01-01T00:00:00Z',
                read_at: null,
                sender: { display_name: 'Alice', avatar_url: null },
                recipient: { display_name: 'Me', avatar_url: null },
              },
            ],
            error: null,
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: { id: 'm1', sender_id: 'me', recipient_id: 'alice', body: 'hello', created_at: '2026-01-01T00:00:00Z' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('GET /api/messages', () => {
  it('collapses messages into one conversation per counterpart, newest first', async () => {
    const res = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.conversations).toEqual([
      { userId: 'alice', displayName: 'Alice', avatarUrl: null, lastMessage: 'see you then', lastMessageAt: '2026-01-02T00:00:00Z', unread: false },
    ])
  })
})

describe('POST /api/messages', () => {
  it('sends a message to the recipient', async () => {
    const res = await POST(
      new Request('http://localhost/api/messages', { method: 'POST', body: JSON.stringify({ recipientId: 'alice', body: 'hello' }) })
    )
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toMatchObject({ sender_id: 'me', recipient_id: 'alice', body: 'hello' })
  })

  it('rejects messaging yourself', async () => {
    const res = await POST(
      new Request('http://localhost/api/messages', { method: 'POST', body: JSON.stringify({ recipientId: 'me', body: 'hi' }) })
    )
    expect(res.status).toBe(400)
  })

  it('rejects an empty body', async () => {
    const res = await POST(
      new Request('http://localhost/api/messages', { method: 'POST', body: JSON.stringify({ recipientId: 'alice', body: '   ' }) })
    )
    expect(res.status).toBe(400)
  })
})
