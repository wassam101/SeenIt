import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

beforeEach(() => {
  process.env.CF_STREAM_WEBHOOK_SECRET = 'whsec_test'
  updateCalls.length = 0
})

const updateCalls: any[] = []
vi.mock('@/lib/supabase/server', () => ({
  createServiceSupabase: () => ({
    from: () => ({
      update: (row: any) => ({
        eq: (col: string, val: string) => {
          updateCalls.push({ row, col, val })
          return Promise.resolve({ error: null })
        },
      }),
    }),
  }),
}))

function makeRequest(body: unknown, secret = 'whsec_test') {
  return new Request('http://localhost/api/webhooks/cloudflare-stream', {
    method: 'POST',
    headers: { 'webhook-secret': secret },
    body: JSON.stringify(body),
  })
}

describe('POST /api/webhooks/cloudflare-stream', () => {
  it('marks the post ready when status is ready', async () => {
    const res = await POST(
      makeRequest({ uid: 'cf-video-1', status: { state: 'ready' }, thumbnail: 'https://thumb.example/1.jpg' })
    )
    expect(res.status).toBe(200)
    expect(updateCalls[0].row).toEqual({ status: 'ready', thumbnail_url: 'https://thumb.example/1.jpg' })
    expect(updateCalls[0]).toMatchObject({ col: 'video_id', val: 'cf-video-1' })
  })

  it('ignores non-ready statuses without erroring', async () => {
    const res = await POST(makeRequest({ uid: 'cf-video-1', status: { state: 'inprogress' } }))
    expect(res.status).toBe(200)
    expect(updateCalls.length).toBe(0)
  })

  it('rejects requests with the wrong secret', async () => {
    const res = await POST(makeRequest({ uid: 'cf-video-1', status: { state: 'ready' } }, 'wrong'))
    expect(res.status).toBe(401)
  })
})
