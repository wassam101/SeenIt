// app/api/posts/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: vi.fn(async () => ({ id: 'u1', email: 'a@example.com' })),
}))

const insertedRows: any[] = []
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => ({
      insert: (row: any) => ({
        select: () => ({
          single: async () => {
            insertedRows.push(row)
            return { data: { id: 'post-1', status: 'processing' }, error: null }
          },
        }),
      }),
    }),
  }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('POST /api/posts', () => {
  it('creates a post with status processing', async () => {
    const res = await POST(makeRequest({ videoId: 'cf-video-1', caption: 'hi' }))
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json).toEqual({ id: 'post-1', status: 'processing' })
    expect(insertedRows[0]).toMatchObject({ video_id: 'cf-video-1', caption: 'hi', author_id: 'u1', status: 'processing' })
  })

  it('returns 400 when videoId is missing', async () => {
    const res = await POST(makeRequest({ caption: 'hi' }))
    expect(res.status).toBe(400)
  })
})
