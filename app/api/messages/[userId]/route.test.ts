import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

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
              { id: 'm1', sender_id: 'alice', recipient_id: 'me', body: 'hi there', created_at: '2026-01-01T00:00:00Z' },
              { id: 'm2', sender_id: 'me', recipient_id: 'alice', body: 'hey!', created_at: '2026-01-01T00:01:00Z' },
            ],
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({
            is: async () => ({ error: null }),
          }),
        }),
      }),
    }),
  }),
}))

describe('GET /api/messages/:userId', () => {
  it('returns the thread in order, flagging which messages are mine', async () => {
    const res = await GET(new Request('http://localhost/api/messages/alice'), { params: { userId: 'alice' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.messages).toEqual([
      { id: 'm1', body: 'hi there', createdAt: '2026-01-01T00:00:00Z', fromMe: false },
      { id: 'm2', body: 'hey!', createdAt: '2026-01-01T00:01:00Z', fromMe: true },
    ])
  })
})
