// app/api/reports/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      insert: (row: any) => ({
        select: () => ({ single: async () => ({ data: { id: 'report-1' }, error: null }) }),
      }),
    }),
  }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/reports', { method: 'POST', body: JSON.stringify(body) })
}

describe('POST /api/reports', () => {
  it('creates a report for a post', async () => {
    const res = await POST(makeRequest({ targetType: 'post', targetId: 'post-1', reason: 'misinformation' }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json).toEqual({ id: 'report-1' })
  })

  it('rejects an invalid targetType', async () => {
    const res = await POST(makeRequest({ targetType: 'user', targetId: 'u2', reason: 'spam' }))
    expect(res.status).toBe(400)
  })

  it('rejects a missing reason', async () => {
    const res = await POST(makeRequest({ targetType: 'post', targetId: 'post-1' }))
    expect(res.status).toBe(400)
  })
})
