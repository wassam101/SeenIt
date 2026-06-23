type NominatimAddress = {
  road?: string
  shop?: string
  amenity?: string
  neighbourhood?: string
  suburb?: string
  city?: string
  town?: string
}

type NominatimResult = {
  address?: NominatimAddress
  display_name?: string
}

export function formatAddressLabel(result: NominatimResult): string | null {
  const address = result.address
  if (address) {
    const primary = address.shop ?? address.amenity ?? address.road
    const secondary = address.suburb ?? address.neighbourhood ?? address.city ?? address.town
    if (primary && secondary) return `${primary}, ${secondary}`
    if (primary) return primary
  }
  if (result.display_name) {
    return result.display_name.split(',').slice(0, 3).join(',').trim()
  }
  return null
}
