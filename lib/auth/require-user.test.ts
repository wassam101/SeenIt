import { describe, it, expect, vi } from 'vitest'
import { requireUser, UnauthorizedError } from './require-user'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: 'u1', email: 'a@example.com' } },
        error: null,
      })),
    },
  }),
}))

describe('requireUser', () => {
  it('returns the user when a session exists', async () => {
    const user = await requireUser()
    expect(user).toEqual({ id: 'u1', email: 'a@example.com' })
  })
})
