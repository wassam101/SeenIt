import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { LandingPage } from './LandingPage'

afterEach(cleanup)

let mockRows: { id: string; thumbnail_url: string; caption: string | null }[] = []

function chain(rows: typeof mockRows) {
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    not: () => builder,
    is: () => builder,
    order: () => builder,
    limit: async () => ({ data: rows, error: null }),
  }
  return builder
}

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    from: () => chain(mockRows),
  }),
}))

describe('LandingPage', () => {
  it('leads with the brand pitch and a primary sign-up call to action', async () => {
    mockRows = []
    render(await LandingPage())
    expect(screen.getByText(/Shared it/)).toBeTruthy()
    const signUpLink = screen.getByRole('link', { name: 'Sign up' })
    expect(signUpLink.getAttribute('href')).toBe('/signup')
  })

  it('offers a log in link for returning users', async () => {
    mockRows = []
    render(await LandingPage())
    const loginLink = screen.getByRole('link', { name: 'Log in' })
    expect(loginLink.getAttribute('href')).toBe('/login')
  })

  it('shows the latest posts drifting in the background, capped at 11', async () => {
    mockRows = Array.from({ length: 13 }, (_, i) => ({
      id: `p${i}`,
      thumbnail_url: `https://thumb.example/${i}.jpg`,
      caption: `post ${i}`,
    }))
    const { container } = render(await LandingPage())
    const tileCount = container.querySelectorAll('img').length
    expect(tileCount).toBeGreaterThan(0)
    expect(tileCount).toBeLessThanOrEqual(11)
  })
})
