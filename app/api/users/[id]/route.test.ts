import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

const postsRows = Array.from({ length: 11 }, (_, i) => ({
  id: `p${i}`,
  caption: `post ${i}`,
  thumbnail_url: `https://thumb.example/${i}.jpg`,
  location_label: 'Main St',
  created_at: `2026-01-${String(11 - i).padStart(2, '0')}T00:00:00Z`,
}))

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: () => ({
    auth: { getUser: async () => ({ data: { user: null } }) },
    from: (table: string) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { id: 'u1', display_name: 'Alice', avatar_url: null, is_anonymous: false, bio: 'hi' },
                error: null,
              }),
            }),
          }),
        }
      }
      if (table === 'posts') {
        return {
          select: (_cols: string, opts?: { count?: string }) => {
            if (opts?.count) {
              return { eq: () => ({ eq: () => ({ is: async () => ({ count: 23, error: null }) }) }) }
            }
            const builder: any = {
              eq: () => builder,
              is: () => builder,
              lt: () => builder,
              order: () => builder,
              limit: async () => ({ data: postsRows, error: null }),
            }
            return builder
          },
        }
      }
      if (table === 'follows') {
        return {
          select: (_cols: string, opts?: { count?: string }) => {
            if (opts?.count) return { eq: async () => ({ count: 3, error: null }) }
            return { eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }
          },
        }
      }
      throw new Error(`unexpected table ${table}`)
    },
  }),
}))

describe('GET /api/users/:id', () => {
  it('returns the true total postsCount and a cursor for the next page', async () => {
    const res = await GET(new Request('http://localhost/api/users/u1'), { params: { id: 'u1' } })
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.postsCount).toBe(23)
    expect(json.posts).toHaveLength(11)
    expect(json.nextPostsCursor).toBe(postsRows[10].created_at)
  })
})
