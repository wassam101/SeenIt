'use client'
import { useEffect, useState } from 'react'

export function useCurrentLocation(): { lat: number; lng: number } | null {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setLocation(null)
    )
  }, [])

  return location
}
