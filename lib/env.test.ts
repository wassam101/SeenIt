import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getEnv } from './env'

describe('getEnv', () => {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'service-key',
    CF_STREAM_ACCOUNT_ID: 'acct',
    CF_STREAM_API_TOKEN: 'token',
    NEXT_PUBLIC_MAPBOX_TOKEN: 'mapbox-token',
  }
  const originalEnv = { ...process.env }

  beforeEach(() => {
    Object.assign(process.env, required)
  })
  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns parsed env when all vars are present', () => {
    const env = getEnv()
    expect(env.SUPABASE_URL).toBe('https://example.supabase.co')
    expect(env.MAPBOX_TOKEN).toBe('mapbox-token')
  })

  it('throws when a required var is missing', () => {
    delete process.env.CF_STREAM_API_TOKEN
    expect(() => getEnv()).toThrow(/CF_STREAM_API_TOKEN/)
  })
})
