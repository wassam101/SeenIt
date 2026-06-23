import { formatAddressLabel } from './format-address'

const USER_AGENT = 'SeenIt (community safety app, local dev) contact: support@seenit.local'

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { 'User-Agent': USER_AGENT } }
    )
    if (!res.ok) return null
    const json = await res.json()
    return formatAddressLabel(json)
  } catch {
    return null
  }
}
