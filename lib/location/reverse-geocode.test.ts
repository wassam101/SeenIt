import { describe, it, expect, vi, afterEach } from 'vitest'
import { reverseGeocode } from './reverse-geocode'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('reverseGeocode', () => {
  it('returns a short label built from the Nominatim response', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        address: { road: 'Main St', city: 'Milton' },
        display_name: '123 Main St, Milton, ON, Canada',
      }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await reverseGeocode(43.5, -79.9)
    expect(result).toBe('Main St, Milton')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://nominatim.openstreetmap.org/reverse'),
      expect.objectContaining({ headers: expect.objectContaining({ 'User-Agent': expect.any(String) }) })
    )
  })

  it('returns null when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })))
    const result = await reverseGeocode(43.5, -79.9)
    expect(result).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      })
    )
    const result = await reverseGeocode(43.5, -79.9)
    expect(result).toBeNull()
  })
})
