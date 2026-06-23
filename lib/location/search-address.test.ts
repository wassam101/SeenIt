import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchAddress } from './search-address'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchAddress', () => {
  it('returns labeled suggestions with coordinates', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => [
        {
          lat: '43.50',
          lon: '-79.90',
          address: { shop: 'Starbucks', suburb: 'Milton' },
          display_name: 'Starbucks, 6030 Main St W, Milton, ON, Canada',
        },
      ],
    }))
    vi.stubGlobal('fetch', fetchMock)

    const results = await searchAddress('starbucks milton')
    expect(results).toEqual([{ label: 'Starbucks, Milton', lat: 43.5, lng: -79.9 }])
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://nominatim.openstreetmap.org/search'),
      expect.objectContaining({ headers: expect.objectContaining({ 'User-Agent': expect.any(String) }) })
    )
  })

  it('returns an empty list for a blank query without making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const results = await searchAddress('   ')
    expect(results).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns an empty list when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })))
    const results = await searchAddress('main st')
    expect(results).toEqual([])
  })

  it('returns an empty list when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      })
    )
    const results = await searchAddress('main st')
    expect(results).toEqual([])
  })
})
