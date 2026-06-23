import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { LandingPostsOrbit } from './LandingPostsOrbit'

afterEach(cleanup)

function makePosts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i}`,
    thumbnailUrl: `https://thumb.example/${i}.jpg`,
    caption: `post ${i}`,
  }))
}

describe('LandingPostsOrbit', () => {
  it('renders a tile per post, capped at the number of placement slots even when given more', () => {
    const { container } = render(<LandingPostsOrbit posts={makePosts(20)} />)
    const tileCount = container.querySelectorAll('img').length
    expect(tileCount).toBeGreaterThan(0)
    expect(tileCount).toBeLessThanOrEqual(13)
  })

  it('renders fewer tiles when fewer posts are available', () => {
    const { container } = render(<LandingPostsOrbit posts={makePosts(2)} />)
    expect(container.querySelectorAll('img')).toHaveLength(2)
  })

  it('is purely decorative and hidden from assistive tech', () => {
    const { container } = render(<LandingPostsOrbit posts={makePosts(3)} />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
    container.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('alt')).toBe('')
    })
  })

  it("shows each post's caption alongside its thumbnail", () => {
    const { container } = render(<LandingPostsOrbit posts={makePosts(2)} />)
    expect(container.textContent).toContain('post 0')
    expect(container.textContent).toContain('post 1')
  })

  it('omits the caption line when a post has none', () => {
    const { container } = render(
      <LandingPostsOrbit posts={[{ id: 'p0', thumbnailUrl: 'https://thumb.example/0.jpg', caption: null }]} />
    )
    expect(container.querySelectorAll('img')).toHaveLength(1)
    expect(container.textContent?.trim()).toBe('')
  })
})
