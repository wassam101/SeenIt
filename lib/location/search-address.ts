import { formatAddressLabel } from './format-address'

const USER_AGENT = 'SeenIt (community safety app, local dev) contact: support@seenit.local'

export type AddressSuggestion = { label: string; lat: number; lng: number }

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (!query.trim()) return []

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      { headers: { 'User-Agent': USER_AGENT } }
    )
    if (!res.ok) return []
    const rows = await res.json()
    return (rows as any[]).map((row) => ({
      label: formatAddressLabel(row) ?? row.display_name,
      lat: Number(row.lat),
      lng: Number(row.lon),
    }))
  } catch {
    return []
  }
}
