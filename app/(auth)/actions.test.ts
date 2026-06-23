import { describe, it, expect, vi } from 'vitest'
import { signUp, requestPasswordReset } from './actions'

const resetPasswordForEmail = vi.fn(async (_email: string) => ({ error: null }))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: {
      signUp: vi.fn(async ({ email, password }) => {
        if (!email || !password) return { error: { message: 'missing fields' } }
        return { error: null, data: { user: { id: 'u1' } } }
      }),
      resetPasswordForEmail,
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

describe('requestPasswordReset', () => {
  it('sends a reset email for a provided address', async () => {
    const fd = new FormData()
    fd.set('email', 'a@example.com')
    const result = await requestPasswordReset(fd)
    expect(result.error).toBeUndefined()
    expect(resetPasswordForEmail).toHaveBeenCalledWith('a@example.com', expect.objectContaining({ redirectTo: expect.stringContaining('/reset-password') }))
  })

  it('returns an error when email is missing', async () => {
    const fd = new FormData()
    const result = await requestPasswordReset(fd)
    expect(result.error).toBeDefined()
  })
})
