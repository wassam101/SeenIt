import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCurrentLocation } from './use-current-location'

describe('useCurrentLocation', () => {
  it('returns coordinates from the geolocation API', async () => {
    const getCurrentPosition = vi.fn((success: any) =>
      success({ coords: { latitude: 10, longitude: 20 } })
    )
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useCurrentLocation())
    await waitFor(() => expect(result.current).toEqual({ lat: 10, lng: 20 }))
  })

  it('returns null when geolocation is denied or unavailable', async () => {
    const getCurrentPosition = vi.fn((_success: any, error: any) => error(new Error('denied')))
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useCurrentLocation())
    await waitFor(() => expect(result.current).toBeNull())
  })
})
