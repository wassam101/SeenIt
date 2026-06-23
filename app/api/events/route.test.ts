// app/api/events/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

const memberRows = [{ event_id: 'e2' }]
const eventRows = [
  { id: 'e1', title: 'Cleanup', type: 'action', event_datetime: '2026-07-01T00:00:00Z', location_label: 'Main St', created_at: '2026-06-01T00:00:00Z' },
  { id: 'e2', title: 'Discussion', type: 'discussion', event_datetime: null, location_label: null, created_at: '2026-06-02T00:00:00Z' },
]

function chain(rows: any[]) {
  const builder: any = {
    select: () => builder,
    or: () => builder,
    in: () => builder,
    eq: () => builder,
    order: async () => ({ data: rows, error: null }),
  }
  return builder
}

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: (table: string) => (table === 'event_members' ? chain(memberRows) : chain(eventRows)),
  }),
}))

describe('GET /api/events', () => {
  it('lists events the user organizes or has joined', async () => {
    const res = await GET(new Request('http://localhost/api/events'))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.events).toHaveLength(2)
    expect(json.events[0]).toMatchObject({ id: 'e1', title: 'Cleanup', type: 'action' })
  })
})
