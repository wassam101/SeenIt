import { describe, it, expect, vi } from 'vitest'
import { signUp } from './actions'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: {
      signUp: vi.fn(async ({ email, password }) => {
        if (!email || !password) return { error: { message: 'missing fields' } }
        return { error: null, data: { user: { id: 'u1' } } }
      }),
    },
    from: () => ({
      insert: vi.fn(async () => ({ error: null })),
    }),
  }),
}))

describe('signUp', () => {
  it('returns no error on valid signup', async () => {
    const fd = new FormData()
    fd.set('email', 'a@example.com')
    fd.set('password', 'password123')
    fd.set('displayName', 'Alice')
    const result = await signUp(fd)
    expect(result.error).toBeUndefined()
  })

  it('returns an error when email is missing', async () => {
    const fd = new FormData()
    fd.set('password', 'password123')
    fd.set('displayName', 'Alice')
    const result = await signUp(fd)
    expect(result.error).toBeDefined()
  })
})
