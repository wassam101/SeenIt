'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MoreIcon } from '@/components/icons/More'

const REPORT_REASONS = ['Misinformation', 'Spam', 'Other']

export function PostMenu({
  postId,
  authorId,
  isOwnPost,
  onGoToPost,
  onEdit,
  onDelete,
}: {
  postId: string
  authorId?: string | null
  isOwnPost?: boolean
  onGoToPost: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'menu' | 'report'>('menu')
  const [status, setStatus] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setMode('menu')
        setStatus(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function toggleOpen(e: React.MouseEvent) {
    e.stopPropagation()
    setOpen((v) => !v)
    setMode('menu')
    setStatus(null)
  }

  async function submitReport(reason: string) {
    const res = await fetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify({ targetType: 'post', targetId: postId, reason }),
    })
    setStatus(res.ok ? 'Reported. Thank you.' : 'Could not report, please try again.')
    setTimeout(() => setOpen(false), 1200)
  }

  async function unfollow(e: React.MouseEvent) {
    e.stopPropagation()
    if (!authorId) return
    await fetch(`/api/users/${authorId}/follow`, { method: 'DELETE' })
    setStatus('Unfollowed.')
    setTimeout(() => setOpen(false), 900)
  }

  async function copyLink(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(window.location.href)
    setStatus('Link copied.')
    setTimeout(() => setOpen(false), 900)
  }

  async function shareTo(e: React.MouseEvent) {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({ url: window.location.href })
      } catch {
        // user dismissed the native share sheet — not an error
      }
      setOpen(false)
    } else {
      copyLink(e)
    }
  }

  function goToPost(e: React.MouseEvent) {
    e.stopPropagation()
    onGoToPost()
    setOpen(false)
  }

  function editPost(e: React.MouseEvent) {
    e.stopPropagation()
    onEdit?.()
    setOpen(false)
  }

  function deletePost(e: React.MouseEvent) {
    e.stopPropagation()
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    onDelete?.()
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={toggleOpen}
        aria-label="More options"
        className="px-2.5 py-1.5 text-slate hover:text-ink transition-colors"
      >
        <MoreIcon className="h-6 w-6" />
      </button>
      {open && (
        <ul className="absolute right-0 top-full mt-1 z-20 bg-paper border border-ink min-w-48 shadow-lg font-sans text-[15px]">
          {status ? (
            <li className="px-4 py-3 text-slate">{status}</li>
          ) : mode === 'report' ? (
            REPORT_REASONS.map((reason) => (
              <li key={reason} className="border-b border-evidence last:border-b-0">
                <button
                  onClick={() => submitReport(reason)}
                  className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-signal"
                >
                  {reason}
                </button>
              </li>
            ))
          ) : (
            <>
              {isOwnPost && (
                <li className="border-b border-evidence">
                  <button onClick={editPost} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-ink">
                    Edit
                  </button>
                </li>
              )}
              {isOwnPost && (
                <li className="border-b border-evidence">
                  <button onClick={deletePost} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-signal">
                    Delete
                  </button>
                </li>
              )}
              {!isOwnPost && (
                <li className="border-b border-evidence">
                  <button
                    onClick={() => setMode('report')}
                    className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-signal"
                  >
                    Report
                  </button>
                </li>
              )}
              {authorId && !isOwnPost && (
                <li className="border-b border-evidence">
                  <button onClick={unfollow} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-signal">
                    Unfollow
                  </button>
                </li>
              )}
              <li className="border-b border-evidence">
                <span className="block px-4 py-2.5 text-slate/40 cursor-default">Add to favorites</span>
              </li>
              {authorId && (
                <li className="border-b border-evidence">
                  <Link
                    href={`/u/${authorId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block px-4 py-2.5 hover:bg-paper transition-colors text-ink"
                  >
                    About this account
                  </Link>
                </li>
              )}
              <li className="border-b border-evidence">
                <button onClick={goToPost} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-ink">
                  Go to post
                </button>
              </li>
              <li className="border-b border-evidence">
                <button onClick={shareTo} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-ink">
                  Share to&hellip;
                </button>
              </li>
              <li className="border-b border-evidence">
                <button onClick={copyLink} className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-ink">
                  Copy link
                </button>
              </li>
              <li>
                <span className="block px-4 py-2.5 text-slate/40 cursor-default">Embed</span>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  )
}
