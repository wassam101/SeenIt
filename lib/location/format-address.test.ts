import { describe, it, expect } from 'vitest'
import { formatAddressLabel } from './format-address'

describe('formatAddressLabel', () => {
  it('combines a named place with its neighborhood', () => {
    const result = formatAddressLabel({
      address: { shop: 'Starbucks', suburb: 'Milton' },
      display_name: 'Starbucks, 6030 Main St W, Milton, ON, Canada',
    })
    expect(result).toBe('Starbucks, Milton')
  })

  it('combines a street with its city when there is no named place', () => {
    const result = formatAddressLabel({
      address: { road: 'Peregrine Way', city: 'Milton' },
      display_name: '304 Peregrine Way, Milton, ON, Canada',
    })
    expect(result).toBe('Peregrine Way, Milton')
  })

  it('falls back to the first three parts of display_name when address fields are missing', () => {
    const result = formatAddressLabel({ display_name: '304 Peregrine Way, Milton, ON, Canada' })
    expect(result).toBe('304 Peregrine Way, Milton, ON')
  })

  it('returns null when there is nothing usable', () => {
    expect(formatAddressLabel({})).toBeNull()
  })
})
