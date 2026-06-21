import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

const inserted: any[] = []
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: (table: string) => ({
      insert: (row: any) => {
        inserted.push({ table, row })
        return {
          select: () => ({
            single: async () => ({ data: { id: 'event-1', organizer_id: 'u1' }, error: null }),
          }),
        }
      },
    }),
  }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/posts/post-1/events', { method: 'POST', body: JSON.stringify(body) })
}

describe('POST /api/posts/:id/events', () => {
  it('creates a discussion event without date/location', async () => {
    const res = await POST(makeRequest({ title: 'Let\'s talk', type: 'discussion' }), { params: { id: 'post-1' } })
    expect(res.status).toBe(201)
  })

  it('rejects an action event missing date/location', async () => {
    const res = await POST(makeRequest({ title: 'Cleanup', type: 'action' }), { params: { id: 'post-1' } })
    expect(res.status).toBe(400)
  })

  it('creates an action event and auto-joins the organizer', async () => {
    const res = await POST(
      makeRequest({ title: 'Cleanup', type: 'action', eventDatetime: '2026-07-01T10:00:00Z', locationLabel: 'Park' }),
      { params: { id: 'post-1' } }
    )
    expect(res.status).toBe(201)
    expect(inserted.some((c) => c.table === 'event_members' && c.row.user_id === 'u1')).toBe(true)
  })
})
