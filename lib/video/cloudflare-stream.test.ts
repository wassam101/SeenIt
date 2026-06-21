// lib/video/cloudflare-stream.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStreamUploadUrl } from './cloudflare-stream'

beforeEach(() => {
  process.env.CF_STREAM_ACCOUNT_ID = 'acct'
  process.env.CF_STREAM_API_TOKEN = 'token'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service'
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'mapbox'
})

describe('createStreamUploadUrl', () => {
  it('requests a direct upload URL from Cloudflare Stream', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        result: { uploadURL: 'https://upload.example/abc', uid: 'cf-video-1' },
      }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await createStreamUploadUrl()

    expect(result).toEqual({ uploadUrl: 'https://upload.example/abc', videoId: 'cf-video-1' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.cloudflare.com/client/v4/accounts/acct/stream/direct_upload',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      })
    )
  })

  it('throws when Cloudflare responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })))
    await expect(createStreamUploadUrl()).rejects.toThrow(/Cloudflare Stream/)
  })
})
