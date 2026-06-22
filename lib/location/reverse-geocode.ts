export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) return null

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&limit=1`
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.features?.[0]?.place_name ?? null
  } catch {
    return null
  }
}
