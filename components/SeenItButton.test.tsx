import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { SeenItButton } from './SeenItButton'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SeenItButton', () => {
  it('shows a tooltip listing who saw it on hover', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('/likes')) {
        return { ok: true, json: async () => ({ likers: [{ name: 'Alice' }, { name: 'Bob' }] }) } as Response
      }
      throw new Error(`unexpected fetch ${url}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<SeenItButton postId="post-1" initiallySeen={false} />)
    fireEvent.mouseEnter(screen.getByRole('button', { name: /SeenIt/ }))

    await waitFor(() => expect(screen.getByText('Alice, Bob')).toBeTruthy())
    expect(fetchMock).toHaveBeenCalledWith('/api/posts/post-1/likes')
  })

  it('shows "No one yet" when nobody has seen it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ likers: [] }) }) as unknown as Response)
    )

    render(<SeenItButton postId="post-1" initiallySeen={false} />)
    fireEvent.mouseEnter(screen.getByRole('button', { name: /SeenIt/ }))

    await waitFor(() => expect(screen.getByText('No one yet')).toBeTruthy())
  })

  it('does not refetch on a second hover', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ likers: [{ name: 'Alice' }] }) }) as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)

    render(<SeenItButton postId="post-1" initiallySeen={false} />)
    const button = screen.getByRole('button', { name: /SeenIt/ })
    fireEvent.mouseEnter(button)
    await waitFor(() => expect(screen.getByText('Alice')).toBeTruthy())
    fireEvent.mouseLeave(button)
    fireEvent.mouseEnter(button)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  })
})
