import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: { getUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
  }),
}))

const { requireUser, UnauthorizedError } = await import('./require-user')

describe('requireUser with no session', () => {
  it('throws UnauthorizedError', async () => {
    await expect(requireUser()).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
