import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { PostMenu } from './PostMenu'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('PostMenu', () => {
  it('shows the full Instagram-style option list', () => {
    render(<PostMenu postId="post-1" authorId="author-1" onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    ;['Report', 'Unfollow', 'Add to favorites', 'About this account', 'Go to post', 'Share to…', 'Copy link', 'Embed'].forEach(
      (label) => expect(screen.getByText(label)).toBeTruthy()
    )
  })

  it('omits Unfollow and About this account when there is no authorId (anonymous post)', () => {
    render(<PostMenu postId="post-1" authorId={null} onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    expect(screen.queryByText('Unfollow')).toBeNull()
    expect(screen.queryByText('About this account')).toBeNull()
  })

  it('reporting drills into a reason list and submits it', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) }) as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)

    render(<PostMenu postId="post-1" authorId="author-1" onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Report'))
    fireEvent.click(screen.getByText('Spam'))

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/reports',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ targetType: 'post', targetId: 'post-1', reason: 'Spam' }) })
      )
    )
    await waitFor(() => expect(screen.getByText('Reported. Thank you.')).toBeTruthy())
  })

  it('unfollow calls the follow DELETE endpoint for the author', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ following: false }) }) as unknown as Response)
    vi.stubGlobal('fetch', fetchMock)

    render(<PostMenu postId="post-1" authorId="author-1" onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Unfollow'))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/users/author-1/follow', { method: 'DELETE' }))
  })

  it('copy link writes the current URL to the clipboard', async () => {
    const writeText = vi.fn(async () => {})
    Object.assign(navigator, { clipboard: { writeText } })

    render(<PostMenu postId="post-1" authorId="author-1" onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Copy link'))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(window.location.href))
  })

  it('go to post calls the provided callback and closes the menu', () => {
    const onGoToPost = vi.fn()
    render(<PostMenu postId="post-1" authorId="author-1" onGoToPost={onGoToPost} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Go to post'))
    expect(onGoToPost).toHaveBeenCalledTimes(1)
  })

  it('shows Edit and Delete instead of Report/Unfollow on your own post', () => {
    render(<PostMenu postId="post-1" authorId="author-1" isOwnPost onGoToPost={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    expect(screen.getByText('Edit')).toBeTruthy()
    expect(screen.getByText('Delete')).toBeTruthy()
    expect(screen.queryByText('Report')).toBeNull()
    expect(screen.queryByText('Unfollow')).toBeNull()
  })

  it('edit calls onEdit and closes the menu', () => {
    const onEdit = vi.fn()
    render(<PostMenu postId="post-1" authorId="author-1" isOwnPost onGoToPost={() => {}} onEdit={onEdit} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('delete confirms, then calls onDelete', () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    const onDelete = vi.fn()
    render(<PostMenu postId="post-1" authorId="author-1" isOwnPost onGoToPost={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('delete does nothing if the confirm dialog is dismissed', () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    const onDelete = vi.fn()
    render(<PostMenu postId="post-1" authorId="author-1" isOwnPost onGoToPost={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: 'More options' }))
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).not.toHaveBeenCalled()
  })
})
